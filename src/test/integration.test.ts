import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../api.js";
import type { Call, SuggestionModel } from "../domain.js";
import { mockClient } from "../mockClient.js";
import { OpenAIModel, ModelConfigurationError } from "../openaiModel.js";
import { sampleModel } from "../sampleModel.js";
import { validateAgentResult } from "../validate.js";

test("health, mock call and sample suggestion endpoints", async () => {
  const server = createApp(mockClient, sampleModel).listen(0);
  try {
    await new Promise<void>(resolve => server.once("listening", resolve));
    const address = server.address();
    assert(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}`;

    const health = await fetch(`${base}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok" });

    const callResponse = await fetch(`${base}/calls/mock-001`);
    assert.equal(callResponse.status, 200);
    const call = await callResponse.json() as Call;
    assert.match(call.transcript, /clicking sound/);

    for (const id of ["mock-001", "mock-002", "mock-003"]) {
      const response = await fetch(`${base}/calls/${id}/suggestions`, { method: "POST" });
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.equal(body.callId, id);
      assert.ok(body.suggestions.length > 0);
    }

    const vague = await (await fetch(`${base}/calls/mock-002/suggestions`, { method: "POST" })).json();
    assert.match(vague.summary, /not described a specific symptom/);
    const conflicting = await (await fetch(`${base}/calls/mock-003/suggestions`, { method: "POST" })).json();
    assert.match(conflicting.summary, /conflicting/);

    const missing = await fetch(`${base}/calls/unknown/suggestions`, { method: "POST" });
    assert.equal(missing.status, 404);
  } finally {
    server.close();
  }
});

test("invalid model evidence is rejected", async () => {
  const call = await mockClient.getCall("mock-001");
  assert(call);
  assert.throws(() => validateAgentResult({
    summary: "A summary", missingInformation: [],
    suggestions: [{
      kind: "question", text: "Ask something", reason: "To learn more",
      evidenceQuotes: ["The engine is overheating"]
    }]
  }, call), /Invalid suggestion response/);
});

test("the OpenAI adapter sends structured output request and parses the result", async () => {
  const call = await mockClient.getCall("mock-001");
  assert(call);
  let sent: unknown;
  const fakeFetch: typeof fetch = async (_url, init) => {
    sent = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({
      output: [{ content: [{ type: "output_text", text: JSON.stringify(await sampleModel.generate(call)) }] }]
    }), { status: 200 });
  };
  const model: SuggestionModel = new OpenAIModel("test-key", "test-model", fakeFetch);
  const result = validateAgentResult(await model.generate(call), call);
  assert.equal(result.suggestions.length, 1);
  assert.equal((sent as { store: boolean }).store, false);
  assert.equal((sent as { text: { format: { type: string } } }).text.format.type, "json_schema");
});

test("the model requires configuration", async () => {
  const call = await mockClient.getCall("mock-001");
  assert(call);
  await assert.rejects(new OpenAIModel("", "").generate(call), ModelConfigurationError);
});

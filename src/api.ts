import { createServer, type Server, type ServerResponse } from "node:http";
import type { CallSource, SuggestionModel } from "./domain.js";
import { ModelConfigurationError } from "./openaiModel.js";
import { generateSuggestions } from "./workflow.js";

function send(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

export function createApp(source: CallSource, model: SuggestionModel): Server {
  return createServer(async (request, response) => {
    const path = new URL(request.url ?? "/", "http://localhost").pathname;
    if (request.method === "GET" && path === "/health") {
      return send(response, 200, { status: "ok" });
    }

    const match = /^\/calls\/([a-zA-Z0-9-]+)(\/suggestions)?$/.exec(path);
    if (!match || (match[2] ? request.method !== "POST" : request.method !== "GET")) {
      return send(response, 404, { error: "Not found" });
    }

    try {
      if (!match[2]) {
        const call = await source.getCall(match[1]);
        return send(response, call ? 200 : 404, call ?? { error: "Call not found" });
      }
      const result = await generateSuggestions(match[1], source, model);
      return send(response, result ? 200 : 404, result ?? { error: "Call not found" });
    } catch (error) {
      if (error instanceof ModelConfigurationError) {
        return send(response, 503, { error: "AI service is not configured" });
      }
      console.error("Request failed", error);
      return send(response, 502, { error: "Suggestions unavailable" });
    }
  });
}

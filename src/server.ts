import { createApp } from "./api.js";
import { mockClient } from "./mockClient.js";
import { OpenAIModel } from "./openaiModel.js";
import { sampleModel } from "./sampleModel.js";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("PORT must be an integer between 0 and 65535");
}

const mode = process.env.AI_MODE ?? "sample";
if (mode !== "sample" && mode !== "openai") {
  throw new Error("AI_MODE must be sample or openai");
}
const server = createApp(mockClient, mode === "openai" ? new OpenAIModel() : sampleModel);

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port} (AI_MODE=${mode})`);
});

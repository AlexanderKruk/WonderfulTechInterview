# Wonderful Tech Interview: worker call assistant

A small TypeScript service demonstrating an assistant for a human worker handling customer calls about car problems. The worker reviews suggestions; the service does not contact customers or modify client systems.

## Run

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

The default `AI_MODE=sample` runs without an API key and returns fixed, reviewable suggestions. In another terminal:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/calls/mock-001
curl -X POST http://localhost:3000/calls/mock-001/suggestions
```

The mock client also has `mock-002` (vague complaint) and `mock-003` (conflicting statements). An unknown call ID returns 404. The service listens on port 3000 by default; set `PORT` to override it.

## Use the AI model

Set `AI_MODE=openai`, `OPENAI_API_KEY`, and `OPENAI_MODEL` before starting the server. For example:

```bash
AI_MODE=openai OPENAI_API_KEY=your_key OPENAI_MODEL=your_model npm run dev
```

The OpenAI adapter sends the mock transcript to the Responses API with a strict JSON schema and `store: false`. It validates the returned fields and checks that every suggestion cites an exact substring of the transcript. A missing model configuration returns 503; model failures or invalid output return 502. Do not put a real client transcript into the mock fixtures.

## Check the project

```bash
npm test
```

Tests cover the endpoints, vague and conflicting transcripts, unsupported evidence, and the model request shape without making a paid API call. `npm run build` compiles to `dist/`; `npm start` runs compiled code.

This prototype uses completed mock transcripts. It has no worker UI, live transcription, persistent storage, or real client connector yet.

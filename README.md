# Wonderful Tech Interview

A minimal TypeScript/Node.js starting point for the customer call assistant exercise.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

In another terminal, check that the server is working:

```bash
curl http://localhost:3000/health
```

Expected response: `{"status":"ok"}`.

`PORT` can be set to use a different port. `npm run build` compiles TypeScript into `dist/`; `npm start` runs the compiled server.

This first step only verifies the project setup. Mock call data, the AI integration, and worker suggestions come next.

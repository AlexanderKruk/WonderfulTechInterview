import type { AgentResult, Call, Suggestion } from "./domain.js";

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function texts(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(text);
}

function validSuggestion(value: unknown, transcript: string): value is Suggestion {
  if (!object(value)) return false;
  return (value.kind === "question" || value.kind === "action") &&
    text(value.text) && text(value.reason) && texts(value.evidenceQuotes) &&
    value.evidenceQuotes.length > 0 &&
    value.evidenceQuotes.every(quote => transcript.includes(quote));
}

export function validateAgentResult(raw: unknown, call: Call): AgentResult {
  if (!object(raw) || !text(raw.summary) || !texts(raw.missingInformation) ||
      !Array.isArray(raw.suggestions) || raw.suggestions.length > 3 ||
      !raw.suggestions.every(item => validSuggestion(item, call.transcript))) {
    throw new Error("Invalid suggestion response");
  }
  return {
    summary: raw.summary,
    missingInformation: raw.missingInformation,
    suggestions: raw.suggestions
  };
}

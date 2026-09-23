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

function validSuggestion(value: unknown, call: Call): value is Suggestion {
  if (!object(value)) return false;
  const optionId = value.repairOptionId;
  const option = call.repairOptions?.find(item => item.id === optionId);
  const validOption = optionId === null ||
    (value.kind === "action" && option !== undefined && typeof value.text === "string" &&
      value.text.includes(option.name) && value.text.includes(option.address) &&
      value.text.includes(option.appointment));
  return validOption && (value.kind === "question" || value.kind === "action") &&
    text(value.text) && text(value.reason) && texts(value.evidenceQuotes) &&
    value.evidenceQuotes.length > 0 &&
    value.evidenceQuotes.every(quote => call.transcript.includes(quote));
}

export function validateAgentResult(raw: unknown, call: Call): AgentResult {
  if (!object(raw) || !text(raw.summary) || !texts(raw.missingInformation) ||
      !Array.isArray(raw.suggestions) || raw.suggestions.length > 3 ||
      !raw.suggestions.every(item => validSuggestion(item, call))) {
    throw new Error("Invalid suggestion response");
  }
  return {
    summary: raw.summary,
    missingInformation: raw.missingInformation,
    suggestions: raw.suggestions
  };
}

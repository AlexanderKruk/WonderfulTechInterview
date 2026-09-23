import type { CallSource, SuggestionModel, SuggestionsResponse } from "./domain.js";
import { validateAgentResult } from "./validate.js";

export async function generateSuggestions(
  callId: string,
  source: CallSource,
  model: SuggestionModel
): Promise<SuggestionsResponse | undefined> {
  const call = await source.getCall(callId);
  if (!call) return undefined;
  const raw = await model.generate(call);
  return { callId: call.id, ...validateAgentResult(raw, call) };
}

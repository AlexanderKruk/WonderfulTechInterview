export type Call = {
  id: string;
  transcript: string;
  vehicle?: string;
  callDate?: string;
  repairOptions?: RepairOption[];
};

export type RepairOption = {
  id: string;
  name: string;
  area: string;
  address: string;
  appointment: string;
  acceptsTowedCars: boolean;
};

export type Suggestion = {
  kind: "question" | "action";
  text: string;
  reason: string;
  evidenceQuotes: string[];
  repairOptionId: string | null;
};

export type AgentResult = {
  summary: string;
  missingInformation: string[];
  suggestions: Suggestion[];
};

export type SuggestionsResponse = AgentResult & { callId: string };

export interface CallSource {
  getCall(id: string): Promise<Call | undefined>;
}

export interface SuggestionModel {
  generate(call: Call): Promise<unknown>;
}

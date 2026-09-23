import type { AgentResult, Call, SuggestionModel } from "./domain.js";

const samples: Record<string, AgentResult> = {
  "mock-001": {
    summary: "Customer reports the car will not start and hears clicking when turning the key. It drove normally yesterday; they have not checked the battery.",
    missingInformation: ["Whether dashboard lights turn on", "Battery condition"],
    suggestions: [{
      kind: "question",
      text: "Do the dashboard lights turn on when you turn the key?",
      reason: "Gather another observation before drawing a conclusion.",
      evidenceQuotes: ["I hear a clicking sound"]
    }]
  },
  "mock-002": {
    summary: "Customer says the car sometimes feels different but has not described a specific symptom.",
    missingInformation: ["What feels different", "When it happens", "Whether any warning lights appear"],
    suggestions: [{
      kind: "question",
      text: "What exactly feels different, and when do you notice it?",
      reason: "The report is too vague to suggest a cause.",
      evidenceQuotes: ["It just feels different sometimes"]
    }]
  },
  "mock-003": {
    summary: "Customer gives conflicting descriptions of whether the car started. The sequence needs clarification.",
    missingInformation: ["Whether the car eventually started", "What happened on each attempt"],
    suggestions: [{
      kind: "question",
      text: "Could you walk me through each attempt to start the car this morning?",
      reason: "Clarify the conflicting accounts before suggesting a next action.",
      evidenceQuotes: ["It started on the second try", "it didn't start at all"]
    }]
  }
};

export const sampleModel: SuggestionModel = {
  async generate(call: Call) {
    const result = samples[call.id];
    if (!result) throw new Error("No sample response for this call");
    return result;
  }
};

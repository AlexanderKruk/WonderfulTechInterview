import type { AgentResult, Call, SuggestionModel } from "./domain.js";

const samples: Record<string, AgentResult> = {
  "mock-001": {
    summary: "Customer in Mokotów reports the car will not start and clicks when turning the key. It drove normally yesterday; they have not checked the battery. Tomorrow after 14:00 could work if the car can be towed.",
    missingInformation: ["Whether dashboard lights turn on", "Battery condition", "Whether towing is available"],
    suggestions: [{
      kind: "question",
      text: "Do the dashboard lights turn on when you turn the key?",
      reason: "Gather another observation before drawing a conclusion.",
      evidenceQuotes: ["I hear a clicking sound"],
      repairOptionId: null
    }, {
      kind: "action",
      text: "Offer Demo Mokotów Garage, ul. Przykładowa 12, Warsaw, for 24 September 2026, 15:00 Warsaw time. Confirm the slot and towing with the customer before arranging anything.",
      reason: "The mock garage is in Mokotów, has an afternoon slot, and accepts towed cars. The earlier Ochota slot does not accept towed cars.",
      evidenceQuotes: ["I'm near Metro Wilanowska in Mokotów", "Tomorrow after 14:00 works if I can get the car towed"],
      repairOptionId: "repair-mokotow"
    }]
  },
  "mock-002": {
    summary: "Customer says the car sometimes feels different but has not described a specific symptom.",
    missingInformation: ["What feels different", "When it happens", "Whether any warning lights appear"],
    suggestions: [{
      kind: "question",
      text: "What exactly feels different, and when do you notice it?",
      reason: "The report is too vague to suggest a cause.",
      evidenceQuotes: ["It just feels different sometimes"],
      repairOptionId: null
    }]
  },
  "mock-003": {
    summary: "Customer gives conflicting descriptions of whether the car started. The sequence needs clarification.",
    missingInformation: ["Whether the car eventually started", "What happened on each attempt"],
    suggestions: [{
      kind: "question",
      text: "Could you walk me through each attempt to start the car this morning?",
      reason: "Clarify the conflicting accounts before suggesting a next action.",
      evidenceQuotes: ["It started on the second try", "it didn't start at all"],
      repairOptionId: null
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

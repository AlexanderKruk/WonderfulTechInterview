import type { Call, CallSource } from "./domain.js";

const calls: Record<string, Call> = {
  "mock-001": {
    id: "mock-001",
    vehicle: "2018 hatchback; make and model unconfirmed",
    callDate: "2026-09-23",
    transcript: "Customer: My car won't start this morning. When I turn the key, I hear a clicking sound. It drove normally yesterday.\nWorker: Have you tried anything yet?\nCustomer: I tried once more, but it still just clicks. I haven't checked the battery. I'm near Metro Wilanowska in Mokotów. Tomorrow after 14:00 works if I can get the car towed.",
    repairOptions: [
      {
        id: "repair-mokotow",
        name: "Demo Mokotów Garage",
        area: "Mokotów, Warsaw",
        address: "ul. Przykładowa 12, Warsaw",
        appointment: "24 September 2026, 15:00 Warsaw time",
        acceptsTowedCars: true
      },
      {
        id: "repair-ochota",
        name: "Demo Ochota Garage",
        area: "Ochota, Warsaw",
        address: "ul. Testowa 8, Warsaw",
        appointment: "24 September 2026, 14:30 Warsaw time",
        acceptsTowedCars: false
      }
    ]
  },
  "mock-002": {
    id: "mock-002",
    transcript: "Customer: Something is wrong with my car.\nWorker: Can you describe what happens?\nCustomer: It just feels different sometimes."
  },
  "mock-003": {
    id: "mock-003",
    transcript: "Customer: The car wouldn't start this morning.\nWorker: Does it start now?\nCustomer: It started on the second try, but then I said it didn't start at all. I'm not sure what happened."
  }
};

export const mockClient: CallSource = {
  async getCall(id) {
    return calls[id];
  }
};

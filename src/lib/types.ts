export type EventFlag =
  | "constipationWatch"
  | "hydrateNow"
  | "looseStoolAlert"
  | "nocturnalEvent"
  | "bloodDetected"
  | "sensorCheck";

export interface StoolEvent {
  id: string;
  timestamp: string; // ISO string with timezone
  deviceId: string;
  bristolScore: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  color: string;
  volumeEstimate: "low" | "medium" | "high";
  hydrationIndex: number; // 0 – 1 scale
  calmModeUsed: boolean;
  flushDelaySeconds: number;
  durationSeconds: number;
  flags: EventFlag[];
  sleepImpact?: string;
  notes?: string;
}

export interface CreateStoolEventPayload {
  deviceId: string;
  bristolScore: StoolEvent["bristolScore"];
  color: string;
  volumeEstimate: StoolEvent["volumeEstimate"];
  hydrationIndex: number;
  calmModeUsed: boolean;
  flushDelaySeconds: number;
  durationSeconds: number;
  flags?: EventFlag[];
  sleepImpact?: string;
  notes?: string;
}

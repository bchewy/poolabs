import { promises as fs } from "fs";
import path from "path";
import crypto from "node:crypto";
import { CreateStoolEventPayload, StoolEvent } from "@/lib/types";

const dataPath = path.join(process.cwd(), "data", "events.json");

async function ensureDataFile() {
  try {
    await fs.access(dataPath);
  } catch {
    const seed: StoolEvent[] = [];
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export async function getEvents(): Promise<StoolEvent[]> {
  await ensureDataFile();
  const content = await fs.readFile(dataPath, "utf-8");
  const data = JSON.parse(content) as StoolEvent[];
  return data.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function addEvent(
  payload: CreateStoolEventPayload
): Promise<StoolEvent> {
  const events = await getEvents();
  const event: StoolEvent = {
    ...payload,
    id: payload.deviceId
      ? `${payload.deviceId}-${Date.now().toString(36)}-${Math.round(
          Math.random() * 1000
        )}`
      : crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    flags: payload.flags ?? [],
  };

  events.unshift(event);
  await fs.writeFile(dataPath, JSON.stringify(events, null, 2), "utf-8");
  return event;
}

export async function getEventsWithinDays(days: number): Promise<StoolEvent[]> {
  const events = await getEvents();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return events.filter(
    (event) => new Date(event.timestamp).getTime() >= cutoff
  );
}

import { NextResponse } from "next/server";
import { addEvent, getEvents } from "@/lib/data/eventsStore";
import { CreateStoolEventPayload } from "@/lib/types";

function isValidBristol(value: unknown): value is CreateStoolEventPayload["bristolScore"] {
  return typeof value === "number" && value >= 1 && value <= 7;
}

function isValidVolume(
  value: unknown
): value is CreateStoolEventPayload["volumeEstimate"] {
  return value === "low" || value === "medium" || value === "high";
}

function coerceBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "1";
  if (typeof value === "number") return value !== 0;
  return false;
}

export async function GET() {
  const events = await getEvents();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<CreateStoolEventPayload>;

  if (!payload.deviceId || typeof payload.deviceId !== "string") {
    return NextResponse.json(
      { error: "deviceId is required" },
      { status: 400 }
    );
  }

  if (!isValidBristol(payload.bristolScore)) {
    return NextResponse.json(
      { error: "bristolScore must be between 1 and 7" },
      { status: 400 }
    );
  }

  if (!payload.color || typeof payload.color !== "string") {
    return NextResponse.json(
      { error: "color is required" },
      { status: 400 }
    );
  }

  if (!isValidVolume(payload.volumeEstimate)) {
    return NextResponse.json(
      { error: "volumeEstimate must be low, medium, or high" },
      { status: 400 }
    );
  }

  const hydrationIndex = Number(payload.hydrationIndex ?? 0);
  if (Number.isNaN(hydrationIndex)) {
    return NextResponse.json(
      { error: "hydrationIndex must be numeric" },
      { status: 400 }
    );
  }

  const flushDelaySeconds = Number(payload.flushDelaySeconds ?? 0);
  const durationSeconds = Number(payload.durationSeconds ?? 0);

  const event = await addEvent({
    deviceId: payload.deviceId,
    bristolScore: payload.bristolScore,
    color: payload.color,
    volumeEstimate: payload.volumeEstimate,
    hydrationIndex: Math.max(0, Math.min(1, hydrationIndex)),
    calmModeUsed: coerceBoolean(payload.calmModeUsed),
    flushDelaySeconds: Math.max(0, Math.round(flushDelaySeconds)),
    durationSeconds: Math.max(0, Math.round(durationSeconds)),
    flags: payload.flags ?? [],
    sleepImpact: payload.sleepImpact,
    notes: payload.notes,
  });

  return NextResponse.json({ event }, { status: 201 });
}

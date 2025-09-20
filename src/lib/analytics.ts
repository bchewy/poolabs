import { StoolEvent } from "@/lib/types";

export function averageBristolScore(events: StoolEvent[]): number {
  if (events.length === 0) return 0;
  const total = events.reduce((sum, event) => sum + event.bristolScore, 0);
  return Number((total / events.length).toFixed(1));
}

export function calmModeAdoption(events: StoolEvent[]): number {
  if (events.length === 0) return 0;
  const calmUses = events.filter((event) => event.calmModeUsed).length;
  return Number(((calmUses / events.length) * 100).toFixed(0));
}

export function hydrationRiskCount(events: StoolEvent[]): number {
  return events.filter((event) => event.hydrationIndex < 0.4).length;
}

export function flagCount(events: StoolEvent[], flag: string): number {
  return events.filter((event) => event.flags.includes(flag)).length;
}

export function mostRecentEvent(events: StoolEvent[]): StoolEvent | undefined {
  if (events.length === 0) return undefined;
  return [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
}

export function bristolDistribution(
  events: StoolEvent[]
): Record<StoolEvent["bristolScore"], number> {
  const distribution: Record<StoolEvent["bristolScore"], number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  };

  events.forEach((event) => {
    distribution[event.bristolScore] += 1;
  });

  return distribution;
}

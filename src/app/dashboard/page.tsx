import Link from "next/link";
import { getEvents } from "@/lib/data/eventsStore";
import {
  averageBristolScore,
  calmModeAdoption,
  flagCount,
  hydrationRiskCount,
} from "@/lib/analytics";
import { EventTable } from "@/components/EventTable";
import { AlertPanel } from "@/components/AlertPanel";
import { EventSimulator } from "@/components/EventSimulator";
import { StatCard } from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const events = await getEvents();
  const avgBristol = averageBristolScore(events);
  const calmRate = calmModeAdoption(events);
  const hydrationRisks = hydrationRiskCount(events);
  const constipationFlags = flagCount(events, "constipationWatch");

  return (
    <div className="space-y-12">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-900/90 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Live bathroom observatory</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              Monitor stool health, hydration, and sleep disruption in real-time. Feed it with ESP32 telemetry or use the simulator to demo ingestion.
            </p>
          </div>
          <Link
            href="mailto:care@poolabs.dev"
            className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-zinc-900 shadow-lg transition hover:-translate-y-1 hover:bg-white"
          >
            Escalate to caregiver path
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Avg Bristol"
            value={avgBristol ? avgBristol.toString() : "—"}
            description="3-4 keeps gastroenterologist happy."
          />
          <StatCard
            title="Calm Mode adoption"
            value={`${calmRate}%`}
            description="Audio + breathing overlay to ease straining."
          />
          <StatCard
            title="Hydration risks"
            value={hydrationRisks.toString()}
            description="Moisture index < 40%. Suggest electrolyte boost."
          />
          <StatCard
            title="Constipation alerts"
            value={constipationFlags.toString()}
            description="Trigger fibre protocol when two in a row appear."
          />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Event log
          </h2>
          <EventTable events={events} />
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Alerts & interventions
          </h2>
          <AlertPanel events={events} />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            ESP32 simulator
          </h2>
          <EventSimulator />
        </div>
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/60 p-6 text-sm text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            API contract
          </h3>
          <p className="mt-2">
            POST <code className="rounded bg-black/10 px-1">/api/events</code>
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/90 p-4 text-xs text-emerald-200">
            {`{
  "deviceId": "poolabs-cam-01",
  "bristolScore": 4,
  "color": "mahogany",
  "volumeEstimate": "medium",
  "hydrationIndex": 0.58,
  "calmModeUsed": true,
  "flushDelaySeconds": 22,
  "durationSeconds": 160,
  "flags": ["constipationWatch"],
  "notes": "Audio cue triggered",
  "sleepImpact": "Nocturnal event linked to restless night"
}`}
          </pre>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Response → <code>{`{ event: StoolEvent }`}</code>. Extend with MQTT or Supabase if you need realtime streaming.
          </p>
        </div>
      </section>
    </div>
  );
}

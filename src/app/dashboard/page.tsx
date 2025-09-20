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
import { ImageUpload } from "@/components/ImageUpload";
import { ToolsTabs } from "@/components/ToolsTabs";
import { StatCard } from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const events = await getEvents();
  const avgBristol = averageBristolScore(events);
  const calmRate = calmModeAdoption(events);
  const hydrationRisks = hydrationRiskCount(events);
  const constipationFlags = flagCount(events, "constipationWatch");

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-emerald-200/40 bg-white/80 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur dark:border-emerald-500/30 dark:bg-emerald-950/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Bathroom health command centre
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Track stool quality, hydration risk, and sleep disruptions from anywhere. Optimised for quick mobile check-ins during the hackathon demo.
            </p>
          </div>
          <Link
            href="mailto:care@poolabs.dev"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            Notify caregiver
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Avg Bristol"
            value={avgBristol ? avgBristol.toString() : "—"}
            description="Aim for 3–4 to keep things regular."
          />
          <StatCard
            title="Calm Mode adoption"
            value={`${calmRate}%`}
            description="Audio coaching usage rate this week."
          />
          <StatCard
            title="Hydration risks"
            value={hydrationRisks.toString()}
            description="Events with low moisture index (<40%)."
          />
          <StatCard
            title="Constipation alerts"
            value={constipationFlags.toString()}
            description="Triggered when back-to-back Type 1–2 logs appear."
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Critical alerts
          </h2>
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            Auto-ranked by freshness
          </span>
        </div>
        <AlertPanel events={events} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Event log
          </h2>
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            Swipe sideways to explore
          </span>
        </div>
        <EventTable events={events} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Tools
          </h2>
          <ToolsTabs simulator={<EventSimulator />} uploader={<ImageUpload />} />
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
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

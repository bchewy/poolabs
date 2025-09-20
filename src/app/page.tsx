import Link from "next/link";
import { ArrowRight, Cpu, ShieldCheck, Sparkles } from "lucide-react";
import { getEvents } from "@/lib/data/eventsStore";
import {
  averageBristolScore,
  bristolDistribution,
  calmModeAdoption,
  flagCount,
  hydrationRiskCount,
  mostRecentEvent,
} from "@/lib/analytics";
import { StatCard } from "@/components/StatCard";

const bristolCopy: Record<number, string> = {
  1: "Severe constipation",
  2: "Constipation",
  3: "Optimal",
  4: "Optimal",
  5: "Borderline loose",
  6: "Loose stool",
  7: "Diarrhoea",
};

export default async function Home() {
  const events = await getEvents();
  const avgBristol = averageBristolScore(events);
  const calmRate = calmModeAdoption(events);
  const hydrationRisks = hydrationRiskCount(events);
  const looseAlerts = flagCount(events, "looseStoolAlert");
  const distribution = bristolDistribution(events);
  const recent = mostRecentEvent(events);

  return (
    <div className="space-y-16">
      <section className="rounded-3xl border border-white/10 bg-white/60 p-10 shadow-2xl shadow-emerald-500/10 backdrop-blur dark:border-white/5 dark:bg-zinc-900/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
              Smart sanitation · Ageing in place · Hackathon-ready
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              Watch over bowel health without watching seniors. Privacy-first analytics for the bathroom.
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Poolabs Guardian pairs an ESP32-S3 toilet-bowl camera with on-device heuristics and a Next.js control tower.
              Detect stool events, score against the Bristol scale, flag risk states, and coach caregivers in minutes — all within hackathon scope.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-1 hover:bg-emerald-700"
              >
                Open live dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:text-emerald-800 dark:bg-zinc-900 dark:text-emerald-300"
              >
                Download firmware brief
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/80 p-6 text-sm shadow-lg dark:border-white/10 dark:bg-zinc-950/60">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
              Snapshot · Latest capture
            </h3>
            {recent ? (
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Device</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{recent.deviceId}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">When</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(recent.timestamp).toLocaleString("en-SG")}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Bristol score</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {recent.bristolScore} · {bristolCopy[recent.bristolScore]}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Hydration</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {Math.round(recent.hydrationIndex * 100)}%
                  </dd>
                </div>
                {recent.flags.length > 0 ? (
                  <div className="flex items-start justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">Flags</dt>
                    <dd className="text-right text-rose-500 dark:text-rose-300">
                      {recent.flags.join(", ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-300">
                No captures yet. Pair the ESP32 rig to start the stream.
              </p>
            )}
            <div className="mt-4 flex gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <ShieldCheck className="h-4 w-4" />
              Frames processed on-device. Dashboard stores metadata only.
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Average Bristol"
            value={avgBristol ? avgBristol.toString() : "—"}
            secondary={avgBristol ? bristolCopy[Math.round(avgBristol)] : undefined}
            description="Keeps clinicians on the same page about baseline bowel health."
            icon={<Sparkles className="h-4 w-4" />}
          />
          <StatCard
            title="Calm Mode adoption"
            value={`${calmRate}%`}
            description="Shows how often the audio-breathing coach is triggered during sessions."
            icon={<Cpu className="h-4 w-4" />}
          />
          <StatCard
            title="Hydration risks"
            value={hydrationRisks.toString()}
            description="Events where moisture index fell below 40%. Drive fibre + water nudges."
          />
          <StatCard
            title="Loose stool alerts"
            value={looseAlerts.toString()}
            description="Helps caregivers act before dehydration or infection escalates."
          />
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-200/60 bg-white/70 p-10 shadow-lg dark:border-emerald-500/20 dark:bg-emerald-950/40">
        <h2 className="text-2xl font-semibold tracking-tight text-emerald-900 dark:text-emerald-100">
          End-to-end flow · Built for 48 hour hackathons
        </h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          <li className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">1. Capture discreetly</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              ESP32-S3 with OV2640 camera peers only at the waterline. PIR + audio trigger kicks the model into action while respecting dignity.
            </p>
          </li>
          <li className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. Classify + redact</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              On-board heuristics score Bristol, colour, and volume. Only metadata and alerts hit the Next.js API — zero raw frames stored.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-emerald-500 dark:text-emerald-300">
              POST /api/events · <code className="rounded bg-black/10 px-2 py-0.5 text-[10px]">hydrationIndex, bristolScore</code>
            </p>
          </li>
          <li className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">3. Coach caregivers</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Dashboard prioritises risk flags, hydration nudges, and sleep disruption correlations so care teams can intervene quickly.
            </p>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Scoring cheat sheet for judges
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Problem understanding · 20%</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Rising fall + constipation rates among seniors living alone in Singapore. Dashboard shows how stool trends map to hydration and sleep hygiene.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Innovation · 20%</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Camera-only-on-waterline + Calm Mode audio therapy + Ahma Wiki voice diaries. The mix differentiates Poolabs from typical fall detection rigs.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Technical execution · 20%</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Real API, demo data store, and a simulator to prove ingestion. Extend with MQTT or Supabase if time permits.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Impact & UX · 25%</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Clear caregiver language, hydration nudges, and privacy guardrails build trust with seniors and judges alike.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/80 p-8 shadow-xl dark:border-white/5 dark:bg-zinc-900/70">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          What you can demo next
        </h2>
        <ul className="mt-4 grid gap-4 text-sm text-zinc-600 dark:text-zinc-300 md:grid-cols-2">
          <li className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
            • Pair the ESP32 over Wi-Fi and stream JSON payloads into <code className="rounded bg-black/10 px-1">/api/events</code>.
          </li>
          <li className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
            • Run the Calm Mode playlist experiment to test whether breathing cues shorten bathroom time.
          </li>
          <li className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
            • Sync flagged events to Twilio/WhatsApp for caregiver escalations.
          </li>
          <li className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
            • Plug hydration index into your sleep tracker or Ahma Wiki story prompts.
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-200">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-white shadow-lg transition hover:-translate-y-1 hover:bg-black dark:bg-white dark:text-zinc-900"
          >
            Jump into dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="mailto:hello@poolabs.dev"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-zinc-700 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Talk to caregivers
          </a>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-zinc-300 bg-white/60 p-8 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Distribution preview
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Bristol event counts captured so far.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-7">
          {(Object.keys(distribution) as Array<keyof typeof distribution>).map((score) => (
            <div
              key={score}
              className="rounded-2xl border border-white/40 bg-white/80 p-4 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/40"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Type {score}
              </div>
              <div className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">
                {distribution[score]}
              </div>
              <div className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                {bristolCopy[Number(score)]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

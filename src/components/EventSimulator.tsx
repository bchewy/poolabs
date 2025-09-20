"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateStoolEventPayload } from "@/lib/types";

const defaults: CreateStoolEventPayload = {
  deviceId: "poolabs-cam-dev",
  bristolScore: 4,
  color: "oak brown",
  volumeEstimate: "medium",
  hydrationIndex: 0.6,
  calmModeUsed: true,
  flushDelaySeconds: 20,
  durationSeconds: 160,
  flags: [],
  notes: "Manual test log from dashboard.",
};

const bristolLabels: Record<CreateStoolEventPayload["bristolScore"], string> = {
  1: "Type 1 — Separate hard lumps",
  2: "Type 2 — Lumpy and sausage-like",
  3: "Type 3 — Cracks on surface",
  4: "Type 4 — Smooth and soft",
  5: "Type 5 — Soft blobs/clear edges",
  6: "Type 6 — Mushy consistency",
  7: "Type 7 — Liquid consistency",
};

export function EventSimulator() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<CreateStoolEventPayload>(defaults);
  const [message, setMessage] = useState<string | null>(null);

  const updateField = <K extends keyof CreateStoolEventPayload>(
    key: K,
    value: CreateStoolEventPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const randomise = () => {
    const randomBristol = Math.ceil(Math.random() * 7) as CreateStoolEventPayload["bristolScore"];
    const randomHydration = Number((Math.random() * 0.6 + 0.2).toFixed(2));
    const randomVolume = ["low", "medium", "high"][
      Math.floor(Math.random() * 3)
    ] as CreateStoolEventPayload["volumeEstimate"];

    setForm((prev) => ({
      ...prev,
      bristolScore: randomBristol,
      hydrationIndex: randomHydration,
      calmModeUsed: Math.random() > 0.5,
      volumeEstimate: randomVolume,
    }));
    setMessage("Randomised sample ready. Hit Log event.");
  };

  const submit = async () => {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Failed: ${error.error ?? "unexpected error"}`);
        return;
      }

      setMessage("Event logged. Refreshing analytics…");
      setForm({ ...defaults });
      router.refresh();
    });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/60 via-white/20 to-emerald-100/40 p-6 shadow-lg dark:border-white/5 dark:from-emerald-500/10 dark:via-zinc-900/80 dark:to-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Quick event logger</h3>
        <button
          type="button"
          onClick={randomise}
          className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm ring-1 ring-inset ring-emerald-500/20 transition hover:bg-white dark:bg-zinc-900/80 dark:text-emerald-300"
        >
          Randomise
        </button>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Simulate the ESP32 feed during your demo. Logged events flow into the analytics instantly.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Device ID
          <input
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            value={form.deviceId}
            onChange={(event) => updateField("deviceId", event.target.value)}
            placeholder="poolabs-cam-01"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Bristol score
          <select
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            value={form.bristolScore}
            onChange={(event) =>
              updateField("bristolScore", Number(event.target.value) as CreateStoolEventPayload["bristolScore"])
            }
          >
            {Object.entries(bristolLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Hydration index
          <input
            type="number"
            min={0}
            max={1}
            step="0.01"
            value={form.hydrationIndex}
            onChange={(event) => updateField("hydrationIndex", Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Volume estimate
          <select
            value={form.volumeEstimate}
            onChange={(event) =>
              updateField(
                "volumeEstimate",
                event.target.value as CreateStoolEventPayload["volumeEstimate"]
              )
            }
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Flush delay (s)
          <input
            type="number"
            min={0}
            value={form.flushDelaySeconds}
            onChange={(event) => updateField("flushDelaySeconds", Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Duration (s)
          <input
            type="number"
            min={0}
            value={form.durationSeconds}
            onChange={(event) => updateField("durationSeconds", Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Calm mode used?
          <select
            value={String(form.calmModeUsed)}
            onChange={(event) => updateField("calmModeUsed", event.target.value === "true")}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Optional flags (comma separated)
          <input
            value={form.flags?.join(",") ?? ""}
            onChange={(event) =>
              updateField(
                "flags",
                event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="constipationWatch, hydrateNow"
          />
        </label>
      </div>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Notes
        <textarea
          rows={3}
          value={form.notes ?? ""}
          onChange={(event) => updateField("notes", event.target.value)}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </label>

      {message ? (
        <div className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-300">
          {message}
        </div>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="mt-6 w-full rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-400/70"
      >
        {pending ? "Logging…" : "Log event"}
      </button>
    </div>
  );
}

import { StoolEvent } from "@/lib/types";
import { FlagBadge } from "@/components/FlagBadge";

interface AlertPanelProps {
  events: StoolEvent[];
}

const alertCopy: Record<string, { title: string; message: string }> = {
  constipationWatch: {
    title: "Constipation watch",
    message: "Three low-moisture events logged this week. Suggest fibre boost + hydration push.",
  },
  hydrateNow: {
    title: "Hydration nudge",
    message: "Hydration index dipped below 40%. Prompt follow-up with caregiver call script.",
  },
  looseStoolAlert: {
    title: "Loose stool trend",
    message: "Potential GI upset detected. Share BRAT diet tips in the app and monitor electrolyte intake.",
  },
  nocturnalEvent: {
    title: "Sleep disruption",
    message: "Overnight bathroom trip flagged. Correlate with wearable sleep score and adjust Calm Mode.",
  },
};

export function AlertPanel({ events }: AlertPanelProps) {
  const flaggedEvents = events.filter((event) => event.flags.length > 0).slice(0, 3);

  if (flaggedEvents.length === 0) {
    return (
      <div className="rounded-3xl border border-emerald-200/60 bg-emerald-100/40 p-6 text-sm text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200">
        All clear. Latest captures land inside the healthy band.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flaggedEvents.map((event) => (
        <div
          key={event.id}
          className="rounded-3xl border border-rose-200/60 bg-rose-100/40 p-6 shadow-sm dark:border-rose-400/30 dark:bg-rose-500/10"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-rose-500 dark:text-rose-300">
            Alert
            {event.flags.map((flag) => (
              <FlagBadge key={flag} label={flag} intent="alert" />
            ))}
          </div>
          <div className="mt-3 text-base font-semibold text-rose-900 dark:text-rose-200">
            {alertCopy[event.flags[0]]?.title ?? "Event flagged"}
          </div>
          <p className="mt-2 text-sm text-rose-700 dark:text-rose-200/80">
            {alertCopy[event.flags[0]]?.message ??
              "Review the latest capture in the dashboard and sync with caregiver protocol."}
          </p>
          <p className="mt-3 text-xs uppercase tracking-wide text-rose-400 dark:text-rose-300/80">
            Logged {new Date(event.timestamp).toLocaleString("en-SG")}
          </p>
        </div>
      ))}
    </div>
  );
}

import { StoolEvent } from "@/lib/types";
import { FlagBadge } from "@/components/FlagBadge";

type EventTableProps = {
  events: StoolEvent[];
};

const intl = new Intl.DateTimeFormat("en-SG", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function flagIntent(flag: string) {
  if (flag === "constipationWatch" || flag === "looseStoolAlert") return "alert";
  if (flag === "hydrateNow" || flag === "nocturnalEvent") return "info";
  return "default";
}

export function EventTable({ events }: EventTableProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/20 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
        No captures yet. Connect the ESP32 or add a manual entry to see analytics.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg dark:border-white/5 dark:bg-zinc-900/80 hidden md:block">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-zinc-950/5 text-left uppercase tracking-wide text-[11px] text-zinc-500 dark:bg-zinc-50/5 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Bristol</th>
              <th className="px-6 py-4 font-medium">Hydration</th>
              <th className="px-6 py-4 font-medium">Calm Mode</th>
              <th className="px-6 py-4 font-medium">Flags</th>
              <th className="px-6 py-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-700 dark:divide-white/10 dark:text-zinc-200">
            {events.map((event) => {
              const formattedDate = intl.format(new Date(event.timestamp));
              const hydrationPercent = Math.round(event.hydrationIndex * 100);
              return (
                <tr
                  key={event.id}
                  className="transition hover:bg-white/10 hover:backdrop-blur-sm dark:hover:bg-white/5"
                >
                  <td className="px-6 py-5 align-top font-medium text-zinc-900 dark:text-zinc-100">
                    <div>{formattedDate}</div>
                    <div className="text-xs text-zinc-400">{event.deviceId}</div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="font-semibold">{event.bristolScore}</div>
                    <div className="text-xs text-zinc-400">{event.color}</div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="font-semibold">{hydrationPercent}%</div>
                    <div className="text-xs text-zinc-400">Volume: {event.volumeEstimate}</div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    {event.calmModeUsed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                        ● Calm mode
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400">Not used</span>
                    )}
                  </td>
                  <td className="px-6 py-5 align-top space-y-2">
                    {event.flags.length === 0 ? (
                      <span className="text-xs text-zinc-400">—</span>
                    ) : (
                      event.flags.map((flag) => (
                        <FlagBadge
                          key={flag}
                          label={flag}
                          intent={flagIntent(flag)}
                        />
                      ))
                    )}
                  </td>
                  <td className="px-6 py-5 align-top text-xs text-zinc-500 dark:text-zinc-400">
                    <div>{event.notes ?? "—"}</div>
                    {event.sleepImpact ? (
                      <div className="mt-2 text-[11px] text-blue-500 dark:text-blue-300">
                        {event.sleepImpact}
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {events.map((event) => {
          const formattedDate = intl.format(new Date(event.timestamp));
          const hydrationPercent = Math.round(event.hydrationIndex * 100);

          return (
            <div
              key={event.id}
              className="rounded-3xl border border-white/10 bg-white/80 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/70"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-400">
                <span>{formattedDate}</span>
                <span className="text-emerald-600 dark:text-emerald-300">
                  Type {event.bristolScore}
                </span>
              </div>
              <div className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {event.deviceId}
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Colour</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {event.color}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Hydration</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {hydrationPercent}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Volume</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {event.volumeEstimate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Calm mode</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {event.calmModeUsed ? "Enabled" : "Not used"}
                  </span>
                </div>
              </div>

              {event.flags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.flags.map((flag) => (
                    <FlagBadge
                      key={flag}
                      label={flag}
                      intent={flagIntent(flag)}
                    />
                  ))}
                </div>
              ) : null}

              {event.notes ? (
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                  {event.notes}
                </p>
              ) : null}

              {event.sleepImpact ? (
                <p className="mt-2 text-xs font-medium text-blue-500 dark:text-blue-300">
                  {event.sleepImpact}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

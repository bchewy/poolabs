import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  secondary?: string;
  description?: string;
  icon?: ReactNode;
}

export function StatCard({
  title,
  value,
  secondary,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-zinc-900/80">
      <div className="flex items-center justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400">
        <span>{title}</span>
        {icon}
      </div>
      <div className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white">
        {value}
      </div>
      {secondary ? (
        <div className="mt-1 text-sm font-medium text-emerald-500 dark:text-emerald-400">
          {secondary}
        </div>
      ) : null}
      {description ? (
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

interface FlagBadgeProps {
  label: string;
  intent?: "default" | "alert" | "info";
}

export function FlagBadge({ label, intent = "default" }: FlagBadgeProps) {
  const colorMap = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
    alert: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colorMap[intent]}`}
    >
      {label}
    </span>
  );
}

"use client";

import { useState } from "react";

interface ToolsTabsProps {
  simulator: React.ReactNode;
  uploader: React.ReactNode;
}

export function ToolsTabs({ simulator, uploader }: ToolsTabsProps) {
  const [tab, setTab] = useState<"sim" | "upload">("sim");

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full border border-emerald-500/30 bg-white/70 p-1 text-sm shadow-sm dark:border-emerald-500/30 dark:bg-zinc-900/50">
        <button
          type="button"
          onClick={() => setTab("sim")}
          className={`rounded-full px-4 py-2 font-medium transition ${
            tab === "sim"
              ? "bg-emerald-600 text-white shadow"
              : "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300"
          }`}
        >
          Simulator
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`rounded-full px-4 py-2 font-medium transition ${
            tab === "upload"
              ? "bg-emerald-600 text-white shadow"
              : "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300"
          }`}
        >
          Upload image
        </button>
      </div>

      {tab === "sim" ? simulator : uploader}
    </div>
  );
}



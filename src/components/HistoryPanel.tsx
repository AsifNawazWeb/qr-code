"use client";

import { contentLabel } from "@/lib/qr/types";
import { useQrStore } from "@/lib/store";
import { Button, Card } from "./ui";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function HistoryPanel() {
  const history = useQrStore((state) => state.history);
  const loadEntry = useQrStore((state) => state.loadEntry);
  const deleteEntry = useQrStore((state) => state.deleteEntry);
  const clearHistory = useQrStore((state) => state.clearHistory);

  return (
    <Card
      title="History"
      description="Saved codes live in this browser only."
      actions={
        history.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            className="px-2.5 py-1.5 text-xs"
            onClick={clearHistory}
          >
            Clear all
          </Button>
        ) : null
      }
    >
      {history.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-400">
          Nothing saved yet. Use “Save to history” next to the preview.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-800">{entry.name}</p>
                <p className="text-xs text-zinc-500">
                  {contentLabel(entry.config.content.type)} · {formatDate(entry.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  onClick={() => loadEntry(entry.id)}
                >
                  Load
                </Button>
                <button
                  type="button"
                  aria-label={`Delete ${entry.name}`}
                  onClick={() => deleteEntry(entry.id)}
                  className="rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

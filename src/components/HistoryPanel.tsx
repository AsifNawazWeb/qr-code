"use client";

import { contentLabel } from "@/lib/qr/types";
import { useQrStore } from "@/lib/store";
import { Button, Card, IconButton } from "./ui";

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
        <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-subtle">
          Nothing saved yet. Use “Save to history” next to the preview.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 transition hover:border-border-strong hover:bg-surface-muted"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{entry.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted ring-1 ring-border">
                    {contentLabel(entry.config.content.type)}
                  </span>
                  {formatDate(entry.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2.5 py-1 text-xs"
                  onClick={() => loadEntry(entry.id)}
                >
                  Load
                </Button>
                <IconButton
                  type="button"
                  aria-label={`Delete ${entry.name}`}
                  onClick={() => deleteEntry(entry.id)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

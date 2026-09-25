"use client";

import { useSyncExternalStore } from "react";
import ContentPanel from "./ContentPanel";
import DesignPanel from "./DesignPanel";
import DownloadPanel from "./DownloadPanel";
import HistoryPanel from "./HistoryPanel";
import PreviewPanel from "./PreviewPanel";
import ThemeToggle from "./ThemeToggle";

function ShellSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-4 pb-16 sm:px-6">
      <div className="-mx-4 flex items-center gap-3 border-b border-border/70 px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="h-10 w-10 rounded-xl bg-surface-muted" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-4 w-40 rounded-md bg-surface-muted" />
          <div className="h-3 w-64 rounded-md bg-surface-muted" />
        </div>
        <div className="h-9 w-9 rounded-xl bg-surface-muted" />
      </div>
      <div className="grid gap-6 pt-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-6">
          <div className="h-72 rounded-2xl bg-surface-muted" />
          <div className="h-96 rounded-2xl bg-surface-muted" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-[440px] rounded-2xl bg-surface-muted" />
          <div className="h-72 rounded-2xl bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}

const emptySubscribe = () => () => {};

function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function GeneratorShell() {
  const mounted = useHydrated();

  if (!mounted) return <ShellSkeleton />;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <header className="sticky top-0 z-30 -mx-4 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <path d="M14 14h3v3h-3zM20 17v4h-4M17 14h4" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              QR Code Studio
            </h1>
            <p className="truncate text-sm text-muted">
              Design custom QR codes and download them in seconds.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid gap-6 pt-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-6">
          <ContentPanel />
          <DesignPanel />
          <HistoryPanel />
        </div>
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <PreviewPanel />
          <DownloadPanel />
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-subtle">
        Everything runs locally in your browser — no content is uploaded anywhere.
      </footer>
    </div>
  );
}

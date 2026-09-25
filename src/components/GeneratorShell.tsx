"use client";

import { useSyncExternalStore } from "react";
import ContentPanel from "./ContentPanel";
import DesignPanel from "./DesignPanel";
import DownloadPanel from "./DownloadPanel";
import HistoryPanel from "./HistoryPanel";
import PreviewPanel from "./PreviewPanel";

function ShellSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-8 h-10 w-72 rounded-xl bg-zinc-200" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-6">
          <div className="h-72 rounded-2xl bg-zinc-200" />
          <div className="h-96 rounded-2xl bg-zinc-200" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-[440px] rounded-2xl bg-zinc-200" />
          <div className="h-72 rounded-2xl bg-zinc-200" />
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
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
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
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            QR Code Studio
          </h1>
          <p className="text-sm text-zinc-500">
            Design custom QR codes and download them in seconds.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-6">
          <ContentPanel />
          <DesignPanel />
          <HistoryPanel />
        </div>
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <PreviewPanel />
          <DownloadPanel />
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-zinc-400">
        Everything runs locally in your browser — no content is uploaded anywhere.
      </footer>
    </div>
  );
}

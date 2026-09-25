"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/lib/qr/options";
import type { QrDesign } from "@/lib/qr/types";
import { cn } from "@/lib/utils";

const PREVIEW_SIZE = 320;

export default function QRPreview({ data, design }: { data: string; design: QrDesign }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const optionsRef = useRef<ReturnType<typeof buildQrOptions> | null>(null);
  const [renderedData, setRenderedData] = useState<string | null>(null);

  const options = useMemo(() => buildQrOptions(data, design, PREVIEW_SIZE), [data, design]);

  useEffect(() => {
    optionsRef.current = options;

    if (!data) {
      qrRef.current = null;
      containerRef.current?.replaceChildren();
      return;
    }

    let cancelled = false;

    const run = async () => {
      if (!qrRef.current) {
        const { default: QrCodeStyling } = await import("qr-code-styling");
        if (cancelled || !containerRef.current) return;
        const instance = new QrCodeStyling(optionsRef.current ?? undefined);
        instance.append(containerRef.current);
        qrRef.current = instance;
        if (!cancelled) setRenderedData(data);
        return;
      }
      qrRef.current.update(optionsRef.current ?? undefined);
      if (!cancelled) setRenderedData(data);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [data, options]);

  const showQr = Boolean(data) && renderedData === data;

  return (
    <div className="flex min-h-[280px] items-center justify-center">
      <div
        ref={containerRef}
        className={cn(
          showQr
            ? "w-full max-w-[280px] animate-fade-in overflow-hidden rounded-xl [&>canvas]:h-auto [&>canvas]:w-full [&>svg]:h-auto [&>svg]:w-full"
            : "hidden",
          design.transparentBackground && "qr-checkerboard",
        )}
      />
      {!data ? (
        <p className="max-w-[220px] text-center text-sm text-subtle">
          Enter content to generate a QR code
        </p>
      ) : null}
      {data && !showQr ? (
        <p className="animate-pulse text-sm text-subtle">Rendering…</p>
      ) : null}
    </div>
  );
}

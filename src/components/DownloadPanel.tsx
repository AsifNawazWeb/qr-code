"use client";

import { useMemo, useState } from "react";
import { encodeContent } from "@/lib/qr/encoders";
import { EXPORT_FORMATS, EXPORT_SIZES, exportQr, type ExportFormat } from "@/lib/qr/export";
import { useQrStore } from "@/lib/store";
import { cn, sanitizeFilename } from "@/lib/utils";
import { Button, Card, Field, Select, TextInput } from "./ui";

const FORMAT_META: Record<ExportFormat, { short: string; kind: string }> = {
  png: { short: "PNG", kind: "Raster" },
  svg: { short: "SVG", kind: "Vector" },
  jpeg: { short: "JPEG", kind: "Raster" },
  pdf: { short: "PDF", kind: "Print" },
};

export default function DownloadPanel() {
  const content = useQrStore((state) => state.drafts[state.activeType]);
  const design = useQrStore((state) => state.design);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [size, setSize] = useState(1024);
  const [filename, setFilename] = useState("qrcode");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = useMemo(() => encodeContent(content), [content]);
  const formatInfo = EXPORT_FORMATS.find((entry) => entry.value === format) ?? EXPORT_FORMATS[0];
  const safeName = sanitizeFilename(filename) || "qrcode";
  const canExport = data.length > 0 && !busy;

  const handleExport = async () => {
    if (!data) return;
    setError(null);
    setBusy(true);
    try {
      await exportQr({ data, design, format, size, filename });
    } catch {
      setError("Something went wrong while creating the file. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Download" description="Files are generated locally in your browser.">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Format</span>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Export format">
            {EXPORT_FORMATS.map((entry) => {
              const meta = FORMAT_META[entry.value];
              const active = entry.value === format;
              return (
                <button
                  key={entry.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setFormat(entry.value)}
                  className={cn(
                    "flex flex-col items-start rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",
                    active
                      ? "border-accent bg-surface-muted"
                      : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted/60",
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">{meta.short}</span>
                  <span className="text-xs text-muted">{meta.kind}</span>
                </button>
              );
            })}
          </div>
        </div>

        {format !== "svg" ? (
          <Field
            label={format === "pdf" ? "QR size" : "Resolution"}
            hint={
              format === "pdf"
                ? "Printed at 100% this is roughly 300 DPI."
                : "Larger sizes look sharper when printed."
            }
          >
            <Select
              value={String(size)}
              onChange={(value) => setSize(Number(value))}
              options={EXPORT_SIZES.map((entry) => ({
                value: String(entry),
                label: `${entry} × ${entry} px`,
              }))}
            />
          </Field>
        ) : null}

        <Field label="File name" hint={`Saves as ${safeName}.${formatInfo.extension}`}>
          <TextInput
            value={filename}
            onChange={(event) => setFilename(event.target.value)}
            placeholder="qrcode"
          />
        </Field>

        <Button type="button" onClick={handleExport} disabled={!canExport}>
          {busy ? "Preparing…" : `Download ${formatInfo.extension.toUpperCase()}`}
        </Button>

        {!data ? (
          <p className="text-xs text-muted">
            Add content in the Content panel to enable downloading.
          </p>
        ) : null}
        {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
      </div>
    </Card>
  );
}

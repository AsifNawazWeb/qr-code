import { sanitizeFilename } from "@/lib/utils";
import { buildQrOptions } from "./options";
import type { QrDesign } from "./types";

export type ExportFormat = "png" | "svg" | "jpeg" | "pdf";

export const EXPORT_FORMATS: { value: ExportFormat; label: string; extension: string }[] = [
  { value: "png", label: "PNG (raster)", extension: "png" },
  { value: "svg", label: "SVG (vector)", extension: "svg" },
  { value: "jpeg", label: "JPEG (raster)", extension: "jpeg" },
  { value: "pdf", label: "PDF (for print)", extension: "pdf" },
];

export const EXPORT_SIZES = [256, 512, 1024, 2048];

export interface ExportOptions {
  data: string;
  design: QrDesign;
  format: ExportFormat;
  size: number;
  filename: string;
}

export async function exportQr(options: ExportOptions): Promise<void> {
  const { data, design, format, size, filename } = options;
  if (!data) throw new Error("There is no content to export.");

  const name = sanitizeFilename(filename) || "qrcode";

  if (format === "pdf") {
    await exportPdf(data, design, size, name);
    return;
  }

  const { default: QRCodeStyling } = await import("qr-code-styling");
  const qr = new QRCodeStyling({
    ...buildQrOptions(data, design, size, format === "svg" ? "svg" : "canvas"),
    ...(format === "jpeg" ? { backgroundOptions: { color: "#ffffff" } } : {}),
  });
  await qr.download({ name, extension: format });
}

async function exportPdf(
  data: string,
  design: QrDesign,
  size: number,
  name: string,
): Promise<void> {
  const { default: QRCodeStyling } = await import("qr-code-styling");
  const { PDFDocument } = await import("pdf-lib");

  const qr = new QRCodeStyling({
    ...buildQrOptions(data, design, size, "canvas"),
    backgroundOptions: { color: "#ffffff" },
  });

  const raw = await qr.getRawData("png");
  if (!raw) throw new Error("Unable to render the QR code.");

  const bytes =
    raw instanceof Blob ? new Uint8Array(await raw.arrayBuffer()) : new Uint8Array(raw);

  const pdf = await PDFDocument.create();
  const image = await pdf.embedPng(bytes);

  const pointsPerPixel = 72 / 300;
  const qrWidth = size * pointsPerPixel;
  const qrHeight = size * pointsPerPixel;
  const margin = 24;

  const page = pdf.addPage([qrWidth + margin * 2, qrHeight + margin * 2]);
  page.drawImage(image, { x: margin, y: margin, width: qrWidth, height: qrHeight });

  const pdfBytes = await pdf.save();
  downloadBlob(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }), `${name}.pdf`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

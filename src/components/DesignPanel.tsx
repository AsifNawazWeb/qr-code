"use client";

import { useState, type ChangeEvent } from "react";
import {
  CORNER_DOT_STYLES,
  CORNER_SQUARE_STYLES,
  DOT_STYLES,
  ERROR_CORRECTION_LEVELS,
  type CornerDotStyle,
  type CornerSquareStyle,
  type DotStyle,
  type ErrorCorrectionLevel,
  type GradientType,
} from "@/lib/qr/types";
import { useQrStore } from "@/lib/store";
import { contrastRatio } from "@/lib/utils";
import { Button, Card, ColorField, Field, Notice, RangeField, Select, Toggle } from "./ui";

const MAX_LOGO_BYTES = 512 * 1024;

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
      {children}
    </h3>
  );
}

export default function DesignPanel() {
  const design = useQrStore((state) => state.design);
  const updateDesign = useQrStore((state) => state.updateDesign);
  const [logoError, setLogoError] = useState<string | null>(null);

  const background = design.transparentBackground ? "#ffffff" : design.bgColor;
  const ratio = Math.min(
    contrastRatio(design.fgColor, background),
    design.useGradient ? contrastRatio(design.fgColor2, background) : Number.POSITIVE_INFINITY,
  );
  const lowContrast = ratio < 3;
  const needsHigherCorrection = Boolean(design.logo) && design.errorCorrectionLevel !== "H";

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Please choose an image file.");
      return;
    }
    setLogoError(
      file.size > MAX_LOGO_BYTES
        ? "Large logos may exceed what browser storage can keep. A smaller file is safer."
        : null,
    );
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      updateDesign({ logo: reader.result, errorCorrectionLevel: "H" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card title="Design" description="Make the code yours — it still scans.">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <SectionTitle>Shape</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Dots">
              <Select
                value={design.dotStyle}
                onChange={(value) => updateDesign({ dotStyle: value as DotStyle })}
                options={DOT_STYLES}
              />
            </Field>
            <Field label="Corners">
              <Select
                value={design.cornerSquareStyle}
                onChange={(value) =>
                  updateDesign({ cornerSquareStyle: value as CornerSquareStyle })
                }
                options={CORNER_SQUARE_STYLES}
              />
            </Field>
            <Field label="Corner dots">
              <Select
                value={design.cornerDotStyle}
                onChange={(value) =>
                  updateDesign({ cornerDotStyle: value as CornerDotStyle })
                }
                options={CORNER_DOT_STYLES}
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5">
          <SectionTitle>Colors</SectionTitle>
          <ColorField
            label="Foreground"
            value={design.fgColor}
            onChange={(fgColor) => updateDesign({ fgColor })}
          />
          <Toggle
            label="Gradient"
            checked={design.useGradient}
            onChange={(useGradient) => updateDesign({ useGradient })}
          />
          {design.useGradient ? (
            <div className="flex flex-col gap-3 rounded-xl bg-zinc-50 p-3">
              <ColorField
                label="Second color"
                value={design.fgColor2}
                onChange={(fgColor2) => updateDesign({ fgColor2 })}
              />
              <Field label="Gradient type">
                <Select
                  value={design.gradientType}
                  onChange={(value) => updateDesign({ gradientType: value as GradientType })}
                  options={[
                    { value: "linear", label: "Linear" },
                    { value: "radial", label: "Radial" },
                  ]}
                />
              </Field>
              <RangeField
                label="Rotation"
                value={design.gradientRotation}
                min={0}
                max={360}
                suffix="°"
                onChange={(gradientRotation) => updateDesign({ gradientRotation })}
              />
            </div>
          ) : null}
          <ColorField
            label="Background"
            value={design.bgColor}
            disabled={design.transparentBackground}
            onChange={(bgColor) => updateDesign({ bgColor })}
          />
          <Toggle
            label="Transparent background"
            checked={design.transparentBackground}
            onChange={(transparentBackground) => updateDesign({ transparentBackground })}
          />
          {lowContrast ? (
            <Notice>
              Foreground and background are too similar — scanners may struggle. Aim for
              light background and dark foreground.
            </Notice>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5">
          <SectionTitle>Options</SectionTitle>
          <Field
            label="Error correction"
            hint="Higher levels survive more damage and are required with a logo."
          >
            <Select
              value={design.errorCorrectionLevel}
              onChange={(value) =>
                updateDesign({ errorCorrectionLevel: value as ErrorCorrectionLevel })
              }
              options={ERROR_CORRECTION_LEVELS}
            />
          </Field>
          <RangeField
            label="Margin"
            value={design.margin}
            min={0}
            max={64}
            suffix="px"
            onChange={(margin) => updateDesign({ margin })}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5">
          <SectionTitle>Logo</SectionTitle>
          <div className="flex items-center gap-3">
            {design.logo ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${design.logo})` }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setLogoError(null);
                    updateDesign({ logo: null });
                  }}
                >
                  Remove logo
                </Button>
              </>
            ) : null}
            <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-300 px-3 py-2.5 text-sm text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-50">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only"
                onChange={handleLogoChange}
              />
              {design.logo ? "Replace logo" : "Upload logo"}
            </label>
          </div>
          {logoError ? <Notice>{logoError}</Notice> : null}
          {needsHigherCorrection ? (
            <Notice>
              A logo covers part of the code. Set error correction to H to keep it scannable.
            </Notice>
          ) : null}
          {design.logo ? (
            <div className="flex flex-col gap-3 rounded-xl bg-zinc-50 p-3">
              <RangeField
                label="Logo size"
                value={Math.round(design.logoSize * 100)}
                min={10}
                max={50}
                suffix="%"
                onChange={(value) => updateDesign({ logoSize: value / 100 })}
              />
              <RangeField
                label="Logo margin"
                value={design.logoMargin}
                min={0}
                max={24}
                suffix="px"
                onChange={(logoMargin) => updateDesign({ logoMargin })}
              />
              <Toggle
                label="Hide dots behind logo"
                checked={design.logoHideBackgroundDots}
                onChange={(logoHideBackgroundDots) => updateDesign({ logoHideBackgroundDots })}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

import type { Options } from "qr-code-styling";
import type { QrDesign } from "./types";

export function buildQrOptions(
  data: string,
  design: QrDesign,
  size: number,
  type: "canvas" | "svg" = "canvas",
): Partial<Options> {
  const foreground = design.useGradient
    ? {
        gradient: {
          type: design.gradientType,
          rotation: (design.gradientRotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: design.fgColor },
            { offset: 1, color: design.fgColor2 },
          ],
        },
        color: undefined,
      }
    : { color: design.fgColor, gradient: undefined };

  return {
    type,
    width: size,
    height: size,
    data,
    margin: design.margin,
    qrOptions: { errorCorrectionLevel: design.errorCorrectionLevel },
    image: design.logo ?? undefined,
    imageOptions: {
      hideBackgroundDots: design.logoHideBackgroundDots,
      imageSize: design.logoSize,
      margin: design.logoMargin,
    },
    dotsOptions: { type: design.dotStyle, ...foreground },
    cornersSquareOptions: { type: design.cornerSquareStyle, color: design.fgColor },
    cornersDotOptions: { type: design.cornerDotStyle, color: design.fgColor },
    backgroundOptions: {
      color: design.transparentBackground ? "rgba(0, 0, 0, 0)" : design.bgColor,
    },
  };
}

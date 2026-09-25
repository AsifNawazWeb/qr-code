import { describe, expect, it } from "vitest";
import { buildQrOptions } from "./options";
import { DEFAULT_DESIGN } from "./types";

describe("buildQrOptions", () => {
  it("maps design settings to qr-code-styling options", () => {
    const options = buildQrOptions("hello", DEFAULT_DESIGN, 512, "svg");
    expect(options.type).toBe("svg");
    expect(options.width).toBe(512);
    expect(options.height).toBe(512);
    expect(options.data).toBe("hello");
    expect(options.margin).toBe(DEFAULT_DESIGN.margin);
    expect(options.qrOptions?.errorCorrectionLevel).toBe("Q");
    expect(options.dotsOptions?.type).toBe("square");
    expect(options.dotsOptions?.color).toBe(DEFAULT_DESIGN.fgColor);
    expect(options.dotsOptions?.gradient).toBeUndefined();
    expect(options.cornersSquareOptions?.color).toBe(DEFAULT_DESIGN.fgColor);
    expect(options.backgroundOptions?.color).toBe("#ffffff");
    expect(options.image).toBeUndefined();
  });

  it("builds a gradient with the rotation converted to radians", () => {
    const options = buildQrOptions(
      "hello",
      {
        ...DEFAULT_DESIGN,
        useGradient: true,
        gradientType: "linear",
        gradientRotation: 90,
        fgColor: "#000000",
        fgColor2: "#ffffff",
      },
      256,
    );
    expect(options.dotsOptions?.color).toBeUndefined();
    expect(options.dotsOptions?.gradient).toEqual({
      type: "linear",
      rotation: Math.PI / 2,
      colorStops: [
        { offset: 0, color: "#000000" },
        { offset: 1, color: "#ffffff" },
      ],
    });
  });

  it("marks the background transparent when requested", () => {
    const options = buildQrOptions(
      "hello",
      { ...DEFAULT_DESIGN, transparentBackground: true },
      256,
    );
    expect(options.backgroundOptions?.color).toBe("rgba(0, 0, 0, 0)");
  });

  it("passes the logo and its image options through", () => {
    const options = buildQrOptions(
      "hello",
      { ...DEFAULT_DESIGN, logo: "data:image/png;base64,abc" },
      256,
    );
    expect(options.image).toBe("data:image/png;base64,abc");
    expect(options.imageOptions).toEqual({
      hideBackgroundDots: true,
      imageSize: 0.35,
      margin: 6,
    });
  });
});

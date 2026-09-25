import { describe, expect, it } from "vitest";
import { contrastRatio, sanitizeFilename } from "./utils";

describe("sanitizeFilename", () => {
  it("removes characters that are invalid in file names", () => {
    expect(sanitizeFilename('my:qr?"code*')).toBe("my-qr-code");
  });

  it("collapses whitespace and repeated dashes", () => {
    expect(sanitizeFilename("  hello   world -- test  ")).toBe("hello-world-test");
  });

  it("returns an empty string for blank input", () => {
    expect(sanitizeFilename("   ")).toBe("");
  });
});

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  it("returns 1 for identical colors", () => {
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  });

  it("handles shorthand hex", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 1);
  });
});

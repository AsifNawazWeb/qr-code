import { describe, expect, it } from "vitest";
import {
  describeContent,
  encodeContent,
  encodeEmail,
  encodeVCard,
  encodeWifi,
  escapeVCardValue,
  escapeWifiValue,
  normalizeUrl,
} from "./encoders";
import type { VCardContent, WifiContent } from "./types";

const wifi: WifiContent = {
  type: "wifi",
  ssid: "Cafe;WiFi",
  password: 'p:a"s,s',
  encryption: "WPA",
  hidden: true,
};

const vcard: VCardContent = {
  type: "vcard",
  firstName: "Ada",
  lastName: "Lovelace",
  organization: "Analytical; Engines",
  title: "Programmer",
  phone: "+44 1234",
  email: "ada@example.com",
  website: "example.com",
  address: "12 St, London",
  note: "First\nprogrammer",
};

describe("normalizeUrl", () => {
  it("adds https when the scheme is missing", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });

  it("keeps an explicit scheme", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
    expect(normalizeUrl("mailto:ada@example.com")).toBe("mailto:ada@example.com");
  });

  it("returns an empty string for blank input", () => {
    expect(normalizeUrl("   ")).toBe("");
  });
});

describe("wifi encoders", () => {
  it("escapes reserved characters", () => {
    expect(escapeWifiValue('a\\b;c,d:e"f')).toBe('a\\\\b\\;c\\,d\\:e\\"f');
  });

  it("builds a WIFI payload", () => {
    expect(encodeWifi(wifi)).toBe(
      'WIFI:T:WPA;S:Cafe\\;WiFi;P:p\\:a\\"s\\,s;H:true;;',
    );
  });

  it("omits the password for open networks", () => {
    expect(
      encodeWifi({ type: "wifi", ssid: "Guest", password: "", encryption: "nopass", hidden: false }),
    ).toBe("WIFI:T:nopass;S:Guest;;");
  });

  it("returns an empty string without an SSID", () => {
    expect(
      encodeWifi({ type: "wifi", ssid: " ", password: "x", encryption: "WPA", hidden: false }),
    ).toBe("");
  });
});

describe("vCard encoders", () => {
  it("escapes reserved characters", () => {
    expect(escapeVCardValue("a;b,c\\d\ne")).toBe("a\\;b\\,c\\\\d\\ne");
  });

  it("builds a vCard 3.0 payload", () => {
    const result = encodeVCard(vcard);
    expect(result.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
    expect(result.endsWith("END:VCARD")).toBe(true);
    expect(result).toContain("N:Lovelace;Ada;;;");
    expect(result).toContain("FN:Ada Lovelace");
    expect(result).toContain("ORG:Analytical\\; Engines");
    expect(result).toContain("URL:https://example.com");
    expect(result).toContain("NOTE:First\\nprogrammer");
  });

  it("returns an empty string when every field is blank", () => {
    expect(encodeVCard({ ...vcard, firstName: "", lastName: "", organization: "", title: "", phone: "", email: "", website: "", address: "", note: "" })).toBe("");
  });
});

describe("contact encoders", () => {
  it("encodes email with subject and body", () => {
    expect(encodeEmail({ type: "email", to: "a@b.com", subject: "Hi there", body: "Line 1\nLine 2" })).toBe(
      "mailto:a@b.com?subject=Hi%20there&body=Line%201%0ALine%202",
    );
    expect(encodeEmail({ type: "email", to: "a@b.com", subject: "", body: "" })).toBe("mailto:a@b.com");
  });

  it("encodes SMS and phone numbers", () => {
    expect(encodeContent({ type: "sms", phone: "+15551234567", message: "Hello" })).toBe(
      "SMSTO:+15551234567:Hello",
    );
    expect(encodeContent({ type: "phone", phone: "+15551234567" })).toBe("tel:+15551234567");
    expect(encodeContent({ type: "phone", phone: "  " })).toBe("");
  });

  it("encodes URL and text content", () => {
    expect(encodeContent({ type: "url", url: "example.com" })).toBe("https://example.com");
    expect(encodeContent({ type: "text", text: "  hello  " })).toBe("hello");
  });
});

describe("describeContent", () => {
  it("summarizes each content type", () => {
    expect(describeContent({ type: "url", url: "example.com" })).toBe("https://example.com");
    expect(describeContent({ type: "wifi", ssid: "Home", password: "", encryption: "WPA", hidden: false })).toBe(
      "Wi-Fi: Home",
    );
    expect(describeContent(vcard)).toBe("Ada Lovelace");
    expect(describeContent({ type: "email", to: "a@b.com", subject: "", body: "" })).toBe("Email: a@b.com");
  });
});

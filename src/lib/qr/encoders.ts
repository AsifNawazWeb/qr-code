import type { EmailContent, QrContent, SmsContent, VCardContent, WifiContent } from "./types";

export function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return value;
  return `https://${value}`;
}

export function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function encodeWifi(wifi: WifiContent): string {
  const ssid = wifi.ssid.trim();
  if (!ssid) return "";
  const parts = [`WIFI:T:${wifi.encryption};`, `S:${escapeWifiValue(ssid)};`];
  if (wifi.encryption !== "nopass" && wifi.password) {
    parts.push(`P:${escapeWifiValue(wifi.password)};`);
  }
  if (wifi.hidden) parts.push("H:true;");
  parts.push(";");
  return parts.join("");
}

export function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function encodeVCard(card: VCardContent): string {
  const firstName = card.firstName.trim();
  const lastName = card.lastName.trim();
  const organization = card.organization.trim();
  const title = card.title.trim();
  const phone = card.phone.trim();
  const email = card.email.trim();
  const website = normalizeUrl(card.website);
  const address = card.address.trim();
  const note = card.note.trim();

  const hasContent =
    firstName ||
    lastName ||
    organization ||
    title ||
    phone ||
    email ||
    website ||
    address ||
    note;
  if (!hasContent) return "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`);
  lines.push(`FN:${escapeVCardValue(fullName || organization)}`);
  if (organization) lines.push(`ORG:${escapeVCardValue(organization)}`);
  if (title) lines.push(`TITLE:${escapeVCardValue(title)}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${escapeVCardValue(phone)}`);
  if (email) lines.push(`EMAIL:${escapeVCardValue(email)}`);
  if (website) lines.push(`URL:${escapeVCardValue(website)}`);
  if (address) lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(address)};;;;`);
  if (note) lines.push(`NOTE:${escapeVCardValue(note)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function encodeEmail(email: EmailContent): string {
  const to = email.to.trim();
  if (!to) return "";
  const subject = email.subject.trim();
  const body = email.body;
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return params.length > 0 ? `mailto:${to}?${params.join("&")}` : `mailto:${to}`;
}

export function encodeSms(sms: SmsContent): string {
  const phone = sms.phone.trim();
  if (!phone) return "";
  const message = sms.message.trim();
  return message ? `SMSTO:${phone}:${message}` : `SMSTO:${phone}`;
}

export function encodePhone(phone: string): string {
  const value = phone.trim();
  return value ? `tel:${value}` : "";
}

export function encodeContent(content: QrContent): string {
  switch (content.type) {
    case "url":
      return normalizeUrl(content.url);
    case "text":
      return content.text.trim();
    case "wifi":
      return encodeWifi(content);
    case "vcard":
      return encodeVCard(content);
    case "email":
      return encodeEmail(content);
    case "sms":
      return encodeSms(content);
    case "phone":
      return encodePhone(content.phone);
  }
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

export function describeContent(content: QrContent): string {
  switch (content.type) {
    case "url":
      return normalizeUrl(content.url) || "Website";
    case "text": {
      const text = content.text.trim().replace(/\s+/g, " ");
      return text ? truncate(text, 48) : "Text";
    }
    case "wifi":
      return content.ssid.trim() ? `Wi-Fi: ${content.ssid.trim()}` : "Wi-Fi network";
    case "vcard": {
      const name = [content.firstName, content.lastName]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ");
      return name || content.organization.trim() || "Contact card";
    }
    case "email":
      return content.to.trim() ? `Email: ${content.to.trim()}` : "Email";
    case "sms":
      return content.phone.trim() ? `SMS: ${content.phone.trim()}` : "SMS";
    case "phone":
      return content.phone.trim() ? `Call: ${content.phone.trim()}` : "Phone";
  }
}

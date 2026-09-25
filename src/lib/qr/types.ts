export type ContentType = "url" | "text" | "wifi" | "vcard" | "email" | "sms" | "phone";

export interface UrlContent {
  type: "url";
  url: string;
}

export interface TextContent {
  type: "text";
  text: string;
}

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface WifiContent {
  type: "wifi";
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface VCardContent {
  type: "vcard";
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  note: string;
}

export interface EmailContent {
  type: "email";
  to: string;
  subject: string;
  body: string;
}

export interface SmsContent {
  type: "sms";
  phone: string;
  message: string;
}

export interface PhoneContent {
  type: "phone";
  phone: string;
}

export type QrContent =
  | UrlContent
  | TextContent
  | WifiContent
  | VCardContent
  | EmailContent
  | SmsContent
  | PhoneContent;

export type DotStyle =
  | "square"
  | "dots"
  | "rounded"
  | "extra-rounded"
  | "classy"
  | "classy-rounded";

export type CornerSquareStyle = "square" | "dot" | "extra-rounded";
export type CornerDotStyle = "square" | "dot";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type GradientType = "linear" | "radial";

export interface QrDesign {
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  fgColor: string;
  fgColor2: string;
  useGradient: boolean;
  gradientType: GradientType;
  gradientRotation: number;
  bgColor: string;
  transparentBackground: boolean;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logo: string | null;
  logoSize: number;
  logoMargin: number;
  logoHideBackgroundDots: boolean;
}

export interface QrConfig {
  content: QrContent;
  design: QrDesign;
}

export interface HistoryEntry {
  id: string;
  name: string;
  createdAt: number;
  config: QrConfig;
}

export const CONTENT_TYPES: { type: ContentType; label: string }[] = [
  { type: "url", label: "URL" },
  { type: "text", label: "Text" },
  { type: "wifi", label: "Wi-Fi" },
  { type: "vcard", label: "vCard" },
  { type: "email", label: "Email" },
  { type: "sms", label: "SMS" },
  { type: "phone", label: "Phone" },
];

export function contentLabel(type: ContentType): string {
  return CONTENT_TYPES.find((entry) => entry.type === type)?.label ?? type;
}

export const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Extra rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy rounded" },
];

export const CORNER_SQUARE_STYLES: { value: CornerSquareStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
  { value: "extra-rounded", label: "Extra rounded" },
];

export const CORNER_DOT_STYLES: { value: CornerDotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
];

export const ERROR_CORRECTION_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: "L", label: "L — low (7%)" },
  { value: "M", label: "M — medium (15%)" },
  { value: "Q", label: "Q — quartile (25%)" },
  { value: "H", label: "H — high (30%)" },
];

export const DEFAULT_DESIGN: QrDesign = {
  dotStyle: "square",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
  fgColor: "#18181b",
  fgColor2: "#2563eb",
  useGradient: false,
  gradientType: "linear",
  gradientRotation: 45,
  bgColor: "#ffffff",
  transparentBackground: false,
  margin: 12,
  errorCorrectionLevel: "Q",
  logo: null,
  logoSize: 0.35,
  logoMargin: 6,
  logoHideBackgroundDots: true,
};

export const DEFAULT_DRAFTS: Record<ContentType, QrContent> = {
  url: { type: "url", url: "https://example.com" },
  text: { type: "text", text: "" },
  wifi: { type: "wifi", ssid: "", password: "", encryption: "WPA", hidden: false },
  vcard: {
    type: "vcard",
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    note: "",
  },
  email: { type: "email", to: "", subject: "", body: "" },
  sms: { type: "sms", phone: "", message: "" },
  phone: { type: "phone", phone: "" },
};

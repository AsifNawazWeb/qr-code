"use client";

import { useRef, type KeyboardEvent } from "react";
import {
  CONTENT_TYPES,
  type ContentType,
  type EmailContent,
  type PhoneContent,
  type QrContent,
  type SmsContent,
  type TextContent,
  type UrlContent,
  type VCardContent,
  type WifiContent,
  type WifiEncryption,
} from "@/lib/qr/types";
import { useQrStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Card, Field, Select, TextArea, TextInput, Toggle } from "./ui";

interface FormProps<T> {
  value: T;
  onChange: (content: QrContent) => void;
}

function UrlForm({ value, onChange }: FormProps<UrlContent>) {
  return (
    <Field label="Website URL" hint="“https://” is added automatically when missing.">
      <TextInput
        type="url"
        inputMode="url"
        placeholder="https://example.com"
        value={value.url}
        onChange={(event) => onChange({ ...value, url: event.target.value })}
      />
    </Field>
  );
}

function TextForm({ value, onChange }: FormProps<TextContent>) {
  return (
    <Field label="Text" hint={`${value.text.length} characters`}>
      <TextArea
        rows={5}
        placeholder="Any text you want to encode"
        value={value.text}
        onChange={(event) => onChange({ ...value, text: event.target.value })}
      />
    </Field>
  );
}

function WifiForm({ value, onChange }: FormProps<WifiContent>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Network name (SSID)">
          <TextInput
            placeholder="My network"
            value={value.ssid}
            onChange={(event) => onChange({ ...value, ssid: event.target.value })}
          />
        </Field>
        <Field label="Security">
          <Select
            value={value.encryption}
            onChange={(next) =>
              onChange({ ...value, encryption: next as WifiEncryption })
            }
            options={[
              { value: "WPA", label: "WPA / WPA2" },
              { value: "WEP", label: "WEP" },
              { value: "nopass", label: "None (open)" },
            ]}
          />
        </Field>
        {value.encryption !== "nopass" ? (
          <Field label="Password">
            <TextInput
              autoComplete="off"
              placeholder="Network password"
              value={value.password}
              onChange={(event) => onChange({ ...value, password: event.target.value })}
            />
          </Field>
        ) : null}
      </div>
      <Toggle
        label="Hidden network"
        checked={value.hidden}
        onChange={(hidden) => onChange({ ...value, hidden })}
      />
    </div>
  );
}

function VCardForm({ value, onChange }: FormProps<VCardContent>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="First name">
        <TextInput
          value={value.firstName}
          onChange={(event) => onChange({ ...value, firstName: event.target.value })}
        />
      </Field>
      <Field label="Last name">
        <TextInput
          value={value.lastName}
          onChange={(event) => onChange({ ...value, lastName: event.target.value })}
        />
      </Field>
      <Field label="Organization">
        <TextInput
          value={value.organization}
          onChange={(event) => onChange({ ...value, organization: event.target.value })}
        />
      </Field>
      <Field label="Job title">
        <TextInput
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
        />
      </Field>
      <Field label="Phone">
        <TextInput
          inputMode="tel"
          value={value.phone}
          onChange={(event) => onChange({ ...value, phone: event.target.value })}
        />
      </Field>
      <Field label="Email">
        <TextInput
          inputMode="email"
          value={value.email}
          onChange={(event) => onChange({ ...value, email: event.target.value })}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Website">
          <TextInput
            inputMode="url"
            placeholder="example.com"
            value={value.website}
            onChange={(event) => onChange({ ...value, website: event.target.value })}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Address">
          <TextInput
            value={value.address}
            onChange={(event) => onChange({ ...value, address: event.target.value })}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Note">
          <TextArea
            rows={3}
            value={value.note}
            onChange={(event) => onChange({ ...value, note: event.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}

function EmailForm({ value, onChange }: FormProps<EmailContent>) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Recipient">
        <TextInput
          inputMode="email"
          placeholder="hello@example.com"
          value={value.to}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
        />
      </Field>
      <Field label="Subject">
        <TextInput
          value={value.subject}
          onChange={(event) => onChange({ ...value, subject: event.target.value })}
        />
      </Field>
      <Field label="Message">
        <TextArea
          rows={4}
          value={value.body}
          onChange={(event) => onChange({ ...value, body: event.target.value })}
        />
      </Field>
    </div>
  );
}

function SmsForm({ value, onChange }: FormProps<SmsContent>) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Phone number">
        <TextInput
          inputMode="tel"
          placeholder="+1 555 123 4567"
          value={value.phone}
          onChange={(event) => onChange({ ...value, phone: event.target.value })}
        />
      </Field>
      <Field label="Message">
        <TextArea
          rows={4}
          value={value.message}
          onChange={(event) => onChange({ ...value, message: event.target.value })}
        />
      </Field>
    </div>
  );
}

function PhoneForm({ value, onChange }: FormProps<PhoneContent>) {
  return (
    <Field label="Phone number" hint="Scanning this code opens the dialer.">
      <TextInput
        inputMode="tel"
        placeholder="+1 555 123 4567"
        value={value.phone}
        onChange={(event) => onChange({ ...value, phone: event.target.value })}
      />
    </Field>
  );
}

function renderForm(content: QrContent, onChange: (content: QrContent) => void) {
  switch (content.type) {
    case "url":
      return <UrlForm value={content} onChange={onChange} />;
    case "text":
      return <TextForm value={content} onChange={onChange} />;
    case "wifi":
      return <WifiForm value={content} onChange={onChange} />;
    case "vcard":
      return <VCardForm value={content} onChange={onChange} />;
    case "email":
      return <EmailForm value={content} onChange={onChange} />;
    case "sms":
      return <SmsForm value={content} onChange={onChange} />;
    case "phone":
      return <PhoneForm value={content} onChange={onChange} />;
  }
}

export default function ContentPanel() {
  const activeType = useQrStore((state) => state.activeType);
  const content = useQrStore((state) => state.drafts[state.activeType]);
  const setActiveType = useQrStore((state) => state.setActiveType);
  const setContent = useQrStore((state) => state.setContent);
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    const tabs = Array.from(
      tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    const current = tabs.findIndex((tab) => tab.dataset.type === activeType);
    if (current === -1) return;
    event.preventDefault();
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    const type = tabs[next]?.dataset.type as ContentType | undefined;
    if (!type) return;
    setActiveType(type);
    tabs[next]?.focus();
  };

  return (
    <Card title="Content" description="Pick a type and fill in the details.">
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Content type"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface-muted/70 p-1"
      >
        {CONTENT_TYPES.map((entry) => {
          const active = entry.type === activeType;
          return (
            <button
              key={entry.type}
              type="button"
              role="tab"
              data-type={entry.type}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveType(entry.type)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",
                active
                  ? "bg-surface text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          );
        })}
      </div>
      <div className="mt-5">{renderForm(content, setContent)}</div>
    </Card>
  );
}

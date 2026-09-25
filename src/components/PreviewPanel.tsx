"use client";

import { useMemo, useState } from "react";
import { describeContent, encodeContent } from "@/lib/qr/encoders";
import { useQrStore } from "@/lib/store";
import QRPreview from "./QRPreview";
import { Button, Card } from "./ui";

export default function PreviewPanel() {
  const content = useQrStore((state) => state.drafts[state.activeType]);
  const design = useQrStore((state) => state.design);
  const saveToHistory = useQrStore((state) => state.saveToHistory);
  const [saved, setSaved] = useState(false);

  const data = useMemo(() => encodeContent(content), [content]);
  const summary = useMemo(() => describeContent(content), [content]);

  const handleSave = () => {
    saveToHistory();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card title="Preview" description="Updates live as you edit.">
      <div className="rounded-2xl border border-border bg-surface-inset p-4">
        <QRPreview data={data} design={design} />
      </div>
      <p className="mt-3 truncate text-center text-xs text-muted">
        {data ? summary : "Add content to generate a code"}
      </p>
      <Button
        type="button"
        variant="ghost"
        className="mt-4 w-full"
        onClick={handleSave}
        disabled={!data}
      >
        {saved ? "Saved to history" : "Save to history"}
      </Button>
    </Card>
  );
}

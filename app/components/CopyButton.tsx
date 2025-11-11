// app/components/CopyButton.tsx
"use client";

import { useState } from "react";

type Props = { getText: () => string };

export default function CopyButton({ getText }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      const text = getText() ?? "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore; we don’t want copy failures to break UI
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="text-xs rounded px-3 py-2 border hover:bg-gray-50 active:scale-[0.99] transition"
      aria-label="Copy to clipboard"
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

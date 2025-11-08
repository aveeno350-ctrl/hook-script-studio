'use client';

import { useState } from 'react';

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a className="underline" href={`mailto:${email}`}>{email}</a>
      <button
        onClick={copyEmail}
        className="rounded border px-3 py-1 text-sm"
        aria-live="polite"
      >
        {copied ? 'Copied!' : 'Copy email'}
      </button>
    </div>
  );
}

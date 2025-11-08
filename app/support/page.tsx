'use client';

import { useState } from 'react';

export const metadata = { title: 'Support — Hook & Script Studio' };

export default function SupportPage() {
  const email = 'aveeno350@gmail.com'; // ← replace with your real email
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Support</h1>
      <p>Need help or have a request? We’re here.</p>

      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${email}`}>{email}</a>
      </p>
      <button
        onClick={copyEmail}
        className="rounded border px-3 py-1 text-sm"
        aria-live="polite"
      >
        {copied ? 'Copied!' : 'Copy email'}
      </button>

      <h2>Common questions</h2>
      <ul>
        <li><strong>Billing/Refunds:</strong> See our <a href="/refund">Refund Policy</a>.</li>
        <li><strong>Terms & Privacy:</strong> See <a href="/terms">Terms</a> and <a href="/privacy">Privacy</a>.</li>
        <li><strong>Feature ideas / bugs:</strong> Send details (steps, screenshots) to {email}.</li>
      </ul>
    </main>
  );
}

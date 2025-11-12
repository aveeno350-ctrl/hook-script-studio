// components/UpdateBanner.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UPDATES } from "@/data/updates";

const LS_KEY = "hss_update_banner_dismissed_v1";

export default function UpdateBanner() {
  const [dismissed, setDismissed] = useState<boolean>(false);

  const latest = useMemo(() => UPDATES[0], []);
  const id = latest ? `${latest.version}-${latest.date}` : "";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { id: string };
      if (parsed?.id === id) setDismissed(true);
    } catch {/* ignore */}
  }, [id]);

  if (!latest || dismissed) return null;

  function onDismiss() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ id }));
    } catch {/* ignore */}
    setDismissed(true);
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="card mb-4 border rounded-xl px-4 py-3 flex items-center justify-between"
    >
      <div className="min-w-0">
        <div className="kicker">New update • {latest.version}</div>
        <div className="truncate">
          <span className="font-medium">{latest.title}</span>
          {latest.body ? <span className="opacity-80"> — {latest.body}</span> : null}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pl-4">
        <Link href="/changelog" className="btn btn-secondary px-3 py-2">
          Changelog
        </Link>
        <button
          type="button"
          aria-label="Dismiss update"
          onClick={onDismiss}
          className="btn btn-ghost px-3 py-2"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

export default function CopyButton({ getText }: { getText: () => string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(getText());
        setOk(true);
        setTimeout(() => setOk(false), 1200);
      }}
      className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 transition"
      aria-label="Copy output"
    >
      {ok ? "Copied!" : "Copy"}
    </button>
  );
}

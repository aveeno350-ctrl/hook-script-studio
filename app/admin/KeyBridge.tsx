// app/admin/KeyBridge.tsx
"use client";
import { useEffect } from "react";

export default function KeyBridge() {
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const raw =
      sp.get("key") || sp.get("admin_key") || sp.get("k") || "";
    const key = raw.trim();
    if (key) {
      document.cookie = `admin_key=${encodeURIComponent(key)}; path=/; max-age=${
        60 * 60 * 24 * 30
      }; samesite=lax`;
      const url = new URL(window.location.href);
      url.search = "";
      window.location.replace(url.toString());
    }
  }, []);
  return null;
}

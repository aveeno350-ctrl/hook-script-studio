// lib/metrics.ts
// No "use client" here – this file is shared by client & server.

// ---- client helper -------------------------------------------------
export function track(event: string, props: Record<string, unknown> = {}) {
  // fire and forget; won’t block UI
  try {
    const payload = JSON.stringify({ event, ...props });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/metrics/write", blob);
    } else {
      // fallback (SSR or older browsers)
      fetch("/api/metrics/write", { method: "POST", body: payload });
    }
  } catch {
    // swallow – analytics should never break UX
  }
}

// ---- server helper -------------------------------------------------
// Supports Vercel KV (preferred) or Upstash REST envs.
function getKvRest() {
  const url =
    process.env.VERCEL_KV_REST_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.VERCEL_KV_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("KV REST env vars missing");
  return { url, token };
}

/** Increment a counter key by n (default 1). */
export async function inc(key: string, n = 1): Promise<void> {
  const { url, token } = getKvRest();
  const safeKey = encodeURIComponent(key);
  const endpoint = `${url}/incrby/${safeKey}/${n}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`KV incr failed: ${res.status} ${text}`);
  }
}

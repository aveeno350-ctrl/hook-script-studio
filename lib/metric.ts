// lib/metric.ts
// No "use client" — this file is shared by client & server.

/* -------------------------------------------------------
 * Client helper: fire-and-forget analytics from the UI
 * -----------------------------------------------------*/
export function track(event: string, props: Record<string, unknown> = {}) {
  try {
    const payload = JSON.stringify({ event, ...props });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/metrics/write", blob);
    } else {
      // Fallback (SSR/older browsers)
      fetch("/api/metrics/write", { method: "POST", body: payload });
    }
  } catch {
    // Analytics must never break UX
  }
}

/* -------------------------------------------------------
 * Server helpers: use from API routes / server actions
 * Works with Vercel KV or Upstash REST envs.
 * -----------------------------------------------------*/
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

/** Convenience: record one event and any useful numeric props. */
export async function writeMetric(
  event: string,
  props: Record<string, unknown> = {}
): Promise<void> {
  // Core counters
  await inc(`evt:${event}`, 1);
  await inc("evt:_all", 1);

  // Optional dimensions
  const platform =
    typeof props.platform === "string" ? props.platform.trim() : "";
  if (platform) await inc(`evt:${event}:platform:${platform}`, 1);

  // Optional numeric aggregates (coerced to integers)
  const runs = toInt(props.runs);
  if (runs !== null) await inc("runs", runs);

  const bytes = toInt(props.content_bytes);
  if (bytes !== null) await inc("content_bytes", bytes);

  const ms = toInt(props.ms);
  if (ms !== null) await inc("ms_total", ms);
}

function toInt(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

// lib/metrics.ts
export type MetricEvent =
  | "generate_clicked"
  | "generate_success"
  | "generate_error";

export async function track(event: MetricEvent, data: Record<string, unknown> = {}) {
  try {
    await fetch("/api/metrics/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...data }),
      keepalive: true, // survives tab close
    });
  } catch {
    // swallow—analytics should never break UX
  }
}


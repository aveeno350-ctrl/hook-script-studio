// app/api/metrics/write/route.ts
import { NextRequest, NextResponse } from "next/server";
import { inc } from "@/lib/metrics";   // ← use the helper your lib exports
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const event = String(body?.event ?? "").trim();

    if (!event) {
      return NextResponse.json({ error: "Missing 'event'" }, { status: 400 });
    }

    // increment a counter per event name, e.g. evt:generate_success
    await inc(`evt:${event}`, 1);

    // (optional) record a total counter for all events
    await inc("evt:_all", 1);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "metrics write failed" }, { status: 500 });
  }
}

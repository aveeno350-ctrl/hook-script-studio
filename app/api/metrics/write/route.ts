// app/api/metrics/write/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeMetric } from "@/lib/metric";

export const runtime = "edge"; // fast + cheap on Vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const event =
      typeof body?.event === "string" ? body.event.trim() : "";
    const props =
      body && typeof body === "object" ? (body.props as Record<string, unknown> | undefined) : undefined;

    if (!event) {
      return NextResponse.json({ error: "Missing 'event'" }, { status: 400 });
    }

    await writeMetric(event, props); // ✅ high-level helper

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "metrics write failed" }, { status: 500 });
  }
}

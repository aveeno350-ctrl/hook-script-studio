// app/api/metrics/write/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeMetric } from "@/lib/metric";

export const runtime = "edge"; // fast + cheap on Vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // We expect: { event: "generate_success", ...additionalProps }
    const event = String(body?.event ?? "").trim();
    if (!event) {
      return NextResponse.json({ ok: false, error: "Missing 'event'" }, { status: 400 });
    }

    const props = { ...body };
    delete props.event; // remove event from props so writeMetric is clean

    await writeMetric(event, props);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "metrics write failed" },
      { status: 500 }
    );
  }
}


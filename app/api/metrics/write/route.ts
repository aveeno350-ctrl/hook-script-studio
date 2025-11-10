// app/api/metrics/write/route.ts
import { NextRequest, NextResponse } from "next/server";
import { inc } from "@/lib/metrics";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json();
    if (!event) {
      return NextResponse.json({ ok: false, error: "Missing event" }, { status: 400 });
    }

    await inc(event);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

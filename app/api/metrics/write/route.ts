// app/api/metrics/write/route.ts
import { NextRequest, NextResponse } from "next/server";
import { inc } from "@/lib/metrics";

export const runtime = "edge"; // cheap & fast on Vercel

export async function POST(req: NextRequest) {
  try {
    // Be generous about input: support JSON or text/beacon
    const ct = req.headers.get("content-type") || "";
    let payload: any = {};
    if (ct.includes("application/json")) {
      payload = await req.json();
    } else {
      const txt = await req.text();
      try { payload = JSON.parse(txt || "{}"); } catch { payload = {}; }
    }

    const { event, ...props } = payload ?? {};
    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "Missing 'event' string" }, { status: 400 });
    }

    await writeMetric(event, props);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

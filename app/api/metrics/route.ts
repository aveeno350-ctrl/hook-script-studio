import { NextRequest, NextResponse } from "next/server";
import { inc } from "@/lib/metric";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const e = new URL(req.url).searchParams.get("e");
  if (!e) return NextResponse.json({ ok: false }, { status: 400 });
  await inc(e);
  return NextResponse.json({ ok: true });
}

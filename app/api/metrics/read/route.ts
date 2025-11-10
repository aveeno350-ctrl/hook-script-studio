// app/api/metrics/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readMany } from "@/lib/metric";

export const runtime = "edge"; // fast + cheap on Vercel

// Which counters to show on the dashboard.
// You can add more later in Mission #2.
const EVENTS = [
  "evt:_all",
  "evt:generate_clicked",
  "evt:generate_success",
  "evt:generate_error",
  "evt:paywall_open",
  "evt:pdf_downloaded",
  "evt:copy_button_used",
] as const;

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY || process.env.NEXT_PUBLIC_ADMIN_KEY || "";
  const provided = req.nextUrl.searchParams.get("key") || "";

  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const results = await readMany(EVENTS as unknown as string[]);
    // results is a Map<string, number>
    const data = Array.from(results.entries())
      .map(([k, v]) => ({ key: k, value: v }))
      .sort((a, b) => a.key.localeCompare(b.key));

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json(
      { error: "metrics read failed", message: String(e) },
      { status: 500 }
    );
  }
}

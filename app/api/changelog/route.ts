import { NextResponse } from "next/server";
import { UPDATES } from "@/data/updates";

export async function GET() {
  return NextResponse.json(UPDATES);
}

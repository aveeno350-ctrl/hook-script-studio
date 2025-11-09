import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeToken, encodeToken, cookieHeader } from "@/lib/rate";

const MAX_FREE_RUNS = 3;
const COOLDOWN_MS = 3000;

export const runtime = 'edge'; // fast on Vercel

export async function POST(req: NextRequest) {
  const secret = process.env.HSS_SECRET || "";
  if (!secret) {
    return new NextResponse("Server misconfigured: HSS_SECRET missing", { status: 500 });
  }

  const jar = await cookies();        // ✅ Edge runtime: async
const token = jar.get(COOKIE_NAME)?.value;
  const prev = decodeToken(token, secret) || { runs: 0, ts: 0 };

  const now = Date.now();
  // 1) Cooldown (prevent rapid double-clicks)
  if (now - prev.ts < COOLDOWN_MS) {
    return new NextResponse(
      JSON.stringify({ error: "Please wait a moment before generating again." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2) Free runs (server-enforced)
  if (prev.runs >= MAX_FREE_RUNS) {
    return new NextResponse(
      JSON.stringify({ error: "Free limit reached. Please upgrade to continue." }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const { niche, audience, offer, tone, platform, keywords } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
    }

    const system = `You are a seasoned short-form content producer. Output must be concise, punchy, and formatted in markdown. Target platform: ${platform}. Keep hooks under 12 words when possible.`;

    const user = `Niche: ${niche}
Audience: ${audience}
Offer/Product: ${offer}
Tone: ${tone}
Optional keywords: ${keywords || '—'}

Tasks:
1) Generate 20 hooks grouped by angle (Pain→Relief, Contrarian, Mini Case, 3-Step, Myth-Bust, POV).
2) Write a 45–60s script with timecodes (mm:ss) and on-screen beats.
3) Suggest 5 B-roll ideas that match the beats.
4) Give 3 CTA variants tailored to the offer.

Constraints:
- Hooks: bullet list, bold the hook text.
- Script: Include timecodes (e.g., 00:00 cold open, 00:05 hook, 00:12 value, 00:50 CTA). Max 140 words total.
- Style: tight, specific, no fluff, platform-native.
- Return sections as: ## Hooks (by angle) / ## Script / ## B-roll / ## CTAs.`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return NextResponse.json({ error: t }, { status: 500 });
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ content: text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}

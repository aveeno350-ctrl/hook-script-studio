"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/metric";
import { DEFAULTS } from "@/lib/prompts";
import TypingWave from "./components/TypingWave";
import CopyButton from "./components/CopyButton";


/** ----- simple input memory ----- */
const INPUTS_KEY = "hss_inputs_v1";
type SavedInputs = {
  niche: string;
  audience: string;
  offer: string;
  tone: string;
  platform: string;
  keywords: string;
};

export default function Home() {
  /** ----- state ----- */
  const [niche, setNiche] = useState<string>(DEFAULTS.niche);
  const [audience, setAudience] = useState<string>(DEFAULTS.audience);
  const [offer, setOffer] = useState<string>(DEFAULTS.offer);
  const [tone, setTone] = useState<string>(DEFAULTS.tone);
  const [platform, setPlatform] = useState<string>(DEFAULTS.platform);
  const [keywords, setKeywords] = useState<string>(DEFAULTS.keywords || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [runs, setRuns] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  /** ----- load free-runs + saved inputs on first render ----- */
  useEffect(() => {
    try {
      const r = Number(localStorage.getItem("free_runs") || "0");
      setRuns(r);

      const raw = localStorage.getItem(INPUTS_KEY);
      if (raw) {
        const saved: Partial<SavedInputs> = JSON.parse(raw);
        if (saved.niche) setNiche(saved.niche);
        if (saved.audience) setAudience(saved.audience);
        if (saved.offer) setOffer(saved.offer);
        if (saved.tone) setTone(saved.tone);
        if (saved.platform) setPlatform(saved.platform);
        if (saved.keywords) setKeywords(saved.keywords);
      }
    } catch {
      /* ignore */
    }
  }, []);

  /** ----- persist inputs (debounced) ----- */
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const payload: SavedInputs = {
          niche,
          audience,
          offer,
          tone,
          platform,
          keywords,
        };
        localStorage.setItem(INPUTS_KEY, JSON.stringify(payload));
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(id);
  }, [niche, audience, offer, tone, platform, keywords]);

  /** ----- generate handler with analytics + free limit ----- */
  async function generate(): Promise<void> {
    // free limit gate
    if (runs >= 3) {
      const link =
        (process.env.NEXT_PUBLIC_PAYMENT_LINK as unknown as string) || "";
      alert("Free limit reached. Please purchase to unlock unlimited generations.");
      if (link) {
        track("paywall_open", { source: "free_limit" });
        window.open(link, "_blank");
      }
      return;
    }

    setLoading(true);

    // start timer BEFORE fetch so both success and error can measure ms
    const t0 = performance.now();

    try {
      // --- analytics: user clicked
      track("generate_clicked", {
        platform,
        niche,
        audience,
        offer,
        tone,
        keywords_len: (keywords ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean).length,
      });

      // call your API
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, audience, offer, tone, platform, keywords }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${text}`);
      }

      const data = await resp.json();

      // update UI
      setContent(data?.content ?? "");

      // bump free runs FIRST (we need `next` for analytics)
      const next = runs + 1;
      setRuns(next);
      localStorage.setItem("free_runs", String(next));

      // analytics: successful generation
      track("generate_success", {
        platform,
        runs: next,
        content_bytes: (data?.content ?? "").length || 0,
        ms: Math.round(performance.now() - t0),
      });

      // (optional) also hit our write endpoint
      fetch("/api/metrics/write", {
        method: "POST",
        body: JSON.stringify({ event: "generate_success" }),
      });
    } catch (e: unknown) {
      // one error event with useful context
      track("generate_error", {
        platform,
        message: e instanceof Error ? e.message : String(e),
        ms: Math.round(performance.now() - t0),
      });

      const message = e instanceof Error ? e.message : String(e);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  /** ----- helpers ----- */
  function resetInputs() {
    localStorage.removeItem(INPUTS_KEY);
    setNiche(DEFAULTS.niche);
    setAudience(DEFAULTS.audience);
    setOffer(DEFAULTS.offer);
    setTone(DEFAULTS.tone);
    setPlatform(DEFAULTS.platform);
    setKeywords(DEFAULTS.keywords || "");
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(content);
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  }

  function downloadTxt() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hook-script.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  /** ----- UI ----- */
  return (
    <div className="min-h-screen">
      {/* Marketing header */}
      <header className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-3xl font-semibold mb-2">Hook &amp; Script Studio</h1>
        <p className="text-xs opacity-70 mb-6">
          Generate hooks, a 60s script, B-roll, and CTAs.{" "}
          <strong>3 free runs</strong>, then unlock unlimited.
        </p>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-6 pb-12">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={resetInputs}
            className="text-xs underline opacity-70"
          >
            Reset inputs
          </button>
          <p className="text-xs opacity-60">Free runs used: {runs}/3</p>
        </div>

        {/* Inputs */}
        <section className="grid gap-3 mb-4">
          <input
            className="border rounded px-2 py-1"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="niche"
          />
          <input
            className="border rounded px-2 py-1"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="audience"
          />
          <input
            className="border rounded px-2 py-1"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="offer / product"
          />
          <input
            className="border rounded px-2 py-1"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="tone (e.g., friendly, energetic)"
          />
          <select
            className="border rounded px-2 py-1"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="TikTok">TikTok</option>
            <option value="Reels">Reels</option>
            <option value="Shorts">Shorts</option>
          </select>
          <input
            className="border rounded px-2 py-1"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="optional keywords"
          />

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="rounded px-4 py-2 border"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <TypingWave />
                <span>Generating…</span>
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </section>

        {/* Output */}
        {content && (
          <div className="mt-6">
            {/* Header row: title + inline copy */}
            <div className="flex items-center justify-between mb-2">
              <div className="kicker">Output</div>
              <CopyButton getText={() => content ?? ""} />
            </div>

            {/* Extra actions */}
            <div className="space-x-2 mb-2">
              <button onClick={copyAll} className="rounded px-3 py-2 border">
                Copy All
              </button>
              <button onClick={downloadTxt} className="rounded px-3 py-2 border">
                Download .txt
              </button>
            </div>

            {/* Rendered output */}
            <article
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}

        {/* Upgrade box */}
        <section className="border rounded-xl p-4 bg-gray-50 mt-10">
          <h2 className="font-semibold mb-2">Unlock unlimited generations</h2>
          <a
            className="inline-block rounded-xl px-4 py-2 bg-black text-white"
            href={process.env.NEXT_PUBLIC_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("paywall_open", { source: "cta_section" })}
          >
            Buy now
          </a>
        </section>

        <footer className="pt-10 text-xs opacity-60">
          <div className="space-x-3">
            <a className="hover:underline" href="/support">
              Support
            </a>
            <span>·</span>
            <a className="hover:underline" href="/terms">
              Terms
            </a>
            <span>·</span>
            <a className="hover:underline" href="/privacy">
              Privacy
            </a>
            <span>·</span>
            <a className="hover:underline" href="mailto:support@yourdomain.com">
              Email
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

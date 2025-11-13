"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/metric";
import { DEFAULTS } from "@/lib/prompts";
import TypingWave from "./components/TypingWave";
import CopyButton from "./components/CopyButton";
import UpdateBanner from "@/app/components/UpdateBanner";
import { M, useMotion } from "./components/Motion";
import { EXAMPLES } from "@/data/examples";





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
  const { fadeUp, stagger, item } = useMotion();


  const outRef = useRef<HTMLDivElement | null>(null);


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

      // smooth scroll to the output card
setTimeout(() => outRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);


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

  function clearOutput() {
  setContent("");
  try { track("output_cleared"); } catch {}
}


   /** ----- UI ----- */
  return (
    <div className="min-h-screen">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-[color-mix(in_oklab,var(--surface)90%,transparent)]">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between">
          <div className="font-semibold text-sm">Hook &amp; Script Studio</div>

          <a
            className="btn btn-secondary text-xs"
            href={process.env.NEXT_PUBLIC_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("paywall_open", { source: "topbar" })}
          >
            Upgrade
          </a>
        </div>
      </div>

      <UpdateBanner />

      {/* Marketing header */}
      <M.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="mb-8"
      >
        <header className="mx-auto max-w-3xl px-6 pt-14 pb-10 space-y-2">
          <div className="kicker">AI Video Hook Engine</div>

          <h1 className="font-display text-4xl font-semibold leading-tight">
            <span className="gradient-shimmer">Hook &amp; Script Studio</span>
          </h1>

          <p className="text-sm opacity-75 max-w-md">
            Generate scroll-stopping hooks, tight 60s scripts, B-roll ideas, and CTAs — built for TikTok, Reels,
            and Shorts.{" "}
            You get <strong>3 free runs</strong>, then unlock unlimited.
          </p>
        </header>
      </M.div>

      {/* Main content */}
       <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
  {/* Top row: reset + free runs */}
  <div className="flex items-center justify-between mb-3">
    <button onClick={resetInputs} className="btn btn-ghost">
      Reset inputs
    </button>

    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
      style={{
        background:
          "color-mix(in oklab, var(--surface-2) 85%, transparent)",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <span className="opacity-70">Free runs used</span>
      <span className="font-medium">{Math.min(runs, 3)} / 3</span>
    </div>
  </div>

  {/* Inputs card */}
  <section className="card p-4 md:p-6">
    <M.section
      className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <M.div variants={item}>
        <input
          className="input"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="niche"
        />
      </M.div>

      <M.div variants={item}>
        <input
          className="input"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="audience"
        />
      </M.div>

      <M.div variants={item}>
        <input
          className="input"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          placeholder="offer / product"
        />
      </M.div>

      <M.div variants={item}>
        <input
          className="input"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="tone (e.g., friendly, energetic)"
        />
      </M.div>

      <M.div variants={item}>
        <select
          className="input"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="TikTok">TikTok</option>
          <option value="Reels">Reels</option>
          <option value="Shorts">Shorts</option>
        </select>
      </M.div>

      <M.div variants={item}>
        <input
          className="input"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="optional keywords"
        />
      </M.div>

      {/* Tips microcopy */}
      <div className="text-xs opacity-70 leading-relaxed mb-1 md:col-span-2">
        <strong>Tips for better results:</strong>
        {" "}
        • Be specific about your niche
        {"  "}
        • Mention who the content is for
        {"  "}
        • Describe your offer clearly
      </div>

      {/* Generate button */}
      <M.button
        type="button"
        onClick={generate}
        disabled={loading}
        aria-busy={loading}
        className="btn btn-primary w-full md:col-span-2 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.25 }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <TypingWave />
            <span>Generating…</span>
          </span>
        ) : (
          "Generate"
        )}
      </M.button>
    </M.section>
  </section>

  {/* Output */}
  {(loading || content) && (
    <section ref={outRef} className="card p-5 mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="kicker">Output</div>
        <CopyButton getText={() => content ?? ""} />
      </div>

      <div className="flex gap-2">
        <button onClick={copyAll} className="btn btn-secondary">
          Copy All
        </button>
        <button onClick={downloadTxt} className="btn btn-secondary">
          Download .txt
        </button>
        <button onClick={clearOutput} className="btn btn-ghost">
          Clear
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-11/12" />
          <div className="skeleton h-5 w-5/6" />
        </div>
      ) : (
        <article
          className="prose prose-invert prose-sm max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </section>
  )}

  {/* Examples gallery */}
  <section className="card p-6 mt-8 space-y-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2">
      <div>
        <div className="kicker">Examples</div>
        <h2 className="font-display text-base font-semibold">
          What can you make with it?
        </h2>
      </div>

      <p className="text-xs opacity-70 md:text-right">
        These are sample hooks + scripts. Tweak them to sound like you.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {EXAMPLES.map((ex) => (
        <article
          key={ex.label}
          className="rounded-lg border border-white/5 bg-[color-mix(in_oklab,var(--surface)92%,transparent)] p-3 space-y-2"
        >
          <div className="text-[11px] uppercase tracking-wide opacity-70">
            {ex.label}
          </div>

          <p className="text-xs opacity-80">
            <strong>Niche:</strong> {ex.niche}
            <br />
            <strong>Audience:</strong> {ex.audience}
          </p>

          <div className="text-xs">
            <div className="font-semibold mb-1">Sample hook</div>
            <p className="opacity-90">&ldquo;{ex.hook}&rdquo;</p>
          </div>

          <details className="text-[11px] mt-1">
            <summary className="cursor-pointer opacity-80 hover:opacity-100">
              View script idea
            </summary>
            <pre className="mt-1 text-[11px] leading-snug whitespace-pre-wrap opacity-80">
              {ex.script}
            </pre>
          </details>
        </article>
      ))}
    </div>
  </section>

  {/* Upgrade box */}
  <section className="card p-6 mt-10 space-y-3">
    <h2 className="font-display text-lg font-semibold">
      Unlock unlimited generations
    </h2>

    <p className="text-sm opacity-75 leading-relaxed">
      Includes unlimited hooks, scripts, B-roll suggestions, and CTAs.
    </p>

    <M.a
      href={process.env.NEXT_PUBLIC_PAYMENT_LINK}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("paywall_open", { source: "cta_section" })}
      className="btn btn-primary w-full text-white"
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.25 }}
    >
      Upgrade Now
    </M.a>
  </section>

  <footer className="pt-10 text-xs opacity-60">
    <div className="space-x-3">
      <a
        className="hover:underline opacity-80 hover:opacity-100 transition"
        href={`mailto:aveeno350@gmail.com?subject=Hook%20%26%20Script%20Studio%20Support%20Request&body=${encodeURIComponent(
          "Please describe the issue you're experiencing.\n\nBrowser:\nDevice:\nSteps to reproduce:\n"
        )}`}
      >
        Contact Support
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
      <a className="hover:underline" href="/license">
        License
      </a>
      <span>·</span>
      <a className="hover:underline" href="/support">
        Support
      </a>
      <span>·</span>
      <a className="hover:underline" href="/pricing">
        Pricing
      </a>
      <span>·</span>
      <a className="hover:underline" href="/changelog">
        Changelog
      </a>
      <span>·</span>
      <a className="hover:underline" href="/about">
        About
      </a>
    </div>

        <p className="text-xs opacity-60 mt-3">
      Need help? We respond within 24–48 hours.
    </p>
  </footer>
</main>
</div>
);
}


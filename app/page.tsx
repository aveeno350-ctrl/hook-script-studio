"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/metric";
import { DEFAULTS } from "@/lib/prompts";
import TypingWave from "./components/TypingWave";
import CopyButton from "./components/CopyButton";
import UpdateBanner from "@/app/components/UpdateBanner";
import { M, useMotion } from "./components/Motion";
import { EXAMPLES } from "@/data/examples";
import GlowCard from "./components/GlowCard";






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
  const [history, setHistory] = useState<string[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);



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
    // free limit gate (new version)
if (runs >= 3) {
  setShowUpgradeModal(true);
  track("paywall_open", { source: "runs_exhausted" });
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

      const nextContent = data?.content ?? "";

      // update UI
      setContent(data?.content ?? "");

      // smooth scroll to the output card
setTimeout(() => outRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);

      // update history (most recent first, max 5 items)
setHistory((prev) => [nextContent, ...prev].slice(0, 5));

      // bump free runs FIRST (we need `next` for analytics)
      const next = runs + 1;
      setRuns(next);
      localStorage.setItem("free_runs", String(next));

      // analytics: successful generation
      track("generate_success", {
        platform,
        runs: next,
        content_bytes: nextContent.length || 0,
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
          {/* New reassurance line */}
    <p className="text-xs opacity-60 mt-2">
      No login required. Just fill the inputs, generate, and start filming.
    </p>
        </header>
      </M.div>

          {/* Quickstart helper */}
    <section className="mx-auto max-w-3xl px-6 mt-6">
     <GlowCard className="p-5 md:p-6 group">
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)] md:items-start">
      
      {/* Left column */}
      <div className="space-y-2">
        <div className="kicker">Quickstart</div>
        <h2 className="font-display text-base font-semibold">
          3 steps to your first script
        </h2>
        <p className="text-xs opacity-75">
          Use this flow the first time you try the app (and anytime you feel stuck).
        </p>
      </div>

      {/* Right column */}
      <div className="grid gap-4 md:grid-cols-3 text-xs">
        <div className="space-y-1">
          <div className="font-semibold">1. Fill the basics</div>
          <p className="opacity-75">
            Niche, audience, offer, and tone. The more specific, the better.
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-semibold">2. Hit Generate</div>
          <p className="opacity-75">
            Skim the hooks, pick 1–2 you like, and tweak the wording to sound like you.
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-semibold">3. Film today</div>
          <p className="opacity-75">
            Use the script and B-roll notes as your shot list. Don’t overthink it.
          </p>
        </div>
      </div>

    </div>
  </GlowCard>
</section>


      
      {/* Main content */}
       <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      {/* Free runs + reset row */}
<div className="flex items-center justify-between mb-3">
  <button onClick={resetInputs} className="btn btn-ghost">
    Reset inputs
  </button>

  {/* Free runs wrapper */}
  <div className="flex flex-col items-end">
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
      style={{
        background: "color-mix(in oklab, var(--surface-2) 85%, transparent)",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <span className="opacity-70">Free runs used</span>
      <span className="font-medium">{Math.min(runs, 3)} / 3</span>
    </div>

    <p className="text-[11px] opacity-50 mt-1">
      You get 3 free runs on this device.
    </p>
  </div>
</div>


  {/* Inputs card */}
  <GlowCard className="p-4 md:p-6 group">
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
      <div className="md:col-span-2 mt-1">
  <p className="text-xs opacity-70 font-medium mb-1">
    Tips for better results:
  </p>

  <ul className="text-xs opacity-70 list-disc ml-4 space-y-1">
    <li>Be specific about your niche</li>
    <li>Mention who the content is for</li>
    <li>Describe your offer clearly</li>
  </ul>
</div>


      {/* Generate button */}
      <M.button
        type="button"
        onClick={generate}
        disabled={loading}
        aria-busy={loading}
        className="btn btn-primary btn-pulse w-full md:col-span-2 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
  </GlowCard>


  {/* Output */}
{(loading || content) && (
  <GlowCard className="p-5 mt-6 space-y-4 group">
    <div ref={outRef} className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="kicker">Output</div>
        <CopyButton getText={() => content ?? ""} />
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap gap-2 text-xs">
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

      {/* Content surface */}
      <div
        className="
          mt-1 rounded-lg border border-white/8
          bg-[color-mix(in_oklab,var(--surface)96%,transparent)]
          px-4 py-3
        "
      >
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
      </div>
    </div>
  </GlowCard>
)}

         {/* Recent runs history */}
{history.length > 1 && (
  <GlowCard className="p-4 mt-4 space-y-2 group">
    <div className="flex items-center justify-between">
      <div className="kicker">Recent runs</div>
      <span className="text-[11px] opacity-60">
        Last {Math.min(history.length, 5)} sessions
      </span>
    </div>

    <ul className="space-y-1 text-xs">
      {history.map((item, idx) => (
        <li
          key={idx}
          className="
            flex items-center justify-between gap-2
            rounded-md border border-white/5
            bg-[color-mix(in_oklab,var(--surface)96%,transparent)]
            px-3 py-2
          "
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium opacity-80">
              Run #{history.length - idx}
            </p>
            <p className="truncate opacity-70">
              {item.replace(/\s+/g, " ").slice(0, 90)}
              {item.length > 90 ? "…" : ""}
            </p>
          </div>

          <CopyButton getText={() => item} />
        </li>
      ))}
    </ul>
  </GlowCard>
)}



  {/* Examples gallery */}
<GlowCard className="p-6 mt-8 space-y-6 group">
  {/* Header row */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
    <div className="space-y-1">
      <div className="kicker">Examples</div>

      <div className="flex items-center gap-2">
        <h2 className="font-display text-base font-semibold">
          What can you make with it?
        </h2>

        <span
          className="
            inline-flex items-center px-2 py-[2px] rounded-full
            text-[10px] uppercase tracking-wide
            bg-[color-mix(in_oklab,var(--accent-500)80%,transparent)]
            text-white/95
          "
        >
          New
        </span>
      </div>
    </div>

    <p className="text-xs opacity-70 md:text-right max-w-xs md:max-w-sm">
      These are sample hooks + scripts. Tweak them to sound like you.
    </p>
  </div>


    <div className="grid gap-4 md:grid-cols-3 mt-4">
      {EXAMPLES.map((ex) => (
        <article
  key={ex.label}
  className="
    rounded-lg border border-white/8
    bg-[color-mix(in_oklab,var(--surface)94%,transparent)]
    p-3 space-y-2
    transition-transform transition-shadow duration-200
    hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(155,92,255,0.35)]
  "
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
  </GlowCard>


{/* Upgrade box */}
<GlowCard className="p-6 mt-10 space-y-4 group">
  <div className="space-y-1">
    <h2 className="font-display text-lg font-semibold">
      Unlock unlimited generations
    </h2>

    <p className="text-sm opacity-75 leading-relaxed">
      Includes unlimited hooks, scripts, B-roll suggestions, and CTAs.
    </p>
  </div>

  <M.a
    href={process.env.NEXT_PUBLIC_PAYMENT_LINK}
    target="_blank"
    rel="noreferrer"
    onClick={() => track("paywall_open", { source: "cta_section" })}
    className="btn btn-primary w-full !text-white mt-4"
    whileHover={{ y: -1, scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.25 }}
  >
    Upgrade Now
  </M.a>
</GlowCard>

{/* Upgrade modal – shows when free runs are exhausted */}
<AnimatePresence>
  {showUpgradeModal && (
    <M.div
      key="upgrade-modal-backdrop"
      className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-sm bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}        // BACKDROP FADES OUT
      transition={{ duration: 0.2 }}
    >
      <M.div
        key="upgrade-modal"
        className="w-[90%] max-w-md"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}  // MODAL FADES OUT + SHRINK
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <GlowCard className="p-6 space-y-4">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Unlock unlimited generations
            </h2>
            <p className="text-sm opacity-75 mt-2">
              You’ve used your 3 free runs on this device. Upgrade once to unlock
              unlimited hooks, scripts, B-roll ideas, and CTAs.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-4 space-y-3">
            {/* Upgrade button */}
            <M.a
              href={process.env.NEXT_PUBLIC_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                track("paywall_open", { source: "modal" });
                setShowUpgradeModal(false); // triggers fade-out
              }}
              className="btn btn-primary w-full !text-white"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.2 }}
            >
              Upgrade Now
            </M.a>

            {/* Maybe later (centered) */}
            <M.div
              className="w-full flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.2 }}
            >
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)} // fade-out triggered
                className="text-xs opacity-70 hover:opacity-100 transition text-center"
              >
                Maybe later
              </button>
            </M.div>
          </div>
        </GlowCard>
      </M.div>
    </M.div>
  )}
</AnimatePresence>


  <footer className="pt-10 text-xs opacity-60">
  <div className="flex flex-wrap gap-x-3 gap-y-2">
    <a
      className="hover:underline opacity-80 hover:opacity-100 transition"
      href={`mailto:aveeno350@gmail.com?subject=Hook%20%26%20Script%20Studio%20Support%20Request&body=${encodeURIComponent(
        "Please describe the issue you're experiencing.\n\nBrowser:\nDevice:\nSteps to reproduce:\n"
      )}`}
    >
      Contact
    </a>

    <span className="hidden sm:inline">·</span>

    <a className="hover:underline" href="/terms">
      Terms
    </a>

    <span className="hidden sm:inline">·</span>

    <a className="hover:underline" href="/privacy">
      Privacy
    </a>

    <span className="hidden sm:inline">·</span>

    <a className="hover:underline" href="/license">
      License
    </a>

    <span className="hidden sm:inline">·</span>

    <a className="hover:underline" href="/support">
      Support
    </a>

    <span className="hidden sm:inline">·</span>

    <a className="hover:underline" href="/pricing">
      Pricing
    </a>

    <span className="hidden sm:inline">·</span>

    <a className="hover:underline" href="/changelog">
      Changelog
    </a>

    <span className="hidden sm:inline">·</span>

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


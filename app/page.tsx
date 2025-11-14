"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { motion as M, AnimatePresence } from "framer-motion";
import { track } from "@/lib/metric";
import { DEFAULTS } from "@/lib/prompts";
import TypingWave from "./components/TypingWave";
import CopyButton from "./components/CopyButton";
import UpdateBanner from "./components/UpdateBanner";
import { EXAMPLES } from "@/data/examples";

  // Reusable card with soft hover lift (no glow)
type GlowCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  function GlowCard({ className = "", children, ...props }, ref) {
    return (
      <M.div
        ref={ref as any}
        {...(props as any)}
        className={`
          relative rounded-3xl border border-white/10
          bg-[color-mix(in_oklab,var(--surface)96%,transparent)]
          shadow-[0_4px_10px_rgba(15,23,42,0.10)]
          transition-all duration-200 ease-out
          hover:-translate-y-[2px]
          hover:shadow-[0_12px_24px_rgba(15,23,42,0.18)]
          ${className}
        `}
      >
        {/* real card content */}
        <div className="relative z-10">
          {children}
        </div>
      </M.div>
    );
  }
);







export default function Page() {
  // ---- state ----
  const [niche, setNiche] = React.useState("");
  const [audience, setAudience] = React.useState("");
  const [offer, setOffer] = React.useState("");
  const [tone, setTone] = React.useState("");
  const [platform, setPlatform] = React.useState("TikTok");
  const [keywords, setKeywords] = React.useState("");

  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // persisted free-run counter
const [runs, setRuns] = useState<number>(0);

// Read initial value from localStorage on mount
useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const stored = window.localStorage.getItem("hss_runs_v1");
    if (stored != null) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed)) {
        setRuns(parsed);
      }
    }
  } catch (err) {
    console.error("Failed to read runs from localStorage", err);
  }
}, []);

// Persist whenever runs changes
useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem("hss_runs_v1", String(runs));
  } catch (err) {
    console.error("Failed to write runs to localStorage", err);
  }
}, [runs]);


  const outRef = React.useRef<HTMLDivElement | null>(null);

  // upgrade modal
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  // Close on ESC
  React.useEffect(() => {
    if (!showUpgradeModal) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowUpgradeModal(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showUpgradeModal]);

  // ---- helpers ----
  function resetInputs() {
    setNiche("");
    setAudience("");
    setOffer("");
    setTone("");
    setPlatform("TikTok");
    setKeywords("");
  }

  function clearOutput() {
    setContent("");
  }

  function copyAll() {
    if (!content) return;
    navigator.clipboard.writeText(
      content.replace(/<br\s*\/?>/g, "\n").replace(/<\/p><p>/g, "\n\n")
    );
  }

  function downloadTxt() {
    if (!content) return;
    const blob = new Blob(
      [
        content
          .replace(/<br\s*\/?>/g, "\n")
          .replace(/<\/p><p>/g, "\n\n")
          .replace(/<\/?[^>]+(>|$)/g, ""),
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hook-script.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function generate(): Promise<void> {
    // free-limit gate with modal
    if (runs >= 3) {
      setShowUpgradeModal(true);
      track("free_limit_reached", { runs });
      return;
    }

    setLoading(true);
    setContent("");

    try {
      track("generate_click", { runs_before: runs });

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          audience,
          offer,
          tone,
          platform,
          keywords,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setContent(data.html ?? data.text ?? "");
      setRuns(runs + 1);

      // scroll to output
      requestAnimationFrame(() => {
        outRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong generating your script. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // stagger variants for inputs
  const stagger = {
    hidden: { opacity: 0, y: 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-[color-mix(in_oklab,var(--surface)90%,transparent)]">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between">
          <div className="font-semibold text-sm">Hook & Script Studio</div>

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

      {/* Marketing hero */}
      <M.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
  className="mb-8"
>
  <header className="mx-auto max-w-3xl px-6 pt-14 pb-10 space-y-3 text-left">
    <div className="kicker">AI video hook engine</div>

    <h1 className="font-display text-4xl font-semibold leading-tight">
      <span className="gradient-shimmer">Hook &amp; Script Studio</span>
    </h1>

    <p className="text-sm opacity-75 max-w-lg">
      Generate scroll-stopping hooks, tight 60s scripts, B-roll ideas, and CTAs
      — built for TikTok, Reels, and Shorts.{" "}
      <span className="font-medium">You get 3 free runs</span>, then unlock
      unlimited.
    </p>
  </header>
</M.div>


      {/* Main content */}
      <main className="mx-auto max-w-3xl px-6 pb-10 space-y-6">
        {/* Quickstart helper */}
        <GlowCard className="p-5 md:p-6 group">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)] md:items-start">
            {/* Left column */}
            <div className="space-y-2">
              <div className="kicker">Quickstart</div>
              <h2 className="font-display text-base font-semibold">
                3 steps to your first script
              </h2>
              <p className="text-xs opacity-75">
                Use this flow the first time you try the app (and anytime you
                feel stuck).
              </p>
            </div>

            {/* Right column */}
            <div className="grid gap-4 md:grid-cols-3 text-xs">
              <div className="space-y-1">
                <div className="font-semibold">1. Fill the basics</div>
                <p className="opacity-75">
                  Niche, audience, offer, and tone. The more specific, the
                  better.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-semibold">2. Hit Generate</div>
                <p className="opacity-75">
                  Skim the hooks, pick 1–2 you like, and tweak the wording to
                  sound like you.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-semibold">3. Film today</div>
                <p className="opacity-75">
                  Use the script and B-roll notes as your shot list. Don&apos;t
                  overthink it.
                </p>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Top controls */}
        <div className="flex items-center justify-between mb-1 pt-4">
          <button onClick={resetInputs} className="btn btn-ghost">
            Reset inputs
          </button>

          <div className="flex flex-col items-end gap-1 text-[11px]">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]"
              style={{
                background:
                  "color-mix(in oklab, var(--surface-2) 85%, transparent)",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <span className="opacity-70">Free runs used</span>
              <span className="font-medium">{Math.min(runs, 3)} / 3</span>
            </div>
            <span className="opacity-60">You get 3 free runs on this device.</span>
          </div>
        </div>

        {/* Inputs card */}
        <GlowCard className="p-4 md:p-6 group">
          <M.section
            className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4"
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

            <div className="text-xs opacity-70 leading-relaxed md:col-span-2 mt-1">
              <strong>Tips for better results:</strong>
              <ul className="mt-1 list-disc list-inside space-y-[2px]">
                <li>Be specific about your niche</li>
                <li>Mention who the content is for</li>
                <li>Describe your offer clearly</li>
              </ul>
            </div>

            <M.button
              type="button"
              onClick={generate}
              disabled={loading}
              aria-busy={loading}
              className="btn btn-primary w-full md:col-span-2 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 30,
                mass: 0.25,
              }}
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
          <GlowCard ref={outRef} className="p-5 mt-6 space-y-4 group">
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
          </GlowCard>
        )}

               {/* Examples gallery */}
        <GlowCard className="p-6 mt-8 space-y-4">
          <div className="space-y-2">
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

            <p className="text-xs opacity-70 max-w-sm">
              These are sample hooks + scripts. Tweak them to sound like you.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-3 mt-3">
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
        </GlowCard>

        {/* Upgrade box */}
        <GlowCard className="p-6 mt-10 space-y-4">
          <div className="space-y-2">
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
            className="btn btn-primary w-full !text-white mt-2"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.25 }}
          >
            Upgrade Now
          </M.a>
        </GlowCard>

        {/* Footer */}
        <footer className="pt-10 text-xs opacity-60">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <nav className="flex flex-wrap gap-x-3 gap-y-2">
              <a
                className="hover:underline opacity-80 hover:opacity-100 transition"
                href={`mailto:aveeno350@gmail.com?subject=Hook%20%26%20Script%20Studio%20Support%20Request&body=${encodeURIComponent(
                  "Please describe the issue you're experiencing.\n\nBrowser:\nDevice:\nSteps to reproduce:\n"
                )}`}
              >
                Contact
              </a>
              <span className="hidden md:inline">·</span>

              <a className="hover:underline" href="/terms">
                Terms
              </a>
              <span className="hidden md:inline">·</span>

              <a className="hover:underline" href="/privacy">
                Privacy
              </a>
              <span className="hidden md:inline">·</span>

              <a className="hover:underline" href="/license">
                License
              </a>
              <span className="hidden md:inline">·</span>

              <a className="hover:underline" href="/support">
                Support
              </a>
              <span className="hidden md:inline">·</span>

              <a className="hover:underline" href="/pricing">
                Pricing
              </a>
              <span className="hidden md:inline">·</span>

              <a className="hover:underline" href="/changelog">
                Changelog
              </a>
              <span className="hidden md:inline">·</span>

              <a className="hover:underline" href="/about">
                About
              </a>
            </nav>

            <p className="opacity-70">
              Need help? We respond within 24–48 hours.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
 
        
        

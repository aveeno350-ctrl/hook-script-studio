"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion as M, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { track } from "@/lib/metric";
import { DEFAULTS } from "@/lib/prompts";
import TypingWave from "./components/TypingWave";
import CopyButton from "./components/CopyButton";
import UpdateBanner from "./components/UpdateBanner";
import { EXAMPLES } from "@/data/examples";


  // Reusable glowing card (hover lift, no radial gradient, no clsx)
const GlowCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div className="relative group">
        <div
          ref={ref}
          className={clsx(
            "relative rounded-3xl border border-white/10 bg-[color-mix(in_oklab,var(--surface)96%,transparent)] shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-[1px]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

GlowCard.displayName = "GlowCard";

// Saved run snapshot for history panel
type RunSnapshot = {
  id: string;
  createdAt: number;
  niche: string;
  audience: string;
  offer: string;
  tone: string;
  platform: string;
  keywords: string;
  content: string;
};

const HISTORY_KEY = "hss_history_v1";



type SavedRun = {
  id: string;
  createdAt: string;
  niche: string;
  audience: string;
  offer: string;
  platform: string;
  tone: string;
  keywords: string;
  html: string;
};

export default function Page() {
  const [niche, setNiche] = useState(DEFAULTS.niche);
  const [audience, setAudience] = useState(DEFAULTS.audience);
  const [offer, setOffer] = useState(DEFAULTS.offer);
  const [tone, setTone] = useState(DEFAULTS.tone);
  const [platform, setPlatform] = useState(DEFAULTS.platform);
  const [keywords, setKeywords] = useState(DEFAULTS.keywords);

  const [runs, setRuns] = useLocalStorage<number>("hss_runs_v1", 0);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [history, setHistory] = useLocalStorage<RunSnapshot[]>(HISTORY_KEY, []);



  // 🔐 Saved scripts library (local to this device)
  const [savedRuns, setSavedRuns] = useLocalStorage<SavedRun[]>(
    "hss_saved_v1",
    []
  );

  const [showSavedDrawer, setShowSavedDrawer] = useState(false);

  const handleLoadSaved = (run: SavedRun) => {
    setNiche(run.niche);
    setAudience(run.audience);
    setOffer(run.offer);
    setTone(run.tone);
    setPlatform(run.platform);
    setKeywords(run.keywords);
    setContent(run.html);
    setShowSavedDrawer(false);
  };

  
  const outRef = useRef<HTMLDivElement | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSaveCurrent = () => {
    if (!content) return;

    const newRun: SavedRun = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      niche,
      audience,
      offer,
      platform,
      tone,
      keywords,
      html: content,
    };

    setSavedRuns((prev) => [newRun, ...prev].slice(0, 20));
  };

  const handleCopySaved = (run: SavedRun) => {
    // Strip HTML tags before copying
    const plain = run.html.replace(/<[^>]+>/g, "");
    navigator.clipboard?.writeText(plain);
  };

// Local storage key
const HISTORY_KEY = "hss_history_v1";

// Run snapshot type for saving
type SavedRun = {
  id: string;
  createdAt: string;
  niche: string;
  audience: string;
  offer: string;
  platform: string;
  tone: string;
  keywords: string;
  html: string; // The generated script HTML
};

// Drawer state
const [drawerOpen, setDrawerOpen] = useState(false);

// History list state
const [savedHistory, setSavedHistory] = useState<SavedRun[]>([]);

// Viewing a single saved run
const [selectedRun, setSelectedRun] = useState<SavedRun | null>(null);

// Load existing saved runs on mount
useEffect(() => {
  const existing = localStorage.getItem(HISTORY_KEY);
  if (existing) {
    setSavedHistory(JSON.parse(existing));
  }
}, []);

// Save a new run
const saveScript = (html: string) => {
  const newRun: SavedRun = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    niche,
    audience,
    offer,
    platform,
    tone,
    keywords,
    html,
  };

  const updated = [newRun, ...savedHistory];
  setSavedHistory(updated);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

// Delete a saved run
const deleteRun = (id: string) => {
  const updated = savedHistory.filter((r) => r.id !== id);
  setSavedHistory(updated);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  setSelectedRun(null);
};

// Format date helper
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};


// Persist whenever runs changes
useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem("hss_runs_v1", String(runs));
  } catch (err) {
    console.error("Failed to write runs to localStorage", err);
  }
}, [runs]);



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

      const data = await res.json() as { html?: string; text?: string };
      const html = (data.html ?? data.text ?? "").trim();

      // set main output
      setContent(html);

      // increment runs safely
      setRuns((prev) => prev + 1);

      // save this run into local history (keep latest 10)
      setHistory((prev) => {
        const entry: RunSnapshot = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: Date.now(),
          niche,
          audience,
          offer,
          tone,
          platform,
          keywords,
          content: html,
        };

        return [entry, ...prev].slice(0, 10);
      });

      // scroll to output
      requestAnimationFrame(() => {
        outRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (err) {
      console.error(err);
      alert(
        "Something went wrong generating your script. Please try again."
      );
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

  // Simple typed localStorage hook for runs counter
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // if anything goes weird, just fall back to initial
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue] as const;
}


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
                placeholder="e.g. hook, script, cta"
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
          <GlowCard className="p-5 mt-6 space-y-4 group" ref={outRef}>
            <div className="flex items-center justify-between">
              <div className="kicker">Output</div>
              <CopyButton getText={() => content || ""} />
            </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSaveCurrent}
          disabled={!content}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save to library
        </button>

        <button
          type="button"
          onClick={() => setShowSavedDrawer(true)}
          className="btn btn-ghost"
        >
          View saved scripts
        </button>
      </div>
    </div>


            {loading ? (
              <div className="space-y-2">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-5 w-full" />
                <div className="skeleton h-5 w-11/12" />
                <div className="skeleton h-5 w-5/6" />
              </div>
            ) : content ? (
              <article
                className="prose prose-invert prose-sm max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : null}
          </GlowCard>
        )}

{/* Recent runs history */}
{history.length > 0 && (
  <GlowCard className="p-5 mt-6 space-y-3 group">
    <div className="flex items-center justify-between gap-2">
      <div>
        <div className="kicker">Recent runs</div>
        <h2 className="font-display text-sm font-semibold">
          Your last {Math.min(history.length, 10)} scripts
        </h2>
      </div>
      <button
        type="button"
        className="text-[11px] opacity-70 hover:opacity-100 hover:underline"
        onClick={() => setHistory([])}
      >
        Clear history
      </button>
    </div>

    <div className="space-y-2">
      {history.map((run) => (
        <div
          key={run.id}
          className="rounded-lg border border-white/5 bg-[color-mix(in_oklab,var(--surface)96%,transparent)] px-3 py-2 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2"
        >
          <div className="space-y-0.5">
            <div className="font-medium line-clamp-1">
              {run.niche || "Untitled niche"} · {run.platform}
            </div>
            <div className="opacity-70 line-clamp-1">
              {run.audience || "Audience not set"}
            </div>
            <div className="opacity-50 text-[11px]">
              {new Date(run.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              className="btn btn-ghost px-2 py-1 text-[11px]"
              onClick={() => {
                setNiche(run.niche);
                setAudience(run.audience);
                setOffer(run.offer);
                setTone(run.tone);
                setPlatform(run.platform);
                setKeywords(run.keywords);
              }}
            >
              Restore inputs
            </button>

            <button
              type="button"
              className="btn btn-secondary px-2 py-1 text-[11px]"
              onClick={() => {
                setContent(run.content);
                // scroll to output smooth on load
                outRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Load output
            </button>
          </div>
        </div>
      ))}
    </div>
  </GlowCard>
)}


        {/* Saved scripts library */}
{savedRuns.length > 0 && (
  <GlowCard className="p-5 mt-6 space-y-3 group">
    <div className="flex items-center justify-between gap-2">
      <div>
        <div className="kicker">Saved scripts</div>
        <h2 className="font-display text-base font-semibold">
          Your recent runs
        </h2>
        <p className="text-xs opacity-70 mt-1">
          Stored on this device only. Great for keeping your favorite hooks and
          scripts handy.
        </p>
      </div>

      <button
        onClick={() => setSavedRuns([])}
        className="text-[11px] opacity-60 hover:opacity-100 underline-offset-2 hover:underline"
      >
        Clear all
      </button>
    </div>

    <ul className="space-y-2 text-xs">
      {savedRuns.map((run) => (
        <li
          key={run.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-[color-mix(in_oklab,var(--surface-2)90%,transparent)] px-3 py-2"
        >
          <div className="min-w-0">
            <div className="font-medium truncate">
              {run.niche} · {run.offer}
            </div>
            <div className="opacity-70 truncate">
              {new Date(run.createdAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              · {run.platform}
            </div>
            {run.keywords && (
              <div className="opacity-60 truncate">
                <span className="uppercase tracking-wide mr-1">
                  Keywords:
                </span>
                {run.keywords}
              </div>
            )}
          </div>

          <button
            onClick={() => handleCopySaved(run)}
            className="btn btn-secondary text-[11px] px-2 py-1 whitespace-nowrap"
          >
            Copy
          </button>
        </li>
      ))}
    </ul>
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
            {/* Saved scripts drawer */}
      <AnimatePresence>
        {showSavedDrawer && (
          <M.div
            className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <M.div
              className="w-full max-w-lg mx-auto mb-3 md:mb-0 px-4"
              initial={{ y: 32, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 32, opacity: 0, scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 30,
                mass: 0.9,
              }}
            >
              <GlowCard className="p-4 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="kicker">Saved scripts</div>
                    <h2 className="font-display text-base font-semibold">
                      Your hook &amp; script library
                    </h2>
                    <p className="text-xs opacity-70 mt-1">
                      Load a saved run back into the editor, or copy it out as
                      plain text.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSavedDrawer(false)}
                    className="btn btn-ghost text-xs px-2 py-1"
                  >
                    Close
                  </button>
                </div>

                {savedRuns.length === 0 ? (
                  <p className="text-xs opacity-70">
                    You haven&apos;t saved anything yet. Generate a script, then
                    hit <span className="font-medium">Save to library</span>.
                  </p>
                ) : (
                  <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {savedRuns.map((run) => (
                      <li
                        key={run.id}
                        className="rounded-lg border border-white/5 bg-[color-mix(in_oklab,var(--surface)96%,transparent)] p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide opacity-70">
                          <span className="truncate">
                            {run.niche || "Untitled script"}
                          </span>
                          <span>
                            {new Date(run.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <p className="text-xs opacity-80 line-clamp-2">
                          {run.offer || run.audience || run.tone}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex flex-wrap gap-2">
                            {run.platform && (
                              <span className="rounded-full border border-white/10 px-2 py-[2px] text-[10px] uppercase tracking-wide opacity-80">
                                {run.platform}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleLoadSaved(run)}
                              className="btn btn-secondary btn-xs"
                            >
                              Load into editor
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopySaved(run)}
                              className="btn btn-ghost btn-xs"
                            >
                              Copy text
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSavedRuns((prev) =>
                                  prev.filter((r) => r.id !== run.id)
                                )
                              }
                              className="btn btn-ghost btn-xs text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </GlowCard>
            </M.div>
          </M.div>
        )}
      </AnimatePresence>

<>
  {/* Saved Scripts Button */}
  <button
    onClick={() => setDrawerOpen(true)}
    className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg"
  >
    Saved Scripts
  </button>

  {/* Drawer Overlay */}
  {drawerOpen && (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setDrawerOpen(false)}
    />
  )}

  {/* Drawer */}
  <div
    className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl transform transition-transform duration-300 ${
      drawerOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    <div className="p-6 border-b flex justify-between items-center">
      <h2 className="text-xl font-semibold">Saved Scripts</h2>
      <button onClick={() => setDrawerOpen(false)}>✕</button>
    </div>

    {/* List of saved runs */}
    <div className="overflow-y-auto h-[calc(100%-160px)] p-4 space-y-4">
      {savedHistory.length === 0 && (
        <p className="text-gray-500 text-center">No saved scripts yet.</p>
      )}

      {savedHistory.map((run) => (
        <div
          key={run.id}
          className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => setSelectedRun(run)}
        >
          <p className="font-medium">{run.niche}</p>
          <p className="text-sm text-gray-600">
            {formatDate(run.createdAt)}
          </p>
        </div>
      ))}
    </div>

    {/* Selected run viewer */}
    {selectedRun && (
      <div className="absolute inset-0 bg-white p-6 overflow-y-auto">
        <button
          onClick={() => setSelectedRun(null)}
          className="text-sm underline mb-4"
        >
          ← Back to list
        </button>

        <h3 className="font-semibold text-lg mb-2">{selectedRun.niche}</h3>
        <p className="text-gray-500 mb-4">
          {formatDate(selectedRun.createdAt)}
        </p>

        {/* Render stored HTML */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: selectedRun.html }}
        />

        <button
          onClick={() => deleteRun(selectedRun.id)}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    )}
  </div>
</>

      
    </div>
  );
}
 
        
        

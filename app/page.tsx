"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion as M, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { track } from "@/lib/metric";
import { DEFAULTS } from "@/lib/prompts";
import TypingWave from "./components/TypingWave";
import CopyButton from "./components/CopyButton";
import UpdateBanner from "./components/UpdateBanner";
import { EXAMPLES } from "@/data/examples";
import { marked } from "marked";


// -----------------------------------------------------------------------------
// Reusable components & types
// -----------------------------------------------------------------------------

const GlowCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className = "", ...props }, ref) => {
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
});

GlowCard.displayName = "GlowCard";

const HISTORY_KEY = "hss_history_v2";

// Recent runs history entries
type RunSnapshot = {
  id: string;
  createdAt: number;
  niche: string;
  audience: string;
  offer: string;
  tone: string;
  platform: string;
  keywords: string;
  content: string; // HTML string
};

// Explicit “saved to library” runs
type SavedRun = {
  id: string;
  createdAt: string; // ISO string
  niche: string;
  audience: string;
  offer: string;
  platform: string;
  tone: string;
  keywords: string;
  html: string; // HTML string
};

// -----------------------------------------------------------------------------
// Typed localStorage hook
// -----------------------------------------------------------------------------

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
      // ignore and keep initial
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

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function Page() {
  // Core inputs
  const [niche, setNiche] = useState(DEFAULTS.niche);
  const [audience, setAudience] = useState(DEFAULTS.audience);
  const [offer, setOffer] = useState(DEFAULTS.offer);
  const [tone, setTone] = useState(DEFAULTS.tone);
  const [platform, setPlatform] = useState(DEFAULTS.platform);
  const [keywords, setKeywords] = useState(DEFAULTS.keywords);

  // Usage + output
  const [runs, setRuns] = useLocalStorage<number>("hss_runs_v1", 0);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");

  const renderedHtml = useMemo(() => {
    if (!content) return "";
    return marked.parse(content);
  }, [content]);

  // Strip markdown formatting to plain text for copy-only buttons
function stripMarkdown(md: string): string {
  if (!md) return "";

  return md
    // remove fenced code blocks
    .replace(/```[\s\S]*?```/g, "")
    // headings like "## Title" -> "Title"
    .replace(/^\s{0,3}#{1,6}\s+(.+)$/gm, "$1")
    // bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    // inline code backticks
    .replace(/`([^`]+)`/g, "$1")
    // links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // bullet markers at line start: "- something" -> "• something"
    .replace(/^\s*[-*+]\s+/gm, "• ")
    // collapse 3+ blank lines to 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


  // Split the full markdown into "hooks part" and "script part"
  // using the "## Script" heading as the divider.
  function splitHooksAndScript(md: string): { hooksText: string; scriptText: string } {
    if (!md) return { hooksText: "", scriptText: "" };

    const lower = md.toLowerCase();
    const markerIndex = lower.indexOf("## script");

    if (markerIndex === -1) {
      // no Script heading found – treat everything as hooks
      return {
        hooksText: stripMarkdown(md),
        scriptText: "",
      };
    }

    const before = md.slice(0, markerIndex);
    const after = md.slice(markerIndex);

    return {
      hooksText: stripMarkdown(before),
      scriptText: stripMarkdown(after),
    };
  }


  // Auto recent history
  const [history, setHistory] = useLocalStorage<RunSnapshot[]>(HISTORY_KEY, []);

  // Normalize any legacy history entries so they always have a `content` string
    useEffect(() => {
      setHistory((prev) =>
        prev.map((r: any) => ({
          ...r,
          content:
            typeof r.content === "string"
              ? r.content
              : typeof r.html === "string"
              ? r.html
              : "",
         }))
       );
      // we intentionally only want this once on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

  // Saved scripts library
  const [savedRuns, setSavedRuns] = useLocalStorage<SavedRun[]>(
    "hss_saved_v1",
    []
  );

  // UI state
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [selectedSavedRun, setSelectedSavedRun] = useState<SavedRun | null>(
    null
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const outRef = useRef<HTMLDivElement | null>(null);

  const shouldShowOutput =
  loading || content.length > 0 || history.length > 0;


  // Close upgrade modal on ESC
  useEffect(() => {
    if (!showUpgradeModal) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowUpgradeModal(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showUpgradeModal]);

    // Derived script chunks and word count
  const { hooksText, scriptText } = useMemo(
    () => splitHooksAndScript(content),
    [content]
  );

  const wordCount = useMemo(() => {
    if (!content) return 0;
    return content.split(/\s+/).filter(Boolean).length;
  }, [content]);

  const approxSeconds = useMemo(() => {
    if (!wordCount) return 0;
    // ~150 words per minute speaking speed (~2.5 words/sec)
    return Math.round(wordCount / 2.5);
  }, [wordCount]);


  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

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
    const plain = stripMarkdown(content);
    navigator.clipboard.writeText(plain);
  }

  function downloadTxt() {
    if (!content) return;
    const plain = stripMarkdown(content);
    const blob = new Blob([plain], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hook-script.txt";
    a.click();
    URL.revokeObjectURL(url);
  }


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

  const handleLoadSaved = (run: SavedRun) => {
    setNiche(run.niche);
    setAudience(run.audience);
    setOffer(run.offer);
    setTone(run.tone);
    setPlatform(run.platform);
    setKeywords(run.keywords);
    setContent(run.html);
    setShowSavedDrawer(false);

    requestAnimationFrame(() => {
      outRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleCopySaved = (run: SavedRun) => {
    const plain = run.html.replace(/<\/?[^>]+(>|$)/g, "");
    navigator.clipboard?.writeText(plain);
  };

  const formatSavedDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  // ---------------------------------------------------------------------------
  // Generate
  // ---------------------------------------------------------------------------

  async function generate(): Promise<void> {
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

      const data = (await res.json()) as any;
      console.log("🔍 /api/generate response:", data);

      // your API returns the script in `data.content`
      const html = (data.html ?? data.text ?? data.content ?? "").trim();



      // even if html is weirdly empty, mark that we've generated at least once
      setContent(html);
      setRuns((prev) => prev + 1);


      // update recent history
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

  // ---------------------------------------------------------------------------
  // Animations
  // ---------------------------------------------------------------------------

  const stagger = {
    hidden: { opacity: 0, y: 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.04 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0 },
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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

      {/* Hero */}
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
            Generate scroll-stopping hooks, tight 60s scripts, B-roll ideas, and
            CTAs — built for TikTok, Reels, and Shorts.{" "}
            <span className="font-medium">You get 3 free runs</span>, then
            unlock unlimited.
          </p>
        </header>
      </M.div>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-6 pb-10 space-y-6">
                {/* Who it's for / mini marketing card */}
        <GlowCard className="p-5 md:p-6 space-y-3 group">
          <div className="kicker">Built for creators who ship</div>
          <h2 className="font-display text-base font-semibold">
            Hook &amp; Script Studio is perfect if you:
          </h2>

          <ul className="text-xs opacity-80 space-y-1 list-disc list-inside">
            <li>
              Want short-form content ideas without staring at a blank Notion page for an hour.
            </li>
            <li>
              Need <span className="font-medium">hooks, angles, and scripts</span> that match a specific niche &amp; audience.
            </li>
            <li>
              Care more about <span className="font-medium">publishing consistently</span> than tweaking word-by-word forever.
            </li>
          </ul>

          <p className="text-xs opacity-75">
            Drop in your niche, audience, and offer — Hook &amp; Script Studio gives you scroll-stopping hooks,
            a tight 60s script, B-roll ideas, and CTAs you can film today.
          </p>
        </GlowCard>

        
        {/* Quickstart */}
        <GlowCard className="p-5 md:p-6 group">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)] md:items-start">
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
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]",
                loading && "opacity-70"
              )}
              style={{
                background:
                  "color-mix(in oklab, var(--surface-2) 85%, transparent)",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <span className="opacity-70">Free runs used</span>
              <span className="font-medium">{Math.min(runs, 3)} / 3</span>
            </div>
            <span className="opacity-60">
              You get 3 free runs on this device.
            </span>
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
                placeholder="keywords to include"
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
                  <span>Generating {platform} script…</span>
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
            {/* Loading strip */}
            {loading && (
              <M.div
                className="h-[3px] w-full rounded-full overflow-hidden mb-2 bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <M.div
                  className="h-full w-1/3 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                />
              </M.div>
            )}

            <div className="flex items-center justify-between">
              <div className="kicker">Output</div>
              <CopyButton getText={() => content || ""} />
            </div>

            {/* Top actions + new quick-copy row */}
            <div className="space-y-2">
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

              {/* Quick copy row */}
              {content && (hooksText || scriptText) && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] mt-1">
                  <span className="opacity-70">Quick copy:</span>
                  <div className="flex flex-wrap gap-2">
                    {hooksText && (
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(hooksText)
                        }
                        className="btn btn-ghost px-2 py-1"
                      >
                        Hooks & angles
                      </button>
                    )}
                    {scriptText && (
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(scriptText)
                        }
                        className="btn btn-ghost px-2 py-1"
                      >
                        Script only
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tiny meta row */}
              {content && (
                <div className="flex flex-wrap items-center justify-between text-[11px] opacity-60">
                  <span>Formatted script</span>
                  {wordCount > 0 && (
                    <span>
                      ~{wordCount} words
                      {approxSeconds > 0 && ` · ~${approxSeconds}s spoken`}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Body */}
            {loading ? (
              <div className="space-y-2 mt-1">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-5 w-full" />
                <div className="skeleton h-5 w-11/12" />
                <div className="skeleton h-5 w-5/6" />
              </div>
            ) : content ? (
              <article
                className="
                  prose prose-invert prose-sm max-w-none leading-relaxed
                  prose-headings:font-semibold
                  prose-h2:text-[15px] prose-h2:mt-3 prose-h2:mb-1
                  prose-h3:text-[13px] prose-h3:mt-2 prose-h3:mb-1
                  prose-p:my-1
                  prose-ul:my-1 prose-li:my-0.5
                "
                dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
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
              {history.map((run) => {
                // make a human-readable preview of the saved HTML
                const plainPreview = run.content
                  ? run.content
                      .replace(/<\/?[^>]+(>|$)/g, "") // strip HTML tags
                      .slice(0, 120)
                  : "";

                return (
                  <div
                    key={run.id}
                    className="rounded-lg border border-white/5 bg-[color-mix(in_oklab,var(--surface)96%,transparent)] px-3 py-2 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="font-medium line-clamp-1">
                        {run.niche || "Untitled niche"} · {run.platform}
                      </div>
                      <div className="opacity-70 line-clamp-1">
                        {run.audience || "Audience not set"}
                      </div>
                      <div className="opacity-50 text-[11px]">
                        {new Date(run.createdAt).toLocaleString()}
                      </div>
                      <div className="opacity-60 text-[11px] line-clamp-2 mt-1">
                        <span className="font-semibold">Preview: </span>
                        {plainPreview || "(no content saved for this run)"}
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
                          // for our history entries, `content` is the HTML string we want
                          setContent(run.content || "");

                          // keep the output card in view
                          requestAnimationFrame(() => {
                            outRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          });
                        }}
                      >
                        Load output
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        )}


        {/* Saved scripts library card */}
        {savedRuns.length > 0 && (
          <GlowCard className="p-5 mt-6 space-y-3 group">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="kicker">Saved scripts</div>
                <h2 className="font-display text-base font-semibold">
                  Your recent runs
                </h2>
                <p className="text-xs opacity-70 mt-1">
                  Stored on this device only. Great for keeping your favorite
                  hooks and scripts handy.
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
                      {formatSavedDate(run.createdAt)} · {run.platform}
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

        {/* Examples */}
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
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 30,
              mass: 0.25,
            }}
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

      {/* Upgrade modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <M.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <M.div
              className="max-w-sm w-full mx-4 rounded-2xl bg-[color-mix(in_oklab,var(--surface)96%,white)] border border-white/10 p-6 shadow-xl space-y-4"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              <div className="space-y-1">
                <h2 className="font-display text-lg font-semibold">
                  You’ve used your 3 free runs
                </h2>
                <p className="text-sm opacity-75">
                  Thanks for trying Hook &amp; Script Studio! Unlock unlimited
                  hooks, scripts, B-roll ideas, and CTAs with the full version.
                </p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <button
                  className="btn btn-primary w-full !text-white"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    track("paywall_open", { source: "limit_modal" });
                    if (process.env.NEXT_PUBLIC_PAYMENT_LINK) {
                      window.open(
                        process.env.NEXT_PUBLIC_PAYMENT_LINK,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  Upgrade for unlimited scripts
                </button>
                <button
                  className="btn btn-ghost w-full text-xs opacity-80 hover:opacity-100"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Not yet – just close this
                </button>
              </div>

              <p className="text-[11px] opacity-60">
                Free tier is limited per device. Upgrading helps me keep
                building new features for creators. 💜
              </p>
            </M.div>
          </M.div>
        )}
      </AnimatePresence>

      {/* Saved scripts drawer */}
      <AnimatePresence>
        {showSavedDrawer && (
          <>
            <M.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSavedDrawer(false);
                setSelectedSavedRun(null);
              }}
            />

            <M.div
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Saved scripts
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Your hook &amp; script library
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Click a script to preview it, then load it back into the
                    editor or copy the text.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowSavedDrawer(false);
                    setSelectedSavedRun(null);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {savedRuns.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    You haven&apos;t saved anything yet. Generate a script,
                    then hit{" "}
                    <span className="font-medium">Save to library</span>.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {savedRuns.map((run) => (
                        <button
                          key={run.id}
                          type="button"
                          onClick={() => setSelectedSavedRun(run)}
                          className={clsx(
                            "w-full text-left rounded-lg border px-3 py-2 text-xs transition bg-gray-50/80 hover:bg-gray-100",
                            selectedSavedRun?.id === run.id
                              ? "border-purple-500 bg-purple-50/70"
                              : "border-gray-200"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate text-gray-900">
                              {run.niche || "Untitled script"}
                            </span>
                            <span className="text-[11px] text-gray-500 whitespace-nowrap">
                              {formatSavedDate(run.createdAt)}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-gray-600 truncate">
                            {run.offer || run.audience || run.tone}
                          </div>
                          {run.platform && (
                            <div className="mt-1 text-[10px] uppercase tracking-wide text-gray-500">
                              {run.platform}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {selectedSavedRun && (
                      <div className="mt-4 border-t pt-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {selectedSavedRun.niche || "Saved script"}
                            </h3>
                            <p className="text-[11px] text-gray-500">
                              {formatSavedDate(
                                selectedSavedRun.createdAt
                              )}{" "}
                              · {selectedSavedRun.platform}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                handleLoadSaved(selectedSavedRun)
                              }
                              className="btn btn-secondary btn-xs"
                            >
                              Load into editor
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopySaved(selectedSavedRun)
                              }
                              className="btn btn-ghost btn-xs"
                            >
                              Copy text
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSavedRuns((prev) =>
                                  prev.filter(
                                    (r) => r.id !== selectedSavedRun.id
                                  )
                                );
                                setSelectedSavedRun(null);
                              }}
                              className="btn btn-ghost btn-xs text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="border rounded-lg p-3 max-h-[40vh] overflow-y-auto">
                          <div
                            className="prose max-w-none text-sm"
                            dangerouslySetInnerHTML={{
                              __html: selectedSavedRun.html,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {savedRuns.length > 0 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <p className="text-[11px] text-gray-500">
                    Stored on this device only.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedRuns([]);
                      setSelectedSavedRun(null);
                    }}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </M.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

        

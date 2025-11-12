"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { UPDATES } from "../../data/updates";

/**
 * Animated banner that announces the latest version.
 * - Slides/fades in on mount
 * - Dismiss persists per version via localStorage
 */
export default function UpdateBanner() {
  const latest = useMemo(() => UPDATES[0], []);
  const storageKey = `hss_update_banner_v${latest.version}`;
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Show banner unless user dismissed this specific version
    const dismissed = localStorage.getItem(storageKey) === "1";
    setOpen(!dismissed);
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setOpen(false);
  }

  const variants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: -12, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", stiffness: 420, damping: 28 },
        },
        exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={variants}
          className="mx-auto mb-4 max-w-3xl rounded-xl border bg-[color-mix(in_oklab,var(--surface)92%,transparent)] px-4 py-3 text-sm shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="kicker mb-1">Changelog</div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium">
                  v{latest.version} — {latest.title}
                </span>
                <span className="opacity-60">({new Date(latest.date).toLocaleDateString()})</span>
              </div>
              {latest.body ? (
                <p className="mt-1 line-clamp-2 opacity-80">{latest.body}</p>
              ) : null}
              <a
                href="/changelog"
                className="mt-2 inline-flex text-[13px] font-medium text-white/90 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                See what’s new →
              </a>
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss update banner"
              className="btn btn-ghost shrink-0"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


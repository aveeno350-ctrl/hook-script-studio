"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import { UPDATES } from "@/data/updates";

export default function UpdateBanner() {
  // show banner only once per session (simple example)
  const [open, setOpen] = useState(true);

  // take latest update
  const latest = useMemo(() => UPDATES[0], []);
  useEffect(() => {
    // if you want to persist dismissal, wire localStorage here
  }, []);

  if (!open || !latest) return null;

  // ✅ Properly typed framer-motion variants
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: -8,
      filter: "blur(4px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -8,
      filter: "blur(4px)",
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial="hidden"
        animate="show"
        exit="exit"
        variants={variants}
        className="mx-auto mb-4 max-w-3xl rounded-xl border bg-[color-mix(in_oklab,var(--surface)92%,transparent)] px-3 py-2 text-sm shadow"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="truncate">
            <span className="kicker mr-2">What’s new</span>
            <span className="font-medium">{latest.title}</span>
            <span className="opacity-70"> — v{latest.version}</span>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/changelog"
              className="btn btn-secondary !px-3 !py-1 text-xs"
            >
              View all
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="btn btn-ghost !px-3 !py-1 text-xs"
              aria-label="Dismiss update"
            >
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


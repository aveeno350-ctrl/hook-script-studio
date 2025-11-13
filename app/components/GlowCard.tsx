"use client";

import { motion as M } from "framer-motion";
import React from "react";

export default function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <M.div
      whileHover={{ scale: 1.012 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`
        relative rounded-xl border border-white/5
        bg-[color-mix(in_oklab,var(--surface)92%,transparent)]
        shadow-sm
        ${className}
      `}
    >
      {/* glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-40"
        style={{
          boxShadow: "0 0 50px 8px color-mix(in srgb, var(--accent) 40%, transparent)",
        }}
      />

      {/* actual card content */}
      <div className="relative z-10">{children}</div>
    </M.div>
  );
}

"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";

export const M = motion;

export function useMotion() {
  const prefersReduced = useReducedMotion();
  const dur = prefersReduced ? 0 : 0.5;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: dur, ease: "easeOut" } },
  };

  const stagger: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: prefersReduced
        ? { duration: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.35, ease: "easeOut" },
    },
  };

  return { prefersReduced, fadeUp, stagger, item };
}

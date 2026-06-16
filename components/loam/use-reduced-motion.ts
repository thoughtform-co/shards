"use client";

import { useEffect, useState } from "react";

/*
 * useReducedMotion — Loam-local copy so the route segment stays
 * self-contained (no imports from components/operator/*).
 *
 * SSR-safe: starts false so server markup is stable, then flips on the
 * next paint if the user prefers reduced motion. Tracks runtime changes
 * to the media query.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

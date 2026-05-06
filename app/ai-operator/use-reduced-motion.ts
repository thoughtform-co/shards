"use client";

import { useEffect, useState } from "react";

/*
 * useReducedMotion — route-local hook that tracks the
 * `(prefers-reduced-motion: reduce)` media query and updates when the
 * user changes their setting at runtime.
 *
 * SSR-safe: starts as `false` on the server / first client render so
 * the markup is stable, then flips on the next paint if the user
 * prefers reduced motion. Components opt out of motion by reading the
 * boolean and skipping their animation branch.
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

"use client";

import { useEffect } from "react";

/*
 * useScrollFrame — Loam-local copy of the shared single-rAF scroll
 * subscription so the route segment stays self-contained.
 *
 * One global scroll + resize listener, one rAF per frame, fanned out to
 * N subscribers. Each subscriber receives a cached `{ scrollY, vh }` and
 * does its own getBoundingClientRect reads. The listener is created
 * lazily on the first subscriber and torn down when the last leaves.
 *
 * Subscribers must be stable across renders (wrap in useCallback), since
 * the hook re-subscribes whenever the callback identity changes.
 */
export type ScrollFrame = { scrollY: number; vh: number };

type Subscriber = (frame: ScrollFrame) => void;

const subscribers = new Set<Subscriber>();
let raf = 0;
let cleanup: (() => void) | null = null;

function dispatch() {
  raf = 0;
  const frame: ScrollFrame = {
    scrollY: window.scrollY,
    vh: window.innerHeight,
  };
  const snapshot = Array.from(subscribers);
  for (const sub of snapshot) sub(frame);
}

function ensureListener() {
  if (cleanup) return;

  const onChange = () => {
    if (raf !== 0) return;
    raf = window.requestAnimationFrame(dispatch);
  };

  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);

  cleanup = () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
    if (raf !== 0) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    cleanup = null;
  };
}

export function useScrollFrame(callback: Subscriber) {
  useEffect(() => {
    subscribers.add(callback);
    ensureListener();
    callback({ scrollY: window.scrollY, vh: window.innerHeight });

    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0 && cleanup) cleanup();
    };
  }, [callback]);
}

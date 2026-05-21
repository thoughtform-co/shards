"use client";

import { useEffect } from "react";

/*
 * useScrollFrame — single shared scroll/resize subscription with one
 * rAF per frame, fanned out to N subscribers.
 *
 * The homepage has multiple components that each want to react to
 * scroll: headless-shift (parallax pin) and software-for-few
 * (parallax pin) today, plus any future scroll-driven beats.
 * Before this hook each one registered its own scroll + resize
 * listeners and its own rAF debouncer, meaning a fast scroll fired
 * N rAF callbacks per frame and read `window.innerHeight` N times.
 *
 * This hook flips that: one global scroll listener, one global
 * resize listener, one rAF per frame. Each subscriber receives a
 * cached `{ scrollY, vh }` and does its own `getBoundingClientRect()`
 * reads (those can't be shared — different elements). The shared
 * listener is created lazily on the first subscriber and torn down
 * when the last unsubscribes.
 *
 * Subscribers must be stable across renders (wrap in `useCallback`
 * upstream); the hook re-subscribes whenever the callback identity
 * changes, so an unstable callback would tear down + re-create the
 * listener on every render.
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
  /* Snapshot to a new array so a subscriber that unsubscribes during
     dispatch doesn't mutate the iteration. */
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
    /* Prime the subscriber once at mount so it can compute initial
       state without waiting for the first scroll/resize event.
       Mirrors the `update()` / `onScroll()` calls each component
       used to make on mount before this hook existed. */
    callback({ scrollY: window.scrollY, vh: window.innerHeight });

    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0 && cleanup) cleanup();
    };
  }, [callback]);
}

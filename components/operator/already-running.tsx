"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { alreadyRunningSection } from "@/content/operator";
import { useScrollFrame, type ScrollFrame } from "./use-scroll-frame";

/*
 * AlreadyRunning — minimalist pivot quote between Signal (industry
 * FOMO) and the engine-pattern carousel.
 *
 * Tone: Benedict-Evans-style editorial pull. Free-standing italic
 * display quote, hairline + mono-caps attribution. No card chrome,
 * no eyebrow. The section is the rhetorical turning point that
 * lands the move from "the labs just bet billions" to "we already
 * have it running here, let's scale it before they sell it back to
 * us."
 *
 * Parallax pair (mirrors `headless-shift.tsx`):
 *   The wrapper `.aiop-signal-and-already` holds `<Signal />` +
 *   this section as siblings. While Signal is in the freeze window
 *   this component writes a `translateY` to the sibling so the
 *   FOMO news cards read as held in place; the pivot quote then
 *   rises up over them — visually says "luckily, we already have
 *   this." Below 960px or under `prefers-reduced-motion: reduce`,
 *   both sections render as a normal stack.
 */
export function AlreadyRunning() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  /* ─── Detect viewport + motion preference ─── */
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(min-width: 960px)");

    const update = () => {
      setAnimated(!motionMq.matches && widthMq.matches);
    };

    update();

    motionMq.addEventListener("change", update);
    widthMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      widthMq.removeEventListener("change", update);
    };
  }, []);

  /* Cleanup helper held in a ref so the setup effect's cleanup
     path can call it when `animated` flips off or the component
     unmounts. Same shape as headless-shift.tsx. */
  const resetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(".aiop-signal-and-already");
    const signal = wrapper?.querySelector<HTMLElement>(".aiop-signal");

    resetRef.current = () => {
      node.style.removeProperty("--aiop-already-progress");
      node.style.transform = "";
      if (signal) signal.style.transform = "";
    };

    if (!animated) {
      resetRef.current();
    }

    return () => {
      resetRef.current?.();
      resetRef.current = null;
    };
  }, [animated]);

  /* ─── Per-frame measurement + writes ─── */
  const measure = useCallback(
    (frame: ScrollFrame) => {
      if (!animated) return;
      const node = sectionRef.current;
      if (!node) return;

      const wrapper = node.closest<HTMLElement>(".aiop-signal-and-already");
      const signal = wrapper?.querySelector<HTMLElement>(".aiop-signal");

      if (!wrapper || !signal) {
        const rect = node.getBoundingClientRect();
        const total = rect.height + frame.vh;
        const traveled = frame.vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-already-progress", p.toFixed(4));
        return;
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      const signalBottomInVH = wrapperRect.top + signal.offsetHeight;

      const total = node.offsetHeight + frame.vh;
      const traveled = frame.vh - signalBottomInVH;
      const p = Math.max(0, Math.min(1, traveled / total));
      node.style.setProperty("--aiop-already-progress", p.toFixed(4));

      const freezeNeeded = frame.vh - signalBottomInVH;
      const maxFreeze = wrapper.offsetHeight - signal.offsetHeight;
      const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

      signal.style.transform =
        freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

      /* Entry buffer: hold the pivot quote in place for a brief
         beat after Signal fully freezes so Signal's last news card
         stays readable before the quote begins rising. Mirrors the
         buffer in headless-shift.tsx. */
      const entryBuffer = Math.min(140, frame.vh * 0.13);
      const cap = Math.min(entryBuffer, maxFreeze * 0.6);
      let hold = 0;
      if (freeze > 0 && cap > 0) {
        if (freeze <= cap) {
          hold = freeze;
        } else if (maxFreeze > cap) {
          const phase2Span = maxFreeze - cap;
          const phase2Progress = (freeze - cap) / phase2Span;
          hold = cap * (1 - phase2Progress);
        }
      }
      node.style.transform = hold > 0 ? `translate3d(0, ${hold}px, 0)` : "";
    },
    [animated],
  );

  useScrollFrame(measure);

  /* `attribName` and `attribMeta` stay in the static config so a
     future iteration can re-introduce a byline without a content
     change. The current page reads as collective Loop voice — the
     pivot quote lands as the editorial register of the whole
     section, not a personal attribution. */
  const { id, ariaLabel, lead, accent } = alreadyRunningSection;

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-already-running${
        animated ? " is-animated" : ""
      }`}
      id={id}
      aria-label={ariaLabel}
    >
      <div className="aiop-already-running__bleed" aria-hidden="true">
        <span className="aiop-already-running__wash aiop-already-running__wash--a" />
        <span className="aiop-already-running__wash aiop-already-running__wash--b" />
        <span className="aiop-already-running__wash aiop-already-running__wash--c" />
        <span className="aiop-already-running__grid" />
      </div>

      <div className="aiop-wrap aiop-already-running__inner aiop-reveal">
        <blockquote className="aiop-already-running__pull">
          <span
            className="aiop-already-running__pull-mark"
            aria-hidden="true"
          >
            {"\u275D"}
          </span>
          <p>
            <strong>{lead}</strong>{" "}
            <em>{accent}</em>
          </p>
        </blockquote>
      </div>
    </section>
  );
}

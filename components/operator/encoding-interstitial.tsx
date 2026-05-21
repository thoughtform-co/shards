"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useScrollFrame, type ScrollFrame } from "./use-scroll-frame";

/*
 * EncodingInterstitial — parallax-pair companion to <Approach />.
 *
 * Mirrors the choreography in `software-for-few.tsx` so the
 * /intelligence-layer deep-dive plays the same parallax trick the
 * homepage does, only one beat earlier in the flow:
 *
 *   Approach (the AI flywheel) ─┐
 *                                ├─ parallax pair via .aiop-approach-and-encoding
 *   EncodingInterstitial ────────┘
 *
 * Approach freezes during the phase where its last viewport would
 * scroll past, while this interstitial rises up over it as the
 * visitor scrolls. Below 960px or under `prefers-reduced-motion:
 * reduce`, both render as a normal stack.
 *
 * The lane the section claims is ENCODE — the middle motion of the
 * flywheel — so the gradient palette leans sage (encoded substrate)
 * with a warm amber lower-half (curated, preserved). This is
 * intentionally a different palette than:
 *   - the violet→paper→sage EnginePattern bleed above (which reads
 *     as the receipts under the navigate→encode arc), and
 *   - the paper/gold SoftwareForFew interstitial further below
 *     (which reads as the BUILD lane closing the flywheel).
 *
 * Content is fully embedded — no content-module dependency — so the
 * route page can drop the component in next to <Approach /> and
 * read like an editorial pivot rather than a config-driven block.
 */

const ENCODING_COPY = {
  phase: "Encode",
  /* The interstitial leads the encoding deep-dive that follows
   * (TheShift + DegreesOfFreedom). v2 title shortens to a single
   * editorial phrase — "encode it once, inside the work" — that
   * names where the encoding happens (in the actual workflow, not
   * as a separate document exercise). The body names what gets
   * encoded — the judgment that today lives in heads — so the
   * next section (TheShift) lands as the close-up of HOW that
   * encoding plays out, not a re-statement of the same headline. */
  title: "Encode it once,",
  titleEm: "inside the work.",
  body: "What gets encoded is the judgment people carry in their heads: how they decide, what good looks like, where to push back. Every new team picks up from there instead of starting from zero.",
  rows: [
    {
      id: "bottleneck",
      label: "Bottleneck",
      detail: "Rule sprawl gives way to four canonical axes the model retrieves before authorship.",
      tag: "AXES",
      highlight: true,
    },
    {
      id: "taste",
      label: "Taste",
      detail: "Memory becomes a registry of golden nuggets \u2014 named, attributed, versioned alongside the Skill.",
      tag: "REGISTRY",
    },
    {
      id: "delivery",
      label: "Delivery",
      detail: "Ad-hoc judgment becomes versioned substrate; the next model wins on cheaper inference, not a fresh start.",
      tag: "VERSIONED",
    },
  ],
} as const;

export function EncodingInterstitial() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

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

  /* Reset helper held in a ref so the setup effect's cleanup path
     can call it when `animated` flips off or the component
     unmounts. Same shape as software-for-few.tsx. */
  const resetRef = useRef<(() => void) | null>(null);

  /*
   * Two wrapper shapes are supported:
   *
   *   - `.aiop-approach-and-encoding` (canonical homepage `/`): the
   *     freeze target is the `.aiop-approach` sibling so the AI
   *     flywheel deep dive freezes while the interstitial slides
   *     up over it.
   *
   *   - `.aiop-encoding-pair` (e.g. `/claude-workshop-v1`): the
   *     freeze target is the first element child of the wrapper
   *     that isn't the encoding section itself. Lets a route that
   *     has its own chapter above EncodingInterstitial (the
   *     Anthropic Claude chapter on the workshop fork) freeze
   *     that chapter as a single block during the slide-over.
   *
   * If neither wrapper or freeze target is present the section
   * still self-progresses its `--aiop-encoding-progress` variable
   * from its own scroll position. */
  const findPair = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return { wrapper: null as HTMLElement | null, target: null as HTMLElement | null };

    const wrapper =
      node.closest<HTMLElement>(".aiop-approach-and-encoding") ??
      node.closest<HTMLElement>(".aiop-encoding-pair");

    if (!wrapper) return { wrapper: null, target: null };

    const approachTarget = wrapper.querySelector<HTMLElement>(".aiop-approach");
    if (approachTarget) return { wrapper, target: approachTarget };

    const siblingTarget = (Array.from(wrapper.children) as HTMLElement[]).find(
      (child) => child !== node,
    );
    return { wrapper, target: siblingTarget ?? null };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const { target } = findPair();

    resetRef.current = () => {
      node.style.removeProperty("--aiop-encoding-progress");
      node.style.transform = "";
      if (target) target.style.transform = "";
    };

    if (!animated) {
      resetRef.current();
    }

    return () => {
      resetRef.current?.();
      resetRef.current = null;
    };
  }, [animated, findPair]);

  const measure = useCallback(
    (frame: ScrollFrame) => {
      if (!animated) return;
      const node = sectionRef.current;
      if (!node) return;

      const { wrapper, target } = findPair();

      if (!wrapper || !target) {
        const rect = node.getBoundingClientRect();
        const total = rect.height + frame.vh;
        const traveled = frame.vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-encoding-progress", p.toFixed(4));
        return;
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      const apBottomInVH = wrapperRect.top + target.offsetHeight;

      const total = node.offsetHeight + frame.vh;
      const traveled = frame.vh - apBottomInVH;
      const p = Math.max(0, Math.min(1, traveled / total));
      node.style.setProperty("--aiop-encoding-progress", p.toFixed(4));

      const freezeNeeded = frame.vh - apBottomInVH;
      const maxFreeze = wrapper.offsetHeight - target.offsetHeight;
      const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

      target.style.transform =
        freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

      /* Entry buffer + Phase 2 release — same shape as
         software-for-few.tsx. Holds the interstitial in place for a
         brief beat after Approach freezes so the previous chapter's
         last viewport stays readable before the slide-up begins. */
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
    [animated, findPair],
  );

  useScrollFrame(measure);

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-encoding${animated ? " is-animated" : ""}`}
      id="encoding"
      aria-labelledby="aiop-encoding-title"
    >
      <div className="aiop-encoding__bleed" aria-hidden="true">
        <span className="aiop-encoding__wash aiop-encoding__wash--a" />
        <span className="aiop-encoding__wash aiop-encoding__wash--b" />
        <span className="aiop-encoding__grid" />
      </div>

      <div className="aiop-wrap aiop-encoding__inner">
        <div className="aiop-encoding__copy aiop-reveal">
          {/* Phase pill — names the flywheel motion this section
              belongs to. EncodingInterstitial sits between Approach
              (the full flywheel) and TheShift / DegreesOfFreedom
              (the encoded substrate up close), so the pill anchors
              the lane and the gradient palette underneath. Sage
              matches the Encode lane. */}
          <span className="aiop-encoding__phase" aria-label="Flywheel phase">
            <span className="aiop-term-pill aiop-term-pill--encode">
              <span className="aiop-term-pill__dot" aria-hidden="true" />
              {ENCODING_COPY.phase}
            </span>
          </span>
          <h2
            className="aiop-section-title aiop-encoding__title"
            id="aiop-encoding-title"
          >
            {ENCODING_COPY.title}{" "}
            <em className="aiop-encoding__title-em">
              {ENCODING_COPY.titleEm}
            </em>
          </h2>
          <p className="aiop-encoding__body">{ENCODING_COPY.body}</p>
        </div>

        <div className="aiop-encoding__card aiop-reveal" role="presentation">
          <ul className="aiop-encoding__rows" role="list">
            {ENCODING_COPY.rows.map((row) => (
              <li
                key={row.id}
                className={`aiop-encoding__row${
                  "highlight" in row && row.highlight
                    ? " aiop-encoding__row--highlight"
                    : ""
                }`}
              >
                <span className="aiop-encoding__row-label">{row.label}</span>
                <span className="aiop-encoding__row-detail">{row.detail}</span>
                <span className="aiop-encoding__row-tag">{row.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

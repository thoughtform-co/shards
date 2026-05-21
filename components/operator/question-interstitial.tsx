"use client";

import { useEffect, useRef, useState } from "react";

import { pageQuestionInterstitialSection } from "@/content/intelligence-layer";

/*
 * QuestionInterstitial — interlude between The Engine (live demo)
 * and Vision (the flywheel that explains how teams get there).
 *
 * Composition:
 *
 *   1. Atmospheric bleed (three soft lane-tinted washes + faint
 *      grid) so the section reads as a calm chapter break rather
 *      than another data slab.
 *
 *   2. A single editorial question, set in italic display type,
 *      centred and sized as the visual hero of the section.
 *
 *   3. A small mono-caps eyebrow above the question ("Interlude")
 *      so the marker reads as meta, not as a section title.
 *
 *   4. A delayed parenthetical that reveals via scroll-driven
 *      opacity. The visitor sees the question alone first; the
 *      punchline arrives a beat later as they begin to scroll past.
 *
 * Choreography (parallax-reveal pair with the next sibling):
 *
 *   On viewports >= 960px without `prefers-reduced-motion: reduce`
 *   this section is wrapped by `.aiop-question-and-vision` in
 *   `app/page.tsx`, paired with the Vision flywheel section. While
 *   the interlude scrolls past, this component:
 *
 *     - writes a `translateY` onto the section itself that
 *       compensates for scroll exactly, so the interlude stays
 *       visually frozen while the wrapper's scroll length elapses;
 *     - writes `--aiop-question-progress` (0..1) onto the wrapper
 *       so CSS can softly recede the question and fade the
 *       parenthetical in as one cohesive frame;
 *     - writes `--aiop-vision-hold` onto the wrapper in two phases
 *       so Vision stays put long enough for the parenthetical to
 *       be read, then slides up over the frozen interlude and
 *       returns to its natural document position before the freeze
 *       caps (otherwise Vision would extend below its natural
 *       bottom and the next section would paint over it).
 *
 *   Below 960px or under `prefers-reduced-motion: reduce` the
 *   freeze is skipped: the section stacks normally, the question
 *   reads as a static editorial slab, and the parenthetical
 *   renders inline beneath it.
 *
 * Modelled on the Shards `QuoteBridge` choreography pattern (same
 * rAF-batched scroll handler, same reset-on-cleanup, same
 * media-query gates) but stripped of the third-party attribution
 * and the inline lane chips. The question here is Loop's own
 * voice — short enough that lane-coloured chips would clutter the
 * line rather than preview the flywheel.
 */

export type QuestionInterstitialProps = {
  /* Optional override for the delayed parenthetical. Defaults to
     `pageQuestionInterstitialSection.scrollNote`. Pass an empty
     string to suppress the note entirely; in that case the
     `--aiop-question-progress`-driven CSS rule is a no-op because
     the target element isn't in the DOM. */
  scrollNote?: string;
};

export function QuestionInterstitial({
  scrollNote,
}: QuestionInterstitialProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  const resolvedScrollNote =
    scrollNote ?? pageQuestionInterstitialSection.scrollNote;

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

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(".aiop-question-and-vision");

    const reset = () => {
      if (wrapper) {
        wrapper.style.removeProperty("--aiop-question-progress");
        wrapper.style.removeProperty("--aiop-vision-hold");
      }
      node.style.transform = "";
    };

    if (!animated) {
      reset();
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!wrapper) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const vh = window.innerHeight;

        /* Keep the interlude visually frozen with a `translateY`
           that compensates for scroll exactly while the next
           sibling (Vision) slides up over it. Freeze starts when
           the interlude's bottom would scroll above viewport
           bottom, ends when the wrapper's bottom reaches viewport
           bottom. */
        const interludeBottomInVH = wrapperRect.top + node.offsetHeight;
        const freezeNeeded = vh - interludeBottomInVH;
        const maxFreeze = wrapper.offsetHeight - node.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        node.style.transform =
          freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

        /* Progress = freeze ratio. 0 = interlude has just begun to
           freeze (question at full opacity, note hidden); 1 =
           wrapper bottom has reached viewport bottom (question
           softly recessed, note fully revealed, Vision fully
           covering). */
        const p = maxFreeze > 0 ? freeze / maxFreeze : 0;
        wrapper.style.setProperty("--aiop-question-progress", p.toFixed(4));

        /* Two-phase hold for Vision so the parenthetical has scroll
           length to be read before Vision rises far enough to
           occlude it:
             - Phase 1 (freeze 0 -> ~180px): the hold mirrors the
               interlude's translation, keeping Vision visually
               stationary at its below-viewport starting position.
             - Phase 2 (~180px -> 100% of maxFreeze): the hold
               linearly releases back to 0 so Vision returns to its
               natural document position by the time the freeze
               caps. Without the release, Vision's visual box would
               stay translated down past its natural bottom and the
               section after it would paint over Vision's lower
               content. */
        const visionBuffer = Math.min(180, vh * 0.18);
        /* Cap at 60% of maxFreeze to guarantee a Phase 2 release
           distance even on unusually short wrappers. */
        const visionHoldMax = Math.min(visionBuffer, maxFreeze * 0.6);
        let visionHold = 0;
        if (freeze > 0 && visionHoldMax > 0) {
          if (freeze <= visionHoldMax) {
            visionHold = freeze;
          } else if (maxFreeze > visionHoldMax) {
            const phase2Span = maxFreeze - visionHoldMax;
            const phase2Progress = (freeze - visionHoldMax) / phase2Span;
            visionHold = visionHoldMax * (1 - phase2Progress);
          }
        }
        wrapper.style.setProperty(
          "--aiop-vision-hold",
          `${visionHold.toFixed(2)}px`,
        );
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      reset();
    };
  }, [animated]);

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-question-bridge${animated ? " is-animated" : ""}`}
      id={pageQuestionInterstitialSection.id}
      aria-labelledby="aiop-question-bridge-q"
      aria-label={pageQuestionInterstitialSection.ariaLabel}
    >
      <div className="aiop-question-bridge__bleed" aria-hidden="true">
        <span className="aiop-question-bridge__wash aiop-question-bridge__wash--a" />
        <span className="aiop-question-bridge__wash aiop-question-bridge__wash--b" />
        <span className="aiop-question-bridge__wash aiop-question-bridge__wash--c" />
        <span className="aiop-question-bridge__grid" />
      </div>

      <div className="aiop-wrap aiop-question-bridge__inner">
        <figure className="aiop-question-bridge__figure aiop-reveal">
          {pageQuestionInterstitialSection.eyebrow ? (
            <p
              className="aiop-question-bridge__eyebrow"
              aria-hidden="true"
            >
              {pageQuestionInterstitialSection.eyebrow}
            </p>
          ) : null}

          <blockquote
            id="aiop-question-bridge-q"
            className="aiop-question-bridge__pull"
          >
            {pageQuestionInterstitialSection.question}
          </blockquote>

          {pageQuestionInterstitialSection.subline ? (
            <p className="aiop-question-bridge__subline">
              {pageQuestionInterstitialSection.subline}
            </p>
          ) : null}

          {resolvedScrollNote ? (
            <p className="aiop-question-bridge__scroll-note">
              <span
                className="aiop-question-bridge__scroll-note-bracket"
                aria-hidden="true"
              >
                (
              </span>
              {resolvedScrollNote}
              <span
                className="aiop-question-bridge__scroll-note-bracket"
                aria-hidden="true"
              >
                )
              </span>
            </p>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

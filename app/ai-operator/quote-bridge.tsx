"use client";

import { useEffect, useRef, useState } from "react";

import { quoteBridgeSection } from "./content";

/*
 * QuoteBridge — interstitial between the diagnosis and the reality
 * check that bridges into the flywheel.
 *
 * Anchors the framework to a credible outside voice (Benedict Evans on
 * the asking gap). The Evans sentence renders as the editorial
 * centerpiece; three operative phrases inside it — `working out`,
 * `how to ask`, `what you want` — are framed as subtle bordered chips
 * in their lane colour (violet / amber / sage). A delayed parenthetical
 * `(because AI isn't software)` sits below the attribution and arrives
 * as the visitor begins to scroll past the bridge.
 *
 * On desktop the section is paired with the Reality-check
 * interstitial via the `.aiop-bridge-and-reality` parallax-reveal
 * wrapper. The bridge is held visually frozen by a `translateY` that
 * compensates for scroll exactly while the next sibling (Reality
 * check) slides up over it through natural flow. The slide-up itself
 * is split into two phases via a second CSS variable
 * `--aiop-reality-hold` that the same scroll handler writes onto the
 * wrapper:
 *
 *   - Phase 1 (first ~35% of the freeze): mirror the bridge's
 *     translation onto Reality so it stays visually stationary at its
 *     initial below-viewport position. This gives the parenthetical
 *     scroll length to be read before the parallax begins.
 *   - Phase 2 (remaining ~65%): the hold linearly releases back to 0
 *     so Reality slides up over the frozen bridge AND returns to its
 *     natural document position by the time the freeze caps. The
 *     release is necessary because the next section (Vision) lives
 *     outside the wrapper and isn't translated; without the release
 *     Reality's visual box would extend past its natural bottom and
 *     Vision would paint over the lower portion of Reality (clipping
 *     the spectrum sub-text).
 *
 * During the freeze the handler also writes `--aiop-bridge-progress`
 * (0..1) onto the wrapper, and CSS uses that variable to:
 *
 *   - softly recede the quote, its three lane chips, and the
 *     attribution to a quieter opacity (they never disappear, and
 *     the chips do NOT morph into pills);
 *   - reveal the parenthetical "(because AI isn't software)" a beat
 *     later so it lands after the quote starts to fade.
 *
 * Earlier iterations morphed each chip in place into its Navigate /
 * Encode / Build pill counterpart and even flew the morphed pills
 * from the bridge into the Vision orbit via a fixed-position handoff
 * layer. Both have been intentionally removed: the chips remain as
 * bordered editorial marks throughout the scroll, and the Vision
 * orbit now appears as a calm next chapter after the Reality check.
 *
 * Below 960px or under `prefers-reduced-motion: reduce` the scroll-
 * coupled fade and reveal are skipped: the chips render exactly as
 * today, the parenthetical note renders as a normal static line below
 * the attribution, and the section keeps its single-viewport flex
 * centering.
 *
 * Choreography mirrors `software-for-few.tsx`: same media-query gates,
 * same rAF-batched scroll handler, same reset-on-cleanup pattern.
 */

export type QuoteBridgeProps = {
  /* Optional override for the delayed parenthetical that appears
   * below the attribution. Defaults to `quoteBridgeSection.scrollNote`
   * so v1 keeps its current behaviour. v3 passes an empty string to
   * suppress the line entirely — by then the lens section above has
   * already named the new category, so Evans stands alone.
   *
   * When the resolved value is empty, the `<p>` block is skipped at
   * render and CSS rules tied to `--aiop-bridge-progress` no-op
   * because the element they target isn't in the DOM. */
  scrollNote?: string;
};

export function QuoteBridge({ scrollNote }: QuoteBridgeProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  const resolvedScrollNote =
    scrollNote ?? quoteBridgeSection.scrollNote;

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

    const wrapper = node.closest<HTMLElement>(".aiop-bridge-and-reality");

    const reset = () => {
      if (wrapper) {
        wrapper.style.removeProperty("--aiop-bridge-progress");
        wrapper.style.removeProperty("--aiop-reality-hold");
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

        // Mirror the parallax-reveal pattern from `software-for-few.tsx`:
        // keep the bridge visually frozen with a `translateY` that
        // compensates for scroll exactly while the next section
        // (Reality check) slides up over it. Freeze starts when the
        // bridge's bottom would scroll above viewport bottom, ends
        // when the wrapper's bottom reaches viewport bottom.
        const bridgeBottomInVH = wrapperRect.top + node.offsetHeight;
        const freezeNeeded = vh - bridgeBottomInVH;
        const maxFreeze = wrapper.offsetHeight - node.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        node.style.transform =
          freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

        // Progress = freeze ratio. 0 = bridge has just begun to freeze
        // (quote and chips at full opacity, parenthetical hidden);
        // 1 = wrapper bottom has reached viewport bottom (quote softly
        // recessed, parenthetical fully revealed, Reality fully covering).
        const p = maxFreeze > 0 ? freeze / maxFreeze : 0;
        wrapper.style.setProperty("--aiop-bridge-progress", p.toFixed(4));

        // Phase 1 hold for the Reality interstitial — kept aligned
        // with the entry-buffer pattern used by the other parallax
        // pairs on this page (`software-for-few.tsx`,
        // `headless-shift.tsx`, `stripe-reflect.tsx`):
        //   - Phase 1 (freeze 0 -> ~180px): the hold mirrors the
        //     bridge's translation, keeping Reality visually
        //     stationary at its below-viewport starting position so
        //     the parenthetical "(because AI isn't software)" has
        //     scroll length to be read. Slightly longer than the
        //     other parallax pairs' buffer (~140px) because the
        //     parenthetical's fade-in window has to complete before
        //     Reality rises far enough to occlude it.
        //   - Phase 2 (~180px -> 100% of maxFreeze): the hold
        //     linearly releases back to 0 so Reality returns to its
        //     natural document position by the time the freeze
        //     caps. Without this release, Reality's visual box
        //     would stay translated down past its natural bottom
        //     and the next section (Vision) would paint over the
        //     lower portion of Reality (clipping the spectrum
        //     sub-text).
        // Earlier this was anchored to `0.35 * maxFreeze`, which
        // scaled with viewport height and could feel slow on tall
        // monitors. Pixel-anchoring it keeps the cadence consistent
        // across viewports and aligned with the other three pairs.
        const realityBuffer = Math.min(180, vh * 0.18);
        // Cap at 60% of maxFreeze to guarantee a Phase 2 release
        // distance even on unusually short wrappers.
        const realityHoldMax = Math.min(realityBuffer, maxFreeze * 0.6);
        let realityHold = 0;
        if (freeze > 0 && realityHoldMax > 0) {
          if (freeze <= realityHoldMax) {
            realityHold = freeze;
          } else if (maxFreeze > realityHoldMax) {
            const phase2Span = maxFreeze - realityHoldMax;
            const phase2Progress = (freeze - realityHoldMax) / phase2Span;
            realityHold = realityHoldMax * (1 - phase2Progress);
          }
        }
        wrapper.style.setProperty(
          "--aiop-reality-hold",
          `${realityHold.toFixed(2)}px`,
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
    <>
      <section
        ref={sectionRef}
        className={`aiop-section aiop-bridge${animated ? " is-animated" : ""}`}
        id="bridge"
        aria-labelledby="aiop-bridge-quote"
      >
        <div className="aiop-bridge__bleed" aria-hidden="true">
          <span className="aiop-bridge__wash aiop-bridge__wash--a" />
          <span className="aiop-bridge__wash aiop-bridge__wash--b" />
          <span className="aiop-bridge__wash aiop-bridge__wash--c" />
          <span className="aiop-bridge__grid" />
        </div>

        <div className="aiop-wrap aiop-bridge__inner">
          <figure className="aiop-bridge__quote aiop-reveal">
            <blockquote
              id="aiop-bridge-quote"
              className="aiop-bridge__pull"
            >
              <span
                className="aiop-bridge__pull-mark aiop-bridge__plain"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              {quoteBridgeSection.quoteParts.map((part, idx) =>
                part.mark && part.pill ? (
                  <span
                    key={idx}
                    className={`aiop-bridge__mark aiop-bridge__mark--${part.mark}`}
                    data-aiop-phase={part.mark}
                  >
                    <span className="aiop-bridge__mark-text">{part.text}</span>
                    <span className="aiop-bridge__mark-pill" aria-hidden="true">
                      <span className="aiop-bridge__mark-dot" />
                      <span className="aiop-bridge__mark-pill-name">
                        {part.pill}
                      </span>
                    </span>
                  </span>
                ) : (
                  <span key={idx} className="aiop-bridge__plain">
                    {part.text}
                  </span>
                ),
              )}
            </blockquote>

            {/* Attribution + delayed parenthetical sit in a tight sub-
                block so the note snuggles below the attribution rather
                than picking up the figure's larger inter-row gap. */}
            <div className="aiop-bridge__attrib-block">
              <figcaption className="aiop-bridge__attrib">
                <span className="aiop-bridge__attrib-rule" aria-hidden="true" />
                <span className="aiop-bridge__attrib-name">
                  {quoteBridgeSection.attribName}
                </span>
                <span className="aiop-bridge__attrib-meta">
                  {quoteBridgeSection.attribMeta}
                </span>
              </figcaption>

              {/* Delayed parenthetical punchline. On desktop its opacity
                  is driven from `--aiop-bridge-progress` in CSS so it
                  stays hidden on first view and arrives a beat after
                  the quote + attribution have settled. Under reduced
                  motion / narrow viewports it renders as a static line
                  directly below the attribution. The brackets are
                  presentational so the source string stays clean.
                  Skipped entirely when `scrollNote=""` is passed (v3),
                  so Evans stands alone with the attribution below. */}
              {resolvedScrollNote ? (
                <p className="aiop-bridge__scroll-note">
                  <span
                    className="aiop-bridge__scroll-note-bracket"
                    aria-hidden="true"
                  >
                    (
                  </span>
                  {resolvedScrollNote}
                  <span
                    className="aiop-bridge__scroll-note-bracket"
                    aria-hidden="true"
                  >
                    )
                  </span>
                </p>
              ) : null}
            </div>
          </figure>
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import { quoteBridgeSection } from "./content";

/*
 * QuoteBridge — full-viewport interstitial between the hero and the
 * Navigate / Encode / Build flywheel.
 *
 * Anchors the framework to a credible outside diagnosis (Benedict Evans
 * on the asking gap). The Evans sentence renders as the editorial
 * centerpiece; three operative phrases inside it — `working out`,
 * `how to ask`, `what you want` — are framed as subtle bordered chips
 * in their lane colour (violet / amber / sage).
 *
 * On desktop the section is given extra height (~220vh) and its inner
 * content sticky-pins for one viewport. During that pinned phase the
 * scroll handler writes `--aiop-bridge-progress` (0..1) onto the
 * section, and CSS uses that variable to:
 *
 *   - Cross-fade each chip's quote text into its pill label
 *     ("working out" -> "Navigate", etc.)
 *   - Round the chip's border-radius and grow its padding into the
 *     orbit pill chrome
 *   - Fade the chip dot in
 *   - Fade the surrounding quote plain text out so only the morphed
 *     pills remain visible as the bridge releases
 *
 * Below 960px or under `prefers-reduced-motion: reduce` the morph is
 * skipped: the pill layer is hidden, the chips render exactly as today,
 * and the section keeps its single-viewport flex centering.
 *
 * Choreography mirrors `software-for-few.tsx`: same media-query gates,
 * same rAF-batched scroll handler, same reset-on-cleanup pattern.
 */
export function QuoteBridge() {
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

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(".aiop-bridge-and-vision");

    const reset = () => {
      node.style.removeProperty("--aiop-bridge-progress");
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
        // (Vision) slides up over it. Freeze starts when the bridge's
        // bottom would scroll above viewport bottom, ends when the
        // wrapper's bottom reaches viewport bottom.
        const bridgeBottomInVH = wrapperRect.top + node.offsetHeight;
        const freezeNeeded = vh - bridgeBottomInVH;
        const maxFreeze = wrapper.offsetHeight - node.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        node.style.transform =
          freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

        // Morph progress = freeze ratio. 0 = bridge has just begun to
        // freeze (chips fully visible); 1 = vision has fully covered
        // the bridge (chips fully resolved as pills).
        const p = maxFreeze > 0 ? freeze / maxFreeze : 0;
        node.style.setProperty("--aiop-bridge-progress", p.toFixed(4));
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

          <figcaption className="aiop-bridge__attrib">
            <span className="aiop-bridge__attrib-rule" aria-hidden="true" />
            <span className="aiop-bridge__attrib-name">
              {quoteBridgeSection.attribName}
            </span>
            <span className="aiop-bridge__attrib-meta">
              {quoteBridgeSection.attribMeta}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

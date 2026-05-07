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
 * wrapper, and CSS uses that variable to:
 *
 *   - Cross-fade each chip's quote text into its pill label
 *     ("working out" -> "Navigate", etc.)
 *   - Round the chip's border-radius and grow its padding into the
 *     orbit pill chrome
 *   - Fade the chip dot in
 *   - Fade the surrounding quote plain text out so only the morphed
 *     pills remain visible as the bridge releases
 *
 * After the in-place morph completes (~progress 0.5), a fixed-position
 * handoff layer takes over: three handoff pills physically translate
 * from each chip's screen position to the destination orbit pill in
 * Vision. JS measures both endpoints on every scroll tick and writes
 * the interpolated centre into each handoff pill via CSS variables, so
 * the pills travel from quote to orbit while the bridge stays frozen
 * and Vision slides up underneath. The Vision orbit pills themselves
 * stay invisible until the handoff lands and fades them in (~progress
 * 0.85), so the visitor never sees a clipped pill behind Vision and
 * never sees a duplicate pill on top of one another.
 *
 * Below 960px or under `prefers-reduced-motion: reduce` the morph and
 * handoff are skipped: the handoff layer is not rendered, the chips
 * render exactly as today, the orbit pills are visible by default, and
 * the section keeps its single-viewport flex centering.
 *
 * Choreography mirrors `software-for-few.tsx`: same media-query gates,
 * same rAF-batched scroll handler, same reset-on-cleanup pattern.
 */

const HANDOFF_PHASES = ["navigate", "encode", "build"] as const;
type HandoffPhase = (typeof HANDOFF_PHASES)[number];

const HANDOFF_LABEL: Record<HandoffPhase, string> = {
  navigate: "Navigate",
  encode: "Encode",
  build: "Build",
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function QuoteBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const handoffPillRefs = useRef<Record<HandoffPhase, HTMLSpanElement | null>>({
    navigate: null,
    encode: null,
    build: null,
  });
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
      if (wrapper) wrapper.style.removeProperty("--aiop-bridge-progress");
      node.style.transform = "";
      for (const phase of HANDOFF_PHASES) {
        const pill = handoffPillRefs.current[phase];
        if (!pill) continue;
        pill.style.removeProperty("--handoff-cx");
        pill.style.removeProperty("--handoff-cy");
      }
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
        // the bridge (chips fully resolved as orbit pills).
        const p = maxFreeze > 0 ? freeze / maxFreeze : 0;
        // Set on the wrapper so both `.aiop-bridge` (existing morph
        // rules) and the sibling `.aiop-bridge__handoff` (new flight
        // layer) inherit the same value.
        wrapper.style.setProperty("--aiop-bridge-progress", p.toFixed(4));

        // Handoff flight window. Aligned so that:
        //   0.00 -> 0.45  in-place morph plays out (handoff invisible)
        //   0.45 -> 0.55  crossfade bridge mark out / handoff pill in
        //   0.50 -> 0.85  handoff pill flies from source to target
        //   0.85 -> 0.95  orbit pill fades in at target (handoff stays)
        //   0.95 -> 1.00  both visible at target, fully resolved
        const flightStart = 0.5;
        const flightEnd = 0.85;
        const flightP = Math.max(
          0,
          Math.min(1, (p - flightStart) / (flightEnd - flightStart)),
        );
        const eased = easeInOutCubic(flightP);

        for (const phase of HANDOFF_PHASES) {
          const source = document.querySelector<HTMLElement>(
            `.aiop-bridge__mark[data-aiop-phase="${phase}"]`,
          );
          const target = document.querySelector<HTMLElement>(
            `.aiop-orbit__pill[data-aiop-phase="${phase}"]`,
          );
          const pill = handoffPillRefs.current[phase];
          if (!source || !target || !pill) continue;

          const sRect = source.getBoundingClientRect();
          const tRect = target.getBoundingClientRect();

          // Position by centre so the handoff pill (intrinsic size) is
          // visually anchored on the same point as the morphed bridge
          // mark (wider box) and the orbit pill (smaller box) without a
          // jump when either endpoint changes size.
          const sCenterX = sRect.left + sRect.width / 2;
          const sCenterY = sRect.top + sRect.height / 2;
          const tCenterX = tRect.left + tRect.width / 2;
          const tCenterY = tRect.top + tRect.height / 2;

          const cx = lerp(sCenterX, tCenterX, eased);
          const cy = lerp(sCenterY, tCenterY, eased);

          pill.style.setProperty("--handoff-cx", `${cx.toFixed(2)}px`);
          pill.style.setProperty("--handoff-cy", `${cy.toFixed(2)}px`);
        }
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

      {/* Fixed handoff layer — only rendered when the bridge is in its
       * animated mode. Each pill mirrors the orbit pill chrome exactly
       * (same dot, same label, same shadow); JS sets `--handoff-cx` /
       * `--handoff-cy` to fly each pill from its source bridge mark
       * centre to its destination orbit pill centre. Sibling of the
       * bridge so the bridge's `transform` (used to keep the bridge
       * visually frozen) doesn't turn this into a containing block. */}
      {animated && (
        <div className="aiop-bridge__handoff" aria-hidden="true">
          {HANDOFF_PHASES.map((phase) => (
            <span
              key={phase}
              ref={(el) => {
                handoffPillRefs.current[phase] = el;
              }}
              className={`aiop-handoff-pill aiop-handoff-pill--${phase}`}
              data-aiop-phase={phase}
            >
              <span className="aiop-handoff-pill__dot" aria-hidden="true" />
              <span className="aiop-handoff-pill__label">
                {HANDOFF_LABEL[phase]}
              </span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

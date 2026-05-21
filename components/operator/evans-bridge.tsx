"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { pageEvansBridgeSection } from "@/content/intelligence-layer";

/*
 * EvansBridge — editorial chapter slide that names the asking gap
 * and bridges into the practical reframe.
 *
 * Composition (one slide, two paired beats):
 *
 *   1. The Benedict Evans pull quote, with three operative phrases
 *      framed as lane-coloured bordered chips. The chips pre-read
 *      the Navigate / Encode / Build vocabulary about to resolve
 *      in Vision and the spectrum below.
 *   2. The Evans attribution (mono-caps with a small rule).
 *   3. A short pivot line in a soft-gradient frame ("Treat it
 *      like a colleague.") that flips Evans's abstract gap into
 *      a concrete reframe.
 *   4. The colleague question carried over from the Loop AI
 *      workshop deck. `explain to them` lands in the amber accent
 *      so the question typographically rhymes with the encode-
 *      amber chip above and with the spectrum title in the next
 *      slide ("Why we treat AI like a colleague.").
 *
 * Choreography. On viewports >= 960px without
 * `prefers-reduced-motion: reduce`, this section participates in
 * the `.aiop-evans-and-tool-collab` parallax pair:
 *
 *   - EvansBridge freezes via a compensating `translateY` so the
 *     quote stays visually pinned at viewport top while the
 *     visitor scrolls past it. The freeze ratio writes
 *     `--aiop-evans-progress` onto the section.
 *   - During Phase 1 of the freeze (first ~280px of scroll), the
 *     pivot block (frame + colleague question) fades in from
 *     opacity 0 with a small upward translate, driven from the
 *     same progress. ToolCollabSpectrum is held visually
 *     stationary just below the viewport via
 *     `--aiop-tool-collab-hold` written onto the wrapper.
 *   - During Phase 2 (remaining freeze), the hold releases
 *     linearly so ToolCollabSpectrum slides up over the frozen
 *     EvansBridge and returns to its natural document position
 *     by the time the freeze caps.
 *
 * On hosts that mount EvansBridge outside the wrapper, or below
 * 960px / under reduced-motion, the handler falls back to a
 * simpler rect-based reveal that just fades the pivot in as the
 * section scrolls past, with no pin. The reduced-motion CSS
 * safety net forces the pivot to opacity 1 if the media query
 * flips mid-session.
 *
 * Same pattern shared with `.aiop-engine-and-ideate` (carousel
 * freezes while engine demo rises) and the legacy Shards
 * `.aiop-bridge-and-reality` (quote freezes while reality rises).
 */
export function EvansBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  /* Detect viewport + motion preference. We only animate on
     viewports wide enough for the parallax rhythm to read, and
     bail out cleanly when the user opts out of motion. */
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

  /* Scroll-coupled progress writer. Two branches:
     1. Wrapper mode (`.aiop-evans-and-tool-collab` present):
        freeze EvansBridge with a compensating translateY, write
        `--aiop-evans-progress` from a Phase 1-scoped freeze
        ratio (so the pivot reaches full opacity by the end of
        Phase 1), and drive a two-phase `--aiop-tool-collab-hold`
        on the wrapper so ToolCollabSpectrum stays just below the
        viewport while the pivot reveals, then slides up over the
        frozen EvansBridge during Phase 2.
     2. Fallback mode (no wrapper): use the section's rect.top
        directly to fade the pivot in once the section starts
        scrolling past its natural top. No pin, no hold. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(
      ".aiop-evans-and-tool-collab",
    );
    const toolCollab = wrapper?.querySelector<HTMLElement>(
      ".aiop-tool-collab",
    );

    const reset = () => {
      node.style.removeProperty("--aiop-evans-progress");
      node.style.transform = "";
      if (wrapper) {
        wrapper.style.removeProperty("--aiop-tool-collab-hold");
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
        /* Branch 1 · Wrapper mode. */
        if (wrapper && toolCollab) {
          const wrapperRect = wrapper.getBoundingClientRect();
          const vh = window.innerHeight;

          const evansBottomInVH = wrapperRect.top + node.offsetHeight;
          const freezeNeeded = vh - evansBottomInVH;
          const maxFreeze = wrapper.offsetHeight - node.offsetHeight;
          const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

          /* Pin EvansBridge with a compensating translateY so it
             stays visually frozen at viewport top while the
             wrapper's scroll length elapses. */
          node.style.transform =
            freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

          /* Phase 1 buffer drives both the pivot reveal AND the
             ToolCollab hold. Generous enough (~280px) for the
             frame + colleague question to fully fade in before
             the next section starts rising. Capped at 60% of
             maxFreeze so Phase 2 always has release distance. */
          const phase1Buffer = Math.min(280, vh * 0.28);
          const holdMax = Math.min(phase1Buffer, maxFreeze * 0.6);

          /* Pivot reveal progress is scoped to Phase 1 so the
             pivot reaches 100% opacity by the end of the hold,
             not when the entire wrapper scroll completes. */
          const pivotProgress =
            holdMax > 0 ? Math.min(1, freeze / holdMax) : 1;
          node.style.setProperty(
            "--aiop-evans-progress",
            pivotProgress.toFixed(4),
          );

          /* Two-phase hold on ToolCollab. Phase 1 mirrors the
             freeze (ToolCollab stays just below viewport while
             the pivot reveals). Phase 2 releases linearly so
             ToolCollab slides up AND returns to its natural
             document position by the time the freeze caps. */
          let hold = 0;
          if (freeze > 0 && holdMax > 0) {
            if (freeze <= holdMax) {
              hold = freeze;
            } else if (maxFreeze > holdMax) {
              const phase2Span = maxFreeze - holdMax;
              const phase2Progress = (freeze - holdMax) / phase2Span;
              hold = holdMax * (1 - phase2Progress);
            }
          }
          wrapper.style.setProperty(
            "--aiop-tool-collab-hold",
            `${hold.toFixed(2)}px`,
          );
          return;
        }

        /* Branch 2 · Fallback (no wrapper). Simple rect-based
           reveal: pivot fades in once the section's top has
           scrolled ~50px past viewport top, completes 300px
           later. No pin. */
        const rect = node.getBoundingClientRect();
        const start = -50;
        const end = -350;
        const range = start - end;
        const progress = Math.max(
          0,
          Math.min(1, (start - rect.top) / range),
        );
        node.style.setProperty(
          "--aiop-evans-progress",
          progress.toFixed(4),
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
      className={`aiop-section aiop-evans-bridge${animated ? " is-animated" : ""}`}
      id={pageEvansBridgeSection.id}
      aria-labelledby="aiop-evans-bridge-q"
      aria-label={pageEvansBridgeSection.ariaLabel}
    >
      <div className="aiop-evans-bridge__bleed" aria-hidden="true">
        <span className="aiop-evans-bridge__wash aiop-evans-bridge__wash--a" />
        <span className="aiop-evans-bridge__wash aiop-evans-bridge__wash--b" />
        <span className="aiop-evans-bridge__wash aiop-evans-bridge__wash--c" />
        <span className="aiop-evans-bridge__grid" />
      </div>

      <div className="aiop-wrap aiop-evans-bridge__inner">
        <figure className="aiop-evans-bridge__quote aiop-reveal">
          <blockquote
            id="aiop-evans-bridge-q"
            className="aiop-evans-bridge__pull"
          >
            <span
              className="aiop-evans-bridge__pull-mark aiop-evans-bridge__plain"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            {pageEvansBridgeSection.quoteParts.map((part, idx) =>
              part.mark && part.pill ? (
                <span
                  key={idx}
                  className={`aiop-evans-bridge__mark aiop-evans-bridge__mark--${part.mark}`}
                  data-aiop-phase={part.mark}
                >
                  <span className="aiop-evans-bridge__mark-text">
                    {part.text}
                  </span>
                </span>
              ) : (
                <span key={idx} className="aiop-evans-bridge__plain">
                  {part.text}
                </span>
              ),
            )}
          </blockquote>

          <figcaption className="aiop-evans-bridge__attrib">
            <span
              className="aiop-evans-bridge__attrib-rule"
              aria-hidden="true"
            />
            <span className="aiop-evans-bridge__attrib-name">
              {pageEvansBridgeSection.attribName}
            </span>
            <span className="aiop-evans-bridge__attrib-meta">
              {pageEvansBridgeSection.attribMeta}
            </span>
          </figcaption>
        </figure>

        {/* Pivot + colleague question. Hidden by default on
            desktop and fades in via `--aiop-evans-progress` as
            the visitor scrolls past the section, so the Evans
            quote lands first and the practical answer arrives a
            beat later. The pivot line sits inside a soft-gradient
            pill that lifts it out of the surrounding text without
            breaking the slide's editorial register. */}
        <div className="aiop-evans-bridge__pivot">
          <p className="aiop-evans-bridge__pivot-frame">
            <span className="aiop-evans-bridge__pivot-line">
              {pageEvansBridgeSection.pivotLine}
            </span>
          </p>
          <p className="aiop-evans-bridge__follow-question">
            {renderWithMarker(
              pageEvansBridgeSection.followQuestion,
              (text, idx) => (
                <span
                  key={idx}
                  className="aiop-evans-bridge__follow-accent"
                >
                  {text}
                </span>
              ),
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/* Split a string on `{{marker}}` sentinels and run the matched
   inner text through a render function. Local helper so each
   component owns its own emphasis rendering decisions. */
function renderWithMarker(
  text: string,
  renderMark: (inner: string, idx: number) => React.ReactNode,
): React.ReactNode[] {
  const parts = text.split(/\{\{(.+?)\}\}/g);
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return renderMark(part, idx);
    }
    return <Fragment key={idx}>{part}</Fragment>;
  });
}

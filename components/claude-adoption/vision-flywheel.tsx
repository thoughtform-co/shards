"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FlywheelOrbit } from "@/components/operator/flywheel-orbit";
import {
  useScrollFrame,
  type ScrollFrame,
} from "@/components/operator/use-scroll-frame";
import { caFlywheelSection } from "@/content/claude-adoption";

/*
 * VisionFlywheel — Clay-toned interstitial chapter break.
 *
 * Sits AFTER WorkshopApproach (operator machine) and rises over
 * its tail via a freeze-and-rise parallax pattern. Names the
 * three motions — Navigate, Encode, Build — as the per-team loop
 * that the cross-team machine above is compounding.
 *
 * Visual treatment mirrors the encoding-interstitial /
 * engine-pattern bleed-card pattern on the homepage:
 *
 *   - Inset bleed card with a top-to-bottom gradient (Claude Clay
 *     dominant, deepening through cream into a quiet sage tail).
 *   - Two atmospheric radial washes (Clay top-left, sage
 *     bottom-right).
 *   - Subtle 32px grid texture, radially masked, behind everything.
 *
 * Parallax (mirrors `headless-shift.tsx`):
 *
 *   - On viewports >= 960px without `prefers-reduced-motion: reduce`,
 *     the wrapper `.ca-approach-and-vision` (set in `page.tsx`) holds
 *     `<WorkshopApproach />` + this section as siblings.
 *   - While the wrapper is being scrolled past, this component applies
 *     a `translateY` to Approach that compensates for scroll exactly,
 *     keeping it visually frozen, and a two-phase entry-buffer hold
 *     to itself so the Approach CTA gets a reading beat before
 *     Flywheel begins rising over it.
 *
 * Page-scoped `--aiop-violet` override (in claude-adoption.css)
 * means every "violet" token resolves to Claude Clay #d97757 here,
 * so the orbit + bleed + connectors all carry the Clay accent
 * without any per-component branching.
 */
export function VisionFlywheel() {
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
     can also call it. Same shape as `headless-shift.tsx`. */
  const resetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(".ca-approach-and-vision");
    const approach = wrapper?.querySelector<HTMLElement>(".ca-approach");

    resetRef.current = () => {
      node.style.transform = "";
      if (approach) approach.style.transform = "";
    };

    if (!animated) {
      resetRef.current();
    }

    return () => {
      resetRef.current?.();
      resetRef.current = null;
    };
  }, [animated]);

  const measure = useCallback(
    (frame: ScrollFrame) => {
      if (!animated) return;
      const node = sectionRef.current;
      if (!node) return;

      const wrapper = node.closest<HTMLElement>(".ca-approach-and-vision");
      const approach = wrapper?.querySelector<HTMLElement>(".ca-approach");
      if (!wrapper || !approach) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      // Approach sits as the first child of the wrapper, so its
      // bottom in viewport coords doubles as the natural
      // (transform-free) top of this section.
      const approachBottomInVH = wrapperRect.top + approach.offsetHeight;

      const freezeNeeded = frame.vh - approachBottomInVH;
      const maxFreeze = wrapper.offsetHeight - approach.offsetHeight;
      const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

      approach.style.transform =
        freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

      // Entry buffer: hold Flywheel in place for the first ~140px
      // of freeze so the Approach CTA stays readable before
      // Flywheel begins rising. After the buffer, linearly release
      // back to 0 so Flywheel reaches its natural document position
      // by the time freeze caps — otherwise it would sit translated
      // past its natural bottom and the next section (Skills) would
      // overlap its tail. Mirrors `headless-shift.tsx`.
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

  return (
    <section
      ref={sectionRef}
      className="aiop-section ca-flywheel"
      id={caFlywheelSection.id}
      aria-label={caFlywheelSection.ariaLabel}
    >
      <div className="ca-flywheel__bleed" aria-hidden="true">
        <span className="ca-flywheel__wash ca-flywheel__wash--a" />
        <span className="ca-flywheel__wash ca-flywheel__wash--b" />
        <span className="ca-flywheel__grid" />
      </div>

      <div className="aiop-wrap ca-flywheel__inner aiop-reveal">
        <span className="ca-flywheel__phase">
          <span className="ca-flywheel__phase-dot" aria-hidden="true" />
          Flywheel
        </span>

        <header className="aiop-section-head ca-flywheel__head">
          <h2 className="aiop-section-title">
            {caFlywheelSection.title}{" "}
            <em>{caFlywheelSection.titleEm}</em>
          </h2>
          <p className="aiop-section-head__sub">
            {caFlywheelSection.caption}
          </p>
        </header>

        {/* Orbit + radial annotations share one coordinate space.
            The FlywheelOrbit's pills sit at fixed % positions inside
            `.aiop-orbit--nested` (Navigate 12 o'clock outer ring,
            Encode 4 o'clock middle ring, Build 8 o'clock inner ring).
            The SVG overlay below uses the same orbit geometry so its
            connector lines start at each pill and extend outward;
            the text blocks pin to the OUTER end of each connector. */}
        <div className="ca-vision__diagram aiop-reveal">
          <div className="ca-vision__diagram-frame">
            <svg
              className="ca-vision__connectors"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Each motion gets a line + a small filled circle
                  ON the pill so the connector visually originates
                  from the pill (not just floats away from it).
                  Lines extend to the corner where the annotation
                  card lands, terminating inside the card via the
                  card's matching corner-bracket (CSS).  */}
              <line
                className="ca-vision__connector ca-vision__connector--navigate"
                x1="50"
                y1="4"
                x2="60"
                y2="-12"
              />
              <circle
                className="ca-vision__connector-anchor ca-vision__connector-anchor--navigate"
                cx="50"
                cy="4"
                r="1.6"
              />
              <line
                className="ca-vision__connector ca-vision__connector--build"
                x1="27.5"
                y1="63"
                x2="-2"
                y2="75"
              />
              <circle
                className="ca-vision__connector-anchor ca-vision__connector-anchor--build"
                cx="27.5"
                cy="63"
                r="1.6"
              />
              <line
                className="ca-vision__connector ca-vision__connector--encode"
                x1="81"
                y1="68"
                x2="102"
                y2="75"
              />
              <circle
                className="ca-vision__connector-anchor ca-vision__connector-anchor--encode"
                cx="81"
                cy="68"
                r="1.6"
              />
            </svg>

            <FlywheelOrbit variant="centered" />

            {caFlywheelSection.phases.map((phase) => (
              <div
                key={phase.id}
                className={`ca-vision__motion-card ca-vision__motion-card--${phase.id}`}
                /* Phase label (Navigate / Encode / Build) is already
                   announced by the connected orbit pill, so the card
                   drops its uppercase kicker and just carries the
                   one-sentence body. `aria-label` keeps the phase
                   tied to the card for assistive tech. */
                aria-label={phase.label}
              >
                <p className="ca-vision__motion-body">{phase.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

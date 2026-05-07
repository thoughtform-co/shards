"use client";

import { useEffect, useRef, useState } from "react";

import { quoteBridgeSection } from "./content";

/*
 * QuoteBridge — interstitial between the hero and the Navigate / Encode /
 * Build flywheel.
 *
 * Anchors the framework to a credible outside diagnosis (Benedict Evans
 * on the asking gap) and shows the visitor that three intuitive
 * challenges sit inside that one sentence — challenges that resolve
 * into the three pills of the orbit a viewport later.
 *
 * The morph is opt-in. On desktop without `prefers-reduced-motion`, this
 * component reads its own scroll position and writes a 0..1 progress
 * variable to the section. CSS uses that variable to fade each natural-
 * language phrase out and bring its pill counterpart in. Under reduced
 * motion or on narrow viewports, the markup falls back to a static
 * stack with both the phrase and the pill visible side by side.
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

    const reset = () => {
      node.style.removeProperty("--aiop-bridge-progress");
    };

    if (!animated) {
      reset();
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;

        // Raw transit progress: 0 when the section's top is at viewport
        // bottom (just entering), 1 when its bottom is at viewport top
        // (just exited).
        const total = rect.height + vh;
        const traveled = vh - rect.top;
        const raw = Math.max(0, Math.min(1, traveled / total));

        // Bias the morph toward the back half of the transit so the
        // quote breathes first, then the lines resolve into pills as
        // the visitor approaches the flywheel below. Maps raw 0.4 → 0
        // and raw 0.9 → 1, clamped at the ends.
        const p = Math.max(0, Math.min(1, (raw - 0.4) / 0.5));
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
          <p className="aiop-eyebrow">{quoteBridgeSection.eyebrow}</p>
          <blockquote
            id="aiop-bridge-quote"
            className="aiop-bridge__pull"
          >
            <span className="aiop-bridge__pull-mark" aria-hidden="true">
              &ldquo;
            </span>
            <span className="aiop-bridge__pull-text">
              {quoteBridgeSection.quote}
            </span>
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

        <p className="aiop-bridge__intro aiop-reveal">
          {quoteBridgeSection.intro}
        </p>

        <ul className="aiop-bridge__rows aiop-reveal" role="list">
          {quoteBridgeSection.rows.map((row) => (
            <li
              key={row.id}
              className={`aiop-bridge__row aiop-bridge__row--${row.id}`}
            >
              <span className="aiop-bridge__phrase">{row.phrase}</span>
              <span className="aiop-bridge__arrow" aria-hidden="true">
                →
              </span>
              <span className="aiop-bridge__pill">
                <span className="aiop-bridge__pill-dot" aria-hidden="true" />
                <span className="aiop-bridge__pill-name">{row.pill}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

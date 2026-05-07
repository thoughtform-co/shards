"use client";

import { useEffect, useRef, useState } from "react";

import { softwareForFewSection } from "./content";

/*
 * Software-for-few interstitial.
 *
 * A near-full-viewport sticky slide that bridges the Approach (flywheel
 * breakdown) and the Cases grid. The track wraps a tall scroll
 * container; the slide pins to the viewport for the duration of the
 * track and the inner layers translate at different rates as scroll
 * progresses, producing a calm parallax beat between the two louder
 * sections.
 *
 * The choreography is opt-in. On narrow viewports, or whenever the
 * visitor prefers reduced motion, the same DOM falls back to a static
 * stack via CSS — JS only adds `is-animated` and writes the progress
 * variable when the choreography is appropriate; markup never changes.
 *
 * Mirrors the pattern in `v2/flywheel-stage.tsx`: rAF-batched scroll
 * reads, a single `--aiop-few-progress` CSS variable, and a media-query
 * gate so the listener uninstalls itself on small screens.
 */
export function SoftwareForFew() {
  const trackRef = useRef<HTMLDivElement>(null);
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
    const track = trackRef.current;
    if (!track) return;

    if (!animated) {
      track.style.removeProperty("--aiop-few-progress");
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const node = trackRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const total = node.offsetHeight - viewHeight;
        if (total <= 0) {
          node.style.setProperty("--aiop-few-progress", "0");
          return;
        }
        const scrolled = -rect.top;
        const p = Math.max(0, Math.min(1, scrolled / total));
        node.style.setProperty("--aiop-few-progress", p.toFixed(4));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [animated]);

  return (
    <div
      ref={trackRef}
      className={`aiop-few-track${animated ? " is-animated" : ""}`}
    >
      <section
        className="aiop-section aiop-few"
        id="software-for-few"
        aria-labelledby="aiop-few-title"
      >
        <div className="aiop-few__bleed" aria-hidden="true">
          <span className="aiop-few__wash aiop-few__wash--a" />
          <span className="aiop-few__wash aiop-few__wash--b" />
          <span className="aiop-few__grid" />
        </div>

        <div className="aiop-wrap aiop-few__inner">
          <div className="aiop-few__copy aiop-reveal">
            <h2
              className="aiop-section-title aiop-few__title"
              id="aiop-few-title"
            >
              <em className="aiop-few__title-em">
                {softwareForFewSection.title}
              </em>{" "}
              {softwareForFewSection.titleEm}
            </h2>
            <p className="aiop-few__body">{softwareForFewSection.body}</p>
          </div>

          <div className="aiop-few__card aiop-reveal" role="presentation">
            <ul className="aiop-few__rows" role="list">
              {softwareForFewSection.rows.map((row) => (
                <li
                  key={row.id}
                  className={`aiop-few__row${
                    row.highlight ? " aiop-few__row--highlight" : ""
                  }`}
                >
                  <span className="aiop-few__row-label">{row.label}</span>
                  <span className="aiop-few__row-detail">{row.detail}</span>
                  <span className="aiop-few__row-tag">{row.tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import { claudeBridgeSection } from "@/content/claude-workshop";

/*
 * ClaudeBridge — Anthropic-tinted clone of QuestionInterstitial.
 *
 * Reuses the same `.aiop-section.aiop-question-bridge` shell, the
 * same bleed/wash/grid scaffolding, the same eyebrow/blockquote/
 * subline figure, and the same scroll-driven freeze on viewports
 * >= 960px. The only structural delta is the modifier class
 * `aiop-question-bridge--claude`, which the scoped Anthropic
 * stylesheet (`components/claude-workshop/claude-workshop.css`)
 * uses to retint the three washes from violet/amber/sage to
 * clay/ivory/oat without touching the underlying typography
 * rules.
 *
 * Content comes from `claudeBridgeSection` in
 * `content/claude-workshop.ts`, NOT from
 * `pageQuestionInterstitialSection`, so the homepage's interlude
 * text stays untouched and the two interludes can read
 * independently.
 *
 * Parallax pairing: this component looks for a parent
 * `.aiop-claude-zone` (the wrapper the route page wraps around
 * the entire Anthropic chapter). When present, the same
 * progress/hold variables that QuestionInterstitial writes are
 * applied here too so a sibling pane below can read them. When
 * absent, the section degrades to a calm static figure (the
 * default behaviour today, since the Anthropic chapter doesn't
 * need a vision-style hold next to it).
 */

export function ClaudeBridge() {
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

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-question-bridge aiop-question-bridge--claude${
        animated ? " is-animated" : ""
      }`}
      id={claudeBridgeSection.id}
      aria-labelledby="aiop-claude-bridge-q"
      aria-label={claudeBridgeSection.ariaLabel}
    >
      <div className="aiop-question-bridge__bleed" aria-hidden="true">
        <span className="aiop-question-bridge__wash aiop-question-bridge__wash--a" />
        <span className="aiop-question-bridge__wash aiop-question-bridge__wash--b" />
        <span className="aiop-question-bridge__wash aiop-question-bridge__wash--c" />
        <span className="aiop-question-bridge__grid" />
      </div>

      <div className="aiop-wrap aiop-question-bridge__inner">
        <figure className="aiop-question-bridge__figure aiop-reveal">
          {claudeBridgeSection.eyebrow ? (
            <p
              className="aiop-question-bridge__eyebrow"
              aria-hidden="true"
            >
              {claudeBridgeSection.eyebrow}
            </p>
          ) : null}

          <blockquote
            id="aiop-claude-bridge-q"
            className="aiop-question-bridge__pull"
          >
            {claudeBridgeSection.question}
          </blockquote>

          {claudeBridgeSection.subline ? (
            <p className="aiop-question-bridge__subline">
              {claudeBridgeSection.subline}
            </p>
          ) : null}

          {claudeBridgeSection.scrollNote ? (
            <p className="aiop-question-bridge__scroll-note">
              <span
                className="aiop-question-bridge__scroll-note-bracket"
                aria-hidden="true"
              >
                (
              </span>
              {claudeBridgeSection.scrollNote}
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

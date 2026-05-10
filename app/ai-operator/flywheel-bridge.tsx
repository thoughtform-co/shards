import { Fragment } from "react";

import { flywheelBridgeSection } from "./content";

/*
 * FlywheelBridge — full-viewport interstitial between Vision and Approach.
 *
 * Mirrors the Evans bridge pattern (`quote-bridge.tsx`): the quote
 * sentence carries inline lane chips so the trio (Navigate / Encode /
 * Build) lives inside the prose rather than below it. The chips
 * themselves are the existing Navigate / Encode / Build pills (mono
 * caps + lane-coloured dot), shrunk to inline weight so they read as
 * part of the sentence flow.
 *
 * Differences from the Evans bridge:
 *   - No parallax. Nothing pins, nothing slides up over it.
 *   - Inline pills, not bordered editorial chips. Same dot grammar
 *     the rest of the page uses for the framework labels, just sized
 *     down for prose context.
 *
 * The quote lifts the autobiographical "18 months at Loop" anchor
 * out of the Build body, and its second sentence is structured so
 * the verbs `navigate`, `encode`, `build` get replaced inline by
 * their corresponding pill labels — letting the framework brand its
 * own sentence without a legend row below.
 *
 * Server component — no client hooks, no scroll handlers, no media
 * query branches. The visual reveal is handled by the existing
 * `.aiop-reveal` IntersectionObserver in `reveal.tsx`.
 */
export function FlywheelBridge() {
  return (
    <section
      className="aiop-section aiop-flywheel-bridge"
      aria-label="Embedded at Loop — reflection on Navigate, Encode, Build"
    >
      {/* Three-lane radial atmosphere mirroring the Evans bridge —
          violet, amber, sage softly placed in a loose triangle so the
          page's lane palette is already on the page before the
          inline pills name it explicitly. */}
      <div className="aiop-flywheel-bridge__bleed" aria-hidden="true">
        <span className="aiop-flywheel-bridge__wash aiop-flywheel-bridge__wash--a" />
        <span className="aiop-flywheel-bridge__wash aiop-flywheel-bridge__wash--b" />
        <span className="aiop-flywheel-bridge__wash aiop-flywheel-bridge__wash--c" />
      </div>
      <div className="aiop-flywheel-bridge__grid" aria-hidden="true" />

      <div className="aiop-wrap aiop-flywheel-bridge__inner aiop-reveal">
        <blockquote className="aiop-flywheel-bridge__quote">
          {flywheelBridgeSection.parts.map((part, idx) => {
            if (part.mark) {
              return (
                <span
                  key={idx}
                  className={`aiop-flywheel-bridge__mark aiop-flywheel-bridge__mark--${part.mark}`}
                >
                  <span
                    className="aiop-flywheel-bridge__mark-dot"
                    aria-hidden="true"
                  />
                  {part.label}
                </span>
              );
            }
            return <Fragment key={idx}>{part.text}</Fragment>;
          })}
        </blockquote>
      </div>
    </section>
  );
}

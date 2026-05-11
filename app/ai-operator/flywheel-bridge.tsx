import { flywheelBridgeSection } from "./content";

/*
 * FlywheelBridge — full-viewport interstitial between Vision and Approach.
 *
 * Single personal quote rendered as flat italic prose. An earlier
 * cut wrapped three verbs in lane-coloured Navigate / Encode / Build
 * pills inline, but the pills made the framework feel like a brand
 * stamp on the candidate's own voice — and they pre-empted Collison's
 * "moved into marketing, changing the funnel" cadence the closer
 * picks up later. Dropping them lets the line read as honest
 * autobiography instead of internal vocabulary, and the resonance
 * with the closer becomes audible without either side pointing at
 * it.
 *
 * Atmosphere stays unchanged: three soft lane washes (violet / amber
 * / sage) loosely placed in a triangle, faint dot grid, italic
 * display centerpiece. Mirrors the Evans bridge structural posture
 * without its parallax choreography.
 *
 * Server component — no client hooks, no scroll handlers, no media
 * query branches. The visual reveal is handled by the existing
 * `.aiop-reveal` IntersectionObserver in `reveal.tsx`.
 */
export function FlywheelBridge() {
  return (
    <section
      className="aiop-section aiop-flywheel-bridge"
      aria-label="Embedded at Loop — reflection on the past 18 months"
    >
      {/* Three-lane radial atmosphere mirroring the Evans bridge —
          violet, amber, sage softly placed in a loose triangle so the
          page's lane palette stays present even though no chips name
          the trio explicitly here. */}
      <div className="aiop-flywheel-bridge__bleed" aria-hidden="true">
        <span className="aiop-flywheel-bridge__wash aiop-flywheel-bridge__wash--a" />
        <span className="aiop-flywheel-bridge__wash aiop-flywheel-bridge__wash--b" />
        <span className="aiop-flywheel-bridge__wash aiop-flywheel-bridge__wash--c" />
      </div>
      <div className="aiop-flywheel-bridge__grid" aria-hidden="true" />

      <div className="aiop-wrap aiop-flywheel-bridge__inner aiop-reveal">
        <blockquote className="aiop-flywheel-bridge__quote">
          {flywheelBridgeSection.quote.map((paragraph) => (
            <p key={paragraph} className="aiop-flywheel-bridge__quote-p">
              {paragraph}
            </p>
          ))}
        </blockquote>
      </div>
    </section>
  );
}

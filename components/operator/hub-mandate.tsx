import { hubMandateSection } from "@/content/operator";

import { FlywheelOrbit } from "./flywheel-orbit";

/*
 * HubMandate — Section 2 of the Aether landing.
 *
 * Sits immediately under the hero and before `Diagnosis`. Inherits the
 * AI Operator landing's old "section 2" two-column geometry — left
 * column carries the function's mandate, right column carries the
 * Navigate / Encode / Build orbit as the operating model figure.
 *
 * The orbit lives here AND in the Vision section further down the
 * page (one shows it as the operating-model summary, the other as the
 * in-depth treatment with caption + headless satellite framing). Both
 * call the same `<FlywheelOrbit />` component; only the variant prop
 * differs (`compact` here, `centered` in Vision).
 *
 * Server component — no client hooks.
 */
export function HubMandate() {
  const { id, eyebrow, title, titleEm, lede, ledeStrong, orbitCaption, actions } =
    hubMandateSection;

  return (
    <section
      className="aiop-section aiop-hub-mandate"
      id={id}
      aria-label="The Forward-Deployed Hub mandate"
    >
      <div className="aiop-grid-bg" aria-hidden="true" />
      <div className="aiop-wrap aiop-hub-mandate__inner">
        {/* Left column — mandate copy. Mirrors `.aiop-hero__copy`
            grammar so the typographic rhythm carries from the hero
            into this beat without a visible break. */}
        <div className="aiop-hub-mandate__copy aiop-reveal">
          <p className="aiop-eyebrow">
            <span className="aiop-slash" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 className="aiop-hub-mandate__title">
            <span className="aiop-hub-mandate__title-line">{title}</span>
            <span className="aiop-hub-mandate__title-line">
              <em>{titleEm}</em>
            </span>
          </h2>

          <div className="aiop-hub-mandate__lede">
            {lede.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              <strong>{ledeStrong}</strong>
            </p>
          </div>

          <div className="aiop-hub-mandate__actions">
            {actions.map((action) => (
              <a
                key={action.id}
                className={`aiop-button${action.primary ? "" : " aiop-button--ghost"}`}
                href={action.href}
              >
                {action.label}
                <span className="aiop-button__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Right column — operating model orbit. Replaces the
            previous composition card. Same chamfered card chrome
            so the right rail still rhymes with the hero lockup
            above it; the orbit itself is a `compact` crop of the
            same component used in the Vision section. */}
        <aside
          className="aiop-hub-mandate__orbit-card aiop-reveal"
          aria-label="Loop's operating model"
        >
          <header className="aiop-hub-mandate__orbit-head">
            <span className="aiop-hub-mandate__orbit-eyebrow">
              <span
                className="aiop-hub-mandate__orbit-dot"
                aria-hidden="true"
              />
              Operating model
            </span>
            <span className="aiop-hub-mandate__orbit-badge">
              Navigate · Encode · Build
            </span>
          </header>

          <div className="aiop-hub-mandate__orbit-stage">
            <FlywheelOrbit variant="compact" />
          </div>

          <p className="aiop-hub-mandate__orbit-caption">{orbitCaption}</p>
        </aside>
      </div>
    </section>
  );
}

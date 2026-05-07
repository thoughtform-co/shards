import { quoteBridgeSection } from "./content";

/*
 * QuoteBridge — interstitial between the hero and the Navigate / Encode /
 * Build flywheel.
 *
 * Anchors the framework to a credible outside diagnosis (Benedict Evans
 * on the asking gap). The Evans sentence renders on one editorial line;
 * three operative phrases inside the sentence — `the challenge`,
 * `how to ask`, `what you want` — are tinted in their lane colour and
 * a pill hangs directly beneath each, naming the framework piece they
 * map to.
 *
 * Pure presentation — no scroll handler, no client state. The page-level
 * `ScrollReveal` handles entry fade via `aiop-reveal` and respects
 * reduced motion in one place rather than per-component.
 */
export function QuoteBridge() {
  return (
    <section
      className="aiop-section aiop-bridge"
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
            {quoteBridgeSection.quoteParts.map((part, idx) =>
              part.mark && part.pill ? (
                <span
                  key={idx}
                  className={`aiop-bridge__mark aiop-bridge__mark--${part.mark}`}
                >
                  <span className="aiop-bridge__mark-text">{part.text}</span>
                  <span className="aiop-bridge__pill" aria-hidden="true">
                    <span className="aiop-bridge__pill-dot" />
                    <span className="aiop-bridge__pill-name">{part.pill}</span>
                  </span>
                </span>
              ) : (
                <span key={idx}>{part.text}</span>
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

import { quoteBridgeSection } from "./content";

/*
 * QuoteBridge — full-viewport interstitial between the hero and the
 * Navigate / Encode / Build flywheel.
 *
 * Anchors the framework to a credible outside diagnosis (Benedict Evans
 * on the asking gap). The Evans sentence renders as the editorial
 * centerpiece; three operative phrases inside it — `the challenge`,
 * `how to ask`, `what you want` — are framed as subtle chips in their
 * lane colour (violet / amber / sage). The section deliberately holds
 * no eyebrow and no pill labels: the colour itself is the
 * foreshadowing for the orbit that lands one section later.
 *
 * Pure presentation — no scroll handler, no client state. Entry fade
 * is handled by the page-level `ScrollReveal` via the `aiop-reveal`
 * class.
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
          <blockquote
            id="aiop-bridge-quote"
            className="aiop-bridge__pull"
          >
            <span className="aiop-bridge__pull-mark" aria-hidden="true">
              &ldquo;
            </span>
            {quoteBridgeSection.quoteParts.map((part, idx) =>
              part.mark ? (
                <span
                  key={idx}
                  className={`aiop-bridge__mark aiop-bridge__mark--${part.mark}`}
                >
                  {part.text}
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

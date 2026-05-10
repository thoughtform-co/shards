import { stripeReflectSection } from "./content";

/*
 * StripeReflect — first beat of the closer.
 *
 * A single tranquil interstitial that turns the page from the
 * architecture deep dive ("what I've built, how it scales") toward
 * the personal frame the closer is about to land ("where does this
 * fit at Stripe?"). Visually mirrors the Evans `QuoteBridge`
 * (`quote-bridge.tsx` + `.aiop-bridge` block in `ai-operator.css`):
 * cream gradient base, three soft lane washes (violet / amber /
 * sage) loosely placed in a triangle, faint dot grid, italic display
 * centerpiece quote with an attribution rule beneath it.
 *
 * Difference from the Evans bridge: this is self-reflection, not a
 * borrowed thesis. There is no external attribution — the mono-caps
 * subline frames the voice ("a question I keep returning to"), and
 * an optional parenthetical scroll-note sits below it as a quiet
 * editorial aside.
 *
 * Pure server component. No parallax pin, no slide-up pair, no
 * scroll choreography — the reveal is handled by the existing
 * `.aiop-reveal` IntersectionObserver in `reveal.tsx`. Keeps this
 * beat calm before the video that follows takes the visitor's
 * attention.
 */
export function StripeReflect() {
  const { quote, attribName, attribMeta, note } = stripeReflectSection;

  return (
    <section
      className="aiop-section aiop-stripe-reflect"
      id="stripe-reflect"
      aria-labelledby="aiop-stripe-reflect-quote"
    >
      {/* Three-lane atmosphere mirroring the Evans bridge — violet,
          amber, sage softly placed in a loose triangle so the page's
          lane palette is on the page even though no chips name it
          here. */}
      <div className="aiop-stripe-reflect__bleed" aria-hidden="true">
        <span className="aiop-stripe-reflect__wash aiop-stripe-reflect__wash--a" />
        <span className="aiop-stripe-reflect__wash aiop-stripe-reflect__wash--b" />
        <span className="aiop-stripe-reflect__wash aiop-stripe-reflect__wash--c" />
      </div>
      <div className="aiop-stripe-reflect__grid" aria-hidden="true" />

      <div className="aiop-wrap aiop-stripe-reflect__inner aiop-reveal">
        <figure className="aiop-stripe-reflect__quote">
          <blockquote
            id="aiop-stripe-reflect-quote"
            className="aiop-stripe-reflect__pull"
          >
            <span
              className="aiop-stripe-reflect__pull-mark"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            {quote}
          </blockquote>

          <div className="aiop-stripe-reflect__attrib-block">
            <figcaption className="aiop-stripe-reflect__attrib">
              <span
                className="aiop-stripe-reflect__attrib-rule"
                aria-hidden="true"
              />
              <span className="aiop-stripe-reflect__attrib-name">
                {attribName}
              </span>
              <span className="aiop-stripe-reflect__attrib-meta">
                {attribMeta}
              </span>
            </figcaption>

            {note ? (
              <p className="aiop-stripe-reflect__note">
                <span
                  className="aiop-stripe-reflect__note-bracket"
                  aria-hidden="true"
                >
                  (
                </span>
                {note}
                <span
                  className="aiop-stripe-reflect__note-bracket"
                  aria-hidden="true"
                >
                  )
                </span>
              </p>
            ) : null}
          </div>
        </figure>
      </div>
    </section>
  );
}

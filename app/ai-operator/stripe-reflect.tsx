import { stripeReflectSection } from "./content";

/*
 * StripeReflect — first beat of the closer.
 *
 * A single tranquil interstitial that opens the closer with the
 * candidate's own voice. Three-paragraph self-quote on a cream
 * gradient with three soft lane washes (violet / amber / sage)
 * loosely placed in a triangle and a faint dot grid behind it.
 *
 * No external attribution — this is self-reflection, so the
 * figcaption row that briefly carried `Vincent Buyssens / Where the
 * conviction comes from` was retired. The optional parenthetical
 * `note` is preserved for future iterations; renders only when truthy.
 *
 * Pure server component. No parallax pin, no slide-up pair, no
 * scroll choreography — the reveal is handled by the existing
 * `.aiop-reveal` IntersectionObserver in `reveal.tsx`.
 */
export function StripeReflect() {
  const { quote, note } = stripeReflectSection;

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
        </figure>
      </div>
    </section>
  );
}

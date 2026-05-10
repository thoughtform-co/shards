import { stripeLedgerSection } from "./content";
import { StripeXThread } from "./stripe-x-thread";

/*
 * StripeLedger — second beat of the closer.
 *
 * Rewritten as a two-column context section:
 *   - Left column (`__copy`): editorial eyebrow chip → display title
 *     → two body paragraphs that frame why the Ledger build happened.
 *   - Right column: the embedded `<StripeXThread>` that auto-scrolls
 *     through the actual conversation between Stripe, the candidate,
 *     and Bryan Irace. The thread is the receipt the body refers to.
 *
 * The earlier schematic, paraphrased email card, and full-width
 * AMBITION conclusion are gone — the schematic's job is now done by
 * the X thread itself, and the AMBITION clause migrated up to the
 * CTA section so the visitor lands on it as the last beat.
 *
 * Pure server component. The X-thread is a `"use client"` island
 * that handles its own auto-scroll choreography; everything else
 * leans on the existing `.aiop-reveal` IntersectionObserver fade.
 */
export function StripeLedger() {
  const { eyebrow, title, body } = stripeLedgerSection;

  return (
    <section
      className="aiop-section aiop-stripe-ledger"
      id="stripe-ledger"
      aria-label="Personal beat: the Ledger build and the Stripe conversation"
    >
      <div className="aiop-wrap aiop-stripe-ledger__inner">
        <div className="aiop-stripe-ledger__beat">
          <div className="aiop-stripe-ledger__copy aiop-reveal">
            <p className="aiop-stripe-ledger__eyebrow">
              <span
                className="aiop-stripe-ledger__eyebrow-dot"
                aria-hidden="true"
              />
              {eyebrow}
            </p>
            <h2 className="aiop-section-title aiop-stripe-ledger__title">
              {title}
            </h2>
            <div className="aiop-stripe-ledger__body">
              {body.map((paragraph, idx) => (
                <p key={idx} className="aiop-stripe-ledger__body-p">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="aiop-stripe-ledger__thread aiop-reveal">
            <StripeXThread />
          </div>
        </div>
      </div>
    </section>
  );
}

import { stripeLedgerSection } from "./content";

/*
 * StripeLedger — third beat of the closer.
 *
 * Picks up the personal beat after the visitor has watched the
 * Collison clip. Two-column on desktop: a story column on the left
 * carrying three short editorial paragraphs about the AI-invoice
 * frustration and the Ledger build, paired on the right with a
 * small inline schematic that visually rhymes with the actual
 * Ledger product (dark warm + gold accents lifted from
 * `04_ledger.thoughtform/README.md`) and a paraphrased Stripe
 * engineer-reply card beneath it.
 *
 * The section closes on a single full-width call-out conclusion
 * card whose italic clause echoes the hero's `ledeStrong`
 * ("the economic layer for the age of co-intelligence") so the
 * page reads as a closed loop into the CTA below.
 *
 * Pure server component. No scroll choreography — `.aiop-reveal`
 * handles the entry fade.
 */
export function StripeLedger() {
  const { story, schematic, emailCard, conclusion } = stripeLedgerSection;

  return (
    <section
      className="aiop-section aiop-stripe-ledger"
      id="stripe-ledger"
      aria-label="Personal beat: the Ledger build and the closing"
    >
      <div className="aiop-wrap aiop-stripe-ledger__inner">
        <div className="aiop-stripe-ledger__beat">
          {/* Story column — three short editorial paragraphs. No
              headline, no eyebrow; the section reads as continued
              narration after the video lands. */}
          <div className="aiop-stripe-ledger__story aiop-reveal">
            {story.map((paragraph, idx) => (
              <p key={idx} className="aiop-stripe-ledger__story-p">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right column — schematic stacked above the email card. */}
          <aside
            className="aiop-stripe-ledger__aside aiop-reveal"
            aria-label="Ledger product preview and Stripe engineer reply"
          >
            {/* Inline Ledger schematic. CSS-rendered preview, not a
                real screenshot. Vendor chips name the AI-subscription
                pile that triggered the build; the connector strip
                names the Ledger pipeline at a glance; the insight
                line gives a taste of what Navigator returns. */}
            <article
              className="aiop-stripe-ledger__schematic"
              aria-label={schematic.eyebrow}
            >
              <header className="aiop-stripe-ledger__schematic-head">
                <span
                  className="aiop-stripe-ledger__schematic-dot"
                  aria-hidden="true"
                />
                <span className="aiop-stripe-ledger__schematic-eyebrow">
                  {schematic.eyebrow}
                </span>
              </header>

              <div className="aiop-stripe-ledger__schematic-sources">
                <span className="aiop-stripe-ledger__schematic-label">
                  {schematic.sourcesLabel}
                </span>
                <ul
                  className="aiop-stripe-ledger__schematic-chips"
                  role="list"
                >
                  {schematic.sources.map((source) => (
                    <li
                      key={source.label}
                      className={`aiop-stripe-ledger__schematic-chip${
                        source.tone === "accent"
                          ? " aiop-stripe-ledger__schematic-chip--accent"
                          : ""
                      }`}
                    >
                      {source.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="aiop-stripe-ledger__schematic-connector"
                aria-hidden="true"
              >
                <span className="aiop-stripe-ledger__schematic-connector-line" />
                <span className="aiop-stripe-ledger__schematic-connector-label">
                  {schematic.connector}
                </span>
                <span className="aiop-stripe-ledger__schematic-connector-line" />
              </div>

              <div className="aiop-stripe-ledger__schematic-insight">
                <span className="aiop-stripe-ledger__schematic-insight-label">
                  {schematic.insightLabel}
                </span>
                <p className="aiop-stripe-ledger__schematic-insight-body">
                  <span
                    className="aiop-stripe-ledger__schematic-insight-quote"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  {schematic.insight}
                  <span
                    className="aiop-stripe-ledger__schematic-insight-quote"
                    aria-hidden="true"
                  >
                    &rdquo;
                  </span>
                </p>
              </div>
            </article>

            {/* Stylised email card — paraphrased reply. */}
            <article
              className="aiop-stripe-ledger__email"
              aria-label="Stripe engineer reply, paraphrased"
            >
              <header className="aiop-stripe-ledger__email-head">
                <span
                  className="aiop-stripe-ledger__email-dot"
                  aria-hidden="true"
                />
                <span className="aiop-stripe-ledger__email-eyebrow">
                  {emailCard.eyebrow}
                </span>
              </header>
              <p className="aiop-stripe-ledger__email-body">
                <span
                  className="aiop-stripe-ledger__email-quote"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                {emailCard.body}
                <span
                  className="aiop-stripe-ledger__email-quote"
                  aria-hidden="true"
                >
                  &rdquo;
                </span>
              </p>
              <p className="aiop-stripe-ledger__email-foot">
                {emailCard.foot}
              </p>
            </article>
          </aside>
        </div>

        {/* Closing call-out conclusion card. Sits at the bottom of
            the section as a single full-width card whose italic
            clause echoes the hero's `ledeStrong`. */}
        <aside
          className="aiop-stripe-ledger__conclusion aiop-reveal"
          aria-labelledby="aiop-stripe-ledger-conclusion"
        >
          <header className="aiop-stripe-ledger__conclusion-head">
            <span
              className="aiop-stripe-ledger__conclusion-dot"
              aria-hidden="true"
            />
            <span className="aiop-stripe-ledger__conclusion-eyebrow">
              {conclusion.eyebrow}
            </span>
          </header>
          <p
            className="aiop-stripe-ledger__conclusion-body"
            id="aiop-stripe-ledger-conclusion"
          >
            <span className="aiop-stripe-ledger__conclusion-lead">
              {conclusion.lead}
            </span>
            <em className="aiop-stripe-ledger__conclusion-em">
              {conclusion.em}
            </em>
          </p>
        </aside>
      </div>
    </section>
  );
}

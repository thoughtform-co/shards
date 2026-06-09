/*
 * Creative AI Workshop · "Not normal software" divider.
 *
 * A full-bleed editorial chapter break. Reuses the
 * `.aiop-engine-pattern__bleed` gradient markup (washes + grid)
 * verbatim so the divider sits in the same atmospheric family as
 * the receipts carousel on `/intelligence-layer` — but here it
 * carries a single sentence as the entire payload, with no chips,
 * frames, or carousel below.
 *
 * The divider is intentionally not animated: it doesn't ride a
 * parallax pair, it doesn't seek progress, and the
 * `.is-animated` class is omitted so the wash transforms in
 * operator.css stay at their resting position. The Evans pull
 * quote it visually rhymes with sits a few sections below.
 *
 * Server component.
 */

export function NotSoftwareDivider() {
  return (
    <section
      className="aiop-section aiop-engine-pattern aiop-engine-question"
      id="engine-question"
      aria-labelledby="aiop-engine-question-q"
      aria-label="Why you can't treat AI like normal software"
    >
      <div className="aiop-engine-pattern__bleed" aria-hidden="true">
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--a" />
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--b" />
        <span className="aiop-engine-pattern__grid" />
      </div>

      <div className="aiop-wrap aiop-engine-question__inner">
        <p
          id="aiop-engine-question-q"
          className="aiop-engine-question__q"
        >
          Why you can&apos;t treat AI like{" "}
          <em>normal software</em>.
        </p>
      </div>
    </section>
  );
}

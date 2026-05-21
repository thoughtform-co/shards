import {
  reviewMockRows,
  reviewMockTitle,
  trustChecks,
  trustSection,
} from "@/content/process";

/**
 * Trust / governance section.
 *
 * Substrate's "your data, your control" block, restated for Loop. Four
 * checks on the left (the governance commitments anyone can audit), a
 * review-queue mock on the right (the same discipline made into a
 * surface). Reads as a control panel, not a marketing block.
 */
export function Trust() {
  return (
    <section className="section section--soft" id="trust">
      <div className="wrap">
        <header className="section-head reveal">
          <p className={`eyebrow eyebrow--${trustSection.eyebrowTone}`}>
            {trustSection.eyebrow}
          </p>
          <h2 className="section-title">
            {trustSection.title} <em>{trustSection.titleEm}</em>
          </h2>
          <p className="section-intro">{trustSection.lede}</p>
        </header>

        <div className="trust-row reveal">
          <ul className="trust-checks">
            {trustChecks.map((check) => (
              <li key={check.id}>
                <span className="trust-checks__mark" aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>{check.title}</strong>
                  {check.body}
                </span>
              </li>
            ))}
          </ul>

          <div className="review-mock" aria-hidden="true">
            <div className="review-mock__head">
              <div className="review-mock__title">
                {reviewMockTitle.title}
                <small>{reviewMockTitle.sub}</small>
              </div>
              <span className="review-mock__count">{reviewMockTitle.count}</span>
            </div>
            {reviewMockRows.map((row) => (
              <div key={row.id} className="review-mock__row">
                <span
                  className={
                    row.approved
                      ? "review-mock__check review-mock__check--on"
                      : "review-mock__check"
                  }
                />
                <div>
                  <strong>{row.title}</strong>
                  <small>· {row.by}</small>
                </div>
                <span className="review-mock__amount">{row.amount}</span>
                <span
                  className={
                    row.approved
                      ? "review-mock__action review-mock__action--approved"
                      : "review-mock__action"
                  }
                >
                  {row.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

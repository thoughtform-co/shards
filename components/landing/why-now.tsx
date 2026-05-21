import { whyNowHeads, whyNowSection } from "@/content/process";

/**
 * Why-now / problem section for the process page.
 *
 * Two-column block: the gap on the left, the four heads that hold the work
 * today on the right. Sets up the rest of the page as the answer to "the
 * operating layer needs an owner".
 */
export function WhyNow() {
  return (
    <section className="section section--soft" id="why-now">
      <div className="wrap">
        <header className="section-head reveal">
          <p className={`eyebrow eyebrow--${whyNowSection.eyebrowTone}`}>
            {whyNowSection.eyebrow}
          </p>
          <h2 className="section-title">
            {whyNowSection.title} <em>{whyNowSection.titleEm}</em>
          </h2>
          <p className="section-intro">{whyNowSection.lede}</p>
        </header>

        <div className="problem-row reveal">
          <div>
            <ul className="pain">
              {whyNowSection.pains.map((pain) => (
                <li key={pain.strong}>
                  <span className="pain__x" aria-hidden="true">
                    ×
                  </span>
                  <span>
                    <strong>{pain.strong}</strong>
                    {pain.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="heads-stack" aria-hidden="true">
              {whyNowHeads.map((head) => (
                <div key={head.id} className="heads-row">
                  <div className={`heads-row__icon heads-row__icon--${head.variant}`}>
                    {head.initial}
                  </div>
                  <div>
                    <strong>{head.title}</strong>
                    <small>{head.sub}</small>
                  </div>
                  <span
                    className={
                      head.warn ? "heads-row__tag heads-row__tag--warn" : "heads-row__tag"
                    }
                  >
                    {head.tag}
                  </span>
                </div>
              ))}
            </div>
            <p className="problem-row__caption">{whyNowSection.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

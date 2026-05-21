import { howWeScaleSection } from "@/content/operator";

/*
 * HowWeScale — replaces the old `<FlywheelBridge />` quote section.
 *
 * The earlier section posed "OK. So how do we scale this?" and then
 * answered with a single quote. The page lost momentum there because
 * the answer was atmospheric, not concrete. This section keeps the
 * same italic display lead but answers it with three lane-coloured
 * cards (Navigate / Encode / Build at scale) — same spine the rest
 * of the page uses, framed as the scaling mechanism.
 *
 * Composition:
 *   - Eyebrow + italic display lead ("OK. So how do we scale this?")
 *   - Bicolour title + caption.
 *   - Three lane-coloured cards. Each card carries a lane label,
 *     an eyebrow naming the scaling shape, a headline, a 2-paragraph
 *     body, a 3-tile stat strip, and an italic foot.
 *   - Quiet mono-caps handoff line below the cards that hands off
 *     into the operating-model deep dive (Approach + Cases + Headless).
 *
 * Server component — no client hooks.
 */
export function HowWeScale() {
  const { id, eyebrow, lead, title, titleEm, caption, cards, handoff } =
    howWeScaleSection;

  return (
    <section
      className="aiop-section aiop-how-scale"
      id={id}
      aria-label="How we scale: the three motions that turn the Hub into a multiplier"
    >
      <div className="aiop-grid-bg" aria-hidden="true" />
      <div className="aiop-wrap aiop-how-scale__inner">
        <header className="aiop-how-scale__head aiop-reveal">
          <p className="aiop-eyebrow aiop-how-scale__eyebrow">
            <span className="aiop-slash" aria-hidden="true" />
            {eyebrow}
          </p>
          <p className="aiop-how-scale__lead">{lead}</p>
          <h2 className="aiop-how-scale__title">
            {title} <em>{titleEm}</em>
          </h2>
          <p className="aiop-how-scale__caption">{caption}</p>
        </header>

        <ol
          className="aiop-how-scale__grid aiop-reveal"
          role="list"
          aria-label="Three scaling motions: Navigate, Encode, Build"
        >
          {cards.map((card) => (
            <li
              key={card.id}
              className={`aiop-how-scale__card aiop-how-scale__card--${card.tone}`}
            >
              <header className="aiop-how-scale__card-head">
                <span className="aiop-how-scale__card-label">
                  <span
                    className="aiop-how-scale__card-dot"
                    aria-hidden="true"
                  />
                  {card.label}
                </span>
                <span className="aiop-how-scale__card-eyebrow">
                  {card.eyebrow}
                </span>
              </header>

              <h3 className="aiop-how-scale__card-title">{card.headline}</h3>

              <div className="aiop-how-scale__card-body">
                {card.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <ol
                className="aiop-how-scale__stats"
                role="list"
                aria-label={`${card.label} receipts`}
              >
                {card.stats.map((stat) => (
                  <li key={stat.k} className="aiop-how-scale__stat">
                    <span className="aiop-how-scale__stat-v">{stat.v}</span>
                    <span className="aiop-how-scale__stat-k">{stat.k}</span>
                  </li>
                ))}
              </ol>

              <p className="aiop-how-scale__card-foot">{card.foot}</p>
            </li>
          ))}
        </ol>

        <p className="aiop-how-scale__handoff aiop-reveal">{handoff}</p>
      </div>
    </section>
  );
}

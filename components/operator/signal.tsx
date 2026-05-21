import { signalSection, type SignalCard } from "@/content/operator";

/*
 * Signal — social-proof beat between Executive Summary and Diagnosis.
 *
 * v16 reskin: same four news cards (Stripe FDA, Palantir FDE origin,
 * OpenAI Deployment Company, Anthropic $1.5B venture) — but now lives
 * on the paper canvas like the rest of the page. The previous dark
 * "Deployment Beat" newspaper masthead is dropped; the section reads
 * as a calm SaaS-card strip with Loop-violet accents instead of the
 * editorial dark register. Cards stay clickable to the original
 * articles; copy in `signalSection` is unchanged.
 *
 * Composition:
 *   - Eyebrow + display title + sub paragraph (paper register).
 *   - 2x2 grid of 4 white cards with a gradient-mesh thumb panel
 *     on top, kicker + headline + dek + byline below.
 *   - Closing line that pivots back to Loop, with the accent half
 *     pulled out as a small badge instead of an inline italic.
 *
 * Server component — no client hooks.
 *
 * `section` prop lets route variants override the copy without
 * touching the home page wiring.
 */
export function Signal({
  section = signalSection,
}: {
  section?: {
    id: string;
    eyebrow: string;
    title: string;
    titleEm: string;
    titleAfter: string;
    sub: string;
    masthead: {
      name: string;
      issue: string;
      track: string;
      date: string;
    };
    cards: SignalCard[];
    closing?: { lead: string; accent: string };
  };
} = {}) {
  const { id, eyebrow, title, titleEm, titleAfter, sub, cards, closing } =
    section;

  /* Per-section mono-caps eyebrow retired across the opening
     sections; the content stays on `signalSection` for type
     stability. */
  void eyebrow;

  return (
    <section
      className="aiop-section aiop-signal"
      id={id}
      aria-label="Industry signal: forward-deployed AI is now the recognized pattern"
    >
      <div className="aiop-wrap aiop-signal__inner">
        <header className="aiop-section-head aiop-signal__head aiop-reveal">
          <h2 className="aiop-section-title aiop-signal__title">
            {title} <em>{titleEm}</em> {titleAfter}
          </h2>
          <p className="aiop-section-head__sub aiop-signal__sub">{sub}</p>
        </header>

        <ol
          className="aiop-signal__grid aiop-reveal"
          role="list"
          aria-label="Four industry signals confirming the deployment pattern"
        >
          {cards.map((card) => (
            <li
              key={card.id}
              className={`aiop-signal__card aiop-signal__card--${card.id}`}
            >
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="aiop-signal__card-link"
              >
                <div className="aiop-signal__thumb" aria-hidden="true">
                  <span className="aiop-signal__thumb-bg" />
                  <span className="aiop-signal__thumb-grid" />
                  <span className="aiop-signal__thumb-mark">
                    {card.thumb.mark}
                  </span>
                  <span className="aiop-signal__thumb-tag">
                    {card.thumb.tag}
                  </span>
                  <span className="aiop-signal__thumb-corner">
                    {card.thumb.corner}
                  </span>
                </div>
                <div className="aiop-signal__body">
                  <span className="aiop-signal__kicker">{card.kicker}</span>
                  <h3 className="aiop-signal__headline">{card.headline}</h3>
                  <p className="aiop-signal__dek">
                    {card.dek.map((part, idx) => (
                      <span key={idx}>
                        {part.strong ? <strong>{part.text}</strong> : part.text}
                        {idx < card.dek.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </p>
                  <div className="aiop-signal__byline">
                    <span className="aiop-signal__byline-source">
                      {card.byline.source}
                    </span>
                    <span className="aiop-signal__byline-date">
                      {card.byline.date}
                    </span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ol>

        {closing ? (
          <p className="aiop-signal__closing aiop-reveal">
            <strong>{closing.lead}</strong>
            <span className="aiop-signal__closing-badge">
              <span
                className="aiop-signal__closing-badge-dot"
                aria-hidden="true"
              />
              {closing.accent}
            </span>
          </p>
        ) : null}
      </div>
    </section>
  );
}

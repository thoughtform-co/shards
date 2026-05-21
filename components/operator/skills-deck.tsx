/*
 * SkillsDeck — multi-slide companion to the EnginePattern carousel.
 *
 * Where EnginePattern packs one card per team into a horizontal rail,
 * this deck unrolls per-team detail into a vertical stack of full-
 * bleed slides. Each slide:
 *
 *   1. Sits on the same gradient-bleed canvas as `EnginePattern`
 *      (linear violet → paper → sage + two radial washes + masked
 *      32px grid). This is the design DOM the source brief flagged
 *      ("mainly the gradient").
 *
 *   2. Holds a slide header (mono-caps kicker + Bodoni-italic team
 *      title + one-line lede) and a card grid (3-up at desktop,
 *      auto-fit at narrower widths).
 *
 *   3. Renders 2–4 cards. Each card carries a concise title, a one-
 *      line capability description, optional named owners, and a
 *      status pill (IN USE / BUILT / IN BUILD / SCOPING) styled with
 *      the same receipt-tone grammar (live / committed / scoping) as
 *      the EnginePattern cards.
 *
 * No carousel, no parallax. The deck reads top-down in the web view
 * and exports as one tall PDF page per the existing `/print` route.
 * Each slide pins to `min-height: 100vh` on desktop so the PDF
 * paginates predictably when the result is sliced into individual
 * presentation slides.
 */

import { skillsDeckSection, type SkillSlide } from "@/content/skills-deck";
import "./skills-deck.css";

export function SkillsDeck({
  section = skillsDeckSection,
}: {
  section?: typeof skillsDeckSection;
} = {}) {
  const { id, ariaLabel, header, slides } = section;

  return (
    <section
      className="aiop-section aiop-skills-deck"
      id={id}
      aria-label={ariaLabel}
    >
      {/* Deck-wide header — lands once at the top, then each slide
          gets its own gradient-bled panel below. Mirrors the
          `enginePatternSection.header` shape (title-left / sub-right
          via `.aiop-section-head`). */}
      <div className="aiop-wrap aiop-skills-deck__intro">
        <header className="aiop-section-head aiop-skills-deck__head aiop-reveal">
          <div className="aiop-skills-deck__head-left">
            <p className="aiop-eyebrow aiop-skills-deck__eyebrow">
              <span className="aiop-slash" aria-hidden="true" />
              {header.eyebrow}
            </p>
            <h2 className="aiop-section-title aiop-skills-deck__title">
              {header.title} <em>{header.titleEm}</em>
              {header.titleAfter ? ` ${header.titleAfter}` : ""}
            </h2>
          </div>
          <p className="aiop-section-head__sub aiop-skills-deck__sub">
            {header.sub}
          </p>
        </header>
      </div>

      <ol className="aiop-skills-deck__rail" role="list">
        {slides.map((slide, idx) => (
          <li
            key={slide.id}
            id={`slide-${slide.id}`}
            className="aiop-skills-deck__slide-slot"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slides.length}: ${slide.team}`}
          >
            <SlidePanel slide={slide} index={idx} total={slides.length} />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ─── Slide ──────────────────────────────────────────────────────── */

function SlidePanel({
  slide,
  index,
  total,
}: {
  slide: SkillSlide;
  index: number;
  total: number;
}) {
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  /* Card count drives a layout hint class so 2-card slides centre
     into two wider columns, 3-card slides land as 3-up, and 4-card
     slides snap to 2x2. The CSS uses these modifiers; the rail
     fallback is `auto-fit, minmax(280px, 1fr)`. */
  const layoutHint =
    slide.cards.length === 4
      ? "is-2x2"
      : slide.cards.length === 2
        ? "is-2up"
        : "is-3up";
  /* The slide title splits across `team` + `teamEm` (so the second
     half can render in Bodoni italic). For the per-card team
     micro-tag we want the FULL name as a single string — joining
     them here keeps the source clean and avoids dangling fragments
     like "Warehousing &" on cards. */
  const teamFull = slide.teamEm
    ? `${slide.team} ${slide.teamEm}`
    : slide.team;

  return (
    <article
      className={`aiop-skills-deck__slide aiop-skills-deck__slide--${slide.id}`}
    >
      <div className="aiop-skills-deck__slide-bleed" aria-hidden="true">
        <span className="aiop-skills-deck__slide-wash aiop-skills-deck__slide-wash--a" />
        <span className="aiop-skills-deck__slide-wash aiop-skills-deck__slide-wash--b" />
        <span className="aiop-skills-deck__slide-grid" />
      </div>

      <div className="aiop-wrap aiop-skills-deck__slide-shell">
        <header className="aiop-skills-deck__slide-head aiop-reveal">
          <span className="aiop-skills-deck__slide-counter">{counter}</span>
          <span className="aiop-skills-deck__slide-kicker">{slide.kicker}</span>
          <h3 className="aiop-skills-deck__slide-title">
            {slide.team}
            {slide.teamEm ? (
              <>
                {" "}
                <em>{slide.teamEm}</em>
              </>
            ) : null}
          </h3>
          <p className="aiop-skills-deck__slide-lede">{slide.lede}</p>
        </header>

        <ul
          className={`aiop-skills-deck__cards aiop-skills-deck__cards--${layoutHint}`}
          role="list"
        >
          {slide.cards.map((card) => (
            <li key={card.id} className="aiop-skills-deck__card-slot">
              <article
                className={`aiop-skills-deck__card aiop-skills-deck__card--${card.status}`}
              >
                <header className="aiop-skills-deck__card-head">
                  <span
                    className="aiop-skills-deck__card-team"
                    aria-hidden="true"
                  >
                    {teamFull}
                  </span>
                  <h4 className="aiop-skills-deck__card-title">{card.title}</h4>
                </header>

                <p className="aiop-skills-deck__card-body">{card.body}</p>

                {card.link ? (
                  <a
                    className="aiop-skills-deck__card-link"
                    href={card.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="aiop-skills-deck__card-link-arrow"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                    {card.link.label}
                  </a>
                ) : null}

                <footer className="aiop-skills-deck__card-foot">
                  {card.owners && card.owners.length > 0 ? (
                    <p className="aiop-skills-deck__card-owners">
                      {card.owners.join(" \u00b7 ")}
                    </p>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  <span
                    className={`aiop-skills-deck__card-pill aiop-skills-deck__card-pill--${card.receiptTone}`}
                  >
                    <span
                      className="aiop-skills-deck__card-pill-dot"
                      aria-hidden="true"
                    />
                    {card.statusLabel}
                  </span>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

import {
  anatomy,
  brainstorm,
  cta,
  drift,
  footer,
  hero,
  meta,
  substrate,
  surfacesSection,
} from "./content";
import { ScrollReveal } from "./reveal";
import { SurfacesPick } from "./surfaces-pick";

function Arrow() {
  return <span className="mk-button__arrow" aria-hidden="true">→</span>;
}

function SectionTitle({
  title,
  titleEm,
}: {
  title: string;
  titleEm: string;
}) {
  return (
    <h2 className="mk-section-title">
      {title} <em>{titleEm}</em>
    </h2>
  );
}

export default function MomkaiBrandAgentPage() {
  return (
    <main className="momkai-stage">
      <ScrollReveal />

      <header className="mk-header">
        <div className="mk-wrap mk-header__inner">
          <div className="mk-brand">
            <div className="mk-brand__mark">
              <span className="mk-brand__diamond" aria-hidden="true" />
              <span className="mk-brand__name">{meta.brandLeft}</span>
            </div>
            <span className="mk-brand__sub">{meta.brandSub}</span>
          </div>
          <div className="mk-header__meta">
            <span>{meta.signature}</span>
            <a className="mk-header__cta" href={meta.cta.href}>
              {meta.cta.label}
            </a>
          </div>
        </div>
      </header>

      <section className="mk-hero" id="top">
        <div className="mk-wrap mk-hero__grid">
          <div className="mk-hero__copy mk-reveal">
            <p className="mk-eyebrow mk-hero__eyebrow">{hero.eyebrow}</p>
            <h1 className="mk-hero__title">
              {hero.titleLines.map((line, index) => (
                <span key={index} className="mk-hero__title-line">
                  {typeof line === "string" ? line : <em>{line.em}</em>}
                </span>
              ))}
            </h1>
            <p className="mk-hero__lede">{hero.lede}</p>
            <p className="mk-hero__note">{hero.note}</p>
            <div className="mk-hero__actions">
              {hero.actions.map((action) => (
                <a
                  key={action.id}
                  className={`mk-button${"primary" in action && action.primary ? "" : " mk-button--ghost"}`}
                  href={action.href}
                >
                  {action.label}
                  <Arrow />
                </a>
              ))}
            </div>
          </div>

          <aside
            className="mk-hero__panel mk-reveal"
            aria-label={hero.panel.label}
          >
            <header className="mk-hero__panel-tag">
              <span>{hero.panel.label}</span>
              <span className="mk-hero__panel-version">
                <span className="mk-hero__panel-dot" aria-hidden="true" />
                {hero.panel.version}
              </span>
            </header>
            <div className="mk-hero__panel-plate">
              <strong>{hero.panel.label}</strong>
              <span>{hero.panel.sub}</span>
            </div>
            <ul className="mk-hero__panel-layers" role="list">
              {hero.panel.layers.map((layer) => (
                <li key={layer.tag} className="mk-hero__panel-layer">
                  <span className="mk-hero__panel-tag-l">{layer.tag}</span>
                  <span className="mk-hero__panel-body-l">{layer.body}</span>
                </li>
              ))}
            </ul>
            <p className="mk-hero__panel-foot">{hero.panel.footnote}</p>
          </aside>
        </div>
      </section>

      <hr className="mk-rule" />

      <section className="mk-section mk-drift" id="drift">
        <div className="mk-wrap">
          <div className="mk-drift__head">
            <header className="mk-reveal">
              <p className="mk-eyebrow">{drift.eyebrow}</p>
              <SectionTitle title={drift.title} titleEm={drift.titleEm} />
            </header>
            <p className="mk-section-lede mk-drift__lede mk-reveal">
              {drift.lede}
            </p>
          </div>

          <div className="mk-drift__grid" data-reveal-stack>
            {drift.problems.map((problem) => (
              <article key={problem.n} className="mk-drift__cell mk-reveal">
                <span className="mk-drift__n">{problem.n}</span>
                <h3 className="mk-drift__cell-title">{problem.title}</h3>
                <p className="mk-drift__cell-body">{problem.body}</p>
              </article>
            ))}
          </div>
          <p className="mk-drift__close mk-reveal">{drift.closing}</p>
        </div>
      </section>

      <section className="mk-section mk-substrate" id="substrate">
        <div className="mk-wrap">
          <header className="mk-substrate__head mk-reveal">
            <p className="mk-eyebrow">{substrate.eyebrow}</p>
            <SectionTitle title={substrate.title} titleEm={substrate.titleEm} />
            <p className="mk-section-lede">{substrate.lede}</p>
          </header>

          <div className="mk-substrate__diagram mk-reveal">
            <aside className="mk-substrate__col">
              <p className="mk-substrate__col-h">{substrate.inputsHeading}</p>
              <ul className="mk-substrate__chips" role="list">
                {substrate.inputs.map((chip) => (
                  <li key={chip.id} className="mk-substrate__chip">
                    {chip.label}
                  </li>
                ))}
              </ul>
              <p className="mk-substrate__col-note">{substrate.inputsNote}</p>
            </aside>

            <section
              className="mk-substrate__panel"
              aria-label={substrate.panelTitle}
            >
              <header className="mk-substrate__panel-head">
                <span className="mk-substrate__panel-title">
                  {substrate.panelTitle}
                </span>
                <span className="mk-substrate__panel-meta">
                  <span className="mk-substrate__panel-dot" aria-hidden="true" />
                  {substrate.panelMeta}
                </span>
              </header>
              <ul className="mk-substrate__strata" role="list">
                {substrate.panelStrata.map((stratum) => (
                  <li key={stratum.id} className="mk-substrate__stratum">
                    <span className="mk-substrate__stratum-tag">
                      {stratum.tag}
                    </span>
                    <span className="mk-substrate__stratum-name">
                      {stratum.name}
                    </span>
                    <span className="mk-substrate__stratum-meta">
                      {stratum.meta}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mk-substrate__panel-foot">
                {substrate.panelFootnote}
              </p>
            </section>

            <aside className="mk-substrate__col mk-substrate__col--right">
              <p className="mk-substrate__col-h">{substrate.surfacesHeading}</p>
              <ul className="mk-substrate__chips" role="list">
                {substrate.surfaces.map((chip) => (
                  <li key={chip.id} className="mk-substrate__chip">
                    {chip.label}
                  </li>
                ))}
              </ul>
              <p className="mk-substrate__col-note">{substrate.surfacesNote}</p>
            </aside>
          </div>

          <ul className="mk-substrate__promises" role="list">
            {substrate.promises.map((promise) => (
              <li key={promise.id} className="mk-substrate__promise mk-reveal">
                <strong>{promise.title}</strong>
                <span>{promise.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mk-section mk-surfaces" id="headless">
        <div className="mk-wrap">
          <header className="mk-reveal">
            <p className="mk-eyebrow">{surfacesSection.eyebrow}</p>
            <SectionTitle
              title={surfacesSection.title}
              titleEm={surfacesSection.titleEm}
            />
            <p className="mk-section-lede">{surfacesSection.lede}</p>
          </header>

          <SurfacesPick />

          <ul className="mk-surfaces__foot" role="list">
            {surfacesSection.foot.map((point) => (
              <li key={point.id} className="mk-surfaces__foot-item mk-reveal">
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mk-section mk-anatomy" id="anatomy">
        <div className="mk-wrap">
          <header className="mk-reveal">
            <p className="mk-eyebrow">{anatomy.eyebrow}</p>
            <SectionTitle title={anatomy.title} titleEm={anatomy.titleEm} />
            <p className="mk-section-lede">{anatomy.lede}</p>
          </header>

          <div className="mk-anatomy__grid">
            {anatomy.parts.map((part) => (
              <article key={part.id} className="mk-anatomy__card mk-reveal">
                <header className="mk-anatomy__card-h">
                  <h3 className="mk-anatomy__card-name">{part.label}</h3>
                  <span className="mk-anatomy__card-tag">{part.id}</span>
                </header>
                <div className="mk-anatomy__row">
                  <span className="mk-anatomy__row-label">
                    {part.sayLabel}
                  </span>
                  <span className="mk-anatomy__row-text">{part.say}</span>
                </div>
                <div className="mk-anatomy__row mk-anatomy__row--avoid">
                  <span className="mk-anatomy__row-label">
                    {part.avoidLabel}
                  </span>
                  <span className="mk-anatomy__row-text">{part.avoid}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section mk-brain" id="brainstorm">
        <div className="mk-wrap">
          <header className="mk-brain__head mk-reveal">
            <p className="mk-eyebrow">{brainstorm.eyebrow}</p>
            <SectionTitle
              title={brainstorm.title}
              titleEm={brainstorm.titleEm}
            />
            <p className="mk-section-lede">{brainstorm.lede}</p>
          </header>

          <div className="mk-brain__rail">
            {brainstorm.steps.map((step) => (
              <article key={step.n} className="mk-brain__step mk-reveal">
                <div className="mk-brain__step-meta">
                  <span className="mk-brain__step-n">{step.n}</span>
                  <span className="mk-brain__step-label">{step.label}</span>
                  <span className="mk-brain__step-dur">{step.duration}</span>
                </div>
                <h3 className="mk-brain__step-title">{step.title}</h3>
                <p className="mk-brain__step-body">{step.body}</p>
              </article>
            ))}
          </div>
          <p className="mk-brain__own mk-reveal">{brainstorm.ownership}</p>
        </div>
      </section>

      <section className="mk-section mk-cta" id="cta">
        <div className="mk-wrap mk-cta__grid">
          <div className="mk-reveal">
            <p className="mk-eyebrow">{cta.eyebrow}</p>
            <h2 className="mk-cta__title">
              {cta.title} <em>{cta.titleEm}</em>
            </h2>
            <p className="mk-cta__body">{cta.body}</p>
            <p className="mk-cta__fine">{cta.fine}</p>
          </div>
          <div className="mk-cta__actions mk-reveal">
            <a className="mk-button" href={cta.primary.href}>
              {cta.primary.label}
              <Arrow />
            </a>
            <a className="mk-button mk-button--ghost" href={cta.secondary.href}>
              {cta.secondary.label}
              <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="mk-footer">
        <div className="mk-wrap mk-footer__inner">
          <span>{footer.line}</span>
          <span>{footer.signature}</span>
          <span>{footer.studio}</span>
        </div>
      </footer>
    </main>
  );
}

import { Approach } from "./approach";
import { Cases } from "./cases";
import {
  ctaSection,
  footer,
  headlessSection,
  hero,
  meta,
  selectedCaseSection,
} from "./content";
import { ScrollReveal } from "./reveal";

/*
 * AI Operator — public landing page.
 *
 * v2 narrative arc: a startup-style page about the approach, with a
 * single spine — Navigate, Encode, Build. The CV holds the personal
 * record; this page holds the working method. Each section is
 * self-contained, but the page reads top-to-bottom as one argument.
 *
 * Composition:
 *   01 Header / nav     (sticky)
 *   02 Hero             — Name the framework + flywheel visual.
 *   03 Approach         — Three motions, each with a Heimdall-style
 *                         "practice in motion" pop-out (client).
 *   04 Cases            — Heimdall-style showcase grid (client).
 *   05 Headless         — Interstitial: architecture, not a dashboard.
 *   06 Selected case    — HarvestFields, where everything lands.
 *   07 CTA              — One ask. Smallest commitment.
 *   08 Footer
 */

function Arrow() {
  return (
    <span className="aiop-button__arrow" aria-hidden="true">
      →
    </span>
  );
}

export default function AiOperatorPage() {
  return (
    <main className="aiop-stage">
      <ScrollReveal />

      {/* ─── Header / nav ───────────────────────────────────────────── */}
      <header className="aiop-header">
        <div className="aiop-wrap aiop-header__inner">
          <a className="aiop-brand" href="#top">
            <span className="aiop-brand__mark">
              <span className="aiop-brand__diamond" aria-hidden="true" />
              <span className="aiop-brand__name">{meta.brandLeft}</span>
            </span>
            <span className="aiop-brand__sub">{meta.brandSub}</span>
          </a>

          <nav className="aiop-nav" aria-label="Sections">
            {meta.links.map((link) => (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <a className="aiop-header__cta" href={meta.cta.href}>
            <span className="aiop-header__cta-pulse" aria-hidden="true" />
            {meta.cta.label}
          </a>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="aiop-hero" id="top">
        <div className="aiop-grid-bg" aria-hidden="true" />
        <div className="aiop-wrap aiop-hero__inner">
          <div className="aiop-hero__copy aiop-reveal">
            <p className="aiop-eyebrow">
              <span className="aiop-slash" aria-hidden="true" />
              {hero.eyebrow}
            </p>
            <h1 className="aiop-hero__title">
              {hero.titleLines.map((line, idx) => (
                <span key={idx} className="aiop-hero__title-line">
                  {typeof line === "string" ? line : <em>{line.em}</em>}
                </span>
              ))}
            </h1>
            <p className="aiop-hero__lede">{hero.lede}</p>

            <div className="aiop-hero__actions">
              {hero.actions.map((action) => (
                <a
                  key={action.id}
                  className={`aiop-button${"primary" in action && action.primary ? "" : " aiop-button--ghost"}`}
                  href={action.href}
                >
                  {action.label}
                  <Arrow />
                </a>
              ))}
            </div>

            <dl className="aiop-hero__meta">
              {hero.meta.map((row) => (
                <div key={row.k} className="aiop-hero__meta-row">
                  <dt className="aiop-hero__meta-k">{row.k}</dt>
                  <dd className="aiop-hero__meta-v">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside
            className="aiop-hero__panel aiop-hero__panel--orbit aiop-reveal"
            aria-label={hero.panel.label}
          >
            <span className="aiop-hero__panel-halo" aria-hidden="true" />
            <header className="aiop-hero__panel-tag">
              <span className="aiop-hero__panel-tag-l">
                <span className="aiop-pulse" aria-hidden="true" />
                {hero.panel.label}
              </span>
              <span className="aiop-hero__panel-version">
                {hero.panel.live}
              </span>
            </header>

            <div className="aiop-orbit" aria-hidden="true">
              <span className="aiop-orbit__ring aiop-orbit__ring--outer" />
              <span className="aiop-orbit__ring aiop-orbit__ring--inner" />

              {hero.panel.orbits.map((orbit) => (
                <span
                  key={orbit.id}
                  className={`aiop-orbit__pill aiop-orbit__pill--${orbit.position} aiop-orbit__pill--${orbit.id}`}
                >
                  <span className="aiop-orbit__dot" aria-hidden="true" />
                  <span>{orbit.label}</span>
                </span>
              ))}

              <span className="aiop-orbit__core">
                <strong>{hero.panel.centerLabel}</strong>
                <span>{hero.panel.centerSub}</span>
              </span>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Approach (client component) ──────────────────────────── */}
      <Approach />

      {/* ─── Cases (client component) ─────────────────────────────── */}
      <Cases />

      {/* ─── Headless interstitial ────────────────────────────────── */}
      <section className="aiop-section aiop-headless" id="headless">
        <div className="aiop-wrap">
          <div className="aiop-headless__head aiop-reveal">
            <p className="aiop-eyebrow">{headlessSection.eyebrow}</p>
            <h2 className="aiop-section-title">
              {headlessSection.title}{" "}
              <em>{headlessSection.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{headlessSection.lede}</p>
          </div>

          <div className="aiop-headless__diagram aiop-reveal">
            <aside
              className="aiop-headless__substrate"
              aria-label="Substrate layers"
            >
              <header className="aiop-headless__substrate-head">
                <span className="aiop-headless__substrate-title">
                  Encoded substrate
                </span>
                <span className="aiop-headless__substrate-badge">Headless</span>
              </header>
              <ul className="aiop-headless__layers" role="list">
                {headlessSection.layers.map((l) => (
                  <li key={l.tag} className="aiop-headless__layer">
                    <span className="aiop-headless__layer-tag">{l.tag}</span>
                    <span className="aiop-headless__layer-name">{l.name}</span>
                    <span className="aiop-headless__layer-meta">{l.meta}</span>
                  </li>
                ))}
              </ul>
              <p className="aiop-headless__substrate-foot">
                Versioned. Owned by the team. Outlives the model underneath.
              </p>
            </aside>

            <div
              className="aiop-headless__surfaces"
              aria-label="Surfaces inheriting the substrate"
            >
              {headlessSection.surfaces.map((s) => (
                <article key={s.id} className="aiop-headless__surface">
                  <span
                    className="aiop-headless__surface-icon"
                    aria-hidden="true"
                  >
                    {s.icon}
                  </span>
                  <span className="aiop-headless__surface-name">{s.name}</span>
                  <span className="aiop-headless__surface-verb">{s.verb}</span>
                </article>
              ))}
            </div>
          </div>

          <ul className="aiop-headless__foot" role="list">
            {headlessSection.foot.map((p) => (
              <li
                key={p.id}
                className="aiop-headless__foot-point aiop-reveal"
              >
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Selected case · HarvestFields ────────────────────────── */}
      <section className="aiop-section aiop-case" id="harvestfields">
        <div className="aiop-wrap">
          <div className="aiop-case__head aiop-reveal">
            <p className="aiop-eyebrow">{selectedCaseSection.eyebrow}</p>
            <h2 className="aiop-section-title">
              {selectedCaseSection.title}{" "}
              <em>{selectedCaseSection.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{selectedCaseSection.lede}</p>
          </div>

          <div className="aiop-case__body">
            <div className="aiop-case__pillars aiop-reveal">
              {selectedCaseSection.pillars.map((p) => (
                <article key={p.n} className="aiop-case__pillar">
                  <span className="aiop-case__pillar-n">{p.n}</span>
                  <div>
                    <h3 className="aiop-case__pillar-title">{p.title}</h3>
                    <p className="aiop-case__pillar-body">{p.body}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside
              className="aiop-case__panel aiop-reveal"
              aria-label="HarvestFields engine snapshot"
            >
              <header className="aiop-case__panel-head">
                <strong>HarvestFields</strong>
                <span>Brand engine · v2.0</span>
              </header>
              <div className="aiop-case__metrics" role="list">
                {selectedCaseSection.metrics.map((m) => (
                  <div
                    key={m.k}
                    className="aiop-case__metric"
                    role="listitem"
                  >
                    <span className="aiop-case__metric-v">{m.v}</span>
                    <span className="aiop-case__metric-k">{m.k}</span>
                  </div>
                ))}
              </div>
              <ul className="aiop-case__endpoints" role="list">
                {selectedCaseSection.endpoints.map((e) => (
                  <li key={e.path} className="aiop-case__endpoint">
                    <span className="aiop-case__endpoint-method">
                      {e.method}
                    </span>
                    <span className="aiop-case__endpoint-path">{e.path}</span>
                    <span className="aiop-case__endpoint-state">{e.state}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="aiop-case__cta aiop-reveal">
            <a
              className="aiop-button aiop-button--gold"
              href={selectedCaseSection.cta.href}
            >
              {selectedCaseSection.cta.label}
              <Arrow />
            </a>
            <p className="aiop-case__cta-fine">
              Synthetic data · real architecture · prototype
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section
        className="aiop-section aiop-section--tight aiop-cta"
        id="cta"
      >
        <div className="aiop-wrap aiop-cta__grid">
          <div className="aiop-reveal">
            <p className="aiop-eyebrow aiop-eyebrow--ink">
              {ctaSection.eyebrow}
            </p>
            <h2 className="aiop-cta__title">
              {ctaSection.title} <em>{ctaSection.titleEm}</em>
            </h2>
            <p className="aiop-cta__body">{ctaSection.body}</p>
            <p className="aiop-cta__fine">{ctaSection.fine}</p>
          </div>
          <div className="aiop-cta__actions aiop-reveal">
            <a className="aiop-button" href={ctaSection.primary.href}>
              {ctaSection.primary.label}
              <Arrow />
            </a>
            <a
              className="aiop-button aiop-button--ghost"
              href={ctaSection.secondary.href}
              target="_blank"
              rel="noreferrer"
            >
              {ctaSection.secondary.label}
              <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="aiop-footer">
        <div className="aiop-wrap aiop-footer__inner">
          <span>{footer.line}</span>
          <span>{footer.signature}</span>
          <span>{footer.studio}</span>
        </div>
      </footer>
    </main>
  );
}

import {
  caseSection,
  ctaSection,
  footer,
  headlessSection,
  hero,
  meta,
  motions,
  motionsSection,
  patternSection,
  proofSection,
  systems,
  systemsSection,
} from "./content";
import { ScrollReveal } from "./reveal";

/*
 * AI Operator — public landing page.
 *
 * Reads as a portfolio-grade page about the embedded AI operator role.
 * Visual register: light retrofuturist (Aether-adjacent), notched CTAs
 * (Inversa-inspired), soft grid + backslash motifs (Hyperstudio), and
 * technical instrument panels (Prime Intellect). The page is served
 * through the route-local `aiop-*` design system in
 * `ai-operator.css`, which lifts a cream paper stage over the dark
 * Shards root layout.
 *
 * The arc is content-first: name the role, show the four motions,
 * prove with Loop, name the four systems, expand the headless
 * architecture, drop the HarvestFields case, then the pre-AI receipts
 * and a CTA. No screenshots — every "visual" is rendered from typed
 * data so the content module is the single source of truth.
 */

function Arrow() {
  return (
    <span className="aiop-button__arrow" aria-hidden="true">
      →
    </span>
  );
}

function SectionHead({
  eyebrow,
  title,
  titleEm,
  lede,
  inkEyebrow = false,
}: {
  eyebrow: string;
  title: string;
  titleEm: string;
  lede: string;
  inkEyebrow?: boolean;
}) {
  return (
    <>
      <div className="aiop-reveal">
        <p className={`aiop-eyebrow${inkEyebrow ? " aiop-eyebrow--ink" : ""}`}>
          {eyebrow}
        </p>
        <h2 className="aiop-section-title">
          {title} <em>{titleEm}</em>
        </h2>
      </div>
      <p className="aiop-section-lede aiop-reveal">{lede}</p>
    </>
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

          <aside className="aiop-hero__panel aiop-reveal" aria-label={hero.panel.label}>
            <header className="aiop-hero__panel-tag">
              <span className="aiop-hero__panel-tag-l">
                <span className="aiop-pulse" aria-hidden="true" />
                {hero.panel.label}
              </span>
              <span className="aiop-hero__panel-version">{hero.panel.version}</span>
            </header>

            <p className="aiop-hero__panel-sub">{hero.panel.sub}</p>

            <ul className="aiop-hero__panel-layers" role="list">
              {hero.panel.layers.map((layer) => (
                <li key={layer.tag} className="aiop-hero__panel-layer">
                  <span className="aiop-hero__panel-layer-n">{layer.tag}</span>
                  <span className="aiop-hero__panel-layer-name">{layer.body}</span>
                  <span className="aiop-hero__panel-layer-note">{layer.note}</span>
                </li>
              ))}
            </ul>

            <p className="aiop-hero__panel-foot">{hero.panel.foot}</p>
          </aside>
        </div>
      </section>

      {/* ─── Motions ────────────────────────────────────────────────── */}
      <section className="aiop-section aiop-motions" id="motions">
        <div className="aiop-wrap">
          <div className="aiop-motions__head">
            <SectionHead
              eyebrow={motionsSection.eyebrow}
              title={motionsSection.title}
              titleEm={motionsSection.titleEm}
              lede={motionsSection.lede}
            />
          </div>

          <div className="aiop-motions__grid">
            {motions.map((m) => (
              <article
                key={m.id}
                className={`aiop-motion aiop-motion--${m.id} aiop-reveal`}
              >
                <header className="aiop-motion__head">
                  <span className="aiop-motion__n">{m.n}</span>
                  <span className="aiop-motion__name">{m.name}</span>
                </header>
                <h3 className="aiop-motion__headline">{m.headline}</h3>
                <p className="aiop-motion__body">{m.body}</p>
                <ul className="aiop-motion__artifacts" role="list">
                  {m.artifacts.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Loop proof ─────────────────────────────────────────────── */}
      <section className="aiop-section aiop-proof" id="proof">
        <div className="aiop-wrap">
          <div className="aiop-proof__head">
            <SectionHead
              eyebrow={proofSection.eyebrow}
              title={proofSection.title}
              titleEm={proofSection.titleEm}
              lede={proofSection.lede}
            />
          </div>

          <div className="aiop-stats aiop-reveal" aria-label="Loop proof points">
            {proofSection.stats.map((s) => (
              <div key={s.label} className="aiop-stat">
                <span className="aiop-stat__v">{s.value}</span>
                <span className="aiop-stat__k">
                  <span
                    className={`aiop-dot${s.tone !== "gold" ? ` aiop-dot--${s.tone}` : ""}`}
                    aria-hidden="true"
                  />
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="aiop-pillars">
            {proofSection.pillars.map((p) => (
              <section
                key={p.id}
                className={`aiop-pillar-row aiop-pillar-row--${p.tone} aiop-reveal`}
                aria-labelledby={`pillar-${p.id}`}
              >
                <div className="aiop-pillar-row__label">
                  <span
                    className={`aiop-dot${p.tone !== "gold" ? ` aiop-dot--${p.tone}` : ""}`}
                    aria-hidden="true"
                  />
                  {p.label}
                </div>
                <div>
                  <h3 className="aiop-pillar-row__lead" id={`pillar-${p.id}`}>
                    {p.lead}
                  </h3>
                  <ul className="aiop-pillar-row__list" role="list">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Systems ────────────────────────────────────────────────── */}
      <section className="aiop-section aiop-systems" id="systems">
        <div className="aiop-wrap">
          <div className="aiop-systems__head">
            <SectionHead
              eyebrow={systemsSection.eyebrow}
              title={systemsSection.title}
              titleEm={systemsSection.titleEm}
              lede={systemsSection.lede}
            />
          </div>

          <div className="aiop-systems__grid">
            {systems.map((s) => (
              <article
                key={s.id}
                className={`aiop-system aiop-system--${s.tone} aiop-reveal`}
                aria-labelledby={`system-${s.id}`}
              >
                <header className="aiop-system__head">
                  <h3 className="aiop-system__name" id={`system-${s.id}`}>
                    {s.name}
                    {s.nameEm ? <em>{s.nameEm}</em> : null}
                  </h3>
                  <span className="aiop-system__status">{s.status}</span>
                </header>

                <div>
                  <div className="aiop-system__role-row">
                    <span className="aiop-system__role">{s.role}</span>
                    <span className="aiop-system__team">{s.team}</span>
                  </div>
                  <p className="aiop-system__body">{s.body}</p>
                  <ul className="aiop-system__bullets" role="list">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>

                <footer className="aiop-system__foot">
                  <ul className="aiop-system__surfaces" role="list">
                    {s.surfaces.map((surface) => (
                      <li key={surface} className="aiop-system__surface">
                        {surface}
                      </li>
                    ))}
                  </ul>
                  <p className="aiop-system__stack">
                    <span className="aiop-system__stack-k">Stack</span>
                    {s.stack}
                  </p>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Headless architecture ──────────────────────────────────── */}
      <section className="aiop-section" id="headless">
        <div className="aiop-wrap">
          <div className="aiop-headless__head">
            <SectionHead
              eyebrow={headlessSection.eyebrow}
              title={headlessSection.title}
              titleEm={headlessSection.titleEm}
              lede={headlessSection.lede}
            />
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

      {/* ─── HarvestFields case ─────────────────────────────────────── */}
      <section className="aiop-section aiop-case" id="harvestfields">
        <div className="aiop-wrap">
          <div className="aiop-case__head">
            <SectionHead
              eyebrow={caseSection.eyebrow}
              title={caseSection.title}
              titleEm={caseSection.titleEm}
              lede={caseSection.lede}
            />
          </div>

          <div className="aiop-case__body">
            <div className="aiop-case__pillars aiop-reveal">
              {caseSection.pillars.map((p) => (
                <article key={p.n} className="aiop-case__pillar">
                  <span className="aiop-case__pillar-n">{p.n}</span>
                  <div>
                    <h3 className="aiop-case__pillar-title">{p.title}</h3>
                    <p className="aiop-case__pillar-body">{p.body}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="aiop-case__panel aiop-reveal" aria-label="Engine panel">
              <header className="aiop-case__panel-head">
                <strong>HarvestFields</strong>
                <span>Brand engine · v2.0</span>
              </header>
              <div className="aiop-case__metrics" role="list">
                {caseSection.metrics.map((m) => (
                  <div key={m.k} className="aiop-case__metric" role="listitem">
                    <span className="aiop-case__metric-v">{m.v}</span>
                    <span className="aiop-case__metric-k">{m.k}</span>
                  </div>
                ))}
              </div>
              <ul className="aiop-case__endpoints" role="list">
                {caseSection.endpoints.map((e) => (
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
            <a className="aiop-button aiop-button--gold" href={caseSection.cta.href}>
              {caseSection.cta.label}
              <Arrow />
            </a>
            <p
              style={{
                fontFamily: "var(--aiop-mono)",
                fontSize: 11,
                letterSpacing: "0.10em",
                color: "var(--aiop-muted)",
                margin: 0,
              }}
            >
              Synthetic data · real architecture · prototype
            </p>
          </div>
        </div>
      </section>

      {/* ─── Pattern · pre-AI receipts ──────────────────────────────── */}
      <section className="aiop-section" id="pattern">
        <div className="aiop-wrap">
          <div className="aiop-pattern__head">
            <SectionHead
              eyebrow={patternSection.eyebrow}
              title={patternSection.title}
              titleEm={patternSection.titleEm}
              lede={patternSection.lede}
              inkEyebrow
            />
          </div>

          <div className="aiop-pattern__grid aiop-reveal">
            {patternSection.cards.map((c) => (
              <article key={c.id} className="aiop-pattern__card">
                <div className="aiop-pattern__meta">
                  <span className="aiop-pattern__year">{c.year}</span>
                  <span className="aiop-pattern__source">{c.source}</span>
                </div>
                <h3 className="aiop-pattern__title">{c.title}</h3>
                <p className="aiop-pattern__body">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="aiop-section aiop-section--tight aiop-cta" id="cta">
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

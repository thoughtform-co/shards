import type { Metadata } from "next";
import Image from "next/image";

import { AiIsNotSoftware } from "../ai-is-not-software";
import { Approach } from "../approach";
import { CaseLedger } from "../case-ledger";
import { Cases } from "../cases";
import {
  ctaSection,
  footer,
  hero,
  meta,
  substrateMapSection,
  surfacePickSection,
  visionMarketSignals,
  visionMarketSignalsHeader,
  visionSection,
} from "../content";
import { FlywheelBridge } from "../flywheel-bridge";
import { HeadlessShift } from "../headless-shift";
import { LoopStripeMorph } from "../loop-stripe-morph";
import { QuoteBridge } from "../quote-bridge";
import { ScrollReveal } from "../reveal";
import { SoftwareForFew } from "../software-for-few";
import { StripeLedger } from "../stripe-ledger";
import { StripeReflect } from "../stripe-reflect";
import { StripeVideo } from "../stripe-video";
import { DiagnosisV3 } from "./diagnosis";

/*
 * AI Operator — V3 landing page.
 *
 * V3 is a separate route from /ai-operator (V1) and /ai-operator/v2 so
 * V1 stays intact as the canonical public page. The v3 cut reorders
 * the opening arc so the lens (AI is intelligence, not software)
 * lands BEFORE the use cases, the cases reframe as evidence of that
 * lens rather than a standalone diagnosis, and the Evans quote
 * arrives as the bridge from problem to method.
 *
 * Composition:
 *   01 Header / nav     (sticky)
 *   02 Stripe video     — Cold open (unchanged from v1).
 *   03 Hero             — CV profile (unchanged from v1).
 *   04 The lens         — AiIsNotSoftware moved up. Names what AI is
 *                         (intelligence, not software) before the use
 *                         cases land. No parallax wrapper in v3 —
 *                         renders as a calm static beat.
 *   05 The evidence     — DiagnosisV3 reframed. New eyebrow
 *                         "WHEN THE GAP SHOWS UP", new title "Treat
 *                         AI like software, and these are the cracks
 *                         that show up.", new lede that names the
 *                         four patterns as proof of the lens above.
 *                         Same four use cases. Gap card and chevron
 *                         are dropped — Evans now does that hand-off.
 *   06 Evans quote      — QuoteBridge as the bridge from symptom to
 *                         method. The delayed parenthetical is
 *                         suppressed in v3 (passed scrollNote=""):
 *                         the lens above already names the new
 *                         category, so Evans stands alone.
 *   07 Vision           — Centered Navigate/Encode/Build flywheel.
 *   08+                 — FlywheelBridge, Approach + SoftwareForFew,
 *                         Cases + HeadlessShift, Substrate map,
 *                         Surface pick + StripeReflect, StripeLedger,
 *                         CaseLedger, CTA, Footer — all unchanged
 *                         from v1.
 */

export const metadata: Metadata = {
  title: "Vincent Buyssens · AI Operator (V3)",
  description:
    "AI capability built inside the work. Lens-first opening arc: name what AI is, then show the cracks, then bridge into the method.",
  robots: { index: false, follow: false },
};

function Arrow() {
  return (
    <span className="aiop-button__arrow" aria-hidden="true">
      →
    </span>
  );
}

function renderHeroLede(paragraph: string) {
  return paragraph.split(/(navigate|encode|build)/g).map((part, idx) =>
    part === "navigate" || part === "encode" || part === "build" ? (
      <span
        key={`${part}-${idx}`}
        className={`aiop-hero__lede-pill aiop-hero__lede-pill--${part}`}
      >
        <span className="aiop-hero__lede-pill-dot" aria-hidden="true" />
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function AiOperatorV3Page() {
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

      {/* ─── Stripe video — cold open ──────────────────────────────── */}
      <StripeVideo />

      {/* ─── Hero — CV profile ──────────────────────────────────────── */}
      <section className="aiop-hero" id="top">
        <div className="aiop-grid-bg" aria-hidden="true" />
        <div className="aiop-hero__morph" aria-hidden="true">
          <LoopStripeMorph />
        </div>
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
            <div className="aiop-hero__lede">
              {hero.lede.map((paragraph) => (
                <p key={paragraph}>{renderHeroLede(paragraph)}</p>
              ))}
              <p>
                <strong>{hero.ledeStrong}</strong>
              </p>
            </div>

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
          </div>

          <div className="aiop-hero__media aiop-reveal">
            <figure className="aiop-hero__portrait">
              <Image
                src={hero.portrait.src}
                alt={hero.portrait.alt}
                width={820}
                height={820}
                priority
                sizes="(max-width: 900px) 100vw, 540px"
                className="aiop-hero__portrait-img"
              />
              <figcaption className="aiop-hero__portrait-caption">
                <span className="aiop-hero__portrait-tag aiop-hero__portrait-tag--name">
                  <span className="aiop-hero__portrait-dot" aria-hidden="true" />
                  {hero.portrait.name}
                </span>
                <span className="aiop-hero__portrait-tag aiop-hero__portrait-tag--title">
                  {hero.portrait.title}
                </span>
              </figcaption>
            </figure>

            <dl className="aiop-hero__proof-grid" aria-label="Loop AI transformation proof points">
              {hero.proofMetrics.map((metric) => (
                <div key={metric.k} className="aiop-hero__proof-block">
                  <dt>{metric.k}</dt>
                  <dd>{metric.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─── 04 The lens — AiIsNotSoftware (moved up) ────────────────
       *
       * In v3 the lens runs BEFORE the use cases so the visitor reads
       * the four patterns that follow as evidence of one root cause
       * (people are treating an intelligence like software) rather
       * than as a standalone diagnosis.
       *
       * No parallax wrapper here — `.aiop-bridge-and-reality` is
       * intentionally dropped in v3. Without that wrapper the
       * QuoteBridge's scroll handler bails out cleanly via its
       * `if (!wrapper) return;` guard, so this section just renders
       * as a calm static beat below the hero. */}
      <AiIsNotSoftware />

      {/* ─── 05 The evidence — Diagnosis (reframed) ─────────────────
       *
       * Same four use cases as v1, but reframed by a new eyebrow,
       * title, and lede so they read as proof of the lens above. The
       * gap card and chevron from v1 are dropped — Evans, below, now
       * carries that hand-off into the method. */}
      <DiagnosisV3 />

      {/* ─── 06 Evans quote — bridge from symptom to method ─────────
       *
       * Lives outside the parallax wrapper in v3. The delayed
       * parenthetical (`(because AI isn't software, it's an
       * intelligence)`) is suppressed by passing scrollNote="" — the
       * lens section above already names the new category, so Evans
       * stands alone as the hinge into the flywheel. */}
      <QuoteBridge scrollNote="" />

      {/* ─── 07 Vision — Adoption & Automation Flywheel ──────────── */}
      <section className="aiop-section aiop-vision" id="vision">
        <div className="aiop-wrap aiop-vision__inner aiop-reveal">
          <div className="aiop-vision__head">
            <h2 className="aiop-section-title aiop-vision__title">
              {visionSection.title} <em>{visionSection.titleEm}</em>{" "}
              {visionSection.titleAfter}
            </h2>

            <p className="aiop-vision__caption">{visionSection.caption}</p>
          </div>

          <div
            className="aiop-orbit aiop-orbit--centered aiop-orbit--nested"
            role="img"
            aria-label="Navigate, Encode, Build pills nested on concentric orbits around a substrate core, with Headless as a satellite outside the outer ring"
          >
            <span
              className="aiop-orbit__ring aiop-orbit__ring--outer"
              aria-hidden="true"
            />
            <span
              className="aiop-orbit__ring aiop-orbit__ring--middle"
              aria-hidden="true"
            />
            <span
              className="aiop-orbit__ring aiop-orbit__ring--inner"
              aria-hidden="true"
            />

            {visionSection.orbits.map((orbit) => (
              <span
                key={orbit.id}
                className={`aiop-orbit__pill aiop-orbit__pill--${orbit.id} aiop-orbit__pill--ring-${orbit.ring}`}
                data-aiop-phase={orbit.id}
              >
                <span className="aiop-orbit__dot" aria-hidden="true" />
                <span>{orbit.label}</span>
              </span>
            ))}

            <span className="aiop-orbit__core">
              <strong>{visionSection.centerLabel}</strong>
              <span className="aiop-orbit__core-files">
                {visionSection.centerFiles.map((file) => (
                  <span key={file}>{file}</span>
                ))}
              </span>
            </span>

            {visionSection.satellite ? (
              <span
                className={`aiop-orbit__satellite aiop-orbit__satellite--${visionSection.satellite.id}`}
                data-aiop-satellite={visionSection.satellite.id}
              >
                <span
                  className="aiop-orbit__satellite-dot"
                  aria-hidden="true"
                />
                <span className="aiop-orbit__satellite-label">
                  {visionSection.satellite.label}
                </span>
              </span>
            ) : null}
          </div>
        </div>

        <aside
          className="aiop-vision__signals"
          aria-label="External validation: forward-deployed AI is now a recognized industry pattern"
        >
          <div className="aiop-wrap aiop-vision__signals-head">
            <p className="aiop-vision__signals-lede">
              {visionMarketSignalsHeader.ledeStart}
              <strong className="aiop-vision__signals-lede-accent">
                {visionMarketSignalsHeader.ledeAccent}
              </strong>
            </p>
          </div>

          <div className="aiop-vision__signals-marquee">
            <div className="aiop-vision__signals-track" role="list">
              {[...visionMarketSignals, ...visionMarketSignals].map(
                (signal, idx) => (
                  <a
                    key={`${signal.id}-${idx}`}
                    href={signal.href}
                    className="aiop-vision__signals-item"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-hidden={idx >= visionMarketSignals.length}
                    tabIndex={idx >= visionMarketSignals.length ? -1 : 0}
                  >
                    <span className="aiop-vision__signals-source">
                      {signal.source}
                    </span>
                    <span className="aiop-vision__signals-headline">
                      {signal.headline}
                    </span>
                    <span
                      className="aiop-vision__signals-date"
                      aria-hidden="true"
                    >
                      {signal.date}
                    </span>
                  </a>
                ),
              )}
            </div>
          </div>
        </aside>
      </section>

      {/* ─── Flywheel bridge ─────────────────────────────────────── */}
      <FlywheelBridge />

      {/* ─── Approach + Software-for-few · parallax-reveal pair ─── */}
      <div className="aiop-approach-and-few">
        <Approach />
        <SoftwareForFew />
      </div>

      {/* ─── Cases + Headless-shift · parallax-reveal pair ────────── */}
      <div className="aiop-cases-and-shift">
        <Cases />
        <HeadlessShift />
      </div>

      {/* ─── Substrate map ────────────────────────────────────────── */}
      <section className="aiop-section aiop-substrate-map" id="substrate-map">
        <div className="aiop-wrap">
          <header className="aiop-substrate-map__head aiop-reveal">
            <h2 className="aiop-section-title aiop-substrate-map__title">
              {substrateMapSection.title}{" "}
              <em>{substrateMapSection.titleEm}</em>
            </h2>
            <p className="aiop-substrate-map__lede">
              {substrateMapSection.body}
            </p>
          </header>

          <div className="aiop-substrate-map__card aiop-reveal">
            <header className="aiop-substrate-map__card-head">
              <span className="aiop-substrate-map__card-label">
                <span
                  className="aiop-substrate-map__card-dot"
                  aria-hidden="true"
                />
                {substrateMapSection.cardLabel}
              </span>
              <span className="aiop-substrate-map__card-flow">
                {substrateMapSection.flow}
              </span>
            </header>

            <div className="aiop-substrate-map__grid">
              <article className="aiop-substrate-map__col aiop-substrate-map__col--sources">
                <header className="aiop-substrate-map__col-head">
                  <span className="aiop-substrate-map__col-n">
                    {substrateMapSection.columns.sources.n} ·{" "}
                    {substrateMapSection.columns.sources.kicker}
                  </span>
                </header>
                <h3 className="aiop-substrate-map__col-title">
                  {substrateMapSection.columns.sources.title}
                </h3>
                <ul className="aiop-substrate-map__sources" role="list">
                  {substrateMapSection.columns.sources.items.map((item) => (
                    <li key={item} className="aiop-substrate-map__source">
                      <span
                        className="aiop-substrate-map__source-dot"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <div
                className="aiop-substrate-map__connector"
                aria-hidden="true"
              >
                <span className="aiop-substrate-map__connector-line" />
                <span className="aiop-substrate-map__connector-label">
                  {substrateMapSection.connectors.left}
                </span>
                <span className="aiop-substrate-map__connector-arrow">→</span>
              </div>

              <article className="aiop-substrate-map__col aiop-substrate-map__col--substrate">
                <header className="aiop-substrate-map__col-head">
                  <span className="aiop-substrate-map__col-n">
                    {substrateMapSection.columns.substrate.n} ·{" "}
                    {substrateMapSection.columns.substrate.kicker}
                  </span>
                  <span className="aiop-substrate-map__col-badge">
                    {substrateMapSection.columns.substrate.badge}
                  </span>
                </header>
                <h3 className="aiop-substrate-map__col-title">
                  {substrateMapSection.columns.substrate.title}
                </h3>
                <ul className="aiop-substrate-map__rows" role="list">
                  {substrateMapSection.columns.substrate.items.map((item) => (
                    <li key={item.tag} className="aiop-substrate-map__row">
                      <span className="aiop-substrate-map__row-tag">
                        {item.tag}
                      </span>
                      <span className="aiop-substrate-map__row-name">
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="aiop-substrate-map__chips" role="list">
                  {substrateMapSection.columns.substrate.tags.map((t) => (
                    <li key={t} className="aiop-substrate-map__chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>

              <div
                className="aiop-substrate-map__connector"
                aria-hidden="true"
              >
                <span className="aiop-substrate-map__connector-line" />
                <span className="aiop-substrate-map__connector-label">
                  {substrateMapSection.connectors.right}
                </span>
                <span className="aiop-substrate-map__connector-arrow">→</span>
              </div>

              <article className="aiop-substrate-map__col aiop-substrate-map__col--surfaces">
                <header className="aiop-substrate-map__col-head">
                  <span className="aiop-substrate-map__col-n">
                    {substrateMapSection.columns.surfaces.n} ·{" "}
                    {substrateMapSection.columns.surfaces.kicker}
                  </span>
                  <span className="aiop-substrate-map__col-badge">
                    {substrateMapSection.columns.surfaces.badge}
                  </span>
                </header>
                <h3 className="aiop-substrate-map__col-title">
                  {substrateMapSection.columns.surfaces.title}
                </h3>
                <ul className="aiop-substrate-map__surfaces" role="list">
                  {substrateMapSection.columns.surfaces.items.map((s) => (
                    <li key={s.name} className="aiop-substrate-map__surface">
                      <span
                        className="aiop-substrate-map__surface-icon"
                        aria-hidden="true"
                      >
                        {s.icon}
                      </span>
                      <span className="aiop-substrate-map__surface-name">
                        {s.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <footer className="aiop-substrate-map__card-foot">
              {substrateMapSection.closing}
            </footer>
          </div>
        </div>
      </section>

      {/* ─── Surface-pick + Stripe-reflect parallax pair ──────────── */}
      <div className="aiop-surface-and-reflect">
      <section className="aiop-section aiop-surface-pick" id="surface-pick">
        <div className="aiop-wrap">
          <header className="aiop-surface-pick__head aiop-reveal">
            <h2 className="aiop-section-title aiop-surface-pick__title">
              {surfacePickSection.title}{" "}
              <em>{surfacePickSection.titleEm}</em>
            </h2>
            <p className="aiop-surface-pick__lede">
              {surfacePickSection.body}
            </p>
          </header>

          <div className="aiop-surface-pick__card aiop-reveal">
            <header className="aiop-surface-pick__card-head">
              <span className="aiop-surface-pick__card-label">
                <span
                  className="aiop-surface-pick__card-dot"
                  aria-hidden="true"
                />
                {surfacePickSection.cardLabel}
              </span>
              <span className="aiop-surface-pick__card-flow">
                {surfacePickSection.flow}
              </span>
            </header>

            <div className="aiop-surface-pick__layout">
              <ol className="aiop-surface-pick__interfaces" role="list">
                {surfacePickSection.interfaces.map((iface) => (
                  <li
                    key={iface.id}
                    className={`aiop-surface-pick__interface aiop-surface-pick__interface--${iface.id}${
                      iface.recommended
                        ? " aiop-surface-pick__interface--recommended"
                        : ""
                    }`}
                  >
                    <header className="aiop-surface-pick__interface-head">
                      <span
                        className="aiop-surface-pick__interface-icon"
                        aria-hidden="true"
                      >
                        {iface.icon}
                      </span>
                      <div className="aiop-surface-pick__interface-text">
                        <span className="aiop-surface-pick__interface-label">
                          {iface.label}
                          {iface.recommended ? (
                            <span className="aiop-surface-pick__interface-badge">
                              Default
                            </span>
                          ) : null}
                        </span>
                        <span className="aiop-surface-pick__interface-sublabel">
                          {iface.sublabel}
                        </span>
                      </div>
                    </header>
                    <p className="aiop-surface-pick__interface-detail">
                      {iface.detail}
                    </p>
                  </li>
                ))}
              </ol>

              <aside
                className="aiop-surface-pick__destinations"
                aria-label={surfacePickSection.surfacesLabel}
              >
                <p className="aiop-surface-pick__destinations-label">
                  {surfacePickSection.surfacesLabel}
                </p>
                <ul
                  className="aiop-surface-pick__roles"
                  role="list"
                >
                  {surfacePickSection.roleSurfaces.map((row) => (
                    <li
                      key={row.role}
                      className="aiop-surface-pick__role"
                    >
                      <span className="aiop-surface-pick__role-label">
                        {row.role}
                      </span>
                      <span className="aiop-surface-pick__role-surface">
                        <span
                          className="aiop-surface-pick__role-icon"
                          aria-hidden="true"
                        >
                          {row.icon}
                        </span>
                        <span className="aiop-surface-pick__role-name">
                          {row.surface}
                        </span>
                      </span>
                      <span className="aiop-surface-pick__role-note">
                        {row.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>

            <footer className="aiop-surface-pick__card-foot">
              {surfacePickSection.closing}
            </footer>
          </div>
        </div>
      </section>

      <StripeReflect />
      </div>
      <StripeLedger />
      <CaseLedger />

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section
        className="aiop-section aiop-section--tight aiop-cta"
        id="cta"
      >
        <div className="aiop-wrap">
          <div className="aiop-cta__grid">
            <div className="aiop-reveal">
              <p className="aiop-eyebrow aiop-eyebrow--ink">
                {ctaSection.eyebrow}
              </p>
              <h2 className="aiop-cta__title">
                <em>{ctaSection.titleEm}</em>
              </h2>
              <p className="aiop-cta__body">{ctaSection.body}</p>
              <p className="aiop-cta__fine">{ctaSection.fine}</p>
            </div>
            <div className="aiop-cta__right aiop-reveal">
              <div className="aiop-cta__morph" aria-hidden="true">
                <LoopStripeMorph />
              </div>
              {(() => {
                const primaries = ctaSection.actions.filter(
                  (a) => a.kind === "primary",
                );
                const ghosts = ctaSection.actions.filter(
                  (a) => a.kind === "ghost",
                );
                return (
                  <>
                    <div
                      className="aiop-cta__primary-row"
                      aria-label="Get in touch"
                    >
                      {primaries.map((action) => (
                        <a
                          key={action.id}
                          className="aiop-cta__primary"
                          href={action.href}
                          {...(action.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                        >
                          <span className="aiop-cta__primary-label">
                            {action.label}
                          </span>
                          <span
                            className="aiop-cta__primary-arrow"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                    <div
                      className="aiop-cta__ghost-row"
                      aria-label="Application materials"
                    >
                      {ghosts.map((action) => (
                        <a
                          key={action.id}
                          className="aiop-cta__ghost"
                          href={action.href}
                          {...(action.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                        >
                          <span className="aiop-cta__ghost-label">
                            {action.label}
                          </span>
                          <span
                            className="aiop-cta__ghost-arrow"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
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

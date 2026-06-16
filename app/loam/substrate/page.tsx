import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import { Fragment } from "react";

import { LoamReveal } from "@/components/loam/reveal";
import { SubstrateFigure } from "@/components/loam/substrate/figure";
import { SubstrateFlywheel } from "@/components/loam/substrate/substrate-flywheel";
import { SubstrateNav } from "@/components/loam/substrate/substrate-nav";
import {
  loamClose,
  loamFoundersSection,
  loamMethodSection,
  loamOfferSection,
  loamQualifierSection,
  loamScopeSection,
  loamShiftSection,
  loamSpectrumBands,
  loamSpectrumFoot,
  loamSpectrumHead,
  loamSubstrate,
  loamTestimonial,
} from "@/content/loam";

import "../loam.css";
import "./substrate.css";

/*
 * /loam/substrate — flagship single-page Loam site.
 *
 * Deliberately rebuilt to break the eyebrow / title / sub then
 * identical-card-grid rhythm that the Weave direction settled into.
 * Every section here gets a distinct asymmetric archetype, the page
 * descends through alternating light "surface" and dark "soil" zones,
 * and a scroll-driven mycelial-blueprint network draws on behind the
 * hero. The leitmotif is silica meeting mycelia: precision blueprint
 * grid laced with growing hyphae and amber junctions.
 *
 * Content sits in content/loam.ts — both the long-standing exports
 * and the additive loamSubstrate overlay (industrial annotations,
 * VC-ladder copy, colophon).
 */

const display = Archivo({
  variable: "--font-substrate-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-substrate-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-substrate-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loam / Substrate — the living layer your work grows from",
  description:
    "A forward-deployed AI practice for creative work. Two operators embed inside one team for a quarter, ship the work, encode how the team decides, and leave behind the intelligence layer every future AI tool inherits from.",
  robots: { index: false, follow: false },
};

const portraits: Record<string, string> = {
  vince: "/images/vince-portrait.png",
  rob: "/images/rob-weston.png",
};

const substrateDiagnosis = loamSubstrate.diagnosis;
const substrateLayer = loamSubstrate.layer;

/* The shift section sums the two announced joint ventures into the
   $11.5B headline figure. Pulled from a constant rather than the card
   bodies so future content edits don't drift. */
const FRONTIER_SUM = "$11.5B";

export default function LoamSubstratePage() {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${mono.variable} loam-stage loam-substrate`}
    >
      <LoamReveal />

      <SubstrateNav
        brand="Loam"
        kicker={[
          { label: loamSubstrate.hero.kind },
          { label: loamSubstrate.hero.operators },
          { label: loamSubstrate.hero.est },
        ]}
        links={loamSubstrate.nav}
        cta={{ label: "Start a conversation", href: "#close" }}
      />

      <main>
        {/* ------------------------------------------------------------
            Hero — Enerblock-style split. Left column: eyebrow, display
            headline ("AI capability built inside your teams"), broadened
            descriptor for marketing + creative teams, actions. Right
            column: the iconic flywheel mark with a drawing-label plate
            overlaid bottom-right. Stays on the light --surface palette
            so the rest of the page reads as a continuous descent.
        ------------------------------------------------------------ */}
        <section className="subs-hero" id="top" aria-label="Loam">
          <div className="subs-hero__text">
            <div className="subs-hero__eyebrow reveal">
              {loamSubstrate.hero.eyebrow}
            </div>
            <h1 className="subs-hero__headline reveal">
              {loamSubstrate.hero.headline}{" "}
              <em>{loamSubstrate.hero.headlineEm}</em>
            </h1>
            <p className="subs-hero__descriptor reveal">
              {loamSubstrate.hero.descriptor}
            </p>
            <div className="subs-hero__actions reveal">
              {loamSubstrate.hero.actions.map((a) => {
                const primary = "primary" in a && a.primary;
                return (
                  <a
                    key={a.id}
                    href={a.href}
                    className={`subs-btn ${
                      primary ? "subs-btn--primary" : "subs-btn--ghost"
                    }`}
                  >
                    {a.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="subs-hero__visual reveal" aria-hidden="true">
            <SubstrateFlywheel variant="mark" className="subs-hero__fly" />
            <div className="subs-hero__plate">
              <span className="subs-hero__plate-mark" aria-hidden="true" />
              <div className="subs-hero__plate-fields">
                <b>{loamSubstrate.hero.plate.drawing}</b>
                <span>{loamSubstrate.hero.plate.drawingNo}</span>
                <span>{loamSubstrate.hero.plate.scale}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Engine — the motion that builds the intelligence layer.
            Centered, light surface. The hero flywheel reads as iconic;
            this section makes the motion explicit: Adoption and
            Automation loop around a chartreuse hub, surrounded by the
            surfaces every tool and agent inherits from. Distinct from
            the later "Substrate / the layer" anatomy section: this is
            the thesis, that is the dissection.
        ------------------------------------------------------------ */}
        <section
          className="subs-section subs-engine"
          id={loamSubstrate.engine.id}
          aria-label="The motion"
        >
          <div className="subs-section__inner subs-engine__inner">
            <div className="subs-engine__head reveal">
              <SubstrateFigure
                label={loamSubstrate.figs.engine.label}
                caption={loamSubstrate.figs.engine.caption}
                className="subs-engine__fig"
              />
              <div className="subs-engine__eyebrow">
                {loamSubstrate.engine.eyebrow}
              </div>
              <h2 className="subs-engine__title">
                {loamSubstrate.engine.headline}{" "}
                <em>{loamSubstrate.engine.headlineEm}</em>
              </h2>
              <p className="subs-engine__sub">{loamSubstrate.engine.sub}</p>
            </div>

            <div className="subs-engine__stage reveal">
              <div className="subs-engine__diagram">
                <SubstrateFlywheel variant="engine" />

                {/* Adoption sits in the left lobe, Automation in the
                    right lobe, the hub between them. */}
                <div className="subs-engine__arc-label subs-engine__arc-label--adoption">
                  <span className="subs-engine__arc-tag">01</span>
                  <b>{loamSubstrate.engine.arcs.adoption.label}</b>
                  <span className="subs-engine__arc-cap">
                    {loamSubstrate.engine.arcs.adoption.caption}
                  </span>
                </div>
                <div className="subs-engine__arc-label subs-engine__arc-label--automation">
                  <span className="subs-engine__arc-tag">02</span>
                  <b>{loamSubstrate.engine.arcs.automation.label}</b>
                  <span className="subs-engine__arc-cap">
                    {loamSubstrate.engine.arcs.automation.caption}
                  </span>
                </div>

                <div className="subs-engine__hub-label">
                  <span className="subs-engine__hub-eyebrow">
                    {loamSubstrate.engine.hub.eyebrow}
                  </span>
                  <span className="subs-engine__hub-title">
                    {loamSubstrate.engine.hub.title}
                  </span>
                </div>

                {loamSubstrate.engine.surfaces.map((s, i) => (
                  <span
                    key={s}
                    className={`subs-engine__chip subs-engine__chip--${i}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="subs-engine__foot reveal">
              <p className="subs-engine__caption">
                {loamSubstrate.engine.caption}
              </p>
              <a
                className="subs-btn subs-btn--ghost"
                href={loamSubstrate.engine.cta.href}
              >
                {loamSubstrate.engine.cta.label}
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Diagnosis — calm core sample before the market proof.
        ------------------------------------------------------------ */}
        <section
          className="subs-section subs-section--diagnosis"
          id={substrateDiagnosis.head.id}
        >
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.diagnosis.label}
              caption={loamSubstrate.figs.diagnosis.caption}
              className="reveal"
            />
            <div className="subs-diag__head">
              <h2 className="subs-diag__title reveal">
                {substrateDiagnosis.head.title}{" "}
                <em>{substrateDiagnosis.head.titleEm}</em>
              </h2>
              <p className="subs-diag__sub reveal">
                {substrateDiagnosis.head.sub}
              </p>
            </div>

            <div className="subs-strata" data-loam-stack>
              {substrateDiagnosis.cards.map((card) => (
                <article key={card.id} className="subs-strata__row reveal">
                  <span className="subs-strata__n">{card.tag}</span>
                  <h3 className="subs-strata__title">{card.title}</h3>
                  <p className="subs-strata__body">{card.body}</p>
                </article>
              ))}
            </div>

            <p className="subs-diag__cause reveal">
              <span className="subs-diag__cause-tag">
                {substrateDiagnosis.gap.eyebrow}
              </span>
              <span className="subs-diag__cause-body">
                {substrateDiagnosis.gap.body}
              </span>
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Substrate — the intelligence layer as three calm blocks.
            Applies the keynote's three-part principle (sources /
            encoded judgment / surfaces) in the Substrate register,
            without the pinned scroll choreography.
        ------------------------------------------------------------ */}
        <section
          className="subs-section subs-section--soil subs-layer"
          id="substrate"
          aria-label="The living layer"
        >
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.substrate.label}
              caption={loamSubstrate.figs.substrate.caption}
              className="reveal"
            />
            <div className="subs-layer__head">
              <h2 className="subs-layer__title reveal">
                {substrateLayer.title} <em>{substrateLayer.titleEm}</em>
              </h2>
              <p className="subs-layer__lede reveal">{substrateLayer.body}</p>
            </div>

            <div className="subs-layer__grid" data-loam-stack>
              {/* 01 — Trusted sources */}
              <article className="subs-layer__col reveal">
                <span className="subs-layer__kicker">
                  {substrateLayer.columns.sources.n} ·{" "}
                  {substrateLayer.columns.sources.kicker}
                </span>
                <h3 className="subs-layer__coltitle">
                  {substrateLayer.columns.sources.title}
                </h3>
                <p className="subs-layer__caption">
                  {substrateLayer.columns.sources.caption}
                </p>
                <ul className="subs-layer__chips" role="list">
                  {substrateLayer.columns.sources.systems.items.map((item) => (
                    <li key={item} className="subs-layer__chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              {/* 02 — Encoded substrate (the half no vendor sells) */}
              <article className="subs-layer__col subs-layer__col--mid reveal">
                <span className="subs-layer__kicker">
                  {substrateLayer.columns.substrate.n} ·{" "}
                  {substrateLayer.columns.substrate.kicker}
                </span>
                <h3 className="subs-layer__coltitle">
                  {substrateLayer.columns.substrate.title}
                </h3>
                <p className="subs-layer__caption">
                  {substrateLayer.columns.substrate.caption}
                </p>
                <ul className="subs-layer__rows" role="list">
                  {substrateLayer.columns.substrate.items.map((item) => (
                    <li key={item.tag} className="subs-layer__row">
                      <span className="subs-layer__row-tag">{item.tag}</span>
                      <span className="subs-layer__row-name">{item.name}</span>
                    </li>
                  ))}
                </ul>
                <ul className="subs-layer__tags" role="list">
                  {substrateLayer.columns.substrate.tags.map((t) => (
                    <li key={t} className="subs-layer__tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>

              {/* 03 — Headless surfaces */}
              <article className="subs-layer__col reveal">
                <span className="subs-layer__kicker">
                  {substrateLayer.columns.surfaces.n} ·{" "}
                  {substrateLayer.columns.surfaces.kicker}
                </span>
                <h3 className="subs-layer__coltitle">
                  {substrateLayer.columns.surfaces.title}
                </h3>
                <p className="subs-layer__caption">
                  {substrateLayer.columns.surfaces.caption}
                </p>
                <ul className="subs-layer__surfaces" role="list">
                  {substrateLayer.columns.surfaces.items.map((s) => (
                    <li key={s.name} className="subs-layer__surface">
                      <span
                        className="subs-layer__surface-icon"
                        aria-hidden="true"
                      >
                        {s.icon}
                      </span>
                      <span className="subs-layer__surface-name">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <p className="subs-layer__close reveal">{substrateLayer.closing}</p>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Shift — asymmetric ledger with the $11.5B figure. No grid.
        ------------------------------------------------------------ */}
        <section className="subs-section" id={loamShiftSection.id}>
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.shift.label}
              caption={loamSubstrate.figs.shift.caption}
              className="reveal"
            />
            <div className="subs-shift__head">
              <div className="reveal">
                <div className="subs-shift__sum">
                  {FRONTIER_SUM}
                  <sup>committed in 2026</sup>
                </div>
                <div className="subs-shift__sum-cap">
                  OpenAI DeployCo + Anthropic Claude Services
                </div>
              </div>
              <div className="reveal">
                <h2 className="subs-shift__title">
                  {loamShiftSection.title} <em>{loamShiftSection.titleEm}</em>{" "}
                  {loamShiftSection.titleAfter}
                </h2>
                <p className="subs-shift__sub">{loamShiftSection.sub}</p>
              </div>
            </div>

            <div className="subs-ledger" data-loam-stack>
              {loamShiftSection.cards.map((card, i) => (
                <a
                  key={card.id}
                  className="subs-ledger__row reveal"
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="subs-ledger__fig">
                    FIG. {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="subs-ledger__name">{card.mark}</span>
                    <span className="subs-ledger__kicker">{card.kicker}</span>
                  </div>
                  <div>
                    <h3 className="subs-ledger__head">{card.headline}</h3>
                    <p className="subs-ledger__body">{card.body}</p>
                    <span className="subs-ledger__meta">{card.meta}</span>
                  </div>
                </a>
              ))}
            </div>

            <p className="subs-shift__close reveal">
              {loamShiftSection.closing.lead}{" "}
              <em>{loamShiftSection.closing.accent}</em>
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Spectrum — horizontal growth rule, oversized stats.
        ------------------------------------------------------------ */}
        <section className="subs-section" id={loamSpectrumHead.id}>
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.spectrum.label}
              caption={loamSubstrate.figs.spectrum.caption}
              className="reveal"
            />
            <div className="subs-spec__head">
              <h2 className="subs-spec__title reveal">
                {loamSpectrumHead.title}{" "}
                <em>{loamSpectrumHead.titleEm}</em>
              </h2>
              <p className="subs-spec__sub reveal">{loamSpectrumHead.sub}</p>
            </div>

            <div className="subs-spec__rule" data-loam-stack>
              {loamSpectrumBands.map((band, i) => (
                <article
                  key={band.id}
                  className={`subs-spec__band reveal ${
                    i === 1 ? "subs-spec__band--mid" : ""
                  }`}
                >
                  <span className="subs-spec__band-n">{band.tag}</span>
                  <h3 className="subs-spec__band-title">{band.title}</h3>
                  <p className="subs-spec__band-body">{band.body}</p>
                  <div className="subs-spec__band-stats">
                    {band.stats.map((s) => (
                      <div key={s.label} className="subs-spec__band-stat">
                        <b>{s.value}</b>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className="subs-spec__band-note">{band.note}</span>
                </article>
              ))}
            </div>

            <p className="subs-spec__close reveal">{loamSpectrumFoot}</p>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Method — asymmetric 01 / 02 / 03 with offset indents.
        ------------------------------------------------------------ */}
        <section className="subs-section" id={loamMethodSection.id}>
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.method.label}
              caption={loamSubstrate.figs.method.caption}
              className="reveal"
            />
            <div className="subs-method__head reveal">
              <h2 className="subs-method__title">
                {loamMethodSection.title}{" "}
                <em>{loamMethodSection.titleEm}</em>
              </h2>
              <p className="subs-method__sub">{loamMethodSection.sub}</p>
            </div>

            <div className="subs-method__phases" data-loam-stack>
              {loamMethodSection.steps.map((step) => (
                <article key={step.id} className="subs-method__phase reveal">
                  <div className="subs-method__phase-l">
                    <span className="subs-method__phase-n">{step.n}</span>
                    <span className="subs-method__phase-label">
                      {step.label}
                    </span>
                  </div>
                  <div>
                    <h3 className="subs-method__phase-title">{step.title}</h3>
                    <p className="subs-method__phase-body">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Scope — anti-positioning + executive depth as annotated list.
        ------------------------------------------------------------ */}
        <section className="subs-section" id={loamScopeSection.id}>
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.scope.label}
              caption={loamSubstrate.figs.scope.caption}
              className="reveal"
            />
            <div className="subs-scope__head">
              <div className="reveal">
                <div className="subs-scope__overline">
                  {loamSubstrate.scopeFrame.overline}
                </div>
                <h2 className="subs-scope__statement">
                  <em>{loamSubstrate.scopeFrame.statement}</em>
                </h2>
              </div>
              <p className="subs-scope__body reveal">
                {loamSubstrate.scopeFrame.body}
              </p>
            </div>

            <div className="subs-scope__list" data-loam-stack>
              {loamScopeSection.cards.map((card) => (
                <article key={card.id} className="subs-scope__row reveal">
                  <span className="subs-scope__row-n">{card.n}</span>
                  <h3 className="subs-scope__row-title">{card.title}</h3>
                  <p className="subs-scope__row-body">{card.body}</p>
                </article>
              ))}
            </div>

            <div className="subs-scope__qual reveal">
              {loamQualifierSection.cards.map((c) => (
                <div key={c.id} className="subs-scope__qual-cell">
                  <span className="subs-scope__qual-label">{c.label}</span>
                  <p className="subs-scope__qual-body">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Engage — dark zone, escalating VC tier ladder.
        ------------------------------------------------------------ */}
        <section
          className="subs-section subs-section--soil"
          id={loamOfferSection.id}
        >
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.engage.label}
              caption={loamSubstrate.figs.engage.caption}
              className="reveal"
            />
            <div className="subs-engage__head">
              <h2 className="subs-engage__title reveal">
                {loamSubstrate.tiers.headline}{" "}
                <em>{loamSubstrate.tiers.headlineEm}</em>
              </h2>
              <p className="subs-engage__sub reveal">
                {loamSubstrate.tiers.body}
                <br />
                <b>{loamSubstrate.tiers.tagline}</b>
              </p>
            </div>

            <div className="subs-engage__tiers" data-loam-stack>
              {loamOfferSection.cards.map((card, i) => {
                const variant =
                  i === 1
                    ? "subs-engage__tier--mid"
                    : i === 2
                      ? "subs-engage__tier--top"
                      : "";
                return (
                  <article
                    key={card.n}
                    className={`subs-engage__tier reveal ${variant}`}
                  >
                    <span className="subs-engage__tier-fig">
                      TIER {card.n}
                    </span>
                    <span className="subs-engage__tier-n">{card.n}</span>
                    <h3 className="subs-engage__tier-title">{card.title}</h3>
                    <p className="subs-engage__tier-body">{card.body}</p>
                    <ul className="subs-engage__tier-bullets" role="list">
                      {card.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <div className="subs-engage__tier-meta">
                      <span>{card.meta}</span>
                      <b>{card.cta}</b>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="subs-engage__footnote reveal">
              {loamSubstrate.tiers.footnote}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Founders — offset split with portraits.
        ------------------------------------------------------------ */}
        <section className="subs-section" id={loamFoundersSection.id}>
          <div className="subs-section__inner">
            <SubstrateFigure
              label={loamSubstrate.figs.founders.label}
              caption={loamSubstrate.figs.founders.caption}
              className="reveal"
            />
            <div className="subs-founders__head">
              <h2 className="subs-founders__title reveal">
                {loamFoundersSection.title}{" "}
                <em>{loamFoundersSection.titleEm}</em>
              </h2>
              <p className="subs-founders__sub reveal">
                {loamFoundersSection.sub}
              </p>
            </div>

            <div className="subs-founders__pair" data-loam-stack>
              {loamFoundersSection.founders.map((f) => (
                <article key={f.id} className="subs-founder reveal">
                  <div className="subs-founder__head">
                    <Image
                      className="subs-founder__portrait"
                      src={portraits[f.id] ?? f.portrait.src}
                      alt={f.portrait.alt}
                      width={88}
                      height={88}
                    />
                    <div>
                      <div className="subs-founder__name">{f.name}</div>
                      <div className="subs-founder__role">{f.role}</div>
                    </div>
                  </div>
                  {f.bio.map((p) => (
                    <p key={p} className="subs-founder__bio">
                      {p}
                    </p>
                  ))}
                  <div className="subs-founder__creds">
                    {f.credentials.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                  <p className="subs-founder__owns">
                    <b>Owns.</b> {f.owns}
                  </p>
                </article>
              ))}
            </div>

            <aside className="subs-founders__why reveal">
              <h3 className="subs-founders__why-head">
                {loamFoundersSection.pairing.headline}
              </h3>
              <p className="subs-founders__why-body">
                {loamFoundersSection.pairing.body}
              </p>
            </aside>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Testimonial — dark band, oversized pull quote.
        ------------------------------------------------------------ */}
        <section className="subs-section subs-quote" aria-label="Testimonial">
          <div className="subs-quote__bg" aria-hidden="true" />
          <div className="subs-section__inner subs-quote__inner">
            <blockquote className="subs-quote__text reveal">
              <span>&ldquo;{loamTestimonial.quote}&rdquo;</span>
            </blockquote>
            <figcaption className="subs-quote__cite reveal">
              <b>{loamTestimonial.name}</b>
              <span>{loamTestimonial.role}</span>
            </figcaption>
          </div>
        </section>

        {/* ------------------------------------------------------------
            Close — bloom CTA.
        ------------------------------------------------------------ */}
        <section className="subs-section subs-close" id={loamClose.id}>
          <div className="subs-section__inner subs-close__inner">
            <div className="reveal">
              <div className="subs-close__overline">
                {loamSubstrate.close.overline}
              </div>
              <h2 className="subs-close__title">
                {loamSubstrate.close.title}
                <em>{loamSubstrate.close.titleEm}</em>
                <b>{loamSubstrate.close.titleAfter}</b>
              </h2>
            </div>
            <div className="reveal">
              <p className="subs-close__body">{loamSubstrate.close.body}</p>
              <div className="subs-close__actions">
                {loamClose.actions.map((a) => {
                  const isPrimary = "primary" in a && a.primary;
                  return (
                    <Fragment key={a.id}>
                      <a
                        href={a.href}
                        className={`subs-btn ${
                          isPrimary ? "subs-btn--primary" : "subs-btn--ghost"
                        }`}
                      >
                        {a.label}
                      </a>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ----------------------------------------------------------------
          Footer — engineering colophon.
      ---------------------------------------------------------------- */}
      <footer className="subs-colophon" aria-label="Colophon">
        <div className="subs-colophon__inner">
          <div className="subs-colophon__brand">
            <b>Loam</b>
            <span>{loamSubstrate.colophon.statement}</span>
          </div>
          <div className="subs-colophon__field">
            <b>{loamSubstrate.colophon.drawing}</b>
            <span>{loamSubstrate.colophon.title}</span>
          </div>
          <div className="subs-colophon__field">
            <b>{loamSubstrate.colophon.est}</b>
            <span>{loamSubstrate.colophon.scale}</span>
          </div>
          <div className="subs-colophon__field">
            <b>OPERATORS</b>
            <span>{loamSubstrate.colophon.authors}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

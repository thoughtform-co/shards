import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";
import Link from "next/link";

import { CreativeHud } from "@/components/creative-workshop/creative-hud";
import { AboutFounders } from "@/components/forward-deployed/about-founders";
import { SpectrumProof } from "@/components/forward-deployed/spectrum-proof";
import { FlywheelOrbit } from "@/components/operator/flywheel-orbit";
import { ScrollReveal as OperatorScrollReveal } from "@/components/operator/reveal";
import { ScrollReveal as SharedScrollReveal } from "@/components/shared/reveal";
import { Signal } from "@/components/operator/signal";
import { SubstrateMap } from "@/components/intelligence-layer/substrate-map";
import { TeamShape } from "@/components/operator/team-shape";
import {
  fdClose,
  fdDiagnosisCards,
  fdDiagnosisGap,
  fdDiagnosisHead,
  fdFlywheelSection,
  fdFooter,
  fdHero,
  fdMeta,
  fdOfferSection,
  fdQualifierSection,
  fdScopeSection,
  fdSignalSection,
  fdSubstrateMap,
  fdTeamShapeSection,
  fdTestimonial,
  fdVision,
} from "@/content/forward-deployed";

import "@/components/landing/landing.css";
import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "@/components/claude-workshop/claude-workshop.css";
import "@/components/claude-adoption/claude-adoption.css";
import "../creative-ai-workshop/creative-ai-workshop.css";
import "@/components/forward-deployed/forward-deployed.css";

/*
 * /forward-deployed — pitch leave-behind for the forward-deployed AI
 * consultancy co-founded by Vince Buyssens and Rob Weston.
 *
 * Reuses the Thoughtform `/ai-keynote` chassis (light shell, HUD,
 * fonts) but strips the tutorial / Loop-internal beats that don't
 * belong in a VC / exec-facing leave-behind:
 *   - both VideoSection canon beats (Michael Levin, Anthropic
 *     prompting advice)
 *   - ClaudeSkillAnatomy and the Claude getting-started zone
 *   - WorkshopApproach diagram art with its 22 Loop teams
 *   - SkillsByTeam donut, Cases codenames, EvansBridge
 *   - DiagnosisWithRoleFilter (replaced by a static exec diagnosis,
 *     so the page does not need RoleProvider / Suspense /
 *     UseCasesProvider)
 *
 * Adds three new beats on top of the chassis:
 *   - SpectrumProof (Production / Adoption / Automation in one block)
 *   - WhatWeOwn (exec-grade scope: strategy, governance, change, ROI)
 *   - AboutFounders (Vince + Rob two-up)
 *
 * Reuses Signal, SubstrateMap, FlywheelOrbit, and TeamShape with
 * prop overrides from `content/forward-deployed.ts`.
 *
 * Gated behind the site password by `proxy.ts`; metadata is set to
 * noindex so search bots cannot pick it up.
 */

const aiopDisplay = IBM_Plex_Sans({
  variable: "--aiop-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const aiopBody = IBM_Plex_Sans({
  variable: "--aiop-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const aiopMono = PT_Mono({
  variable: "--aiop-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thoughtform · Forward-Deployed AI",
  description:
    "A forward-deployed AI consultancy for scale-up marketing teams. Two operators embed inside the function for a quarter, ship the work, encode how the team decides, and leave behind the intelligence layer every future tool will inherit from.",
  robots: { index: false, follow: false },
};

export default function ForwardDeployedPage() {
  return (
    <div
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-shell--tf-light aiop-stage aiop-workshop-v1 fd-stage`}
    >
      <CreativeHud />
      <OperatorScrollReveal />
      <SharedScrollReveal />

      <header className="aiop-header">
        <div className="aiop-wrap aiop-header__inner">
          <Link className="aiop-brand" href="/">
            <span className="aiop-brand__mark">
              <span className="aiop-brand__diamond" aria-hidden="true" />
              <span className="aiop-brand__name">{fdMeta.brandLeft}</span>
            </span>
            <span className="aiop-brand__sub">{fdMeta.brandSub}</span>
          </Link>

          <nav className="aiop-nav" aria-label="Sections">
            {fdMeta.links.map((link) => (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <a
            className="aiop-header__status fd-header__cta"
            href={fdMeta.cta.href}
          >
            <span className="aiop-header__status-dot" aria-hidden="true" />
            <span>{fdMeta.cta.label}</span>
          </a>
        </div>
      </header>

      <main>
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="aiop-hero aiop-hero--minimal" id="top">
          <div className="aiop-grid-bg" aria-hidden="true" />
          <div className="aiop-wrap aiop-hero__inner aiop-hero__inner--minimal">
            <div className="aiop-hero__copy aiop-reveal">
              <h1 className="aiop-hero__title aiop-hero__title--minimal">
                {fdHero.titleLines.map((line, idx) => (
                  <span key={idx} className="aiop-hero__title-line">
                    {typeof line === "string" ? line : <em>{line.em}</em>}
                  </span>
                ))}
              </h1>
              <div className="aiop-hero__lede aiop-hero__lede--minimal">
                {fdHero.lede.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="aiop-hero__actions">
                {fdHero.actions.map((action) => (
                  <a
                    key={action.id}
                    className={`aiop-button${
                      "primary" in action && action.primary
                        ? ""
                        : " aiop-button--ghost"
                    }`}
                    href={action.href}
                  >
                    {action.label}
                    <span className="aiop-button__arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="aiop-hero__orbit-stage aiop-reveal">
              <FlywheelOrbit
                variant="compact"
                bloom
                section={fdFlywheelSection}
              />
            </div>
          </div>
        </section>

        {/* ─── Signal · frontier validation ─────────────────────── */}
        <Signal section={fdSignalSection} />

        {/* ─── Diagnosis · static exec view ─────────────────────── */}
        <section
          className="aiop-section fd-diagnosis"
          id="diagnosis"
          aria-labelledby="fd-diagnosis-title"
        >
          <div className="aiop-wrap fd-diagnosis__inner">
            <header className="fd-diagnosis__head aiop-reveal">
              <span className="fd-diagnosis__eyebrow">
                {fdDiagnosisHead.eyebrow}
              </span>
              <h2 className="fd-diagnosis__title" id="fd-diagnosis-title">
                {fdDiagnosisHead.title} <em>{fdDiagnosisHead.titleEm}</em>
              </h2>
              <p className="fd-diagnosis__sub">{fdDiagnosisHead.sub}</p>
            </header>

            <ul className="fd-diagnosis__grid aiop-reveal" role="list">
              {fdDiagnosisCards.map((card) => (
                <li
                  key={card.id}
                  className={`fd-diagnosis__card fd-diagnosis__card--tone-${card.tone}`}
                >
                  <span className="fd-diagnosis__card-tag">{card.tag}</span>
                  <h3 className="fd-diagnosis__card-title">{card.title}</h3>
                  <p className="fd-diagnosis__card-body">{card.body}</p>
                </li>
              ))}
            </ul>

            <aside className="fd-diagnosis__gap aiop-reveal">
              <span className="fd-diagnosis__gap-eyebrow">
                {fdDiagnosisGap.eyebrow}
              </span>
              <p className="fd-diagnosis__gap-title">{fdDiagnosisGap.title}</p>
            </aside>
          </div>
        </section>

        {/* ─── Spectrum · production / adoption / automation ────── */}
        <SpectrumProof />

        {/* ─── Substrate map · the moat ─────────────────────────── */}
        <SubstrateMap section={fdSubstrateMap} />

        {/* ─── Vision · the flywheel reframed ───────────────────── */}
        <section className="aiop-section aiop-vision" id="vision">
          <div className="aiop-wrap aiop-vision__inner aiop-reveal">
            <header className="aiop-section-head aiop-vision__head">
              <h2 className="aiop-section-title aiop-vision__title">
                {fdVision.title} <em>{fdVision.titleEm}</em>
              </h2>
              <p className="aiop-section-head__sub aiop-vision__caption">
                {fdVision.caption}
              </p>
            </header>

            <FlywheelOrbit variant="centered" section={fdFlywheelSection} />
          </div>
        </section>

        {/* ─── What we own · exec scope ─────────────────────────── */}
        <section
          className="aiop-section fd-scope"
          id={fdScopeSection.id}
          aria-labelledby="fd-scope-title"
        >
          <div className="aiop-wrap fd-scope__inner">
            <header className="fd-scope__head aiop-reveal">
              <span className="fd-scope__eyebrow">
                {fdScopeSection.eyebrow}
              </span>
              <h2 className="fd-scope__title" id="fd-scope-title">
                {fdScopeSection.title} <em>{fdScopeSection.titleEm}</em>
              </h2>
              <p className="fd-scope__sub">{fdScopeSection.sub}</p>
            </header>

            <ul className="fd-scope__grid aiop-reveal" role="list">
              {fdScopeSection.cards.map((card) => (
                <li
                  key={card.id}
                  className={`fd-scope__card fd-scope__card--tone-${card.tone}`}
                >
                  <span className="fd-scope__card-n">{card.n}</span>
                  <h3 className="fd-scope__card-title">{card.title}</h3>
                  <p className="fd-scope__card-body">{card.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── Offer · three formats ────────────────────────────── */}
        <section
          className="aiop-section fd-offer"
          id={fdOfferSection.id}
          aria-labelledby="fd-offer-title"
        >
          <div className="aiop-wrap fd-offer__inner">
            <header className="fd-offer__head aiop-reveal">
              <span className="fd-offer__eyebrow">
                {fdOfferSection.eyebrow}
              </span>
              <h2 className="fd-offer__title" id="fd-offer-title">
                {fdOfferSection.title} <em>{fdOfferSection.titleEm}</em>
              </h2>
              <p className="fd-offer__sub">{fdOfferSection.sub}</p>
            </header>

            <ol className="fd-offer__grid aiop-reveal" role="list">
              {fdOfferSection.cards.map((card) => (
                <li className="fd-offer__card" key={card.n}>
                  <header className="fd-offer__card-head">
                    <span className="fd-offer__card-n">{card.n}</span>
                    <h3 className="fd-offer__card-title">{card.title}</h3>
                  </header>
                  <p className="fd-offer__card-body">{card.body}</p>
                  <ul className="fd-offer__card-bullets" role="list">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="fd-offer__card-bullet">
                        <span
                          className="fd-offer__card-bullet-tick"
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <footer className="fd-offer__card-foot">
                    <span className="fd-offer__card-meta">{card.meta}</span>
                    <span className="fd-offer__card-cta">{card.cta}</span>
                  </footer>
                </li>
              ))}
            </ol>

            <aside
              className="fd-qualifier aiop-reveal"
              aria-label={fdQualifierSection.eyebrow}
            >
              <header className="fd-qualifier__head">
                <span className="fd-qualifier__eyebrow">
                  {fdQualifierSection.eyebrow}
                </span>
                <h3 className="fd-qualifier__title">
                  {fdQualifierSection.title}
                </h3>
              </header>
              <dl className="fd-qualifier__rows">
                {fdQualifierSection.cards.map((card) => (
                  <div className="fd-qualifier__row" key={card.id}>
                    <dt className="fd-qualifier__row-label">{card.label}</dt>
                    <dd className="fd-qualifier__row-body">{card.body}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        {/* ─── Founders · Vince + Rob ───────────────────────────── */}
        <AboutFounders />

        {/* ─── Team shape · the explicit ask ────────────────────── */}
        <TeamShape section={fdTeamShapeSection} />

        {/* ─── Testimonial · outside voice ──────────────────────── */}
        <section
          className="aiop-section fd-testimonial"
          aria-label="External testimonial"
        >
          <div className="aiop-wrap fd-testimonial__inner aiop-reveal">
            <blockquote className="fd-testimonial__quote">
              {fdTestimonial.quote}
            </blockquote>
            <figcaption className="fd-testimonial__attribution">
              <span className="fd-testimonial__name">{fdTestimonial.name}</span>
              <span className="fd-testimonial__sep" aria-hidden="true">
                &middot;
              </span>
              <span className="fd-testimonial__role">{fdTestimonial.role}</span>
            </figcaption>
          </div>
        </section>

        {/* ─── Close · the ask ──────────────────────────────────── */}
        <section
          className="aiop-section aiop-section--tight fd-close"
          id={fdClose.id}
          aria-labelledby="fd-close-title"
        >
          <div className="aiop-wrap fd-close__inner">
            <header className="fd-close__head aiop-reveal">
              <span className="fd-close__eyebrow">{fdClose.eyebrow}</span>
              <h2 className="fd-close__title" id="fd-close-title">
                {fdClose.title} <em>{fdClose.titleEm}</em>
              </h2>
              <p className="fd-close__body">{fdClose.body}</p>
            </header>

            <div className="fd-close__actions aiop-reveal">
              {fdClose.actions.map((action) => (
                <a
                  key={action.id}
                  href={action.href}
                  className={`aiop-button${
                    "primary" in action && action.primary
                      ? ""
                      : " aiop-button--ghost"
                  }`}
                >
                  {action.label}
                  <span className="aiop-button__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="fd-footer" aria-label="Page footer">
        <div className="aiop-wrap fd-footer__inner">
          <div className="fd-footer__brand">
            <span className="fd-footer__mark">Thoughtform</span>
            <p className="fd-footer__line">{fdFooter.line}</p>
          </div>
          <p className="fd-footer__signature">{fdFooter.signature}</p>
        </div>
      </footer>
    </div>
  );
}

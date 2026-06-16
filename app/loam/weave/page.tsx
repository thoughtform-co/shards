import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { LoamReveal } from "@/components/loam/reveal";
import { WeaveCanvas } from "@/components/loam/weave/weave-canvas";
import { WeaveNav } from "@/components/loam/weave/weave-nav";
import {
  loamClose,
  loamDiagnosisCards,
  loamDiagnosisGap,
  loamDiagnosisHead,
  loamFooter,
  loamFoundersSection,
  loamLayerSection,
  loamMeta,
  loamMethodSection,
  loamOfferSection,
  loamQualifierSection,
  loamScopeSection,
  loamShiftSection,
  loamSpectrumBands,
  loamSpectrumFoot,
  loamSpectrumHead,
  loamTestimonial,
} from "@/content/loam";

import "../loam.css";
import "./weave.css";

/*
 * /loam/weave — the full single-page Loam site, Weave direction.
 *
 * Figma-Weave node-canvas language across the whole page: split bold
 * Inter Tight headlines, a light blueprint canvas, rounded white cards,
 * the dark pine "substrate" emphasis node, and a chartreuse accent.
 * Every section is driven by content/loam.ts. No HUD, no serif, no
 * keynote chassis.
 */

const display = Inter_Tight({
  variable: "--font-weave-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-weave-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loam — the living layer your work grows from",
  description:
    "Loam is a forward-deployed AI consultancy. Two operators embed inside a creative agency or marketing department for a quarter, ship the work, encode how the team decides, and leave behind the intelligence layer every future AI tool inherits from.",
  robots: { index: false, follow: false },
};

const layerStages = [
  loamLayerSection.columns.sources,
  loamLayerSection.columns.substrate,
  loamLayerSection.columns.surfaces,
] as const;

const portraits: Record<string, string> = {
  vince: "/images/vince-portrait.png",
  rob: "/images/rob-weston.png",
};

export default function LoamWeaveSite() {
  return (
    <div className={`${display.variable} ${sans.variable} loam-stage loam-weave`}>
      <LoamReveal />
      <WeaveNav links={loamMeta.links} cta={loamMeta.cta} />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="weave-hero" id="top">
          <div className="weave-hero__head">
            <div>
              <h1 className="weave-hero__title">Loam</h1>
              <p className="weave-hero__sub">
                Forward-deployed AI woven into how your team already works.
                We embed inside a creative agency or marketing department,
                encode the judgment, and leave behind the layer every tool
                inherits from.
              </p>
            </div>
            <h1 className="weave-hero__title weave-hero__title--right">
              The <em>living layer.</em>
            </h1>
          </div>
          <div className="reveal">
            <WeaveCanvas />
          </div>
        </section>

        {/* ---------------- Shift / signal ---------------- */}
        <section className="weave-section" id={loamShiftSection.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamShiftSection.eyebrow}
            </span>
            <h2 className="weave-section__title">
              {loamShiftSection.title} <em>{loamShiftSection.titleEm}</em>{" "}
              {loamShiftSection.titleAfter}
            </h2>
            <p className="weave-section__sub">{loamShiftSection.sub}</p>
          </div>

          <div className="weave-grid weave-grid--4" data-loam-stack>
            {loamShiftSection.cards.map((card) => (
              <a
                key={card.id}
                className="weave-tile reveal"
                href={card.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="weave-signal__mark">{card.mark}</span>
                <span className="weave-signal__kicker">{card.kicker}</span>
                <span className="weave-signal__headline">{card.headline}</span>
                <span className="weave-signal__body">{card.body}</span>
                <span className="weave-signal__meta">{card.meta}</span>
              </a>
            ))}
          </div>

          <p className="weave-signal__close reveal">
            {loamShiftSection.closing.lead}{" "}
            <span>{loamShiftSection.closing.accent}</span>
          </p>
        </section>

        {/* ---------------- Diagnosis ---------------- */}
        <section className="weave-section" id={loamDiagnosisHead.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamDiagnosisHead.eyebrow}
            </span>
            <h2 className="weave-section__title">
              {loamDiagnosisHead.title} <em>{loamDiagnosisHead.titleEm}</em>
            </h2>
            <p className="weave-section__sub">{loamDiagnosisHead.sub}</p>
          </div>

          <div className="weave-grid weave-grid--4" data-loam-stack>
            {loamDiagnosisCards.map((card) => (
              <article key={card.id} className="weave-tile reveal">
                <span className="weave-diag__tag">{card.tag}</span>
                <h3 className="weave-diag__title">{card.title}</h3>
                <p className="weave-diag__body">{card.body}</p>
              </article>
            ))}
          </div>

          <aside className="weave-diag__cause reveal">
            <span className="weave-diag__cause-tag">{loamDiagnosisGap.eyebrow}</span>
            <p className="weave-diag__cause-body">{loamDiagnosisGap.body}</p>
          </aside>
        </section>

        {/* ---------------- Spectrum ---------------- */}
        <section className="weave-section" id={loamSpectrumHead.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamSpectrumHead.eyebrow}
            </span>
            <h2 className="weave-section__title">
              {loamSpectrumHead.title} <em>{loamSpectrumHead.titleEm}</em>
            </h2>
            <p className="weave-section__sub">{loamSpectrumHead.sub}</p>
          </div>

          <div className="weave-grid weave-grid--3" data-loam-stack>
            {loamSpectrumBands.map((band) => (
              <article key={band.id} className="weave-tile reveal">
                <span className="weave-band__tag">{band.tag}</span>
                <h3 className="weave-band__title">{band.title}</h3>
                <p className="weave-band__body">{band.body}</p>
                <div className="weave-band__stats">
                  {band.stats.map((s) => (
                    <div key={s.label} className="weave-band__stat">
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <span className="weave-band__note">{band.note}</span>
              </article>
            ))}
          </div>
          <p className="weave-signal__close reveal">{loamSpectrumFoot}</p>
        </section>

        {/* ---------------- The layer (flow) ---------------- */}
        <section className="weave-section" id={loamLayerSection.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamLayerSection.eyebrow}
            </span>
            <h2 className="weave-section__title">
              Inputs in. Surfaces out. <em>Loam is the weave between.</em>
            </h2>
            <p className="weave-section__sub">{loamLayerSection.body}</p>
          </div>

          <div className="weave-stages reveal">
            {layerStages.map((s, i) => (
              <Fragment key={s.n}>
                <article
                  className={`weave-stage ${
                    i === 1 ? "weave-stage--mid" : ""
                  }`}
                >
                  <span className="weave-stage__tag">{s.kicker}</span>
                  <h3 className="weave-stage__title">{s.title}</h3>
                  <p className="weave-stage__body">{s.caption}</p>
                </article>
                {i < layerStages.length - 1 ? (
                  <div className="weave-stages__arrow" aria-hidden="true">
                    &rarr;
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
          <p className="weave-signal__close reveal">{loamLayerSection.closing}</p>
        </section>

        {/* ---------------- Method ---------------- */}
        <section className="weave-section" id={loamMethodSection.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamMethodSection.eyebrow}
            </span>
            <h2 className="weave-section__title">
              {loamMethodSection.title} <em>{loamMethodSection.titleEm}</em>
            </h2>
            <p className="weave-section__sub">{loamMethodSection.sub}</p>
          </div>

          <div className="weave-method" data-loam-stack>
            {loamMethodSection.steps.map((step) => (
              <article key={step.id} className="weave-step reveal">
                <span className="weave-step__n">{step.n}</span>
                <span className="weave-step__label">{step.label}</span>
                <span className="weave-step__title">{step.title}</span>
                <p className="weave-step__body">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- What we own (scope) ---------------- */}
        <section className="weave-section" id={loamScopeSection.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamScopeSection.eyebrow}
            </span>
            <h2 className="weave-section__title">
              {loamScopeSection.title} <em>{loamScopeSection.titleEm}</em>
            </h2>
            <p className="weave-section__sub">{loamScopeSection.sub}</p>
          </div>

          <div className="weave-grid weave-grid--4" data-loam-stack>
            {loamScopeSection.cards.map((card) => (
              <article key={card.id} className="weave-tile reveal">
                <span className="weave-scope__n">{card.n}</span>
                <h3 className="weave-scope__title">{card.title}</h3>
                <p className="weave-scope__body">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- Engage ---------------- */}
        <section className="weave-section" id={loamOfferSection.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamOfferSection.eyebrow}
            </span>
            <h2 className="weave-section__title">
              {loamOfferSection.title} <em>{loamOfferSection.titleEm}</em>
            </h2>
            <p className="weave-section__sub">{loamOfferSection.sub}</p>
          </div>

          <div className="weave-offer" data-loam-stack>
            {loamOfferSection.cards.map((card, i) => (
              <article
                key={card.n}
                className={`weave-offer-card reveal ${
                  i === 1 ? "weave-offer-card--mid" : ""
                }`}
              >
                <span className="weave-offer-card__n">{card.n}</span>
                <h3 className="weave-offer-card__title">{card.title}</h3>
                <p className="weave-offer-card__body">{card.body}</p>
                <ul className="weave-offer-card__bullets" role="list">
                  {card.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <span className="weave-offer-card__meta">{card.meta}</span>
              </article>
            ))}
          </div>

          <div className="weave-qualifier reveal">
            {loamQualifierSection.cards.map((c) => (
              <div key={c.id} className="weave-qualifier__cell">
                <div className="weave-qualifier__label">{c.label}</div>
                <p className="weave-qualifier__body">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Founders ---------------- */}
        <section className="weave-section" id={loamFoundersSection.id}>
          <div className="weave-section__head reveal">
            <span className="weave-section__overline">
              {loamFoundersSection.eyebrow}
            </span>
            <h2 className="weave-section__title">
              {loamFoundersSection.title} <em>{loamFoundersSection.titleEm}</em>
            </h2>
            <p className="weave-section__sub">{loamFoundersSection.sub}</p>
          </div>

          <div className="weave-founders" data-loam-stack>
            {loamFoundersSection.founders.map((f) => (
              <article key={f.id} className="weave-founder reveal">
                <div className="weave-founder__top">
                  <Image
                    className="weave-founder__portrait"
                    src={portraits[f.id] ?? f.portrait.src}
                    alt={f.portrait.alt}
                    width={64}
                    height={64}
                  />
                  <div>
                    <div className="weave-founder__name">{f.name}</div>
                    <div className="weave-founder__role">{f.role}</div>
                  </div>
                </div>
                {f.bio.map((p) => (
                  <p key={p} className="weave-founder__bio">
                    {p}
                  </p>
                ))}
                <div className="weave-founder__creds">
                  {f.credentials.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <p className="weave-founder__owns">
                  <b>Owns.</b> {f.owns}
                </p>
              </article>
            ))}
          </div>

          <aside className="weave-founders__why reveal">
            <div className="weave-founders__why-head">
              {loamFoundersSection.pairing.headline}
            </div>
            <p className="weave-founders__why-body">
              {loamFoundersSection.pairing.body}
            </p>
          </aside>
        </section>

        {/* ---------------- Testimonial ---------------- */}
        <section className="weave-quote" aria-label="Testimonial">
          <div className="weave-quote__panel reveal">
            <blockquote className="weave-quote__text">
              <span>&ldquo;{loamTestimonial.quote}&rdquo;</span>
            </blockquote>
            <figcaption className="weave-quote__cite">
              <b>{loamTestimonial.name}</b>
              <span>{loamTestimonial.role}</span>
            </figcaption>
          </div>
        </section>

        {/* ---------------- Close ---------------- */}
        <section className="weave-close" id={loamClose.id}>
          <div className="weave-close__panel reveal">
            <span className="weave-close__overline">{loamClose.eyebrow}</span>
            <h2 className="weave-close__title">
              {loamClose.title} {loamClose.titleEm}
            </h2>
            <p className="weave-close__body">{loamClose.body}</p>
            <div className="weave-close__actions">
              {loamClose.actions.map((a) => {
                const isPrimary = "primary" in a && a.primary;
                return (
                  <a
                    key={a.id}
                    href={a.href}
                    className={`weave-close__btn ${
                      isPrimary
                        ? "weave-close__btn--primary"
                        : "weave-close__btn--ghost"
                    }`}
                  >
                    {a.label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="weave-footer">
        <div className="weave-footer__inner">
          <span className="weave-footer__brand">
            <span className="weave-brand__mark" aria-hidden="true" />
            Loam
          </span>
          <span className="weave-footer__line">{loamFooter.line}</span>
          <span className="weave-footer__sig">{loamFooter.signature}</span>
        </div>
      </footer>
    </div>
  );
}

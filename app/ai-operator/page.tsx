import Image from "next/image";

import { AiIsNotSoftware } from "./ai-is-not-software";
import { Approach } from "./approach";
import { Cases } from "./cases";
import {
  ctaSection,
  footer,
  headlessSection,
  hero,
  meta,
  visionSection,
} from "./content";
import { Diagnosis } from "./diagnosis";
import { HeadlessShift } from "./headless-shift";
import { LoopStripeMorph } from "./loop-stripe-morph";
import { QuoteBridge } from "./quote-bridge";
import { ScrollReveal } from "./reveal";
import { SoftwareForFew } from "./software-for-few";

/*
 * AI Operator — public landing page.
 *
 * v4 narrative arc: an interactive expansion of the CV. The hero is
 * the personal profile (portrait + bio + contact). The page reads as
 * a top-to-bottom argument: who, then how, then proof. Each chapter
 * occupies its own viewport on desktop and unfolds on narrow screens.
 *
 * Composition:
 *   01 Header / nav     (sticky)
 *   02 Hero             — CV profile: name eyebrow + thesis + bio + portrait.
 *   03 Diagnosis        — Four organisational patterns, one missing
 *                         layer. Names the executive-level problem
 *                         (the adoption layer is missing) before the
 *                         Evans bridge articulates the asking gap.
 *                         Static, server-rendered.
 *   04 Quote bridge     — Benedict Evans on the asking gap. Three phrases
 *                         morph in place into Navigate/Encode/Build pills
 *                         (client). Pinned via parallax-reveal pair with
 *                         the Reality-check interstitial below so the
 *                         in-place morph plays out as Reality slides up
 *                         over the frozen bridge.
 *   05 Reality check    — "AI is not normal software." Explains why the
 *                         asking gap is structurally hard: AI interprets
 *                         meaning, traditional adoption teaches tools.
 *                         Slides up over the frozen Evans bridge.
 *   06 Vision           — Centered Navigate/Encode/Build flywheel + one
 *                         CTA. Reads as the answer to the reality check.
 *   07 Approach         — Three motions, each with a Heimdall-style
 *                         "practice in motion" pop-out (client). Pinned
 *                         to viewport bottom so its last viewport stays
 *                         frozen while the next section reveals over it.
 *   08 Software for few — Sage interstitial that slides up over the
 *                         frozen Approach (parallax-reveal pair, client).
 *   09 Cases            — Heimdall-style showcase grid (client). Pinned
 *                         to viewport bottom while Headless-shift rises
 *                         over it (parallax-reveal pair).
 *   10 Headless-shift   — Gold interstitial: Salesforce / Stripe / the
 *                         shift to headless. Slides up over the frozen
 *                         Cases and previews the Pick-a-surface
 *                         vocabulary the overview unpacks below.
 *   11 Headless         — Concise plain-English overview of what
 *                         "headless" means: build the engine once,
 *                         every surface inherits.
 *   12 CTA              — One ask. Smallest commitment.
 *   13 Footer
 */

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

      {/* ─── Diagnosis — Four patterns, one missing layer ───────────
       *
       * Static, server-rendered. Sits between the Hero and the Quote
       * Bridge. Names the executive-level diagnosis (the adoption
       * layer is missing) so the Evans bridge can articulate it as
       * the asking gap, the Reality check can explain why that gap is
       * structurally hard, and the Vision orbit can answer it as
       * Navigate/Encode/Build. No morph, no pin, no parallax — just a
       * clean diagnostic surface the rest of the page resolves. */}
      <Diagnosis />

      {/* ─── Quote bridge + Reality check · parallax-reveal pair ─────
       *
       * The wrapper pins the bridge while the visitor scrolls past it,
       * so the chip-to-pill morph (driven by `--aiop-bridge-progress`
       * inside QuoteBridge) has scroll length to play out. The Reality
       * check sits below in flow and slides up over the frozen bridge
       * through natural scroll, explaining why the asking gap is hard
       * before the Vision flywheel arrives as the answer.
       *
       * Vision lives outside this wrapper so the flywheel reads as a
       * deliberate next chapter rather than the immediate flight target
       * of the bridge morph. The cross-section handoff to the orbit is
       * intentionally dropped on this version of the page. */}
      <div className="aiop-bridge-and-reality">
        <QuoteBridge />
        <AiIsNotSoftware />
      </div>

      {/* ─── Vision — Adoption & Automation Flywheel ──────────────── */}
      <section className="aiop-section aiop-vision" id="vision">
        <div className="aiop-wrap aiop-vision__inner aiop-reveal">
          <div className="aiop-vision__head">
            <h2 className="aiop-section-title aiop-vision__title">
              {visionSection.title} <em>{visionSection.titleEm}</em>
            </h2>

            <p className="aiop-vision__caption">{visionSection.caption}</p>
          </div>

          <div
            className="aiop-orbit aiop-orbit--centered"
            role="img"
            aria-label="Navigate, Encode, Build flywheel around a substrate file stack, with a Headless satellite"
          >
            <span
              className="aiop-orbit__ring aiop-orbit__ring--outer"
              aria-hidden="true"
            />
            <span
              className="aiop-orbit__ring aiop-orbit__ring--inner"
              aria-hidden="true"
            />

            {visionSection.orbits.map((orbit) => (
              <span
                key={orbit.id}
                className={`aiop-orbit__pill aiop-orbit__pill--${orbit.position} aiop-orbit__pill--${orbit.id}`}
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
            <span className="aiop-orbit__satellite" aria-hidden="true">
              <span className="aiop-orbit__satellite-dot" />
              <span className="aiop-orbit__satellite-label">
                {visionSection.satelliteLabel}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── Approach + Software-for-few · parallax-reveal pair ─────
       *
       * The wrapper sticky-pins Approach to viewport bottom so its last
       * viewport stays frozen while SoftwareForFew, sitting below it in
       * flow, slides up over it through natural scroll. */}
      <div className="aiop-approach-and-few">
        <Approach />
        <SoftwareForFew />
      </div>

      {/* ─── Cases + Headless-shift · parallax-reveal pair ──────────
       *
       * The wrapper sticky-pins Cases to viewport bottom so its last
       * viewport stays frozen while HeadlessShift, sitting below it
       * in flow, slides up over it through natural scroll. Mirrors
       * the Approach + SoftwareForFew pair above.
       *
       * Modal portal: case-detail modals mount via createPortal into
       * `document.body` (see `operator-modal.tsx`), so applying a
       * transform to `.aiop-cases` here doesn't clip the modal. */}
      <div className="aiop-cases-and-shift">
        <Cases />
        <HeadlessShift />
      </div>

      {/* ─── Headless overview — what we mean by "headless" ──────── */}
      <section className="aiop-section aiop-headless" id="headless">
        <div className="aiop-wrap">
          <div className="aiop-headless__head aiop-reveal">
            <p className="aiop-eyebrow">{headlessSection.eyebrow}</p>
            <h2 className="aiop-section-title">
              {headlessSection.title}{" "}
              <em>{headlessSection.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{headlessSection.body}</p>
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
                <span className="aiop-headless__substrate-badge">Engine</span>
              </header>
              <ul className="aiop-headless__layers" role="list">
                {headlessSection.layers.map((l) => (
                  <li key={l.tag} className="aiop-headless__layer">
                    <span className="aiop-headless__layer-tag">{l.tag}</span>
                    <span className="aiop-headless__layer-name">{l.name}</span>
                  </li>
                ))}
              </ul>
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

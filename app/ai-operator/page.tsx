import Image from "next/image";

import { AiIsNotSoftware } from "./ai-is-not-software";
import { Approach } from "./approach";
import { Cases } from "./cases";
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
} from "./content";
import { Diagnosis } from "./diagnosis";
import { FlywheelBridge } from "./flywheel-bridge";
import { HeadlessShift } from "./headless-shift";
import { LoopStripeMorph } from "./loop-stripe-morph";
import { QuoteBridge } from "./quote-bridge";
import { ScrollReveal } from "./reveal";
import { SoftwareForFew } from "./software-for-few";
import { StripeLedger } from "./stripe-ledger";
import { StripeReflect } from "./stripe-reflect";
import { StripeVideo } from "./stripe-video";

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
 *   04 Quote bridge     — Benedict Evans on the asking gap. The quote
 *                         and its three lane chips recede on scroll
 *                         while a delayed parenthetical
 *                         "(because AI isn't software)" reveals below
 *                         the attribution (client). Pinned via parallax-
 *                         reveal pair with the Reality-check interstitial
 *                         below so the fade and reveal play out as
 *                         Reality slides up over the frozen bridge.
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
 *   10 Headless-shift   — Violet interstitial: Salesforce / Stripe /
 *                         the shift to headless. Slides up over the
 *                         frozen Cases and primes the substrate-map
 *                         vocabulary unpacked below.
 *   11 Substrate map    — "Three layers, one operating model." Single
 *                         inspectable card (sources -> substrate ->
 *                         surfaces) that absorbs the headless nav
 *                         anchor and replaces the older "Build the
 *                         engine once" overview.
 *   12 Surface pick     — "Pick the surface that fits the workflow."
 *                         Three surface families framing cohort
 *                         scaling instead of developer onboarding.
 *   13 Stripe reflect   — First beat of the closer. Evans-style
 *                         interstitial: cream gradient, lane washes,
 *                         dot grid, a single tranquil self-quote
 *                         that turns the page from "what I've built"
 *                         toward "where does this fit at Stripe?".
 *                         Sets up the video that follows.
 *   14 Stripe video     — Second beat of the closer. The visitor
 *                         watches the Collison clip in a centered
 *                         16:9 frame on a dark backdrop. Audio
 *                         activates on viewport entry, pauses on
 *                         exit. Small mono-caps attribution + one
 *                         italic byline beneath the frame. (client)
 *   15 Stripe ledger    — Third beat of the closer. Two-column
 *                         editorial story about the AI-invoice
 *                         frustration and the Ledger build, paired
 *                         with an inline schematic, a paraphrased
 *                         Stripe-engineer reply card, and a closing
 *                         call-out conclusion card whose italic
 *                         clause echoes the hero's `ledeStrong` so
 *                         the page reads as a closed loop.
 *   16 CTA              — One ask. Smallest commitment.
 *   17 Footer
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
       * so the gentle fade of the quote/chips/attribution and the
       * delayed reveal of the parenthetical note (both driven by
       * `--aiop-bridge-progress` inside QuoteBridge) have scroll
       * length to play out. The Reality check sits below in flow and
       * slides up over the frozen bridge through natural scroll,
       * explaining why the asking gap is hard before the Vision
       * flywheel arrives as the answer.
       *
       * Vision lives outside this wrapper so the flywheel reads as a
       * deliberate next chapter rather than the immediate flight target
       * of the bridge. The cross-section handoff to the orbit (and the
       * earlier chip-to-pill morph) are intentionally dropped on this
       * version of the page. */}
      <div className="aiop-bridge-and-reality">
        <QuoteBridge />
        <AiIsNotSoftware />
      </div>

      {/* ─── Vision — Adoption & Automation Flywheel ──────────────── */}
      <section className="aiop-section aiop-vision" id="vision">
        <div className="aiop-wrap aiop-vision__inner aiop-reveal">
          <div className="aiop-vision__head">
            <h2 className="aiop-section-title aiop-vision__title">
              {visionSection.title} <em>{visionSection.titleEm}</em>{" "}
              {visionSection.titleAfter}
            </h2>

            <p className="aiop-vision__caption">{visionSection.caption}</p>
          </div>

          {/* Nested orbit: Navigate / Encode / Build phase pills sit on
              their own concentric rings around the substrate at the
              centre. Headless renders as a satellite outside the
              outer ring — it's the separate idea that exposes the
              substrate to every surface, not part of the flywheel
              itself. Per-phase pill positions live in CSS so the
              phase id alone drives the location. */}
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

        {/* News-show-style ticker at the bottom of the Vision section.
            External validation that the flywheel above is now an
            industry-recognized pattern: WSJ on the FDE category,
            Stripe's Forward Deployed AI Accelerator role posting,
            Bloomberg + WSJ on OpenAI and Anthropic's PE deployment
            ventures. Headlines stay close to the actual article copy
            so this strip reads as social proof, not embellishment.
            The track is duplicated so the marquee can loop seamlessly
            via a -50% translateX in CSS. */}
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

      {/* ─── Flywheel bridge ─────────────────────────────────────────
       *
       * Single calm interstitial between the Vision orbit (the model)
       * and the Approach deep dive (the method). One personal quote
       * on a soft gradient — same visual register as the Evans bridge
       * but without the parallax choreography. Lifts the "18 months
       * at Loop" autobiographical anchor up so Build can stay
       * method-focused below. */}
      <FlywheelBridge />

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

      {/* ─── Substrate map — sources, substrate, surfaces as one ────
       *
       * First tail section after the headless overview. Single
       * inspectable map card: sources on the left, encoded substrate
       * in the middle, headless surfaces on the right, with two
       * narrow connector cells naming the read/expose direction. The
       * footer strip names the three-state transition in the same
       * mono caps grammar as the rest of the route.
       *
       * Header mirrors `aiop-diagnosis__head` (title-left + lede-right)
       * so the tail of the page reads as one rhythm. */}
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

      {/* ─── Surface pick — same engine, surface fits the marketer ──
       *
       * Second tail section. Three "surface families" (Power / Team /
       * System) instead of three install paths so the section reads
       * as a cohort scaling story: the substrate underneath every
       * tool stays the same, but the surface a marketer reaches it
       * through adapts to where they already work. */}
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

            {/* Two-column layout: three install paths (MCP / API / CLI)
                on the left as the actual ways to talk to the engine,
                with the destinations grid on the right. Mirrors the
                Mimir headless onboarding card so the architecture
                reads honestly — Cursor and Claude both ride MCP, an
                internal tool rides the REST API, a cron job rides the
                CLI; the surfaces panel just names where the engine
                shows up regardless of which transport called it. */}
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
                  className="aiop-surface-pick__destinations-grid"
                  role="list"
                >
                  {surfacePickSection.surfaces.map((s) => (
                    <li
                      key={s.name}
                      className="aiop-surface-pick__destination"
                    >
                      <span
                        className="aiop-surface-pick__destination-icon"
                        aria-hidden="true"
                      >
                        {s.icon}
                      </span>
                      <span className="aiop-surface-pick__destination-name">
                        {s.name}
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

      {/* ─── Closer — three deliberate beats before the CTA ──────────
       *
       * The single resting beat became three sections so the closer
       * breathes. The visitor moves through:
       *
       *   - Stripe reflect: a tranquil Evans-style interstitial that
       *     turns the page from architecture toward personal frame
       *     ("where does this fit at Stripe?"). Pure server.
       *   - Stripe video: a dedicated section where the Collison
       *     clip plays as the centerpiece, with audio activating on
       *     viewport entry and a small mono-caps attribution + one
       *     italic byline beneath. (client — owns the IO + mute pill)
       *   - Stripe ledger: an editorial deep-dive on the AI-invoice
       *     frustration and the Ledger build, with an inline
       *     schematic, a paraphrased engineer-reply card, and a
       *     closing call-out conclusion card carrying the hero
       *     tie-back. Pure server. */}
      <StripeReflect />
      <StripeVideo />
      <StripeLedger />

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

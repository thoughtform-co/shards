import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import { SkillsByTeam } from "@/components/claude-adoption/skills-by-team";
import { VisionFlywheel } from "@/components/claude-adoption/vision-flywheel";
import { WorkshopApproach } from "@/components/claude-adoption/workshop-approach";
import { DiagnosisWithRoleFilter } from "@/components/intelligence-layer/diagnosis-with-role-filter";
import { RoleProvider } from "@/components/intelligence-layer/role-context";
import { SubstrateMap } from "@/components/intelligence-layer/substrate-map";
import { Cases } from "@/components/operator/cases";
import { FlywheelOrbit } from "@/components/operator/flywheel-orbit";
import { HeadlessShift } from "@/components/operator/headless-shift";
import { QuestionInterstitial } from "@/components/operator/question-interstitial";
import { ScrollReveal as OperatorScrollReveal } from "@/components/operator/reveal";
import { Signal } from "@/components/operator/signal";
import { SoftwareForFew } from "@/components/operator/software-for-few";
import { ScrollReveal as SharedScrollReveal } from "@/components/shared/reveal";
import { SiteFooter } from "@/components/shared/site-footer";
import { pageHero } from "@/content/intelligence-layer";
import { softwareForFewSection } from "@/content/operator";

import "@/components/landing/landing.css";
import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "@/components/claude-adoption/claude-adoption.css";
import "./ai-adoption.css";

/*
 * /ai-adoption — the Loop rollout, told end to end.
 *
 * Recomposes two Aether pages into one argument. The top half is the
 * canonical Aether homepage (`15_Aether/app/page.tsx`): the layer as
 * an idea, the diagnosis, the architecture, and the outside
 * validation that the frontier labs are buying the same thing. The
 * bottom half is the Aether `/loop-ai-adoption` operating record:
 * how the program actually runs, team by team.
 *
 * The hinge between them is the interstitial at 05. Everything above
 * it argues the layer should exist; everything below it shows it
 * running. That pivot is the page.
 *
 * Reading order:
 *
 *   01 Hero            — the layer, named on arrival. FlywheelOrbit
 *                        (compact, bloom) as the right column.
 *   02 Diagnosis       — role-filtered pain cards. "We have the
 *                        know-how, but it isn't compounding yet."
 *   03 Substrate map   — Trusted sources → Encoded substrate →
 *                        Headless surfaces. #substrate-map.
 *   04 Signal          — Palantir / Stripe / OpenAI / Anthropic.
 *                        The labs just bet billions on this layer.
 *
 *   ── 05 Interstitial ── "This is how we've been running it at
 *                        Loop Earplugs." Same `.aiop-question-bridge`
 *                        chrome as the homepage's "But how do you
 *                        actually get here?" beat, so the two pages
 *                        share a chapter-break grammar.
 *
 *   06+07 Approach + Flywheel · parallax pair. The operator machine
 *                        (same kickoff → one record → patterns become
 *                        tools) freezes while the per-team Navigate /
 *                        Encode / Build loop rises over its tail. The
 *                        `.ca-approach-and-vision` wrapper is the JS
 *                        hook `vision-flywheel.tsx` reads; below 960px
 *                        or under reduced-motion it degrades to a
 *                        normal stack.
 *   08 Skills by team  — 42 Skills, the substrate encoded to date.
 *   09 Software for few — why the team builds its own tools, and what
 *                        the Skills above are the substrate for.
 *
 *   10+11 Cases + HeadlessShift · parallax pair. The FULL production
 *                        case rows (Mímir / Vesper / Babylon /
 *                        Heimdall) from the Aether homepage, not the
 *                        two-tool summary `/loop-ai-adoption` shipped.
 *                        `.aiop-cases-and-shift` is the JS hook
 *                        `headless-shift.tsx` reads.
 *   12 Close           — portfolio CTA.
 *
 * Palette note: the claude-adoption components arrive here on the
 * violet operator chassis rather than their native Claude-Clay one.
 * The `.aiop-ai-adoption` shell class (see `ai-adoption.css`) supplies
 * the two token families those components expect but that
 * `claude-adoption.css` only declares inside `.aiop-claude-adoption`.
 */

const aiopDisplay = Bodoni_Moda({
  variable: "--aiop-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const aiopBody = IBM_Plex_Sans({
  variable: "--aiop-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const aiopMono = IBM_Plex_Mono({
  variable: "--aiop-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Adoption · Thoughtform",
  description:
    "How an intelligence layer gets built inside a real company. The architecture, the outside validation, and the operating record from the Claude rollout at Loop Earplugs — 22 teams, 42 Skills, and the tools that came out of them.",
  robots: { index: false, follow: false },
};

/* ─── Route-local copy ─────────────────────────────────────────────
 *
 * Lives here so this page can diverge from both source pages without
 * touching the shared content modules. Sections 02 / 03 / 04 / 06 /
 * 07 / 08 / 10 / 11 all render their canonical copy — the argument
 * they make is already the argument this page wants. Only the chrome
 * (header, hinge, close, footer) is authored locally.
 */

/* Hero.
 *
 * Copy is the homepage's `pageHero`, verbatim — the title and lede
 * name the layer better than anything written for this fork would.
 * Only the second CTA is re-pointed: the homepage sends "See the
 * receipts" to its `#engine-pattern` carousel, which this page doesn't
 * mount. Here the receipts ARE the operating record, so the button
 * lands on `#approach`. */
const heroActions = [
  {
    id: "see-layer",
    label: "See the layer",
    href: "#substrate-map",
    primary: true,
  },
  { id: "receipts", label: "See the receipts", href: "#approach" },
] as const;

const pageMeta = {
  brandLeft: "Thoughtform",
  brandSub: "AI Adoption",
  status: "Method · Proof from Loop Earplugs",
  links: [
    { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
    { id: "substrate-map", label: "The layer", href: "#substrate-map" },
    { id: "approach", label: "The record", href: "#approach" },
    { id: "skills", label: "Skills", href: "#skills" },
    { id: "cases", label: "Tools", href: "#cases" },
    { id: "contact", label: "Contact", href: "#contact" },
  ],
} as const;

/* The hinge.
 *
 * Reuses the homepage's `QuestionInterstitial` chrome — atmospheric
 * bleed, italic display centrepiece — but the line is a statement,
 * not a question. Everything above it has argued that the layer
 * should exist and that the labs agree. This is where the page stops
 * arguing and starts showing. The subline is the receipt: both
 * numbers are the ones the sections below go on to substantiate
 * (22 workshops in Approach, 42 Skills in SkillsByTeam).
 *
 * `scrollNote` is suppressed and no `.aiop-question-and-vision`
 * wrapper is used, so the section reads as a static editorial slab
 * rather than a freeze-and-rise pair. */
const loopHinge = {
  id: "loop-record",
  ariaLabel:
    "An interlude that opens the Loop Earplugs operating record below",
  eyebrow: "",
  question: "This is how we’ve been running it at Loop Earplugs.",
  subline: "Twenty-two teams. Forty-two Skills. One layer.",
  scrollNote: "",
} as const;

/* SoftwareForFew action override.
 *
 * The canonical section points "Headless vision" at `#substrate-map`,
 * which on the homepage sits below it. Here the substrate map is the
 * page's third section and the headless argument is its eleventh, so
 * the link is re-pointed forward at `#headless-shift` — otherwise the
 * CTA scrolls the visitor backwards past six sections. */
const pageSoftwareForFew = {
  ...softwareForFewSection,
  actions: [
    { id: "cases", label: "Explore the tools", href: "#cases" },
    { id: "headless", label: "Headless vision", href: "#headless-shift" },
  ],
} as const;

const closeSection = {
  title: "Want the same layer",
  titleEm: "inside your company?",
  body: "The pattern above isn’t Loop-specific. Wherever a team’s know-how is stuck in heads and slide decks, the work has the same shape: navigate one real workflow, encode what worked, then build on top of it. The first encode usually takes a single workshop.",
  actions: [
    {
      id: "contact",
      label: "Start a conversation",
      href: "mailto:vince@thoughtform.co?subject=AI%20Adoption%20·%20intro",
      primary: true,
    },
    {
      id: "more-work",
      label: "See more work",
      href: "/ai-operator",
    },
  ],
} as const;

const pageFooter = {
  line: "Thoughtform · AI Adoption · The intelligence layer, built inside the work.",
  signature: "Built and maintained by Vince Buyssens.",
} as const;

export default function AiAdoptionPage() {
  return (
    <div
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-stage aiop-ai-adoption`}
    >
      <OperatorScrollReveal />
      <SharedScrollReveal />

      {/* ─── Sticky header ──────────────────────────────────────────── */}
      <header className="aiop-header">
        <div className="aiop-wrap aiop-header__inner">
          <Link className="aiop-brand" href="/">
            <span className="aiop-brand__mark">
              <span className="aiop-brand__diamond" aria-hidden="true" />
              <span className="aiop-brand__name">{pageMeta.brandLeft}</span>
            </span>
            <span className="aiop-brand__sub">{pageMeta.brandSub}</span>
          </Link>

          <nav className="aiop-nav" aria-label="Sections">
            {pageMeta.links.map((link) => (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <span className="aiop-header__status" aria-label={pageMeta.status}>
            <span className="aiop-header__status-dot" aria-hidden="true" />
            <span>{pageMeta.status}</span>
          </span>
        </div>
      </header>

      <main>
        {/* ─── 01 · Hero ─────────────────────────────────────────────
            Verbatim from the Aether homepage: two-column, copy left,
            frame-less compact FlywheelOrbit right. */}
        <section className="aiop-hero aiop-hero--minimal" id="top">
          <div className="aiop-grid-bg" aria-hidden="true" />
          <div className="aiop-wrap aiop-hero__inner aiop-hero__inner--minimal">
            <div className="aiop-hero__copy aiop-reveal">
              <h1 className="aiop-hero__title aiop-hero__title--minimal">
                {pageHero.titleLines.map((line, idx) => (
                  <span key={idx} className="aiop-hero__title-line">
                    {typeof line === "string" ? line : <em>{line.em}</em>}
                  </span>
                ))}
              </h1>
              <div className="aiop-hero__lede aiop-hero__lede--minimal">
                {pageHero.lede.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="aiop-hero__actions">
                {heroActions.map((action) => (
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
              <FlywheelOrbit variant="compact" bloom />
            </div>
          </div>
        </section>

        {/* RoleProvider reads `?role=` via useSearchParams, which Next
            requires inside a Suspense boundary during static export.
            Only Diagnosis consumes the role today, but the provider
            wraps the whole run so a later role-aware section doesn't
            need a second, drifting provider. */}
        <Suspense fallback={null}>
          <RoleProvider>
            {/* ─── 02 · Diagnosis ─────────────────────────────────── */}
            <DiagnosisWithRoleFilter />

            {/* ─── 03 · The layer ─────────────────────────────────── */}
            <SubstrateMap />

            {/* ─── 04 · Signal ────────────────────────────────────── */}
            <Signal />

            {/* ─── 05 · The hinge ─────────────────────────────────── */}
            <QuestionInterstitial section={loopHinge} />

            {/* ─── 06 + 07 · Approach + Flywheel · parallax pair ──── */}
            <div className="ca-approach-and-vision">
              <WorkshopApproach />
              <VisionFlywheel />
            </div>

            {/* ─── 08 · Skills, by team ───────────────────────────── */}
            <SkillsByTeam />

            {/* ─── 09 · Software for few ──────────────────────────── */}
            <SoftwareForFew section={pageSoftwareForFew} />

            {/* ─── 10 + 11 · Cases + HeadlessShift · parallax pair ─── */}
            <div className="aiop-cases-and-shift">
              <Cases />
              <HeadlessShift />
            </div>
          </RoleProvider>
        </Suspense>

        {/* ─── 12 · Close — portfolio CTA ─────────────────────────── */}
        <section
          className="aiop-section aiop-section--tight ail-close"
          id="contact"
        >
          <div className="aiop-wrap">
            <header className="aiop-section-head ail-close__head aiop-reveal">
              <h2 className="aiop-section-title ail-close__title">
                {closeSection.title} <em>{closeSection.titleEm}</em>
              </h2>
              <p className="aiop-section-head__sub ail-close__body">
                {closeSection.body}
              </p>
            </header>

            <div className="ail-close__actions aiop-reveal">
              {closeSection.actions.map((action) => (
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
        </section>
      </main>

      <SiteFooter
        brand={pageMeta.brandLeft}
        line={pageFooter.line}
        signature={pageFooter.signature}
      />
    </div>
  );
}

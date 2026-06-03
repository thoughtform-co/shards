import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import { Numbers } from "@/components/claude-adoption/numbers";
import { SkillsByTeam } from "@/components/claude-adoption/skills-by-team";
import { VisionFlywheel } from "@/components/claude-adoption/vision-flywheel";
import { WorkshopApproach } from "@/components/claude-adoption/workshop-approach";
import { DiagnosisWithRoleFilter } from "@/components/intelligence-layer/diagnosis-with-role-filter";
import { LayerDeepDive } from "@/components/intelligence-layer/layer-deep-dive";
import { RoleProvider } from "@/components/intelligence-layer/role-context";
import { SubstrateMapV3 } from "@/components/intelligence-layer-v3/substrate-map-v3";
import { FlywheelOrbit } from "@/components/operator/flywheel-orbit";
import { ScrollReveal as OperatorScrollReveal } from "@/components/operator/reveal";
import { ScrollReveal as SharedScrollReveal } from "@/components/shared/reveal";
import { SiteFooter } from "@/components/shared/site-footer";

import "@/components/landing/landing.css";
import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "@/components/claude-workshop/claude-workshop.css";
import "@/components/claude-adoption/claude-adoption.css";

/*
 * /intelligence-layer — Shards standalone fork.
 *
 * Composes the best of two Aether pages into one client-facing
 * portfolio page:
 *
 *   - Opens with the v3 intelligence-layer arc (hero ->
 *     "We have the know-how but it isn't compounding yet" diagnosis
 *     -> the three-column layer diagram).
 *   - The layer chapter foregrounds the qualitative (encoded tacit
 *     knowledge, judgment, voice as portable Skills) and frames the
 *     quantitative half (knowledge graph + ontology) as the partner
 *     lane. The page does not compete with knowledge-graph
 *     engineering. The qualitative encoding of ever-evolving tacit
 *     knowledge is what this page argues for.
 *   - The deep mechanics (Degrees of Freedom + Skill anatomy) sit
 *     one click away in modals via <LayerDeepDive>. The rest of the
 *     homepage's encode deep-dive (TheShift / Cases / HeadlessShift
 *     / SurfacePick) is dropped on this fork to keep the page lean.
 *   - Then segues into the Claude-adoption proof sequence
 *     (Numbers -> Approach -> Flywheel -> Skills) with Loop named
 *     openly as the featured case study.
 *   - Closes on a portfolio CTA (not the Loop-internal exec ask).
 *
 * No edits to the canonical homepage (`app/page.tsx`) or the
 * existing `claude-workshop-v1` fork. This route owns its own
 * copy via the route-local constants below.
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
  title: "Intelligence Layer \u00b7 Thoughtform",
  description:
    "The intelligence layer pattern: encoding how a team actually decides as portable Skills any AI can call. Method, proof from Loop Earplugs, and the Skills already in production.",
  robots: { index: false, follow: false },
};

/* ─── Route-local copy ─────────────────────────────────────────────
 *
 * Lives here on purpose so this fork can diverge from the canonical
 * homepage and the Aether v3 deck without touching shared content
 * modules. Everything below is portfolio-facing rather than
 * Loop-internal.
 */

const pageMeta = {
  brandLeft: "Thoughtform",
  brandSub: "Intelligence Layer",
  status: "Method \u00b7 Proof from Loop Earplugs",
  links: [
    { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
    { id: "layer", label: "The layer", href: "#layer" },
    { id: "numbers", label: "Numbers", href: "#numbers" },
    { id: "approach", label: "Approach", href: "#approach" },
    { id: "skills", label: "Skills", href: "#skills" },
    { id: "contact", label: "Contact", href: "#contact" },
  ],
} as const;

/* Hero — standalone portfolio framing. Same `aiop-hero--minimal`
 * composition the existing forks use, but the lede reads to any
 * team rather than to Loop's leadership. CTAs jump to the proof
 * (numbers + skills) instead of Loop-internal anchors. */
const pageHero = {
  titleLines: [
    "The intelligence layer",
    { em: "your team already has." },
  ] as const,
  lede: [
    "Every team has a way of working. The judgment, the voice, the small rules that make the output land. Today that lives in heads, so every new tool, hire, or model has to learn it from scratch. The intelligence layer is what you build when you encode it once and let any AI call into it.",
  ] as const,
  actions: [
    { id: "see-layer", label: "See the layer", href: "#layer", primary: true },
    { id: "see-proof", label: "See the proof", href: "#numbers" },
  ] as const,
} as const;

const pageDiagnosisHead = {
  title: "We have the know-how,",
  titleEm: "but it isn\u2019t compounding yet.",
  sub: "The know-how lives in heads, and the system can\u2019t see it. So every new tool, hire, or model has to learn the work from scratch. Pick a function below to see where it stalls.",
} as const;

/* SubstrateMapV3 lede override.
 *
 * Reframes the layer for a portfolio reader. Names the qualitative
 * encoding (how each team decides, captured as portable Skills) as
 * the contribution this page is arguing for, and positions the
 * knowledge graph and ontology as the complementary partner lane.
 * Knowledge graphs predate this work and don't need it; what this
 * pattern adds is the ever-evolving tacit-knowledge side that no
 * graph alone captures. */
const layerLedeOverride =
  "Two halves of one layer. A knowledge graph names the entities and makes the data queryable \u2014 a well-understood pattern with its own specialists. The newer half is the encoded substrate: how each team actually decides, written down as portable Skills any AI can call. Tacit knowledge becomes shared infrastructure instead of staying in someone\u2019s head.";

const layerTitleOverride = "What\u2019s missing is the";
const layerTitleEmOverride = "qualitative half.";

/* Skills section preface. Frames the Loop work as a portfolio case
 * study and names what the reader is about to see: real shipped and
 * in-build Skills inside a consumer brand, organised by team. */
const skillsPortfolioIntro = {
  eyebrow: "Case study \u00b7 Loop Earplugs",
  title: "What the pattern looks like",
  titleEm: "in a real company.",
  body: "Below is the live Skills inventory at Loop Earplugs, encoded since the rollout started. Twenty-two workshops, forty-two Skills across the company. Each card captures how one team handles one specific piece of work \u2014 so both the team and the agents we build on top can re-use it. Click a Skill to see the team it lives in.",
} as const;

const closeSection = {
  title: "Want the same layer",
  titleEm: "inside your company?",
  body: "If your team's know-how is still stuck in heads and slide decks, the work is the same shape it was at Loop. The pattern is portable. The first encode usually takes a single workshop.",
  actions: [
    {
      id: "contact",
      label: "Start a conversation",
      href: "mailto:vince@thoughtform.co?subject=Intelligence%20Layer%20\u00b7%20intro",
      primary: true,
    },
    {
      id: "more-work",
      label: "See more work",
      href: "/ai-operator",
    },
  ] as const,
} as const;

const pageFooter = {
  line: "Thoughtform \u00b7 Intelligence Layer \u00b7 A standing portfolio page.",
  signature: "Built and maintained by Vince Buyssens.",
} as const;

export default function IntelligenceLayerPage() {
  return (
    <div
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-stage aiop-intelligence-layer`}
    >
      <OperatorScrollReveal />
      <SharedScrollReveal />

      {/* ─── Sticky header ──────────────────────────────────────── */}
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
        {/* ─── 01 · Hero — standalone portfolio framing ──────────── */}
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
                {pageHero.actions.map((action) => (
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
                      →
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

        {/* ─── 02 · Diagnosis — role-aware. Wrapped in Suspense so the
            RoleProvider's useSearchParams hydrates cleanly. */}
        <Suspense fallback={null}>
          <RoleProvider>
            <DiagnosisWithRoleFilter head={pageDiagnosisHead} />

            {/* ─── 03 · The layer — qualitative-forward overrides.
                Renames "What's missing is an intelligence layer" to
                "What's missing is the qualitative half" so the page
                immediately positions the contribution. The lede +
                closing copy come from `v3LayerSection` defaults. */}
            <SubstrateMapV3
              titleOverride={layerTitleOverride}
              titleEmOverride={layerTitleEmOverride}
              ledeOverride={layerLedeOverride}
            />

            {/* ─── 03b · Layer deep-dive triggers (modals). Two
                "Learn more" pop-ups: freedom bands + Skill anatomy.
                Keeps the page lean while leaving the depth one
                click away. */}
            <LayerDeepDive />

            {/* ─── 04 · Numbers — Loop adoption as proof. Real
                stats kept by request: workshops run, Skills
                encoded, tools built, sparkline of weekly active
                Claude users. */}
            <Numbers />

            {/* ─── 05 + 06 · Approach + Flywheel parallax pair.
                Same wrapper class the Aether claude-adoption page
                uses so `vision-flywheel.tsx`'s parallax JS
                recognises it and the Flywheel rises over the tail
                of Approach. Degrades to a normal stack below
                960px or under prefers-reduced-motion. */}
            <div className="ca-approach-and-vision">
              <WorkshopApproach />
              <VisionFlywheel />
            </div>

            {/* ─── 07 · Skills, by team — Loop portfolio.
                Preface section frames Loop openly as the featured
                case study, then the existing SkillsByTeam
                component renders the full inventory underneath. */}
            <section
              className="aiop-section aiop-section--tight"
              aria-label="Loop Earplugs as a portfolio case study"
            >
              <div className="aiop-wrap">
                <header className="aiop-section-head aiop-reveal">
                  <p className="aiop-eyebrow">
                    <span className="aiop-slash" aria-hidden="true" />
                    {skillsPortfolioIntro.eyebrow}
                  </p>
                  <h2 className="aiop-section-title">
                    {skillsPortfolioIntro.title}{" "}
                    <em>{skillsPortfolioIntro.titleEm}</em>
                  </h2>
                  <p className="aiop-section-head__sub">
                    {skillsPortfolioIntro.body}
                  </p>
                </header>
              </div>
            </section>

            <SkillsByTeam />
          </RoleProvider>
        </Suspense>

        {/* ─── 08 · Close — portfolio CTA. Replaces the v3 exec ask
            (Loop-internal three moves) with a contact + more-work
            pair. */}
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
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter line={pageFooter.line} signature={pageFooter.signature} />
    </div>
  );
}

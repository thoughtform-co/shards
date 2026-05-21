import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import { ClaudeBridge } from "@/components/claude-workshop/claude-bridge";
import { ClaudeConnectors } from "@/components/claude-workshop/claude-connectors";
import { ClaudeModels } from "@/components/claude-workshop/claude-models";
import { ClaudeSettings } from "@/components/claude-workshop/claude-settings";
import { ClaudeSkillAnatomy } from "@/components/claude-workshop/claude-skill-anatomy";
import { ClaudeSkillsAtLoop } from "@/components/claude-workshop/claude-skills-at-loop";
import { CloseAiop } from "@/components/intelligence-layer/close-aiop";
import { DegreesOfFreedom } from "@/components/intelligence-layer/degrees-of-freedom";
import { DiagnosisWithRoleFilter } from "@/components/intelligence-layer/diagnosis-with-role-filter";
import { RoleProvider } from "@/components/intelligence-layer/role-context";
import { SubstrateMap } from "@/components/intelligence-layer/substrate-map";
import { TheShift } from "@/components/intelligence-layer/the-shift";
import { UseCasesProvider } from "@/components/intelligence-layer/use-cases-context";
import { Approach } from "@/components/operator/approach";
import { Cases } from "@/components/operator/cases";
import { EncodingInterstitial } from "@/components/operator/encoding-interstitial";
import { EnginePattern } from "@/components/operator/engine-pattern";
import { EvansBridge } from "@/components/operator/evans-bridge";
import { FlywheelOrbit } from "@/components/operator/flywheel-orbit";
import { HeadlessShift } from "@/components/operator/headless-shift";
import { QuestionInterstitial } from "@/components/operator/question-interstitial";
import { Signal } from "@/components/operator/signal";
import { SoftwareForFew } from "@/components/operator/software-for-few";
import { SurfacePick } from "@/components/operator/surface-pick";
import { ToolCollabSpectrum } from "@/components/operator/tool-collab-spectrum";
/*
 * Same dual-reveal setup as `/` — see app/page.tsx for the long
 * explanation. Short version: the new homepage-chrome top targets
 * `.aiop-stage .aiop-reveal` while the parked legacy je-* sections
 * use `.reveal`, so both reveal components mount in parallel.
 */
import { ScrollReveal as OperatorScrollReveal } from "@/components/operator/reveal";
import { ScrollReveal as SharedScrollReveal } from "@/components/shared/reveal";
import { SiteFooter } from "@/components/shared/site-footer";
import {
  pageEnginePatternHeader,
  pageMeta,
} from "@/content/intelligence-layer";
import { type EnginePatternSkillCard } from "@/content/operator";
import { skillsDeckSection } from "@/content/skills-deck";
import "@/components/landing/landing.css";
import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "@/components/claude-workshop/claude-workshop.css";

/*
 * /claude-workshop-v1 — Claude Workshop v1 fork of `/`.
 *
 * Same shell, same fonts, same role/use-case providers as the
 * canonical homepage. Diverges in three places:
 *
 *   1. `CsIdeationEngine` (the live composer at id="engine") is
 *      removed. The Skills carousel above it stays, but its
 *      "And this is the engine" footer CTA is dropped because the
 *      anchor no longer exists.
 *
 *   2. `Approach` runs with `showOutcome={false}` and is taken
 *      out of the `.aiop-approach-and-encoding` parallax wrapper.
 *      Between Approach and the EncodingInterstitial we wedge a
 *      four-section Anthropic-styled chapter: the "Let's get
 *      Claudin'" interlude plus three getting-started panes
 *      (Settings, Models & Tokens, Connectors). The whole chapter
 *      sits inside `.aiop-claude-zone` so the scoped Anthropic
 *      palette in `claude-workshop.css` lights up Ivory/Slate/Clay
 *      without leaking onto the rest of the page.
 *
 *   3. The encode deep-dive that follows folds two new Skills
 *      sections in. `ClaudeSkillAnatomy` lands right after
 *      EncodingInterstitial and before TheShift; `ClaudeSkillsAtLoop`
 *      lands between DegreesOfFreedom and SoftwareForFew. Both
 *      sections sit OUTSIDE the Anthropic zone so the deep-dive
 *      reads on the surrounding Aether palette with only a single
 *      Clay-tinted badge signalling Claude origin.
 *
 * The nav strip is filtered to drop the `engine` anchor (since the
 * live composer is removed). Every other link in `pageMeta.links`
 * survives unchanged.
 */

/* Route-local framing copy. The canonical homepage at `/` keeps
 * its "inside Loop" wording because that page IS Loop's intelligence
 * layer landing page. The workshop fork generalises the framing so
 * a non-Loop reader can land on "what a Claude getting-started
 * chapter looks like, sitting on top of an intelligence layer" and
 * still recognise themselves in it. The Loop-specific receipts
 * (Skills carousel, encode deep-dive, Cases, "Skills at Loop")
 * stay verbatim further down the page — they're the proof that
 * the pattern lands. */

const workshopHero = {
  titleLines: [
    "The intelligence layer for AI",
    { em: "inside the work." },
  ] as const,
  lede: [
    "Every team\u2019s way of working, encoded into a layer any AI can use. Built inside the work, owned by the team, survives any model change.",
  ] as const,
  actions: [
    {
      id: "see-layer",
      label: "See the layer",
      href: "#substrate-map",
      primary: true,
    },
    { id: "receipts", label: "See the receipts", href: "#engine-pattern" },
  ] as const,
};

const workshopBrandSub = "Claude Workshop \u00b7 v1";

const workshopDiagnosisHead = {
  title: "We have the know-how,",
  titleEm: "but it isn\u2019t compounding yet.",
  sub: "The know-how lives in heads, and the system can\u2019t see it. So every new tool, hire, or model has to learn the work from scratch. Pick a function below to see where it stalls.",
};

const workshopApproach = {
  title: "The AI flywheel",
  titleEm: "running inside the work.",
  caption:
    "Three motions, one team at a time. Navigate, encode, build, compounding into the substrate every surface inherits.",
};

const workshopFooter = {
  line: "Aether \u00b7 Claude Workshop \u00b7 A getting-started chapter for teams.",
  signature: "Scoped by Vince \u00b7 2026.",
};

/* Skill carousel cards — flattened from the same skills deck the
 * canonical homepage uses, so this fork shows the same 15 receipts
 * across the same 5 teams. Source of truth stays in
 * `content/skills-deck.ts`. */
const skillCarouselCards: readonly EnginePatternSkillCard[] =
  skillsDeckSection.slides.flatMap((slide) => {
    const teamFull = slide.teamEm ? `${slide.team} ${slide.teamEm}` : slide.team;
    return slide.cards.map(
      (card): EnginePatternSkillCard => ({
        kind: "skill",
        id: card.id,
        team: teamFull,
        title: card.title,
        body: card.body,
        owners: card.owners,
        receipt: card.statusLabel,
        receiptTone: card.receiptTone,
        link: card.link,
      }),
    );
  });

/* Nav-strip filter: the canonical `pageMeta.links` carries an
 * "engine" entry that anchors to the live composer (id="engine").
 * This fork removes the composer, so the nav link would 404 on
 * click. Filter it out here without mutating the shared content. */
const claudeWorkshopNavLinks = pageMeta.links.filter(
  (link) => link.id !== "engine",
);

/* Route-local typography — identical to `/` so the Aether shell
 * resolves to the same Bodoni Moda / IBM Plex Sans / IBM Plex Mono
 * fonts on this fork as on the canonical homepage. */
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
  title: "Aether \u00b7 Claude Workshop v1",
  description:
    "Claude Workshop v1 \u2014 a getting-started chapter for Claude paired with a tour of the intelligence layer that sits underneath. Settings, models, connectors, and how Skills encode the way a team works.",
  robots: { index: false, follow: false },
};

export default function ClaudeWorkshopV1Page() {
  return (
    <div
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-stage aiop-workshop-v1`}
    >
      <OperatorScrollReveal />
      <SharedScrollReveal />

      <header className="aiop-header">
        <div className="aiop-wrap aiop-header__inner">
          <Link className="aiop-brand" href="/">
            <span className="aiop-brand__mark">
              <span className="aiop-brand__diamond" aria-hidden="true" />
              <span className="aiop-brand__name">{pageMeta.brandLeft}</span>
            </span>
            <span className="aiop-brand__sub">{workshopBrandSub}</span>
          </Link>

          <nav className="aiop-nav" aria-label="Sections">
            {claudeWorkshopNavLinks.map((link) => (
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
        {/* ─── Hero — identical to `/` so the workshop fork lands on the
            same opening composition the team already recognises. */}
        <section className="aiop-hero aiop-hero--minimal" id="top">
          <div className="aiop-grid-bg" aria-hidden="true" />
          <div className="aiop-wrap aiop-hero__inner aiop-hero__inner--minimal">
            <div className="aiop-hero__copy aiop-reveal">
              <h1 className="aiop-hero__title aiop-hero__title--minimal">
                {workshopHero.titleLines.map((line, idx) => (
                  <span key={idx} className="aiop-hero__title-line">
                    {typeof line === "string" ? line : <em>{line.em}</em>}
                  </span>
                ))}
              </h1>
              <div className="aiop-hero__lede aiop-hero__lede--minimal">
                {workshopHero.lede.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="aiop-hero__actions">
                {workshopHero.actions.map((action) => (
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

        <Suspense fallback={null}>
          <RoleProvider>
            <DiagnosisWithRoleFilter head={workshopDiagnosisHead} />
            <SubstrateMap />

            <Signal />

            {/* ─── Skill carousel only — the live composer
                (CsIdeationEngine) is intentionally removed in this
                fork. The carousel keeps its `flywheel` CTA but drops
                the "And this is the engine" button that pointed at
                the removed #engine anchor. Rendered standalone (no
                `.aiop-engine-and-ideate` wrapper) so the carousel
                degrades to a normal section instead of expecting a
                parallax sibling beneath it. */}
            <EnginePattern
              section={{
                ...pageEnginePatternHeader,
                cards: skillCarouselCards,
              }}
              cardsPerView={3}
              footerActions={[
                {
                  id: "flywheel",
                  label: "The program running it",
                  href: "#vision",
                  ariaLabel: "Continue to the program running the layer",
                },
              ]}
            />

            {/* ─── Adoption chapter — same four-slide editorial
                sequence as `/`. */}
            <QuestionInterstitial />

            <div className="aiop-evans-and-tool-collab">
              <EvansBridge />
              <ToolCollabSpectrum />
            </div>

            <section className="aiop-section aiop-vision" id="vision">
              <div className="aiop-wrap aiop-vision__inner aiop-reveal">
                <header className="aiop-section-head aiop-vision__head">
                  <h2 className="aiop-section-title aiop-vision__title">
                    Good automation starts with{" "}
                    <em>the right adoption</em>.
                  </h2>
                  <p className="aiop-section-head__sub aiop-vision__caption">
                    Navigate first. Then encode what works into something
                    both the team and the agents you build can reuse. Tacit
                    knowledge stops living with a few people, and the team
                    takes on work it couldn&rsquo;t do before.
                  </p>
                </header>

                <FlywheelOrbit variant="centered" />
              </div>
            </section>

            {/* ─── Approach — runs standalone in this fork (no
                `.aiop-approach-and-encoding` parallax wrapper). The
                outcome aside is suppressed via `showOutcome={false}`
                because the Claude getting-started chapter directly
                below takes the closing slot the outcome would
                normally hold. EncodingInterstitial below also runs
                standalone; its parallax handler degrades gracefully
                to a self-progress fade when no wrapper is found. */}
            <Approach
              section={workshopApproach}
              collapsibleBody
              showOutcome={false}
            />

            {/* ─── Claude getting-started chapter + EncodingInterstitial
                ─────────────────────────────────────────────────────
                Two nested wrappers do two separate jobs:

                  - `.aiop-claude-zone` scopes the Anthropic
                    palette overrides defined in
                    claude-workshop.css. Every section inside it
                    renders in Ivory / Slate / Clay.

                  - `.aiop-encoding-pair` is the parallax wrapper
                    that EncodingInterstitial recognises (in
                    addition to the canonical
                    `.aiop-approach-and-encoding`). It freezes the
                    `.aiop-claude-zone` block as a single visual
                    unit while the encoding section slides up over
                    it through natural flow. In practice only the
                    last section of the zone (ClaudeConnectors) is
                    visible at the freeze moment, so the scroll
                    reads as "ClaudeConnectors freezes, encoding
                    rises".

                The EncodingInterstitial sits OUTSIDE
                `.aiop-claude-zone`, so it returns to the Aether
                palette as it slides over. */}
            <div className="aiop-encoding-pair">
              <div className="aiop-claude-zone">
                <ClaudeBridge />
                <ClaudeSettings />
                <ClaudeModels />
                <ClaudeConnectors />
              </div>

              <EncodingInterstitial />
            </div>

            <UseCasesProvider>
              <ClaudeSkillAnatomy />

              <TheShift />
              <DegreesOfFreedom hideCaption />

              <ClaudeSkillsAtLoop />

              <SoftwareForFew />

              <div className="aiop-cases-and-shift">
                <Cases />
                <HeadlessShift />
              </div>

              <SurfacePick />
            </UseCasesProvider>

            <CloseAiop />
          </RoleProvider>
        </Suspense>
      </main>

      <SiteFooter
        line={workshopFooter.line}
        signature={workshopFooter.signature}
      />
    </div>
  );
}

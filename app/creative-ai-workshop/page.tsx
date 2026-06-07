import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import { WorkshopApproach } from "@/components/claude-adoption/workshop-approach";
import { ClaudeBridge } from "@/components/claude-workshop/claude-bridge";
import { ClaudeConnectors } from "@/components/claude-workshop/claude-connectors";
import { ClaudeModels } from "@/components/claude-workshop/claude-models";
import { ClaudeSettings } from "@/components/claude-workshop/claude-settings";
import { ClaudeSkillAnatomy } from "@/components/claude-workshop/claude-skill-anatomy";
import { ClaudeSkillsAtLoop } from "@/components/claude-workshop/claude-skills-at-loop";
import { AboutVince } from "@/components/creative-workshop/about-vince";
import { AgentContext } from "@/components/creative-workshop/agent-context";
import { CreativeHud } from "@/components/creative-workshop/creative-hud";
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
import { ScrollReveal as OperatorScrollReveal } from "@/components/operator/reveal";
import { ScrollReveal as SharedScrollReveal } from "@/components/shared/reveal";
import { SiteFooter } from "@/components/shared/site-footer";
import { caWorkshopApproachSection } from "@/content/claude-adoption";
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
import "@/components/claude-adoption/claude-adoption.css";
import "./creative-ai-workshop.css";

/*
 * /creative-ai-workshop — Creative AI Workshop variant of `/`.
 *
 * Shares the same shell, fonts, role/use-case providers, and
 * section composition as `/claude-workshop-v1`. Diverges only in
 * route-local copy: hero, brand sub, diagnosis head, approach,
 * vision section, footer, and metadata. Everything else (Signal,
 * SubstrateMap, EnginePattern, EvansBridge, ToolCollabSpectrum,
 * Approach, the Claude getting-started chapter, the encode
 * deep-dive, Cases, HeadlessShift, SurfacePick, CloseAiop) renders
 * unchanged so the page reads as a proper sibling to the Claude
 * workshop, not a separate site.
 *
 * Audience reframe: this is for creative production teams (video,
 * design, copy, brand). The narrative answers "AI is a speed layer
 * on the creative process, not a salvage operation for bad work" —
 * so the surrounding chrome stays the same, the framing copy shifts.
 *
 * Same three structural divergences from `/` as the Claude variant:
 *   1. Live composer (CsIdeationEngine) is removed; nav engine link
 *      filtered out.
 *   2. `Approach` runs without the parallax wrapper and with
 *      `showOutcome={false}`. The Claude getting-started chapter
 *      sits in the closing slot the outcome would otherwise hold.
 *   3. The encode deep-dive folds in the two Skills sections from
 *      the Claude workshop (anatomy + skills-at-loop). They stay on
 *      the Aether palette outside `.aiop-claude-zone`.
 */

const workshopHero = {
  titleLines: [
    "A speed layer on",
    { em: "the creative process." },
  ] as const,
  lede: [
    "Pure AI generation has plateaued. The real gains live around the work \u2014 the brief, the cuts, the page from the video. Encode what good looks like once. Build tools on top.",
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

const workshopBrandSub = "Creative AI Workshop";

const workshopDiagnosisHead = {
  title: "We have the eye and the muscle,",
  titleEm: "but the asking gap is widening.",
  sub: "Pure AI generation has plateaued. The real gains live around the work \u2014 in the brief, in the cuts, in the page from the video, in the way one piece of content becomes five. Pick a function below to see where the gap costs you most.",
};

const workshopApproach = {
  title: "Three motions,",
  titleEm: "compounding inside the work.",
  caption:
    "Navigate, encode, build. The same flywheel that runs an AI rollout, here applied to the creative process.",
};

const workshopVision = {
  titleLead: "Better output starts with",
  titleEm: "better asking.",
  caption:
    "The model is generic. The work isn\u2019t. Encode the way you brief, the way you cut, the way you decide what\u2019s good. Once that lives in a Skill, every team member starts from the same shoulders.",
};

const workshopFooter = {
  line: "Thoughtform \u00b7 Creative AI Workshop \u00b7 A speed layer on the creative process.",
  signature: "Scoped by Vince \u00b7 2026.",
};

/* "How we run it" override.
 *
 * Reuses the existing 3 stages and inline diagrams from the
 * shared `caWorkshopApproachSection` (those receipts are real
 * proof of practice). Overrides only the header copy so the
 * section reads as the workshop's "what to expect" beat per
 * the skeleton: the loop we run today, what you leave with,
 * what's pre-built, what we build live. */
const workshopHowWeRun = {
  ...caWorkshopApproachSection,
  id: "what-to-expect",
  ariaLabel:
    "What to expect from the workshop: the loop we run, what you leave with, and what we build live",
  title: "What to expect.",
  titleEm: "A loop, not a lecture.",
  titleAfter: "",
  titleBreakBeforeEm: false,
  sub: "You walk into a 45-minute kickoff that already exists. By the end of the session, you leave with one workflow encoded as a Skill, ready to run again Monday morning. Three sessions later, the patterns across teams become tools the room can use. The receipts below are the loop in motion.",
} as const;

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

const creativeWorkshopNavLinks = pageMeta.links.filter(
  (link) => link.id !== "engine",
);

/* Thoughtform light typeface stack: IBM Plex Sans for display +
   body, PT Mono for HUD labels and eyebrows. The display variable
   stays mapped to Plex (heavier weight) so existing components
   that ask for `var(--aiop-display)` keep getting a sans without
   the Bodoni serif feel. PP Neue Montreal is a later swap. */
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
  title: "Aether \u00b7 Creative AI Workshop",
  description:
    "Creative AI Workshop \u2014 using AI as a speed layer on the creative process. Navigate, encode, build. A practical session on encoding the way your team works, then building small tools on top.",
  robots: { index: false, follow: false },
};

export default function CreativeAiWorkshopPage() {
  return (
    <div
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-shell--tf-light aiop-stage aiop-workshop-v1`}
    >
      <CreativeHud />
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
            {creativeWorkshopNavLinks.map((link) => (
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

        <Suspense fallback={null}>
          <RoleProvider>
            {/* New top-of-page sequence: meet Vince, meet the room
                (agent expectations + missing layer), then hand off
                to the diagnosis. */}
            <AboutVince />
            <AgentContext />

            <DiagnosisWithRoleFilter head={workshopDiagnosisHead} />
            <SubstrateMap />

            <Signal />

            <QuestionInterstitial />

            <section className="aiop-section aiop-vision" id="vision">
              <div className="aiop-wrap aiop-vision__inner aiop-reveal">
                <header className="aiop-section-head aiop-vision__head">
                  <h2 className="aiop-section-title aiop-vision__title">
                    {workshopVision.titleLead}{" "}
                    <em>{workshopVision.titleEm}</em>
                  </h2>
                  <p className="aiop-section-head__sub aiop-vision__caption">
                    {workshopVision.caption}
                  </p>
                </header>

                <FlywheelOrbit variant="centered" />
              </div>
            </section>

            {/* "How we run it" — ported from Aether. The header copy
                is overridden via `workshopHowWeRun` so the section
                reads as the workshop's "what to expect" beat; the
                three stage cards + inline diagrams stay as proof
                of practice. */}
            <WorkshopApproach section={workshopHowWeRun} />

            {/* Relocated below "How we run it": the 15-skill
                carousel + Evans bridge + Tool/Collab spectrum. They
                still ride the page; they just sit after the run-of-
                show now instead of interrupting it. */}
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
                  href: "#approach",
                  ariaLabel: "Continue to the program running the layer",
                },
              ]}
            />

            <div className="aiop-evans-and-tool-collab">
              <EvansBridge />
              <ToolCollabSpectrum />
            </div>

            <Approach
              section={workshopApproach}
              collapsibleBody
              showOutcome={false}
            />

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

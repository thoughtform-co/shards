import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import { SkillsByTeam } from "@/components/claude-adoption/skills-by-team";
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
import { NavigateInterstitial } from "@/components/creative-workshop/navigate-interstitial";
import { CloseAiop } from "@/components/intelligence-layer/close-aiop";
import { DegreesOfFreedom } from "@/components/intelligence-layer/degrees-of-freedom";
import { DiagnosisWithRoleFilter } from "@/components/intelligence-layer/diagnosis-with-role-filter";
import { RoleProvider } from "@/components/intelligence-layer/role-context";
import { SubstrateMap } from "@/components/intelligence-layer/substrate-map";
import { TheShift } from "@/components/intelligence-layer/the-shift";
import { UseCasesProvider } from "@/components/intelligence-layer/use-cases-context";
import { Cases } from "@/components/operator/cases";
import { EncodingInterstitial } from "@/components/operator/encoding-interstitial";
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
import { caSkillsByTeamSection, caWorkshopApproachSection } from "@/content/claude-adoption";
import {
  type DiagnosisCard,
  pageMeta,
  pageSubstrateMap,
} from "@/content/intelligence-layer";
import { signalSection } from "@/content/operator";
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
 * route-local copy: hero, brand sub, diagnosis head, vision
 * section, footer, and metadata.
 *
 * Audience reframe: this is for creative production teams (video,
 * design, copy, brand). The narrative answers "AI is a speed layer
 * on the creative process, not a salvage operation for bad work" —
 * so the surrounding chrome stays the same, the framing copy shifts.
 *
 * Post-flywheel structure follows a Navigate -> Encode -> Build
 * arc. Each phase opens with an interstitial (NavigateInterstitial /
 * EncodingInterstitial / SoftwareForFew) followed by its depth and
 * proof:
 *   - Navigate -> ToolCollabSpectrum, EvansBridge, Claude zone
 *   - Encode  -> Anatomy / Shift / Freedom / Skills-at-Loop, then
 *                the SkillsByTeam pie chart as proof
 *   - Build   -> Cases, HeadlessShift, SurfacePick
 * WorkshopApproach (#what-to-expect) closes as the workshop's
 * logistics breakdown; the prior `Approach` recap was dropped
 * because WorkshopApproach already covers that beat.
 *
 * Other divergences from `/`:
 *   - Live composer (CsIdeationEngine) is removed; nav engine link
 *     filtered out.
 *   - The encode deep-dive folds in the two Skills sections from
 *     the Claude workshop (anatomy + skills-at-loop). They stay on
 *     the Aether palette outside `.aiop-claude-zone`.
 */

const workshopHero = {
  titleLines: ["Make AI work", { em: "the way you do." }] as const,
  lede: [
    "On its own, AI is pretty good, and pretty good is generic. The judgment that makes the work yours is stuck in people\u2019s heads. Encode it once, and everything you build on top runs on it.",
  ] as const,
  actions: [
    {
      id: "see-how",
      label: "See how it works",
      href: "#diagnosis",
      primary: true,
    },
    { id: "proof", label: "See the proof", href: "#signal" },
  ] as const,
};

const workshopBrandSub = "Creative AI Workshop";

const workshopDiagnosisCards: readonly DiagnosisCard[] = [
  {
    id: "cold-start",
    tag: "01",
    tone: "violet",
    title: "You explain yourself from scratch every time.",
    body: "Each new chat starts cold. The AI doesn\u2019t know your team, your standards, or what you decided last week, so you retype the same context again and again.",
  },
  {
    id: "generic-output",
    tag: "02",
    tone: "gold",
    title: "The output is generic.",
    body: "Ask without context and you get the safe, average answer. It reads fine. It just doesn\u2019t sound like you, and it doesn\u2019t reflect how you actually work.",
  },
  {
    id: "tacit-knowledge",
    tag: "03",
    tone: "sage",
    title: "Your best thinking stays in people\u2019s heads.",
    body: "How your strongest people work is rarely written down. AI can\u2019t draw on it, new people can\u2019t learn it, and it walks out the door when they leave.",
  },
  {
    id: "blank-page",
    tag: "04",
    tone: "slate",
    title: "Every project starts from a blank page.",
    body: "Nothing carries over. The work you did last month doesn\u2019t make this month faster, so you rebuild the same things over and over.",
  },
];

const workshopDiagnosisHead = {
  title: "Where AI keeps",
  titleEm: "falling short.",
  sub: "You\u2019ve run into all four of these. They look like separate problems, but they share one cause: nothing holds how your team actually works.",
};

const workshopDiagnosisGap = {
  eyebrow: "Shared gap",
  title:
    "All four come from the same gap: nothing holds how your team works in a form AI can use.",
};

const workshopSubstrateMap = {
  ...pageSubstrateMap,
  title: "What\u2019s missing is an",
  titleEm: "intelligence layer.",
  body: "Three parts, and you already have the first one. The work lives in your tools. The way you work gets captured once in the middle. Every AI tool you use draws from it.",
  columns: {
    ...pageSubstrateMap.columns,
    sources: {
      ...pageSubstrateMap.columns.sources,
      title: "Where the work already lives.",
      caption:
        "The tools and files you already use: client notes, briefs, docs, whatever holds your real work. AI reads from these instead of guessing.",
      ontology: {
        kind: "Your stack",
        objects: ["CRM", "Docs", "Drive", "Board"],
      },
      systems: {
        items: [
          "Your CRM",
          "Your docs",
          "Your shared drive",
          "Your project board",
        ],
      },
    },
    substrate: {
      ...pageSubstrateMap.columns.substrate,
      title: "How the team decides.",
      caption:
        "Your rules, your examples, your voice, and who signs off. Captured once, owned by you, and it keeps working when the AI models change.",
      items: [
        { tag: "Rules", name: "How the team decides" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Voice", name: "How you sound" },
        { tag: "Sign-off", name: "Who confirms what" },
      ],
      tags: ["Owned by you", "Versioned", "Survives model changes"],
    },
    surfaces: {
      ...pageSubstrateMap.columns.surfaces,
      title: "Where you actually use it.",
      caption:
        "One source of truth, many places to use it. A chat, a doc, a website, whatever fits the moment.",
      items: [
        { icon: "Cl", name: "Chat" },
        { icon: "D", name: "Docs" },
        { icon: "\u25D0", name: "Website" },
        { icon: "#", name: "Slack" },
      ],
    },
  },
  closing:
    "Your work stays where it is, the layer holds the judgment, and every tool draws from it.",
};

const workshopSignal = {
  ...signalSection,
  title: "The labs just bet",
  titleEm: "billions",
  titleAfter: "on the same layer.",
  sub: "Both labs just said it out loud: the problem was never the model, it was getting it deployed.",
  cards: [
    {
      ...signalSection.cards[0]!,
      kicker: "Palantir \u00b7 2010s",
      headline: "The role every AI lab is now copying.",
      dek: [
        { text: "Palantir invented the" },
        { text: "Forward Deployed Engineer", strong: true },
        {
          text: ": someone who embeds in a customer\u2019s team, captures how they work, and leaves behind a running system. The shape that defined enterprise software.",
        },
      ],
      byline: { source: "Palantir", date: "FDE program" },
    },
    {
      ...signalSection.cards[1]!,
      kicker: "Stripe \u00b7 2026",
      headline: "Stripe created a role that didn\u2019t exist a year ago.",
      dek: [
        {
          text: "Multiple six figures to embed AI-natives inside marketing. Each one assigned to",
        },
        { text: "20 marketers", strong: true },
        {
          text: "until the team can run it alone. AI as default, not occasional tool.",
        },
      ],
      byline: { source: "@andruyeung", date: "via X" },
    },
    {
      ...signalSection.cards[2]!,
      kicker: "OpenAI \u00b7 $10B \u00b7 May 2026",
      headline: "OpenAI launched the Deployment Company.",
      dek: [
        {
          text: "A $10B joint venture, 19 partners, and around 150 forward-deployed engineers on day one from the Tomoro acquisition. Deployment is the new distribution.",
        },
      ],
      byline: { source: "openai.com", date: "May 2026" },
    },
    {
      ...signalSection.cards[3]!,
      kicker: "Anthropic \u00b7 $1.5B",
      headline: "Anthropic\u2019s $1.5B answer.",
      dek: [
        {
          text: "Blackstone, Hellman & Friedman, Goldman Sachs. Applied AI engineers placed inside their portfolio companies to build custom Claude. No consulting firms involved.",
        },
      ],
      byline: { source: "Bloomberg", date: "Enterprise track" },
    },
  ],
};

const workshopQuestion = {
  eyebrow: "Deep dive",
  question: "But how do you actually get here?",
  subline: "",
  scrollNote: "",
} as const;

const workshopVision = {
  titleLead: "Adoption and Automation are",
  titleEm: "the same flywheel.",
  caption:
    "Adoption is the loop run inside real work: navigate with the team, encode what works, build small tools on top. Automation is what comes out the other side. Same flywheel, two readings.",
};

/* Skills pie chart — header override for external workshop audience.
   The shared `caSkillsByTeamSection` copy assumes Loop insiders;
   here we name the company and explain the chart as a case study. */
const workshopSkillsSection = {
  ...caSkillsByTeamSection,
  ariaLabel:
    "Skills shipped at Loop Earplugs, shown as a workshop case study",
  titleAccentLine: "At Loop",
  sub: "A real rollout at Loop Earplugs. Forty-two Skills across every team — each one captures how that team handles a specific piece of work, so people and agents can build on what the company already knows.",
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
  title: "What to expect",
  titleEm: "from the session.",
  titleAfter: "",
  titleBreakBeforeEm: false,
  sub: "You walk into a session that already has a shape, so no time goes to setup. You leave with one real thing you can use the next morning: a Skill. A Skill is a set of instructions Claude follows, so it works your way every time, without you re-explaining. That\u2019s the whole idea in miniature.",
  cards: [
    {
      ...caWorkshopApproachSection.cards[0]!,
      label: "Every team starts here",
      body: "Same short kickoff, same Claude. Each team leaves with one workflow worth capturing as a Skill.",
      receipt: "22 workshops, one per team",
    },
    {
      ...caWorkshopApproachSection.cards[1]!,
      label: "The work feeds the layer",
      body: "Meeting recorded and transcribed, captured as a Skill, lands in the same shared board. The ones that prove out move to a shared, versioned library.",
      receipt:
        "The transcript becomes a Skill, and every team\u2019s result lands in the same place.",
    },
    {
      ...caWorkshopApproachSection.cards[2]!,
      label: "Patterns become tools",
      body: "Three teams doing the same work means a Skill worth sharing. Three teams needing the same tool means one worth building.",
      receipt:
        "Creative strategy, product marketing, and campaign management all needed the same briefing help, so it became one shared briefing tool.",
    },
  ],
} as const;

/* Drop the live composer link (no engine on this route) and remap
   the "Receipts" anchor — its target (`#engine-pattern`) used to
   point at the 15-Skill carousel, but the workshop now renders
   the new SkillsByTeam pie chart in its place under `#skills`. */
const creativeWorkshopNavLinks = pageMeta.links
  .filter((link) => link.id !== "engine")
  .map((link) =>
    link.id === "engine-pattern" ? { ...link, href: "#skills" } : link,
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
  title: "Thoughtform \u00b7 Creative AI Workshop",
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
              <span className="aiop-brand__name">Thoughtform</span>
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
            <div className="aiop-about-and-context">
              <AboutVince />
              <AgentContext />
            </div>

            <DiagnosisWithRoleFilter
              head={workshopDiagnosisHead}
              cards={workshopDiagnosisCards}
              gap={workshopDiagnosisGap}
              hideRoleFilter
            />
            <SubstrateMap section={workshopSubstrateMap} />

            <Signal section={workshopSignal} />

            {/* Bridge into the flywheel: the workshop's diagnosis +
                substrate map + signal land here, and the question
                interstitial sets up the orbit beneath as the answer. */}
            <QuestionInterstitial section={workshopQuestion} />

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

            {/* ─── NAVIGATE chapter ───────────────────────────────────
                Phase 1 of the flywheel: learn to work with the
                intelligence itself before encoding it. The
                interstitial introduces the chapter (left text +
                right 3-row properties card), and ToolCollab + Evans
                land as the depth: the tool↔collaborator continuum
                and the asking-gap reframe. The Claude getting-
                started zone closes the chapter as the practical
                "meet the colleague" beat.

                EvansBridge renders without `.aiop-evans-and-tool-
                collab` wrapper, so it falls back to its rect-based
                reveal (no parallax pin). */}
            <NavigateInterstitial />
            <ToolCollabSpectrum />
            <EvansBridge />

            <div className="aiop-claude-zone">
              <ClaudeBridge />
              <ClaudeSettings />
              <ClaudeModels />
              <ClaudeConnectors />
            </div>

            {/* ─── ENCODE chapter ─────────────────────────────────────
                Phase 2: turn judgment into substrate the model can
                inherit. Interstitial leads, then the anatomy →
                shift → freedom → skills-at-loop sequence unpacks
                what a Skill is and how it runs. The pie chart lands
                as the proof beat ("What's being encoded. At Loop").

                EncodingInterstitial runs without the `.aiop-
                encoding-pair` wrapper — its scroll handler picks
                the self-progress fallback so the atmospheric
                washes still drift, only the slide-over freeze is
                dropped (acceptable for a standalone chapter intro).

                Wrapped in `UseCasesProvider` so TheShift / Degrees
                / SurfacePick share one use-case context across
                both the Encode and Build chapters below. */}
            <UseCasesProvider>
              <EncodingInterstitial />
              <ClaudeSkillAnatomy />
              <TheShift />
              <DegreesOfFreedom hideCaption />
              <ClaudeSkillsAtLoop />
              <SkillsByTeam
                section={workshopSkillsSection}
                showBreakdown={false}
                showRepo={false}
              />

              {/* ─── BUILD chapter ─────────────────────────────────────
                  Phase 3: tools the team builds for itself on top of
                  the encoded substrate. Interstitial leads, then
                  Cases lands the four concrete projects (Mímir,
                  Vesper, Babylon, Heimdall) as the proof beat.
                  HeadlessShift + SurfacePick name where this is
                  heading after the workshop. */}
              <SoftwareForFew />
              <Cases />
              <HeadlessShift />
              <SurfacePick />
            </UseCasesProvider>

            {/* Workshop logistics — what to expect from the session,
                lands as the practical close before CloseAiop's
                hand-off. */}
            <WorkshopApproach section={workshopHowWeRun} />

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

import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import { SkillsByTeam } from "@/components/claude-adoption/skills-by-team";
import { WorkshopApproach } from "@/components/claude-adoption/workshop-approach";
import { ClaudeSkillAnatomy } from "@/components/claude-workshop/claude-skill-anatomy";
import { AboutVince } from "@/components/creative-workshop/about-vince";
import { AgentContext } from "@/components/creative-workshop/agent-context";
import { CreativeHud } from "@/components/creative-workshop/creative-hud";
import {
  AgentsInterstitial,
  AiStudioBriefingsProof,
  WhereFromHereInterstitial,
  WorldFirstAiAtlProof,
} from "@/components/creative-workshop/keynote-proof-sections";
import { NavigateInterstitial } from "@/components/creative-workshop/navigate-interstitial";
import { VideoSection } from "@/components/creative-workshop/video-section";
import { CloseAiop } from "@/components/intelligence-layer/close-aiop";
import { DegreesOfFreedom } from "@/components/intelligence-layer/degrees-of-freedom";
import { DiagnosisWithRoleFilter } from "@/components/intelligence-layer/diagnosis-with-role-filter";
import { RoleProvider } from "@/components/intelligence-layer/role-context";
import { SubstrateMap } from "@/components/intelligence-layer/substrate-map";
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
import { ExalateScopedSkills, type ExalateSkillsSection } from "./scoped-skills";
import { WorkshopTldr, type WorkshopTldrContent } from "./workshop-tldr";
import "@/components/landing/landing.css";
import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "@/components/claude-workshop/claude-workshop.css";
import "@/components/claude-adoption/claude-adoption.css";
import "../creative-ai-workshop/creative-ai-workshop.css";
import "./exalate-workshop.css";

/*
 * /exalate-ai-workshop — Exalate cut of /ai-keynote.
 *
 * Leave-behind for the 10 July 2026 workshop with the Exalate
 * marketing team (Manoush, Mariana, Radan, Hugo, Farzana). Same
 * Thoughtform light shell, palette, and Navigate -> Encode -> Build
 * story as the keynote; diverges in:
 *   - Hero: sync-flavored title + lede, plus a WorkshopTldr modal
 *     button (what we covered + next steps, from the meeting notes).
 *   - Skills: the Loop donut stays as proof, followed by
 *     ExalateScopedSkills — the six Skills scoped in the room.
 *
 * An earlier cut re-pointed the accent lane to Exalate purple via an
 * `.aiop-shell--exalate` modifier; that was reverted, so the route
 * runs on the shared Thoughtform gold.
 */

const workshopHero = {
  titleLines: ["Make AI sync", { em: "the way you work." }] as const,
  lede: [
    "On its own, AI is pretty good, and pretty good is generic. The judgment that makes work feel like Exalate lives in five people’s heads. Encode it once, and everything you ship after today runs on it.",
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

const workshopBrandSub = "Exalate AI Workshop";

const workshopDiagnosisCards: readonly DiagnosisCard[] = [
  {
    id: "cold-start",
    tag: "01",
    tone: "violet",
    title: "You explain yourself from scratch every time.",
    body: "Each new chat starts cold. The AI doesn’t know your team, your standards, or what you decided last week, so you retype the same context again and again.",
  },
  {
    id: "generic-output",
    tag: "02",
    tone: "gold",
    title: "The output is generic.",
    body: "Ask without context and you get the safe, average answer. It reads fine. It just doesn’t sound like you, and it doesn’t reflect how you actually work.",
  },
  {
    id: "tacit-knowledge",
    tag: "03",
    tone: "sage",
    title: "Your best thinking stays in people’s heads.",
    body: "How your strongest people work is rarely written down. AI can’t draw on it, new people can’t learn it, and it walks out the door when they leave.",
  },
  {
    id: "blank-page",
    tag: "04",
    tone: "slate",
    title: "Every project starts from a blank page.",
    body: "Nothing carries over. The work you did last month doesn’t make this month faster, so you rebuild the same things over and over.",
  },
];

const workshopDiagnosisHead = {
  title: "Where AI keeps",
  titleEm: "falling short.",
  sub: "You’ve run into all four of these. They look like separate problems, but they share one cause: nothing holds how your team actually works.",
};

const workshopDiagnosisGap = {
  eyebrow: "Shared gap",
  title:
    "All four come from the same gap: nothing holds how your team works in a form AI can use.",
};

const workshopSubstrateMap = {
  ...pageSubstrateMap,
  title: "What’s missing is an",
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
        { icon: "◐", name: "Website" },
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
      kicker: "Palantir · 2010s",
      headline: "The role every AI lab is now copying.",
      dek: [
        { text: "Palantir invented the" },
        { text: "Forward Deployed Engineer", strong: true },
        {
          text: ": someone who embeds in a customer’s team, captures how they work, and leaves behind a running system. The shape that defined enterprise software.",
        },
      ],
      byline: { source: "Palantir", date: "FDE program" },
    },
    {
      ...signalSection.cards[1]!,
      kicker: "Stripe · 2026",
      headline: "Stripe created a role that didn’t exist a year ago.",
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
      kicker: "OpenAI · $10B · May 2026",
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
      kicker: "Anthropic · $1.5B",
      headline: "Anthropic’s $1.5B answer.",
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

const workshopSkillsSection = {
  ...caSkillsByTeamSection,
  ariaLabel:
    "Skills shipped at Loop Earplugs, shown as a workshop case study",
  titleAccentLine: "At Loop",
  sub: "A real rollout at Loop Earplugs. Forty-two Skills across every team — each one captures how that team handles a specific piece of work, so people and agents can build on what the company already knows.",
};

/* The Exalate turn of the Skills beat: six Skills scoped live in the
   10 July 2026 session, matched to the person who raised the
   workflow in the intro round. Rendered by ExalateScopedSkills
   directly after the Loop donut. */
const exalateSkillsSection: ExalateSkillsSection = {
  id: "exalate-skills",
  ariaLabel: "Six Skills scoped for the Exalate marketing team",
  title: "The first six Skills",
  titleEm: "we scoped in the room.",
  accentLine: "For Exalate",
  sub: "Loop ran the flywheel to forty-two. These six came out of today’s session, each matched to the person who owns the workflow.",
  cards: [
    {
      id: "exalate-genai-prompting",
      title: "Exalate Gen-AI Prompting",
      owner: "Radan",
      body: "Fork the shared prompting skill and load it with the Exalate brand book. Every Nano Banana, GPT-Image-2, or Seedance prompt starts on-brand instead of from a blank page.",
      footnote: "Agreed in the room; the skill file is already shared.",
      status: "scoped",
      statusLabel: "SCOPED",
      substrate: "pattern",
    },
    {
      id: "exalate-tone-of-voice",
      title: "Exalate Tone of Voice",
      owner: "Hugo",
      body: "One briefing that holds the brand and tone rules, so Claude drafts copy that already sounds like Exalate. Web, SEO, and paid in one pass.",
      footnote: "Pairs with the prompting skill for full campaigns.",
      status: "scoped",
      statusLabel: "SCOPED",
      substrate: "voice",
    },
    {
      id: "website-qa-agent",
      title: "Website QA Agent",
      owner: "Mariana",
      body: "Sweeps the site for broken SEO, code errors, and the issues a non-technical review can’t see. Runs before a customer or a crawler finds them.",
      footnote: "Scoped during the tools session.",
      status: "scoped",
      statusLabel: "SCOPED",
      substrate: "validation",
    },
    {
      id: "elementor-block-library",
      title: "Elementor Block Library",
      owner: "Mariana",
      body: "Document each block once and Claude can rebuild it in pure code. The bridge across the Figma-to-Elementor gap named in the intro round.",
      footnote: "Also the first step off Elementor, if that day comes.",
      status: "scoped",
      statusLabel: "SCOPED",
      substrate: "pattern",
    },
    {
      id: "permutation-page-generator",
      title: "Permutation Page Generator",
      owner: "Mariana · Radan",
      body: "One briefing line in, a finished use-case page out: both trackers, both logos, the right copy. SVG from code, so it stays light and editable.",
      footnote: "The recommended route for the sync permutation pages.",
      status: "scoped",
      statusLabel: "SCOPED",
      substrate: "pattern",
    },
    {
      id: "ppc-landing-variants",
      title: "PPC Landing Variants",
      owner: "Farzana",
      body: "Landing copy per ad group, checked against the brand voice and staged for review. Replaces the slowest manual loop in the funnel.",
      footnote: "Named as the big manual bottleneck in the intro round.",
      status: "scoped",
      statusLabel: "SCOPED",
      substrate: "judgment",
    },
  ],
  moreTail:
    "On the stretch list: a plain-language pass for AI output, and the After Effects to Remotion pipeline once these six are live.",
};

/* Hero modal: the workshop in one screen. Bullets and next steps
   come from the two meeting notes (adoption session 09:34, tools
   session 11:51). */
const exalateTldr: WorkshopTldrContent = {
  buttonLabel: "Workshop TLDR",
  ariaLabel: "Workshop TLDR: what we covered and next steps",
  eyebrow: "Exalate × Thoughtform · 10 July 2026",
  title: "The TLDR.",
  groups: [
    {
      heading: "The frame",
      bullets: [
        "AI sits somewhere between a tool and a collaborator. Treat it as plain software and adoption stalls.",
        "It gets an asset to 80%. The judgment that closes the gap is where the team earns its keep.",
        "A Skill is a markdown briefing that holds that judgment. Write it once and every chat starts warm.",
        "Loop shot a full AI brand film for €8k instead of €30k, then stopped anyway. AI carries conversion content; audiences don’t want it as brand storytelling.",
        "Turn on Claude’s memory, clean it monthly, and add standing instructions: confidence levels, pushback, no cheerleading.",
      ],
    },
    {
      heading: "The tools",
      bullets: [
        "Semantic editing (change one element, keep the rest) exists in exactly two models: Nano Banana and GPT-Image-2. Everything else is text-to-image.",
        "Krea covers day-to-day generation at roughly €20 per seat. Generate at 4K straight away; upscaling degrades.",
        "For UI-style visuals and the permutation pages, code beats image generation. SVG from Claude is lighter, editable, and it ranks.",
        "Video: Seedance leads. For stop-motion, give it a start frame and an end frame and let it interpolate; chain the last frame into the next clip.",
        "Hyperframes and Remotion animate code directly, and After Effects exports JSON that Claude can read. Stretch project; run it in parallel.",
      ],
    },
  ],
  nextSteps: [
    {
      owner: "Exalate",
      items: [
        "Drop reference visuals and permutation-page examples in Slack.",
        "Share one Exalate video plus the zipped After Effects project for analysis.",
        "Upload the brand book to Claude and fork the Gen-AI prompting skill into an Exalate one.",
        "Try Hyperframes and Remotion on one existing animation.",
      ],
    },
    {
      owner: "Vince",
      items: [
        "Share the forward-deployed AI reading list.",
        "Share the confidence-levels and pushback instructions.",
        "Share Anthropic’s guide to building Skills.",
      ],
    },
  ],
  footnote: "Full notes are in the meeting doc. This is the version you screenshot.",
};

const workshopFooter = {
  line: "Thoughtform · Exalate AI Workshop · A speed layer on the creative process.",
  signature: "Scoped with the Exalate marketing team · 10 July 2026.",
};

const workshopHowWeRun = {
  ...caWorkshopApproachSection,
  id: "what-to-expect",
  ariaLabel:
    "What the flywheel looks like in practice — Loop's rollout as a worked example",
  title: "What the flywheel looks like",
  titleEm: "in practice.",
  titleAfter: "",
  titleBreakBeforeEm: false,
  sub: "Loop Earplugs is running this flywheel across every team. Same short kickoff, one Skill per workflow, all of them landing in a shared library the next team builds on — and when three teams hit the same pattern, that’s where the next tool comes from.",
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
        "The transcript becomes a Skill, and every team’s result lands in the same place.",
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

const creativeWorkshopNavLinks = pageMeta.links
  .filter((link) => link.id !== "engine")
  .map((link) =>
    link.id === "engine-pattern" ? { ...link, href: "#skills" } : link,
  );

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
  title: "Thoughtform · Exalate AI Workshop",
  description:
    "Exalate AI workshop recap: the adoption frame, the tools that matter, and the first six Skills scoped for the marketing team.",
  robots: { index: false, follow: false },
};

export default function ExalateAiWorkshopPage() {
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
                <WorkshopTldr
                  content={exalateTldr}
                  fontClassName={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable}`}
                />
              </div>
            </div>

            <div className="aiop-hero__orbit-stage aiop-reveal">
              <FlywheelOrbit variant="compact" bloom />
            </div>
          </div>
        </section>

        <Suspense fallback={null}>
          <RoleProvider>
            <AboutVince />

            {/* Keynote opening proof beats: the world-first AI ATL film
                and Loop Studio's "95% of briefings done with AI" cuts
                land before the diagnosis. Two short interstitials
                bridge the room from the receipts into the agent
                framing. */}
            <WorldFirstAiAtlProof />
            <AiStudioBriefingsProof />
            <WhereFromHereInterstitial />
            <AgentsInterstitial />

            <AgentContext />

            <DiagnosisWithRoleFilter
              head={workshopDiagnosisHead}
              cards={workshopDiagnosisCards}
              gap={workshopDiagnosisGap}
              hideRoleFilter
            />
            <SubstrateMap section={workshopSubstrateMap} />

            <Signal section={workshopSignal} />
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

            <WorkshopApproach section={workshopHowWeRun} />
            <NavigateInterstitial />
            <ToolCollabSpectrum />

            <UseCasesProvider>
              <div className="aiop-encoding-pair">
                <VideoSection
                  id="navigate-levin"
                  lane="navigate"
                  title="Intelligence is"
                  titleEm="navigable"
                  titleAfter="."
                  body="Michael Levin shows that even biological intelligence is alien — cells, tissues, and selves cohere through interfaces we are still learning to read. AI lands in the same family. The skill is the same: navigate the interface, do not assume the substrate."
                  videoSrc="/videos/michael-levin-cognitive-interfaces.mp4"
                  speaker="Michael Levin"
                  speakerRole="Tufts University · Cognitive interfaces in biology"
                  sourceLabel="Thoughtform Canon · Videos & Podcast"
                />
                <EncodingInterstitial />
              </div>
              <SkillsByTeam
                section={workshopSkillsSection}
                showBreakdown={false}
                showRepo={false}
              />
              <ExalateScopedSkills section={exalateSkillsSection} />
              <EvansBridge />

              <VideoSection
                id="encode-anthropic"
                lane="encode"
                title="The lab's own"
                titleEm="prompting advice"
                titleAfter="."
                body="Anthropic walks through how to brief Claude well — context, examples, constraints, iteration. Watch it once, then stop re-teaching the model every chat: encode the patterns into a Skill and let every conversation start from there."
                videoSrc="/videos/anthropic-prompting-advice.mp4"
                speaker="Anthropic"
                speakerRole="Prompting advice for Claude (with subtitles)"
                sourceLabel="anthropic.com"
                sourceHref="https://www.anthropic.com/"
              />

              <ClaudeSkillAnatomy />
              <DegreesOfFreedom hideCaption />
              <SoftwareForFew />
              <Cases />
              <HeadlessShift />
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

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
      id: "get-started",
      label: "Get Started",
      href: "#diagnosis",
      primary: true,
    },
  ] as const,
};

const workshopBrandSub = "AI Capability Workshop";

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

/* Hero modal: the whole workshop in one screen, drawn from both
   sessions' full transcripts (adoption + tools deep-dive). Principles
   and tool guidance only — no Loop internals. Attendees copy or
   download it as Markdown and take it into their own Claude. */
const exalateTldr: WorkshopTldrContent = {
  buttonLabel: "Workshop TLDR",
  ariaLabel: "Workshop TLDR: what we covered and next steps",
  eyebrow: "AI Capability Workshop · 10 July 2026",
  title: "The TLDR.",
  groups: [
    {
      heading: "The frame",
      bullets: [
        "AI is the first technology that sits between a tool and a collaborator. Treat it as plain software and adoption stalls.",
        "It looks like software: an account, a subscription, buttons. It is an intelligence that can build software, and that gap is the whole game.",
        "It automates tasks, not jobs. If your job is one single task, that is a different conversation.",
        "AI commodified average design, so good design and a human eye to curate matter more than before.",
        "Human-in-the-loop is a business argument, not a sentimental one. AI gets the asset to 80%, and the judgment that closes the last 20% is where the team earns its keep.",
        "A designer’s job is not making logos, it is helping people choose. Three strong options beat a hundred.",
      ],
    },
    {
      heading: "Set Claude up right",
      bullets: [
        "Turn on memory: Settings → Capabilities → generate memory from chat history. The more you use it, the more it pays back.",
        "Clean the memory monthly. Delete finished clients and dead projects so Claude stops dragging them back into unrelated chats.",
        "Set standing preferences in Settings → General → Instructions, but do not globally ban em dashes. They are entangled with good writing. Strip them at the end like an editor’s pass.",
        "Add two instructions everyone should steal: label confidence as certain, likely, or unknown; and push back instead of agreeing.",
        "Always feed context. Without it an LLM predicts the average, and the average is generic.",
      ],
    },
    {
      heading: "Work in Markdown",
      bullets: [
        "Models love Markdown, which is why they love Obsidian. Use it wherever you can.",
        "You no longer have to pre-structure data. Newer models brute-force a messy CSV or an unstructured Figma file.",
        "Brief Claude the way you would brief a colleague: the big picture first, then scroll through the detail.",
      ],
    },
    {
      heading: "Skills = encoded judgment",
      bullets: [
        "A Skill is a Markdown briefing that holds how your team judges work. Write it once and every chat starts warm.",
        "Cluster skills by what they actually do and most of them collapse into one thing: judgment. Build one meta-skill and layer the nuances on top, instead of maintaining 47 separate agents.",
        "The pipeline: record the meeting, turn the transcript into a Skill, land it in a shared ledger like Monday or Notion, then ask Claude for the patterns across teams.",
        "Build a plain-English skill that translates dense model output back into words a person would actually say.",
        "Getting started is genuinely easy. Anthropic’s skill documentation is enough to begin.",
      ],
    },
    {
      heading: "The AI-video proof",
      bullets: [
        "Loop shot a full AI brand film for about €8k against roughly €30k for live action.",
        "It looked good because the creative director, editor and colorist judged it with the same critical eye they bring to live action, not because the AI output was good on its own.",
        "Loop stopped anyway. Audiences want authenticity, and AI content has hit a saturation point.",
        "The EU AI Act, plus New York and California, now forces visible labeling when you feature a human, and the label itself adds bias.",
        "Where AI image and video win: conversion content, product shots, stock replacement. Brand storytelling is not on that list.",
      ],
    },
    {
      heading: "Image generation",
      bullets: [
        "Only two models do true semantic editing, changing one element while keeping the rest: Nano Banana and GPT-Image-2. Everything else is text-to-image.",
        "Talk to those two like an LLM. The rest are blunt models that need very descriptive prompts.",
        "Generate at 4K from the start. Never upscale, because it predicts pixels and hallucinates.",
        "When you cannot control the output, ask Claude for a hundred versions of the prompt, run them all, and curate what comes back.",
        "AI does not make layers. Generate flat, then have Cowork segment the result into a clean PSD afterward (text rasterizes).",
        "GPT-Image-2 is strong at UI mockups. Get the direction there, then hand it to Claude to build the working HTML.",
        "Krea is a convenient wrapper at about €20 per seat a month, roughly a 5× markup on the API. Wire your own with OpenAI and Gemini keys if you want. Skip Higgsfield; ComfyUI and Weavy are node tools for repeatable pipelines.",
      ],
    },
    {
      heading: "Pages in code, not image-gen",
      bullets: [
        "For simple pages of blocks and logos, like the two-tracker permutation pages, code beats generation. SVG and HTML are lighter, editable, trackable, and they rank.",
        "Document your Elementor blocks once so Claude can rebuild them in pure code.",
        "For an exact logo or gradient, use code. If Claude keeps redrawing it wrong, drop the PNG on top as-is.",
        "Build a website QA agent that catches the broken SEO and code a non-technical review can’t see. (That one is already scoped below.)",
      ],
    },
    {
      heading: "Video & animation",
      bullets: [
        "Seedance leads video right now. OpenAI’s Sora bowed out, and Google has Veo 3 with Veo 4 pending.",
        "Stop-motion trick: give a start frame with only the background and an end frame with the final composition. AI interpolates the elements into view.",
        "The last frame freezes, so chain it as the start frame of the next clip to keep a sequence moving.",
        "Gemini is the only model that reads what is on screen in a video, not just the audio.",
        "After Effects timelines export to JSON. Feed your best and worst performers in, ask for the patterns, and generate a new scene script to test.",
        "Hyperframes and Remotion animate code and HTML directly, and Fable pairs well with them. About three months old, so rough, but worth a parallel experiment.",
        "ElevenLabs handles voiceover and voice cloning. Loop’s UGC dubbing runs transcribe, double-check the audio and the on-screen captions, translate, agency review, then ElevenLabs and caption placement.",
      ],
    },
  ],
  nextSteps: [
    {
      owner: "Exalate",
      items: [
        "Drop reference visuals in Slack: the tech and UI-style outputs you want, icons and logos included.",
        "Share the use-case and permutation page examples.",
        "Radan: share an Exalate video plus the zipped After Effects package for analysis.",
        "Upload the brand book and fork the Gen-AI prompting skill into an Exalate one, paired with a tone-of-voice skill.",
        "Try Hyperframes and Remotion on one existing animation.",
      ],
    },
    {
      owner: "Vince",
      items: [
        "Share the forward-deployed AI reading list.",
        "Share the confidence-levels and pushback instructions.",
        "Share Anthropic’s guide to building Skills.",
        "Share the curated prompt variants from the shopping-cart shot.",
        "Share the Hyperframes and Remotion link.",
      ],
    },
  ],
  footnote:
    "Copy or download this as Markdown and drop it into Claude to turn the next steps into a plan.",
};

const workshopFooter = {
  line: "Thoughtform · AI Capability Workshop · A speed layer on the creative process.",
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
  title: "Thoughtform · AI Capability Workshop",
  description:
    "AI Capability Workshop recap: the adoption frame, the tools that matter, and the first six Skills scoped for the marketing team.",
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

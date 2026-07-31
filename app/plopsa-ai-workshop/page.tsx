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
  AiStudioBriefingsProof,
  WorldFirstAiAtlProof,
} from "@/components/creative-workshop/keynote-proof-sections";
import { NavigateInterstitial } from "@/components/creative-workshop/navigate-interstitial";
import { VideoSection } from "@/components/creative-workshop/video-section";
import { DegreesOfFreedom } from "@/components/intelligence-layer/degrees-of-freedom";
import { DiagnosisWithRoleFilter } from "@/components/intelligence-layer/diagnosis-with-role-filter";
import { RoleProvider } from "@/components/intelligence-layer/role-context";
import { SubstrateMap } from "@/components/intelligence-layer/substrate-map";
import { Cases } from "@/components/operator/cases";
import { EncodingInterstitial } from "@/components/operator/encoding-interstitial";
import { EvansBridge } from "@/components/operator/evans-bridge";
import { FlywheelOrbit } from "@/components/operator/flywheel-orbit";
import { QuestionInterstitial } from "@/components/operator/question-interstitial";
import { Signal } from "@/components/operator/signal";
import { SoftwareForFew } from "@/components/operator/software-for-few";
import { ToolCollabSpectrum } from "@/components/operator/tool-collab-spectrum";
import { ScrollReveal as OperatorScrollReveal } from "@/components/operator/reveal";
import { ScrollReveal as SharedScrollReveal } from "@/components/shared/reveal";
import { SiteFooter } from "@/components/shared/site-footer";
import {
  caSkillsByTeamSection,
  caWorkshopApproachSection,
} from "@/content/claude-adoption";
import {
  type DiagnosisCard,
  pageMeta,
  pageSubstrateMap,
} from "@/content/intelligence-layer";
import { cases, casesSection, signalSection } from "@/content/operator";
import { KreaModelsSection, KreaVideoCraftSection } from "./krea-sections";
import { SemanticExamplesSection } from "./semantic-examples";
import { TakeHomeSkills } from "./take-home-skills";
import { ToolChoiceSection } from "./tool-choice";
import { NavigatingAiProof, PlopsaShowcaseVideo } from "./video-sections";
import { WorkshopTldr, type WorkshopTldrContent } from "./workshop-tldr";
import "@/components/landing/landing.css";
import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "@/components/claude-workshop/claude-workshop.css";
import "@/components/claude-adoption/claude-adoption.css";
import "../creative-ai-workshop/creative-ai-workshop.css";
import "./plopsa-workshop.css";

/*
 * /plopsa-ai-workshop — Plopsa cut of /exalate-ai-workshop.
 *
 * Leave-behind for the Plopsa AI workshop series (three sessions:
 * image generation + video workflow, Notion content calendar +
 * on-brand presentations, follow-up).
 *
 * Trimmed from the Exalate route's 27 sections to a short keynote arc:
 *
 *   hero → about → ATL film → briefings proof → Vulpia showcase →
 *   "But how does AI work?" → Navigating AI (Vox) →
 *   "Which AI tools to use?" → "Semantic editing, in practice." →
 *   Krea (models, then video craft) → the co-intelligence hinge →
 *   the keynote tail
 *
 * The tail is rebuilt from /ai-keynote's order: agents → diagnosis →
 * intelligence layer → the labs' bet → flywheel → approach → colleague
 * → Levin → encoding → Loop's 42 Skills → Evans → Anthropic → skill
 * anatomy → degrees of freedom → the three Plopsa Skills → software
 * for few → cases.
 *
 * Content consts for that tail are copied verbatim from the keynote
 * rather than recovered from this file's own history — the lineage is
 * ai-keynote → exalate → plopsa, so what d0c92a0 deleted here was the
 * Exalate cut. See the block above them.
 *
 * The agent beats (#agents,
 * #agent-context) and the closing CTA (#close) were cut too, so there
 * is no outbound action after the last video — the hero's Get Started
 * and Workshop TLDR are the only CTAs on the page now. Cutting #close
 * also removed the "See the deep dive" button, which had been pointing
 * at #substrate-gallery, a section this route never rendered.
 *
 * The deep-dive half (diagnosis, substrate map, signal, vision, the
 * skills stack, cases, headless shift, surface pick) is gone, along
 * with the consts and imports that fed it. Two beats are route-local
 * because the shared components could not express them: the bare
 * Vulpia video and the Navigating AI proof both live in
 * ./video-sections, and the "But how does AI work?" interstitial is
 * inlined below rather than edited into the shared
 * WhereFromHereInterstitial, which four routes use.
 *
 * Unlike every other route in this lineage, this one does NOT run on
 * the shared Thoughtform gold. It stacks `.aiop-shell--plopsa` on top
 * of `.aiop-shell--tf-light` and re-points the token lane to Plopsa's
 * own brand values (read from plopsa.com: beige paper #fbf2ef, purple
 * #731c52, orange accent #ee3d05). tf-light STAYS on the element —
 * ~1800 lines of section layout in creative-ai-workshop.css are scoped
 * under it, so dropping it would unstyle the page. See the token block
 * in plopsa-workshop.css for why the selector is doubled.
 *
 * Content status: no Exalate copy remains. The TLDR modal, the footer
 * signature and the Skills tail were rewritten from the 30 July
 * transcripts; the keynote tail is the /ai-keynote original; the hero
 * has been returned to the keynote line it was punned from. The one
 * borrowed thing left is Loop wording inside shared components
 * (WorkshopApproach's "22 workshops", SoftwareForFew's opening, the
 * Mímir reference in DegreesOfFreedom) — deliberate, since the Loop
 * rollout is the page's proof.
 */

const workshopHero = {
  /* "Make AI sync the way you work" was Exalate's pun on their own
     product (issue syncing between trackers). The keynote's original
     line is the un-punned version of exactly this sentence, so the fix
     is to take it back rather than invent a third one. */
  titleLines: ["Make AI work", { em: "the way you do." }] as const,
  lede: [
    "On its own, AI is pretty good, and pretty good is generic. The judgment that makes work feel like Plopsa is stuck in people’s heads. Encode it once, and everything you ship after today runs on it.",
  ] as const,
  actions: [
    {
      id: "get-started",
      label: "Get Started",
      /* Was #diagnosis, which no longer exists — the first content
         beat after the hero is the ATL film. */
      href: "#world-first-ai-atl",
      primary: true,
    },
  ] as const,
};

const workshopBrandSub = "AI Capability Workshop";

/* ─────────────────────────────────────────────────────────────────────
 * Keynote tail content.
 *
 * Copied verbatim from app/ai-keynote/page.tsx:86-304, which is the
 * clean source: the lineage is ai-keynote → exalate → plopsa, so the
 * versions d0c92a0 deleted from this file were the Exalate cut
 * (Elementor, trackers, PPC ad groups). Only `workshopQuestion` is
 * reworded — its original "But how do you actually get here?" echoed
 * the #where-from-there interstitial higher up the page.
 * ─────────────────────────────────────────────────────────────────── */

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

/* Reworded from the keynote's "But how do you actually get here?" so it
   does not echo #where-from-there ("But how does AI work?") earlier on
   this page. Same position in the argument. */
const workshopQuestion = {
  eyebrow: "Deep dive",
  question: "So where does a team actually start?",
  subline: "",
  scrollNote: "",
} as const;

const workshopVision = {
  titleLead: "Adoption and Automation are",
  titleEm: "the same flywheel.",
  caption:
    "Adoption is the loop run inside real work: navigate with the team, encode what works, build small tools on top. Automation is what comes out the other side. Same flywheel, two readings.",
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

/* Cases, overridden rather than forked — the component takes `section`
   and `projects`.

   Two fixes. The shared lede opens "At Loop, software for few became
   practical", which lands oddly as the first line of a section shown to
   another client. And Vesper's subline reads "Replaced Krea. Built
   in-house." on a page that spends two sections and a TLDR group
   teaching Krea. Reframed as the build-vs-buy threshold, which is the
   same argument #krea-models already makes about the markup — so it
   now agrees with the page instead of contradicting it. */
const plopsaCasesSection = {
  ...casesSection,
  lede: "Software for few becomes practical once the judgment is encoded. A small team works alongside each function — compressing existing workflows, repairing broken handoffs, inventing new ones from scratch with AI.",
};

const plopsaCases = cases.map((project) =>
  project.codename === "Ves"
    ? { ...project, subline: "Built in-house once the volume justified it." }
    : project,
);

/* Restored with the Skills beat. Spreads the shared Loop section —
   note `id: "skills"` comes from there, not from this override. */
const workshopSkillsSection = {
  ...caSkillsByTeamSection,
  ariaLabel: "Skills shipped at Loop Earplugs, shown as a workshop case study",
  titleAccentLine: "At Loop",
  sub: "A real rollout at Loop Earplugs. Forty-two Skills across every team — each one captures how that team handles a specific piece of work, so people and agents can build on what the company already knows.",
};

/* Hero modal: the whole day in one screen, rewritten from the three
   30 July transcripts — Krea I (framing + round table), Krea II
   (hands-on tools and craft) and the Claude session (setup, modes,
   connectors, Skills). Principles and tool guidance only; no Loop or
   Plopsa internals. Next steps carry the real action items, so this
   doubles as the recap. Attendees copy or download it as Markdown and
   take it into their own Claude. */
const plopsaTldr: WorkshopTldrContent = {
  buttonLabel: "Workshop TLDR",
  ariaLabel: "Workshop TLDR: what we covered and next steps",
  eyebrow: "Krea + Claude sessions · 30 July 2026",
  title: "The TLDR.",
  groups: [
    {
      heading: "The frame",
      bullets: [
        "AI sits between a sparring partner and a tool. Nothing we have used before lands in that gap, which is why treating it as ordinary software stalls adoption.",
        "Brief it like a colleague, not like a search box. The hardest part is not the tool, it is being able to articulate what you actually want.",
        "It is strong on structured work and weak on subjective, on-brand creative. Plan around that split rather than fighting it.",
        "Think in tasks, not jobs. Which parts of your week drain you, and which of those could be handed over?",
        "Decide where you will not use it, too. The EU AI Act constrains some uses, and the public argument about AI content is real.",
      ],
    },
    {
      heading: "How image generation actually works",
      bullets: [
        "The model is not copying from a library. It navigates a latent space of 500+ dimensions and predicts the most likely image for your prompt.",
        "So prompting is navigation, not instruction. Style references, constraints and negative prompts narrow the path it can take.",
        "The same prompt will not give the same picture twice. Perfect control is not on the table — steer, look, adjust.",
        "Concepts are entangled. Ask for “cinematic” and you invite explosions; ask for “gently” and you get slow motion. Fight it with specifics.",
        "Upscaling predicts the pixels that were never there, and invents objects when there is too little to go on. Generate at 4K from the start instead.",
      ],
    },
    {
      heading: "Which tool for which job",
      bullets: [
        "Midjourney is opinionated and very aesthetic. Brilliant for brainstorming and mood, wrong for precise marketing work — you cannot steer it finely enough.",
        "Nano Banana and GPT Image are the semantic editors, and the two that matter for campaign work. Talk to them conversationally, the way you talk to Claude.",
        "They take several reference images at once and combine them sensibly, which is what makes complex composition and mockups possible.",
        "The other text-to-image models in Krea need long descriptive prompts. Good for style, not for a composed scene.",
        "Firefly sits inside Photoshop and Illustrator and is solid for composition, but it is not the strongest model in the room.",
      ],
    },
    {
      heading: "Krea, and what it costs",
      bullets: [
        "Krea is a wrapper over many models rather than a model itself. One login, one credit balance, everything in one place.",
        "You pay for that: Krea resells provider capacity, so roughly a cent direct becomes about five. At campaign volume it adds up fast.",
        "One team moving the same workload onto the Google and OpenAI APIs went from about €10,000 a quarter to €400. Worth pricing before scaling up.",
        "Switch from your personal to the team account, bottom-left, or you are burning your own credits.",
        "Krea makes you re-upload the original on every iteration — it holds no context, unlike Claude or ChatGPT. Generate in the European morning while the US sleeps and it is noticeably quicker.",
      ],
    },
    {
      heading: "Video",
      bullets: [
        "Video is much harder than stills: physics, movement, light and continuity all have to hold at once, so hallucinations rise with length.",
        "Work like a production — storyboard, mood board, then shot by shot. Not one prompt for the whole film.",
        "Three ways in: text-to-video, image-to-video, and start/end frame. Not every model supports the last one.",
        "Start/end frame interpolation is the standout. Hand it two frames and it fills the transition, which is genuinely hard to build by hand in After Effects.",
        "For the parks, cinemagraphs earn their keep: a subtle movement, a logo pulse, a character breathing. Short and contained is where these models are strong.",
        "The line-up: Seedance is the best all-rounder, Veo is strongest on dialogue and the only EU-approved one, Kling handles liquids and 3D physics, Sora is excellent and priced like it.",
        "Longer prompts and longer clips both raise the error rate. Generate many, select one. Stitch multi-part sequences in After Effects.",
      ],
    },
    {
      heading: "Where it goes wrong",
      bullets: [
        "Hold AI work to the same standard as live action. “AI slop” performs badly; well-made AI ads perform fine. The bar is the point.",
        "Keep the domain experts. Copywriters, designers and developers are what let you judge the output — build a system without them and you lose the ability to tell good from bad.",
        "Always iterate from the original, never from the last generation. Small edits accumulate and faces drift without anyone deciding they should.",
        "Use it for fantasy and concept work. Avoid it where the image has to read as a factually authentic photograph.",
        "Text inside generated images is still unreliable, and the legal position on real landmarks — the Eiffel Tower, the Atomium — is unresolved. Treat those like using someone else’s photo.",
        "Expect the last one percent to take longer than the first ninety-nine.",
      ],
    },
    {
      heading: "Claude, set up right",
      bullets: [
        "Use the desktop app rather than the browser — more of the integrations are available there.",
        "Leave the system prompt mostly empty. Add constraints only for a narrowly scoped account.",
        "Turn memory on so it stops needing the same context every time, and clean it out periodically or stale projects start bleeding into unrelated chats.",
        "Opus is the daily driver. Fable for genuinely hard thinking. Avoid reaching for the cheap models to save credits — you repeat yourself more and spend more overall.",
        "Chat handles files and mail. Cowork is the agentic mode: it drives a browser, runs scheduled work, and can watch a folder. Code builds tools.",
        "Connectors worth having: Outlook or Gmail for drafting (never auto-send), Asana for turning meeting notes into tickets, Figma for comments and visual review. The Adobe one is not useful yet.",
      ],
    },
    {
      heading: "Skills",
      bullets: [
        "A Skill is a briefing — context, principles, examples — that makes Claude behave like a colleague who knows how Plopsa works. It was the biggest single change this year.",
        "It is a layer around your documents, not a replacement for Drive or your PDFs.",
        "The framing that works: a competent new colleague just joined. What would you tell them in their first week to make them good at this?",
        "Record yourself talking the process through and transcribe it. Writing it down silently drops the nuances you know but never say out loud.",
        "Use /skill-creator to draft one, and add Anthropic’s degrees-of-freedom guidance so Claude knows when to be strict and when to think broadly.",
        "Put evals inside the Skill so it checks its own output — that is exactly how the prompting Skill catches a wrong attraction shape.",
        "Version them. Keep each release and let the changelog live inside the Skill. Activate with a slash and the name, and check the whole package loads rather than just the SKILL.md.",
      ],
    },
  ],
  nextSteps: [
    {
      owner: "The team",
      items: [
        "Test the three Skills before the next session and note what worked and what did not.",
        "Finish the Claude onboarding and put the Gen-AI prompting Skill through a real brief.",
        "Switch Krea to the team account so you are not spending personal credits.",
      ],
    },
    {
      owner: "Vince",
      items: [
        "Share the three Skills and this recap.",
        "Bring a Digital Asset Management demo on Supabase for the next session.",
        "Walk through the content calendar in Notion, and the UGC analysis pipeline in more depth.",
      ],
    },
    {
      owner: "To sort out",
      items: [
        "A Gemini API key via IT — it is the only model that can watch a video rather than just transcribe it, at roughly €0.01 per video.",
        "Supabase as the central, searchable asset database linked to Notion, around €20–30 a month.",
        "The legal position on real landmarks in generated campaign visuals.",
        "Whether an in-house image tool on the provider APIs is worth building, given the Krea markup.",
        "Asana and the shared mailbox into Claude, for ticket automation.",
      ],
    },
  ],
  footnote:
    "Copy or download this as Markdown and drop it into Claude to turn the next steps into a plan.",
};

const workshopFooter = {
  line: "Thoughtform · AI Capability Workshop · A speed layer on the creative process.",
  signature: "Scoped with the Plopsa marketing team · 30 July 2026.",
};

/* Route-local nav. The inherited `pageMeta.links` pointed at
   #diagnosis, #substrate-map, #skills and #substrate-gallery — every
   one of those sections is gone with the deep-dive trim, so the nav is
   restated here against the anchors this page actually renders.
   `pageMeta` is still imported for the header status pill. */
const creativeWorkshopNavLinks = [
  { id: "world-first-ai-atl", label: "Receipts", href: "#world-first-ai-atl" },
  { id: "plopsa-showcase", label: "Showcase", href: "#plopsa-showcase" },
  { id: "navigating-ai", label: "How AI works", href: "#navigating-ai" },
  { id: "which-tools", label: "Tools", href: "#which-tools" },
  { id: "semantic-examples", label: "Examples", href: "#semantic-examples" },
  { id: "krea-video", label: "Video", href: "#krea-video" },
  { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
  { id: "substrate-map", label: "The layer", href: "#substrate-map" },
  { id: "vision", label: "Flywheel", href: "#vision" },
  { id: "take-home-skills", label: "Skills", href: "#take-home-skills" },
] as const;

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
  title: "Thoughtform · Plopsa AI Workshop",
  description:
    "Plopsa AI workshop recap: the adoption frame, the tools that matter, and the first Skills scoped for the marketing team.",
  robots: { index: false, follow: false },
};

export default function PlopsaAiWorkshopPage() {
  return (
    <div
      /* `aiop-shell--plopsa` stacks the Plopsa palette ON TOP of
         tf-light — tf-light has to stay, it carries the section
         layout. `aiop-workshop-v1` is a layout hook, not a route
         name; it stays on every route in this lineage. */
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-shell--tf-light aiop-shell--plopsa aiop-stage aiop-workshop-v1`}
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
                  content={plopsaTldr}
                  fontClassName={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable}`}
                />
              </div>
            </div>

            <div className="aiop-hero__orbit-stage aiop-reveal">
              <FlywheelOrbit variant="compact" bloom />
            </div>
          </div>
        </section>

        {/* Keynote arc. The ATL film and Loop Studio's "95% of
            briefings done with AI" land the receipts; the Vulpia
            showcase follows as a bare full-bleed beat; the room is
            then turned toward how the tools actually work before the
            agent framing closes it.

            RoleProvider and its Suspense boundary used to wrap this
            block. Their only consumer was DiagnosisWithRoleFilter,
            which is gone with the rest of the deep-dive sections, so
            both were removed as matched pairs. Neither rendered DOM,
            so `main > section` (the 100dvh rule at
            creative-ai-workshop.css:390) is unaffected. */}
        <AboutVince />

        <WorldFirstAiAtlProof />
        <AiStudioBriefingsProof />

        <PlopsaShowcaseVideo />

        {/* Route-local cut of WhereFromHereInterstitial. That shared
            component hardcodes "Where do you go from there?" and is
            used by four routes, so the question is restated here
            rather than edited there. Markup and classes are identical
            to keynote-proof-sections.tsx:217-273. */}
        <section
          className="aiop-section aiop-engine-pattern cw-keynote-interstitial cw-keynote-interstitial--question aiop-engine-question"
          id="where-from-there"
          aria-labelledby="where-from-there-title"
          aria-label="But how does AI work?"
        >
          <div className="aiop-engine-pattern__bleed" aria-hidden="true">
            <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--a" />
            <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--b" />
            <span className="aiop-engine-pattern__grid" />
          </div>
          <div className="aiop-wrap cw-keynote-interstitial__inner aiop-reveal">
            <span className="cw-keynote-interstitial__eyebrow">
              First &mdash; the mechanics.
            </span>
            <p
              id="where-from-there-title"
              className="aiop-engine-question__q cw-keynote-interstitial__q"
            >
              But how does <em>AI work?</em>
            </p>
          </div>
        </section>

        <NavigatingAiProof />
        <ToolChoiceSection />
        <SemanticExamplesSection />

        <KreaModelsSection />
        <KreaVideoCraftSection />

        {/* Hinge between the two halves of the day. Above is generation
            — steer the model, judge the frame, run it again. Below is an
            intelligence you work with. Deliberately does not make the
            colleague argument itself; #tool-collab does that properly a
            few beats down, so this only opens the door.
            Same markup as the #where-from-there interstitial above. */}
        <section
          className="aiop-section aiop-engine-pattern cw-keynote-interstitial cw-keynote-interstitial--question aiop-engine-question"
          id="co-intelligence"
          aria-labelledby="co-intelligence-title"
          aria-label="What if it could think with you?"
        >
          <div className="aiop-engine-pattern__bleed" aria-hidden="true">
            <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--a" />
            <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--b" />
            <span className="aiop-engine-pattern__grid" />
          </div>
          <div className="aiop-wrap cw-keynote-interstitial__inner aiop-reveal">
            <span className="cw-keynote-interstitial__eyebrow">
              Krea makes pictures. Claude is different.
            </span>
            <p
              id="co-intelligence-title"
              className="aiop-engine-question__q cw-keynote-interstitial__q"
            >
              What if it could <em>think with you?</em>
            </p>
          </div>
        </section>

        {/* Keynote tail, rebuilt from /ai-keynote's order.

            RoleProvider is back because DiagnosisWithRoleFilter calls
            useRole() unconditionally — `hideRoleFilter` only drops the
            selector — and useRole throws outside the provider rather
            than falling back. RoleProvider reads useSearchParams, which
            Next requires inside a Suspense boundary on a statically
            prerendered route, so that comes with it.

            UseCasesProvider deliberately stays out. /ai-keynote wraps
            this block in it, but its only consumers repo-wide are
            substrate-gallery and use-case-tabs, neither of which is on
            this page — and it calls useRole itself, so it would add a
            second failure mode for nothing.

            Neither provider renders DOM, so `main > section` and the
            100dvh rule are unaffected. */}
        <Suspense fallback={null}>
          <RoleProvider>
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

            {/* EncodingInterstitial resolves its parallax partner with
                closest(".aiop-encoding-pair") and freezes the first
                sibling that is not itself. Without the wrapper it still
                renders, but silently drops to self-progress — and the
                wrapper is also on the 100dvh selector list, so a plain
                div would cost the full-viewport height too. */}
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
            <TakeHomeSkills />
            <SoftwareForFew />
            <Cases section={plopsaCasesSection} projects={plopsaCases} />
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

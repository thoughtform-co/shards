import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";
import Link from "next/link";

import { SkillsByTeam } from "@/components/claude-adoption/skills-by-team";
import { ClaudeSkillAnatomy } from "@/components/claude-workshop/claude-skill-anatomy";
import { AboutVince } from "@/components/creative-workshop/about-vince";
import { CreativeHud } from "@/components/creative-workshop/creative-hud";
import {
  AiStudioBriefingsProof,
  WorldFirstAiAtlProof,
} from "@/components/creative-workshop/keynote-proof-sections";
import { VideoSection } from "@/components/creative-workshop/video-section";
import { FlywheelOrbit } from "@/components/operator/flywheel-orbit";
import { ScrollReveal as OperatorScrollReveal } from "@/components/operator/reveal";
import { ScrollReveal as SharedScrollReveal } from "@/components/shared/reveal";
import { SiteFooter } from "@/components/shared/site-footer";
import { caSkillsByTeamSection } from "@/content/claude-adoption";
import { pageMeta } from "@/content/intelligence-layer";
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
 *   Krea (models, then video craft) → Loop's 42 Skills →
 *   the three Plopsa Skills as downloads → skill anatomy →
 *   Anthropic prompting video → footer
 *
 * The Skills tail was restored after the 30 July workshops, where the
 * room got as far as Claude and Skills and three real Skills came out
 * of it. It renders flat — see the note at the render site for why the
 * providers did not come back with it.
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
 * Note for the content pass: the copy below is still the Exalate
 * workshop's, with the client name swapped. Attendee names, the
 * 10 July 2026 date, and the Skills specifics need rewriting for
 * Plopsa.
 */

const workshopHero = {
  titleLines: ["Make AI sync", { em: "the way you work." }] as const,
  lede: [
    "On its own, AI is pretty good, and pretty good is generic. The judgment that makes work feel like Plopsa lives in five people’s heads. Encode it once, and everything you ship after today runs on it.",
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

/* Restored with the Skills beat. Spreads the shared Loop section —
   note `id: "skills"` comes from there, not from this override. */
const workshopSkillsSection = {
  ...caSkillsByTeamSection,
  ariaLabel: "Skills shipped at Loop Earplugs, shown as a workshop case study",
  titleAccentLine: "At Loop",
  sub: "A real rollout at Loop Earplugs. Forty-two Skills across every team — each one captures how that team handles a specific piece of work, so people and agents can build on what the company already knows.",
};

/* Hero modal: the whole workshop in one screen, drawn from both
   sessions' full transcripts (adoption + tools deep-dive). Principles
   and tool guidance only — no Loop internals. Attendees copy or
   download it as Markdown and take it into their own Claude. */
const plopsaTldr: WorkshopTldrContent = {
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
      owner: "Plopsa",
      items: [
        "Drop reference visuals in Slack: the tech and UI-style outputs you want, icons and logos included.",
        "Share the use-case and permutation page examples.",
        "Radan: share an Plopsa video plus the zipped After Effects package for analysis.",
        "Upload the brand book and fork the Gen-AI prompting skill into an Plopsa one, paired with a tone-of-voice skill.",
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
  signature: "Scoped with the Plopsa marketing team · 10 July 2026.",
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

        {/* Skills tail, restored from d0c92a0. These render as flat
            siblings on purpose: none of them consume useRole or
            useUseCase, so UseCasesProvider / RoleProvider / Suspense
            stay gone. UseCasesProvider itself calls useRole and would
            throw without RoleProvider, which in turn needs the
            Suspense boundary for useSearchParams. */}
        <SkillsByTeam
          section={workshopSkillsSection}
          showBreakdown={false}
          showRepo={false}
        />
        <TakeHomeSkills />
        <ClaudeSkillAnatomy />

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
      </main>

      <SiteFooter
        line={workshopFooter.line}
        signature={workshopFooter.signature}
      />
    </div>
  );
}

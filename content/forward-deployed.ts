/*
 * Forward-Deployed Pitch — content module.
 *
 * Drives `/forward-deployed`: a VC / scale-up exec leave-behind for a
 * forward-deployed AI consultancy co-founded by Vince Buyssens (AI
 * adoption, encoding, building) and Rob Weston (executive culture,
 * marketing transformation, change management).
 *
 * The page reuses the Thoughtform `/ai-keynote` chassis: same shell,
 * fonts, HUD, and section grammar. This file holds every piece of copy
 * the page surfaces, plus the prop overrides for the four reused
 * components (Signal, SubstrateMap, FlywheelOrbit, TeamShape) so the
 * page route stays composed of clean named imports.
 *
 * Voice rules (Thoughtform): no em dashes, no "not X, but Y" balanced
 * constructions, no forced rule-of-three, no filler authority words.
 * Declarative sentences only.
 */

import type { FlywheelOrbitSection } from "@/content/operator";

/* ─────────────────────────────────────────────────────────────────────
 * Page metadata + nav
 * ─────────────────────────────────────────────────────────────────── */

export const fdMeta = {
  brandLeft: "Thoughtform",
  brandSub: "Forward-Deployed AI",
  status: "Embedded in marketing",
  links: [
    { id: "signal", label: "Signal", href: "#signal" },
    { id: "spectrum", label: "Spectrum", href: "#spectrum" },
    { id: "layer", label: "The layer", href: "#substrate-map" },
    { id: "what-we-own", label: "What we own", href: "#what-we-own" },
    { id: "engage", label: "Engage", href: "#engage" },
    { id: "founders", label: "Founders", href: "#founders" },
  ],
  cta: { label: "Start a conversation", href: "#close" },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Hero — the value prop
 *
 * Two-line title plus a one-paragraph lede. Sized to land before the
 * scroll, so the reader leaves the first viewport knowing what we
 * sell and what success looks like.
 * ─────────────────────────────────────────────────────────────────── */

export const fdHero = {
  titleLines: [
    "AI adoption that compounds,",
    { em: "deployed inside your team." },
  ] as const,
  lede: [
    "Two operators embed inside marketing for a quarter. We ship the work that hits targets, encode how the team actually decides, and leave behind the intelligence layer every future AI tool will inherit from.",
  ] as const,
  actions: [
    {
      id: "engage",
      label: "Start a conversation",
      href: "#close",
      primary: true,
    },
    { id: "spectrum", label: "See the spectrum", href: "#spectrum" },
  ] as const,
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Signal — frontier labs validate the model
 *
 * Reuses the `<Signal />` component but overrides title, sub, and
 * cards so the four FDE proof points (Palantir origin, Stripe hires,
 * OpenAI $10B JV, Anthropic $1.5B JV) read as "the deployment shape
 * the frontier is buying."
 * ─────────────────────────────────────────────────────────────────── */

export const fdSignalSection = {
  id: "signal",
  eyebrow: "The signal",
  title: "The frontier is betting",
  titleEm: "billions",
  titleAfter: "on deployment, not the model.",
  sub: "Palantir invented the shape. Stripe is hiring for it. OpenAI and Anthropic just put eleven and a half billion behind it. Forward-deployed teams that embed, encode, and leave behind a running system.",
  masthead: {
    name: "The Deployment Beat",
    issue: "VOL. I \u00b7 NO. 1",
    track: "FRONTIER AI \u00b7 ENTERPRISE",
    date: "JUN 2026",
  },
  cards: [
    {
      id: "palantir" as const,
      thumb: {
        mark: "PALANTIR",
        tag: "Origin pattern \u00b7 Enterprise",
        corner: "2010s",
      },
      kicker: "Origin \u00b7 The FDE Pattern",
      headline: "The role every AI lab is now copying.",
      dek: [
        { text: "Palantir invented the" },
        { text: "Forward Deployed Engineer", strong: true },
        {
          text: ": embed inside customer ops, encode the workflow, leave behind a running system. The shape that defined enterprise software.",
        },
      ],
      byline: { source: "Palantir", date: "FDE program" },
      href: "https://www.palantir.com/careers/forward-deployed-engineer/",
    },
    {
      id: "stripe" as const,
      thumb: {
        mark: "/stripe",
        tag: "Job listing \u00b7 Marketing",
        corner: "2026",
      },
      kicker: "Hiring \u00b7 Forward Deployed Marketing",
      headline: "Stripe created a role that did not exist a year ago.",
      dek: [
        {
          text: "Multiple six figures to embed AI-natives inside marketing. Each assigned to",
        },
        { text: "20 marketers", strong: true },
        {
          text: "until the team is self-sufficient. AI as default, not occasional tool.",
        },
      ],
      byline: { source: "@andruyeung", date: "via X" },
      href: "https://www.wsj.com/articles/ai-startups-have-a-new-old-secret-weapon-forward-deployed-engineers-d18ee609",
    },
    {
      id: "openai" as const,
      thumb: {
        mark: "OpenAI",
        tag: "Joint Venture \u00b7 DeployCo",
        corner: "$10B",
      },
      kicker: "Press release \u00b7 May 2026",
      headline: "OpenAI launches the Deployment Company.",
      dek: [
        { text: "$10B joint venture", strong: true },
        {
          text: ", 19 partners. Acquired Tomoro for ~150 forward-deployed engineers on day one. Deployment is the new distribution.",
        },
      ],
      byline: { source: "openai.com", date: "May 2026" },
      href: "https://openai.com/index/openai-launches-the-deployment-company/",
    },
    {
      id: "anthropic" as const,
      thumb: {
        mark: "Anthropic",
        tag: "Joint Venture \u00b7 Claude Services",
        corner: "$1.5B",
      },
      kicker: "Bloomberg \u00b7 enterprise",
      headline: "Anthropic\u2019s $1.5B answer.",
      dek: [
        {
          text: "Blackstone, Hellman & Friedman, Goldman Sachs. Applied AI engineers deployed into portfolio companies to build custom Claude.",
        },
        { text: "Zero consulting firms in the cap table.", strong: true },
      ],
      byline: { source: "Bloomberg", date: "enterprise track" },
      href: "https://www.wsj.com/business/deals/anthropic-nears-1-5-billion-joint-venture-with-wall-street-firms-8f5448ee",
    },
  ],
  closing: {
    lead: "The frontier is paying for this shape.",
    accent: "We run it inside marketing today.",
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * Diagnosis — exec view of why AI programs stall
 *
 * Four cards in the same DiagnosisCard shape the keynote uses, but
 * rendered as a static section so the page does not need the role
 * filter machinery (and the RoleProvider / Suspense wrapper it
 * requires).
 * ─────────────────────────────────────────────────────────────────── */

export const fdDiagnosisHead = {
  eyebrow: "The diagnosis",
  title: "Most AI programs",
  titleEm: "do not compound.",
  sub: "Bigger marketing teams have run the pilots, bought the seats, and ratified the policies. The work still does not get faster, the output still reads generic, and the board still asks where the ROI went. Four reasons we see in every room.",
};

export type FdDiagnosisTone = "violet" | "gold" | "sage" | "slate";

export type FdDiagnosisCard = {
  id: string;
  tag: string;
  tone: FdDiagnosisTone;
  title: string;
  body: string;
};

export const fdDiagnosisCards: readonly FdDiagnosisCard[] = [
  {
    id: "pilots",
    tag: "01",
    tone: "violet",
    title: "Pilots stall before they ship.",
    body: "A successful experiment in one corner of the team never becomes a system. There is no one in the room who can take it from prompt to product, so the prototype gets archived and the slide deck moves on.",
  },
  {
    id: "generic",
    tag: "02",
    tone: "gold",
    title: "The output reads generic.",
    body: "Without the team\u2019s real standards in the loop, every AI tool defaults to the average of the internet. The brand loses its edge, the work loses its taste, and the team stops trusting the tool.",
  },
  {
    id: "tacit",
    tag: "03",
    tone: "sage",
    title: "The best judgment lives in three people\u2019s heads.",
    body: "How your strongest operators actually decide is rarely written down. New hires take a year to catch up. Agents start from zero every chat. The senior bench becomes the bottleneck.",
  },
  {
    id: "roi",
    tag: "04",
    tone: "slate",
    title: "ROI is impossible to defend.",
    body: "Seats are bought, usage is patchy, governance is unclear, and nobody can show the board what the spend bought. The CFO asks for the receipts and the function goes quiet.",
  },
];

export const fdDiagnosisGap = {
  eyebrow: "Shared cause",
  title:
    "All four come from the same gap: nothing holds how your team actually works in a form AI can use.",
};

/* ─────────────────────────────────────────────────────────────────────
 * Spectrum — the full motion
 *
 * Three bands rendered by `<SpectrumProof />`:
 *   01 Production  · ROAS-positive AI ads + the world-first AI ATL
 *   02 Adoption    · 5 -> 130+ users, stewards, self-sufficiency
 *   03 Automation  · four shipped tools + headless capability
 *
 * Answers the implicit VC question: "what do you actually do?"
 * Production proof carries the same data the keynote uses on
 * `/ai-keynote`; we keep the source data in this file so the
 * SpectrumProof component does not depend on keynote-internal copy.
 * ─────────────────────────────────────────────────────────────────── */

export const fdSpectrumHead = {
  eyebrow: "The full spectrum",
  title: "Production, adoption, automation.",
  titleEm: "One operating model across all three.",
  sub: "Most agencies sell one band. We run the full motion. The ads ship and pay back. The team learns to work this way without us in the room. The tools that come out of those workflows become the durable layer the next campaign inherits.",
};

export type FdSpectrumStat = { value: string; label: string };

export type FdStudioAd = {
  id: string;
  src: string;
  alt: string;
  sku: string;
  spend: string;
  orderValue: string;
  roas: string;
};

export const fdSpectrumStudioAds: readonly FdStudioAd[] = [
  {
    id: "exp-sb93-filter",
    src: "/keynote/studio-ads/exp-sb93-filter.jpg",
    alt: "Loop Switch ad: It's parenting, but just the good bits.",
    sku: "EXP-SB93TOF \u00b7 Filter \u00b7 Engage \u00b7 Mix",
    spend: "\u20AC 5.553,67",
    orderValue: "\u20AC 15.226,25",
    roas: "2,7",
  },
  {
    id: "exp-lm103-highlight",
    src: "/keynote/studio-ads/exp-lm103-highlight.jpg",
    alt: "Loop fashion ad: monochrome portrait with reticle on the Loop earplug.",
    sku: "EXP-LM103 \u00b7 Highlight \u00b7 Mix \u00b7 Fashion",
    spend: "\u20AC 1.328,79",
    orderValue: "\u20AC 7.082,45",
    roas: "5,33",
  },
  {
    id: "exp-sb92-ski",
    src: "/keynote/studio-ads/exp-sb92-ski.jpg",
    alt: "Loop Engage ad: stress-free ski trips, skier in helmet and goggles.",
    sku: "EXP-SB92BOF \u00b7 Ski \u00b7 Engage \u00b7 Mix",
    spend: "\u20AC 1.200,60",
    orderValue: "\u20AC 7.371,58",
    roas: "6,14",
  },
];

export type FdSpectrumBand = {
  id: "production" | "adoption" | "automation";
  tag: string;
  tone: "gold" | "sage" | "slate";
  title: string;
  body: string;
  stats: readonly FdSpectrumStat[];
  note: string;
};

export const fdSpectrumBands: readonly FdSpectrumBand[] = [
  {
    id: "production",
    tag: "01 \u00b7 Production",
    tone: "gold",
    title: "We ship work that pays back.",
    body: "AI-generated visuals, AI-assisted copy, real production. Concept to broadcast, the whole pipeline shaped by AI and finished by the team. The cuts above all paid out above the Loop performance benchmark.",
    stats: [
      { value: "95%", label: "of briefings done with AI" },
      { value: "2\u20133\u00d7", label: "faster than external agencies" },
      { value: "World-first", label: "AI above-the-line film" },
    ],
    note: "Loop Studio. AI in production since 2024.",
  },
  {
    id: "adoption",
    tag: "02 \u00b7 Adoption",
    tone: "sage",
    title: "Teams become self-sufficient.",
    body: "We embed alongside the team. Run the workshop. Activate stewards inside each function. Coach the cohort from awareness to daily use. After a quarter the team runs without us, and the next team starts further along than the last.",
    stats: [
      { value: "5 \u2192 130+", label: "users in 18 months" },
      { value: "20+", label: "workflows encoded as Skills" },
      { value: "Every team", label: "with an internal AI steward" },
    ],
    note: "Loop Earplugs. Company-wide rollout, every function.",
  },
  {
    id: "automation",
    tag: "03 \u00b7 Automation",
    tone: "slate",
    title: "The workflows become tools.",
    body: "When three teams hit the same friction we build the tool that removes it. Headless from day one, so the substrate underneath is shared and the next surface inherits the same judgment. Days of manual work collapse into minutes.",
    stats: [
      { value: "4", label: "production tools shipped" },
      { value: "Days \u2192 minutes", label: "on briefing synthesis" },
      { value: "Headless", label: "every tool, day one" },
    ],
    note: "Briefing intelligence, studio orchestration, image & video suite, UGC dubbing pipeline.",
  },
];

export const fdSpectrumFoot =
  "One team. One operator pair. All three bands in the same engagement. Each band feeds the next.";

/* ─────────────────────────────────────────────────────────────────────
 * SubstrateMap — what compounds underneath
 *
 * Reframes the intelligence-layer map for an exec audience. Sources
 * column points at any company\u2019s systems of record + ontology /
 * knowledge graph; substrate column names the judgment half; surfaces
 * column names the inheritance.
 * ─────────────────────────────────────────────────────────────────── */

export const fdSubstrateMap = {
  title: "The asset that compounds is",
  titleEm: "the intelligence layer.",
  body: "The data half sits in your warehouse and your ontology. The judgment half lives in three people\u2019s heads. Encode it once, version it, and every AI surface you ever buy inherits the same standards.",
  columns: {
    sources: {
      n: "01",
      kicker: "Trusted sources",
      title: "Where the work already lives.",
      caption:
        "Your systems of record and the ontology that sits above them. The data half. Owned by engineering and data, procurable from any vendor.",
      ontology: {
        kind: "Knowledge Graph",
        objects: ["Customer", "Brief", "Persona", "Campaign", "Asset"],
      },
      systems: {
        items: [
          "Warehouse",
          "CRM",
          "DAM",
          "Brand system",
          "Performance data",
          "Project board",
        ],
      },
    },
    substrate: {
      n: "02",
      kicker: "Encoded substrate",
      badge: "Judgment half",
      title: "How the team actually decides.",
      caption:
        "Rules, examples, voice, review gates. The judgment half. Not procurable. No vendor sells it. Owned internally, versioned, model-portable. This is the moat.",
      items: [
        { tag: "Rules", name: "How the team decides" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Voice", name: "How the brand sounds" },
        { tag: "Loops", name: "Who confirms what" },
      ],
      tags: ["Owned internally", "Versioned", "Survives any model change"],
    },
    surfaces: {
      n: "03",
      kicker: "Headless surfaces",
      badge: "Inherited everywhere",
      title: "Where the team calls the engine.",
      caption:
        "One substrate, many surfaces. Chat, docs, agents, internal apps. The next model wins something cheaper. The layer carries forward.",
      items: [
        { icon: "Cl", name: "Claude" },
        { icon: "G", name: "Gemini" },
        { icon: "\u25D0", name: "Web app" },
        { icon: "#", name: "Slack" },
        { icon: "{ }", name: "API" },
        { icon: "A", name: "Agents" },
      ],
    },
  },
  closing:
    "The data half + the judgment half compose. Without the second half, every prompt starts from zero and every tool reads generic.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * FlywheelOrbit override — generic Navigate / Encode / Build
 *
 * Drops the Loop-specific centerFiles from `visionSection` so the
 * orbit reads as an operating model rather than a Loop deliverable.
 * ─────────────────────────────────────────────────────────────────── */

export const fdFlywheelSection: FlywheelOrbitSection = {
  centerLabel: "Intelligence Layer",
  centerFiles: [
    "how-this-team-works.md",
    "brand-voice.skill",
    "review-gates.yaml",
  ],
  orbits: [
    { id: "navigate", label: "Navigate", ring: "outer" },
    { id: "encode", label: "Encode", ring: "middle" },
    { id: "build", label: "Build", ring: "inner" },
  ],
  satellite: { id: "headless", label: "Headless" },
};

export const fdVision = {
  title: "Adoption and automation are",
  titleEm: "the same flywheel.",
  caption:
    "Adoption is the loop run inside real work. Navigate with the team, encode what makes the work good, build the tool that removes the friction. Automation is what comes out the other side. Same motion, two readings.",
};

/* ─────────────────────────────────────────────────────────────────────
 * What we own — exec-grade scope
 *
 * Signals that the engagement is broader than "how to use AI." We own
 * the operating model, the governance work, the change management,
 * and the ROI story. Four cards in a 2x2 grid.
 * ─────────────────────────────────────────────────────────────────── */

export type FdScopeCard = {
  id: string;
  n: string;
  tone: "gold" | "sage" | "slate" | "violet";
  title: string;
  body: string;
};

export const fdScopeSection = {
  id: "what-we-own",
  eyebrow: "What we own",
  title: "Broader than",
  titleEm: "\u201chow to use AI.\u201d",
  sub: "We sit at the executive table. The four motions below are inside the engagement, not adjacent to it.",
  cards: [
    {
      id: "strategy",
      n: "01",
      tone: "gold" as const,
      title: "Strategy and operating model.",
      body: "The function shape, the swim lanes between technology, people, legal, and adoption, and the executive thesis that holds them together. We have run this at exec level inside a scale-up for 18 months.",
    },
    {
      id: "governance",
      n: "02",
      tone: "sage" as const,
      title: "Governance, legal, and platform.",
      body: "Vendor selection, enterprise contracts, SSO, DPA, AI policy, data classification, model routing, observability. We do the work and we sit in the room when legal and IT need a peer to align with.",
    },
    {
      id: "change",
      n: "03",
      tone: "slate" as const,
      title: "Change management at executive depth.",
      body: "Stakeholder mapping, exec communications, cohort programs, stewards inside every team, internal showcases. The cultural work that decides whether the platform actually changes how people show up to work.",
    },
    {
      id: "roi",
      n: "04",
      tone: "violet" as const,
      title: "ROI and measurement.",
      body: "Spend modelling, usage telemetry, per-team dollars, the receipts that defend the budget to the board. We expect to argue the ROI of the layer and we know how to instrument it.",
    },
  ] satisfies readonly FdScopeCard[],
};

/* ─────────────────────────────────────────────────────────────────────
 * Offer — three ways to engage (hamza.be IA)
 *
 * Numbered 01 / 02 / 03 block with a short qualifier "who this is
 * for" strip at the bottom. Pricing held on request because the
 * agency name is still being finalised; the structure is intentional.
 * ─────────────────────────────────────────────────────────────────── */

export type FdOfferCard = {
  n: string;
  title: string;
  body: string;
  bullets: readonly string[];
  meta: string;
  cta: string;
};

export const fdOfferSection = {
  id: "engage",
  eyebrow: "Three ways to engage",
  title: "Three formats.",
  titleEm: "One operating model.",
  sub: "Every engagement runs the same motion. Embed, encode, hand back. The format names the scope.",
  cards: [
    {
      n: "01",
      title: "Diagnostic.",
      body: "A two-week embedded read. We sit with the team, map the workflows, surface the bottlenecks, and write back what we found with a scoped recommendation for the program. No deck-first detours.",
      bullets: [
        "Two-week embed with one team",
        "Workflow map and bottleneck inventory",
        "Scoped program proposal",
      ],
      meta: "Two weeks \u00b7 one team \u00b7 fixed scope",
      cta: "Pricing on request",
    },
    {
      n: "02",
      title: "Pilot.",
      body: "One quarter, one function, one operator pair embedded. We run production work, encode the workflows that recur, and ship one tool the team will keep using after we leave. The most common starting point.",
      bullets: [
        "One quarter embedded inside the function",
        "Production work shipped under AI assist",
        "One Skill library + one shipped tool",
        "Stewards trained to extend the library themselves",
      ],
      meta: "One quarter \u00b7 one function \u00b7 two operators",
      cta: "Pricing on request",
    },
    {
      n: "03",
      title: "Programmatic.",
      body: "An always-on engagement. New functions onboarded each quarter, the operator pair rotating between them, the substrate and tool library compounding across the company. The shape Anthropic and OpenAI are now selling.",
      bullets: [
        "Multi-quarter program across functions",
        "Compounding substrate library, owned by the company",
        "Quarterly board update with the ROI receipts",
        "Path to an internal AI Adoption Lead inside the org",
      ],
      meta: "Multi-quarter \u00b7 cross-functional \u00b7 operator pair + stewards",
      cta: "Pricing on request",
    },
  ] satisfies readonly FdOfferCard[],
};

export const fdQualifierSection = {
  eyebrow: "Who this is for",
  title: "Scale-ups whose marketing function is ready to build.",
  cards: [
    {
      id: "fit",
      label: "Fit",
      body: "Marketing teams of 20 to 200 inside scale-ups or PE portfolios. Execs who want the layer their portfolio companies will inherit. CMOs who want their function to compound, not just spend.",
    },
    {
      id: "not-fit",
      label: "Not a fit",
      body: "Teams looking for a one-off training day, a vendor evaluation slide, or a list of tools to buy. We do not run pilots that end in a recommendation deck. Every engagement ships work.",
    },
  ] as const,
};

/* ─────────────────────────────────────────────────────────────────────
 * Founders — Vince + Rob
 *
 * Two-up structure consumed by `<AboutFounders />`. Bios are written
 * in the third person, declarative, exec-register. The pairing
 * argument lives in the section sub. Rob's portrait path is stable
 * so we can swap a higher-resolution headshot later without touching
 * this file.
 * ─────────────────────────────────────────────────────────────────── */

export type FdFounder = {
  id: "vince" | "rob";
  name: string;
  role: string;
  portrait: { src: string; alt: string };
  bio: readonly string[];
  credentials: readonly string[];
  owns: string;
};

export const fdFoundersSection = {
  id: "founders",
  eyebrow: "Founders",
  title: "Two operators.",
  titleEm: "One mandate.",
  sub: "Forward-deployed only works when the executive register and the AI register are inside the same engagement. We pair the two so neither half waits on translation.",
  founders: [
    {
      id: "rob",
      name: "Rob Weston",
      role: "Executive operator \u00b7 marketing transformation",
      portrait: {
        src: "/images/rob-weston.png",
        alt: "Rob Weston portrait",
      },
      bio: [
        "Scaling commercial and marketing leader for consumer brands across DTC, retail, and marketplaces. Most recently Chief Commercial and Marketing Officer at Loop Earplugs, joined in 2024 to diversify the business beyond Meta dependency and build a scalable omnichannel operating model.",
        "Before Loop, Chief Marketing Officer at Beauty Pie through Series A to B, Interim CMO at Asda leading the 2023 rebrand and the Christmas campaign, and Director of Omnichannel Growth Strategy at Samsung Electronics across the UK and Europe.",
      ],
      credentials: [
        "Loop Earplugs \u00b7 CCMO",
        "Beauty Pie \u00b7 CMO",
        "Asda \u00b7 Interim CMO",
        "Samsung Electronics \u00b7 Omnichannel Growth",
        "McKinsey & Company",
        "Stanford GSB",
      ],
      owns:
        "The executive register. Stakeholder alignment, change management, board reporting, and the marketing thesis the AI layer has to defend.",
    },
    {
      id: "vince",
      name: "Vince Buyssens",
      role: "Forward-deployed AI operator \u00b7 founder, Thoughtform",
      portrait: {
        src: "/images/vince-portrait.png",
        alt: "Vince Buyssens portrait",
      },
      bio: [
        "Forward-deployed creative technologist, embedded with marketing and creative teams since 2024. Founder of Thoughtform. Lead Creative Technologist at Loop Earplugs, where he scaled Claude from 5 to 130+ users, encoded 20+ workflows as reusable Skills, and shipped four production tools alongside the teams that use them.",
        "Before Loop, AI Captain at StoryMe leading the first hybrid AI-video production in Belgium, AI Technical and Creative Director at Tool of North America on the Under Armour x Anthony Joshua campaign, and founder of Starhaven, one of Belgium\u2019s first AI consultancies for the creative industry.",
      ],
      credentials: [
        "Loop Earplugs \u00b7 Lead Creative Technologist",
        "Thoughtform \u00b7 Founder",
        "StoryMe \u00b7 AI Captain",
        "Tool of North America \u00b7 AI Director",
        "Thomas More \u00b7 Cross-program AI Lead",
        "UBA \u00b7 ACC \u00b7 AI Charter co-author",
      ],
      owns:
        "The AI register. Embedded delivery, workflow encoding, governance with legal and IT, tool building, and the intelligence layer the work compounds into.",
    },
  ] satisfies readonly FdFounder[],
  pairing: {
    eyebrow: "Why two seats",
    headline:
      "The exec half opens the room. The AI half ships the work inside it.",
    body: "Most AI consultancy is one or the other. A strategy deck that never lands inside the team, or an engineering pair that never reaches the executive table. We pair the two roles so the same engagement covers the boardroom and the working session, with one shared mandate.",
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * TeamShape — the explicit ask, two founding seats
 *
 * Drives the `<TeamShape />` component. Modeled on the two-partner
 * pattern proven in `content/operator-pitch.ts`.
 * ─────────────────────────────────────────────────────────────────── */

export const fdTeamShapeSection = {
  id: "team-shape",
  eyebrow: "Engagement shape",
  title: "Two seats embedded.",
  titleEm: "One quarter to a function that runs without us.",
  body: [
    "Each engagement is two operators embedded inside one function for a quarter. The first month is Embed. The second is Encode. The third is Hand back. The substrate is the compounding asset; the workshop is the ignition.",
    "Stewards inside the team take it from there. The operator pair keeps moving between functions, carrying the patterns that scale, and the next function starts further along than the last.",
  ],
  composition: {
    headEyebrow: "Founding pair",
    headBadge: "Two seats",
    seats: [
      {
        id: "executive",
        role: "01 \u00b7 Executive Operator",
        codename: "Rob",
        codenameEm: " Weston",
        name: "Chief Commercial and Marketing Officer \u00b7 Loop Earplugs",
        team: "ex-Beauty Pie CMO \u00b7 ex-Asda Interim CMO \u00b7 McKinsey \u00b7 Stanford GSB",
        summary:
          "Opens the executive room. Owns the marketing thesis, stakeholder alignment, change management, and the board narrative the AI layer has to defend.",
        unlocks: [
          "Exec mandate from day one",
          "Marketing leadership treats the engagement as peer, not vendor",
          "Change management runs at the depth a scale-up needs",
        ],
      },
      {
        id: "ai",
        role: "02 \u00b7 AI Operator",
        codename: "Vince",
        codenameEm: " Buyssens",
        name: "Lead Creative Technologist \u00b7 Loop Earplugs \u00b7 Founder, Thoughtform",
        team: "5 to 130+ Claude users \u00b7 20+ encoded Skills \u00b7 4 shipped tools",
        summary:
          "Embeds inside the working session. Encodes how the team decides into a Skill library the team owns, ships the tools the substrate runs, and stays in the loop with legal and IT.",
        unlocks: [
          "Workflows encoded as substrate the team keeps",
          "Tools shipped, not slides",
          "Stewards trained to extend the library themselves",
        ],
      },
    ],
    cadenceLabel: "How the quarter runs",
    cadence: [
      {
        k: "Month 1",
        v: "Embed \u2014 inside the workflow with the team.",
      },
      {
        k: "Month 2",
        v: "Encode \u2014 Skills drafted in the room, ratified by review.",
      },
      {
        k: "Month 3",
        v: "Hand back \u2014 one tool ships, stewards take it from there.",
      },
    ],
    foot:
      "The function runs without us at the end of the quarter. The substrate keeps compounding inside the company.",
  },
  ladder: {
    label: "Three commitments",
    rungs: [
      {
        id: "diagnostic",
        tag: "01 \u00b7 Diagnostic",
        title: "Two weeks. One team. A scoped recommendation.",
        body: "The fastest way in. We sit with the team, map the workflows, surface the bottlenecks, and write back what we found. Pricing on request.",
        marker: "Start here",
      },
      {
        id: "pilot",
        tag: "02 \u00b7 Pilot",
        title: "One quarter. One function. One operator pair embedded.",
        body: "Production work, a Skill library, and one shipped tool. After the quarter the function runs without us and the next team starts further along. Pricing on request.",
      },
      {
        id: "programmatic",
        tag: "03 \u00b7 Programmatic",
        title: "Multi-quarter. Cross-functional. The compounding asset.",
        body: "New functions onboarded each quarter. Stewards inside every team. Substrate and tool library compounding across the company. Path to an internal AI Adoption Lead inside the org. Pricing on request.",
      },
    ],
    foot: "Each rung is one quarter ahead of the last. Diagnose first, then pilot, then compound.",
  },
  mandate: {
    label: "What the engagement produces",
    clauses: [
      "Production work shipped under AI assist, with the receipts.",
      "A Skill library the team owns, versioned in their own repo.",
      "One tool in production the team uses without us in the room.",
      "Stewards trained to extend the library after the quarter ends.",
      "Quarterly board update with usage, spend, and ROI receipts.",
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * Testimonial — outside-voice quote
 *
 * Quiet endorsement between the founders block and the close. The
 * Betty Jakobsen / Google quote is the public attribution we have
 * permission to surface and lands the exec register without
 * requiring a Loop quote pre-departure.
 * ─────────────────────────────────────────────────────────────────── */

export const fdTestimonial = {
  quote:
    "Vince pioneered how to integrate our AI products (Veo 3, Nano Banana 2) and non-Google AI into creative production, and how to upskill marketing teams to use them at scale.",
  name: "Betty Jakobsen",
  role: "Global & EMEA Export Marketing \u00b7 Google",
};

/* ─────────────────────────────────────────────────────────────────────
 * Close — the ask
 *
 * Short, declarative, two-action. Primary opens the email
 * conversation; secondary jumps back to the diagnostic format.
 * ─────────────────────────────────────────────────────────────────── */

export const fdClose = {
  id: "close",
  eyebrow: "The ask",
  title: "Pick the function. Pick the quarter.",
  titleEm: "We deploy.",
  body: "If a function in your portfolio is ready to compound, we can run a two-week diagnostic inside it before the quarter starts. If you want to talk through the shape first, send a note.",
  actions: [
    {
      id: "email",
      label: "vince@thoughtform.co",
      href: "mailto:vince@thoughtform.co?subject=Forward-Deployed AI",
      primary: true,
    },
    { id: "spectrum", label: "Walk the spectrum again", href: "#spectrum" },
  ],
};

/* ─────────────────────────────────────────────────────────────────────
 * Footer
 * ─────────────────────────────────────────────────────────────────── */

export const fdFooter = {
  line: "Thoughtform \u00b7 Forward-Deployed AI \u00b7 Embedded inside marketing.",
  signature: "Co-founded by Vince Buyssens and Rob Weston \u00b7 2026.",
};

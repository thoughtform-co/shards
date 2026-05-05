/*
 * AI Operator landing — content module.
 *
 * Public portfolio page for Vincent Buyssens. Maps the embedded
 * forward-deployed operator profile (workflows + tools + coaching +
 * pattern scaling) onto the proof already in the world: Loop's AI
 * mandate, the four shipped systems (Mímir, Heimdall, Vesper, Babylon),
 * the headless substrate move, and the HarvestFields case as a
 * standalone demonstration of strategy → engine → surface delivery.
 *
 * Page arc:
 *   01 Hero        — Name the role. State the motion.
 *   02 Motions     — Four practice surfaces of the embedded role.
 *   03 Loop proof  — Stat band + the embedded mandate in one paragraph.
 *   04 Systems     — Four production systems shipped from the inside.
 *   05 Headless    — Same engine, many surfaces. Skills teach. MCP runs.
 *   06 HarvestFields — Compressed case: brand speed = brand safety.
 *   07 Pattern     — Pre-AI receipts: same instincts, longer record.
 *   08 CTA         — Email, LinkedIn, CV.
 *
 * Voice: direct, punchy, warm. Strategy and building stay in the same
 * hands. No em-dashes. One thought per line when the thought matters.
 */

/* ─────────────────────────────────────────────────────────────────────
 * Top bar
 * ─────────────────────────────────────────────────────────────────── */

export const meta = {
  brandLeft: "Vincent Buyssens",
  brandSub: "AI Operator · Forward-Deployed · Antwerp",
  status: "Embedded at Loop Earplugs",
  links: [
    { id: "motions", label: "Motions", href: "#motions" },
    { id: "proof", label: "Loop proof", href: "#proof" },
    { id: "systems", label: "Systems", href: "#systems" },
    { id: "headless", label: "Headless", href: "#headless" },
    { id: "harvestfields", label: "Case", href: "#harvestfields" },
  ],
  cta: { label: "Get in touch", href: "#cta" },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Hero
 * ─────────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Forward-deployed AI operator",
  titleLines: [
    "I sit alongside",
    "marketing & creative teams",
    { em: "while AI rewires how they work." },
  ] as const,
  lede:
    "Embedded with the team. Building the tool inside the work. Coaching until they don't need me. Turning what works into a pattern other teams can pick up.",
  meta: [
    { k: "BASED", v: "Antwerp · CET" },
    { k: "ROLE", v: "Lead Creative Technologist" },
    { k: "EMBEDDED", v: "Loop Earplugs" },
    { k: "PRACTICE", v: "Thoughtform · Founder" },
  ],
  actions: [
    { id: "cv", label: "Read the CV", href: "#cta", primary: true },
    { id: "systems", label: "See the tools", href: "#systems" },
  ],
  panel: {
    label: "Operating motion",
    sub: "Navigate · Build · Coach · Scale",
    version: "Live · v0.4",
    layers: [
      { tag: "01", body: "Navigate", note: "Inside the workflow until the patterns surface." },
      { tag: "02", body: "Build", note: "The tool, agent, or skill. In the same hands. In real time." },
      { tag: "03", body: "Coach", note: "Until the cohort starts every task with an AI tool." },
      { tag: "04", body: "Scale", note: "What worked for one marketer becomes a pattern peers inherit." },
    ] as const,
    foot: "Substrate compounds. Models stay disposable.",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Motions — the four practice surfaces of the embedded role
 * ─────────────────────────────────────────────────────────────────── */

export const motionsSection = {
  eyebrow: "What the role actually is",
  title: "Four motions.",
  titleEm: "One operator, in the same hands.",
  lede:
    "The bottleneck isn't ideas about AI. It's the gap between strategy and shipping. I close that gap by staying inside the work, in real time, with the team that owns it.",
} as const;

export type Motion = {
  n: string;
  id: "navigate" | "build" | "coach" | "scale";
  name: string;
  headline: string;
  body: string;
  artifacts: string[];
};

export const motions: Motion[] = [
  {
    n: "01",
    id: "navigate",
    name: "Workflow Transformation",
    headline: "Find the workflow that, if transformed, changes everything else.",
    body:
      "Sit with one team inside their highest-leverage routine. Watch where judgment actually happens. Surface the parts that should be encoded, automated, or re-shaped. Field notes, not slide decks.",
    artifacts: [
      "Embedded discovery · 1–2 weeks per cohort",
      "Workflow brief · before / after",
      "Maturity model · per marketer",
    ],
  },
  {
    n: "02",
    id: "build",
    name: "Tool & Agent Building",
    headline: "Show a working proof on their own deliverable today.",
    body:
      "Build the tool, agent, automation, or Skill that transforms it. Custom to the team's deliverables and rhythm. In the same hands as the strategy. Most of the time, on their screen, while we work.",
    artifacts: [
      "Skills · MCP servers · Headless APIs",
      "Agents · Webhooks · Cron",
      "Custom internal apps · Cursor / Claude Code",
    ],
  },
  {
    n: "03",
    id: "coach",
    name: "Embedded Coaching",
    headline: "From awareness to first win to self-sufficient.",
    body:
      "Walk every marketer through the journey: aware of AI, first win, regular integration, full workflow transformation, self-sufficient. Activate AI Stewards as in-team multipliers so the cohort can extend the work without me.",
    artifacts: [
      "Workshops · curriculum · 1:1 coaching",
      "AI Steward activation",
      "Adoption tracking against a maturity model",
    ],
  },
  {
    n: "04",
    id: "scale",
    name: "Pattern Scaling",
    headline: "What worked for one marketer becomes a pattern peers inherit.",
    body:
      "Recognize patterns across the cohort and scale what works. A tool built for one marketer becomes a Skill for their peers. Document tools, playbooks, and transformation patterns so the next operator picks them up cleanly.",
    artifacts: [
      "Reusable Skills · documented",
      "Cross-team rollouts",
      "Operator playbooks for the next cohort",
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Loop proof — stat band + embedded mandate
 * ─────────────────────────────────────────────────────────────────── */

export const proofSection = {
  eyebrow: "Loop Earplugs · 2024 — Present",
  title: "Embedded with marketing & studio.",
  titleEm: "Company-wide AI mandate.",
  lede:
    "Operates as a peer alongside Technology, People, and Legal. Aligned directly with the executive team on AI strategy and governance. The work below isn't a pitch deck. It's the operating model the company runs on today.",
  stats: [
    { value: "130+", label: "Claude users · cohort grown from 5", tone: "gold" as const },
    { value: "90%", label: "Briefings start with an AI tool", tone: "sage" as const },
    { value: "2–3×", label: "Faster than external agencies, above ROAS", tone: "slate" as const },
    { value: "10+", label: "Reusable Skills · transferable across the cohort", tone: "gold" as const },
    { value: "4", label: "Production systems shipped to live use", tone: "sage" as const },
    { value: "30+", label: "Languages · UGC localization pipeline", tone: "slate" as const },
  ],
  pillars: [
    {
      id: "strategy",
      label: "Strategy",
      tone: "gold" as const,
      lead: "Designed the operating model the company runs on.",
      points: [
        "Pioneered AI adoption as one of Belgium's first ChatGPT Enterprise companies.",
        "Spearheaded the company-wide AI vision with the executive team.",
        "Authored a four-function operating model with clear swim lanes between strategy, governance, adoption, and building.",
      ],
    },
    {
      id: "adoption",
      label: "Adoption",
      tone: "sage" as const,
      lead: "Coached the full cohort journey from awareness to self-sufficiency.",
      points: [
        "Designed curriculum, ran workshops, aligned stakeholders, activated AI Stewards as in-team multipliers.",
        "Scaled Claude from 5 to 130+ users across legal, finance, analytics, marketing, and studio.",
        "Built 10+ reusable Skills encoding brand voice, paid social copy, marketplace, and keynote creation.",
      ],
    },
    {
      id: "production",
      label: "Production",
      tone: "slate" as const,
      lead: "Transformed marketing & studio into AI-first creative teams.",
      points: [
        "90% of briefings now involve AI; marketers start every task with an AI tool.",
        "Campaigns ship 2–3× faster than external agencies, consistently above ROAS benchmark.",
        "AI for generation. Human judgment for taste and brand.",
      ],
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Systems — four production systems shipped at Loop
 * ─────────────────────────────────────────────────────────────────── */

export const systemsSection = {
  eyebrow: "Built from the inside",
  title: "Four production systems.",
  titleEm: "Shipped, used daily, owned by the team.",
  lede:
    "Each one started inside a single team's bottleneck. Each one survived adoption. Three of them now expose their substrate headlessly so the same engine answers Claude, Cursor, Slack, the dashboard, and an in-tool button.",
} as const;

export type System = {
  id: string;
  name: string;
  nameEm?: string;
  role: string;
  team: string;
  body: string;
  bullets: string[];
  surfaces: string[];
  stack: string;
  tone: "gold" | "sage" | "slate" | "violet";
  status: string;
};

export const systems: System[] = [
  {
    id: "mimir",
    name: "Mí",
    nameEm: "mir",
    role: "Creative-strategy briefing engine",
    team: "Creative Strategy · Marketing",
    body:
      "Surfaces customer voice, ad performance, and competitive signals as composable building blocks. Drafts evidence-grounded briefs. Exposed headlessly via MCP — Claude, Cursor, Slack, and ChatGPT all stand on the same engine.",
    bullets: [
      "Knowledge graph over Reddit, Meta Ad Library, ad performance, prior briefings.",
      "Three-panel briefing composer + Gemini concept imagery.",
      "Skill-backed briefing strategy. Degrees of freedom per workflow step.",
      "MCP server with token allowlists, scopes, audit log, durable rate buckets.",
    ],
    surfaces: ["Web app", "MCP server", "REST", "Slack bot"],
    stack: "Next.js 16 · React 19 · Supabase + RLS · Anthropic Skills API · Gemini · MCP",
    tone: "gold",
    status: "Production",
  },
  {
    id: "heimdall",
    name: "Heim",
    nameEm: "dall",
    role: "Production bridge across the creative stack",
    team: "Studio · Marketing Ops",
    body:
      "The connective tissue between Monday, Figma, and Frontify. Webhook → Claude structured extraction → Figma briefing sync; ops kanban; iterator plugin for variants and format derivation; Frontify intake; document collections + RAG retrieval. Where strategy turns into pixels.",
    bullets: [
      "Monday GraphQL pipeline → structured briefings synced into Figma.",
      "Iterator Figma plugin: variants, format derivation, copy planning.",
      "Frontify integration · HiBob leave sync · admin hub.",
      "Showcase routes for client-facing project pages.",
    ],
    surfaces: ["Web app", "Figma plugin", "Iterator plugin", "GPT Actions API"],
    stack: "Next.js · Supabase · Vercel KV · Monday · Figma · Frontify · Meta · Anthropic",
    tone: "sage",
    status: "Production",
  },
  {
    id: "vesper",
    name: "Ves",
    nameEm: "per",
    role: "In-house generation workspace",
    team: "Studio · Creative",
    body:
      "Replaced the fragmented vendor stack Studio used to tab through. Multi-model image and video generation, prompt enhancement tied to the Loop product catalogue, image-to-video, real-time gallery. Same Claude Skill behind Claude.ai and behind the in-product enhance button.",
    bullets: [
      "6+ models unified behind one interface (Gemini, OpenAI, Replicate, Veo).",
      "Prompt enhancement Skill grounded in the product catalogue.",
      "Image-to-video, animate-still, PDF brief image extraction.",
      "Headless REST + MCP. Tokens scoped per credential, per model, per scope.",
    ],
    surfaces: ["Web app", "MCP server", "REST", "Claude / Cursor"],
    stack: "Next.js 14 · TanStack Query · Supabase + Prisma · Anthropic · Gemini · Replicate",
    tone: "slate",
    status: "Production",
  },
  {
    id: "babylon",
    name: "Baby",
    nameEm: "lon",
    role: "UGC localization pipeline",
    team: "Marketing · Localization",
    body:
      "30+ languages, one pipeline, one review step. Cross-checks transcription against on-screen captions through Gemini so verification is automatic and proofreaders only see the rows where cultural judgment actually matters.",
    bullets: [
      "Transcribe · translate · dub across 30+ markets.",
      "Auto-verification through Gemini cross-check.",
      "Single proofread surface, no Figma seat needed.",
      "Scales linearly with languages, not with reviewers.",
    ],
    surfaces: ["Web app", "Share-link review"],
    stack: "Next.js · Supabase · Anthropic · Gemini",
    tone: "violet",
    status: "Production",
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Headless — same engine, many surfaces
 * ─────────────────────────────────────────────────────────────────── */

export const headlessSection = {
  eyebrow: "Architecture, not a dashboard",
  title: "Skills teach.",
  titleEm: "MCP runs.",
  lede:
    "Salesforce announced Headless 360. Stripe shipped agentic infrastructure. The pattern is the same in every case: the interface gets demoted, the substrate gets promoted. Mímir and Vesper both moved that way at Loop. Build the engine, not the dashboard.",
  layers: [
    { tag: "RULES", name: "How the team decides", meta: "Versioned. Reviewable." },
    { tag: "EXAMPLES", name: "What good looks like", meta: "Past work, encoded." },
    { tag: "SOURCES", name: "Datasources it can read", meta: "Permissioned. Audited." },
    { tag: "LOOPS", name: "Who confirms what", meta: "Governance gates." },
  ],
  surfaces: [
    { id: "chat", icon: "⌘", name: "Chat", verb: "Claude, ChatGPT, Cursor" },
    { id: "api", icon: "{ }", name: "API", verb: "MCP · REST · internal apps" },
    { id: "agent", icon: "◐", name: "Agent", verb: "Scheduled · autonomous" },
    { id: "tool", icon: "⤴", name: "In-tool", verb: "Slack · Figma · Monday" },
  ],
  foot: [
    {
      id: "compounds",
      title: "Substrate compounds.",
      body:
        "Every workflow encoded adds to the same layer. Models change. Substrate carries forward.",
    },
    {
      id: "policy",
      title: "Policy lives in one verifier.",
      body:
        "Tokens hashed at rest. Per-tool, per-scope allowlists. Durable rate buckets. Audit log per call.",
    },
    {
      id: "engine",
      title: "Build the engine, not the dashboard.",
      body:
        "The dashboard becomes one face of many. The engine underneath is the asset every future surface inherits.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * HarvestFields — strategic case
 * ─────────────────────────────────────────────────────────────────── */

export const caseSection = {
  eyebrow: "Selected case · synthetic data, real architecture",
  title: "HarvestFields.",
  titleEm: "Brand speed and brand safety as one engine.",
  lede:
    "A working prototype I built to demonstrate the same operating model on a brand the size of Vandemoortele. Two workflows look like two problems: localisation needs speed, brand review needs control. The shared gap is the same: brand memory is unencoded.",
  pillars: [
    {
      n: "01",
      title: "Diagnosis",
      body:
        "Localise needs speed, Review needs control. Both lose against the same root cause: voice, claims, and audience register live in PDFs, lead heads, and Slack threads.",
    },
    {
      n: "02",
      title: "Reframe",
      body:
        "Don't automate the wording. Encode the judgment. The Skill is a governed operating contract: voice rules, claim registry, audience register, examples, eval cases.",
    },
    {
      n: "03",
      title: "Architecture",
      body:
        "One engine. Two postures. Six-check decision rail. Every run becomes an eval case. Headless from day one — Web, Copilot Studio, Power Automate, MCP, all calling the same protocol.",
    },
  ],
  cta: {
    label: "Read the full case",
    href: "/ai-operator/harvestfields",
  },
  endpoints: [
    { method: "POST", path: "/v1/localise", state: "ready" },
    { method: "POST", path: "/v1/brand-check", state: "ready" },
    { method: "POST", path: "/v1/eval/run", state: "demo" },
  ],
  metrics: [
    { v: "243", k: "Chunks · grounded substrate" },
    { v: "5", k: "Drift categories tracked" },
    { v: "4", k: "Audience registers" },
    { v: "4", k: "Target languages" },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Pattern — pre-AI receipts
 * ─────────────────────────────────────────────────────────────────── */

export const patternSection = {
  eyebrow: "Same instincts, longer record",
  title: "Reading momentum is older than AI.",
  titleEm: "Working with probabilities, knowing when to walk away.",
  lede:
    "I've been navigating the tides of digital change for over a decade. The skills that now shape AI work were practiced first inside communities, platforms, and classrooms.",
  cards: [
    {
      id: "pokemon",
      year: "2016",
      source: "Belgian Press",
      title: "Pokémon Go Belgium",
      body:
        "Belgium's first Pokémon Go consultant. Co-founded the country's hub. 1,000-person hunt on Antwerp's Kammenstraat. Then 16,000 with Antwerp Zoo. Advised Unizo on how local entrepreneurs could turn the wave into customers.",
    },
    {
      id: "expanse",
      year: "2018",
      source: "Newsweek · Forbes",
      title: "Save The Expanse",
      body:
        "SyFy cancelled the show in 2018. Stood up a Discord. Coordinated tweetstorms. Pushed the petition past 100k. Crowdfunded a banner plane to circle Amazon Studios. Amazon picked the show up. Three more seasons followed.",
    },
    {
      id: "thomas-more",
      year: "2019–2024",
      source: "Thomas More",
      title: "Lecturer · AI lead across four media programs",
      body:
        "Five years lecturing on AI, internet culture, storytelling, community management. AI strategy lead across four programs from 2022. COVID lockdowns moved classes online — World of Warcraft became the classroom, Instagram Live became the broadcast channel.",
    },
    {
      id: "storyme",
      year: "2023–2024",
      source: "StoryMe · Tool of NA",
      title: "AI Captain · early Generative AI direction",
      body:
        "Led production of \"Welcome to Latent Land,\" Belgium's first hybrid AI-video production. Directed AI on Under Armour's \"Forever Is Made Now\" campaign with Anthony Joshua. Co-drafted the AI Charter for the Belgian Union of Advertisers.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * CTA + footer
 * ─────────────────────────────────────────────────────────────────── */

export const ctaSection = {
  eyebrow: "If the shape of the role fits",
  title: "Let's talk.",
  titleEm: "Embedded with your team. Inside the work.",
  body:
    "I'm available for forward-deployed operator engagements: long embedded mandates like Loop, fixed accelerator programs, or focused encoding sprints alongside one team.",
  fine:
    "Antwerp / CET, comfortable working remotely with US-based teams. CV available on request.",
  primary: {
    label: "vince@thoughtform.co",
    href: "mailto:vince@thoughtform.co?subject=Forward-deployed%20AI%20operator",
  },
  secondary: { label: "linkedin.com/in/starhaven", href: "https://www.linkedin.com/in/starhaven/" },
} as const;

export const footer = {
  line: "Vincent Buyssens · Forward-Deployed AI Operator",
  signature: "Antwerp · Belgium",
  studio: "Practice: Thoughtform",
} as const;

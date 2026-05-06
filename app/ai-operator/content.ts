/*
 * AI Operator landing — content module.
 *
 * v4 narrative arc: an interactive expansion of the CV. The hero is
 * the personal profile (name eyebrow, thesis title, bio, portrait,
 * contact strip). Section 02 is a single centered Navigate / Encode /
 * Build flywheel that teases the in-depth Approach below. The rest
 * of the page reads top-to-bottom as one argument.
 *
 * Page arc:
 *   01 Hero          — CV profile: name, thesis, bio, portrait, contact.
 *   02 Vision        — Centered flywheel + one CTA into Approach.
 *   03 Approach      — Navigate / Encode / Build, each with an exec-level
 *                      visual and a Heimdall-style pop-out for detail.
 *   04 Cases         — Showcase grid of four production systems, each
 *                      with a modal walk-through.
 *   05 Headless      — Architecture, not a dashboard. The interstitial
 *                      that sets up the selected case.
 *   06 Selected case — HarvestFields, where everything comes together.
 *   07 CTA           — One ask. Smallest commitment that starts work.
 *
 * Voice: direct, punchy, warm. Strategy and building stay in the same
 * hands. One thought per line when the thought matters.
 */

/* ─────────────────────────────────────────────────────────────────────
 * Top bar
 * ─────────────────────────────────────────────────────────────────── */

export const meta = {
  brandLeft: "Vincent Buyssens",
  brandSub: "AI Operator · Forward-Deployed · Antwerp",
  status: "Embedded engagements available",
  links: [
    { id: "vision", label: "Vision", href: "#vision" },
    { id: "approach", label: "Approach", href: "#approach" },
    { id: "cases", label: "Cases", href: "#cases" },
    { id: "headless", label: "Headless", href: "#headless" },
    { id: "harvestfields", label: "Selected case", href: "#harvestfields" },
  ],
  cta: { label: "Get in touch", href: "#cta" },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Hero — CV profile
 *
 * v4: the page is an interactive expansion of the CV. The hero opens
 * with the operator's name as the eyebrow, the working thesis as the
 * title, the bio as the lede, and a square portrait on the right.
 * The meta strip carries the four contact lines from the CV instead
 * of role/practice metadata.
 * ─────────────────────────────────────────────────────────────────── */

export type HeroMetaItem = {
  k: string;
  v: string;
  href?: string;
  external?: boolean;
};

export const hero = {
  eyebrow: "Vincent Buyssens",
  titleLines: [
    "AI capability,",
    { em: "built inside the work." },
  ] as const,
  lede: [
    "The relationship between human intelligence and AI is the work of our generation.",
    "As an embedded Creative Technologist at Loop Earplugs, I helped marketing teams navigate AI inside their work, encode what makes it good, and build the capability on top of it.",
  ] as const,
  ledeStrong:
    "Now, I want to help Stripe build the economic layer for the age of co-intelligence.",
  meta: [
    {
      k: "EMAIL",
      v: "vince@thoughtform.co",
      href: "mailto:vince@thoughtform.co?subject=Forward-deployed%20AI%20operator",
    },
    { k: "PHONE", v: "+32 471 09 42 21" },
    {
      k: "LINKEDIN",
      v: "linkedin.com/in/starhaven",
      href: "https://www.linkedin.com/in/starhaven/",
      external: true,
    },
    { k: "LOCATION", v: "Antwerp, Belgium" },
  ] as HeroMetaItem[],
  actions: [
    { id: "vision", label: "Explore vision", href: "#vision", primary: true },
    { id: "cases", label: "See the cases", href: "#cases" },
  ],
  portrait: {
    src: "/images/vince.png",
    alt: "Vincent Buyssens at his desk in Antwerp, working with Claude on a MacBook.",
    tag: "Antwerp · CET",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Vision — flywheel teaser
 *
 * A minimal second screen. Just the centered Navigate / Encode / Build
 * orbit with a Substrate core, plus one short CTA pushing the visitor
 * into the in-depth Approach section below.
 * ─────────────────────────────────────────────────────────────────── */

export const visionSection = {
  title: "Adoption & Automation",
  titleEm: "are the same flywheel.",
  centerLabel: "SUBSTRATE",
  centerFiles: [
    "how-teams-work.md",
    "stripe-mkt-strategy.skill",
    "weekly-standup-transcript.txt",
  ],
  satelliteLabel: "Headless",
  orbits: [
    { id: "navigate", label: "Navigate", position: "top" },
    { id: "encode", label: "Encode", position: "bottom-right" },
    { id: "build", label: "Build", position: "bottom-left" },
  ] as const,
  caption:
    "Most companies run adoption and automation as two tracks. One teaches people, the other builds tools. AI makes them one loop. The teaching produces the substrate the tools run on.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Approach — Navigate, Encode, Build (the flywheel, explained)
 *
 * Three self-contained sections. Each one pairs a copy column with an
 * executive-level visual, plus a Heimdall-style pop-out card that goes
 * one level deeper. The visuals draw inspiration from the Loop AI
 * adoption rollout (Navigate), the Aether substrate card (Encode),
 * and the headless engine concept (Build).
 * ─────────────────────────────────────────────────────────────────── */

export const approachSection = {
  title: "The AI flywheel",
  titleEm: "at Loop",
  caption:
    "Running AI Adoption at Loop since 2023. Moved from AI Team to Marketing to transform everything from Studio work to Performance from within.",
  close:
    "The same loop ran on Vesper, Heimdall, Mímir, Babylon, and the company-wide Claude rollout at Loop.",
} as const;

export type ApproachTone = "violet" | "gold" | "sage";

export type RolloutVisual = {
  kind: "rollout";
  title: string;
  sub: string;
  stages: { tag: string; label: string }[];
  surfaces: { tone: "violet" | "gold" | "sage" | "slate"; name: string }[];
  meta: { k: string; v: string };
};

export type SubstrateVisual = {
  kind: "substrate";
  title: string;
  sub: string;
  layers: { tag: string; name: string; meta: string }[];
  inputs: {
    initial: string;
    tone: "violet" | "gold" | "sage" | "slate" | "ink";
    label: string;
  }[];
  foot: string;
};

export type EngineVisual = {
  kind: "engine";
  title: string;
  sub: string;
  surfaces: { icon: string; name: string; verb: string }[];
  meta: { k: string; v: string };
};

export type ApproachVisual = RolloutVisual | SubstrateVisual | EngineVisual;

export type ApproachModal = {
  eyebrow: string;
  title: string;
  titleEm: string;
  lede: string;
  meta: { k: string; v: string }[];
  sections: { heading: string; bullets: string[] }[];
  signal: string;
};

export type ApproachStep = {
  id: "navigate" | "encode" | "build";
  label: "Navigate" | "Encode" | "Build";
  tone: ApproachTone;
  headline: string;
  body: string;
  signal: { k: string; v: string };
  visual: ApproachVisual;
  modal: ApproachModal;
};

export const approachSteps: ApproachStep[] = [
  {
    id: "navigate",
    label: "Navigate",
    tone: "violet",
    headline: "Inside the workflow until the patterns surface.",
    body:
      "AI sits between a tool and a collaborator. Deterministic enough to automate, interpretive enough to think with. The skill is knowing which mode the task needs. That's what navigation teaches.",
    signal: { k: "Outcome", v: "AI intuition and a workflow brief per team." },
    visual: {
      kind: "rollout",
      title: "Cohort journey",
      sub: "Awareness → Self-sufficient",
      stages: [
        { tag: "01", label: "Aware" },
        { tag: "02", label: "First win" },
        { tag: "03", label: "Regular use" },
        { tag: "04", label: "Transformed" },
        { tag: "05", label: "Self-sufficient" },
      ],
      surfaces: [
        { tone: "violet", name: "Workshops" },
        { tone: "gold", name: "Quick-starts" },
        { tone: "sage", name: "AI Stewards" },
        { tone: "slate", name: "Showcases" },
      ],
      meta: { k: "Pattern", v: "Pull · push · structure" },
    },
    modal: {
      eyebrow: "01 · Navigate",
      title: "What navigation looks like",
      titleEm: "across an actual cohort.",
      lede:
        "AI is trained on us but is not like us. AI intuition is learning how to Navigate this strange new intelligence and working out how to ask for what you want. Once teams understand they're working with a smart, albeit alien, colleague that just needs context, you can start to Encode their expertise into substrates you can Build agents on.",
      meta: [
        { k: "DURATION", v: "Continuous · 1–2 weeks per team" },
        { k: "ARTIFACT", v: "Workflow brief · maturity model" },
        { k: "OWNER", v: "Operator + cohort lead" },
      ],
      sections: [
        {
          heading: "How the work runs",
          bullets: [
            "Embedded discovery alongside one team for 1–2 weeks per cohort.",
            "Workshops and quick-start sessions tuned to the team's actual deliverables.",
            "AI Stewards activated as in-team multipliers so the cohort can extend the work without me.",
            "Bi-weekly showcases turn one team's wins into another team's signal.",
            "Maturity model per marketer: aware → first win → regular → transformed → self-sufficient.",
          ],
        },
        {
          heading: "What it produced at Loop",
          bullets: [
            "Claude rollout from 5 to 130+ users across legal, finance, analytics, marketing, and studio.",
            "90% of briefings now start with an AI tool.",
            "Bottom-up adoption met top-down structure: a peer-coordination model with Tech, People, Legal.",
            "Junior PM and Full-Stack Engineer hires planned to remove single-person dependency.",
          ],
        },
      ],
      signal: "Adoption isn't a campaign. It's a cohort journey with infrastructure behind every step.",
    },
  },
  {
    id: "encode",
    label: "Encode",
    tone: "gold",
    headline: "Turn the way the team works into substrate the system can hold.",
    body:
      "Field notes become legible substrate. Voice rules, examples, sources, loops. The operator drafts; the team ratifies; engineering versions. Plain text the team owns. Reviewable like code. The asset that survives the next model and the next interface.",
    signal: { k: "Outcome", v: "A Skill the team owns. Versioned. Headless." },
    visual: {
      kind: "substrate",
      title: "Aether layer",
      sub: "Encoded substrate · headless",
      layers: [
        { tag: "Rules", name: "how the team decides", meta: "12 entries" },
        { tag: "Examples", name: "what good looks like", meta: "38 artifacts" },
        { tag: "Sources", name: "the data it can read", meta: "3 connectors" },
        { tag: "Loops", name: "who confirms it", meta: "2 gates" },
      ],
      inputs: [
        { initial: "B", tone: "ink", label: "Brand book" },
        { initial: "L", tone: "violet", label: "Lead's judgment" },
        { initial: "P", tone: "sage", label: "Past work" },
        { initial: "R", tone: "gold", label: "Regs & policy" },
        { initial: "F", tone: "slate", label: "Review feedback" },
      ],
      foot: "Connects to your data — doesn't replace it.",
    },
    modal: {
      eyebrow: "02 · Encode",
      title: "What encoding looks like",
      titleEm: "as substrate the team owns.",
      lede:
        "Skills capture brand voice, claim registries, audience registers, decision rules. Each Skill is plain text the team can read and reviewable like code. Drafts by the operator, ratified by the team, versioned in Git. Headless from day one — Claude today, Gemini tomorrow, MCP everywhere.",
      meta: [
        { k: "CADENCE", v: "Drafted weekly · ratified by review" },
        { k: "ARTIFACT", v: "Skill bundle (Markdown + examples)" },
        { k: "OWNER", v: "Cohort + operator" },
      ],
      sections: [
        {
          heading: "Anatomy of a Skill",
          bullets: [
            "Rules — plain conditions and locked policies the agent enforces.",
            "Examples — saved past work the Skill should imitate.",
            "Sources — briefs, boards, registries, calendars, linked safely.",
            "Loops — who reviews, where escalations go, what gets logged.",
          ],
        },
        {
          heading: "Encoded at Loop",
          bullets: [
            "10+ reusable Skills shipped: tone of voice, paid social copy, marketplace, CRM, GenAI prompting, presentations, localization, naming, employer branding, constellations.",
            "Skills span Studio, Performance, CRM, E-commerce, People, Legal, and UGC.",
            "Each Skill exposed via MCP so any model-powered surface can call it.",
            "Models change. Tools change. The Skill carries forward.",
          ],
        },
      ],
      signal: "Encoding is the hinge. Without it, every prompt starts from zero.",
    },
  },
  {
    id: "build",
    label: "Build",
    tone: "sage",
    headline: "Show a working proof on their own deliverable today.",
    body:
      "Build the tool, agent, automation, or Skill that transforms the workflow. In the same hands as the strategy. Most often on their screen, while we work. Vibe-coded inside days; hardened to production over weeks; exposed headlessly so every surface inherits the same engine.",
    signal: { k: "Outcome", v: "A thin running surface the team uses daily." },
    visual: {
      kind: "engine",
      title: "Same engine. Many surfaces.",
      sub: "Build the engine, not the dashboard.",
      surfaces: [
        { icon: "⌘", name: "Chat", verb: "Claude · Cursor" },
        { icon: "{ }", name: "API", verb: "MCP · REST" },
        { icon: "◐", name: "Agent", verb: "Scheduled · autonomous" },
        { icon: "⤴", name: "In-tool", verb: "Slack · Figma · Monday" },
      ],
      meta: { k: "Posture", v: "Engine first · interface last" },
    },
    modal: {
      eyebrow: "03 · Build",
      title: "What building looks like",
      titleEm: "from prototype to production.",
      lede:
        "Vibe-coded prototypes within days. Hardened to production over weeks by an engineer paired with the operator. Live next to the work in Slack, Figma, Monday, custom UIs. Same engine exposed via REST, MCP, scheduled agents, in-tool buttons. The interface is one face of many.",
      meta: [
        { k: "TEMPO", v: "Days to demo · weeks to harden" },
        { k: "SHAPE", v: "Engine + surfaces · headless first" },
        { k: "STACK", v: "Next.js · Supabase · Anthropic · MCP" },
      ],
      sections: [
        {
          heading: "How it ships",
          bullets: [
            "Day-one prototype on the team's actual deliverable. No deck-first detours.",
            "Engineer hardens what the operator vibe-codes; loop keeps turning while it ships.",
            "Headless API + MCP server from day one so the engine isn't tied to one UI.",
            "Token allowlists, scopes, audit log, durable rate buckets — policy lives in one verifier.",
          ],
        },
        {
          heading: "What it produced at Loop",
          bullets: [
            "Four production systems shipped: Mímir, Heimdall, Vesper, Babylon.",
            "Two of them, Mímir and Vesper, now expose their substrate headlessly via MCP.",
            "Same engines answer Claude, Cursor, Slack, dashboards, and in-tool buttons.",
            "Each system started inside a single team's bottleneck. Each one survived adoption.",
          ],
        },
      ],
      signal: "The dashboard is one face of many. The engine underneath is the asset.",
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Cases — Heimdall-style showcase grid
 *
 * Four production systems, each its own row. The grid mirrors the
 * Heimdall showcase pattern: a left rail with name, status, summary,
 * and capabilities; an accented frame on the right with capability
 * highlights; a "View detail" CTA that opens the modal.
 * ─────────────────────────────────────────────────────────────────── */

export const casesSection = {
  eyebrow: "Cases · in production",
  title: "Four engines.",
  titleEm: "Built from the inside, used daily.",
  lede:
    "Each one started inside a single team's bottleneck. Each one survived adoption. Two of them now expose their substrate headlessly so the same engine answers Claude, Cursor, Slack, the dashboard, and an in-tool button.",
  legend: [
    {
      mode: "Compress" as const,
      def: "Collapse fragmented steps into one continuous flow.",
    },
    {
      mode: "Repair" as const,
      def: "Fix the gaps between tools the team must keep using.",
    },
    {
      mode: "Invent" as const,
      def: "Build a workflow that didn't exist before.",
    },
  ],
} as const;

export type CaseTone = "gold" | "sage" | "slate" | "violet";
export type WorkflowMode = "Repair" | "Compress" | "Invent";

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaseProject = {
  id: string;
  num: string;
  name: string;
  nameEm?: string;
  tagline: string;
  subline?: string;
  team: string;
  status: "Production" | "WIP";
  year: string;
  oneLiner: string;
  tone: CaseTone;
  workflowMode: WorkflowMode;
  workflowBefore: string;
  workflowAfter: string;
  capabilities: { k: string; v: string }[];
  metrics: { k: string; v: string }[];
  surfaces: string[];
  stack: string[];
  companyLeverage: string;
  image: string;
  screenshots: ProjectScreenshot[];
};

export const cases: CaseProject[] = [
  {
    id: "mimir",
    num: "01",
    name: "Mí",
    nameEm: "mir",
    tagline: "Brand Intelligence",
    subline: "Loop's own knowledge, structured.",
    team: "Creative Strategy · Marketing",
    status: "Production",
    year: "2025",
    oneLiner:
      "Customer voice, ad performance, competitive signals, and prior briefings as composable building blocks. Drafts evidence-grounded briefs. Same engine in Claude, Cursor, Slack, ChatGPT.",
    tone: "gold",
    workflowMode: "Compress",
    workflowBefore:
      "Creative Strategy assembled briefs from memory across Reddit, Meta Ad Library, ad performance spreadsheets, and review notes. Every cycle started from scratch.",
    workflowAfter:
      "One briefing composer pulls Reddit, Meta Ad Library, ad performance, and prior briefings into a single evidence view with a skill-backed strategy step.",
    capabilities: [
      { k: "Knowledge graph", v: "Reddit, Meta Ad Library, ad performance, prior briefings as one substrate." },
      { k: "Briefing composer", v: "Three-panel surface, Gemini concept imagery, reviewable drafts." },
      { k: "Headless MCP server", v: "Token allowlists, scopes, audit log, durable rate buckets." },
      { k: "Skill-backed strategy", v: "Degrees of freedom locked or free per workflow step." },
    ],
    metrics: [
      { k: "Sources unified", v: "4+" },
      { k: "Surfaces inheriting", v: "5" },
    ],
    surfaces: ["Web app", "MCP server", "REST", "Slack bot"],
    stack: ["Next.js 16", "React 19", "Supabase + RLS", "Anthropic Skills", "Gemini", "MCP"],
    companyLeverage:
      "Creative Strategy uses it for briefings. Product uses it for persona development. Anyone needing to think with Loop's own data inherits the same intelligence layer.",
    image: "/cases/assets/mimir.png",
    screenshots: [
      { src: "/cases/screenshots/mimir/Mimir-Feed.png", alt: "Mímir: intelligence feed" },
      { src: "/cases/screenshots/mimir/Mimir-Briefing Flow.png", alt: "Mímir: briefing composer" },
      { src: "/cases/screenshots/mimir/Mimir_Briefing May.png", alt: "Mímir: May briefing output" },
      { src: "/cases/screenshots/mimir/Mimir-Loop Ads.png", alt: "Mímir: Loop Ads performance" },
      { src: "/cases/screenshots/mimir/Mimir-Loop Ads-Closeup.png", alt: "Mímir: ad detail close-up" },
      { src: "/cases/screenshots/mimir/MImir-Customer Review.png", alt: "Mímir: customer review insights" },
      { src: "/cases/screenshots/mimir/Mimir-Personas.png", alt: "Mímir: audience personas" },
    ],
  },
  {
    id: "vesper",
    num: "02",
    name: "Ves",
    nameEm: "per",
    tagline: "AI Image & Video Generation",
    subline: "Replaced Krea. Built in-house.",
    team: "Studio · Creative",
    status: "Production",
    year: "2025",
    oneLiner:
      "Replaced the fragmented vendor stack Studio used to tab through. Multi-model image and video generation, prompt enhancement tied to the Loop product catalogue, image-to-video, real-time gallery.",
    tone: "slate",
    workflowMode: "Compress",
    workflowBefore:
      "Designers tabbed between Krea for generation, Claude for prompting, and separate tabs for image-to-video. Costs were opaque. Model choice overwhelmed the team.",
    workflowAfter:
      "One canvas runs prompt enhancement, multi-model generation, and image-to-video on only the models Studio actually uses.",
    capabilities: [
      { k: "Prompt enhancement", v: "Claude refines visual prompts using the Loop product catalogue." },
      { k: "Multi-model generation", v: "Gemini Flash Image, Veo 3.1, Seedream, Kling under one tab." },
      { k: "Image-to-video", v: "Animate-still without leaving the canvas. Small fix, big flow." },
      { k: "Headless REST + MCP", v: "Same Skill behind Claude.ai and the in-product enhance button." },
    ],
    metrics: [
      { k: "Models unified", v: "6+" },
      { k: "Krea margin", v: "0%" },
    ],
    surfaces: ["Web app", "MCP server", "REST", "Claude / Cursor"],
    stack: ["Next.js 14", "TanStack Query", "Supabase + Prisma", "Anthropic", "Gemini", "Replicate", "Kling"],
    companyLeverage:
      "Any team generating visual content (Product, E-commerce, CRM) can use Vesper without depending on Studio. Cost transparency gives leadership real spend-per-asset data.",
    image: "/cases/assets/vesper.png",
    screenshots: [
      { src: "/cases/screenshots/vesper/Vesper-Home.png", alt: "Vesper: home dashboard" },
      { src: "/cases/screenshots/vesper/Vesper-Prompt.png", alt: "Vesper: prompt enhancement" },
      { src: "/cases/screenshots/vesper/Vesper-Brainstorm.png", alt: "Vesper: brainstorm mode" },
      { src: "/cases/screenshots/vesper/Vesper-Video.png", alt: "Vesper: video generation" },
      { src: "/cases/screenshots/vesper/Vesper-Img-2-Video.png", alt: "Vesper: image-to-video" },
    ],
  },
  {
    id: "babylon",
    num: "03",
    name: "Baby",
    nameEm: "lon",
    tagline: "UGC Localization",
    subline: "30+ markets, one review step.",
    team: "Marketing · Localization",
    status: "Production",
    year: "2025",
    oneLiner:
      "30+ languages, one pipeline, one review step. Cross-checks transcription against on-screen captions through Gemini so verification is automatic and proofreaders only see the rows where cultural judgment counts.",
    tone: "violet",
    workflowMode: "Invent",
    workflowBefore:
      "UGC localization bounced between agencies, transcripts, and Figma copy-paste. Each market handled separately. Quality scaled with reviewer headcount.",
    workflowAfter:
      "Transcribe, translate, dub, and Gemini-verify in one pipeline so reviewers only judge the rows where culture matters.",
    capabilities: [
      { k: "30+ markets", v: "Linear scale-out across languages, not reviewers." },
      { k: "Auto-verification", v: "Gemini cross-check against on-screen captions." },
      { k: "Single proofread surface", v: "Share-link review, no Figma seat needed." },
      { k: "Custom review module", v: "Cultural judgment surfaced where it actually matters." },
    ],
    metrics: [
      { k: "Markets", v: "30+" },
      { k: "Review steps", v: "1" },
    ],
    surfaces: ["Web app", "Share-link review"],
    stack: ["Next.js", "Supabase", "Anthropic", "Gemini"],
    companyLeverage:
      "UGC scales linearly with languages, not with reviewers. The same pipeline pattern is reusable for any voice-over heavy content.",
    image: "/cases/assets/babylon.png",
    screenshots: [
      { src: "/cases/screenshots/babylon/Babylon-Overview.png", alt: "Babylon: pipeline overview" },
      { src: "/cases/screenshots/babylon/Babylon-Dubbing Example.png", alt: "Babylon: dubbing example" },
      { src: "/cases/screenshots/babylon/Babylon-Analytics.png", alt: "Babylon: analytics dashboard" },
    ],
  },
  {
    id: "heimdall",
    num: "04",
    name: "Heim",
    nameEm: "dall",
    tagline: "Workflow Orchestration",
    subline: "Where strategy turns into pixels.",
    team: "Studio · Marketing Ops",
    status: "Production",
    year: "2025",
    oneLiner:
      "The connective tissue between Monday, Figma, Frontify, Meta. Webhook-driven Claude extraction. Briefings flow from board to plugin to file. Where strategy turns into pixels.",
    tone: "sage",
    workflowMode: "Repair",
    workflowBefore:
      "Briefings lived in Monday. Designers worked in Figma. Assets shipped through Frontify. Each handoff was manual copy-paste. Pixels didn't trace back to briefs.",
    workflowAfter:
      "One webhook chain moves briefings from Monday through Claude into Figma without a single manual copy-paste.",
    capabilities: [
      { k: "Monday → Figma sync", v: "Structured briefings, GraphQL pipeline, instant Figma plugin update." },
      { k: "Iterator plugin", v: "Variants, format derivation, copy planning inside Figma." },
      { k: "Frontify integration", v: "Asset intake, naming conventions, brand surface alignment." },
      { k: "Showcase routes", v: "Client-facing project pages built from the same data." },
    ],
    metrics: [
      { k: "Integrations", v: "8+" },
      { k: "Plugins", v: "2" },
    ],
    surfaces: ["Web app", "Figma plugin", "Iterator plugin", "GPT Actions API"],
    stack: ["Next.js", "Supabase", "Vercel KV", "Monday", "Figma", "Frontify", "Meta", "Anthropic"],
    companyLeverage:
      "Used cross-department: Studio, Marketing Ops, and any team needing to bridge Monday → Figma → Frontify without manual copy-paste.",
    image: "/cases/assets/heimdall.png",
    screenshots: [
      { src: "/cases/screenshots/heimdall/Heimdall-Briefing Overview.png", alt: "Heimdall: briefing overview" },
      { src: "/cases/screenshots/heimdall/Heimdall-Briefing Closeup.png", alt: "Heimdall: briefing close-up" },
      { src: "/cases/screenshots/heimdall/Heimdall-Figma Plugin.png", alt: "Heimdall: Figma plugin" },
      { src: "/cases/screenshots/heimdall/Heimdall-Figma Template.png", alt: "Heimdall: Figma template" },
      { src: "/cases/screenshots/heimdall/Heimdall-Feedback Summarizer.png", alt: "Heimdall: feedback summarizer" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Headless interstitial — architecture, not a dashboard
 *
 * Sets up the selected case. Names the architectural shift behind every
 * production system above. Same engine, many surfaces. Build the engine,
 * not the dashboard. The substrate is the asset.
 * ─────────────────────────────────────────────────────────────────── */

export const headlessSection = {
  eyebrow: "Architecture, not a dashboard",
  title: "Build the engine.",
  titleEm: "Not the dashboard.",
  lede:
    "Salesforce shipped Headless 360. Stripe shipped agentic infrastructure. The pattern is the same in every case: the interface gets demoted, the substrate gets promoted. Mímir and Vesper both moved that way at Loop. The dashboard becomes one face of many. The engine underneath is the asset every future surface inherits.",
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
      title: "Software for few.",
      body:
        "Built by the team that uses it. Specific. Not built for millions, built for the team of ten that ships every day.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Selected case — HarvestFields, where everything comes together
 *
 * Compressed teaser for the long-form case at /ai-operator/harvestfields.
 * Three pillars (diagnosis, reframe, architecture) and a HarvestFields
 * engine snapshot. The CTA opens the full case page.
 * ─────────────────────────────────────────────────────────────────── */

export const selectedCaseSection = {
  eyebrow: "Selected case · synthetic data, real architecture",
  title: "HarvestFields.",
  titleEm: "Brand speed and brand safety as one engine.",
  lede:
    "Where Navigate, Encode, and Build come together on a brand the size of Vandemoortele. Two workflows that look like two problems — localisation needs speed, brand review needs control — share the same root cause: brand memory is unencoded. Encode it once, both problems shrink.",
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
        "One engine. Two postures. Every run becomes an eval case. Headless from day one — Web, Copilot Studio, Power Automate, MCP, all calling the same protocol.",
    },
  ],
  cta: {
    label: "Read the full case",
    href: "/ai-operator/harvestfields",
  },
  metrics: [
    { v: "243", k: "Chunks · grounded substrate" },
    { v: "5", k: "Drift categories tracked" },
    { v: "4", k: "Audience registers" },
    { v: "4", k: "Target languages" },
  ],
  endpoints: [
    { method: "POST", path: "/v1/localise", state: "ready" },
    { method: "POST", path: "/v1/brand-check", state: "ready" },
    { method: "POST", path: "/v1/eval/run", state: "demo" },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * CTA + footer
 * ─────────────────────────────────────────────────────────────────── */

export const ctaSection = {
  eyebrow: "Smallest commitment that starts work",
  title: "Let's talk.",
  titleEm: "Inside one of your team's routines.",
  body:
    "Embedded mandates, accelerator programs, or focused encoding sprints alongside one team. We start with one workflow and work outward.",
  fine:
    "Antwerp · CET. Comfortable working remotely with US-based teams. CV available on request.",
  primary: {
    label: "vince@thoughtform.co",
    href: "mailto:vince@thoughtform.co?subject=Forward-deployed%20AI%20operator",
  },
  secondary: {
    label: "linkedin.com/in/starhaven",
    href: "https://www.linkedin.com/in/starhaven/",
  },
} as const;

export const footer = {
  line: "Vincent Buyssens · Forward-Deployed AI Operator",
  signature: "Antwerp · Belgium",
  studio: "Practice: Thoughtform",
} as const;

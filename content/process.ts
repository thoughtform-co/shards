/*
 * Process page content.
 *
 * The process page explains the Aether operating model in plain executive
 * language. The IA mirrors a Stripe-style narrative arc — why this exists
 * now, what a Skill is, how the loop runs, where it ships, how it's
 * governed, what it has already produced — but the language and palette
 * stay Loop-native.
 */

export type FlywheelStep = {
  id: "navigate" | "encode" | "build";
  number: string;
  label: "Navigate" | "Encode" | "Build";
  title: string;
  body: string;
  signal: string;
  signalNote: string;
};

export type ProductionTool = {
  id: string;
  name: string;
  tier: "Production" | "WIP" | "External";
  function: string;
  surface: string;
  tone: "violet" | "blue" | "green" | "gold";
};

export type ArchitectureLayer = {
  id: string;
  number: string;
  label: string;
  title: string;
  body: string;
  examples: string[];
};

export type AnatomyPiece = {
  id: string;
  number: string;
  label: string;
  title: string;
  body: string;
  snippet: { key: string; val: string }[];
};

export type WhyNowHead = {
  id: string;
  initial: string;
  variant: "ink" | "violet" | "gold" | "emerald" | "dusk";
  title: string;
  sub: string;
  tag: string;
  warn?: boolean;
};

export type TrustCheck = {
  id: string;
  title: string;
  body: string;
};

export type ReviewMockRow = {
  id: string;
  approved: boolean;
  title: string;
  by: string;
  amount: string;
  action: string;
};

export const processHero = {
  eyebrow: "How it works",
  titlePre: "Observe.",
  titlePost: "Encode.",
  titleEm: "Ship.",
  lede:
    "Aether starts inside the work. It captures how decisions are made, turns that into a Skill, then ships the first tool against a real workflow.",
  meta: [
    { key: "Reads as", value: "Operating model" },
    { key: "Owner", value: "Creative Technology" },
    { key: "Pairs with", value: "Campaign demo" },
    { key: "Reading time", value: "≈ 4 minutes" },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * Why now — the operating-layer gap.
 *
 * Substrate-style problem block. Left side names the gap; right side shows
 * the four heads that share the work today (founder/operator, copilots,
 * stakeholders, next hire). Sets up the rest of the page as a response.
 * ───────────────────────────────────────────────────────────────────────── */

export const whyNowSection = {
  eyebrow: "Why this exists",
  eyebrowTone: "violet" as const,
  title: "AI access has compounded.",
  titleEm: "The operating layer has not.",
  lede:
    "Loop's seats, tools and Skills already work. The judgment that turns activity into an outcome — what good looks like, when to escalate, which source counts — still lives in a few people's heads.",
  pains: [
    {
      strong: "The judgment is invisible.",
      body: "Tools store the data. The decisions applied to it stay with the people who hold the brief.",
    },
    {
      strong: "Tools don't coordinate.",
      body: "A Skill in Claude here, a workflow in Monday there. Every routine relearns from zero when a tool changes.",
    },
    {
      strong: "Growth still means more attention.",
      body: "More briefs, more markets, more reviews — same single inbox between business and AI.",
    },
  ],
  caption:
    "Same question, four different answers, every time the team grows or the stack shifts.",
};

export const whyNowHeads: WhyNowHead[] = [
  {
    id: "operator",
    initial: "O",
    variant: "ink",
    title: "Operator",
    sub: "holds the rules in their head",
    tag: "Bottleneck",
    warn: true,
  },
  {
    id: "copilots",
    initial: "AI",
    variant: "violet",
    title: "Copilot tools",
    sub: "each one a separate context",
    tag: "Fragmented",
  },
  {
    id: "stakeholders",
    initial: "S",
    variant: "dusk",
    title: "Stakeholders",
    sub: "ask the same questions every cycle",
    tag: "Recurring",
  },
  {
    id: "next-hire",
    initial: "N",
    variant: "gold",
    title: "Next hire",
    sub: "inherits a Notion doc and a hope",
    tag: "Friction",
    warn: true,
  },
];

export const flywheelSection = {
  eyebrow: "The loop",
  eyebrowTone: "violet" as const,
  title: "Navigate.",
  titleEm: "Encode. Build.",
  lede:
    "The loop is simple enough to repeat and concrete enough to manage. Every round leaves behind a Skill, a tool and a clearer brief for engineering.",
  close:
    "Vesper, Heimdall, Mímir and Babylon all started this way: close to the work, built quickly, hardened after proof.",
};

export const flywheelSteps: FlywheelStep[] = [
  {
    id: "navigate",
    number: "01",
    label: "Navigate",
    title: "Work alongside the team until the pattern shows up.",
    body:
      "Sit with the team. Read the briefs. Watch handoffs, reviews and rework. The useful pattern appears in the daily workflow.",
    signal: "Evidence",
    signalNote: "Captured as voice rails, examples, edge cases, source links.",
  },
  {
    id: "encode",
    number: "02",
    label: "Encode",
    title: "Turn the judgment into instructions any tool can read.",
    body:
      "A Skill is an onboarding document for AI. It holds vocabulary, examples, source order, locked rules and open choices.",
    signal: "Operating layer",
    signalNote: "One Skill, callable from Claude, Gemini, Monday and MCP.",
  },
  {
    id: "build",
    number: "03",
    label: "Build",
    title: "Ship the first tool while the signal is fresh.",
    body:
      "Build the smallest useful version. Connect it to Monday, Slack, Figma or a web UI only after the output earns trust.",
    signal: "Surfaces",
    signalNote: "Same engine, multiple plug points. Ages well.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Anatomy of a Skill — the four primitives.
 *
 * Substrate's "what's a skill" block, adapted for Loop. A Skill is not a
 * black box; it has four parts anyone can read: rules, examples, sources,
 * review. The code snippets are intentionally inspectable, not decorative.
 * ───────────────────────────────────────────────────────────────────────── */

export const anatomySection = {
  eyebrow: "Anatomy of a Skill",
  eyebrowTone: "blue" as const,
  title: "Four parts.",
  titleEm: "Anyone on the team can read them.",
  lede:
    "A Skill is an operating manual the agent can call. It has four pieces — no black box, no hidden prompt — so the team owns the substrate, not the tool.",
};

export const anatomyPieces: AnatomyPiece[] = [
  {
    id: "rules",
    number: "01 Rules",
    label: "Rules",
    title: "How we decide.",
    body:
      "Plain conditions and locked policies. The Skill enforces them; the agent executes them the way a senior would.",
    snippet: [
      { key: "when", val: "claim is unsourced" },
      { key: "then", val: "block + cite registry" },
    ],
  },
  {
    id: "examples",
    number: "02 Examples",
    label: "Examples",
    title: "What good looks like.",
    body:
      "Saved past actions the Skill should imitate. The more examples, the sharper the judgment — and the easier handovers get.",
    snippet: [
      { key: "examples", val: "47 saved" },
      { key: "latest", val: "Engage Q3 · DACH" },
    ],
  },
  {
    id: "sources",
    number: "03 Sources",
    label: "Sources",
    title: "What it can read.",
    body:
      "Briefs, Monday boards, claim registries, calendars. Linked safely — never absorbed into a closed prompt.",
    snippet: [
      { key: "primary", val: "Monday · Freedom" },
      { key: "supporting", val: "Insights · Studio" },
    ],
  },
  {
    id: "review",
    number: "04 Review",
    label: "Review",
    title: "Who confirms it.",
    body:
      "The Skill prepares; a human approves before it ships. Every approval becomes a new example for the next call.",
    snippet: [
      { key: "approver", val: "owner" },
      { key: "approval rate", val: "94%" },
    ],
  },
];

export const architectureSection = {
  eyebrow: "What lives underneath",
  eyebrowTone: "blue" as const,
  title: "One Skill.",
  titleEm: "Many places to use it.",
  lede:
    "The useful part is the encoded way of working. Claude can read it today. Gemini, Monday, Slack or a custom tool can read the same logic tomorrow.",
  close:
    "This is the practical meaning of substrate: Loop's judgment lives below the interface, so the interface can change.",
};

export const architectureLayers: ArchitectureLayer[] = [
  {
    id: "engine",
    number: "01",
    label: "Engine",
    title: "How we work, encoded.",
    body:
      "Skills, sources and examples. Versioned in Git. Updated once.",
    examples: [
      "Tone of voice Skill",
      "Brand claim registry",
      "Briefing intelligence Skill",
    ],
  },
  {
    id: "protocol",
    number: "02",
    label: "Protocol",
    title: "API · MCP · Skill bundle.",
    body:
      "The same logic can run through an API, an MCP tool or a Claude/Gemini Skill.",
    examples: [
      "REST endpoints",
      "MCP tool exposure",
      "Claude / Gemini / ChatGPT Skill",
    ],
  },
  {
    id: "surfaces",
    number: "03",
    label: "Surfaces",
    title: "Monday · Slack · Figma · Web.",
    body:
      "Teams use it where the work already lives. The Skill remains the source of record.",
    examples: [
      "Pre-built workbench",
      "Agent-spawned (MCP Apps)",
      "Semantic / vector navigation",
    ],
  },
];

export const productionSection = {
  eyebrow: "Skills catalog",
  eyebrowTone: "gold" as const,
  title: "The pattern",
  titleEm: "already shipped.",
  lede:
    "Each tool below began with a team problem, reached a useful prototype fast, then moved toward production once the output held up.",
};

export const productionTools: ProductionTool[] = [
  {
    id: "vesper",
    name: "Vesper",
    tier: "Production",
    function: "AI image and video generation",
    surface: "Web · Multi-model · Cost-transparent",
    tone: "violet",
  },
  {
    id: "heimdall",
    name: "Heimdall",
    tier: "Production",
    function: "Workflow orchestration across Monday, Figma, Frontify",
    surface: "Web + 2 Figma plugins · 8+ integrations",
    tone: "blue",
  },
  {
    id: "inku",
    name: "Inku",
    tier: "External",
    function: "In-ear product placement engine",
    surface: "External partner · Daily production",
    tone: "gold",
  },
  {
    id: "mimir",
    name: "Mímir",
    tier: "WIP",
    function: "Briefing intelligence agent",
    surface: "Performance signals + competitor + memory",
    tone: "green",
  },
  {
    id: "babylon",
    name: "Babylon",
    tier: "WIP",
    function: "Localisation pipeline",
    surface: "Transcribe · Translate · Dub · Review",
    tone: "violet",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Trust / governance — the substrate page's "your data, your control".
 *
 * Two columns. Left: four governance commitments anyone can audit. Right:
 * a small review-queue mock that shows the human-approval discipline as
 * an actual surface, not a slogan.
 * ───────────────────────────────────────────────────────────────────────── */

export const trustSection = {
  eyebrow: "How it stays auditable",
  eyebrowTone: "green" as const,
  title: "The Skill prepares.",
  titleEm: "A human approves.",
  lede:
    "Every action stays under review. Skills propose; owners approve. The substrate is plain text the team can read, the data stays linked instead of absorbed, and nothing about how Loop works ages out with a model.",
};

export const trustChecks: TrustCheck[] = [
  {
    id: "approval",
    title: "Human approval, by default.",
    body:
      "Every outgoing action waits for a review until the team explicitly turns it off. Approvals are logged.",
  },
  {
    id: "linked",
    title: "Linked, not absorbed.",
    body:
      "Skills run on Monday, Slack, Figma, Insights — without copying the data into a closed prompt. The system of record stays the system of record.",
  },
  {
    id: "plain",
    title: "Plain rules, not black boxes.",
    body:
      "Anyone on the team can read what a Skill does, where its data comes from and which rule fired. Reviewable like code.",
  },
  {
    id: "portable",
    title: "Portable, by design.",
    body:
      "Models change. Tools change. The Skill travels with us — Claude today, Gemini tomorrow, MCP everywhere — without rebuilding the engine.",
  },
];

export const reviewMockTitle = {
  title: "Review queue",
  sub: "Campaign judgment · today",
  count: "3 to approve",
};

export const reviewMockRows: ReviewMockRow[] = [
  {
    id: "r1",
    approved: true,
    title: "Patch · Engage Q3 brief",
    by: "claim language flagged",
    amount: "DACH",
    action: "Approved",
  },
  {
    id: "r2",
    approved: true,
    title: "Reminder · Studio handoff",
    by: "calendar gap, 2 dependencies",
    amount: "UK",
    action: "Approved",
  },
  {
    id: "r3",
    approved: false,
    title: "Escalation · Sleep recap",
    by: "claim source missing",
    amount: "NL",
    action: "Review",
  },
];

export const processClose = {
  eyebrow: "See it run",
  eyebrowTone: "violet" as const,
  title: "Campaign governance",
  titleEm: "as a worked example.",
  lede:
    "Greg's campaign-management agents become one Skill with multiple checkpoints. The demo shows the operating model in a real Loop context.",
  cta: {
    primary: { label: "Open the campaign demo", href: "/campaign-substrate" },
    secondary: { label: "Back to the vision", href: "/" },
  },
};

export const footer = {
  line: "Aether · How the working intelligence layer operates.",
  signature: "Drafted by Creative Technology · April 2026.",
};

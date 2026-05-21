/*
 * Aether content — v12 public homepage.
 *
 * The page reads as one cohesive narrative for an executive audience:
 * data is connected, AI tools and interfaces multiply, but the team's
 * expertise that makes work good still lives outside the system. Aether
 * encodes that expertise into a substrate that connects the data already
 * wired up to the AI tools and interfaces above it. One layer in the
 * middle, headless, inherited everywhere.
 *
 *   01 Hero       — Name the layer, with a working-motion orbit visual.
 *   02 Why now    — Data is connected. AI tools multiply. Expertise is
 *                   still scattered. Two tidy rails over a scattered grid.
 *   03 The layer  — Data sources → encoded substrate → AI tools and
 *                   interfaces. The substrate sits between two existing
 *                   realities, not above an empty stack.
 *   04 Bridge     — Dark interstitial: built inside your work, owned
 *                   by your team. Three motions, one operator, six weeks.
 *   05 Method     — Navigate, Encode, Build. Alternating sections with
 *                   a representative mock for each motion.
 *   06 Headless   — One substrate, pick the AI tool or interface that
 *                   fits. Same logic as Salesforce Headless 360 and
 *                   Stripe's agentic infrastructure: capabilities exposed
 *                   so any model-powered surface can call them.
 *   07 Proof      — Three programs that ran. Carousel of case studies.
 *   08 Operator   — Bridge from proof to invitation, then the embedded
 *                   operator pitch with a lineage panel.
 *   09 CTA        — Final close: pick the first workflow.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Navigation
 * ─────────────────────────────────────────────────────────────────────── */

export type NavLink = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
};

export type NavMeta = {
  brand: string;
  brandSub: string;
  status: string;
  links: NavLink[];
};

export const nav: NavMeta = {
  brand: "Aether",
  brandSub: "A reusable intelligence layer",
  status: "Scoped by Vince · Loop Creative Technology",
  links: [
    { id: "why", label: "Why now", href: "/#why" },
    { id: "layer", label: "The layer", href: "/#layer" },
    { id: "how", label: "Method", href: "/#how" },
    { id: "headless", label: "Headless", href: "/#headless" },
    { id: "engine", label: "Intelligence Layer", href: "/intelligence-layer" },
    { id: "cta", label: "Talk to us", href: "/#cta", primary: true },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * Hero — name the layer
 * ─────────────────────────────────────────────────────────────────────── */

export type HeroAction = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
};

export type HeroOrbit = {
  id: "navigate" | "encode" | "build" | "learn";
  label: string;
  position: "top" | "right" | "bottom-left" | "bottom-right";
};

export type Hero = {
  eyebrowPill: string;
  titlePre: string;
  titleEm: string;
  lede: string;
  actions: HeroAction[];
  panel: {
    title: string;
    live: string;
    centerLabel: string;
    centerSub: string;
    orbits: HeroOrbit[];
  };
};

export const hero: Hero = {
  eyebrowPill: "Aether",
  titlePre: "A reusable intelligence layer,",
  titleEm: "built from how your team works.",
  lede:
    "Most companies have AI everywhere and intelligence nowhere. Aether encodes the judgment your team already has, with an embedded operator, into substrate every tool and surface inherits.",
  actions: [
    { id: "layer", label: "See the layer", href: "#layer", primary: true },
    { id: "how", label: "How it works", href: "#how" },
  ],
  panel: {
    title: "Working motion",
    live: "Live",
    centerLabel: "Substrate",
    centerSub: "Compounds",
    orbits: [
      { id: "navigate", label: "Navigate", position: "top" },
      { id: "encode", label: "Encode", position: "right" },
      { id: "build", label: "Build", position: "bottom-left" },
      { id: "learn", label: "Learn", position: "bottom-right" },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────────────
 * Why now — Data is connected. AI tools multiply. Expertise is scattered.
 *
 * The visual is one panel with three vertically stacked zones:
 *
 *   1. Data sources — a compact rail of small pills naming the systems of
 *      record the company already has wired up (Snowflake, ThoughtSpot,
 *      Meta Ads, Monday, Frontify, Notion). The eye reads "infrastructure
 *      exists".
 *   2. AI tools + interfaces — a second compact rail naming the model-
 *      powered surfaces multiplying on top of it (Claude, Copilot, Slack,
 *      agents, workflows, dashboards). The eye reads "tools exist".
 *   3. Expertise — six small tiles laid across a 12-column grid at varying
 *      widths and offsets, deliberately off-grid. The eye reads
 *      "interpretation is not encoded".
 *
 * Two tidy rails on top of one scattered grid is the argument. The
 * substrate section that follows is the resolution: data sources on the
 * left, encoded substrate in the middle, AI tools + interfaces on the
 * right.
 * ─────────────────────────────────────────────────────────────────────── */

export type WhyProblem = {
  id: string;
  title: string;
  body: string;
};

/* Item used inside the Why Now top rails. `kind` keeps the icon + tint
   pattern visually consistent across data sources and AI tools/interfaces
   without inventing new colour roles. */
export type WhyChip = {
  id: string;
  label: string;
  tone: "ink" | "violet" | "emerald" | "gold" | "dusk";
};

export type WhySource = {
  id: string;
  initials: string;
  tone: "ink" | "violet" | "emerald" | "gold" | "dusk";
  label: string;
  location: string;
};

export const whySection = {
  eyebrow: "Why now",
  title: "Data is connected. AI tools multiply.",
  titleEm: "Expertise is still scattered.",
  lede:
    "Every team now has data wired up and AI tools rolled out. But the expertise that makes work good — standards, examples, source hierarchy, review habits, edge cases and ways of thinking — still lives outside the system, spread across people, files and meetings.",
  dataLabel: "Data sources connected",
  dataNote: "Systems of record. Already wired up.",
  toolsLabel: "AI tools + interfaces rolled out",
  toolsNote: "Multiplying. Each one starts from zero.",
  sourcesLabel: "Expertise both sides need",
  sourcesNote: "Scattered across the company.",
  vizFoot:
    "The next advantage is not more data, and not more AI tools. It is making the team's expertise usable across both.",
} as const;

export const whyProblems: WhyProblem[] = [
  {
    id: "expertise-tacit",
    title: "Expertise stays tacit.",
    body:
      "Tools store the data. The standards behind the work stay with the people who hold the brief.",
  },
  {
    id: "tools-uncoordinated",
    title: "Tools don't share context.",
    body:
      "A copilot here, an agent there, a workflow elsewhere. Every routine relearns from zero.",
  },
  {
    id: "ideas-not-proof",
    title: "Workshops generate ideas, not proof.",
    body:
      "The strongest use case sits in a deck, waiting for budget.",
  },
  {
    id: "models-change",
    title: "Models keep changing.",
    body:
      "Whatever you build for today's model gets rebuilt for next year's.",
  },
];

/* Data sources rail — systems of record already wired up across most
   companies. Names are deliberately well-known so the rail reads as
   "you already have this" without explanation. */
export const whyDataSources: WhyChip[] = [
  { id: "snowflake", label: "Snowflake", tone: "dusk" },
  { id: "thoughtspot", label: "ThoughtSpot", tone: "violet" },
  { id: "meta-ads", label: "Meta Ads", tone: "emerald" },
  { id: "monday", label: "Monday", tone: "gold" },
  { id: "frontify", label: "Frontify", tone: "ink" },
  { id: "notion", label: "Notion", tone: "dusk" },
];

/* AI tools + interfaces rail — model-powered surfaces multiplying on top
   of that data. Mixes pure AI tools (Claude, Copilot, agents) with
   interfaces that host them (Slack, dashboards, workflows). The label
   is plural on purpose: the LLM may live inside the interface, behind
   an API, or in a connected agent runtime — all of them need encoded
   expertise to act well. */
export const whyTools: WhyChip[] = [
  { id: "claude", label: "Claude", tone: "violet" },
  { id: "copilot", label: "Copilot", tone: "emerald" },
  { id: "slack", label: "Slack", tone: "dusk" },
  { id: "agents", label: "Agents", tone: "gold" },
  { id: "workflows", label: "Workflows", tone: "ink" },
  { id: "dashboards", label: "Dashboards", tone: "dusk" },
];

/* Five expertise inputs aligned with `layerInputs` below. The label and
   tone are shared between sections so the eye recognises them as the
   same elements moving from "scattered" (Why Now) to "encoded" (The
   Layer). The `location` chip names the everyday container the
   expertise lives in today; The Layer shows the same items with their
   structural `kind` instead. */
export const whySources: WhySource[] = [
  { id: "brand", initials: "B", tone: "ink", label: "Brand book", location: "Notion doc" },
  { id: "lead", initials: "L", tone: "violet", label: "Lead's judgment", location: "Lead's head" },
  { id: "past", initials: "P", tone: "emerald", label: "Past work", location: "Drive folders" },
  { id: "regs", initials: "R", tone: "gold", label: "Regs & policy", location: "Compliance PDFs" },
  { id: "feedback", initials: "F", tone: "dusk", label: "Review feedback", location: "Email threads" },
];

/* ─────────────────────────────────────────────────────────────────────────
 * The layer — data sources → encoded substrate → AI tools + interfaces
 *
 * The visual is a three-region diagram, read left-to-right:
 *
 *   1. Data sources — the systems of record already wired up. Compact
 *      chips, named explicitly so the reader sees their own stack.
 *   2. Aether substrate — the centred dark panel. Rules, examples,
 *      sources, loops. The only dominant object on the page; the two
 *      flanks are quieter.
 *   3. AI tools + interfaces — the model-powered surfaces inheriting the
 *      substrate. Same chip pattern as the left flank to read as a pair.
 *
 * The expertise-inputs list (legacy `layerInputs`) is kept for the
 * "from your work" rail above the substrate, naming what gets encoded
 * inside the substrate itself.
 * ─────────────────────────────────────────────────────────────────────── */

export type LayerInput = {
  id: string;
  initials: string;
  tone: "ink" | "violet" | "emerald" | "gold" | "dusk";
  label: string;
  kind: string;
};

export type LayerStratum = {
  id: "rules" | "examples" | "sources" | "loops";
  tag: string;
  name: string;
  meta: string;
};

export type LayerPromise = {
  id: string;
  title: string;
  body: string;
};

/* A single chip on the left or right flank of The Layer diagram. The
   left flank uses real data-system names; the right flank uses real
   AI-tool / interface names. Tones repeat across flanks deliberately
   so the eye reads the rails as a pair. */
export type LayerChip = {
  id: string;
  label: string;
  tone: "ink" | "violet" | "emerald" | "gold" | "dusk";
};

export const layerSection = {
  eyebrow: "The layer",
  title: "One source of expertise.",
  titleEm: "Inherited by every AI tool and interface.",
  lede:
    "The layer your AI stack is missing. Built inside the work, from the rules, examples, sources, and review habits your team already uses. Encoded once. Owned by you. Connected to the data you already have. Inherited by every model-powered tool and interface above it.",
  flowHeader: "Substrate · loop ops",
  flowVersion: "Live · v0.4.2",
  dataHeading: "Data sources",
  dataNote: "Wired up. Stays where it is.",
  substrateHeading: "Encoded substrate",
  toolsHeading: "AI tools + interfaces",
  toolsNote: "Inherit the same expertise.",
  inputsHeading: "What gets encoded",
  substrateTitle: "Aether layer",
  substrateBadge: "Headless",
  connectsCaption: "Connects to your data — doesn't replace it.",
} as const;

/* Data sources flanking the substrate on the left. Same well-known names
   as the Why-Now rail so the reader follows the same vocabulary across
   sections. */
export const layerDataSources: LayerChip[] = [
  { id: "snowflake", label: "Snowflake", tone: "dusk" },
  { id: "thoughtspot", label: "ThoughtSpot", tone: "violet" },
  { id: "meta-ads", label: "Meta Ads", tone: "emerald" },
  { id: "monday", label: "Monday", tone: "gold" },
  { id: "frontify", label: "Frontify", tone: "ink" },
  { id: "notion", label: "Notion", tone: "dusk" },
];

/* AI tools + interfaces flanking the substrate on the right. Same chip
   pattern as `layerDataSources`, mirrored. The Headless section below
   expands these into an interactive selector. */
export const layerTools: LayerChip[] = [
  { id: "claude", label: "Claude", tone: "violet" },
  { id: "copilot", label: "Copilot", tone: "emerald" },
  { id: "slack", label: "Slack", tone: "dusk" },
  { id: "agents", label: "Agents", tone: "gold" },
  { id: "workflows", label: "Workflows", tone: "ink" },
  { id: "dashboards", label: "Dashboards", tone: "dusk" },
];

export const layerInputs: LayerInput[] = [
  { id: "brand", initials: "B", tone: "ink", label: "Brand book", kind: "Source" },
  { id: "lead", initials: "L", tone: "violet", label: "Lead's judgment", kind: "Tacit" },
  { id: "past", initials: "P", tone: "emerald", label: "Past work", kind: "Examples" },
  { id: "regs", initials: "R", tone: "gold", label: "Regs & policy", kind: "Constraints" },
  { id: "feedback", initials: "F", tone: "dusk", label: "Review feedback", kind: "Loop" },
];

export const layerStrata: LayerStratum[] = [
  { id: "rules", tag: "Rules", name: "how the team decides", meta: "12 entries" },
  { id: "examples", tag: "Examples", name: "what good looks like", meta: "38 artifacts" },
  { id: "sources", tag: "Sources", name: "the data sources it can read", meta: "3 connectors" },
  { id: "loops", tag: "Loops", name: "who confirms it", meta: "2 gates" },
];

export const layerPromises: LayerPromise[] = [
  {
    id: "captured",
    title: "Captured.",
    body: "Tacit expertise becomes legible substrate.",
  },
  {
    id: "owned",
    title: "Owned.",
    body: "Versioned, reviewable, your team's asset.",
  },
  {
    id: "portable",
    title: "Portable.",
    body: "Outlives the model underneath.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Bridge — dark interstitial between The layer and Method
 * ─────────────────────────────────────────────────────────────────────── */

export const bridgeSection = {
  titlePre: "Built inside your work.",
  titleEm: "Owned by your team.",
  sub: "Three motions. One operator. Six weeks alongside your team.",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Method — Navigate, Encode, Build
 * ─────────────────────────────────────────────────────────────────────── */

export type MethodMockKind = "fieldNotes" | "substrateFile" | "chat";

export type MethodMockFieldNotes = {
  kind: "fieldNotes";
  header: string;
  status: string;
  entries: { date: string; body: string; highlights?: { text: string; mark: string }[] }[];
  pattern: { heading: string; body: string };
};

export type MethodMockSubstrateFile = {
  kind: "substrateFile";
  fileName: string;
  version: string;
  lines: SubstrateFileLine[];
};

export type SubstrateFileLine =
  | { type: "sep" }
  | { type: "blank" }
  | { type: "comment"; text: string }
  | { type: "kv"; k: string; v: string }
  | { type: "tag"; tag: "rules" | "examples" | "sources" | "loops"; label: string; text: string };

export type MethodMockChat = {
  kind: "chat";
  header: string;
  status: string;
  messages: ChatMessage[];
  inputPlaceholder: string;
};

export type ChatMessage =
  | { from: "user"; avatar: string; text: string }
  | { from: "ai"; avatar: string; lines: string[]; check: string };

export type MethodMock =
  | MethodMockFieldNotes
  | MethodMockSubstrateFile
  | MethodMockChat;

export type MethodStage = {
  id: "navigate" | "encode" | "build";
  number: string;
  verb: string;
  headline: string;
  body: string;
  bullets: string[];
  reversed?: boolean;
  mock: MethodMock;
};

export const methodSection = {
  eyebrow: "How it gets built",
  title: "The loop that builds your substrate.",
  lede:
    "Substrate isn't authored from a brief. It's built inside the work, in three motions that run together. Each turn leaves substrate behind, and reveals the next workflow worth running.",
} as const;

export const methodStages: MethodStage[] = [
  {
    id: "navigate",
    number: "01",
    verb: "Navigate.",
    headline: "Sit inside one workflow until the patterns surface.",
    body:
      "Not a workshop. A week or two inside one high-signal workflow. Watching where judgment actually happens. The decisions people make without thinking. The rules nobody wrote down. Field notes, not strategy slides.",
    bullets: [
      "One workflow, end to end",
      "Real material, not slides",
      "Decision points named explicitly",
    ],
    mock: {
      kind: "fieldNotes",
      header: "Field notes · paid social review",
      status: "Day 4",
      entries: [
        {
          date: "Tue · 14:32 · with Greg",
          body:
            "Greg flagged the third headline draft. Reason given: __1__. Asked what he meant. He said the rhythm is off, three short clauses in a row, no breath. Rewrote with one long clause and a pause. Approved.",
          highlights: [{ text: "__1__", mark: "\"sounds AI-written\"" }],
        },
        {
          date: "Wed · 10:15 · brief review",
          body:
            "Same friction on a different draft. Greg again caught __1__. Pattern: he never lets more than two short sentences run consecutively in primary text.",
          highlights: [{ text: "__1__", mark: "\"three-clause rhythm\"" }],
        },
      ],
      pattern: {
        heading: "Pattern surfaced",
        body:
          "Sentence rhythm rule. Never three short clauses in a row. Encode as a voice-rule with examples.",
      },
    },
  },
  {
    id: "encode",
    number: "02",
    verb: "Encode.",
    headline: "Turn what your team saw into substrate the model can read.",
    body:
      "Field notes become structured layers. Rules, examples, sources, review gates. The operator drafts. The team reviews. Versioned, owned, portable. The asset that survives the next model and the next interface.",
    bullets: [
      "Rules · Examples · Sources · Loops",
      "Versioned, owned, reviewable",
      "Portable across models and providers",
    ],
    reversed: true,
    mock: {
      kind: "substrateFile",
      fileName: "brand-voice.md",
      version: "v0.4.2",
      lines: [
        { type: "sep" },
        { type: "kv", k: "name", v: "brand-voice" },
        { type: "kv", k: "owner", v: "creative-ops" },
        { type: "sep" },
        { type: "blank" },
        { type: "comment", text: "# Rhythm" },
        { type: "tag", tag: "rules", label: "Rules", text: "Never three short clauses in a row." },
        { type: "tag", tag: "examples", label: "Examples", text: "/examples/q3-launch-rhythm.md" },
        { type: "blank" },
        { type: "comment", text: "# Claims" },
        { type: "tag", tag: "sources", label: "Sources", text: "brand-codex, regs.eu/health" },
        { type: "tag", tag: "loops", label: "Loops", text: "legal review on health claims" },
      ],
    },
  },
  {
    id: "build",
    number: "03",
    verb: "Build.",
    headline: "Ship a thin running surface as proof.",
    body:
      "A small interface running on the substrate, used by your team daily. Not a deck. Not a roadmap. A working thing. The proof shows what the substrate is missing, and which workflow to encode next.",
    bullets: [
      "Thin proof inside the team",
      "Substrate underneath, not embedded",
      "Roadmap shaped by what it teaches",
    ],
    mock: {
      kind: "chat",
      header: "Brand voice · review chat",
      status: "Live",
      messages: [
        {
          from: "user",
          avatar: "G",
          text: "Draft 3 hooks for the Q3 launch, audience: noise-sensitive parents.",
        },
        {
          from: "ai",
          avatar: "Æ",
          lines: [
            "Some days the silence finds you before bedtime, and that is the moment everything else lets go.",
            "Loud rooms used to mean tired evenings. Now bedtime is yours again.",
            "The quiet your kids never give you, given back.",
          ],
          check: "Voice rules · 2 examples matched · sources verified",
        },
      ],
      inputPlaceholder: "Reply or refine...",
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Headless — interactive substrate / surface selector
 * ─────────────────────────────────────────────────────────────────────── */

export type HeadlessLayerId = "rules" | "examples" | "sources" | "loops";

export type HeadlessLayer = {
  id: HeadlessLayerId;
  tag: string;
  name: string;
};

export type HeadlessDetailToken =
  | { type: "comment"; text: string }
  | { type: "k"; text: string }
  | { type: "v"; text: string }
  | { type: "plain"; text: string }
  | { type: "br" };

export type HeadlessSurface = {
  id: string;
  icon: string;
  name: string;
  verb: string;
  layers: HeadlessLayerId[];
  detail: {
    title: string;
    meta: string;
    body: HeadlessDetailToken[];
  };
};

export type HeadlessFootPoint = {
  id: string;
  title: string;
  body: string;
};

export const headlessSection = {
  eyebrow: "Headless by default",
  title: "One substrate.",
  titleEm: "Pick the AI tool or interface that fits the work.",
  lede:
    "The substrate is exposed headlessly. Stripe, Salesforce and the wider stack are moving the same way: capabilities exposed as APIs and MCP tools so any model-powered tool or interface can call them. Aether does that for your expertise. Click any tool or interface to see which layers of the substrate it uses and what it produces.",
  panelTitle: "Aether layer",
  panelBadge: "Headless",
  surfacesHeading: "AI tools + interfaces · pick one",
} as const;

export const headlessLayers: HeadlessLayer[] = [
  { id: "rules", tag: "Rules", name: "how the team decides" },
  { id: "examples", tag: "Examples", name: "what good looks like" },
  { id: "sources", tag: "Sources", name: "the data sources it can read" },
  { id: "loops", tag: "Loops", name: "who confirms it" },
];

export const headlessSurfaces: HeadlessSurface[] = [
  {
    id: "chat",
    icon: "⌘",
    name: "Chat",
    verb: "Claude, Copilot, ChatGPT",
    layers: ["rules", "examples", "sources"],
    detail: {
      title: "Chat",
      meta: "3 layers · live",
      body: [
        { type: "comment", text: "// internal review of a draft headline in Claude" },
        { type: "br" },
        { type: "k", text: "user" },
        { type: "plain", text: ": Draft 3 hooks for noise-sensitive parents." },
        { type: "br" },
        { type: "k", text: "aether" },
        { type: "plain", text: ": " },
        { type: "v", text: "[applies brand-voice rules, pulls 2 matched examples, verifies claims against sources]" },
        { type: "br" },
        { type: "k", text: "→" },
        { type: "plain", text: " 3 hooks returned, voice-checked." },
      ],
    },
  },
  {
    id: "api",
    icon: "{ }",
    name: "API",
    verb: "MCP, REST, internal apps",
    layers: ["rules", "sources", "loops"],
    detail: {
      title: "API",
      meta: "3 layers · production",
      body: [
        { type: "comment", text: "// called from the campaign management system or an MCP tool" },
        { type: "br" },
        { type: "k", text: "POST" },
        { type: "plain", text: " /v1/voice-check" },
        { type: "br" },
        { type: "v", text: "{\"copy\": \"...\", \"channel\": \"meta\", \"market\": \"BE\"}" },
        { type: "br" },
        { type: "k", text: "→" },
        { type: "plain", text: " { passed: true, flags: [], review_required: false }" },
      ],
    },
  },
  {
    id: "agent",
    icon: "◐",
    name: "Agent",
    verb: "Scheduled, autonomous",
    layers: ["rules", "examples", "sources", "loops"],
    detail: {
      title: "Agent",
      meta: "4 layers · scheduled",
      body: [
        { type: "comment", text: "// nightly run, adapts last week's high-performing copy to new markets" },
        { type: "br" },
        { type: "k", text: "step 1" },
        { type: "plain", text: ": pull top 5 ad units" },
        { type: "br" },
        { type: "k", text: "step 2" },
        { type: "plain", text: ": localize per market " },
        { type: "v", text: "(uses examples, rules, sources)" },
        { type: "br" },
        { type: "k", text: "step 3" },
        { type: "plain", text: ": queue for legal review " },
        { type: "v", text: "(loops gate)" },
      ],
    },
  },
  {
    id: "tool",
    icon: "⤴",
    name: "In-tool",
    verb: "Slack, Figma, Monday, custom UI",
    layers: ["rules", "examples", "loops"],
    detail: {
      title: "In-tool",
      meta: "3 layers · embedded",
      body: [
        { type: "comment", text: "// embedded inside the tool the team already uses (Slack thread, Figma plugin, Monday automation)" },
        { type: "br" },
        { type: "k", text: "action" },
        { type: "plain", text: ": select copy block → \"Voice-check\"" },
        { type: "br" },
        { type: "k", text: "aether" },
        { type: "plain", text: ": " },
        { type: "v", text: "applies rules, surfaces matching examples inline" },
        { type: "br" },
        { type: "k", text: "→" },
        { type: "plain", text: " reviewer approval routed via loops gate." },
      ],
    },
  },
];

export const headlessFoot: HeadlessFootPoint[] = [
  {
    id: "compounds",
    title: "Substrate compounds.",
    body:
      "Every workflow encoded adds to the same layer. Your team's expertise becomes an asset that compounds, not a stack of prompts that decay with the next model.",
  },
  {
    id: "follows",
    title: "Tools and interfaces follow the work.",
    body:
      "Chat for ideation. API for production systems. Agents for repetitive runs. Tool UIs for in-workflow checks. The substrate stays. The tool or interface adapts.",
  },
  {
    id: "carries",
    title: "Models change. Layer carries forward.",
    body:
      "The model is the most disposable part of the stack. Encoded expertise runs on whatever wins next quarter.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Proof — three programs, carousel
 * ─────────────────────────────────────────────────────────────────────── */

export type ProofMockGen = {
  kind: "gen";
  header: string;
  status: string;
  cards: GenCard[];
};

export type GenCard = {
  id: string;
  label: string;
  status: "approved" | "review";
  statusLabel: string;
  text: string;
  checks: string[];
};

export type ProofMockLoc = {
  kind: "loc";
  header: { title: string; subtitle: string; status: string };
  rows: LocRow[];
  more: string;
};

export type LocRow = {
  id: string;
  flag: "be" | "fr" | "de" | "it" | "es" | "nl" | "pl";
  code: string;
  market: string;
  status: "ok" | "rev";
  statusLabel: string;
};

export type ProofMockTime = {
  kind: "time";
  header: string;
  meta: string;
  steps: TimeStep[];
};

export type TimeStep = {
  id: string;
  week: string;
  title: string;
  detail: string;
  state: "done" | "active";
};

export type ProofMock = ProofMockGen | ProofMockLoc | ProofMockTime;

export type ProofMetric = {
  value: string;
  label: string;
};

export type ProofCase = {
  id: string;
  index: number;
  eyebrow: string;
  tone: "violet" | "emerald" | "gold";
  headline: string;
  body: string;
  metrics: [ProofMetric, ProofMetric];
  mock: ProofMock;
};

export const proofSection = {
  eyebrow: "Proven in practice",
  title: "Programs that ran.",
  titleEm: "Substrate that stayed.",
  lede:
    "Three Loop programs, one substrate underneath. Each one started inside a single team's bottleneck and left a piece of the layer behind. Heimdall stitches the rest together.",
} as const;

export const proofCases: ProofCase[] = [
  {
    id: "vesper",
    index: 1,
    eyebrow: "Loop · Studio · Vesper",
    tone: "violet",
    headline: "An in-house generation surface, sized to one team.",
    body:
      "Studio was paying Krea margin on the same APIs and switching tabs between Claude, Krea, and image-to-video tools. Vesper folds prompt enhancement, multi-model generation, and image-to-video into one flow, with the prompt enhancer wired to the Loop product catalogue. Shipped in days, used daily.",
    metrics: [
      { value: "Daily", label: "Campaigns shipped on Vesper" },
      { value: "6+", label: "Models unified, one interface" },
    ],
    mock: {
      kind: "gen",
      header: "Vesper · generation queue",
      status: "Live",
      cards: [
        {
          id: "v1",
          label: "Q3 launch · hero still",
          status: "approved",
          statusLabel: "Approved",
          text:
            "Quiet bedroom, soft daylight, child holding a Loop earplug — close-up, brand-fluent.",
          checks: ["Prompt enhanced", "Catalogue grounded", "Cost recorded"],
        },
        {
          id: "v2",
          label: "Q3 launch · 9:16 motion",
          status: "approved",
          statusLabel: "Approved",
          text:
            "Image-to-video, same hero still, 4-second loop with a slow push-in. Gemini Flash + Veo.",
          checks: ["Prompt enhanced", "Reference image", "Cost recorded"],
        },
        {
          id: "v3",
          label: "Q3 launch · variant test",
          status: "review",
          statusLabel: "Review",
          text:
            "Brainstorm mode, 4 variants on the same brief. Designer picks two for paid social.",
          checks: ["Prompt enhanced", "Studio review queued"],
        },
      ],
    },
  },
  {
    id: "babylon",
    index: 2,
    eyebrow: "Loop · UGC · Babylon",
    tone: "emerald",
    headline: "Localization that puts humans where their judgment counts.",
    body:
      "UGC localization used to bounce between agencies, transcripts, and Figma copy-paste. Babylon cross-checks transcription against on-screen captions through Gemini, so verification is automatic and proofreaders only see the rows where cultural judgment actually matters. One pipeline, thirty languages, one review step.",
    metrics: [
      { value: "30+", label: "Languages, one pipeline" },
      { value: "1", label: "Review step where humans still matter" },
    ],
    mock: {
      kind: "loc",
      header: {
        title: "Babylon · run",
        subtitle: "Q3 UGC batch",
        status: "Live",
      },
      rows: [
        { id: "be", flag: "be", code: "nl-BE", market: "Belgium · Dutch", status: "ok", statusLabel: "Approved" },
        { id: "fr", flag: "fr", code: "fr-FR", market: "France", status: "ok", statusLabel: "Approved" },
        { id: "de", flag: "de", code: "de-DE", market: "Germany", status: "rev", statusLabel: "Legal" },
        { id: "it", flag: "it", code: "it-IT", market: "Italy", status: "ok", statusLabel: "Approved" },
        { id: "es", flag: "es", code: "es-ES", market: "Spain", status: "ok", statusLabel: "Approved" },
        { id: "nl", flag: "nl", code: "nl-NL", market: "Netherlands", status: "ok", statusLabel: "Approved" },
        { id: "pl", flag: "pl", code: "pl-PL", market: "Poland", status: "rev", statusLabel: "Review" },
      ],
      more: "+ 5 more markets · proofread on a share link, no Figma seat needed",
    },
  },
  {
    id: "mimir",
    index: 3,
    eyebrow: "Loop · Creative Strategy · Mímir",
    tone: "gold",
    headline: "Briefings grounded in the evidence Loop already has.",
    body:
      "Creative Strategy used to assemble briefs from memory across Reddit, Meta Ad Library, and review spreadsheets. Mímir surfaces customer voice, ad performance, and competitive signals as composable building blocks, then drafts a brief from the evidence. Now exposed headlessly through MCP, so Claude, Cursor, Slack, and ChatGPT all stand on the same substrate.",
    metrics: [
      { value: "4+", label: "Intelligence sources, one layer" },
      { value: "MCP", label: "Headless · same engine, many surfaces" },
    ],
    mock: {
      kind: "time",
      header: "Mímir · build timeline",
      meta: "In production",
      steps: [
        {
          id: "w1",
          week: "Week 1",
          title: "Embedded with Creative Strategy",
          detail: "Watched briefings get assembled by hand",
          state: "done",
        },
        {
          id: "w2",
          week: "Week 2–3",
          title: "Encoded the intelligence layer",
          detail: "Customer voice, ad performance, competitive signals",
          state: "done",
        },
        {
          id: "w3",
          week: "Week 4",
          title: "Shipped the brief composer",
          detail: "Three-panel surface, evidence in one view",
          state: "done",
        },
        {
          id: "w5",
          week: "Week 5",
          title: "Wired degrees of freedom",
          detail: "Locked KPI sourcing, free creative interpretation",
          state: "done",
        },
        {
          id: "w6",
          week: "Week 6",
          title: "Reused for persona development",
          detail: "Product builds on the same substrate",
          state: "done",
        },
        {
          id: "w7",
          week: "Now",
          title: "Headless · MCP + REST surfaces",
          detail: "Same engine in Claude, Cursor, Slack, ChatGPT",
          state: "active",
        },
      ],
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Operator — clarion CTA into a Workshop / Strategy / Program ladder
 *
 * The section is a clear call to action for stakeholders, leaders, and
 * marketers. One short framing paragraph, then three engagement tiers
 * the reader can pick from. The Program tier is the headline action;
 * the Workshop and Strategy tiers are smaller, lower-commitment ways
 * to start. Success is measured by the team's independence after the
 * operator leaves, not by hours billed.
 * ─────────────────────────────────────────────────────────────────────── */

export type OperatorEngagement = {
  id: "workshop" | "strategy" | "program";
  tag: string;
  duration: string;
  title: string;
  body: string;
  outcome: string;
  cta: { label: string; href: string };
  primary?: boolean;
};

export const operatorSection = {
  bridge: {
    pre: "You've seen the layer, the build, the surfaces, the proof.",
    em: "Here's how to bring it in.",
  },
  eyebrow: "Bring the operator inside",
  title: "Pick the entry that fits your team.",
  framing:
    "An operator embeds, encodes the judgment your team already has, and trains your people to keep the loop running. Success is measured by the team's independence after they leave, not by hours billed. Three ways to start.",
  cta: { label: "Bring an operator in", href: "#cta" },
} as const;

export const operatorEngagements: OperatorEngagement[] = [
  {
    id: "workshop",
    tag: "Workshop",
    duration: "Half a day",
    title: "Get fluent with AI as intelligence, not software.",
    body:
      "Half a day with your team. We walk through one of your routines together, watch where judgment actually happens, and leave with a shortlist of workflows worth encoding next.",
    outcome: "You leave with: a clearer mental model and a shortlist.",
    cta: { label: "Book a workshop", href: "#cta" },
  },
  {
    id: "strategy",
    tag: "Strategy",
    duration: "Two weeks",
    title: "Map the workflows worth encoding. Pick the first one.",
    body:
      "A two-week sprint alongside the team. We surface the high-signal workflow, draft the substrate shape, and define the review loop. The output is a working plan you can run yourself or hand to the next program.",
    outcome: "You leave with: a workflow brief and an encoding plan.",
    cta: { label: "Book a strategy sprint", href: "#cta" },
  },
  {
    id: "program",
    tag: "Program",
    duration: "Six weeks",
    title: "Encode one workflow. Ship the proof. Hand the loop back.",
    body:
      "An operator embedded alongside one team for six weeks. Navigate the workflow inside the work, encode the judgment as substrate, ship a thin running tool the team uses daily, and train them to keep the loop running long after the operator leaves.",
    outcome: "You leave with: substrate, a running tool, and a team that can extend it.",
    cta: { label: "Bring an operator in", href: "#cta" },
    primary: true,
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * CTA — final close
 * ─────────────────────────────────────────────────────────────────────── */

export const ctaSection = {
  eyebrow: "Pick the first workflow",
  title: "Start where the attention costs the most.",
  lede:
    "One workflow. Six weeks. An operator inside your team, a substrate your team owns, and a thin running proof you can use the day it ships.",
  primary: { label: "Book a working session", href: "#cta" },
  secondary: { label: "Read the field notes", href: "#how" },
  fine:
    "No deck. No procurement gauntlet. A 45-minute call to walk through one of your routines and decide if it's the right first one.",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Footer
 * ─────────────────────────────────────────────────────────────────────── */

export const footer = {
  line: "Aether · A reusable intelligence layer",
  signature: "Scoped by Vince · Loop Creative Technology",
};

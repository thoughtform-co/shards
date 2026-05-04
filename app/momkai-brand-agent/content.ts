/*
 * Momkai · Brand Agent — content fixtures.
 *
 * Direction sketch for the brainstorm with Harald, written in the soft
 * Dutch register Momkai uses on its own site. English with Dutch warmth
 * at the bookends (hero kicker, closing CTA) so the page reads as a
 * proposal from one Dutch-speaking studio to another.
 *
 * Page arc:
 *   01 Hero        — Name the colleague, frame the prototype.
 *   02 Drift       — The week after the brand book lands.
 *   03 Substrate   — One brand encoded into a substrate every surface inherits.
 *   04 Surfaces    — Same colleague, different rooms. Headless by design.
 *   05 Anatomy     — What lives inside the agent.
 *   06 Brainstorm  — Bring one new brand. Encode the first one together.
 *   07 CTA         — Eerste sessie in de studio.
 *
 * Nothing here claims a working demo. The page is honest about being a
 * direction the team can react to, not a deployed product.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Top bar
 * ─────────────────────────────────────────────────────────────────────── */

export const meta = {
  brandLeft: "Momkai · Brand Agent",
  brandSub: "A direction · v0.4 sketch",
  signature: "Concept — Vince Buyssens",
  cta: { label: "Plan a session", href: "#cta" },
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Hero
 * ─────────────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "For Momkai · A direction for the brainstorm",
  titleLines: [
    "Van brand book",
    "naar digitale",
    { em: "collega." },
  ] as const,
  lede:
    "A digital teammate that holds the voice, the visual direction, the strategy, and the rules — trained on the brand the studio just shipped, ready for the team that has to roll it out. Not a tool. Not a chatbot. A presence on the team.",
  note:
    "This page is a direction sketch, not a finished product. Built to brainstorm with — bring one new brand to the studio and we'll encode the first one together.",
  actions: [
    { id: "engine", label: "See the engine", href: "#substrate", primary: true },
    { id: "plan", label: "How the brainstorm runs", href: "#brainstorm" },
  ],
  panel: {
    label: "Brand Agent",
    sub: "Digital colleague",
    version: "v0.4 · client-owned",
    layers: [
      { tag: "VOICE", body: "How it sounds." },
      { tag: "VISION", body: "What it stands for." },
      { tag: "LIBRARY", body: "What good looks like." },
      { tag: "GATES", body: "Who reviews what." },
      { tag: "LOOPS", body: "How it learns." },
    ] as const,
    footnote: "Readable as prose. Loadable by any model.",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Drift — the week after a brand book lands
 * ─────────────────────────────────────────────────────────────────────── */

export const drift = {
  eyebrow: "The week after launch",
  title: "A brand book lands.",
  titleEm: "Then it scatters.",
  lede:
    "The strategy is clear. The identity is finished. The PDFs are signed off. Then comes the part nobody briefed for: the campaign team needs headlines, the events team needs invitations, the social manager needs posts, the founder needs a keynote, and the new hire needs to know what \u201Con brand\u201D actually means by Friday.",
  problems: [
    {
      n: "01",
      title: "Voice drifts.",
      body:
        "The book describes a tone. The team has to translate that tone for every channel, every week, often without the people who wrote it.",
    },
    {
      n: "02",
      title: "References get lost.",
      body:
        "The mood, the references, the thinking that made the work feel like the work — most of it lives with the people who shipped it.",
    },
    {
      n: "03",
      title: "Reviews scale poorly.",
      body:
        "Every piece of copy quietly waits for the founder, the lead, or a senior. They are not always there. The work goes out anyway.",
    },
    {
      n: "04",
      title: "Models keep moving.",
      body:
        "Whatever the team builds around today's Claude or ChatGPT prompt gets rebuilt for next quarter's. The brand keeps starting from zero.",
    },
  ] as const,
  closing:
    "The brand book is the start of a translation problem, not the end of one. The Brand Agent is the layer that does the translating — without losing what made the brand worth shipping.",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Substrate — one brand encoded
 * ─────────────────────────────────────────────────────────────────────── */

export type SubstrateChip = { id: string; label: string };

export const substrate = {
  eyebrow: "The layer underneath",
  title: "One brand. Encoded.",
  titleEm: "Inherited by every surface above it.",
  lede:
    "The agent stands on a Brand Substrate: a structured, version-controlled record of how the brand sounds, looks, decides, and gives feedback. Built once with Momkai during the rollout. Owned by the client. Inherited by every model and surface above it.",
  inputsHeading: "What the studio brings in",
  inputsNote: "From the work the brand team already did.",
  inputs: [
    { id: "strategy", label: "Brand strategy" },
    { id: "voice", label: "Tone of voice" },
    { id: "visual", label: "Visual direction" },
    { id: "claims", label: "Approved language" },
    { id: "past", label: "Past work · the strongest pieces" },
    { id: "review", label: "Review feedback" },
  ] as SubstrateChip[],
  panelTitle: "brand-agent.skill",
  panelMeta: "v0.4 · client-owned · git-versioned",
  panelStrata: [
    {
      id: "voice",
      tag: "Voice",
      name: "How the brand opens, builds, and closes a sentence.",
      meta: "14 rules · 22 examples",
    },
    {
      id: "vision",
      tag: "Vision",
      name: "Strategy, audience, the moral ambition behind the work.",
      meta: "1 strategy · 4 audiences",
    },
    {
      id: "library",
      tag: "Library",
      name: "The strongest pieces shipped, with notes on why they worked.",
      meta: "38 references",
    },
    {
      id: "sources",
      tag: "Sources",
      name: "Where the agent looks first for facts and approved language.",
      meta: "6 documents",
    },
    {
      id: "gates",
      tag: "Gates",
      name: "Three freedom bands — locked, guided, open.",
      meta: "3 bands · 2 reviewers",
    },
    {
      id: "loops",
      tag: "Loops",
      name: "Every approval becomes substrate. Every rejection becomes a rule.",
      meta: "weekly review",
    },
  ] as const,
  panelFootnote: "Readable as prose. Loadable by any model. Owned by the client.",
  surfacesHeading: "Where it shows up",
  surfacesNote: "Wherever the brand team already works.",
  surfaces: [
    { id: "claude", label: "Claude / ChatGPT" },
    { id: "cursor", label: "Cursor / agents" },
    { id: "slack", label: "Slack / Teams" },
    { id: "figma", label: "Figma / decks" },
    { id: "web", label: "Briefing portal" },
    { id: "api", label: "API / MCP" },
  ] as SubstrateChip[],
  promises: [
    {
      id: "captured",
      title: "Captured.",
      body: "Tacit brand judgment becomes a legible, versioned object.",
    },
    {
      id: "owned",
      title: "Owned.",
      body: "The substrate sits in the client's repository, not in our prompt history.",
    },
    {
      id: "portable",
      title: "Portable.",
      body: "Outlives the model underneath, the agency relationship, and the next rebrand.",
    },
  ] as const,
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Surfaces — same colleague, different rooms (interactive)
 * ─────────────────────────────────────────────────────────────────────── */

export type SurfaceLayerId = "voice" | "vision" | "library" | "gates" | "loops";

export const surfacesLayers: { id: SurfaceLayerId; tag: string; name: string }[] = [
  { id: "voice", tag: "Voice", name: "how it sounds" },
  { id: "vision", tag: "Vision", name: "what it stands for" },
  { id: "library", tag: "Library", name: "what good looks like" },
  { id: "gates", tag: "Gates", name: "who reviews what" },
  { id: "loops", tag: "Loops", name: "how it learns" },
];

export type SurfaceTranscriptLine =
  | { type: "user"; text: string }
  | { type: "agent"; text: string }
  | { type: "meta"; text: string };

export type SurfaceCard = {
  id: string;
  label: string;
  name: string;
  room: string;
  layers: SurfaceLayerId[];
  detail: {
    title: string;
    meta: string;
    transcript: SurfaceTranscriptLine[];
  };
};

export const surfacesSection = {
  eyebrow: "Headless by design",
  title: "Same colleague.",
  titleEm: "Different rooms.",
  lede:
    "The Brand Agent is exposed headlessly — the substrate sits in one place, the agent gets invoked wherever the work actually happens. A Claude project for the founder, a Slack assistant for the rollout team, a Figma plugin for design review, an API for everything else. The interface adapts to the room. The brand stays the same.",
  panelHeading: "brand-agent.skill",
  panelMeta: "5 layers · v0.4",
  pickHeading: "Pick a room",
  foot: [
    {
      id: "compounds",
      title: "Substrate compounds.",
      body:
        "Every encoded workflow adds to the same layer. The brand becomes an asset that grows, not a stack of prompts that decay.",
    },
    {
      id: "follows",
      title: "Surfaces follow the work.",
      body:
        "Chat for ideation. Slack for the rollout. Figma for design. API for the systems that don't exist yet. Same engine underneath.",
    },
    {
      id: "carries",
      title: "Models change. Brand carries forward.",
      body:
        "Encoded once. Runs on whatever model the client's stack settles on this quarter, and the next.",
    },
  ],
} as const;

export const surfaces: SurfaceCard[] = [
  {
    id: "chat",
    label: "Chat",
    name: "Founder & strategist",
    room: "Claude project · ChatGPT workspace",
    layers: ["voice", "vision", "library"],
    detail: {
      title: "Claude project · founder workspace",
      meta: "3 layers active",
      transcript: [
        {
          type: "user",
          text:
            "Draft three options for the autumn keynote opener. Audience: foundation directors, room of 200.",
        },
        {
          type: "meta",
          text:
            "Brand Agent reads voice rules, pulls the audience map from vision, surfaces 3 matched references from library.",
        },
        {
          type: "agent",
          text:
            "Three openers, each grounded in the brand's voice rules and the moral ambition the strategy names. Cited references in the margin. The founder picks one and edits in place.",
        },
      ],
    },
  },
  {
    id: "rollout",
    label: "Rollout",
    name: "Campaign & comms team",
    room: "Slack assistant · Teams bot",
    layers: ["voice", "gates", "loops"],
    detail: {
      title: "Slack assistant · #brand-channel",
      meta: "3 layers active",
      transcript: [
        {
          type: "user",
          text:
            "Posting tomorrow morning. Quick check on this LinkedIn post from the new comms hire.",
        },
        {
          type: "meta",
          text:
            "Brand Agent flags two voice drifts, suggests rewrites in the brand's register, routes one factual claim to legal review under the gates contract.",
        },
        {
          type: "agent",
          text:
            "Cleared for posting after a one-line edit. The factual claim is parked for the brand owner — they get a Slack DM with the source request and a one-click approval.",
        },
      ],
    },
  },
  {
    id: "studio",
    label: "Studio",
    name: "Design & art direction",
    room: "Figma plugin · deck reviewer",
    layers: ["vision", "library", "gates"],
    detail: {
      title: "Figma side panel · campaign deck",
      meta: "3 layers active",
      transcript: [
        {
          type: "user",
          text:
            "Review the layout against the visual direction. Suggest copy alternatives for the hero block.",
        },
        {
          type: "meta",
          text:
            "Brand Agent compares the layout to the vision spec, surfaces three references from library, drafts copy in the brand voice without leaving the canvas.",
        },
        {
          type: "agent",
          text:
            "Two principle violations flagged with one-line reasons. Three copy alternatives in the side panel. The designer accepts inline; the change becomes the next library example.",
        },
      ],
    },
  },
  {
    id: "engine",
    label: "Engine",
    name: "Anything else",
    room: "MCP tool · REST endpoint",
    layers: ["voice", "vision", "library", "gates", "loops"],
    detail: {
      title: "POST /v1/brand-check",
      meta: "5 layers active",
      transcript: [
        {
          type: "meta",
          text:
            "Wired into a CRM, a campaign manager, an internal portal, or a future agent surface. Same contract. Same Skill version.",
        },
        {
          type: "user",
          text: "{ \"draft\": \"...\", \"channel\": \"newsletter\", \"audience\": \"donors\" }",
        },
        {
          type: "agent",
          text:
            "{ verdict: \"review\", flags: [voice, claim], rewrite: \"...\", review_required: true }",
        },
      ],
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Anatomy — what lives inside the agent
 * ─────────────────────────────────────────────────────────────────────── */

export const anatomy = {
  eyebrow: "Inside the agent",
  title: "A digital colleague has the same parts",
  titleEm: "as a human one.",
  lede:
    "Not a prompt. Not a fine-tune. A system: source material it reads from, rules it works inside, examples it learns from, freedom bands it respects, and a review loop that lets the team correct it without losing the ground gained.",
  parts: [
    {
      id: "voice",
      label: "Voice",
      sayLabel: "Holds",
      say: "How the brand opens, builds, and closes a sentence — with worked examples per channel and per audience.",
      avoidLabel: "Does not",
      avoid:
        "Invent a new tone for every brief, or smooth every brand into the same neutral marketing voice.",
    },
    {
      id: "vision",
      label: "Vision",
      sayLabel: "Holds",
      say: "The strategy, the audience map, and the moral ambition behind the brand — the why before the what.",
      avoidLabel: "Does not",
      avoid:
        "Drift into generic positioning when the prompt is short or the source material is thin.",
    },
    {
      id: "library",
      label: "Library",
      sayLabel: "Holds",
      say: "The strongest pieces the team has shipped, paired with notes on why they worked.",
      avoidLabel: "Does not",
      avoid: "Rip from the catalogue verbatim, or treat reference work as templates.",
    },
    {
      id: "sources",
      label: "Sources",
      sayLabel: "Holds",
      say: "Where the agent looks first — approved claims, brand book, founder interviews, source documents.",
      avoidLabel: "Does not",
      avoid: "Invent statistics, certifications, or commitments the brand has not made.",
    },
    {
      id: "gates",
      label: "Gates",
      sayLabel: "Holds",
      say: "Three freedom bands — locked for legal and factual, guided for tone and audience, open for headlines and rhythm.",
      avoidLabel: "Does not",
      avoid:
        "Treat every decision as low-risk, or block every draft because something might be high-risk.",
    },
    {
      id: "loops",
      label: "Loops",
      sayLabel: "Holds",
      say: "Every approved correction becomes a new example. Every rejection becomes a new rule.",
      avoidLabel: "Does not",
      avoid:
        "Stay static. The agent that ships is the agent on day one. The agent on day ninety is the one the team has trained.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Brainstorm — how the prototype gets real
 * ─────────────────────────────────────────────────────────────────────── */

export const brainstorm = {
  eyebrow: "The first session",
  title: "Bring one new brand to the studio.",
  titleEm: "We encode the first agent together.",
  lede:
    "This page describes the direction. The product gets real in the brainstorm: one of Momkai's morally ambitious clients, one rollout we want to support, one weekend of encoding, and a first surface the team can use the day after.",
  steps: [
    {
      n: "01",
      label: "Navigate",
      duration: "A day",
      title: "Sit inside the brand.",
      body:
        "Watch the strategy meet the rollout. Find the moments where a digital colleague would change something. Field notes, not a workshop.",
    },
    {
      n: "02",
      label: "Encode",
      duration: "A weekend",
      title: "Turn the work into substrate.",
      body:
        "Brand book, references, founder voice memos, the team's review habits — encoded as voice rules, examples, sources, and gates. Readable as prose. Versioned in git.",
    },
    {
      n: "03",
      label: "Build",
      duration: "A week",
      title: "Ship one surface the team will use.",
      body:
        "A Claude project, a Slack assistant, or a Figma side-panel — whichever the team will actually open on Monday morning. The substrate underneath stays the same.",
    },
  ],
  ownership:
    "What gets built belongs to Momkai. The framework is reusable across clients. Each new agent the studio ships makes the next one faster, and adds to a way of delivering brands no other agency can copy quickly.",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * CTA
 * ─────────────────────────────────────────────────────────────────────── */

export const cta = {
  eyebrow: "Volgende stap",
  title: "Eerste sessie",
  titleEm: "in de studio.",
  body:
    "An afternoon in Amsterdam. Bring one client, one rollout, and the brand book that's about to land. We walk through the substrate, sketch the first agent together, and decide whether to encode it for real.",
  fine: "Geen deck. Geen pitch. Een gesprek over de digitale collega die we gaan bouwen.",
  primary: { label: "Plan a session", href: "mailto:vince@thoughtform.studio?subject=Momkai%20·%20Brand%20Agent" },
  secondary: { label: "Read the briefing back", href: "#brainstorm" },
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Footer
 * ─────────────────────────────────────────────────────────────────────── */

export const footer = {
  line: "Momkai · Brand Agent — A direction for the brainstorm",
  signature: "Concept by Vince Buyssens · Thoughtform",
  studio: "Amsterdam · Berlin",
} as const;

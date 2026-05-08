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
 *   02 Diagnosis     — Four faces, one missing piece. Names the hard
 *                      problem (judgment isn't encoded) before the
 *                      Evans bridge articulates the asking gap.
 *   03 Quote bridge  — Evans on the asking gap. Chip-to-pill morph
 *                      hands the trio's words into the Vision orbit.
 *   04 Vision        — Centered flywheel + one CTA into Approach.
 *   05 Approach      — Navigate / Encode / Build, each with an exec-level
 *                      visual and a Heimdall-style pop-out for detail.
 *   06 Cases         — Showcase grid of four production systems, each
 *                      with a modal walk-through.
 *   07 Headless      — Architecture, not a dashboard. The interstitial
 *                      that sets up the selected case.
 *   08 Selected case — HarvestFields, where everything comes together.
 *   09 CTA           — One ask. Smallest commitment that starts work.
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
    { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
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
    name: "Vince Buyssens",
    title: "Creative Technologist",
  },
  /* Proof grid below the portrait. Mirrors the Loop AI transformation
   * metrics shown on V2; kept here so V1 owns its own hero data and
   * doesn't reach into the V2 content module. */
  proofMetrics: [
    { v: "4", k: "Full-stack\nAI tools" },
    { v: "20+", k: "Workflows encoded\nin Skills" },
    { v: "10+", k: "Self-sufficient teams\nwith Claude" },
    { v: "90%", k: "Paid social content\nwith AI" },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Diagnosis — Four patterns, one missing layer
 *
 * Sits between the Hero and the Quote Bridge. Names the executive-level
 * problem the rest of the page solves: companies already have AI tools,
 * data, and leadership belief, but the embedded adoption layer that
 * helps teams use, encode, and build with AI is missing. The cards
 * pull from organisational patterns any executive recognises, not from
 * marketing-specific examples, so the diagnosis lands for a Head of AI
 * Adoption, a CIO, a CEO, or a marketing/ops sponsor equally.
 *
 * Composition (mirrors the Vision section's title-left + caption-right
 * head pattern so the two read as one rhythm):
 *
 *   1. Header: eyebrow + title on the left, lede paragraph on the right.
 *   2. 2x2 use-case grid where every card shares the same root cause:
 *      tool live without shift, mandate without owner, demo without
 *      traction, data without context.
 *   3. Shared-gap card that names the root cause: the adoption layer is
 *      missing.
 *   4. One-line handoff sentence that bridges to Evans. Frames the
 *      bottleneck as the practical layer that helps people brief, trust,
 *      improve, and build with AI, so the Evans quote that follows reads
 *      as the human-facing articulation of the same idea.
 *
 * Content is the only thing that changes when the page is re-skinned
 * for Delaware, Ml6, or any other client; the structure stays.
 *
 * The handoff sentence deliberately does not preview Navigate / Encode
 * / Build pill chrome. The Quote Bridge keeps its first-reveal of
 * those pills via the chip-to-pill morph.
 * ─────────────────────────────────────────────────────────────────── */

export type DiagnosisTone = "violet" | "gold" | "sage" | "slate";

export type DiagnosisUseCase = {
  n: string;
  tag: string;
  title: string;
  body: string;
  tone: DiagnosisTone;
};

export const diagnosisSection: {
  eyebrow: string;
  title: string;
  titleEm: string;
  lede: string;
  useCases: DiagnosisUseCase[];
  gap: {
    eyebrow: string;
    title: string;
    titleEm: string;
    subline: string;
  };
  handoff: {
    lead: string;
    leadEm: string;
  };
} = {
  eyebrow: "The diagnosis",
  title: "The missing layer is rarely",
  titleEm: "the model.",
  lede:
    "Most companies already have AI tools, data, and executive belief. What they lack is the layer that helps teams use the tools inside real work, encode what good looks like, and turn the useful patterns into capability.",
  useCases: [
    {
      n: "01",
      tag: "Tool deployed, no shift",
      title: "The tool is live, but the workflow did not move.",
      body: "Licenses get used as a faster Google. The work behind the work stays exactly the same.",
      tone: "violet",
    },
    {
      n: "02",
      tag: "Mandate without owner",
      title: "The CEO is convinced, but nobody owns the daily practice.",
      body: "Budget and belief are there. The role that helps teams make AI part of their week is not.",
      tone: "gold",
    },
    {
      n: "03",
      tag: "Demo without traction",
      title: "The prototype works, but the team cannot make it stick.",
      body: "One builder ships a working agent. Next week, the team is back on the old flow.",
      tone: "sage",
    },
    {
      n: "04",
      tag: "Data without context",
      title: "The data is in place, but the model does not know the business.",
      body: "Dashboards say one thing, the lived workflow says another. The model only sees the dashboards.",
      tone: "slate",
    },
  ],
  gap: {
    eyebrow: "Shared gap",
    title: "The adoption layer",
    titleEm: "is missing.",
    subline: "Use · Context · Judgment · Ownership · Build",
  },
  handoff: {
    lead: "Most teams aren't blocked by access to AI.",
    leadEm:
      "They're blocked by the practical layer that helps them brief it, trust it, improve it, and build with it.",
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * Quote bridge — interstitial between hero and Vision
 *
 * Anchors the flywheel to a credible outside diagnosis (Benedict Evans
 * on the asking gap). Lives at full-viewport scale so the Evans
 * sentence has room to breathe; three operative phrases inside the
 * sentence — `working out`, `how to ask`, `what you want` — are framed
 * in their lane colours (violet / amber / sage).
 *
 * On desktop the bridge pins for an extra viewport while the visitor
 * scrolls; during that pin each marked phrase morphs in place into its
 * Navigate / Encode / Build pill counterpart. The `pill` label is the
 * destination text the chip cross-fades into; without it the part is
 * just connective tissue.
 * ─────────────────────────────────────────────────────────────────── */

export type QuoteBridgePart = {
  text: string;
  mark?: "navigate" | "encode" | "build";
  pill?: "Navigate" | "Encode" | "Build";
};

export const quoteBridgeSection = {
  attribName: "Benedict Evans",
  attribMeta: "On the hidden work behind useful AI",
  quoteParts: [
    { text: "A lot of the challenge is " },
    { text: "working out", mark: "navigate", pill: "Navigate" },
    { text: " " },
    { text: "how to ask", mark: "encode", pill: "Encode" },
    { text: " for " },
    { text: "what you want", mark: "build", pill: "Build" },
    { text: "." },
  ] satisfies QuoteBridgePart[],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Reality check — AI is not normal software
 *
 * Sits between the Evans bridge and the Vision flywheel. Names the
 * structural reason the asking gap is hard: AI is interpretive
 * technology, not deterministic software. Without that reframing,
 * traditional adoption rolls out tools, runs trainings, and watches
 * the workflow stay exactly where it was. The reality check earns the
 * flywheel that follows — it explains why a different rhythm is even
 * needed.
 *
 * Composition (mirrors the Software-for-few interstitial pattern):
 *
 *   1. Left column: eyebrow + title + body + strong line + optional CTA.
 *   2. Right column: a 3-row card that contrasts normal software with
 *      AI systems and names the adoption layer as the missing piece.
 *      The middle row (AI systems) carries the highlight because it is
 *      the mental-model shift the visitor needs to internalise before
 *      the flywheel reads as the answer.
 *   3. Foot line: one-sentence takeaway.
 *
 * The section sits inside the `.aiop-bridge-and-reality` wrapper so it
 * slides up over the frozen Evans bridge while the in-place chip-to-
 * pill morph plays out. The cross-section flight to the Vision orbit
 * is intentionally dropped — Vision now appears as a calm next chapter
 * after this beat, not as the immediate flight target.
 * ─────────────────────────────────────────────────────────────────── */

export type AiRealityRow = {
  id: "software" | "ai" | "adoption";
  tag: string;
  detail: string;
  highlight?: boolean;
};

export const aiRealitySection = {
  eyebrow: "The reality check",
  title: "AI is not",
  titleEm: "normal software.",
  body:
    "Normal software waits for exact inputs and follows fixed rules. AI interprets meaning. That's why people struggle to articulate what they want: the real brief isn't the task, it's the context, examples, standards, and judgment around it.",
  bodyStrong:
    "Traditional adoption teaches people where the tool is. AI adoption has to teach people how to work with an intelligence until the practice becomes self-sustaining.",
  rows: [
    {
      id: "software",
      tag: "Normal software",
      detail: "User clicks. System follows rules. Output is predictable.",
    },
    {
      id: "ai",
      tag: "AI systems",
      detail: "User briefs. Model interprets. Human judges. Workflow improves.",
      highlight: true,
    },
    {
      id: "adoption",
      tag: "Adoption layer",
      detail: "The people and substrate that turn this loop into capability.",
    },
  ] satisfies AiRealityRow[],
  foot:
    "Commanding software is easy to train. Briefing intelligence is learned inside the work.",
  actions: [
    { id: "vision", label: "See the flywheel", href: "#vision" },
  ],
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
    "Traditional adoption teaches the tool. The flywheel teaches the practice. Teams navigate AI inside the real work, encode the context that makes it good, and build the surfaces on top. Each pass thickens the substrate, and the next pass starts from there.",
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
    "Road-tested at Loop Earplugs since 2024. First year on the AI Team rolling Claude out across the company, then into Marketing to turn the loop from inside the work, across Studio and Performance. The same motion transfers across teams and across companies.",
  close:
    "The same loop ran on Vesper, Heimdall, Mímir, Babylon, and the company-wide Claude rollout at Loop.",
} as const;

export type ApproachTone = "violet" | "gold" | "sage";

export type RolloutVisual = {
  kind: "rollout";
  title: string;
  sub: string;
  inputs: string[];
  stages: { tag: string; label: string }[];
  outputs: string[];
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
  sections: { heading: string; bullets: string[]; note?: string }[];
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
    headline: "Teach the teams what they are working with",
    body:
      "AI sits between a tool and a collaborator. Deterministic enough to automate, interpretive enough to think with. It's trained on us, but it's not like us. The foundation of the adoption-automation flywheel is knowing how to navigate this intelligence.",
    signal: { k: "Outcome", v: "AI intuition and a workflow brief per team." },
    visual: {
      kind: "rollout",
      title: "Navigate",
      sub: "Inside the workflow",
      inputs: ["The team's actual work", "How they evaluate it"],
      stages: [
        { tag: "01", label: "Baseline" },
        { tag: "02", label: "Question" },
        { tag: "03", label: "Workshop" },
        { tag: "04", label: "Hand off" },
      ],
      outputs: ["AI Intuition", "Workflow brief", "Encode"],
    },
    modal: {
      eyebrow: "01 · Navigate",
      title: "What navigation looks like",
      titleEm: "across an actual cohort.",
      lede:
        "Navigation teaches teams how to work and think with AI inside their real work. One 45-minute session per team is the ignition: people leave briefing AI like a colleague who is smart but missing context, and start using it inside the workflow the same week. AI Stewards inside the team carry the practice forward, and the first candidate Skill from each session becomes the seed Encode turns into substrate.",
      meta: [
        { k: "DURATION", v: "Continuous · 1–2 weeks per team" },
        { k: "ARTIFACT", v: "Workflow brief · maturity model" },
        { k: "OWNER", v: "Operator + cohort lead" },
      ],
      sections: [
        {
          heading: "How the work runs",
          bullets: [
            "Getting Started docs set the baseline.",
            'Every team member answers one question: "What would a smart new colleague need to know?" Each answer becomes a candidate Skill.',
            "45-minute workshop per team. We run each answer through Claude, see where it works and where it breaks, build one Skill before the session ends.",
            "That single session is the ignition: people leave with a working mental model and start briefing AI like a colleague the same week.",
            "The session gets transcribed into a Monday doc the team owns and updates.",
            "AI Stewards inside the team take it from there. Bi-weekly showcases let other teams copy what works.",
          ],
        },
        {
          heading: "What it produced at Loop",
          bullets: [
            "One of the first brands in Belgium to put ChatGPT Enterprise into daily production, in 2024.",
            "Full mandate on the Claude Enterprise rollout, from adoption to aligning with legal, IT, and founders.",
            "Scalable plan across 15+ teams, built to make every Looper self-sufficient.",
            "Claude Skills + Monday automation surfacing weekly progress and wins.",
          ],
          note: "None of this is Claude-specific — the fluency transfers to any generative AI tool.",
        },
      ],
      signal: "Adoption runs as a cohort with shared infrastructure under every step.",
    },
  },
  {
    id: "encode",
    label: "Encode",
    tone: "gold",
    headline: "Turn how the team works into a layer that outlives the model.",
    body:
      "The model doesn't know your brand, your standards, or your review process. You have to teach it — this is the adoption layer the diagnosis named, written down. At Loop, I encoded 10+ workflows into a portable machine substrate: brand voice, claim gates, creative prompting, marketplace copy. A teammate can read it and an agent can run on it. Models change, but the encoded layer carries forward.",
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
      foot: "Connects to your data without replacing it.",
    },
    modal: {
      eyebrow: "02 · Encode",
      title: "What encoding looks like",
      titleEm: "as substrate the team owns.",
      lede:
        "The same pattern showing up everywhere: structured knowledge the model can stand on. At the team level, that means capturing how decisions get made, what good output looks like, and where the authoritative data lives. The operator drafts. The team ratifies. Git versions. Portable across models from day one.",
      meta: [
        { k: "CADENCE", v: "Drafted weekly · ratified by review" },
        { k: "ARTIFACT", v: "Skill bundle (Markdown + examples)" },
        { k: "OWNER", v: "Cohort + operator" },
      ],
      sections: [
        {
          heading: "Anatomy of a Skill",
          bullets: [
            "How the team decides — brand rules, claim gates, locked policies.",
            "What good looks like — approved work, rejected drafts, the difference between them.",
            "Where the data lives — briefs, boards, registries, linked not copied.",
            "Who confirms — review gates, escalation paths, what gets logged.",
          ],
        },
        {
          heading: "Encoded at Loop",
          bullets: [
            "10+ reusable Skills shipped across Studio, Performance, CRM, E-commerce, People, Legal, and UGC.",
            "Loopers teach each other how to use them. Non-technical team members build their own automations in Cowork.",
            "Each Skill exposed headlessly so any model-powered surface can call it.",
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
    headline: "Hand the team a running system they actually own.",
    body:
      "Once the bottleneck is named and the process encoded, building is the fast part. I capture user frustrations in a Teams call, turn the transcript into a user story in Cursor, and either build the interface around it or expose the logic headlessly via MCP/API. Then I hand it to the person I built it for. Nobody understands their domain better than they do.",
    signal: { k: "Outcome", v: "A thin running surface the team uses daily." },
    visual: {
      kind: "engine",
      title: "Every surface inherits the engine.",
      sub: "Headless first.",
      surfaces: [
        { icon: "⌘", name: "Chat", verb: "Claude · Cursor" },
        { icon: "{ }", name: "API", verb: "MCP · REST" },
        { icon: "◐", name: "Agent", verb: "Scheduled · autonomous" },
        { icon: "⤴", name: "In-tool", verb: "Slack · Figma · Monday" },
      ],
      meta: { k: "Posture", v: "Headless architecture" },
    },
    modal: {
      eyebrow: "03 · Build",
      title: "What building looks like",
      titleEm: "from prototype to production.",
      lede:
        "Vibe-coded prototypes within days. Hardened to production over the following weeks. Live next to the work in Slack, Figma, Monday, custom UIs. Same engine exposed via REST, MCP, scheduled agents, in-tool buttons. The interface is one face of many.",
      meta: [
        { k: "TEMPO", v: "Days to demo · weeks to harden" },
        { k: "SHAPE", v: "Engine + surfaces · headless first" },
        { k: "STACK", v: "Next.js · Supabase · Anthropic · MCP" },
      ],
      sections: [
        {
          heading: "How it ships",
          bullets: [
            "Day-one prototype on the team's actual work. No deck-first detours.",
            "Operator vibe-codes and hardens in the same loop. No handoff between prototype and production.",
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
      signal: "The engine underneath is the asset every interface inherits.",
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
    "At Loop, software for few became practical. Sitting inside the teams meant I could compress existing workflows, repair broken handoffs, and invent new ones from scratch with AI.",
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
  challenge: string;
  tone: CaseTone;
  workflowMode: WorkflowMode;
  workflowBefore: string;
  workflowAfter: string;
  capabilities: { k: string; v: string }[];
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
    challenge:
      "Creative Strategy drove the briefings, but each cycle meant manual digging across Reddit, ad dashboards, Meta Ad Library, and past notes, with Loop's proprietary ad data too sensitive to hand to outside tools.",
    tone: "gold",
    workflowMode: "Invent",
    workflowBefore:
      "Creative Strategy assembled briefs from memory across Reddit, Meta Ad Library, ad performance spreadsheets, and review notes. Every cycle started from scratch.",
    workflowAfter:
      "Mímir unifies customer voice, ad performance, competitive signals, and prior briefings into a permissioned knowledge graph that surfaces relevant insight while a brief is being written.",
    capabilities: [
      { k: "Permissioned graph", v: "Customer voice, paid performance, competitor ads, and prior strategy as one substrate." },
      { k: "Proactive briefing", v: "Relevant insights surface while strategists compose the brief, not after another search pass." },
      { k: "Headless substrate", v: "The same interpretation layer answers the web app, Claude, Cursor, Slack, and ChatGPT." },
      { k: "Shared BI layer", v: "Expanded from Creative Strategy into Insights and Product Marketing use cases." },
    ],
    surfaces: ["Web app", "MCP server", "Claude", "Cursor", "Slack", "ChatGPT"],
    stack: ["Next.js", "Supabase", "Gemini", "Claude Skills", "MCP", "Slack"],
    companyLeverage:
      "Started with Creative Strategy, then expanded to Insights and Product Marketing. The key move was encoding how Loop reads customer voice, paid performance, competitors, and prior strategy into a substrate any surface can inherit.",
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
    challenge:
      "Studio was losing creative flow to scattered generation tools, opaque costs, and too many model choices. The team needed one opinionated canvas tied to Loop's product context.",
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
    surfaces: ["Web app", "MCP server", "REST", "Claude / Cursor"],
    stack: ["Next.js", "TanStack Query", "Supabase", "Prisma", "Anthropic", "Gemini", "Replicate", "Kling"],
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
    challenge:
      "UGC localization had to scale across 30+ markets without turning every language into another agency handoff, Figma copy-paste loop, and reviewer queue.",
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
    challenge:
      "Briefs, design work, assets, and feedback lived in different tools. Every handoff lost structure, added copy-paste, and made pixels hard to trace back to strategy.",
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
 * Software-for-few interstitial — the gap the operator works in
 *
 * A near-full-bleed parallax slide that bridges the flywheel breakdown
 * and the in-production cases. Names the market gap (off-the-shelf
 * SaaS too generic, dev agencies too expensive) and frames the cases
 * that follow as software built by the team that uses it. Visually
 * complementary to the gold-led approach rows: the slide leans into
 * the sage lane so it reads as a deliberate pause before the cases
 * pick the gold rhythm back up.
 * ─────────────────────────────────────────────────────────────────── */

export type SoftwareForFewRow = {
  id: "saas" | "few" | "agency";
  label: string;
  detail: string;
  tag: string;
  highlight?: boolean;
};

export const softwareForFewSection = {
  title: "Software",
  titleEm: "for few.",
  body:
    "The late-2025 leap in AI models opened a new category: people with a clear read on their users and workflows can now build software for few. The deeper shift is headless: the interface stays temporary while the engine underneath compounds across surfaces.",
  actions: [
    { id: "cases", label: "Explore cases", href: "#cases" },
    { id: "headless", label: "Headless vision", href: "#headless" },
  ],
  rows: [
    {
      id: "saas",
      label: "Off-the-shelf SaaS",
      detail: "Generic. Built for millions.",
      tag: "Too broad",
    },
    {
      id: "few",
      label: "Software for few",
      detail: "Specific. Built by the team that uses it.",
      tag: "The gap",
      highlight: true,
    },
    {
      id: "agency",
      label: "Dev agency",
      detail: "Custom, but too expensive for a team of ten.",
      tag: "Too costly",
    },
  ] satisfies SoftwareForFewRow[],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Headless-shift interstitial — Salesforce / Stripe / Loop → Stripe
 *
 * Second colored-bleed transition slide of the route, mirroring the
 * Software-for-few pattern (left copy + right card). Sits between
 * the cases and the architecture deep-dive: names the headless shift
 * with two fast proof points (Salesforce Headless 360, Stripe's Link
 * CLI), then lands the personal angle — same posture brought to
 * Mímir / Vesper / Heimdall / Babylon at Loop, intent to bring the
 * same to Stripe.
 *
 * The right-side card is a mini Encode → Build flywheel preview:
 * the encode block carries a compact substrate stack; the build
 * block carries the headless interface (MCP/API/CLI tabs, snippet,
 * surfaces grid). The two blocks are joined by an "exposed
 * headlessly" connector that names the transition between them so
 * the encode-pill → build-pill rhyme reads at a glance and primes
 * the substrate-and-surfaces vocabulary the deep section unpacks.
 * ─────────────────────────────────────────────────────────────────── */

export type HeadlessShiftSurface = {
  id: string;
  icon: string;
  name: string;
};

export type HeadlessShiftTab = {
  id: "mcp" | "api" | "cli";
  label: string;
  note?: string;
  active?: boolean;
};

export type HeadlessShiftLayer = {
  tag: string;
  name: string;
};

export const headlessShiftSection = {
  title: "Software is going",
  titleEm: "headless.",
  body:
    "Salesforce shipped Headless 360. Stripe shipped a Link CLI you drive from your terminal. Both shipped the engine and let the interface follow.",
  bodyStrong:
    "I brought Mímir, Vesper, Heimdall, and Babylon headless at Loop, where the same substrate served every surface. I want to bring that posture inside Stripe.",
  actions: [
    { id: "headless", label: "See the architecture", href: "#headless" },
    { id: "harvestfields", label: "Selected case", href: "#harvestfields" },
  ],
  preview: {
    eyebrow: "Mímir headless",
    badge: "Source → Surface",
    substrate: {
      pill: "Encode",
      title: "Encoded substrate",
      layers: [
        { tag: "Rules", name: "How the team decides" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Sources", name: "Data it can read" },
      ] satisfies HeadlessShiftLayer[],
    },
    connector: "Exposed headlessly",
    interface: {
      pill: "Build",
      title: "Headless interface",
      tabs: [
        { id: "mcp", label: "MCP", note: "Default", active: true },
        { id: "api", label: "API" },
        { id: "cli", label: "CLI" },
      ] satisfies HeadlessShiftTab[],
      snippetLabel: "Add as MCP server",
      snippetUrl: "https://<mimir>/api/mcp",
      surfacesLabel: "All surfaces",
      surfaces: [
        { id: "cursor", icon: "C", name: "Cursor" },
        { id: "claude", icon: "Cl", name: "Claude" },
        { id: "web", icon: "◐", name: "Web app" },
        { id: "rest", icon: "{ }", name: "REST" },
        { id: "slack", icon: "#", name: "Slack" },
        { id: "agents", icon: "A", name: "Agents" },
      ] satisfies HeadlessShiftSurface[],
    },
    foot: "One token. Six surfaces. Same engine.",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Headless interstitial — architecture, not a dashboard
 *
 * Sets up the selected case. Names the architectural shift behind every
 * production system above. Same engine, many surfaces. Build the engine,
 * not the dashboard. The substrate is the asset.
 * ─────────────────────────────────────────────────────────────────── */

export const headlessSection = {
  eyebrow: "Engine architecture",
  title: "The engine is",
  titleEm: "what every future surface inherits.",
  lede:
    "Salesforce shipped Headless 360. Stripe shipped agentic infrastructure. Same pattern across both: the substrate is what compounds, while the interface stays a temporary face on top of it. Mímir and Vesper both moved that way at Loop.",
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
        "Every workflow encoded adds to the same layer. Models change underneath, and the substrate keeps carrying forward.",
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
        "Built by the team that uses it, for the ten people who ship every day.",
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
    "Where Navigate, Encode, and Build come together on a brand the size of Vandemoortele. Localisation needs speed and brand review needs control. Both run into the same wall: brand memory lives in lead heads, never in the brief. Encoding the brand memory once shrinks both problems.",
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

/*
 * Intelligence Layer — Homepage V3.
 *
 * Route-local content for /intelligence-layer-v3. Forked from
 * `content/intelligence-layer.ts` so V3 can diverge without touching
 * the canonical homepage (`/`) or the shared role / use-case data.
 *
 * V3 reframes the page around one harmonised story:
 *   - Vince's qualitative half — encoded substrate (Skills, voice,
 *     judgment) — and Koen's quantitative half — the knowledge graph
 *     — fuse into one intelligence layer. The page names this out
 *     loud and adds the missing pieces (workshop numbers, roadmap,
 *     who builds it, exec ask) the leadership deck needs.
 *
 * Section composition lives in `app/intelligence-layer-v3/page.tsx`.
 * This file owns the copy + structural typing only.
 */

export type V3HeroAction = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
};

export type V3HeroLine = string | { em: string };

export type V3PageMeta = {
  brandLeft: string;
  brandSub: string;
  status: string;
  links: readonly { id: string; label: string; href: string }[];
};

/* ─────────────────────────────────────────────────────────────────────
 * Page chrome — header, nav, status pill.
 *
 * Nav order matches the V3 reading order: Diagnosis → The layer →
 * Receipts → The plan → Who builds it. The live composer is dropped
 * from V3 (the briefing-agent demo is shown separately at leadership
 * days), so the `engine` anchor goes with it. `vision` /
 * `substrate-gallery` deep-dive anchors are also kept out of the
 * strip since exec scrollers do not need them in the nav.
 * ─────────────────────────────────────────────────────────────────── */

export const v3PageMeta: V3PageMeta = {
  brandLeft: "Aether",
  brandSub: "Loop\u2019s Intelligence Layer \u00b7 v3",
  status: "Running \u00b7 13 teams",
  links: [
    { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
    { id: "layer", label: "The layer", href: "#layer" },
    { id: "engine-pattern", label: "Receipts", href: "#engine-pattern" },
    { id: "roadmap", label: "The plan", href: "#roadmap" },
    { id: "who-builds", label: "Who builds it", href: "#who-builds" },
  ],
};

/* ─────────────────────────────────────────────────────────────────────
 * Hero
 *
 * Title leads with ownership ("the layer Loop owns — and what's left
 * to build"). The lede harmonises both halves in one sentence: every
 * team's way of working, encoded; every Loop dataset, connected. CTAs
 * point at the two pieces the exec audience cares about — the gap
 * (#layer) and the plan (#roadmap).
 * ─────────────────────────────────────────────────────────────────── */

export const v3PageHero = {
  titleLines: [
    "The intelligence layer Loop owns",
    { em: "and what\u2019s left to build." },
  ] as const,
  lede: [
    "Every team\u2019s way of working, encoded so any AI can use it. Every Loop dataset, connected so any agent can reason across it. One layer. Owned internally.",
  ] as const,
  actions: [
    { id: "see-gap", label: "See what\u2019s missing", href: "#layer", primary: true },
    { id: "read-plan", label: "Read the plan", href: "#roadmap" },
  ] satisfies V3HeroAction[],
};

/* ─────────────────────────────────────────────────────────────────────
 * Diagnosis header
 *
 * Same anchor phrase as `/` so a stakeholder arriving from the
 * canonical homepage reads V3 as a continuation. The sub is tuned
 * for the exec audience — names the consequence ("every new tool,
 * hire, or model has to learn Loop from scratch") rather than the
 * mechanics.
 * ─────────────────────────────────────────────────────────────────── */

export const v3DiagnosisHead = {
  title: "We have the know-how,",
  titleEm: "but it isn\u2019t compounding yet.",
  sub:
    "The know-how lives in heads, and the system can\u2019t see it. So every new tool, hire, or model has to learn Loop from scratch. Pick a function below to see where it stalls.",
};

/* ─────────────────────────────────────────────────────────────────────
 * The Intelligence Layer — 3-column diagram (V3 harmonisation)
 *
 * Mirrors the canonical homepage's three-column substrate map
 * (Trusted Sources / Encoded Substrate / Headless Surfaces) exactly,
 * with one structural change: the Knowledge Graph moves out of the
 * Trusted Sources column and into the Encoded Substrate column. The
 * encoded-substrate column then carries BOTH halves of what the
 * layer encodes — the entities the layer reasons over (the graph)
 * and the rules / examples / voice / loops that capture how the
 * team decides about them.
 *
 *   01 Trusted sources    — data systems, no ontology
 *   02 Encoded substrate  — KG entities + rules / examples / voice / loops
 *   03 Headless surfaces  — interfaces that call the layer
 *
 * Title restates the diagnosis as the layer's job ("what's missing").
 * Lede names both halves explicitly so the exec reader sees the
 * harmonisation in plain English before the diagram resolves it.
 * Closing line lands the ownership claim — Loop owns the schema +
 * the substrate, partners plug in around it.
 * ─────────────────────────────────────────────────────────────────── */

export type V3LayerColumn = {
  n: string;
  kicker: string;
  title: string;
  caption: string;
};

export type V3LayerSources = V3LayerColumn & {
  systems: { items: readonly string[] };
};

export type V3LayerSubstrate = V3LayerColumn & {
  /** Knowledge graph entities fused into the substrate column. */
  ontology: {
    kind: string;
    objects: readonly string[];
  };
  /** Second "ontology" line, parallel to `ontology` but for Claude
      Skills. Names the artifact that holds the substrate so the
      RULES / EXAMPLES / VOICE / LOOPS rows below read as the
      anatomy of one Skill, not as a free-floating concept. */
  skills: {
    kind: string;
    description: string;
  };
  items: readonly { tag: string; name: string }[];
  tags: readonly string[];
};

export type V3LayerSurfaces = V3LayerColumn & {
  items: readonly { icon: string; name: string }[];
};

export const v3LayerSection = {
  id: "layer",
  title: "What\u2019s missing is an",
  titleEm: "intelligence layer.",
  lede:
    "Loop already runs the data systems and the teams already encode how they decide. The layer is what connects them \u2014 the knowledge graph that makes the data queryable, and the encoded substrate that captures how the team decides. Quantitative + qualitative. One layer.",
  columns: {
    sources: {
      n: "01",
      kicker: "Trusted sources",
      title: "Where the work already lives.",
      caption:
        "The systems Loop already runs. No new database, no migration.",
      systems: {
        items: [
          "SAP S/4 HANA",
          "Snowflake",
          "ThoughtSpot",
          "Frontify",
          "Monday",
          "Notion",
          "Klaviyo",
          "Shopify",
        ],
      },
    } satisfies V3LayerSources,
    substrate: {
      n: "02",
      kicker: "Encoded substrate",
      title: "How the layer encodes the work.",
      caption:
        "The graph names the entities. Claude Skills name how each team decides about them \u2014 encoded once, owned internally, model-portable.",
      ontology: {
        kind: "Knowledge graph",
        objects: [
          "Customer",
          "Brief",
          "Persona",
          "Hook",
          "Campaign",
          "Product / SKU",
          "Market",
          "Margin",
        ],
      },
      skills: {
        kind: "Claude Skills",
        description:
          "Versioned bundles capturing how each team decides. Anatomy below.",
      },
      items: [
        { tag: "Rules", name: "How the team decides" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Voice", name: "How Loop sounds" },
        { tag: "Loops", name: "Who confirms what" },
      ],
      tags: ["Owned internally", "Versioned", "Model-portable"],
    } satisfies V3LayerSubstrate,
    surfaces: {
      n: "03",
      kicker: "Headless surfaces",
      title: "Where Loop calls the layer.",
      caption:
        "Same layer underneath, many surfaces on top. MCP is the contract; the surface is interchangeable.",
      items: [
        { icon: "Cl", name: "Claude" },
        { icon: "C", name: "Cursor" },
        { icon: "\u25D0", name: "Web app" },
        { icon: "{ }", name: "REST" },
        { icon: "#", name: "Slack" },
        { icon: "A", name: "Agents" },
      ],
    } satisfies V3LayerSurfaces,
  },
  closing:
    "Loop owns the ontology, the schema, the substrate. Partners plug in around it.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Labs Signal override
 *
 * Widens the existing four-card signal (Palantir, Stripe, OpenAI,
 * Anthropic) from FDE-only to FDE + knowledge-graph. The cards stay
 * (single source of truth: `signalSection.cards`). V3 overrides
 * `title`, `titleEm`, `titleAfter`, and `sub` so the framing names
 * both threads — "same architecture, different angles."
 * ─────────────────────────────────────────────────────────────────── */

export const v3SignalOverride = {
  id: "signal",
  eyebrow: "The signal",
  title: "The labs just bet",
  titleEm: "billions",
  titleAfter: "on the same layer.",
  sub:
    "Same architecture, different angles. Palantir productised the ontology, Stripe is deploying engineers inside marketing, OpenAI and Anthropic are wrapping both into joint ventures. The deployment problem and the graph problem are the same problem.",
  masthead: {
    name: "The Deployment Beat",
    issue: "VOL. I \u00b7 NO. 1",
    track: "FRONTIER AI \u00b7 ENTERPRISE",
    date: "MAY 2026",
  },
  closing: {
    lead: "Loop already has the proof in-house.",
    accent: "The question is whether we formalise the layer.",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * What we have done with Claude — unified Navigate + Encode + receipts
 *
 * Replaces the old Workshop Impact + Approach + EncodingInterstitial
 * trio. Sits after the Vision flywheel and before TheShift, framed
 * for the leadership audience: "we have been running workshops, we
 * have been encoding the work, here is what came out."
 *
 * Composition:
 *
 *   - Editorial header (no eyebrow).
 *   - Three phase columns side-by-side. Each carries a flywheel
 *     phase label, a large count numeral, one short body sentence,
 *     and a chip strip of receipts.
 *   - A quiet wins triplet underneath (Variance, Quality Auditor,
 *     CMF) so the numbers do not read as vanity metrics.
 *
 * Numbers pulled from the SLD brief snapshot (18 May).
 * ─────────────────────────────────────────────────────────────── */

export type V3QualitativeWin = {
  id: string;
  team: string;
  owner: string;
  title: string;
  body: string;
};

export type V3WhatWeveDonePhase = {
  id: "navigate" | "encode" | "build";
  phase: string;
  count: string;
  countSuffix?: string;
  body: string;
  receipts: readonly string[];
};

export const v3WhatWeveDoneSection = {
  id: "what-weve-done",
  title: "What we have done",
  titleEm: "with Claude.",
  sub:
    "We ran workshops to teach the team how to prompt and navigate AI. We showed them how to encode their work as Skills. Here is what came out.",
  phases: [
    {
      id: "navigate",
      phase: "Navigate",
      count: "13",
      countSuffix: "workshops",
      body:
        "One team at a time, inside their real work. The team brings the workflow, we teach them how to navigate Claude.",
      receipts: [
        "Legal",
        "Finance & Accounting",
        "Product Design",
        "Program Management",
        "Warehousing & Customer Ops",
        "Brand & Partnerships",
        "People Ops",
        "Product Engineering",
      ],
    },
    {
      id: "encode",
      phase: "Encode",
      count: "14",
      countSuffix: "Skills shipped",
      body:
        "Senior judgment becomes substrate. Rules, examples, voice, review gates \u2014 encoded once, callable from any surface.",
      receipts: [
        "12 in active build",
        "11 teams scheduled next 6 weeks",
        "5 AI Stewards named",
      ],
    },
    {
      id: "build",
      phase: "Build",
      count: "~130",
      countSuffix: "enterprise seats",
      body:
        "Encoded substrate gets wired into tools. Vesper, M\u00edmir, agents \u2014 all reading the same layer.",
      receipts: [
        "Vesper inherits CMF",
        "M\u00edmir runs the marketing calendar",
        "SSO + MCP under legal review",
      ],
    },
  ] satisfies V3WhatWeveDonePhase[],
  winsKicker: "Already in production",
  wins: [
    {
      id: "variance",
      team: "Finance & Accounting",
      owner: "Helen",
      title: "Variance Commentary",
      body:
        "Month-end variance commentary drafted by the Skill, reviewed by Helen. Sounds like Helen. Hours back every period.",
    },
    {
      id: "quality",
      team: "Warehousing & Customer Ops",
      owner: "Toby",
      title: "Quality Auditor",
      body:
        "Full ticket coverage against Maud\u2019s scorecard. Outliers float to the top. Manual sampling becomes a weekly trend report.",
    },
    {
      id: "cmf",
      team: "Product Design",
      owner: "Damien",
      title: "CMF File Generator",
      body:
        "Excel schema in, manufacturer-ready PDF out. Wired into Vesper. CMF generation runs almost end-to-end inside the tool.",
    },
  ] satisfies V3QualitativeWin[],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Roadmap question — quote-only interstitial before the Roadmap.
 *
 * Sits between the live engine demo and the Roadmap section. Reuses
 * the canonical `aiop-question-bridge__*` chrome (atmospheric bleed
 * + italic display question) but renders as a static beat, not a
 * parallax pair. The user explicitly asked for "just a quote."
 * ─────────────────────────────────────────────────────────────── */

export const v3RoadmapQuestion = {
  id: "roadmap-question",
  ariaLabel:
    "Interlude question that opens the two-track plan below",
  question: "OK. So how do we scale this?",
} as const;


/* ─────────────────────────────────────────────────────────────────────
 * Skills carousel — header override
 *
 * Reuses the canonical `EnginePattern` carousel. The header restores
 * the canonical homepage phrasing ("The Skills, already filling the
 * layer") now that the standalone Workshop Impact section above it
 * is gone. The carousel reads as the qualitative receipts behind
 * the layer, paired with the live composer below.
 * ─────────────────────────────────────────────────────────────── */

export const v3EnginePatternHeader = {
  id: "engine-pattern",
  ariaLabel:
    "The Skills already filling the intelligence layer \u2014 fifteen Skills, three visible at a time",
  header: {
    title: "",
    titleEm: "The Skills, already filling the layer.",
    titleEmHighlight: "Skills",
    sub:
      "Each card is one team\u2019s workflow, encoded as substrate other teams can call into. Some shipped, some in build, all running on the same engine. The know-how is starting to compound.",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Roadmap — Koen's Stage 0 / 1 / 2 / 3 plus the 12-week Stage 1 plan
 *
 * Net-new section. Anchors at `#roadmap`. Lifts the four-stage
 * roadmap from the Loop_Intelligence.docx scoping doc and pairs it
 * with a compressed 12-week Stage 1 strip so the exec reader sees
 * both the long arc and the immediate next move on one page.
 *
 * Voice follows thoughtform-strategy rules: short declaratives, no
 * em dashes between balanced short pairs, no forced rule-of-three.
 * ─────────────────────────────────────────────────────────────────── */

export type V3RoadmapStage = {
  id: string;
  n: string;
  badge: string;
  when: string;
  title: string;
  body: string;
  outputs: readonly string[];
  current?: boolean;
};

export type V3RoadmapWeekBlock = {
  id: string;
  weeks: string;
  focus: string;
  outcome: string;
};

export const v3RoadmapSection = {
  id: "roadmap",
  title: "The data track,",
  titleEm: "in four stages.",
  sub:
    "Build the knowledge graph Loop owns. Make it headless across every surface via MCP. From today\u2019s linear pipeline to a world model Loop runs.",
  principleStripLabel: "Principle",
  principleStripBody:
    "Loop owns the ontology, the schema, and the MCP contracts. Platforms are evaluated for acceleration without surrendering ownership.",
  stages: [
    {
      id: "stage-0",
      n: "Stage 0",
      badge: "Today",
      when: "Now",
      title: "Linear pipeline.",
      body:
        "Data flows to models, models to dashboards, dashboards to humans. Claude is available for single-source analysis. No cross-domain intelligence.",
      outputs: [
        "Snowflake data models (sales, CM, customer)",
        "ThoughtSpot + Pigment dashboards",
        "Insights Hub GPT v1 \u00b7 Proteus application layer",
        "Claude on isolated data models",
      ],
      current: true,
    },
    {
      id: "stage-1",
      n: "Stage 1",
      badge: "Q2\u2013Q4 2026",
      when: "12 weeks to architecture brief",
      title: "Foundation. Build the graph.",
      body:
        "Build the knowledge graph around two use cases in parallel. I&A defines the semantic layer; D&AI Engineering builds it. First Claude Skills wired into the graph via MCP.",
      outputs: [
        "Paid social KG \u00b7 commercial KG (one schema, expandable)",
        "MCP track A \u00b7 Meta ad performance \u2192 Claude",
        "MCP track B \u00b7 Snowflake sales + CM \u2192 Claude",
        "Governance + permission model defined",
        "Architecture brief \u00b7 Stage 2 ready",
      ],
    },
    {
      id: "stage-2",
      n: "Stage 2",
      badge: "Q1\u2013Q2 2027",
      when: "Headless service",
      title: "Intelligence layer goes headless.",
      body:
        "The IL becomes a service on top of the graph. Detects, interprets, routes. First agent workflows. Architecture becomes headless \u2014 any surface queries the same brain.",
      outputs: [
        "Intelligence layer live as a headless service via MCP",
        "Ad brief agent grounded in the graph",
        "CM anomaly spikes classified + routed automatically",
        "Loop Brain queryable via Claude MCP across teams",
        "Memory loop active \u00b7 world model v0.1 in place",
      ],
    },
    {
      id: "stage-3",
      n: "Stage 3",
      badge: "Q2+ 2027",
      when: "World model",
      title: "The graph expands.",
      body:
        "The same graph, fully expanded. Paid social, customer, commercial, operational \u2014 all reasoning surfaces inherit it. Every interaction enriches the model.",
      outputs: [
        "Cross-domain reasoning at exec level",
        "Permission-aware queries across qualitative + quantitative",
        "Headless surfaces for every Loop function",
      ],
    },
  ] satisfies V3RoadmapStage[],
  weeksKicker: "Stage 1 \u00b7 12 weeks",
  weeksLede:
    "What the first quarter produces, week by week. Once Exec, Tech, and I&A align on direction, this is the immediate plan.",
  weekBlocks: [
    {
      id: "w1-3",
      weeks: "Weeks 1\u20133",
      focus: "Kick-off \u00b7 Inku exchange \u00b7 first MCP connections",
      outcome:
        "Data inventory framework agreed. MCP track A (Meta ad performance) and track B (Snowflake sales/CM) connected to Claude. First conversational queries live.",
    },
    {
      id: "w4-6",
      weeks: "Weeks 4\u20136",
      focus: "Inventory \u00b7 ontology drafts \u00b7 platform exploration",
      outcome:
        "All data sources scored. Paid social + commercial entity ontologies drafted. First skills built on track A (creative fatigue, audience signals) and track B (CM anomaly, trading meeting briefing).",
    },
    {
      id: "w7-9",
      weeks: "Weeks 7\u20139",
      focus: "Buy vs build \u00b7 governance model \u00b7 skills validation",
      outcome:
        "Platform recommendation drafted. Governance and access model defined. Ontology v0.1 validated. Freelance architect shortlisted or engaged.",
    },
    {
      id: "w10-12",
      weeks: "Weeks 10\u201312",
      focus: "Architecture brief \u00b7 Stage 2 ready",
      outcome:
        "Full architecture brief written. Schema, platform, MCP contract design, data source connection plan, governance and permission model. Resourcing confirmed. Stage 2 build can start immediately.",
    },
  ] satisfies V3RoadmapWeekBlock[],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Who builds it — two-track exec summary
 *
 * Side-by-side composition. Two halves of the intelligence layer
 * visualised at a glance:
 *
 *   - LEFT   Adoption track  (qualitative)  Already running
 *            Workshops, encoded Skills, wiring into tools.
 *   - RIGHT  Data track      (quantitative) Being scoped
 *            Knowledge graph, ontology, MCP, headless layer.
 *
 * One outro line names them as halves of the same initiative.
 * ─────────────────────────────────────────────────────────────────── */

export type V3Track = {
  id: "adoption" | "data";
  label: string;
  status: string;
  statusTone: "live" | "scoping";
  half: string;
  title: string;
  body: string;
  receiptsKicker: string;
  receipts: readonly string[];
  ownersKicker: string;
  owners: readonly string[];
};

export const v3WhoBuildsSection = {
  id: "who-builds",
  title: "Joint initiative.",
  titleEm: "Loop-owned.",
  sub:
    "Two halves of one intelligence layer. The adoption track is already running. The data track is being scoped right now.",
  tracks: [
    {
      id: "adoption",
      label: "Adoption",
      status: "Already running",
      statusTone: "live",
      half: "The qualitative half",
      title: "Workshops, Skills, the flywheel.",
      body:
        "Navigate, encode, build. One team at a time, inside their real work. The layer fills as the team encodes how it actually decides.",
      receiptsKicker: "Receipts",
      receipts: [
        "13 workshops run",
        "14 Skills shipped",
        "12 Skills in active build",
        "5 AI Stewards named",
        "~130 enterprise seats",
      ],
      ownersKicker: "Owned by",
      owners: [
        "AI Adoption function (Vince + Astrid)",
        "Stewards inside every team",
      ],
    },
    {
      id: "data",
      label: "Data",
      status: "Being scoped",
      statusTone: "scoping",
      half: "The quantitative half",
      title: "Knowledge graph, ontology, MCP.",
      body:
        "Build the graph Loop owns. Make it headless across surfaces via MCP. Connect the data Loop already runs into one queryable ontology.",
      receiptsKicker: "Next move",
      receipts: [
        "Stage 1 architecture brief in flight",
        "12-week plan ready to start",
        "Senior AI engineer or freelance architect to anchor the ontology",
      ],
      ownersKicker: "Owned by",
      owners: [
        "Data & AI Engineering (technical execution)",
        "Insights & Analytics (semantic ownership)",
        "Every business domain (own their semantics)",
      ],
    },
  ] satisfies V3Track[],
  outro: "Two halves of the same intelligence layer.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Vision — V3 caption override
 *
 * Same chrome as the canonical homepage's vision section (no lead-in
 * span). V3 only overrides the title + caption so the flywheel deep
 * dive sits alongside the new technical roadmap without re-arguing
 * the case.
 * ─────────────────────────────────────────────────────────────────── */

export const v3VisionSection = {
  title: "Good automation starts with",
  titleEm: "the right adoption.",
  caption:
    "Navigate first. Then encode what works into something both the team and the agents you build can reuse. Tacit knowledge stops living with a few people, and the team takes on work it couldn\u2019t do before.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Close — exec ask (replaces CloseAiop on V3)
 *
 * Three concrete moves the leadership can decide on. Each ask is a
 * verb-first headline + one-sentence body so the page closes on
 * what the co-founder is actually being asked to greenlight.
 * Primary CTA points at the scoping doc; secondary at the live
 * workshop record on Monday.
 * ─────────────────────────────────────────────────────────────────── */

export type V3ExecAsk = {
  id: string;
  n: string;
  verb: string;
  title: string;
  body: string;
};

export type V3ExecAction = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
  external?: boolean;
};

export const v3CloseExecAskSection = {
  id: "close",
  title: "Three moves.",
  titleEm: "Decided this quarter.",
  sub:
    "The receipts are in. The labs are spending billions on the same layer. The architectural moment is now \u2014 while the momentum is live and before the labs sell the layer back to us.",
  asks: [
    {
      id: "fund",
      n: "01",
      verb: "Fund",
      title: "Fund the intelligence layer as a Pillar-3 initiative.",
      body:
        "Confirms the scoping doc as the immediate first step and unlocks Stage 1 in Q2\u2013Q4 2026.",
    },
    {
      id: "build",
      n: "02",
      verb: "Greenlight",
      title: "Greenlight the internal build.",
      body:
        "Joint Data & AI Engineering + Insights & Analytics ownership. One senior AI engineer or freelance architect to anchor the ontology.",
    },
    {
      id: "own",
      n: "03",
      verb: "Own",
      title: "Keep Loop owning the ontology, schema, and MCP contracts.",
      body:
        "Partners (including Inku) plug in as execution layers. The layer itself stays internal. Surfaces are replaceable, the graph is not.",
    },
  ] satisfies V3ExecAsk[],
  actions: [
    {
      id: "scoping-doc",
      label: "Read the scoping doc",
      href: "#roadmap",
      primary: true,
    },
    {
      id: "monday",
      label: "See the workshop record",
      href: "https://loopearplugs.monday.com/boards/18409569683",
      external: true,
    },
  ] satisfies V3ExecAction[],
  signOff:
    "Loop has the proof in-house. The question is whether we formalise the function while the momentum is live.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Footer
 * ─────────────────────────────────────────────────────────────────── */

export const v3Footer = {
  line: "Aether \u00b7 Intelligence Layer v3 \u00b7 Standing report \u00b7 Monday board 18409569683.",
  signature: "Senior Leadership Days brief \u00b7 May 2026.",
} as const;

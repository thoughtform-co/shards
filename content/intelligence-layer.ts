/*
 * Loop Intelligence Layer — role-aware content.
 *
 * The page is the depth artifact behind the Aether homepage: one role-
 * aware deep-dive that walks through how Loop's intelligence layer
 * actually runs. Creative Strategy (Mímir) is the lead worked example;
 * Legal / Product Design / Ecom-PM stay as sibling tabs.
 *
 *   01 Hero               — name the layer. Role selector + 2 CTAs.
 *   02 Diagnosis          — N problem cards converge on the shared gap.
 *   03 Substrate gallery  — tabs swap the substrate showcase per case.
 *   04 The shift          — rules engineered vs context encoded.
 *   05 Degrees of freedom — locked / guided / open + skill.md, synced
 *                           with 03.
 *   06 Across the company — live workshop record (Monday) — the layer
 *                           running across thirteen teams.
 *   Close                 — short wrap.
 *
 * The "engine" framing stays for the underlying mechanism (each role
 * encodes one engine with multiple postures). The public-facing label
 * is "Intelligence Layer" — the same asset, named for the leadership
 * register.
 *
 * Each role bundles every piece of role-dependent copy plus its own
 * `useCases: UseCase[]` array. `RoleProvider` selects the active role,
 * components read the role's content via `useRole()`.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Footer (role-independent — same line and signature for every role)
 * ─────────────────────────────────────────────────────────────────── */

export const footer = {
  line: "Aether · Intelligence Layer · Running across thirteen Loop teams.",
  signature: "Sub-site scoped by Vince · Loop Creative Technology · 2026.",
};

/* ─────────────────────────────────────────────────────────────────────────
 * Section content types
 *
 * Each role declares one of each. The component layer treats these as
 * structural copy slots; the words change per role, the shape doesn't.
 * ─────────────────────────────────────────────────────────────────── */

export type HeroAction = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
};

export type HeroContent = {
  eyebrow: string;
  titlePre: string;
  titleEm: string;
  lede: string;
  actions: HeroAction[];
};

export type DiagnosisContent = {
  eyebrow: string;
  titlePre: string;
  titleEm: string;
  gap: { label: string; title: string; titleEm: string; sub: string };
  resolution: { leadEm: string; rest: string };
  flow: {
    kicker: string;
    steps: { label: string; body: string }[];
  };
};

export type GalleryCopy = {
  eyebrow: string;
  titlePre: string;
  titleEm: string;
  lede: string;
  flankLabels: { sources: string; interfaces: string };
  bridgeBadge: string;
  bridgeCaption: string;
  promises: { strong: string; body: string }[];
};

export type ShiftCopy = {
  eyebrow: string;
  titlePre: string;
  titleEm: string;
  lede: string;
  old: {
    label: string;
    headline: string;
    rules: string[];
    moreLine: string;
    footnote: string;
    caption: string;
  };
  next: {
    label: string;
    headline: string;
    skillTag: string;
    skillTitle: string;
    skillSub: string;
    intelTag: string;
    intelLine: string;
    footnote: string;
    caption: string;
  };
  strip: { label: string; body: string }[];
};

export type FreedomCopy = {
  eyebrow: string;
  titlePre: string;
  titleEm: string;
  lede: string;
  levelLabels: { locked: string; guided: string; open: string };
  skillCardHead: string;
  caption: string;
};

export type CloseContent = {
  eyebrow: string;
  title: string;
  titleEm: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

/* ─────────────────────────────────────────────────────────────────────────
 * Use case schema — single source of truth for sections 02 / 03 / 05.
 *
 * `UseCaseId` is a union over every use case id across every role, so
 * components stay type-safe regardless of which role is active. New
 * roles add their ids here.
 * ─────────────────────────────────────────────────────────────────── */

export type UseCaseId =
  // Creative Strategy role (default — Mímir lives here)
  | "hooks"
  | "personas"
  | "reviews"
  | "briefing"
  // Product Design role
  | "cost"
  | "feasibility"
  | "team"
  | "stress"
  // Ecom Program Manager role
  | "oa"
  | "channel"
  | "risk"
  | "retro"
  // Legal role
  | "claim"
  | "contract"
  | "disclosure"
  | "regulatory";

export type UseCaseSource = { name: string; kind: string };

export type UseCaseSubstrateTag = "rules" | "examples" | "voice" | "guards";
export type UseCaseSubstrateRow = { tag: UseCaseSubstrateTag; sample: string };

export type UseCaseSurface = {
  name: string;
  glyph: string;
  /**
   * Optional path to a screenshot rendered as a small surface thumbnail
   * in the Substrate Gallery (replaces the plain letter glyph). Used
   * for the Creative Strategy role to surface actual Mímir screens.
   */
  thumbnail?: string;
};

export type UseCaseChipKind = "success" | "alert" | "neutral";
export type UseCaseChip = { kind: UseCaseChipKind; label: string };

export type UseCaseBand = {
  headline: string;
  chips: UseCaseChip[];
  posture: string;
};

export type UseCase = {
  id: UseCaseId;
  badge: string;
  shortName: string;
  owner: string;

  /* 02 Diagnosis — small problem card on the grid */
  problem: { title: string; evidence: string };

  /* 03 Substrate gallery */
  consoleTitle: string;
  consoleCaption: string;
  sources: UseCaseSource[];
  substrate: UseCaseSubstrateRow[];
  surfaces: UseCaseSurface[];
  surfacesNote: string;

  /* 05 Degrees of freedom */
  bands: { locked: UseCaseBand; guided: UseCaseBand; open: UseCaseBand };
  skillMd: string;
  freedomNote: string;
};

/* ─────────────────────────────────────────────────────────────────────────
 * Role schema
 * ─────────────────────────────────────────────────────────────────── */

export type RoleId =
  | "creative-strategy"
  | "product-design"
  | "ecom-pm"
  | "legal";

export type Role = {
  id: RoleId;
  /** Display name in the role selector trigger and the option list. */
  label: string;
  /** Short kicker shown beneath the option label (e.g. "4 use cases · PD team"). */
  selectorKicker: string;
  hero: HeroContent;
  diagnosis: DiagnosisContent;
  galleryCopy: GalleryCopy;
  shiftCopy: ShiftCopy;
  freedomCopy: FreedomCopy;
  closeSection: CloseContent;
  useCases: UseCase[];
  defaultUseCaseId: UseCaseId;
};

/* ─────────────────────────────────────────────────────────────────────────
 * Role 01 — Creative Strategy (lead worked example · Mímir)
 *
 * The four use cases here are drawn verbatim from Mímir's
 * `loop-creative-strategy` skill (`mimir/skills/loop-creative-strategy/
 * SKILL.md`):
 *
 *   01 Hook Synthesis     — Reiss × LF8 × awareness × arc → hooks
 *                           grounded in review IDs. Surface: Loop Ads.
 *   02 Persona Mining     — use-case dossiers + persona arcs become
 *                           retrieval scope. Surface: Personas.
 *   03 Review Grounding   — retrieve-first; verbatim language; nuggets.
 *                           Surface: Customer Reviews.
 *   04 Briefing Synthesis — strategy → 8-section briefing JSON. Surface:
 *                           Mímir's briefing flow.
 *
 * Each LOCK band names the canonical, non-renamable axis values from
 * the Mímir skill (16 Reiss desires, 8 Life Force 8 ids, 5 Schwartz
 * stages, 4 transformation-arc tags, 5 persona arcs). Surface entries
 * carry `thumbnail` paths to actual Mímir screenshots in
 * `public/cases/screenshots/mimir/`.
 * ───────────────────────────────────────────────────────────────
 *
 * (Section continues below; Role 02 — Product Design starts further down.)
 * ─────────────────────────────────────────────────────────────── */

const creativeStrategyUseCases: UseCase[] = [
  {
    id: "hooks",
    badge: "Use case 01",
    shortName: "Hook Synthesis",
    owner: "Vince · Strategic Insights",
    problem: {
      title: "Every campaign restarts hook ideation from zero.",
      evidence:
        "Strategists fan out hook ideas from memory, not from evidence. The same Reddit threads and review quotes get re-mined every brief. Hooks ship without a desire, a funnel stage, or a customer-language anchor.",
    },
    consoleTitle: "Hook substrate",
    consoleCaption:
      "Inherits Mímir's customer reviews, ad library and knowledge graph — refuses to author a hook without at least one review id behind it.",
    sources: [
      { name: "Loop website reviews", kind: "corpus" },
      { name: "Buyer feedback corpus", kind: "corpus" },
      { name: "Mímir knowledge graph", kind: "graph" },
      { name: "Meta Ad Library archive", kind: "corpus" },
      { name: "Library audit · quadrants", kind: "matrix" },
      { name: "Winners + losers register", kind: "ledger" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Retrieve before authorship. Every hook ships with one primary Reiss desire, one Life Force 8 id, one Schwartz stage, one transformation arc. Empty retrieval returns zero hooks.",
      },
      {
        tag: "examples",
        sample:
          "Ten hook archetypes from the canonical catalog (family, time-period, regret, pov, superlative, problem-twist, ...). Iterate winners; never iterate losers without naming the editing-vs-message error.",
      },
      {
        tag: "voice",
        sample:
          "Loop voice. Verbatim customer language preferred. Never paraphrase a golden nugget (specific number, taboo phrase, age call-out, time period).",
      },
      {
        tag: "guards",
        sample:
          "supportingReviewIds is never empty. groundingQuestion is never null. Speculative hooks are flagged speculative:true and dropped from the auto-briefing path.",
      },
    ],
    surfaces: [
      {
        name: "Mímir · Loop Ads",
        glyph: "L",
        thumbnail: "/cases/screenshots/mimir/Mimir-Loop%20Ads.png",
      },
      { name: "Claude Project", glyph: "C" },
      { name: "Cursor", glyph: "c" },
      { name: "Slack thread", glyph: "S" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where strategists already iterate hooks today.",
    bands: {
      locked: {
        headline: "Locked. The four creative-strategy axes (Mímir canonical).",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Reiss 16 (single primary)" },
          { kind: "alert", label: "Life Force 8 (canonical ids)" },
          { kind: "alert", label: "Schwartz 5 stages" },
          { kind: "alert", label: "Arc: before · after · both · neither" },
          { kind: "success", label: "≥ 1 supporting review id" },
        ],
      },
      guided: {
        headline: "Guided. Archetype, funnel stage, format pattern.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Archetype: 10 canonical" },
          { kind: "neutral", label: "Funnel: awareness · consideration · retention · objection" },
          { kind: "neutral", label: "Format: UGC · founder · grid · listicle · press" },
          { kind: "neutral", label: "Quadrant prior: problem-aware default" },
        ],
      },
      open: {
        headline: "Open. Hook copy phrasing inside Loop voice.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Hook copy (1 sentence)" },
          { kind: "neutral", label: "Iteration angle" },
          { kind: "neutral", label: "Counter-example framing" },
          { kind: "neutral", label: "Grounding question phrasing" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nreiss-16:   acceptance, family, tranquility, power, ... (16)\nlife-force-8: sleep_rest, comfort, social_approval, ... (8)\nschwartz-5: problem_unaware -> most_aware\narcs:       before, after, both, neither\nrequire:    supportingReviewIds.length >= 1\nrequire:    groundingQuestion != null\n\nGUIDED — medium freedom\narchetype:  family, time-period, regret, pov, superlative,\n            problem-twist, viral, demographic, educational, negative\nfunnel:     awareness, consideration, retention, objection\nprior:      +0.05 to problem_unaware / problem_aware\n\nOPEN — high freedom\nhookCopy:   1 sentence, Loop voice, verbatim customer language\niteration:  10 canonical moves on winners only\nDREAM mode requires explicit freedomBand:'DREAM'\n\nsubstrate\nreviews:    loop://wr/*\nfeedback:   loop://buyer-feedback/*\ngraph:      mimir://knowledge-graph\nevals:      loop://creative-strategy-eval/*",
    freedomNote:
      "Mímir's runtime ranker scores LF8 overlap, stage match and arc completeness against the same axes. Both halves stay in sync.",
  },
  {
    id: "personas",
    badge: "Use case 02",
    shortName: "Persona Mining",
    owner: "Strategic Insights + Brand",
    problem: {
      title: "Personas live in slides, not in retrieval.",
      evidence:
        "Audience documents get assembled once and rarely consulted at brief time. Use-case segments (sleep, noise-sensitivity, productivity, parenting) get re-discovered every campaign instead of feeding the engine.",
    },
    consoleTitle: "Persona substrate",
    consoleCaption:
      "Encodes the May 15 use-case corpus into retrieval scope. Mímir personas-v2 is the runtime; this is the substrate that scopes it.",
    sources: [
      { name: "Use-case dossier · sleep", kind: "doc" },
      { name: "Use-case dossier · noise-sensitivity", kind: "doc" },
      { name: "Use-case dossier · productivity", kind: "doc" },
      { name: "Use-case dossier · parenting", kind: "doc" },
      { name: "Persona-shell arcs", kind: "matrix" },
      { name: "Mímir personas-v2 wiki", kind: "graph" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Five canonical persona arcs: sleep_deprived_partner, neurodivergent_adult, overstimulated_parent, music_lover, adhd_focus_seeker. Persona scope filters retrieval before scoring; never the other way around.",
      },
      {
        tag: "examples",
        sample:
          "Parenting dossier (most under-served per audit) becomes the canonical 'unlock zone' pattern. Sleep dossier becomes the canonical broad-base pattern.",
      },
      {
        tag: "voice",
        sample:
          "Persona pain phrases are LOCK — exact terms preserved. Surrounding label phrasing is rephrasable; identity-level shape is not.",
      },
      {
        tag: "guards",
        sample:
          "Never invents a persona arc. Never collapses two arcs into one ('overstimulated parent who can't sleep' resolves to the parenting arc with sleep evidence, not a new arc).",
      },
    ],
    surfaces: [
      {
        name: "Mímir · Personas",
        glyph: "P",
        thumbnail: "/cases/screenshots/mimir/Mimir-Personas.png",
      },
      { name: "Claude Project", glyph: "C" },
      { name: "Cursor", glyph: "c" },
      { name: "Notion dossier", glyph: "N" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where personas already get authored — the substrate makes them queryable.",
    bands: {
      locked: {
        headline: "Locked. The five canonical persona arcs.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "sleep_deprived_partner" },
          { kind: "alert", label: "neurodivergent_adult" },
          { kind: "alert", label: "overstimulated_parent" },
          { kind: "alert", label: "music_lover" },
          { kind: "alert", label: "adhd_focus_seeker" },
        ],
      },
      guided: {
        headline: "Guided. Use-case overlay, awareness stage, scope weighting.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Use case: sleep · noise · productivity · parenting" },
          { kind: "neutral", label: "Stage: problem_aware default" },
          { kind: "neutral", label: "Pain-phrase weighting" },
          { kind: "neutral", label: "Mission relevance score" },
        ],
      },
      open: {
        headline: "Open. Persona narrative inside the canonical arc.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Identity story" },
          { kind: "neutral", label: "Before / After voice" },
          { kind: "neutral", label: "Scenario detail" },
          { kind: "neutral", label: "Evidence callouts" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\narcs:        sleep_deprived_partner, neurodivergent_adult,\n             overstimulated_parent, music_lover, adhd_focus_seeker\npain-terms:  preserve verbatim\nscope-first: filter then score\n\nGUIDED — medium freedom\nusecase:    sleep · noise-sensitivity · productivity · parenting\nstage:      problem_aware (default)\nweighting:  pain-phrase frequency × recency\n\nOPEN — high freedom\nidentity story, scenario detail, evidence callouts\nfree composition inside the canonical arc\n\nsubstrate\ndossiers:   loop://use-case-dossier/*\npersonas:   mimir://personas-v2\nevals:      loop://persona-grounding-eval/*",
    freedomNote:
      "Mímir personas-v2 reads the same canonical arcs and applies the same scope-first ordering. Brand decks compose inside Open; the arcs police Locked.",
  },
  {
    id: "reviews",
    badge: "Use case 03",
    shortName: "Review Grounding",
    owner: "Strategic Insights",
    problem: {
      title: "Strategists author from memory, not evidence.",
      evidence:
        "The strongest customer phrasing — specific numbers, taboo words, age call-outs, time-period anchors — gets paraphrased away before it reaches the brief. Low-score reviews never become hook material.",
    },
    consoleTitle: "Review substrate",
    consoleCaption:
      "Retrieve-before-authorship. Every hook returned must cite at least one website-review id — the rule that keeps category-average copy out.",
    sources: [
      { name: "Website reviews (wr:*)", kind: "corpus" },
      { name: "Buyer-feedback survey", kind: "corpus" },
      { name: "Skeptical-to-super-fan SOP", kind: "doc" },
      { name: "Low-score review pool", kind: "corpus" },
      { name: "Golden-nugget register", kind: "ledger" },
      { name: "Objection cluster map", kind: "matrix" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Retrieve-first. A hook with zero supportingReviewIds is a fabrication and gets dropped. Low-score reviews go to the objection-mining lane; never to the headline lane.",
      },
      {
        tag: "examples",
        sample:
          "The 'three weeks of finally sleeping through' golden nugget becomes the canonical specific-time-period pattern. Vendor-X comparator review becomes the canonical comparator anti-pattern.",
      },
      {
        tag: "voice",
        sample:
          "Verbatim customer language preferred. When a review carries a 'golden nugget' (specific number, taboo phrase, age call-out, time period), preserve the exact words.",
      },
      {
        tag: "guards",
        sample:
          "No hallucinated evidence. No paraphrase that drops the converting term. Speculative outputs are flagged speculative:true and never enter the auto-briefing path.",
      },
    ],
    surfaces: [
      {
        name: "Mímir · Customer Reviews",
        glyph: "R",
        thumbnail: "/cases/screenshots/mimir/MImir-Customer%20Review.png",
      },
      { name: "Claude Project", glyph: "C" },
      { name: "Cursor", glyph: "c" },
      { name: "Slack thread", glyph: "S" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where reviews already get read — the substrate makes them retrievable per persona scope.",
    bands: {
      locked: {
        headline: "Locked. Retrieve before authorship. Verbatim language.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "≥ 1 review id per hook" },
          { kind: "alert", label: "No paraphrase on nuggets" },
          { kind: "alert", label: "Low-score → objections only" },
          { kind: "success", label: "Empty retrieval = stop" },
        ],
      },
      guided: {
        headline: "Guided. Persona scope, awareness stage, evidence weight.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Persona scope filter" },
          { kind: "neutral", label: "Awareness stage match (0.40)" },
          { kind: "neutral", label: "LF8 overlap bonus (0.30)" },
          { kind: "neutral", label: "Arc completeness (+0.20 both)" },
        ],
      },
      open: {
        headline: "Open. Quote selection and framing inside the rail.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Quote selection order" },
          { kind: "neutral", label: "Context framing" },
          { kind: "neutral", label: "Objection mining angle" },
          { kind: "neutral", label: "Retrieval-notes phrasing" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nretrieve-first: true\nmin-evidence:   supportingReviewIds.length >= 1\nverbatim:       golden-nuggets preserved\nempty-retrieval: return-zero-hooks\n\nGUIDED — medium freedom\nscore-formula:\n  + LF8 overlap         × 0.30\n  + stage exact match   × 0.40\n  + stage adjacent      × 0.15\n  + arc 'both'          × 0.20\n  + arc 'after'         × 0.12\n  + arc 'before'        × 0.08\n  + problem_aware prior × 0.05\n\nOPEN — high freedom\nquote selection, context framing, objection angle\nretrieval-notes phrasing\n\nsubstrate\nreviews:   loop://wr/*\nfeedback:  loop://buyer-feedback/*\nsop:       loop://skeptical-to-superfan\nevals:     loop://grounding-eval/*",
    freedomNote:
      "The Mímir ranker (`rankByCreativeStrategy`) reads the same scoring weights. Quote selection composes inside Open; the evidence rule polices Locked.",
  },
  {
    id: "briefing",
    badge: "Use case 04",
    shortName: "Briefing Synthesis",
    owner: "Creative Strategy + Brand",
    problem: {
      title: "Briefings restart Reddit, Magic Brief, SharePoint every week.",
      evidence:
        "Customer voice, ad performance and competitive signals sit in different surfaces. Each brief re-mines them by hand. The strongest insight from week one is rarely the strongest input for week two.",
    },
    consoleTitle: "Briefing substrate",
    consoleCaption:
      "Composes a Loop briefing from retrieved evidence and the creative-strategy axes — hands off to loop-briefing-strategy for the final 8-section JSON.",
    sources: [
      { name: "Hook substrate (Use case 01)", kind: "skill" },
      { name: "Persona scope (Use case 02)", kind: "skill" },
      { name: "Review grounding (Use case 03)", kind: "skill" },
      { name: "Mímir ad-performance signals", kind: "ledger" },
      { name: "Andromeda growth framework", kind: "doc" },
      { name: "Prior brief retros", kind: "corpus" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Briefing inherits the four creative-strategy axes from Use case 01. Hooks without supportingReviewIds never enter the brief. Andromeda diversity rule fires on every assembled brief.",
      },
      {
        tag: "examples",
        sample:
          "The Q3 launch brief becomes the canonical 8-section assembled pattern. The under-evidenced V0 brief becomes the canonical 'stop and surface the gap' anti-pattern.",
      },
      {
        tag: "voice",
        sample:
          "Loop voice in narrative sections; structured JSON in handoff. Names the axes by id, never by paraphrase. Calls out the retrieval gap when one shows up.",
      },
      {
        tag: "guards",
        sample:
          "Hands off to loop-briefing-strategy for the final JSON. Never owns copy execution (that goes to loop-paid-social). Never owns MCP routing (that goes to mimir-headless-orchestration).",
      },
    ],
    surfaces: [
      {
        name: "Mímir · Briefing Flow",
        glyph: "B",
        thumbnail: "/cases/screenshots/mimir/Mimir-Briefing%20Flow.png",
      },
      { name: "Claude Project", glyph: "C" },
      { name: "Cursor", glyph: "c" },
      { name: "Slack thread", glyph: "S" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where briefings already get assembled — the substrate inherits the axes and the evidence.",
    bands: {
      locked: {
        headline: "Locked. Axes inheritance and handoff boundaries.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Inherits four axes" },
          { kind: "alert", label: "Hooks need review ids" },
          { kind: "alert", label: "Andromeda diversity" },
          { kind: "success", label: "8-section JSON shape" },
        ],
      },
      guided: {
        headline: "Guided. Section order, evidence weighting, persona overlay.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Section order" },
          { kind: "neutral", label: "Evidence weighting" },
          { kind: "neutral", label: "Persona overlay" },
          { kind: "neutral", label: "Growth-framework lane" },
        ],
      },
      open: {
        headline: "Open. Narrative inside each section.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Section narrative" },
          { kind: "neutral", label: "Tone of brief" },
          { kind: "neutral", label: "Counterfactual angles" },
          { kind: "neutral", label: "Hand-off note phrasing" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\ninherits:   reiss, lf8, stage, arc (use case 01)\nhooks:      supportingReviewIds >= 1\nhandoff:    loop-briefing-strategy (JSON)\nrefuse:     copy execution (-> loop-paid-social)\nrefuse:     MCP routing (-> mimir-headless-orchestration)\n\nGUIDED — medium freedom\nsections:   8 canonical (situation, insight, audience,\n            objective, message, evidence, format, kpi)\noverlay:    persona-scope from use case 02\nframework:  andromeda growth lane\n\nOPEN — high freedom\nsection narrative, brief tone, counterfactual angles\nhand-off note phrasing\n\nsubstrate\nhooks:      loop://hooks/*\npersonas:   loop://persona-arc/*\nbriefings:  loop://brief/*\nevals:      loop://brief-eval/*",
    freedomNote:
      "Mímir's briefing flow composes inside Open. The axes inheritance and the handoff boundary police Locked.",
  },
];

const creativeStrategyRole: Role = {
  id: "creative-strategy",
  label: "Creative Strategy",
  selectorKicker: "Hooks · Personas · Reviews · Briefings",
  hero: {
    eyebrow: "Intelligence Layer · Creative Strategy",
    titlePre: "Encoded creative judgment.",
    titleEm: "Running inside Mímir today.",
    lede:
      "The Mímir briefing agent runs on this substrate. Four use cases, one Skill contract, the same retrieval-first discipline — hook synthesis, persona mining, review grounding, briefing handoff. Encode the strategist's reasoning once; every Mímir surface inherits it. Walk through the shape below.",
    actions: [
      { id: "build", label: "Build one for your workstream", href: "/intelligence-layer/build?role=creative-strategy", primary: true },
      { id: "gallery", label: "See the four use cases", href: "#substrate-gallery" },
    ],
  },
  diagnosis: {
    eyebrow: "02 · Diagnosis",
    titlePre: "Four use cases.",
    titleEm: "One missing piece.",
    gap: {
      label: "Shared gap",
      title: "Strategy reasoning is",
      titleEm: "not encoded.",
      sub: "Desire · stage · arc · grounding evidence",
    },
    resolution: {
      leadEm: "Encode it once.",
      rest: "Mímir reads the same axes Claude does.",
    },
    flow: {
      kicker: "Once Navigate names the reasoning",
      steps: [
        { label: "Navigate", body: "the strategist's axes are surfaced" },
        { label: "Encode", body: "turn them into one Skill" },
        { label: "Build", body: "every brief runs through one engine" },
      ],
    },
  },
  galleryCopy: {
    eyebrow: "",
    titlePre: "Do not automate the strategist.",
    titleEm: "Encode the reasoning.",
    lede:
      "The work is not generating more hooks. The work is making each axis (desire, stage, arc, evidence) legible to the model — once — so Mímir, Claude, Cursor and Slack all stand on the same substrate. Customer reviews stay where they are. The layer makes them retrievable.",
    flankLabels: { sources: "Data sources", interfaces: "Surfaces" },
    bridgeBadge: "Headless",
    bridgeCaption: "MCP · Mímir",
    promises: [
      { strong: "Captured.", body: "Tacit strategy reasoning becomes legible substrate." },
      { strong: "Owned.", body: "Versioned in the skill repo, edited by Strategic Insights." },
      { strong: "Portable.", body: "Mímir, Claude, Cursor, Slack — same axes, same outputs." },
    ],
  },
  shiftCopy: {
    eyebrow: "",
    titlePre: "From rules engineered",
    titleEm: "to context encoded.",
    lede:
      "Mímir's ranker handles deterministic scoring (LF8 overlap, stage match, arc completeness). The Skill handles the judgment — picking the right desire, choosing which review carries the hook, knowing when to stop. Two halves, same axes.",
    old: {
      label: "Old contract · Briefing checklist",
      headline: "EVERY BRIEF RESTARTED",
      rules: [
        "if no desire: pick from memory",
        "if no review match: paraphrase one",
        "if stage missing: default to product",
        "if arc unclear: skip the field",
        "if evidence thin: ship anyway",
      ],
      moreLine: "... more shortcuts",
      footnote: "COVERAGE GROWS BY ADDING REVIEWERS",
      caption:
        "Works for small volumes and high-judgment teams. Breaks down when scale forces shortcuts and the converting language gets paraphrased away.",
    },
    next: {
      label: "New contract · Skills",
      headline: "ONE FILE. ONE INTELLIGENCE.",
      skillTag: "SKILL",
      skillTitle: "rules + examples + voice + guards",
      skillSub: "the strategy contract",
      intelTag: "INTELLIGENCE",
      intelLine: "interprets context inside boundaries",
      footnote: "COVERAGE GROWS BY IMPROVING CONTEXT",
      caption:
        "The work shifts upstream: encode the axes once, validate the hooks the model returns. Customer language stays verbatim, not paraphrased.",
    },
    strip: [
      { label: "Bottleneck", body: "From mining Reddit every week to curating Mímir's substrate." },
      { label: "Delivery", body: "From four ad-hoc surfaces to one engine with four faces." },
      { label: "Governance", body: "From taste-by-memory to a registry of golden nuggets and evals." },
    ],
  },
  freedomCopy: {
    eyebrow: "",
    titlePre: "One Skill.",
    titleEm: "Three degrees of freedom.",
    lede:
      "The Mímir creative-strategy skill ships with four explicit freedom bands. Each axis (Reiss 16, Life Force 8, Schwartz 5, transformation arcs, persona arcs) is LOCK — the canonical ids cannot be renamed or invented. Archetype and funnel-stage selection are GUIDED. Hook copy lives in OPEN.",
    levelLabels: { locked: "Low", guided: "Medium", open: "High" },
    skillCardHead: "skill.md, compressed",
    caption:
      "Same Skill, different posture. Each use case inherits the same axes.",
  },
  closeSection: {
    eyebrow: "What this leaves behind",
    title: "An engine that ages well.",
    titleEm: "Four use cases, one shape.",
    body:
      "Hook, persona, review, briefing — four surfaces, the same encoded reasoning underneath. Mímir is the production proof. The substrate sits one level above: Skill files in a repo, versioned, owned by Strategic Insights. The interface is proof; the substrate is the asset.",
    primary: { label: "Back to the vision", href: "/" },
    secondary: { label: "See the campaign demo", href: "/campaign-substrate" },
  },
  useCases: creativeStrategyUseCases,
  defaultUseCaseId: "hooks",
};

/* ─────────────────────────────────────────────────────────────────────
 * Role 02 — Product Design (current four use cases, untouched)
 * ─────────────────────────────────────────────────────────────────── */

const productDesignUseCases: UseCase[] = [
  {
    id: "cost",
    badge: "Use case 01",
    shortName: "Cost Projector",
    owner: "Elodie · Studio",
    problem: {
      title: "Cost estimates take days.",
      evidence:
        "Every new concept restarts pricing from scratch. Quotes arrive too late to shape the design.",
    },
    consoleTitle: "Cost substrate",
    consoleCaption:
      "Inherits the studio's existing rate cards and invoices — does not replace them.",
    sources: [
      { name: "Vendor rate cards", kind: "doc" },
      { name: "Past invoices", kind: "ledger" },
      { name: "Scope templates", kind: "brief" },
      { name: "Freight bands", kind: "matrix" },
      { name: "Tooling thresholds", kind: "rules" },
      { name: "Studio time logs", kind: "ledger" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "A4-modular = base × 1.0; bespoke shapes = base × 1.7; freight banded by zone.",
      },
      {
        tag: "examples",
        sample:
          "Calmer Mk1 invoice and Earplug Stand quote become reusable estimate patterns.",
      },
      {
        tag: "voice",
        sample:
          "Studio-honest. Numbers carry their reasoning, not just totals.",
      },
      {
        tag: "guards",
        sample:
          "Never quote without freight. Flag tooling above the studio threshold.",
      },
    ],
    surfaces: [
      { name: "Figma plugin", glyph: "F" },
      { name: "Slack DM", glyph: "S" },
      { name: "Monday card", glyph: "M" },
      { name: "Notion panel", glyph: "N" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where the studio already estimates today.",
    bands: {
      locked: {
        headline: "Locked. Material rates and vendor minimums.",
        posture: "Deterministic",
        chips: [
          { kind: "success", label: "Rate card: PU foam" },
          { kind: "success", label: "Rate card: silicone" },
          { kind: "alert", label: "Min order: vendor X" },
          { kind: "alert", label: "Freight band: EU/NA" },
          { kind: "alert", label: "Tooling cap: €15k" },
        ],
      },
      guided: {
        headline: "Guided. Volume tiers, region, project archetype.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Volume: 1k / 10k / 100k" },
          { kind: "neutral", label: "Region: EU · UK · US" },
          { kind: "neutral", label: "Archetype: A4 modular" },
          { kind: "neutral", label: "Archetype: bespoke" },
          { kind: "neutral", label: "Lead time band" },
        ],
      },
      open: {
        headline: "Open. Narrative phrasing inside the contract.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Caveat order" },
          { kind: "neutral", label: "Hedging language" },
          { kind: "neutral", label: "Comparison framing" },
          { kind: "neutral", label: "Confidence wording" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nrates:    rate-card://material/*\nminimums: vendor-min://*\nfreight:  band-eu, band-uk, band-us\ntooling:  flag if > €15k\n\nGUIDED — medium freedom\nvolume:    1k / 10k / 100k\nregion:    EU · UK · US\narchetype: a4-modular · bespoke · hybrid\n\nOPEN — high freedom\ncaveats, comparisons, confidence wording\nfree narrative inside the contract\n\nsubstrate\ncorpus:   loop://invoice/*\nrates:    loop://rate-card/*\nevals:    loop://quote-eval/*",
    freedomNote:
      "The Figma plugin composes inside Open. The CFO panel polices Locked. Same Skill, different posture.",
  },
  {
    id: "feasibility",
    badge: "Use case 02",
    shortName: "Feasibility & Fit",
    owner: "PD · portfolio council",
    problem: {
      title: "Every concept looks feasible.",
      evidence:
        "Roadmap conflicts, capacity gaps and portfolio overlap go unflagged. Generic AI agrees with whatever it is asked.",
    },
    consoleTitle: "Feasibility substrate",
    consoleCaption:
      "Sits over the roadmap, capacity tracker and portfolio council — refuses to soften the call.",
    sources: [
      { name: "Roadmap board", kind: "board" },
      { name: "Capacity tracker", kind: "ledger" },
      { name: "Portfolio map", kind: "matrix" },
      { name: "Three-team rule", kind: "policy" },
      { name: "Council minutes", kind: "doc" },
      { name: "Q1 research pack", kind: "research" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Three-team rule violates feasibility. Existing in-flight work is LOCK.",
      },
      {
        tag: "examples",
        sample:
          "Sleep Stage Coach (Block + patch) becomes the canonical eval case for refusal.",
      },
      {
        tag: "voice",
        sample:
          "Names the rule that fired. Refuses to soften the verdict to be likeable.",
      },
      {
        tag: "guards",
        sample:
          "Never mark feasible without naming the sprint. Refusals log to audit.",
      },
    ],
    surfaces: [
      { name: "Cursor", glyph: "c" },
      { name: "Claude Project", glyph: "C" },
      { name: "Monday board", glyph: "M" },
      { name: "Slack thread", glyph: "S" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where concepts already get triaged today.",
    bands: {
      locked: {
        headline: "Locked. Roadmap, capacity, in-flight commitments.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Three-team rule" },
          { kind: "alert", label: "Capacity over 100%" },
          { kind: "alert", label: "Conflicts with in-flight" },
          { kind: "success", label: "Owned roadmap surface" },
          { kind: "success", label: "Council-approved bet" },
        ],
      },
      guided: {
        headline: "Guided. Strategic fit, audience overlap, evidence.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Strategic fit framing" },
          { kind: "neutral", label: "Audience overlap risk" },
          { kind: "neutral", label: "Evidence strength" },
          { kind: "neutral", label: "Surface ownership" },
        ],
      },
      open: {
        headline: "Open. Concept framing and adjacent moves.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Concept framing" },
          { kind: "neutral", label: "Adjacent opportunities" },
          { kind: "neutral", label: "Hypothesis order" },
          { kind: "neutral", label: "Discovery prompts" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nroadmap:   roadmap-board://*\ncapacity:  capacity-tracker://*\npolicy:    three-team-rule\nrefuse-on: hard-rule-violation\n\nGUIDED — medium freedom\nfit:      strategic, audience, surface\nevidence: q1-pack, sleep-pack\nrisk:     overlap, entry-point\n\nOPEN — high freedom\nframing, adjacents, hypothesis order\nfree composition inside the rules\n\nsubstrate\ncorpus:   loop://concept/*\nregistry: loop://decision/*\nevals:    loop://feasibility-eval/*",
    freedomNote:
      "Cursor composes inside Open. The portfolio council polices Locked. Same Skill, different posture.",
  },
  {
    id: "team",
    badge: "Use case 03",
    shortName: "Team Coordination",
    owner: "Design leads · Ryan, Britta",
    problem: {
      title: "Design gates stall on a few busy reviewers.",
      evidence:
        "Sign-off waits on a handful of leads. The reasoning that drives their decisions only lives in their heads.",
    },
    consoleTitle: "Coordination substrate",
    consoleCaption:
      "Encoded leadership reasoning sitting next to the gate calendar — not replacing the human sign-off.",
    sources: [
      { name: "Past gate decisions", kind: "ledger" },
      { name: "Leadership archive", kind: "corpus" },
      { name: "Design manifesto", kind: "doc" },
      { name: "Decision log", kind: "ledger" },
      { name: "Milestone templates", kind: "brief" },
      { name: "Owner directory", kind: "matrix" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Concept without an evidence packet auto-routes to research before the gate review.",
      },
      {
        tag: "examples",
        sample:
          "Britta's Q4 rejections become anti-examples; Ryan's portfolio lens becomes a guide pattern.",
      },
      {
        tag: "voice",
        sample:
          "Direct, named, traceable. Speaks the way the named lead would speak.",
      },
      {
        tag: "guards",
        sample:
          "Never approve without an owner attributed. Never sign off on a human's behalf.",
      },
    ],
    surfaces: [
      { name: "Cursor", glyph: "c" },
      { name: "Claude Project", glyph: "C" },
      { name: "Monday gates", glyph: "M" },
      { name: "Slack channel", glyph: "S" },
      { name: "Sync doc", glyph: "D" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where the gate calendar already lives.",
    bands: {
      locked: {
        headline: "Locked. Final approval and owner attribution.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Sign-off authority" },
          { kind: "alert", label: "Owner must be named" },
          { kind: "alert", label: "No proxy approvals" },
          { kind: "success", label: "Audit trail required" },
        ],
      },
      guided: {
        headline: "Guided. Reviewer routing and escalation paths.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Domain routing" },
          { kind: "neutral", label: "Escalation: design lead" },
          { kind: "neutral", label: "Escalation: portfolio" },
          { kind: "neutral", label: "Async vs sync" },
        ],
      },
      open: {
        headline: "Open. Pre-gate framing and internal coaching.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Pre-gate framing" },
          { kind: "neutral", label: "Question rehearsal" },
          { kind: "neutral", label: "Risk surfacing" },
          { kind: "neutral", label: "Coaching prompts" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nauthority: lead.named\nowner:     must-be-attributed\nproxy:     refuse\naudit:     write-on-decision\n\nGUIDED — medium freedom\nrouting:    domain.expertise\nescalation: design-lead, portfolio\nmode:       async, sync, blocking\n\nOPEN — high freedom\npre-gate framing, rehearsal, coaching\nfree composition inside the contract\n\nsubstrate\ncorpus:   loop://leadership/*\nlog:      loop://gate-decision/*\nevals:    loop://gate-eval/*",
    freedomNote:
      "Slack composes inside Open. The Monday gate column polices Locked. Same Skill, different posture.",
  },
  {
    id: "stress",
    badge: "Use case 04",
    shortName: "UX Stress Test",
    owner: "Vince · Loop Creative Technology",
    problem: {
      title: "Edge cases only surface on launch.",
      evidence:
        "Lab tests run in ideal conditions. Real users are tired, distracted, hands full, in low light. The gaps show up too late to fix cheaply.",
    },
    consoleTitle: "Stress-test substrate",
    consoleCaption:
      "Pushes concepts through five canonical states — refuses to settle for one happy path.",
    sources: [
      { name: "Edge-case archive", kind: "corpus" },
      { name: "Failure modes log", kind: "ledger" },
      { name: "Van der Morten flow", kind: "template" },
      { name: "Accessibility audit", kind: "doc" },
      { name: "Ergonomics research", kind: "research" },
      { name: "Sleep-state notes", kind: "research" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Adversarial scaffold against five canonical states: sleep, intoxication, hands-busy, low-light, hurry.",
      },
      {
        tag: "examples",
        sample:
          "Van der Morten validation flow becomes the reasoning template for new products.",
      },
      {
        tag: "voice",
        sample:
          "Pushes hypotheticals. Doesn't get satisfied with one happy path.",
      },
      {
        tag: "guards",
        sample:
          "Never stops at one edge case. Surfaces three failure modes per gate, every time.",
      },
    ],
    surfaces: [
      { name: "Claude Project", glyph: "C" },
      { name: "Cursor", glyph: "c" },
      { name: "Figma overlay", glyph: "F" },
      { name: "Slack", glyph: "S" },
      { name: "Audit doc", glyph: "D" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where stress runs already happen, ad-hoc.",
    bands: {
      locked: {
        headline: "Locked. Five canonical states must run on every concept.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "State: half asleep" },
          { kind: "alert", label: "State: inebriated" },
          { kind: "alert", label: "State: hands-busy" },
          { kind: "alert", label: "State: low light" },
          { kind: "alert", label: "State: hurry" },
        ],
      },
      guided: {
        headline: "Guided. Persona density, severity, failure-mode count.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Persona density" },
          { kind: "neutral", label: "Severity rating" },
          { kind: "neutral", label: "≥3 failure modes / gate" },
          { kind: "neutral", label: "Surface vs flow" },
        ],
      },
      open: {
        headline: "Open. Specific scenarios and stress phrasing.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Scenario specifics" },
          { kind: "neutral", label: "Stress prompt phrasing" },
          { kind: "neutral", label: "Adversarial chaining" },
          { kind: "neutral", label: "Counter-examples" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nstates:   sleep, intox, busy, dim, hurry\nrun-on:   every concept\nminimum:  3 failure modes / gate\nrefuse:   single happy path\n\nGUIDED — medium freedom\nseverity: low / med / high / blocker\npersona:  density, mismatch\nsurface:  vs flow vs system\n\nOPEN — high freedom\nscenarios, prompt phrasing, adversarial chains\nfree composition inside the contract\n\nsubstrate\ncorpus:   loop://edge-case/*\ntemplate: loop://vandermorten-flow\nevals:    loop://stress-eval/*",
    freedomNote:
      "Claude Project composes inside Open. The audit doc polices Locked. Same Skill, different posture.",
  },
];

const productDesignRole: Role = {
  id: "product-design",
  label: "Product Design",
  selectorKicker: "Cost · Feasibility · Gates · Stress",
  hero: {
    eyebrow: "Intelligence Layer · Product Design",
    titlePre: "Encoded design judgment.",
    titleEm: "Run on every concept.",
    lede:
      "One Skill substrate, four faces. The same engine projects costs, checks feasibility, runs design gates and stress-tests UX. Encode the judgment once; every face inherits it. The page below walks through the shape — and lets you build your own.",
    actions: [
      { id: "build", label: "Build one for your workstream", href: "/intelligence-layer/build?role=product-design", primary: true },
      { id: "gallery", label: "See the four use cases", href: "#substrate-gallery" },
    ],
  },
  diagnosis: {
    eyebrow: "02 · Diagnosis",
    titlePre: "Four faces.",
    titleEm: "One missing piece.",
    gap: {
      label: "Shared gap",
      title: "Judgment is",
      titleEm: "not encoded.",
      sub: "Reasoning · examples · refusal patterns · taste",
    },
    resolution: {
      leadEm: "Encode it once.",
      rest: "The same engine answers all four.",
    },
    flow: {
      kicker: "Once Navigate exposes the gap",
      steps: [
        { label: "Navigate", body: "the judgment is surfaced" },
        { label: "Encode", body: "turn it into one Skill" },
        { label: "Build", body: "run every face through one engine" },
      ],
    },
  },
  galleryCopy: {
    eyebrow: "",
    titlePre: "Do not automate the work.",
    titleEm: "Encode the judgment.",
    lede:
      "The work is not generating more output. The work is making each judgment legible to the model. Encode it once. Every face inherits the same substrate.",
    flankLabels: { sources: "Data sources", interfaces: "Interfaces" },
    bridgeBadge: "Headless",
    bridgeCaption: "MCP / REST",
    promises: [
      { strong: "Captured.", body: "Tacit reasoning becomes legible substrate." },
      { strong: "Owned.", body: "Versioned, reviewable, the team can edit it." },
      { strong: "Portable.", body: "One change. Every face inherits." },
    ],
  },
  shiftCopy: {
    eyebrow: "",
    titlePre: "From rules engineered",
    titleEm: "to context encoded.",
    lede:
      "This is not a brittle rule engine trying to predict every sentence. It is a Skill package and harness that gives an intelligent model the context, boundaries, and review loop it needs.",
    old: {
      label: "Old contract · Rules engine",
      headline: "EVERY VARIABLE ENGINEERED",
      rules: [
        "if banned_term: reject",
        "if portfolio_overlap: route_A",
        "if capacity_full: route_B",
        "if needs_signoff: escalate",
        "if comparative: validate_against_X",
      ],
      moreLine: "... more rules",
      footnote: "COVERAGE GROWS BY ADDING RULES",
      caption:
        "Works for stable, narrow workflows. Breaks down when judgment, context, and audience interact.",
    },
    next: {
      label: "New contract · Skills",
      headline: "ONE FILE. ONE INTELLIGENCE.",
      skillTag: "SKILL",
      skillTitle: "rules + examples + voice + guards",
      skillSub: "the judgment contract",
      intelTag: "INTELLIGENCE",
      intelLine: "interprets context inside boundaries",
      footnote: "COVERAGE GROWS BY IMPROVING CONTEXT",
      caption:
        "The work shifts upstream: encode what is true about each judgment, then validate the outputs.",
    },
    strip: [
      { label: "Bottleneck", body: "From writing rules to curating reasoning." },
      { label: "Delivery", body: "From four custom workflows to one engine with four faces." },
      { label: "Governance", body: "From email sign-off to a registry and eval loop." },
    ],
  },
  freedomCopy: {
    eyebrow: "",
    titlePre: "One Skill.",
    titleEm: "Three degrees of freedom.",
    lede:
      "Each judgment encoded as a file. The Skill sets where the model is locked, guided, or open: rigid where risk is high, parameterised where context shifts, free where craft matters. Same shape, four different postures.",
    levelLabels: { locked: "Low", guided: "Medium", open: "High" },
    skillCardHead: "skill.md, compressed",
    caption:
      "Same Skill, different posture. Each face inherits the same shape.",
  },
  closeSection: {
    eyebrow: "What this leaves behind",
    title: "An engine that ages well.",
    titleEm: "Four postures, one shape.",
    body:
      "Cost, feasibility, coordination, stress-test — different surfaces, the same encoded judgment underneath. Each posture inherits the substrate, the freedom map and the headless surfaces. The interface is proof; the substrate is the asset.",
    primary: { label: "Back to the vision", href: "/" },
    secondary: { label: "See the campaign demo", href: "/campaign-substrate" },
  },
  useCases: productDesignUseCases,
  defaultUseCaseId: "feasibility",
};

/* ─────────────────────────────────────────────────────────────────────────
 * Role 02 — Ecom Program Manager (mapped from `01_Input/im-team-overview.html`)
 *
 * Four use cases. Channel Requirement Generator (Agent 02) and Creative
 * Brief Synthesiser (Agent 03) are merged into a single "Brief & Channel
 * Synthesiser" use case because they read the same Hub knowledge and
 * fire back-to-back on the same campaign row.
 * ─────────────────────────────────────────────────────────────────── */

const ecomPmUseCases: UseCase[] = [
  {
    id: "oa",
    badge: "Agent · 01",
    shortName: "OA Drafter",
    owner: "Greg · Programme + Ecom CM",
    problem: {
      title: "Outline Agreements stall on the blank page.",
      evidence:
        "Door classification, RAPID, scope guardrails — every campaign restarts the same drafting work. The kick-off capture sits there, unread.",
    },
    consoleTitle: "OA substrate",
    consoleCaption:
      "Sits inside Monday via the MCP connector — drafts straight back into the Campaign Master WorkDoc.",
    sources: [
      { name: "Prior campaign retros", kind: "ledger" },
      { name: "Insights Hub", kind: "corpus" },
      { name: "Marketing Calendar", kind: "board" },
      { name: "CPC outputs", kind: "doc" },
      { name: "Industry / geo insights", kind: "research" },
      { name: "Kick-off Notetaker capture", kind: "transcript" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Door classification, RAPID, scope guardrails. Budget > €50K triggers Finance Agree. Leaves Why now? blank for the Brief Owner.",
      },
      {
        tag: "examples",
        sample:
          "Loop Eclipse OA becomes the canonical 1-way launch pattern. Always-on tweaks become the 2-way pattern.",
      },
      {
        tag: "voice",
        sample:
          "Names the door. Refuses to soften 1-way calls. Confidence dot flags low-evidence drafts.",
      },
      {
        tag: "guards",
        sample:
          "Never publishes. Never approves. Drafts and stops. Low confidence renders a red dot, not a green one.",
      },
    ],
    surfaces: [
      { name: "Monday WorkDoc", glyph: "M" },
      { name: "Slack alert", glyph: "S" },
      { name: "Notetaker capture", glyph: "N" },
      { name: "Campaign Portfolio", glyph: "P" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where the OA already lives — Section 1 of every Campaign Master WorkDoc.",
    bands: {
      locked: {
        headline: "Locked. Door classification, RAPID, scope guardrails.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Door: 1-way · 2-way" },
          { kind: "alert", label: "RAPID required" },
          { kind: "alert", label: "Scope IN / OUT" },
          { kind: "alert", label: "Finance Agree if > €50K" },
          { kind: "success", label: "Why now? left blank" },
        ],
      },
      guided: {
        headline: "Guided. Campaign type, market scope, channel mix.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Type: Ecom · Brand · NPD" },
          { kind: "neutral", label: "Markets: .com · .de · .fr · MP" },
          { kind: "neutral", label: "Channel inclusion" },
          { kind: "neutral", label: "Audience prioritisation" },
        ],
      },
      open: {
        headline: "Open. Comparison framing and narrative tone.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Register" },
          { kind: "neutral", label: "Comparison framing" },
          { kind: "neutral", label: "Narrative tone" },
          { kind: "neutral", label: "Confidence wording" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nclassify:  1-way · 2-way\nrapid:     R · A · P · I · D\nbudget:    finance-agree if > €50K\nwhy-now:   leave blank (human)\n\nGUIDED — medium freedom\ntype:      ecom · brand · partnership · npd\nmarkets:   .com · .de · .fr · marketplaces\nchannels:  meta · search · crm · pr · influencer\n\nOPEN — high freedom\nregister, comparison framing, narrative tone\nfree composition inside the contract\n\nsubstrate\ncorpus:    loop://retro/*\nhub:       loop://insights-hub/*\ncalendar:  loop://marketing-calendar\nevals:     loop://oa-eval/*",
    freedomNote:
      "Monday's automation polices Locked. The Brief Owner composes inside Open. Same Skill, different posture.",
  },
  {
    id: "channel",
    badge: "Agent · 02–03",
    shortName: "Brief & Channel",
    owner: "Brief Owner · Helen, channel owners",
    problem: {
      title: "Channels read like different campaigns.",
      evidence:
        "L1 Master Brief and L1 Finer Details get drafted in isolation. Conflicts surface in Studio — too late to be cheap.",
    },
    consoleTitle: "Brief & Channel substrate",
    consoleCaption:
      "Fires twice — once on OA approval, once on L1 Finer Details submission. Same Hub, anchored brief, conflicts surfaced before Studio.",
    sources: [
      { name: "Approved OA", kind: "doc" },
      { name: "L1 Master Brief archive", kind: "corpus" },
      { name: "Insights Hub", kind: "corpus" },
      { name: "Channel performance benchmarks", kind: "ledger" },
      { name: "Channel best-practice library", kind: "doc" },
      { name: "Kick-off Notetaker capture", kind: "transcript" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "L1 Master Brief template fields are LOCK. Per-channel L1 Finer Details inherit the Master's audience cuts. Second fire QAs for cross-channel contradictions.",
      },
      {
        tag: "examples",
        sample:
          "Loop Eclipse Master + Performance + CRM L1s become the reference set. Conflict cases become anti-patterns.",
      },
      {
        tag: "voice",
        sample:
          "Anchors every channel to the Master. Names cross-channel disagreements explicitly. Single-minded message stays single.",
      },
      {
        tag: "guards",
        sample:
          "Never publishes. Flags if Hub data is older than the campaign's planning window. Conflict-flag fire is non-optional.",
      },
    ],
    surfaces: [
      { name: "Monday WorkForms", glyph: "M" },
      { name: "Monday WorkDoc", glyph: "W" },
      { name: "Slack channel", glyph: "S" },
      { name: "Studio Projects board", glyph: "P" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where channel inputs already get gathered — one form per channel, pre-populated.",
    bands: {
      locked: {
        headline: "Locked. Template fields, audience anchoring, conflict QA.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "L1 Master template fields" },
          { kind: "alert", label: "L1 Finer Details template" },
          { kind: "alert", label: "Hub-anchored audience cuts" },
          { kind: "alert", label: "Conflict-flag on second fire" },
          { kind: "success", label: "Studio sign-off required" },
        ],
      },
      guided: {
        headline: "Guided. Per-channel cuts, benchmarks, best practice.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Audience cut per channel" },
          { kind: "neutral", label: "Prior performance benchmarks" },
          { kind: "neutral", label: "Channel best-practice library" },
          { kind: "neutral", label: "Asset density per channel" },
        ],
      },
      open: {
        headline: "Open. Single-minded message and channel angle.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Single-minded message" },
          { kind: "neutral", label: "Channel-specific angle" },
          { kind: "neutral", label: "Think · Feel · Do phrasing" },
          { kind: "neutral", label: "Strategic insight tone" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\ntemplate:  l1-master, l1-finer-details\nanchor:    hub-audience-cuts\nqa-fire:   on-l1-finer-submit\nrefuse:    cross-channel-contradiction\n\nGUIDED — medium freedom\nbenchmarks: per-channel-prior-performance\npractice:   channel-best-practice-library\ndensity:    asset-count-per-channel\n\nOPEN — high freedom\nsingle-minded message, channel angle\nthink/feel/do phrasing\nfree composition inside the contract\n\nsubstrate\ncorpus:    loop://l1-master/*\nhub:       loop://insights-hub/*\nevals:     loop://brief-eval/*",
    freedomNote:
      "The channel forms compose inside Open. The Master template polices Locked. Same Skill, different posture.",
  },
  {
    id: "risk",
    badge: "Agent · 04",
    shortName: "Risk Sentinel",
    owner: "Greg + leadership · Slack",
    problem: {
      title: "Risks surface late, scattered across channels.",
      evidence:
        "Stalled stages, spec-lock breaches, Studio bottlenecks — each shows up in a different chat. Nobody sees the portfolio shape until the dates slip.",
    },
    consoleTitle: "Risk substrate",
    consoleCaption:
      "Fires every 15 minutes across all active campaign rows. Posts to Slack only when state has changed since the last check.",
    sources: [
      { name: "Campaign Portfolio board", kind: "board" },
      { name: "Studio Projects connect", kind: "board" },
      { name: "Mirror columns (parent campaign)", kind: "matrix" },
      { name: "Stage history", kind: "ledger" },
      { name: "Spec-lock register", kind: "ledger" },
      { name: "Slack channel routing", kind: "directory" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Stage static for 5+ days = stalled. Asset delivery vs go-live gap rules per asset class. Post-lock change attempt = breach. Studio item delaying ≥2 campaigns = portfolio bottleneck.",
      },
      {
        tag: "examples",
        sample:
          "Eclipse asset shoot delay becomes the canonical Studio-bottleneck signal. Late-stage spec edit becomes the canonical breach.",
      },
      {
        tag: "voice",
        sample:
          "Quiet by design. Only posts when state has changed. Names the rule that fired and links to the Monday item.",
      },
      {
        tag: "guards",
        sample:
          "Never escalates without a deep link. Never duplicates a still-open alert. Spec breach also notifies leadership for awareness.",
      },
    ],
    surfaces: [
      { name: "Slack alerts", glyph: "S" },
      { name: "Slack daily digest", glyph: "D" },
      { name: "Campaign Portfolio", glyph: "P" },
      { name: "Studio Projects", glyph: "T" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where the team already coordinates — the Sentinel just makes the signal stop slipping.",
    bands: {
      locked: {
        headline: "Locked. Detection thresholds and escalation triggers.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Stalled: ≥ 5 days" },
          { kind: "alert", label: "Spec-lock breach" },
          { kind: "alert", label: "Asset vs go-live gap" },
          { kind: "alert", label: "Studio cross-campaign block" },
          { kind: "success", label: "Quiet when no change" },
        ],
      },
      guided: {
        headline: "Guided. Channel routing, severity, escalation paths.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Slack channel routing" },
          { kind: "neutral", label: "Severity tier" },
          { kind: "neutral", label: "Owner escalation" },
          { kind: "neutral", label: "Per-event vs digest" },
        ],
      },
      open: {
        headline: "Open. Alert framing and risk phrasing.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Alert framing" },
          { kind: "neutral", label: "Risk phrasing" },
          { kind: "neutral", label: "Suggested next step" },
          { kind: "neutral", label: "Portfolio context line" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nstalled:     >= 5 days static\nbreach:      post-lock change attempt\nbottleneck:  studio item blocks >= 2 campaigns\ngap:         asset delivery vs go-live\nquiet:       only on state-change\n\nGUIDED — medium freedom\nrouting:     channel-by-domain\nseverity:    info · attention · blocker\nmode:        per-event · daily-digest\n\nOPEN — high freedom\nalert framing, risk phrasing, next-step prompts\nfree composition inside the contract\n\nsubstrate\nportfolio:   loop://campaign-portfolio\nstudio:      loop://studio-projects\nevals:       loop://risk-eval/*",
    freedomNote:
      "Slack composes inside Open. The detection rules police Locked. Same Skill, different posture.",
  },
  {
    id: "retro",
    badge: "Agent · 05",
    shortName: "Retro Synthesiser",
    owner: "Campaign team + Analytics",
    problem: {
      title: "Retros happen — and then nothing.",
      evidence:
        "Learnings sit in WorkDocs nobody reads. Without tagging, the next campaign starts from scratch instead of from yesterday.",
    },
    consoleTitle: "Retro substrate",
    consoleCaption:
      "Fires when the Campaign End Date passes — drafts the retro WorkDoc and tags learnings so the next campaign can find them.",
    sources: [
      { name: "Monday board history", kind: "ledger" },
      { name: "Campaign Master WorkDoc", kind: "doc" },
      { name: "Notetaker captures", kind: "transcript" },
      { name: "Drive 06_Reporting", kind: "folder" },
      { name: "Drive 08_Reference", kind: "folder" },
      { name: "Slack channel mentions", kind: "stream" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Structure = What went well · What could be improved · What we'd do differently. Hashtag taxonomy is fixed. L1 retros trigger an Analytics handoff; smaller retros close without it.",
      },
      {
        tag: "examples",
        sample:
          "Loop Eclipse retro becomes the canonical L1 shape. Always-on retro becomes the lighter-touch shape.",
      },
      {
        tag: "voice",
        sample:
          "Compresses the campaign's process and decisions into a structured draft. Names the source for each learning.",
      },
      {
        tag: "guards",
        sample:
          "Never closes the retro. Never tags outside the canonical taxonomy. L1 handoff to Analytics is non-optional.",
      },
    ],
    surfaces: [
      { name: "Monday WorkDoc", glyph: "M" },
      { name: "Drive folder", glyph: "D" },
      { name: "Slack channel", glyph: "S" },
      { name: "Analytics board", glyph: "A" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where retros already live — the Synthesiser just makes them indexable.",
    bands: {
      locked: {
        headline: "Locked. Structure, hashtag taxonomy, Analytics handoff.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "WW · WCBI · WWDD" },
          { kind: "alert", label: "Hashtag taxonomy" },
          { kind: "alert", label: "L1 → Analytics handoff" },
          { kind: "success", label: "Source named per learning" },
        ],
      },
      guided: {
        headline: "Guided. Source weighting and learning prioritisation.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Notetaker weighting" },
          { kind: "neutral", label: "Slack mention weighting" },
          { kind: "neutral", label: "Decision-log priority" },
          { kind: "neutral", label: "Reporting threshold" },
        ],
      },
      open: {
        headline: "Open. Narrative shape and tone of learnings.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Narrative shape" },
          { kind: "neutral", label: "Tone of learnings" },
          { kind: "neutral", label: "Counterfactual framing" },
          { kind: "neutral", label: "Recommendation phrasing" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nstructure:  ww · wcbi · wwdd\ntaxonomy:   loop://retro-tag/*\nhandoff:    l1 -> analytics\nsource:     name-per-learning\n\nGUIDED — medium freedom\nweighting:  notetaker, slack, decisions\nthreshold:  reporting-significance\npriority:   campaign-end-date\n\nOPEN — high freedom\nnarrative shape, tone, counterfactual framing\nrecommendation phrasing\nfree composition inside the contract\n\nsubstrate\ncorpus:     loop://retro/*\ncaptures:   loop://notetaker/*\nevals:      loop://retro-eval/*",
    freedomNote:
      "The campaign team composes inside Open. The taxonomy polices Locked. Same Skill, different posture.",
  },
];

const ecomPmRole: Role = {
  id: "ecom-pm",
  label: "Ecom Program Manager",
  selectorKicker: "OA · Brief & Channel · Risk · Retro",
  hero: {
    eyebrow: "Intelligence Layer · Ecom Program Manager",
    titlePre: "Encode the programme.",
    titleEm: "Run on every campaign.",
    lede:
      "Build the structure that makes one more CM enough — by encoding the predictable, time-eating parts of the role. Drafting OAs, synthesising briefs, surfacing risks, drafting retros. Encode the judgment once; every agent inherits it.",
    actions: [
      { id: "build", label: "Build one for your workstream", href: "/intelligence-layer/build?role=ecom-pm", primary: true },
      { id: "gallery", label: "See the four agents", href: "#substrate-gallery" },
    ],
  },
  diagnosis: {
    eyebrow: "02 · Diagnosis",
    titlePre: "Four agents.",
    titleEm: "One missing piece.",
    gap: {
      label: "Shared gap",
      title: "Coordination is",
      titleEm: "not encoded.",
      sub: "Drafting · synthesis · risk routing · retro tagging",
    },
    resolution: {
      leadEm: "Encode it once.",
      rest: "Same engine drafts, synthesises, flags and retros.",
    },
    flow: {
      kicker: "Once Navigate exposes the predictable parts",
      steps: [
        { label: "Navigate", body: "the time-eating work is named" },
        { label: "Encode", body: "turn it into one Skill per agent" },
        { label: "Build", body: "every campaign runs through one engine" },
      ],
    },
  },
  galleryCopy: {
    eyebrow: "",
    titlePre: "Do not automate the CM.",
    titleEm: "Encode the programme.",
    lede:
      "The work is not generating more campaigns. The work is making each campaign decision legible to the model — once — so every agent inherits the same substrate. Monday holds state. Claude drafts. Slack notifies. Workspace archives.",
    flankLabels: { sources: "Data sources", interfaces: "Interfaces" },
    bridgeBadge: "Headless",
    bridgeCaption: "Monday MCP",
    promises: [
      { strong: "Captured.", body: "Predictable parts of the CM role become legible substrate." },
      { strong: "Owned.", body: "Versioned in the Hub, edited by the team — not held in heads." },
      { strong: "Portable.", body: "One change. Every agent inherits. NPD, Brand, Performance follow." },
    ],
  },
  shiftCopy: {
    eyebrow: "",
    titlePre: "From rules engineered",
    titleEm: "to context encoded.",
    lede:
      "Monday's automations handle the plumbing — boards, sub-items, locks, sweeps. Claude handles the judgment — reading the WorkDoc, synthesising across docs, surfacing conflicts. The boundary is sharp, on purpose.",
    old: {
      label: "Old contract · Monday automations",
      headline: "EVERY TRIGGER ENGINEERED",
      rules: [
        "if stage_change: create_subitem",
        "if date_passed: send_form",
        "if column_edit: lock_columns",
        "if form_returned: advance_stage",
        "if 09:00_monday: sweep_status",
      ],
      moreLine: "... more automations",
      footnote: "COVERAGE GROWS BY ADDING TRIGGERS",
      caption:
        "Works for board operations and state machines. Breaks down when the work needs to read a doc, synthesise across campaigns, or weigh trade-offs.",
    },
    next: {
      label: "New contract · Skills",
      headline: "ONE FILE. ONE INTELLIGENCE.",
      skillTag: "SKILL",
      skillTitle: "rules + examples + voice + guards",
      skillSub: "the agent contract",
      intelTag: "INTELLIGENCE",
      intelLine: "interprets context inside boundaries",
      footnote: "COVERAGE GROWS BY IMPROVING CONTEXT",
      caption:
        "The work shifts upstream: encode what is true about each agent's job, then validate the drafts the human still owns.",
    },
    strip: [
      { label: "Bottleneck", body: "From writing automations to curating the Hub." },
      { label: "Delivery", body: "From four ad-hoc workflows to one engine with four agents." },
      { label: "Governance", body: "From scattered chats to a portfolio view and tagged retros." },
    ],
  },
  freedomCopy: {
    eyebrow: "",
    titlePre: "One Skill per agent.",
    titleEm: "Three degrees of freedom.",
    lede:
      "Each agent encoded as a file. The Skill sets where the model is locked, guided, or open: rigid where governance is high (door classification, hashtag taxonomy), parameterised where context shifts (channel cuts, severity tiers), free where craft matters (narrative tone, alert framing).",
    levelLabels: { locked: "Low", guided: "Medium", open: "High" },
    skillCardHead: "skill.md, compressed",
    caption:
      "Same Skill, different posture. Each agent inherits the same shape.",
  },
  closeSection: {
    eyebrow: "What this leaves behind",
    title: "An engine that ages well.",
    titleEm: "Four agents, one shape.",
    body:
      "Eight stages, four layers, four agents. Same engine underneath. Each agent inherits the substrate, the freedom map and the headless surfaces. Monday holds state, Claude drafts, Slack notifies, Workspace archives. The interface is proof; the substrate is the asset.",
    primary: { label: "Back to the vision", href: "/" },
    secondary: { label: "See the campaign demo", href: "/campaign-substrate" },
  },
  useCases: ecomPmUseCases,
  defaultUseCaseId: "oa",
};

/* ─────────────────────────────────────────────────────────────────────────
 * Role 03 — Legal (workshop scaffolding for the legal-team session)
 *
 * Four use case skeletons designed to be filled in live with the
 * legal team. The wording here is plausible starting copy, not Loop's
 * actual legal policies — the workshop's job is to encode the real
 * version. The shape exists so the builder has somewhere to land
 * on Day 1 of the session.
 * ─────────────────────────────────────────────────────────────────── */

const legalUseCases: UseCase[] = [
  {
    id: "claim",
    badge: "Use case 01",
    shortName: "Claims Review",
    owner: "Legal counsel + Brand",
    problem: {
      title: "Claims ship ahead of substantiation.",
      evidence:
        "Comparative and performance claims go live before the file proving them lands. Reviewers re-read the same three sources every campaign.",
    },
    consoleTitle: "Claims substrate",
    consoleCaption:
      "Sits over the substantiation library and the banned-language list — flags before legal does, so the rewrite arrives with the brief.",
    sources: [
      { name: "Substantiation library", kind: "corpus" },
      { name: "Prior approved claims", kind: "ledger" },
      { name: "Test reports", kind: "research" },
      { name: "Banned-language list", kind: "policy" },
      { name: "Regulator advisory archive", kind: "doc" },
      { name: "Reviewer decision log", kind: "ledger" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Comparator claims require a public, dated source. Performance claims require an in-house test report linked by ID. Superlative without substantiation is BLOCK.",
      },
      {
        tag: "examples",
        sample:
          "Loop Quiet 2 noise-reduction claim becomes the canonical substantiated pattern. The unbacked superlative from the v0 hero copy becomes the canonical anti-example.",
      },
      {
        tag: "voice",
        sample:
          "Plain, evidence-led. Names the rule that fired. Never softens a block to be agreeable. Suggests the closest substantiated phrasing.",
      },
      {
        tag: "guards",
        sample:
          "Never approves. Never invents a citation. Low-confidence sources render a red dot, not a green one.",
      },
    ],
    surfaces: [
      { name: "Figma plugin", glyph: "F" },
      { name: "Slack DM", glyph: "S" },
      { name: "Notion panel", glyph: "N" },
      { name: "Monday card", glyph: "M" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where claims already get reviewed — pre-emptively, before legal opens the doc.",
    bands: {
      locked: {
        headline: "Locked. Banned terms, comparator restrictions, superlatives.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Banned: medical-grade*" },
          { kind: "alert", label: "Banned: cures / treats" },
          { kind: "alert", label: "Comparator needs source" },
          { kind: "alert", label: "Superlative needs proof" },
          { kind: "success", label: "Substantiation-linked claim" },
        ],
      },
      guided: {
        headline: "Guided. Per-market positioning, audience, evidence weight.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Market: EU · UK · US · APAC" },
          { kind: "neutral", label: "Audience: consumer / pro" },
          { kind: "neutral", label: "Evidence weight: A · B · C" },
          { kind: "neutral", label: "Channel sensitivity" },
        ],
      },
      open: {
        headline: "Open. Phrasing, framing, hedging language.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Hedge density" },
          { kind: "neutral", label: "Comparison framing" },
          { kind: "neutral", label: "Caveat order" },
          { kind: "neutral", label: "Confidence wording" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nbanned:    banned-language://*\ncomparator: needs-public-dated-source\nsuperlative: needs-test-report-id\nrefuse-on: missing-substantiation\n\nGUIDED — medium freedom\nmarket:    eu · uk · us · apac\naudience:  consumer · pro\nevidence:  weight-a · weight-b · weight-c\n\nOPEN — high freedom\nphrasing, hedging, caveat order\nfree composition inside the contract\n\nsubstrate\nlibrary:   loop://substantiation/*\napproved:  loop://claim-decision/*\nevals:     loop://claim-eval/*",
    freedomNote:
      "The Figma plugin composes inside Open. The banned-language list polices Locked. Same Skill, different posture.",
  },
  {
    id: "contract",
    badge: "Use case 02",
    shortName: "Contract Scan",
    owner: "Legal counsel",
    problem: {
      title: "The same redlines come back, every time.",
      evidence:
        "Counterparty MSAs deviate from the playbook in predictable ways. Each round restarts the reading from scratch. Escalations sit in inboxes.",
    },
    consoleTitle: "Contract substrate",
    consoleCaption:
      "Reads incoming redlines against the approved playbook — surfaces deviations and proposes the canonical counter-language.",
    sources: [
      { name: "Approved MSA playbook", kind: "doc" },
      { name: "Fallback clause library", kind: "corpus" },
      { name: "Prior counterparty redlines", kind: "ledger" },
      { name: "Escalation register", kind: "ledger" },
      { name: "Jurisdiction matrix", kind: "matrix" },
      { name: "GC decision log", kind: "ledger" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Liability caps below playbook minimum are BLOCK. IP assignment carve-outs are BLOCK. Indemnity tiering escalates to GC above threshold X.",
      },
      {
        tag: "examples",
        sample:
          "Vendor A's 2024 redline becomes the canonical accept-with-tweak pattern. Vendor B's IP carve-out becomes the canonical refuse-and-escalate.",
      },
      {
        tag: "voice",
        sample:
          "Names the playbook clause that fired. Proposes the canonical counter-language verbatim. Refuses to soften an escalation trigger to be agreeable.",
      },
      {
        tag: "guards",
        sample:
          "Never signs. Never approves a carve-out on a locked clause. Escalation triggers route to GC by name, with a deep link to the redline.",
      },
    ],
    surfaces: [
      { name: "Word add-in", glyph: "W" },
      { name: "DocuSign panel", glyph: "D" },
      { name: "Cursor", glyph: "c" },
      { name: "Slack thread", glyph: "S" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where contracts already live — the scan just stops the same rounds repeating.",
    bands: {
      locked: {
        headline: "Locked. Liability, IP, indemnity floors.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Liability cap floor" },
          { kind: "alert", label: "IP assignment scope" },
          { kind: "alert", label: "Indemnity tier" },
          { kind: "alert", label: "Audit-right minimum" },
          { kind: "success", label: "Playbook fallback available" },
        ],
      },
      guided: {
        headline: "Guided. Governing law, dispute mode, term length.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Governing law preference" },
          { kind: "neutral", label: "Dispute: arbitration / court" },
          { kind: "neutral", label: "Term: 1y / 2y / 3y" },
          { kind: "neutral", label: "Renewal mode" },
        ],
      },
      open: {
        headline: "Open. Framing of counter-proposals, cover-note tone.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Counter-proposal framing" },
          { kind: "neutral", label: "Cover-note tone" },
          { kind: "neutral", label: "Relationship register" },
          { kind: "neutral", label: "Concession order" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nliability:   cap-floor by playbook\nip:          full-assignment, no carve-outs\nindemnity:   tier-by-revenue\naudit-right: minimum-window\nrefuse-on:   locked-clause-carveout\n\nGUIDED — medium freedom\nlaw:        gov-law-preference\ndispute:    arbitration · court\nterm:       1y · 2y · 3y\n\nOPEN — high freedom\ncounter-proposal framing, cover-note tone\nfree composition inside the contract\n\nsubstrate\nplaybook:   loop://msa-playbook\nfallbacks:  loop://fallback-clause/*\nredlines:   loop://counterparty-redline/*\nevals:      loop://contract-eval/*",
    freedomNote:
      "The Word add-in composes inside Open. The escalation triggers police Locked. Same Skill, different posture.",
  },
  {
    id: "disclosure",
    badge: "Use case 03",
    shortName: "Disclosure Tone",
    owner: "Legal + Brand",
    problem: {
      title: "Disclosures read either lawyerly or wishful.",
      evidence:
        "Warranty wording, returns policies and consumer-facing disclaimers swing between defensible and on-brand. Rarely both. Each pass starts from scratch.",
    },
    consoleTitle: "Disclosure substrate",
    consoleCaption:
      "Sits between the approved warranty wording and the brand voice guide — keeps both rails on every disclosure that ships.",
    sources: [
      { name: "Approved warranty wording", kind: "doc" },
      { name: "Returns policy archive", kind: "corpus" },
      { name: "Regulatory disclosures", kind: "doc" },
      { name: "Consumer complaint analysis", kind: "research" },
      { name: "Brand voice guide", kind: "doc" },
      { name: "Translation memory", kind: "corpus" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Mandatory consumer-rights wording is LOCK. Warranty term and scope are LOCK. Tone above mandatory line is GUIDED by the brand voice. Empty space at the bottom is OPEN.",
      },
      {
        tag: "examples",
        sample:
          "Loop's 2025 returns policy becomes the canonical on-brand defensible pattern. Vendor-supplied warranty boilerplate becomes the canonical lawyerly anti-example.",
      },
      {
        tag: "voice",
        sample:
          "Reads like a person explaining the rule, not a person hiding behind it. Names the right the consumer has. Defensible without being grudging.",
      },
      {
        tag: "guards",
        sample:
          "Never removes a mandatory clause. Never invents a consumer right that doesn't apply in the jurisdiction. Flags translations that have drifted from source.",
      },
    ],
    surfaces: [
      { name: "CMS plugin", glyph: "C" },
      { name: "Figma plugin", glyph: "F" },
      { name: "Slack", glyph: "S" },
      { name: "Notion", glyph: "N" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where consumer-facing copy already gets written — the scan adds the legal rail.",
    bands: {
      locked: {
        headline: "Locked. Mandatory wording and statutory rights.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Mandatory consumer rights" },
          { kind: "alert", label: "Warranty term + scope" },
          { kind: "alert", label: "Jurisdictional disclaimers" },
          { kind: "success", label: "Reading-grade ceiling" },
        ],
      },
      guided: {
        headline: "Guided. Market, audience, channel sensitivity.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Market-specific wording" },
          { kind: "neutral", label: "Channel: web / packaging" },
          { kind: "neutral", label: "Audience: consumer / pro" },
          { kind: "neutral", label: "Translation register" },
        ],
      },
      open: {
        headline: "Open. Brand-voice phrasing inside the rail.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Brand register" },
          { kind: "neutral", label: "Tone of empathy" },
          { kind: "neutral", label: "Headline phrasing" },
          { kind: "neutral", label: "CTA framing" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nmandatory:   consumer-rights-by-market\nwarranty:    term · scope\ndisclaimers: jurisdiction-specific\nreading:     grade-ceiling\nrefuse-on:   mandatory-removal\n\nGUIDED — medium freedom\nmarket:    eu · uk · us · apac\nchannel:   web · packaging · email\naudience:  consumer · pro\n\nOPEN — high freedom\nbrand register, tone of empathy, CTA framing\nfree composition inside the contract\n\nsubstrate\nwarranty:    loop://warranty-approved\nrights:      loop://consumer-rights-matrix\nvoice:       loop://brand-voice\nevals:       loop://disclosure-eval/*",
    freedomNote:
      "The CMS plugin composes inside Open. The mandatory rights police Locked. Same Skill, different posture.",
  },
  {
    id: "regulatory",
    badge: "Use case 04",
    shortName: "Regulatory Fit",
    owner: "Legal + Compliance",
    problem: {
      title: "This message, this market, this product — allowed?",
      evidence:
        "Campaign approvals stall on the matrix. The matrix sits in a spreadsheet only two people read. The same questions get re-asked every launch.",
    },
    consoleTitle: "Regulatory substrate",
    consoleCaption:
      "Encodes the jurisdiction-by-product matrix so a brief gets a green/amber/red before legal opens the doc.",
    sources: [
      { name: "Jurisdiction-product matrix", kind: "matrix" },
      { name: "Product registration register", kind: "ledger" },
      { name: "Prior approval decisions", kind: "ledger" },
      { name: "Regulator advisory archive", kind: "corpus" },
      { name: "Banned-jurisdiction list", kind: "policy" },
      { name: "Audience-targeting rules", kind: "policy" },
    ],
    substrate: [
      {
        tag: "rules",
        sample:
          "Product unregistered in market = BLOCK. Audience targeting under 18 with medical adjacency = BLOCK. Pending registration with promotional spend = REVIEW.",
      },
      {
        tag: "examples",
        sample:
          "Loop Quiet 2 launch in DE becomes the canonical green pattern. The pending-registration FR campaign becomes the canonical amber. The pre-approval US medical-adjacent draft becomes the canonical red.",
      },
      {
        tag: "voice",
        sample:
          "Names the jurisdiction and the rule. Cites the registration record by ID. Refuses to invent permission that doesn't exist.",
      },
      {
        tag: "guards",
        sample:
          "Never approves on stale matrix data. Never invents a registration. Pending registrations render amber, not green, until the cert lands.",
      },
    ],
    surfaces: [
      { name: "Monday board", glyph: "M" },
      { name: "Slack alert", glyph: "S" },
      { name: "Notion", glyph: "N" },
      { name: "Campaign Portfolio", glyph: "P" },
      { name: "MCP / REST", glyph: "{}" },
    ],
    surfacesNote: "Where the matrix already lives — the scan just makes it readable by the system.",
    bands: {
      locked: {
        headline: "Locked. Allow-list per product per jurisdiction.",
        posture: "Deterministic",
        chips: [
          { kind: "alert", label: "Unregistered = block" },
          { kind: "alert", label: "Banned jurisdiction" },
          { kind: "alert", label: "Under-18 medical adjacency" },
          { kind: "alert", label: "Pending registration = review" },
          { kind: "success", label: "Registered + audience-clear" },
        ],
      },
      guided: {
        headline: "Guided. Audience targeting, channel mix, evidence cite.",
        posture: "Contextual",
        chips: [
          { kind: "neutral", label: "Audience age bands" },
          { kind: "neutral", label: "Channel: paid / organic / packaging" },
          { kind: "neutral", label: "Evidence citation" },
          { kind: "neutral", label: "Caveat density" },
        ],
      },
      open: {
        headline: "Open. Framing of caveats and conditional copy.",
        posture: "Generative",
        chips: [
          { kind: "neutral", label: "Caveat framing" },
          { kind: "neutral", label: "Conditional phrasing" },
          { kind: "neutral", label: "Disclaimer placement" },
          { kind: "neutral", label: "Tone of restraint" },
        ],
      },
    },
    skillMd:
      "LOCKED — low freedom\nmatrix:       loop://reg-matrix\nregistered:   product × jurisdiction allow-list\nbanned:       banned-jurisdiction://*\nunder-18:     refuse-on-medical-adjacency\npending:      render-amber\n\nGUIDED — medium freedom\naudience:    age-bands\nchannel:     paid · organic · packaging\nevidence:    needs-citation\n\nOPEN — high freedom\ncaveat framing, conditional phrasing, disclaimer placement\nfree composition inside the contract\n\nsubstrate\nmatrix:      loop://reg-matrix\ndecisions:   loop://regulatory-decision/*\nadvisories:  loop://regulator-advisory/*\nevals:       loop://regulatory-eval/*",
    freedomNote:
      "The Monday board composes inside Open. The matrix polices Locked. Same Skill, different posture.",
  },
];

const legalRole: Role = {
  id: "legal",
  label: "Legal",
  selectorKicker: "Claim · Contract · Disclosure · Regulatory",
  hero: {
    eyebrow: "Intelligence Layer · Legal",
    titlePre: "Encoded legal judgment.",
    titleEm: "Read before the doc is opened.",
    lede:
      "Four use cases that already eat your week — claims review, contract scans, disclosure tone, regulatory fit. Encode the playbook once; every brief, every redline, every disclosure inherits it. Workshop scaffolding ready to be filled in live.",
    actions: [
      { id: "build", label: "Build one for your workstream", href: "/intelligence-layer/build?role=legal", primary: true },
      { id: "gallery", label: "See the four use cases", href: "#substrate-gallery" },
    ],
  },
  diagnosis: {
    eyebrow: "02 · Diagnosis",
    titlePre: "Four reviews.",
    titleEm: "One missing piece.",
    gap: {
      label: "Shared gap",
      title: "Legal judgment is",
      titleEm: "not encoded.",
      sub: "Playbook · substantiation · matrix · voice",
    },
    resolution: {
      leadEm: "Encode it once.",
      rest: "Same engine reviews claims, contracts, disclosures and regulatory fit.",
    },
    flow: {
      kicker: "Once Navigate exposes the predictable parts",
      steps: [
        { label: "Navigate", body: "the repeated reviews are named" },
        { label: "Encode", body: "turn the playbook into one Skill" },
        { label: "Build", body: "every brief and redline runs through one engine" },
      ],
    },
  },
  galleryCopy: {
    eyebrow: "",
    titlePre: "Do not automate the review.",
    titleEm: "Encode the playbook.",
    lede:
      "The work is not generating more memos. The work is making the playbook legible to the model — once — so every brief and redline arrives pre-read. Reviewers spend their time on the hard calls, not the obvious ones.",
    flankLabels: { sources: "Data sources", interfaces: "Interfaces" },
    bridgeBadge: "Headless",
    bridgeCaption: "MCP / REST",
    promises: [
      { strong: "Captured.", body: "Playbook, substantiation, matrix, voice become legible substrate." },
      { strong: "Owned.", body: "Versioned and reviewable. Legal edits the file, not the team's tribal memory." },
      { strong: "Portable.", body: "One change. Claims, contracts, disclosures, regulatory all inherit." },
    ],
  },
  shiftCopy: {
    eyebrow: "",
    titlePre: "From rules engineered",
    titleEm: "to context encoded.",
    lede:
      "This is not a brittle rules engine trying to predict every clause. It is a Skill package and harness that gives an intelligent model the playbook, the boundaries, and the review loop. The hard calls stay human.",
    old: {
      label: "Old contract · Checklist + email",
      headline: "EVERY REVIEW REPEATED",
      rules: [
        "if claim_unsubstantiated: send_email",
        "if cap_below_floor: route_GC",
        "if missing_mandatory_clause: redline",
        "if pending_registration: hold",
        "if vendor_carveout: escalate",
      ],
      moreLine: "... more inboxes",
      footnote: "COVERAGE GROWS BY ADDING REVIEWERS",
      caption:
        "Works for slow review cycles and small volumes. Breaks down when speed-to-market matters and reviewers become the bottleneck.",
    },
    next: {
      label: "New contract · Skills",
      headline: "ONE FILE. ONE INTELLIGENCE.",
      skillTag: "SKILL",
      skillTitle: "rules + examples + voice + guards",
      skillSub: "the playbook contract",
      intelTag: "INTELLIGENCE",
      intelLine: "interprets context inside boundaries",
      footnote: "COVERAGE GROWS BY IMPROVING CONTEXT",
      caption:
        "The work shifts upstream: encode the playbook, then validate the briefs that arrive pre-read by the engine.",
    },
    strip: [
      { label: "Bottleneck", body: "From queuing for reviewers to curating the playbook." },
      { label: "Delivery", body: "From four ad-hoc inboxes to one engine with four faces." },
      { label: "Governance", body: "From email approvals to a registry, evals and audit trail." },
    ],
  },
  freedomCopy: {
    eyebrow: "",
    titlePre: "One Skill per posture.",
    titleEm: "Three degrees of freedom.",
    lede:
      "Each posture encoded as a file. The Skill sets where the model is locked, guided, or open: rigid where statute is at stake (mandatory disclosures, banned terms), parameterised where context shifts (market, audience), free where craft matters (framing, voice).",
    levelLabels: { locked: "Low", guided: "Medium", open: "High" },
    skillCardHead: "skill.md, compressed",
    caption:
      "Same Skill, different posture. Each face inherits the same shape.",
  },
  closeSection: {
    eyebrow: "What this leaves behind",
    title: "A playbook that ages well.",
    titleEm: "Four reviews, one shape.",
    body:
      "Claims, contracts, disclosures, regulatory — different surfaces, the same encoded playbook underneath. Each posture inherits the substrate, the freedom map and the headless surfaces. Reviewers do the hard calls; the engine handles the obvious ones.",
    primary: { label: "Build your legal engine", href: "/intelligence-layer/build?role=legal" },
    secondary: { label: "Back to the vision", href: "/" },
  },
  useCases: legalUseCases,
  defaultUseCaseId: "claim",
};

/* ─────────────────────────────────────────────────────────────────────────
 * Roles registry
 * ─────────────────────────────────────────────────────────────────── */

export const roles: Role[] = [
  creativeStrategyRole,
  productDesignRole,
  ecomPmRole,
  legalRole,
];

export const defaultRoleId: RoleId = "creative-strategy";

const ROLE_BY_ID = new Map<RoleId, Role>(roles.map((r) => [r.id, r]));

export function getRole(id: RoleId): Role {
  const found = ROLE_BY_ID.get(id);
  if (!found) {
    throw new Error(`Unknown role id: ${id}`);
  }
  return found;
}

/**
 * Look up a use case inside a specific role. Throws if the id is not part
 * of the role — surfaces wiring mistakes early instead of silently
 * rendering an empty case.
 */
export function getUseCase(role: Role, id: UseCaseId): UseCase {
  const found = role.useCases.find((c) => c.id === id);
  if (!found) {
    throw new Error(
      `Unknown use case id "${id}" for role "${role.id}". ` +
        `Available: ${role.useCases.map((c) => c.id).join(", ")}.`,
    );
  }
  return found;
}

/**
 * Resolve a possibly-untrusted role id (e.g. from a search param) to a
 * known `RoleId`. Falls back to the default when the value is unknown.
 */
export function resolveRoleId(value: string | null | undefined): RoleId {
  if (!value) return defaultRoleId;
  return ROLE_BY_ID.has(value as RoleId) ? (value as RoleId) : defaultRoleId;
}

/* ─────────────────────────────────────────────────────────────────────
 * Page-level content (homepage chrome version)
 *
 * The sections below drive the top of `/intelligence-layer` rendered in
 * homepage `aiop-*` chrome. They sit alongside the existing role-based
 * content (which still feeds the parked deep-dive sections at the
 * bottom of the page).
 * ─────────────────────────────────────────────────────────────── */

export const pageMeta = {
  brandLeft: "Aether",
  brandSub: "Loop's Intelligence Layer",
  status: "Running · 13 teams",
  links: [
    { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
    { id: "substrate-map", label: "The layer", href: "#substrate-map" },
    { id: "engine-pattern", label: "Receipts", href: "#engine-pattern" },
    /* "The engine" lives directly below the receipts carousel as a
       live, multi-Skill composer. Renders the trace + a small
       ontology view as the run streams in. Wired in
       `app/page.tsx` via <Engine section={pageEngineSection} />. */
    { id: "engine", label: "The engine", href: "#engine" },
    { id: "deep-dive", label: "Deep dive", href: "#substrate-gallery" },
  ],
} as const;

/*
 * Title mirrors the homepage hero exactly — same two-line shape and
 * the same italic violet em on the second line — but swaps the noun
 * from "operating layer" to "intelligence layer" so the page names
 * itself on arrival. Lede stays focused on the layer between data
 * and tools; the Navigate / Encode / Build flywheel narrative lives
 * on the homepage.
 */
export const pageHero = {
  titleLines: [
    "The intelligence layer for AI",
    { em: "inside Loop." },
  ] as const,
  lede: [
    "Every team\u2019s way of working, encoded into a layer any AI can use. Built inside the work. Owned by Loop. Survives any model change.",
  ] as const,
  actions: [
    { id: "see-layer", label: "See the layer", href: "#substrate-map", primary: true },
    { id: "receipts", label: "See the receipts", href: "#engine-pattern" },
  ],
} as const;

/* Role-agnostic diagnosis header — same anchor phrase the homepage
   uses on its diagnosis ("We have the know-how, but it doesn't
   compound.") so a stakeholder arriving from the homepage reads it
   as a continuation. */
export const pageDiagnosisHead = {
  /* v3 — softer present-continuous framing. "doesn't compound" read
   * as a verdict; "isn't compounding yet" reads as the current
   * state with an implicit "we're working on it". Pairs with the
   * EnginePattern section below, which now positions the Skills
   * as the active solution to this gap. */
  title: "We have the know-how,",
  titleEm: "but it isn\u2019t compounding yet.",
  sub:
    "The know-how lives in heads, and the system can\u2019t see it. So every new tool, hire, or model has to learn Loop from scratch. Pick a function below to see where it stalls.",
  selectorLabel: "Viewing as",
  gap: {
    eyebrow: "Shared gap",
    title: "Four functions. The same missing layer.",
  },
} as const;

/* DiagnosisCard shape — replicates the homepage's `DiagnosisUseCase`
   shape so the new component doesn't import operator content. */
export type DiagnosisCard = {
  id: string;
  tag: string;
  tone: "violet" | "gold" | "sage" | "slate";
  title: string;
  body: string;
};

const TONE_BY_INDEX: ReadonlyArray<DiagnosisCard["tone"]> = [
  "violet",
  "gold",
  "sage",
  "slate",
];

/* Map each role's four UseCases (already authored with role-specific
   pain points) into the homepage-style DiagnosisCard shape. */
export const pageDiagnosisByRole: Record<RoleId, readonly DiagnosisCard[]> = {
  "creative-strategy": creativeStrategyUseCases.map(
    (c, i): DiagnosisCard => ({
      id: c.id,
      tag: `Creative Strategy · ${c.shortName}`,
      tone: TONE_BY_INDEX[i]!,
      title: c.problem.title,
      body: c.problem.evidence,
    }),
  ),
  "product-design": productDesignUseCases.map(
    (c, i): DiagnosisCard => ({
      id: c.id,
      tag: `Product Design · ${c.shortName}`,
      tone: TONE_BY_INDEX[i]!,
      title: c.problem.title,
      body: c.problem.evidence,
    }),
  ),
  "ecom-pm": ecomPmUseCases.map(
    (c, i): DiagnosisCard => ({
      id: c.id,
      tag: `Ecom Program · ${c.shortName}`,
      tone: TONE_BY_INDEX[i]!,
      title: c.problem.title,
      body: c.problem.evidence,
    }),
  ),
  legal: legalUseCases.map(
    (c, i): DiagnosisCard => ({
      id: c.id,
      tag: `Legal · ${c.shortName}`,
      tone: TONE_BY_INDEX[i]!,
      title: c.problem.title,
      body: c.problem.evidence,
    }),
  ),
};

/* Substrate map — three columns rendered in the homepage's
   `aiop-substrate-map` chrome. Knowledge Graph is called out
   explicitly inside Trusted Sources as the ontology layer above the
   raw systems. No Navigate/Encode/Build phase pills. */
export const pageSubstrateMap = {
  /* v3 — restate the diagnosis as the substrate map's claim. Where
   * the previous title described WHAT the layer is ("between data
   * and tools"), the new title names WHY it's missing — the gap the
   * three columns below fill. Mirrors the framing the page leads
   * with ("we have the know-how but it isn't compounding yet") and
   * the Loop-internal vocabulary (intelligence layer, not operating
   * layer). The lede now points at the inheritance the layer
   * unlocks — same judgment across every headless surface — so the
   * reader connects "what Loop owns" to "what every AI surface
   * inherits". */
  title: "What\u2019s missing is an",
  titleEm: "intelligence layer.",
  body:
    "Loop already owns these pieces. The layer connects them, so every headless AI surface inherits the same judgment.",
  columns: {
    sources: {
      n: "01",
      kicker: "Trusted sources",
      title: "Where the work already lives.",
      caption:
        "An ontology AI can read, built on the systems Loop already runs.",
      /*
       * Two quiet pieces inside this column: a single-line ontology
       * caption naming what the knowledge graph holds (Customer,
       * Brief, Persona, Hook, Campaign), and a compact 2-column chip
       * grid of the systems of record below. No framed sub-card —
       * the column's own caption already names the ontology, so a
       * boxed callout reads as redundant chrome.
       */
      ontology: {
        kind: "Knowledge Graph",
        objects: ["Customer", "Brief", "Persona", "Hook", "Campaign"],
      },
      systems: {
        items: [
          "Snowflake",
          "ThoughtSpot",
          "Frontify",
          "Monday",
          "Notion",
          "SAP / Arena / CRM",
        ],
      },
    },
    substrate: {
      n: "02",
      kicker: "Encoded substrate",
      badge: "Authority layer",
      title: "How the team decides.",
      caption:
        "Rules, examples, voice, review gates — encoded once, owned internally, model-portable.",
      items: [
        { tag: "Rules", name: "How the team decides" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Voice", name: "How Loop sounds" },
        { tag: "Loops", name: "Who confirms what" },
      ],
      tags: ["Owned internally", "Versioned", "Model-portable"],
    },
    surfaces: {
      n: "03",
      kicker: "Headless surfaces",
      badge: "Headless wrapper",
      title: "Where Loop calls the engine.",
      caption:
        "Same engine, many surfaces. Pick the surface that fits the moment.",
      items: [
        { icon: "C", name: "Cursor" },
        { icon: "Cl", name: "Claude" },
        { icon: "\u25D0", name: "Web app" },
        { icon: "{ }", name: "REST" },
        { icon: "#", name: "Slack" },
        { icon: "A", name: "Agents" },
      ],
    },
  },
  closing:
    "Work stays in place. Substrate carries the judgment. Surfaces inherit it.",
} as const;

/*
 * Section header override for the homepage `<EnginePattern />`. The
 * carousel cards reuse `enginePatternSection.cards` from
 * `content/operator.ts` — single source of truth for who shipped
 * what across Loop.
 *
 * Title states the concrete fact the carousel proves: six functions
 * surfaced the same Skill architecture without coordinating. The sub
 * names which six, lands the "same shape, different verbs" anchor,
 * and frames the current moment as the transition from a series of
 * workshops into a layer. Matches the framing in the May 18 Monday
 * scoreboard summary (Aether · Loop's Intelligence Layer).
 */
export const pageEnginePatternHeader = {
  id: "engine-pattern",
  ariaLabel:
    "The Skills being built across Loop — fifteen Skills, one card each, three visible at a time",
  header: {
    /* v4 — position the Skills as the active answer to the
     * Diagnosis section above. Title splits across an italic em
     * pivot that names the artefact AND its job: filling the
     * intelligence layer. The sub names what each card represents
     * (a team workflow encoded as substrate) and closes the loop
     * with the page's lead phrase — "the know-how is starting to
     * compound." */
    title: "",
    titleEm: "The Skills, already filling the layer.",
    /* Only the subject word ("Skills") renders in violet inside the
       italic em; the rest of the phrase inherits the title's ink
       colour so the highlight reads as the section's lede rather
       than the whole italic line shouting in primary. */
    titleEmHighlight: "Skills",
    sub:
      "Each card below is one team\u2019s workflow, encoded as substrate other teams can call into. Some shipped, some in build, all running on the same engine. The know-how is starting to compound.",
  },
} as const;

/* ───────────────────────────────────────────────────────────────────
 * Question interlude — interstitial between The Engine and Vision.
 *
 * After the live engine demo, the page needs one calm beat that
 * pivots the narrative from "here is the thing running" to "and
 * here is the program that makes it run." A single editorial
 * question opens that door; Vision's flywheel answers it.
 *
 * Voice mirrors the homepage's other editorial breath beats: short,
 * unattributed, italic display type. The delayed parenthetical
 * arrives a beat later via scroll-driven reveal so the question
 * lands first and the punchline lands second — same choreography
 * pattern as the Shards `quote-bridge` interlude this is modelled
 * after, but stripped of the third-party attribution because the
 * question is Loop's own, not a borrowed voice.
 * ─────────────────────────────────────────────────────────────────── */

export const pageQuestionInterstitialSection = {
  id: "question",
  ariaLabel:
    "An interlude question that opens the adoption-flywheel chapter below",
  /* Optional eyebrow above the question. Empty by default — the
     question lands alone as the editorial centerpiece, no marker
     above it competing for attention. To bring the marker back,
     set this to a short mono-caps string (e.g. "Interlude"). */
  eyebrow: "",
  /* The question itself. Renders as the editorial centerpiece in
     italic display type, sized as the section's hero. Locked to a
     single line at >= 1100px viewports via `white-space: nowrap`
     so the question reads as one continuous typographic gesture
     rather than wrapping into a stack. */
  question: "But how do you actually get here?",
  /* Sub-answer rendered directly under the question in a quieter,
     plain-ink display style (not italic, no quotes). Closes the
     question with a one-line answer-hint so the visitor reads the
     question + the hint as a paired beat before scrolling into
     the Evans bridge / colleague / spectrum chapters that unpack
     the why. */
  subline: "By tackling the hardest challenge first.",
  /* Optional delayed parenthetical that fades in as the visitor
     begins to scroll past the interlude. Empty by default — the
     subline above carries the answer-hint, and the chapters
     below carry the unpacking. */
  scrollNote: "",
} as const;

/* ───────────────────────────────────────────────────────────────────
 * Evans bridge — anchors the adoption chapter to a credible outside
 * voice. The Benedict Evans sentence reads as the editorial
 * centerpiece; three operative phrases inside it map to the three
 * flywheel lanes (Navigate / Encode / Build) and are framed as
 * subtle bordered chips in those lane colours so the visitor
 * pre-reads the framework about to resolve in Vision below.
 *
 * Ported from the Shards `quoteBridgeSection` in
 * `00_shards/app/ai-operator/content.ts` so the two repos stay
 * conceptually in sync. The lane mapping is identical because
 * Aether's Vision uses the same Navigate / Encode / Build
 * vocabulary the Shards page does.
 * ─────────────────────────────────────────────────────────────────── */

export type EvansBridgePart = {
  text: string;
  mark?: "navigate" | "encode" | "build";
  pill?: "Navigate" | "Encode" | "Build";
};

export const pageEvansBridgeSection = {
  id: "evans-bridge",
  ariaLabel:
    "Benedict Evans on the hidden work behind useful AI, paired with the new-colleague frame",
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
  ] satisfies EvansBridgePart[],
  /* The follow-on under Evans's quote turns the abstract gap into
     a concrete reframe. "Treat it like a colleague." lands as a
     standalone declarative sentence above the question so the
     visitor reads it as the practical fix Evans is pointing at,
     then the question below asks them to do the exercise. Voice
     follows the thoughtform-strategy rules: short declaratives,
     no balanced short-pair construction, no em dashes. */
  pivotLine: "Treat it like a colleague.",
  /* Closing question. `explain to them` is the amber accent so
     the question reads as one paired beat with the chips above
     and the spectrum title in the next slide ("Why treat AI like
     a colleague."). Copy carried over from the Loop AI workshop
     deck (`workshop_pm-product_2026-05-12.html`) so the page
     speaks in the voice that already lands in the room. */
  followQuestion:
    "If a really smart new colleague joined your team tomorrow, what would you need to {{explain to them}} before they could do useful work?",
} as const;

/* ───────────────────────────────────────────────────────────────────
 * Tool/Collaborator spectrum — names the structural reason the
 * asking gap is hard: AI is neither a tool nor a collaborator, so
 * the playbooks built for either fail. Three-stop continuum slider
 * (Tool / AI lives here / Collaborator) with the middle column
 * highlighted because that is the mental-model shift the visitor
 * needs to internalise before the Vision flywheel reads as the
 * answer.
 *
 * Ported from Shards `aiRealitySection` in
 * `00_shards/app/ai-operator/content.ts`. The slider visual is
 * lifted from the Thoughtform Continuum Spectrum.
 * ─────────────────────────────────────────────────────────────────── */

export type ToolCollabColumn = {
  id: "tool" | "middle" | "collab";
  label: string;
  title: string;
  /* Short fragment that fleshes out the column title. The voice is
     deliberately conversational — short clauses separated by
     periods or commas — so the spectrum reads as three
     crystallised takes, not three bullet-point summaries. */
  sub: string;
  align: "left" | "center" | "right";
  highlight?: boolean;
};

export const pageToolCollabSection = {
  id: "tool-collab",
  ariaLabel:
    "Why we treat AI like a colleague — the tool-to-collaborator continuum",
  title: "Why we treat AI",
  titleEm: "like a colleague.",
  /* `lede` carries the framing; `ledeStrong` is the punchline
     rendered as a `<strong>` so the navigate-it-first thesis
     lands hard and primes the flywheel below. Voice follows the
     thoughtform-strategy rules: AI sits between a tool and a
     collaborator; the same surface plays both registers depending
     on the work. No "X is not Y" balanced short-pair, no em
     dashes, no forced rule-of-three. */
  lede:
    "AI sits between a tool and a collaborator. Sometimes you give it commands. Sometimes you brainstorm with it. The same surface plays both registers, often in the same conversation. ",
  ledeStrong:
    "The teams that get value learn to navigate both.",
  spectrum: {
    railLabel: "Tool to collaborator continuum",
    columns: [
      {
        id: "tool",
        label: "Tool",
        title: "Executes commands",
        sub: "Predictable software that does what we ask, or gives clear errors when it fails.",
        align: "left",
      },
      {
        id: "middle",
        /* "AI lives here" stays as the rail label because it
           anchors the centre diamond as the active marker. The
           title used to read "Neither pure tool nor true
           collaborator" — a textbook balanced short-pair the
           voice rules explicitly reject. The sub keeps "trained
           on us, but not like us" because the contrast carries
           actual meaning. */
        label: "AI lives here",
        title: "Both, at once",
        sub: "Trained on us, but not like us. A new paradigm no LinkedIn bro teaches you how to navigate.",
        align: "center",
        highlight: true,
      },
      {
        id: "collab",
        label: "Collaborator",
        title: "Interprets intent",
        sub: "Opinionated. Brainstorms with you, challenges your ideas, just listens when you vent.",
        align: "right",
      },
    ] satisfies ToolCollabColumn[],
  },
} as const;

/*
 * Engine section — copy for the live multi-Skill composer that
 * sits directly under <EnginePattern /> on this route. The shape
 * matches `EngineSection` in `components/operator/engine.tsx`; the
 * component owns the textarea + SSE client + trace render and
 * reads the chip suggestions from `content/engine-skills.ts`.
 *
 * Voice: declarative, no em dashes, no "X is not Y, it is Z"
 * cadence. Title splits across an italic violet em pivot so the
 * line rhymes typographically with the rest of the section heads
 * (Diagnosis, The Layer, Receipts, Vision).
 */
export const pageEngineSection = {
  id: "engine",
  ariaLabel:
    "The Engine: a live workbench where one business question fans across the encoded Skills, the synthesis composes in the centre column, and every relevant judgment lands as a row in the lens trace",
  eyebrow: "The engine",
  /* Header copy. The opening sentence names the verb the section
     adds to the standing report — "ask the layer". The italic em
     completes it with the move the engine actually makes: fan a
     question across every relevant judgment encoded in the layer. */
  title: "Ask the layer.",
  titleEm: "One question, every relevant judgment.",
  sub:
    "Type a business question. The engine routes it through the Skills it needs, returns one answer with the trace, and leaves a node behind. The knowledge graph builds itself.",
  /* Form labels. PMM/Brand can swap voice without touching
     component code. */
  askLabel: "Ask the engine",
  askHint: "Live · routes through 3 to 6 Skills · synthesis follows",
  placeholder:
    "e.g. What is the business thinking about the Loop Eclipse 2 launch across product, UX, sustainability, retail timing, and founder voice?",
  composeLabel: "Compose",
  composingLabel: "Composing",
  chipsLabel: "Pick a Loop product question to compose",
  /* Column 1 — reading-scope register. Five options that nudge the
     router toward a particular bias without ever hard-filtering the
     pool of eight Skills. The router still picks 3–6 from the same
     set; `bias` is appended as one steering line on top of the
     existing system prompt. `auto` sends nothing. */
  scopeLabel: "Reading scope",
  scopeHint: "Steers the router · auto-route by default",
  scopeOptions: [
    {
      id: "auto",
      label: "Auto-route",
      caption: "Let the router pick the lenses the question needs.",
      bias: "",
    },
    {
      id: "launch",
      label: "Launch",
      caption: "Bias to execution lenses — CMF, packaging, retail timing, risk.",
      bias:
        "The user picked the Launch scope. Weight your selection toward Skills that read for execution, retail timing, on-shelf landing, and supplier or schedule risk. Keep at least one strategic lens in the pick so the answer isn't only operational.",
    },
    {
      id: "strategy",
      label: "Strategy",
      caption: "Bias to portfolio lenses — concept fit, sustainability, risk, voice.",
      bias:
        "The user picked the Strategy scope. Weight your selection toward Skills that read for portfolio shape, concept fit, sustainability and reporting impact, program risk, and founder voice. Keep at least one execution lens so the answer stays grounded.",
    },
    {
      id: "brand",
      label: "Brand",
      caption: "Bias to voice and surface — founder voice, packaging, CMF, UX.",
      bias:
        "The user picked the Brand scope. Weight your selection toward Skills that read for how Loop reads externally — founder voice, packaging, CMF, and UX. Keep at least one risk or timing lens so the answer doesn't ignore execution constraints.",
    },
    {
      id: "operations",
      label: "Operations",
      caption: "Bias to risk and compliance — risk, sustainability, packaging, calendar.",
      bias:
        "The user picked the Operations scope. Weight your selection toward Skills that read for risk taxonomy, sustainability and reporting impact, packaging compliance, and retail calendar. Keep at least one strategic or brand lens so the answer doesn't read as pure ops.",
    },
  ] as const,
  /* Column 3 — lens trace head. Replaces the standalone "Trace" /
     "Skill fragments" eyebrows the stacked layout used. */
  traceColumnLabel: "Lens trace",
  traceColumnHint: "One row per Skill the router fires",
  traceEmptyTitle: "Trace will fill as the router fires.",
  traceEmptyBody:
    "The router picks 3 to 6 lenses for your question. Each one streams a fragment here as it reads.",
  /* Column 2 — synthesis pane. Three states: empty / running / done.
     Done state still uses `synthEyebrow` + `synthTitle` for the head
     so existing copy lands unchanged. */
  synthEyebrow: "Synthesis",
  synthTitle: "Composed answer",
  synthEmptyTitle: "Awaiting question.",
  synthEmptyBody:
    "Pick a chip or type your own. Compose will route through 3 to 6 lenses, stream each Skill's fragment to the trace, then compose one answer here.",
  synthRunningTitle: "Composing across the lenses.",
  synthRunningBody:
    "Each Skill is streaming its read in the trace column. The synthesis lands here when the router finishes routing and the fragments come together.",
  /* Empty-state copy. Replaces the rate-limit / error pane until
     the first composition lands. Kept for back-compat with the
     existing component prop shape. */
  emptyCaption:
    "Pick a chip or type your own. The router fires the lenses, each Skill streams its fragment, then the engine composes one answer with citations.",
} as const;

export const pageClose = {
  title: "The layer is the asset.",
  titleEm: "The surfaces are interchangeable.",
  body:
    "Encode the judgment once. Every tool, every agent, every interface inherits it. The next model wins something cheaper, not something that starts from zero.",
  actions: [
    { id: "home", label: "Back to the vision", href: "/", primary: true },
    { id: "deep-dive", label: "See the deep dive", href: "#substrate-gallery" },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Degrees of Freedom — Creative Strategy workstreams (executive view)
 *
 * Dedicated, route-local dataset for the `#freedom` section on `/`.
 * Replaces the earlier role-shared `freedomCopy` + `getUseCase`
 * pipeline, which was a) coupled to the role dropdown above
 * Diagnosis and b) framed in Mímir-internal vocabulary (Reiss 16,
 * supportingReviewIds, scope-first scoring) that read as engineering
 * config rather than executive judgment.
 *
 * Each workstream describes one Creative Strategy practice already
 * running inside Mímir today, broken into three explicit freedom
 * bands the same way a Skill is authored:
 *
 *   - LOW  · locked foundations. Things the model may not invent
 *           or rename. Visualised in red so the eye reads the
 *           guardrail before anything else.
 *   - MED  · judgment with context. Where the model chooses
 *           inside a known frame.
 *   - HIGH · creative generation. Where the model is free to
 *           compose inside the boundaries above.
 *
 * Mímir is the production proof for these practices; the dataset
 * sits one level above the engineering schema in
 * `creativeStrategyUseCases.skillMd` so a non-technical reader can
 * scan the three cards and understand the contract without reading
 * config syntax.
 * ─────────────────────────────────────────────────────────────── */

export type FreedomBandLevel = "low" | "medium" | "high";

export type FreedomBand = {
  level: FreedomBandLevel;
  /* Short title for the band card. */
  label: string;
  /* One-line description of what this band controls. Reads as the
     statement the bullets underneath complete (e.g. "Locked. The
     foundations every hook ships with." -> bullets list those
     foundations). */
  headline: string;
  /* Exactly three bullet examples, in `term \u2014 description`
     shape so each bullet reads grammatically below the headline
     AND collapses cleanly into the dark Skill template card on the
     right. */
  examples: readonly string[];
};

export type FreedomWorkstream = {
  id: string;
  /* Short tab label. */
  label: string;
  /* Mono-caps tab badge. */
  badge: string;
  /* One-line description that lands under the tab strip when the
     workstream is active. */
  description: string;
  bands: {
    low: FreedomBand;
    medium: FreedomBand;
    high: FreedomBand;
  };
  /* Short note printed at the foot of the dark Skill template
     card. Names where this Skill lives and what it inherits. */
  skillNote: string;
};

export const creativeStrategyFreedomWorkstreams: readonly FreedomWorkstream[] = [
  /* v3 — collapsed to a single Creative Strategy workstream and
   * rewritten in plain executive language. The earlier list (Hook
   * Synthesis, Persona Mining, Review Grounding, Briefing Synthesis)
   * was four FACETS of the same workstream, not different ones, so
   * each tab forced the reader to switch between near-identical
   * cards. More importantly, the band examples reached for Mímir
   * vocabulary (Reiss 16, Schwartz 5, Life Force 8) that doesn't
   * mean anything to an executive reader.
   *
   * The new shape is one workstream entry; the component hides the
   * tab strip when only one is present and surfaces a quiet
   * `WORKSTREAM 01 \u00b7 Creative Strategy` eyebrow above the
   * description. Additional workstreams (Product Management, Talent
   * Acquisition, etc.) will join later as new entries when their
   * data exists. */
  {
    id: "creative-strategy",
    label: "Creative Strategy",
    badge: "Workstream 01",
    description:
      "Creative Strategy turns customer evidence into campaigns. Here is what the team locks down, what it guides, and what it leaves open for the AI to compose.",
    bands: {
      low: {
        level: "low",
        label: "Low freedom",
        headline: "Locked. The strategic foundations the AI must not invent.",
        examples: [
          "Customer needs \u2014 the AI works from the team\u2019s agreed list of human desires and motivations, never a new one it made up.",
          "Awareness stage \u2014 whether the customer knows they have the problem, is comparing solutions, or is ready to buy.",
          "Evidence rule \u2014 every claim ties back to a real customer review or research source. No source, no claim.",
        ],
      },
      medium: {
        level: "medium",
        label: "Medium freedom",
        headline: "Guided. Choices the AI makes inside the team\u2019s frame.",
        examples: [
          "Hook angle \u2014 the AI picks how to lean in: a story, a comparison, a regret moment, a point-of-view shift, and so on.",
          "Audience persona \u2014 which segment the campaign speaks to (sleep, focus, parenting, music lover, etc.).",
          "Funnel stage and format \u2014 awareness, consideration, retention, or objection-handling, and the format that fits (UGC, founder voice, listicle, press).",
        ],
      },
      high: {
        level: "high",
        label: "High freedom",
        headline: "Open. Where the AI is free to compose.",
        examples: [
          "Hook copy \u2014 the actual sentence, in Loop\u2019s voice.",
          "Customer quote \u2014 which review the AI picks to anchor the hook.",
          "Angle phrasing \u2014 how the AI makes the chosen angle land for the audience.",
        ],
      },
    },
    skillNote:
      "Creative Strategy ships as one Skill in the team\u2019s repo. Every surface that drafts campaigns \u2014 Mímir, Claude, Cursor, Slack \u2014 reads the same contract.",
  },
];

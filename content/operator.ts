/*
 * Aether landing — content module (Loop internal capability proposal).
 *
 * v13 narrative arc: the page makes the internal case for Loop's
 * AI operating layer. Industry signal opens (the labs are spending
 * billions to embed forward-deployed engineers and PE-backed
 * deployment ventures), Loop's 18-month proof carries the middle,
 * the decision lands the close. No portrait. No personal CV.
 *
 * Page arc:
 *   01 Hero          — Industry signal thesis + Loop's four working
 *                      systems as the right-column proof tile.
 *   02 Diagnosis     — Four organisational patterns, one missing
 *                      layer between how teams work and what AI does.
 *   03 Quote bridge  — Evans on the asking gap. Quote and chips fade
 *                      on scroll, parenthetical "(because AI isn't
 *                      software)" reveals beneath the attribution.
 *   04 Reality check — Tool-to-collaborator continuum. Why traditional
 *                      adoption playbooks don't carry AI.
 *   05 Vision        — Navigate / Encode / Build orbit + market-
 *                      signals marquee (WSJ, Bloomberg, OpenAI,
 *                      Anthropic) as the receipt the thesis is real.
 *   06 Flywheel      — Internal Loop framing: who builds shifts
 *                      when the loop turns.
 *   07 Approach      — Navigate / Encode / Build deep-dive cards.
 *   08 Software/few  — The market gap the operator works in.
 *   09 Cases         — Mímir, Vesper, Babylon, Heimdall in production.
 *   10 Headless-shift — Architecture, not a dashboard.
 *   11 Substrate map — Three layers, one operating model.
 *   12 Surface pick  — One substrate, pick the surface that fits.
 *   13 CTA           — The decision. Pick the first workflows.
 *
 * Voice: direct, punchy, warm. Strategy and building stay in the same
 * hands. One thought per line when the thought matters.
 */

/* ─────────────────────────────────────────────────────────────────────
 * Top bar
 *
 * Sticky header with brand left, section nav centre/right. No
 * walkthrough launcher on the internal Loop version — the page is
 * not a personal CV. The nav anchors to the structural beats of the
 * argument: diagnosis (the missing layer), vision (the operating
 * model), approach (the flywheel deep dive), cases (Loop proof),
 * headless (the architecture), and the decision (the close).
 * ─────────────────────────────────────────────────────────────────── */

export const meta = {
  brandLeft: "Aether",
  brandSub: "Loop's Intelligence Layer",
  status: "Creative Technology · 18 months in production",
  links: [
    { id: "product", label: "Product", href: "#substrate-map" },
    { id: "proof", label: "Proof", href: "#function-impact" },
    { id: "vision", label: "Vision", href: "#vision" },
    { id: "approach", label: "Approach", href: "#approach" },
    { id: "cases", label: "Cases", href: "#cases" },
    { id: "team", label: "Team", href: "#team-shape" },
  ],
  cta: { label: "The decision", href: "#cta" },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Hero — Declarative announcement of the Forward-Deployed Hub
 *
 * Mirrors the OpenAI Deployment Company landing register: one big
 * declarative title, one supporting sentence, one quiet proof strip,
 * two clear CTAs. No 2x2 systems grid — the four programs already get
 * their full case treatment under `Cases`, and the new Hub Mandate
 * section right after the hero carries the function's right-column
 * composition card.
 *
 * No portrait. No contact strip. No personal walkthrough button.
 * The page is an internal capability proposal, not a CV.
 * ─────────────────────────────────────────────────────────────────── */

export type HeroProofMetric = {
  v: string;
  k: string;
};

/* Retained from the previous hero composition. The Hub Mandate
   section's composition card uses its own `HubCompositionSeat`
   shape, but other modules (e.g. case-row internals that key off
   the codename pattern) still import this type, so leaving it
   exported keeps the public surface stable. */
export type HeroSystemTile = {
  id: string;
  num: string;
  name: string;
  codename: string;
  codenameEm: string;
  team: string;
  summary: string;
  /* Status drives the dot colour on the tile head — `production`
     prints as the emerald in-production marker, `pilot` as a
     muted gold. */
  status: "production" | "pilot";
  statusLabel: string;
};

export const hero = {
  eyebrow: "Aether · Loop's Forward-Deployed Hub",
  /* Two-line declarative product statement — Linear/SaaS register.
     No "launches" verb, no press-release framing. Names what Aether
     IS, not the moment it shipped. The em wraps the load-bearing
     scope clause so the second line lands as the punch. */
  titleLines: [
    "The operating layer for AI",
    { em: "inside Loop." },
  ] as const,
  /* One short paragraph, ~22 words. Hero lede stays declarative;
     the full mandate, the industry signal, and the load-bearing
     thesis live in the sections below. */
  lede: [
    "Every team's way of working, encoded into a layer any AI can use. Built inside the work. Owned by Loop. Survives any model change.",
  ] as const,
  /* Two actions. Primary jumps to the Substrate Map / Product
     section (lifted to position 02 in v18); ghost jumps to the
     "Already running" 3-wave receipts for executives who want
     proof first. */
  actions: [
    { id: "product", label: "See the product", href: "#substrate-map", primary: true },
    { id: "running", label: "What's already running", href: "#function-impact" },
  ],
  /* Inline 3-stat meta strip rendered under the hero actions
     (Stripe Link / TwelveLabs grammar). Absorbs the previous
     `<HeroValueStrip />` 3-tile beat by trading abstract value
     labels (Embedded / Encoded / Compounding) for concrete
     receipts (days · workshops · programs). Keeps the hero a
     single readable column with one inline numeric proof line. */
  meta: [
    { v: "21", k: "days in production" },
    { v: "13 / 22", k: "workshops" },
    { v: "4", k: "programs running" },
  ] as const,
  /* Right-column lockup retained for type stability — no longer
     rendered. The hero's right column now hosts a flywheel-as-
     product card (see `<FlywheelOrbit variant="compact" />` slot in
     `app/page.tsx`). */
  rightLockup: {
    mark: "Aether",
    sub: "Loop's Forward-Deployed Hub",
    badge: "18 months in production",
    programs: ["Mímir", "Vesper", "Babylon", "Heimdall"] as const,
    foot: "Four named programs. One operating model. The Hub formalises it.",
  },
  /* Right-column product card — chrome around the compact flywheel
     orbit so the hero right rail reads as a polished SaaS artifact
     instead of a brand lockup. The orbit IS the product. */
  productCard: {
    eyebrow: "Operating model",
    statusLabel: "Live",
    foot: "Navigate the workflow \u00b7 Encode the judgment \u00b7 Build the headless capability",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Hero value strip — 3 tiles between hero and Hub Mandate
 *
 * Linear's home opens with a quiet "Built for purpose / Powered by
 * AI agents / Designed for speed" three-tile strip just below the
 * hero. We mirror that rhythm: three terse value tiles render on a
 * thin paper rule between `<section.aiop-hero>` and `<HubMandate />`,
 * each one mono-caps key + a one-line value clause. Replaces the
 * 4-up metric grid that previously crowded the hero copy column.
 * ─────────────────────────────────────────────────────────────────── */

export const heroValueStrip = {
  tiles: [
    {
      id: "embedded",
      k: "Embedded",
      v: "Inside the cohort, on real work, from day one.",
    },
    {
      id: "encoded",
      k: "Encoded",
      v: "Skills the team owns, not prompts that vanish.",
    },
    {
      id: "compounding",
      k: "Compounding",
      v: "Each team starts further along than the last.",
    },
  ] as const,
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Hub Mandate — Section 2, the function laid out
 *
 * Sits immediately under the hero and before `Diagnosis`. Inherits
 * the AI Operator landing's old "section 2" geometry (the CV portrait
 * + bio two-column hero pattern) but the portrait slot becomes a
 * team-composition card and the bio becomes the function's mandate.
 *
 * Composition (mirrors `.aiop-hero__inner` two-column grid so the
 * page reads as one continuous opening beat):
 *
 *   - Left column: eyebrow → bicolour title → 2-paragraph mandate
 *     → `<strong>` thesis line → action row.
 *   - Right column: composition card. `Hub composition` head, two
 *     stacked seats (Catalyst + Hardening engineer) with the same
 *     codename pattern the case rows further down the page use,
 *     a 3-row cadence strip below, and a single-line `foot`
 *     naming the founding seat.
 *
 * The thesis line ("Same operating model the labs are spending
 * billions to ship. Already running inside Loop.") is the one that
 * used to live as `hero.ledeStrong` — moved here so the hero stays
 * declarative and the mandate carries the load-bearing claim.
 * ─────────────────────────────────────────────────────────────────── */

export type HubMandateAction = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
};

export const hubMandateSection: {
  id: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  lede: readonly string[];
  ledeStrong: string;
  orbitCaption: string;
  actions: HubMandateAction[];
} = {
  id: "hub-mandate",
  eyebrow: "The function",
  title: "A Forward-Deployed Hub for Loop.",
  titleEm: "One team. Every workflow. Same operating model.",
  /* Single tightened paragraph — the industry-pattern paragraph that
     used to live here moved up into the SaaS-style hero, and the
     deeper deep-dive lives in Approach. The mandate now just names
     where this function comes from and what it formalises. */
  lede: [
    "Inside Loop, this motion has been running through Creative Technology for 18 months. Aether names it, formalises it, and makes it any team's to call on.",
  ],
  ledeStrong:
    "Same operating model the labs are spending billions to ship. Already running inside Loop.",
  /* Caption strip below the orbit on the right. Three-clause
     summary of the operating model — Navigate / Encode / Build —
     so the orbit lands as a labeled diagram, not a decorative
     mark. */
  orbitCaption:
    "Navigate the workflow \u00b7 Encode the judgment \u00b7 Build the headless capability",
  actions: [
    { id: "approach", label: "How the Hub runs", href: "#approach", primary: true },
    { id: "cases", label: "What it has shipped", href: "#cases" },
  ],
};

/* ─────────────────────────────────────────────────────────────────────
 * Function & Impact — Section 04 (v20: Single-Viewport Roadmap)
 *
 * Wedges between the labs validation (Signal) and the Diagnosis. Reads
 * as a single-viewport executive operating roadmap.
 *
 * v20 compresses the v19 console: the table-style 4 lanes x 3 columns
 * matrix, the ownership rail, and the decision gate are all retired.
 * Ownership lives in TeamShape; the decision rows live in the CTA.
 * What remains is the actual roadmap visual:
 *
 *   - Stat strip       five program receipts on one row
 *   - Lane bars        five horizontal progress bars (Infrastructure,
 *                      Adoption, Intelligence layer, Build, Scale
 *                      mandate) with a filled segment to the marker
 *                      and a dashed segment after it; status pill
 *                      on the right edge. The middle three lanes
 *                      (Adoption / Intelligence / Build) wrap inside
 *                      a bordered AI Innovation Office group so the
 *                      ownership reads top-down: VP Tech | AIO |
 *                      Founder.
 *   - Composition line one-line VP <> Office adjacency note
 *
 * Each lane carries a `summary` instead of three column cells so the
 * row stays single-line.
 *
 * Copy guardrail: the subject is the capability, not the operator.
 * Avoid "look at my workshops" framing.
 * ─────────────────────────────────────────────────────────────────── */

export type FunctionImpactLaneTone =
  | "sage"
  | "violet"
  | "amber"
  | "slate"
  | "ink";

export type FunctionImpactLane = {
  id:
    | "vision"
    | "infrastructure"
    | "adoption"
    | "intelligence"
    | "build"
    | "mandate";
  /* Two-digit ordinal ("01", "02", ...) rendered in mono at the lane
     head so the four lanes read as a numbered program list. */
  ordinal: string;
  /* Lane name, displayed in mid-size next to the ordinal. */
  name: string;
  /* Italic display sub-line beside the lane name. */
  headline: string;
  /* One short line below the lane name that carries the
     done/running/next signal in plain language. Replaces the v19
     3-column marker matrix so each lane stays a single row. */
  summary: string;
  tone: FunctionImpactLaneTone;
  /* Mono-caps status pill anchored on the right edge of the lane. */
  status: string;
  /* Position of the lane's diamond marker on its horizontal track,
     0-100. 100 = lane is fully done, 0 = lane is at the gate. */
  progress: number;
};

export type FunctionImpactMetric = {
  v: string;
  k: string;
};

/* Row in the "encoded loops" ledger banner that lands beneath the
   roadmap console. Each row pairs a function name (mono-caps, lane-
   tinted) with a one-line description of the workflow encoded inside
   that function. Tones cycle through the operator lane palette so
   the banner stays inside the design system. */
export type EncodedLoopRow = {
  fn: string;
  tone: "violet" | "amber" | "sage" | "slate";
  text: string;
};

export const functionImpactSection: {
  id: string;
  label: string;
  title: string;
  titleEm: string;
  titleAfter: string;
  sub: string;
  /* Console intro line beside the metric strip. Mono-caps. */
  intro: string;
  /* Five-up metric strip rendered above the lane bars. */
  metrics: FunctionImpactMetric[];
  lanes: FunctionImpactLane[];
  /* Single-line composition note that lands the VP <> AIO
     adjacency without spawning a whole ownership rail in this
     section. The full role rails live in TeamShape. */
  composition: string;
  /* Encoded-loops ledger banner rendered as the closing band of
     the section. Two-column ledger of every workflow already
     running inside Loop, grouped editorially by function. */
  encodedLoops: {
    eyebrow: string;
    rows: EncodedLoopRow[];
  };
} = {
  id: "function-impact",
  label: "Operating roadmap \u00b7 21 days in",
  title: "Loop already has the layer,",
  titleEm: "now it needs to scale.",
  titleAfter: "",
  sub: "Three weeks ago, Loop had no enterprise AI contract, no SSO, no workshops. Today the function exists \u2014 and what scales it is already in the building.",
  intro: "Six lanes. One signature away.",
  metrics: [
    { v: "21", k: "Days in" },
    { v: "13 / 22", k: "Workshops" },
    { v: "50+", k: "Skills identified" },
    { v: "5+", k: "Skills shipped" },
    { v: "10", k: "Named owners" },
  ],
  lanes: [
    {
      /* v20.1 \u2014 AI vision lane added as the opening standalone
         lane above Infrastructure. Names the direction the rest of
         the roadmap executes against; renders outside the AIO group
         since vision sits with the exec committee, not inside the
         AIO motion. */
      id: "vision",
      ordinal: "01",
      name: "AI vision",
      headline: "The direction is set.",
      summary:
        "Operating model, narrative, and roadmap shared with the executive committee. Every department briefed on what\u2019s coming.",
      tone: "violet",
      status: "Set",
      progress: 100,
    },
    {
      id: "infrastructure",
      ordinal: "02",
      name: "Infrastructure",
      headline: "The platform is live.",
      summary:
        "Contract, SSO, GenAI guidelines, Learning Channel \u2014 all live. Ready to hand to incoming VP Technology.",
      tone: "sage",
      status: "Done",
      progress: 100,
    },
    {
      id: "adoption",
      ordinal: "03",
      name: "Adoption",
      headline: "The flywheel is turning.",
      summary:
        "13 of 22 department workshops shipped; 9 confirmed through June. Pick the next three workflows to encode.",
      tone: "violet",
      status: "Running",
      progress: 60,
    },
    {
      id: "intelligence",
      ordinal: "04",
      name: "Intelligence layer",
      headline: "The Skill library is compounding.",
      summary:
        "5+ Skills live, 50+ identified across departments, 10 named owners. Library owner + quality gate next.",
      tone: "amber",
      status: "Compounding",
      progress: 40,
    },
    {
      /* v19 \u2014 Build lane added so the AIO cluster reads as the
         full Navigate / Encode / Build flywheel running inside Loop,
         not just adoption + encoding. Anchored to the four shipped
         tools (M\u00edmir, Vesper, Babylon, Heimdall) that the Cases
         section unpacks in detail further down the page. */
      id: "build",
      ordinal: "05",
      name: "Build",
      headline: "The first tools are already in production.",
      summary:
        "M\u00edmir, Vesper, Babylon, Heimdall \u2014 four headless tools shipped from the same substrate. Pattern proven; the next workflows pull from the workshop backlog.",
      tone: "ink",
      status: "Shipping",
      progress: 75,
    },
    {
      id: "mandate",
      ordinal: "06",
      name: "Scale mandate",
      headline: "What\u2019s needed is already in the building.",
      summary:
        "Function proven; two seats in the room \u2014 Catalyst embedded, Engineer ready. One signature formalises the office.",
      tone: "slate",
      status: "1 decision away",
      progress: 6,
    },
  ],
  composition:
    "VP Technology makes the platform safe to scale. The AI Innovation Office makes the change real inside every team.",
  encodedLoops: {
    eyebrow: "Encoded loops \u00b7 14 live across the company",
    rows: [
      {
        fn: "Legal",
        tone: "violet",
        text:
          "NDAs auto-checked against Loop templates \u2014 only exceptions reach Olga.",
      },
      {
        fn: "Legal",
        tone: "violet",
        text: "Regulatory feeds triaged weekly \u2014 a day of work gone.",
      },
      {
        fn: "Customer Ops",
        tone: "amber",
        text:
          "Support tickets scored against the quality scorecard automatically.",
      },
      {
        fn: "Customer Ops",
        tone: "amber",
        text:
          "Orders screened for fraud on Loop\u2019s own flagged patterns.",
      },
      {
        fn: "Warehousing",
        tone: "sage",
        text: "Klaviyo + Data Inzit merged into one exec readout.",
      },
      {
        fn: "People Ops",
        tone: "slate",
        text:
          "Team voice encoded once; comms drafted in-register from the start.",
      },
      {
        fn: "Product Design",
        tone: "violet",
        text: "CMF files generated from the model, not rebuilt by hand.",
      },
      {
        fn: "Program Mgmt",
        tone: "amber",
        text:
          "Status updates pulled from transcripts, boards and roadmap automatically.",
      },
      {
        fn: "Finance",
        tone: "sage",
        text: "Variance commentary drafted in Finance\u2019s own conventions.",
      },
      {
        fn: "Finance",
        tone: "sage",
        text:
          "Supplier invoices read across every template with fraud checks.",
      },
      {
        fn: "Brand",
        tone: "slate",
        text:
          "Partnership inbox tiered 1/2/3 with response drafts attached.",
      },
      {
        fn: "Brand",
        tone: "slate",
        text: "Monthly social reporting pulled from Dash Hudson + Brandwatch.",
      },
      {
        fn: "Insights",
        tone: "violet",
        text: "Claude wired into the data platform for direct querying.",
      },
      {
        fn: "TA",
        tone: "amber",
        text:
          "Employer-branding content generated against Loop\u2019s brand system.",
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * Diagnosis — four faces, one shared deployment gap
 *
 * Sits between the Hero and the Substrate Map. Names the executive-
 * level problem the substrate map then solves: Loop already has the
 * tools, the data, and the appetite, but the layer between how
 * teams actually work and what AI can do has never been encoded.
 *
 * Composition (mirrors the `/judgment-engine` route's diagnosis so
 * the operator and the judgment routes read on one rhythm):
 *
 *   1. Header  — eyebrow + bicolour h2 + 1-line sub.
 *   2. Grid    — four lane-tinted use-case cards (Brand voice,
 *                Localization, Briefing, Review logic). Each card
 *                opens a "Read context" disclosure for a one-
 *                sentence evidence note so the grid stays tight by
 *                default and the scan reads "four faces".
 *   3. Bridge  — small vertical hairline + chevron.
 *   4. Gap     — centred diamond-marked card naming the shared
 *                cause ("Not a model gap. A deployment gap.").
 *   5. Handoff — one-line italic hand into the substrate map.
 *
 * Content is the only thing that changes when the page is re-
 * skinned; the structure stays.
 * ─────────────────────────────────────────────────────────────── */

export type DiagnosisUseCase = {
  id: string;
  /* Mono-caps lane name, rendered as the only label on the card
     header (e.g. "NDA REVIEW"). The previous "Use case NN" slot
     has been retired so the card scan reads as four function
     names, not a numbered list. */
  tag: string;
  /* Card colour rail. Mirrors the operator lane palette. */
  tone: "violet" | "gold" | "sage" | "slate";
  /* Display-family headline summarising the failure mode in one
     sentence. Read as the diagnostic punch. */
  title: string;
  /* Body paragraph exposed via the per-card "Read context"
     disclosure. One short paragraph of evidence — not an argument. */
  body: string;
};

export const diagnosisSection: {
  label: string;
  title: string;
  titleEm: string;
  sub: string;
  useCases: DiagnosisUseCase[];
  /* Centred diamond-marked card naming the cause shared by all
     four use cases. Eyebrow above + display headline. The earlier
     subline and the post-card italic handoff have both been retired
     — the four cards + the gap card carry the argument on their
     own and the substrate map below picks up directly. */
  gap: {
    eyebrow: string;
    title: string;
  };
} = {
  label: "Diagnosis",
  title: "We have the know-how,",
  titleEm: "but it doesn\u2019t compound.",
  sub:
    "When the layer is missing, the work doesn\u2019t compound. Every team solves the same problem alone, every month.",
  useCases: [
    {
      id: "nda-review",
      tag: "Legal",
      tone: "violet",
      title: "Every NDA still waits on one person to read it.",
      body:
        "Olga knows which clauses are routine and which need a flag. That judgment isn't written down anywhere. Six of Legal's eight workflows run on the same unencoded methodology.",
    },
    {
      id: "variance-commentary",
      tag: "Finance",
      tone: "gold",
      title:
        "Monthly variance commentary starts from a blank page every month.",
      body:
        "The same shape, the same materiality calls, rewritten each cycle. P&L review, board-pack commentary, COGs, MEC narrative all build on the same voice and structure — none of it encoded.",
    },
    {
      id: "cmf-files",
      tag: "Product Design",
      tone: "sage",
      title:
        "CMF colour-material files get rebuilt by hand, concept after concept.",
      body:
        "The parameters are known. The work that follows from them isn't encoded, so the file gets remade from scratch each time. The underlying clown-model library has never been turned into reusable ground truth.",
    },
    {
      id: "status-updates",
      tag: "Program Management",
      tone: "slate",
      title:
        "The fortnightly program status update is assembled by hand every sprint.",
      body:
        "Transcripts, risk boards, roadmap — pulled into the same digest each cycle. The synthesis pattern is consistent. The gathering is manual, and it lives with Robert.",
    },
  ],
  gap: {
    eyebrow: "Shared gap",
    title: "Four teams. The same missing layer.",
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * Quote bridge — interstitial between hero and Vision
 *
 * Anchors the flywheel to a credible outside diagnosis (Benedict Evans
 * on the asking gap). Lives at full-viewport scale so the Evans
 * sentence has room to breathe; three operative phrases inside the
 * sentence — `working out`, `how to ask`, `what you want` — are framed
 * in their lane colours (violet / amber / sage). A delayed
 * parenthetical (`scrollNote`) sits below the attribution and arrives
 * as the visitor begins to scroll past the bridge.
 *
 * On desktop the bridge pins for an extra viewport while the visitor
 * scrolls; during that pin the quote, chips, and attribution recede
 * to a softer opacity and the parenthetical reveals a beat later.
 * The chips themselves no longer morph into pills, but the optional
 * `pill` label is preserved on each marked part: it still renders as
 * a hidden secondary layer in the chip DOM, ready to be brought back
 * if a future iteration wants the morph again.
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
  /* Delayed parenthetical that appears below the attribution as the
     visitor begins to scroll past the bridge. Driven from CSS via
     `--aiop-bridge-progress`; renders silently until the progress
     window opens, so the Evans line lands first and the editorial
     punchline arrives a beat later. Names the new category
     (intelligence, not software) so the Reality interstitial that
     follows can take that as a given and unpack it structurally. */
  scrollNote: "because AI isn't software, it's an intelligence",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Reality check — Why traditional adoption doesn't work with AI
 *
 * Sits between the Evans bridge and the Vision flywheel. Names the
 * structural reason the asking gap is hard: AI is neither a tool nor
 * a collaborator, so the playbooks built for either fail. Tool
 * rollouts teach buttons. Change programs teach behaviours. AI lives
 * between them, and adoption that works has to live inside the work.
 *
 * Composition (mirrors the diagnosis title-left + lede-right header
 * pattern so the two read as one rhythm):
 *
 *   1. Header — eyebrow + title on the left, lede paragraph on the
 *      right. Same grid as `.aiop-diagnosis__head`.
 *   2. Continuum spectrum — full-width horizontal slider with three
 *      diamond markers on a rail (Tool / AI lives here / Collaborator)
 *      and a 3-column grid below carrying label / title / desc per
 *      stop. The middle column is highlighted because that's the
 *      mental-model shift the visitor needs to internalise before
 *      the flywheel reads as the answer.
 *   3. CTA — one calm link into the flywheel.
 *
 * The slider is lifted from the Thoughtform Continuum Spectrum
 * (see `01_thoughtform/legacy/landing-v3/cockpit/continuum-spectrum.css`)
 * and adapted to the AI-operator paper palette: amber rail and
 * diamonds on the light card surface.
 *
 * The section sits inside the `.aiop-bridge-and-reality` wrapper so it
 * slides up over the frozen Evans bridge while the bridge's scroll-
 * coupled fade and parenthetical reveal play out. The cross-section
 * flight to the Vision orbit is intentionally dropped — Vision now
 * appears as a calm next chapter after this beat, not as the immediate
 * flight target.
 * ─────────────────────────────────────────────────────────────────── */

export type AiRealityColumn = {
  id: "tool" | "middle" | "collab";
  label: string;
  title: string;
  /* Short fragment that fleshes out the column title. The voice is
     deliberately conversational — short clauses separated by periods
     or commas — so the spectrum reads as three crystallised takes,
     not three bullet-point summaries. */
  sub: string;
  align: "left" | "center" | "right";
  highlight?: boolean;
};

export const aiRealitySection = {
  title: "Why traditional adoption",
  titleEm: "doesn't work with AI.",
  /* `lede` carries the framing; `ledeStrong` is the punchline
     rendered as a `<strong>` so the navigate-it-first thesis lands
     hard and primes the flywheel below. Mirrors the diagnosis lede
     pattern so both interstitial header columns read in the same
     voice. */
  lede:
    "AI gets sold as software. It isn't. It's intelligence. The first technology you can use as a tool and work with as a collaborator, often both at once. ",
  ledeStrong:
    "Before it can understand how your teams work, you have to learn how to navigate it.",
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
        label: "AI lives here",
        title: "Neither pure tool nor true collaborator",
        sub: "A bit of both. Trained on us, but not like us. A new paradigm no LinkedIn bro teaches you how to navigate.",
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
    ] satisfies AiRealityColumn[],
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
  /* Title splits across an italicised pivot. The em wraps the
     verb `is` so the heading lands as "Adoption that works _is_
     automation." — a short declarative whose pivot reads at a
     glance. The bridge from the engine-pattern carousel above is
     carried by a CTA button at the foot of that section ("And
     this is the engine running ↓"), so this title can return to
     its abstract thesis register. Rendering interleaves: title +
     <em>{titleEm}</em> + titleAfter. */
  title: "Adoption that works",
  titleEm: "is",
  titleAfter: "automation.",
  /* Centre of the orbit: the substrate is the deepest position in the
     architecture — the encoded layer everything else sits on. The
     file names below the label are the canonical examples (a brain
     dump of how the team works, a Skill that encodes GTM strategy,
     a meeting transcript that gets ingested next). */
  centerLabel: "Intelligence Layer",
  centerFiles: [
    "how-teams-work.md",
    "loop-creative-strategy.skill",
    "weekly-standup-transcript.txt",
  ],
  /* Each phase sits on its own concentric ring at a different clock
     position so the orbit reads as a nested architecture: Navigate
     on the outer ring, Encode on the middle ring, Build on the
     innermost ring, with the substrate at the centre. Positioning
     is driven entirely by the phase id in CSS — no per-row
     position metadata is needed. */
  orbits: [
    { id: "navigate", label: "Navigate", ring: "outer" },
    { id: "encode", label: "Encode", ring: "middle" },
    { id: "build", label: "Build", ring: "inner" },
  ] as const,
  /* Headless sits outside the sphere — it isn't part of the
     Navigate/Encode/Build flywheel and it isn't the substrate
     either. It's the separate idea that takes the substrate at the
     centre and exposes it to every surface the cohort already uses.
     Renders as a satellite anchored to the orbit's outer edge by a
     short connector line. */
  satellite: { id: "headless", label: "Headless" },
  /* v19 — tightened to the adopt -> encode -> automate beat. The
     orbit visual already names Navigate / Encode / Build / Headless,
     so the caption no longer inventories the motions; it states the
     thesis instead: good adoption IS encoding, and encoding is what
     compounds into headless automation. The third sentence keeps
     the cohort hand-off ("each cycle hands the next team a
     stronger substrate") so the Approach deep dive that follows
     reads as the unpacking of how each cycle gets built. */
  caption:
    "Good adoption is encoding. Encoding compounds into headless automation. Each cycle hands the next team a stronger substrate.",
  /* Continuum strip — folded inline below the orbit caption. Absorbs
     the old `<AiIsNotSoftware />` Reality-check beat as a calm 3-up
     mini grid: Tool / AI lives here (highlighted) / Collaborator. No
     rail, no diamonds, no parallax — just three cards naming why
     navigation has to come before encoding can land. The middle
     column is the mental-model shift the visitor needs to internalise
     before the orbit reads as the answer. */
  continuum: {
    eyebrow: "Why navigation comes first",
    intro:
      "AI gets sold as software. It isn't. It's intelligence — the first technology you can use as a tool and work with as a collaborator, often both at once.",
    columns: [
      {
        id: "tool",
        label: "Tool",
        title: "Executes commands",
        sub: "Predictable software that does what we ask, or gives clear errors when it fails.",
      },
      {
        id: "middle",
        label: "AI lives here",
        title: "Neither pure tool nor true collaborator",
        sub: "A bit of both. Trained on us, but not like us. A new paradigm no LinkedIn bro teaches you how to navigate.",
        highlight: true,
      },
      {
        id: "collab",
        label: "Collaborator",
        title: "Interprets intent",
        sub: "Opinionated. Brainstorms with you, challenges your ideas, just listens when you vent.",
      },
    ],
    foot:
      "Before AI can understand how your teams work, you have to learn how to navigate it.",
  },
} as const;

/** Subset of `visionSection` consumed by `<FlywheelOrbit />` (route overrides). */
export type FlywheelOrbitSection = {
  centerLabel: string;
  centerFiles: readonly string[];
  orbits: readonly {
    id: "navigate" | "encode" | "build";
    label: string;
    ring: "outer" | "middle" | "inner";
  }[];
  satellite?: { id: string; label: string };
};

/* ─────────────────────────────────────────────────────────────────────
 * Spectrum — own dedicated section (NEW)
 *
 * Pulls the Tool / AI lives here / Collaborator continuum out of the
 * Vision section's nested strip and gives it its own beat between
 * Diagnosis and Vision. TwelveLabs / Stripe Link grammar: one
 * mono-caps label, one bicolour h2, one 1-line sub, one 3-up
 * functional visual, one closing foot line.
 *
 * Lives on a `.aiop-section--white` background so it lands as a
 * deliberate editorial break between the paper-canvas Diagnosis and
 * the paper-canvas Vision orbit.
 *
 * Same column data as the legacy `visionSection.continuum` (kept on
 * disk for type stability); same `highlight` flag on the middle
 * column so the visual register is preserved.
 * ─────────────────────────────────────────────────────────────────── */

export type SpectrumColumn = {
  id: "tool" | "middle" | "collab";
  label: string;
  title: string;
  sub: string;
  highlight?: boolean;
};

export const spectrumSection: {
  id: string;
  label: string;
  title: string;
  titleEm: string;
  titleAfter: string;
  sub: string;
  columns: SpectrumColumn[];
  foot: string;
} = {
  id: "spectrum",
  label: "Why navigation comes first",
  title: "AI lives between",
  titleEm: "tool and collaborator.",
  titleAfter: "",
  sub: "It is the first technology you can use as a tool and work with as a collaborator \u2014 often both at once. No LinkedIn bro teaches you how to navigate it.",
  columns: [
    {
      id: "tool",
      label: "Tool",
      title: "Executes commands",
      sub: "Predictable software that does what we ask, or gives clear errors when it fails.",
    },
    {
      id: "middle",
      label: "AI lives here",
      title: "Neither pure tool nor true collaborator",
      sub: "A bit of both. Trained on us, but not like us. A new paradigm no playbook teaches you how to navigate.",
      highlight: true,
    },
    {
      id: "collab",
      label: "Collaborator",
      title: "Interprets intent",
      sub: "Opinionated. Brainstorms with you, challenges your ideas, just listens when you vent.",
    },
  ],
  foot:
    "Before AI can understand how your teams work, you have to learn how to navigate it.",
};

/* ─────────────────────────────────────────────────────────────────────
 * Vision news ticker — external validation strip
 *
 * Sits at the bottom of the Vision section as a continuously scrolling
 * marquee of recent press + role postings. Names the through-line
 * across every major lab and consultancy: the model alone isn't
 * enough — they're all spinning up forward-deployed engineering
 * teams and PE-backed deployment ventures to put AI into the work.
 * The flywheel above is the thesis; this strip is the social proof.
 *
 * Each item is a SOURCE + concise headline pair, kept under ~14 words
 * so it reads cleanly as a single ticker line. Headlines stay close
 * to the actual article copy — no embellishment beyond what's
 * verifiable from the linked source.
 * ─────────────────────────────────────────────────────────────────── */

/* Single editorial bridge line that sits above the marquee. Does
   double duty: frames the wire items below as external validation
   (`ledeStart` — "which is what everyone is betting on") and sets
   up the Loop case studies that follow (`ledeAccent` — "and what I
   started 18 months ago").
   The accent half is rendered bold + violet so the personal
   throughline reads as a callback to the new flywheel-bridge quote
   directly below the ticker. Rendered as an italic display-font
   lede; the accent inherits the italic but breaks weight + colour
   to land the second clause as the load-bearing one. */

/* ─────────────────────────────────────────────────────────────────────
 * The Signal — social-proof beat between Diagnosis and Quote Bridge
 *
 * Direct lift of slide 05 (`f-signal`) from
 * `exports/claude-rollout.html` onto the Aether route. Renders as a
 * dedicated section in dark register so the proof beat lands as a
 * deliberate visual break between the paper-mode Diagnosis above and
 * the paper-mode Quote bridge below.
 *
 * Composition:
 *   - Eyebrow + display title + sub.
 *   - Mock newspaper masthead strip ("The Deployment Beat").
 *   - 2x2 grid of 4 WSJ-style news cards (Stripe FDA, Palantir FDE
 *     origin, OpenAI Deployment Company, Anthropic $1.5B venture).
 *     Each card carries a CSS-only thumb (kicker, mark, tag,
 *     corner stamp), kicker, headline, dek, source/date byline.
 *   - Closing line that pivots back to Loop.
 *
 * Replaces the previous `visionMarketSignals` marquee that lived
 * inside the Vision section. The same four sources are represented;
 * the `href` on each card preserves the click-through to the
 * underlying article.
 * ─────────────────────────────────────────────────────────────────── */

export type SignalCardTone =
  | "stripe"
  | "palantir"
  | "openai"
  | "anthropic"
  | "google-workspace"
  | "vertex-ai"
  | "mars";

export type SignalCard = {
  id: SignalCardTone;
  thumb: {
    /* Mock identity mark stamped into the thumb panel — reads as
       the "publication" or company glyph at scale. */
    mark: string;
    tag: string;
    /* Top-right corner stamp (year, dollar amount, etc.). */
    corner: string;
  };
  kicker: string;
  headline: string;
  /* `dek` accepts an array so individual sentences can be wrapped
     in `<strong>` via the `strong` flag below. Renderer joins them
     with a space. */
  dek: { text: string; strong?: boolean }[];
  byline: { source: string; date: string };
  href: string;
};

export const signalSection: {
  id: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  titleAfter: string;
  sub: string;
  masthead: {
    name: string;
    issue: string;
    track: string;
    date: string;
  };
  cards: SignalCard[];
  /* Optional closing line. Retired in this version of the page —
     the pivot beat ("we already have it running") now lives in
     `alreadyRunningSection` as its own minimalist editorial chapter
     directly below Signal. The field stays optional on the type so
     a future iteration can re-enable a Signal-internal closing
     without a type change. */
  closing?: { lead: string; accent: string };
} = {
  id: "signal",
  eyebrow: "The signal",
  title: "The labs just bet",
  titleEm: "billions",
  titleAfter: "on the same layer.",
  sub: "Not a model problem. A deployment problem. Both labs just said so out loud.",
  masthead: {
    name: "The Deployment Beat",
    issue: "VOL. I \u00b7 NO. 1",
    track: "FRONTIER AI \u00b7 ENTERPRISE",
    date: "MAY 2026",
  },
  /* Card order reads as the FDE argument: invented (Palantir) ->
     adopted (Stripe) -> capitalised (OpenAI + Anthropic). Every dek
     is capped at ~25 words so the 4-card grid stays scannable. */
  cards: [
    {
      id: "palantir",
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
        { text: ": embed inside customer ops, encode the workflow, leave behind a running system. The shape that defined enterprise software." },
      ],
      byline: { source: "Palantir", date: "FDE program" },
      href: "https://www.palantir.com/careers/forward-deployed-engineer/",
    },
    {
      id: "stripe",
      thumb: {
        mark: "/stripe",
        tag: "Job listing \u00b7 Marketing",
        corner: "2026",
      },
      kicker: "Hiring \u00b7 Forward Deployed",
      headline: "Stripe creates a role that did not exist a year ago.",
      dek: [
        { text: "Multiple six figures to embed AI-natives inside marketing. Each assigned to" },
        { text: "20 marketers", strong: true },
        { text: "until self-sufficient. AI as default, not occasional tool." },
      ],
      byline: { source: "@andruyeung", date: "via X" },
      href: "https://www.wsj.com/articles/ai-startups-have-a-new-old-secret-weapon-forward-deployed-engineers-d18ee609",
    },
    {
      id: "openai",
      thumb: {
        mark: "OpenAI",
        tag: "Joint Venture \u00b7 DeployCo",
        corner: "$10B",
      },
      kicker: "Press release \u00b7 May 2026",
      headline: "OpenAI launches the Deployment Company.",
      dek: [
        { text: "$10B JV", strong: true },
        { text: ", 19 partners. Acquired Tomoro for ~150 Forward Deployed Engineers on day one. Deployment is the new distribution." },
      ],
      byline: { source: "openai.com", date: "May 2026" },
      href: "https://openai.com/index/openai-launches-the-deployment-company/",
    },
    {
      id: "anthropic",
      thumb: {
        mark: "Anthropic",
        tag: "Joint Venture \u00b7 Claude Services",
        corner: "$1.5B",
      },
      kicker: "Bloomberg \u00b7 enterprise",
      headline: "Anthropic's $1.5B answer.",
      dek: [
        { text: "Blackstone, Hellman & Friedman, Goldman Sachs. Applied AI engineers deployed into PE portfolios to build custom Claude." },
        { text: "Zero consulting firms in the cap table.", strong: true },
      ],
      byline: { source: "Bloomberg", date: "enterprise track" },
      href: "https://www.wsj.com/business/deals/anthropic-nears-1-5-billion-joint-venture-with-wall-street-firms-8f5448ee",
    },
  ],
  /* Closing pivots into the "Already Running" 3-wave section.
     Wedges the labs validation directly into Loop's own receipts:
     the labs are spending billions on this; we already have it
     turning inside Loop. */
};

/* ─────────────────────────────────────────────────────────────────────
 * Flywheel bridge — full-viewport interstitial between Vision and Approach
 *
 * Single personal quote rendered as flat italic prose. An earlier
 * cut wrapped three verbs in lane-coloured Navigate / Encode / Build
 * pills inline, but the pills made the framework feel like a brand
 * stamp on the candidate's own voice — and they pre-empt Collison's
 * "moved into marketing, changing the funnel" cadence the closer
 * picks up later. Dropping them lets the line read as honest
 * autobiography instead of internal vocabulary, and the resonance
 * with the closer becomes audible without either side pointing at
 * it.
 *
 * Pure quote, no eyebrow, no attribution. The page is already in
 * first person; an outside-voice attribution would feel wrong here.
 * ─────────────────────────────────────────────────────────────────── */

/* Quote split into deliberate paragraphs. Each paragraph renders as
   its own <p> inside the blockquote. Internal Loop voice — no
   attribution, no autobiography. Names the shift the flywheel
   produces inside the company: the team that received the tool
   becomes the team that ships the next one. Renderer in
   `flywheel-bridge.tsx` maps the array. */
export const flywheelBridgeSection = {
  /* Italic display question above the quote — explicitly poses the
     scale proposition so the rest of the page (Approach + Cases +
     Headless tail) reads as the answer rather than a continuation. */
  lead: "OK. So how do we scale this?",
  quote: [
    "Same way it has scaled for 18 months. When the Hub turns, the team that received the tool ships the next one.",
    "Studio designs its own AI canvas. Performance writes its own Skills. Localization extends the dubbing pipeline. The Hub does not accumulate work. It multiplies who can do it.",
  ],
  /* Quiet mono-caps line below the quote — names what the rest of
     the page covers so the bridge lands as a deliberate handoff
     into the operating-model deep dive. */
  handoff:
    "What follows is the operating model, the programs already in production, and the substrate that lets the next team start further along than the last.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Approach — Navigate, Encode, Build (the flywheel, explained)
 *
 * Three self-contained sections. Each one pairs a copy column with an
 * executive-level visual, plus a Heimdall-style pop-out card that goes
 * one level deeper. All three visual cards share the `ApproachCardShell`
 * grammar (header / INPUTS / dark core / OUTPUTS) so the flywheel
 * reads as one artifact at three stages — Navigate's outputs are
 * Encode's inputs, Encode's outputs are Build's inputs. The three
 * cores are: Navigate = workshop stage rail, Encode = 4-row Skill
 * table, Build = engine widget. See `approach.tsx` for the shell
 * implementation.
 * ─────────────────────────────────────────────────────────────────── */

export const approachSection = {
  title: "The AI flywheel",
  titleEm: "running inside Loop",
  caption:
    "Creative Technology has run this loop since 2024 \u2014 starting on the AI team, embedding into marketing to find a scalable shape, and now expanding it across the business as teams turn the way they actually work into reusable Skills they can build their own automations on. Navigate, Encode, Build. Three motions, one team at a time, compounding into a single substrate every Loop surface inherits.",
} as const;

export type ApproachTone = "violet" | "gold" | "sage";

/* Which phase the last output chip hands off to. Renders an arrow
 * marker on the last chip (e.g., "→ Encode") so the flywheel cards
 * read as one sequenced story — Navigate's outputs are Encode's
 * inputs, Encode's outputs are Build's inputs. Build is terminal
 * and leaves this unset. */
export type ApproachHandoff = "Encode" | "Build";

/* Shared shape across all three flywheel cards:
 *   - sub      = right-side descriptor eyebrow at the top of the card
 *   - inputs   = top-of-card chip row, the handoff arriving from the
 *                previous phase (for Navigate, the team's starting
 *                materials)
 *   - outputs  = bottom-of-card chip row, the handoff to the next
 *                phase
 *   - handoffTo= phase name appended to the last output chip; lets
 *                the cards literally name the flywheel turn
 *
 * The phase pill (NAVIGATE / ENCODE / BUILD) at the top-left of each
 * card derives from `ApproachStep.label`, not from the visual data.
 * Each variant then adds its own dark-core content (stages /
 * substrate table / engine widget). */
type ApproachVisualBase = {
  sub: string;
  inputs: string[];
  outputs: string[];
  handoffTo?: ApproachHandoff;
};

export type RolloutVisual = ApproachVisualBase & {
  kind: "rollout";
  stages: { tag: string; label: string }[];
};

export type SubstrateVisual = ApproachVisualBase & {
  kind: "substrate";
  layers: { tag: string; name: string; meta: string }[];
  /* Compressed Three Degrees of Freedom strip sitting between the
     dark substrate core and the OUTPUTS row. Three short tag pills
     (Locked / Guided / Open) with a single shared intro sentence —
     the canonical Skill anatomy from Anthropic's Skill best
     practices guide, surfaced as a quiet tag strip so it lands the
     concept without becoming a second visual centerpiece on the
     card. The same trio appears on harvestfields slide 5 and rhymes
     with the LOCK / GUIDE / EXPLORE bands `thoughtform-strategy`
     documents. */
  freedomStrip?: {
    intro: string;
    bands: {
      id: "locked" | "guided" | "open";
      tag: string;
      example: string;
    }[];
  };
};

export type EngineVisual = ApproachVisualBase & {
  kind: "engine";
  surfaces: { icon: string; name: string; verb: string }[];
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
      "AI sits between a tool and a collaborator. Deterministic enough to automate, interpretive enough to think with. Trained on us, but not like us. Before a team can encode their work into it or build on top, they have to learn how it actually behaves.",
    signal: { k: "Outcome", v: "AI intuition and a workflow brief per team." },
    visual: {
      kind: "rollout",
      sub: "Inside the workflow",
      inputs: ["The team's actual work", "How they evaluate it"],
      stages: [
        { tag: "01", label: "Baseline" },
        { tag: "02", label: "Question" },
        { tag: "03", label: "Workshop" },
        { tag: "04", label: "Hand off" },
      ],
      outputs: ["AI intuition", "Workflow brief"],
      handoffTo: "Encode",
    },
    modal: {
      eyebrow: "01 · Navigate",
      title: "What navigation looks like",
      titleEm: "across an actual cohort.",
      lede:
        "Navigation teaches teams how to work and think with AI inside their real work. One 45-minute session per team is the ignition: people leave briefing AI like a colleague who is smart but missing context, and start using it inside the workflow the same week. AI Stewards inside the team carry the practice forward, and the first candidate Skill from each session becomes the seed Encode turns into substrate.",
      meta: [
        { k: "DURATION", v: "Continuous \u00b7 1\u20132 weeks per team" },
        { k: "ARTIFACT", v: "Workflow brief \u00b7 maturity model" },
        { k: "OWNER", v: "Creative Technology + team lead" },
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
            "Claude Enterprise rolled out across the company, with adoption, legal, IT, and founder alignment running as a single program.",
            "Scalable plan across 15+ teams, built to make every Looper self-sufficient.",
            "Claude Skills + Monday automation surfacing weekly progress and wins.",
          ],
          note: "None of this is Claude-specific \u2014 the fluency transfers to any generative AI tool.",
        },
      ],
      signal: "Adoption runs as a cohort with shared infrastructure under every step.",
    },
  },
  {
    id: "encode",
    label: "Encode",
    tone: "gold",
    headline: "Turn how the team works into a portable layer any agent can use.",
    /* Body shape: handoff from Navigate → definition → Loop proof →
       implication. Opens by picking up the previous phase's output
       ("Once a team knows what they want AI to take on") so the
       flywheel reads as one sequenced story rather than three
       parallel statements. The temp-agency analogy from the Anthropic
       podcast is intentionally NOT in the body — the lead sentence
       covers the same idea more efficiently. */
    body:
      "Once a team knows what they want AI to take on, you encode how they actually do it: brand nuances, standards, review process — written down so any agent can inherit them. At Loop, dozens of workflows now live as substrate: brand voice, claim gates, marketplace copy. A teammate can read it. An agent can run on it. Models change. The encoded layer carries forward.",
    signal: { k: "Outcome", v: "A Skill the team owns. Versioned. Headless." },
    visual: {
      kind: "substrate",
      sub: "Encoded substrate · headless",
      /* Top-of-card inputs are Navigate's outputs verbatim, so the
         handoff reads as one continuous flywheel turn. The old
         5-pill "What gets encoded" row (Brand book / Lead's
         judgment / Past work / Regs & policy / Review feedback)
         was doing double duty with the substrate table below it —
         the table's `Rules / Examples / Sources / Loops` already
         names what gets encoded at the right abstraction level. */
      inputs: ["AI intuition", "Workflow brief"],
      layers: [
        { tag: "Rules", name: "How the team decides", meta: "12 entries" },
        { tag: "Examples", name: "What good looks like", meta: "38 artifacts" },
        { tag: "Sources", name: "Data it can read", meta: "3 connectors" },
        { tag: "Loops", name: "Who confirms it", meta: "2 gates" },
      ],
      /* Compressed Three Degrees of Freedom strip — three tag pills
         with one shared intro sentence. Same canonical Skill
         anatomy Anthropic documents in their Skill best-practices
         guide and that runs harvestfields slide 5; the chip strip
         keeps the concept readable without becoming a second
         centerpiece on the card. */
      freedomStrip: {
        intro: "Three degrees of freedom in every Skill.",
        bands: [
          { id: "locked", tag: "Locked", example: "banned terms" },
          { id: "guided", tag: "Guided", example: "market norms" },
          { id: "open", tag: "Open", example: "campaign framing" },
        ],
      },
      outputs: ["A Skill the team owns", "Versioned", "Headless"],
      handoffTo: "Build",
    },
    modal: {
      eyebrow: "02 · Encode",
      title: "What encoding looks like",
      titleEm: "as substrate the team owns.",
      lede:
        "The same pattern showing up everywhere: structured knowledge the model can stand on. At the team level, that means capturing how decisions get made, what good output looks like, and where the authoritative data lives. Creative Technology drafts. The team ratifies. Git versions. Portable across models from day one.",
      meta: [
        { k: "CADENCE", v: "Drafted weekly \u00b7 ratified by review" },
        { k: "ARTIFACT", v: "Skill bundle (Markdown + examples)" },
        { k: "OWNER", v: "Team + Creative Technology" },
      ],
      sections: [
        {
          heading: "Anatomy of a Skill",
          bullets: [
            "How the team decides — brand rules, claim gates, locked policies.",
            "What good looks like — approved work, rejected drafts, the difference between them.",
            "Where the data lives — briefs, boards, registries, linked not copied.",
            "Who confirms — review gates, escalation paths, what gets logged.",
            "Three degrees of freedom — what to lock, what to guide, what to leave open. Anthropic's own best practice for Skill design.",
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
    /* Body shape: thesis → why → method → handoff. The autobiographical
       "I came into Loop" arc has moved up to the FlywheelBridge above,
       so this body can stay tight and method-focused. Opens with the
       collapsed-distance thesis, names why the person closest to the
       work can finally build, walks the actual capture-to-ship
       sequence, lands on the same self-sufficiency punchline that the
       Outcome card below proves out concretely. */
    body:
      "With substrate in place, AI collapses the distance between knowing the problem and shipping the tool. The work starts in a Teams call where Creative Technology listens for the frustration, turns the transcript into a user story in Cursor, then either builds the interface around it or exposes the logic headlessly through MCP. The finished tool lands with the person closest to the work. Nobody understands their domain better than they do.",
    signal: { k: "Outcome", v: "A thin running surface the team uses daily." },
    visual: {
      kind: "engine",
      sub: "Headless first · every surface inherits",
      /* Build's inputs are Encode's outputs — the versioned Skill is
         what the engine runs on. Naming the handoff makes the
         flywheel literal: Encode hands Build a Skill, Build hands
         the team a running surface. */
      inputs: ["A versioned Skill"],
      surfaces: [
        { icon: "⌘", name: "Chat", verb: "Claude · Cursor" },
        { icon: "{ }", name: "API", verb: "MCP · REST" },
        { icon: "◐", name: "Agent", verb: "Scheduled · autonomous" },
        { icon: "⤴", name: "In-tool", verb: "Slack · Figma · Monday" },
      ],
      outputs: ["A running surface the team uses daily"],
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
            "Creative Technology vibe-codes and hardens in the same loop. No handoff between prototype and production.",
            "Headless API + MCP server from day one so the engine isn't tied to one UI.",
            "Token allowlists, scopes, audit log, durable rate buckets — policy lives in one verifier.",
          ],
        },
        {
          heading: "What it produced at Loop",
          bullets: [
            "AI Image & Video Suite (Vesper) replaced Krea outright. Studio now runs every campaign through it.",
            "Studio PM Orchestrator (Heimdall) moves briefings from Monday into Figma every week.",
            "Briefing Agent (Mímir) is reshaping how Creative Strategy plans every campaign cycle.",
            "UGC Dubber (Babylon) is in pilot for the Japanese market and expanding into ATL content dubbing.",
          ],
        },
      ],
      signal: "Building is the unlock. The flywheel that follows is what keeps each team running on its own.",
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Approach outcome — the flywheel turns, here's what it produced
 *
 * Sits between the three-phase list and the existing approach close
 * line. Names self-sufficiency as the visible result of Navigate +
 * Encode + Build running together — but lands it as four concrete
 * achievements across teams instead of a generic maturity ladder.
 * Each card seeds a section that follows on the page so the Outcome
 * reads forward as well as backward:
 *
 *   01 Paid social   → autonomy story the close line lands.
 *   02 Production    → primes the Why-build-custom-tools slide.
 *   03 Localization  → primes the Cases grid (UGC Dubber).
 *   04 Performance   → primes the Headless / Substrate-map sections.
 *
 * Visual posture: same outer card chrome as before (centered,
 * diamond markers, sage accent rhyming with the Build lane); the
 * inner content swaps from a 5-stage ladder to a 4-across achievement
 * grid (collapses to 2x2 then 1-up at narrow widths).
 * ─────────────────────────────────────────────────────────────────── */

export type ApproachOutcomeAchievement = {
  n: string;
  /* Two-word noun phrase naming the operator's contribution at that
     team — not the team domain (which is implicit in the body). The
     label is what scans at a glance; the body fills in the team
     context and the proof. Keeps the card from reading like a four-
     team org chart and turns it into four crystallised outcomes. */
  label: string;
  body: string;
};

export const approachOutcome: {
  eyebrow: string;
  headline: string;
  body: string;
  achievements: ApproachOutcomeAchievement[];
} = {
  eyebrow: "Outcome",
  /* Headline scope: broader than the Studio team alone (other
     embedded teams run their work autonomously too), narrower than
     "all of marketing" (which would overclaim). Voice stays
     team-first — the page is the function's record, not a personal
     CV — so the headline names what the teams now do without
     naming who left the practice with them. */
  headline: "Embedded teams run the program on their own.",
  /* Body shape: escalating triplet (Navigate / Encode / Build, same
     three pills the bridge above seeds) → the new cross-team
     insight (pattern recognition across teams becomes the next
     Skill the next team inherits). Kept in third-person / team
     voice so the section reads as the function's record rather
     than an individual achievement claim. */
  body:
    "Navigate gives them the mental model. Encode gives them the substrate. Build gives them the tools. Moving between teams is the unlock \u2014 the patterns that scale get spotted, encoded, and the next team starts further along than the last.",
  achievements: [
    {
      n: "01",
      label: "AI default",
      body: "90% of Studio briefings now ship with AI \u2014 the team runs the practice on its own.",
    },
    {
      n: "02",
      label: "Custom engine",
      body: "A custom image and video generation engine, built to remove friction so Studio keeps producing high-performing assets at scale.",
    },
    {
      n: "03",
      label: "Team handoff",
      body: "Localization managers now product-manage and shape the UGC dubbing tool the team owns end-to-end.",
    },
    {
      n: "04",
      label: "Headless layer",
      body: "Creative strategy methodology exposed headlessly, so Performance can build their own dashboards on top.",
    },
  ],
};

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
  title: "Removing workflow bottlenecks,",
  titleEm: "one tool at a time.",
  /* Lede stays third-person / team-voice (no first-person) — the
   * page is presented as the function's record, not a personal
   * portfolio. Creative Technology is the internal team name; the
   * page avoids "operator" so it doesn't read as a Forward Deployed
   * AI Accelerator pitch. */
  lede:
    "At Loop, software for few became practical. Creative Technology works alongside each team \u2014 compressing existing workflows, repairing broken handoffs, inventing new ones from scratch with AI.",
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
  /* Bridge callout — sits as the very last child of `.aiop-cases__list`
     after the StripeTeaserCard. While the headless-shift section
     slides up over the frozen Cases (parallax-pair behaviour), this
     callout is the last thing the visitor reads on the Cases side
     before the headless thesis takes over. The italic em rhymes with
     the headless-shift body strong line ("...decoupling the rest is
     the work I'm doing now.") so the callout reads as setup → the
     headless-shift body reads as elaboration. The card is intentionally
     unlabelled (no mono-caps eyebrow) so the two-line display body
     lands as the only beat — quieter and more editorial. */
  bridgeCallout: {
    lead: "The easier it becomes to build interfaces,",
    em: "the more important the underlying layer becomes.",
  },
} as const;

export type CaseTone = "gold" | "sage" | "slate" | "violet";
export type WorkflowMode = "Repair" | "Compress" | "Invent";

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption?: string;
};

/* Optional walkthrough video — short narrated screen recording of
   the production system. When present, the case-row meta strip
   surfaces a "Walkthrough" button that opens a modal video player
   left of the existing "View case detail" CTA. Path resolves under
   `/public`; videos are H.264 MP4 with `faststart` so they begin
   streaming before the file finishes downloading. */
export type CaseWalkthrough = {
  src: string;
  poster?: string;
};

/* Per-capability status — the project-level `status` field above
   covers the system as a whole, but individual capabilities can be
   at a different maturity (e.g. a system shipped to production with
   one capability still on the way). When set, the case row + modal
   render a small amber pill next to the capability title. */
export type CaseCapabilityStatus = "WIP" | "Production";

export type CaseCapability = {
  k: string;
  v: string;
  status?: CaseCapabilityStatus;
};

export type CaseProject = {
  id: string;
  num: string;
  /* Primary descriptive name shown as the rail h3 and the modal
     title. Multi-word names live in `name` with a trailing space so
     the italic emphasis sits on the trailing noun (e.g. `name:
     "Briefing "`, `nameEm: "Agent"` → "Briefing Agent" with "Agent"
     italic in the case accent). */
  name: string;
  nameEm?: string;
  /* Optional internal codename (e.g. Mímir, Vesper). When present,
     a smaller second line renders directly under the descriptive
     name in the same display font + italic-accent treatment, so the
     team's named identity stays visible without competing with the
     descriptive label that scans for outside readers. Single-word
     codenames split mid-word for the italic accent (`codename: "Mí",
     codenameEm: "mir"`); they don't need a trailing space. */
  codename?: string;
  codenameEm?: string;
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
  capabilities: CaseCapability[];
  surfaces: string[];
  stack: string[];
  companyLeverage: string;
  image: string;
  screenshots: ProjectScreenshot[];
  walkthrough?: CaseWalkthrough;
};

export const cases: CaseProject[] = [
  {
    id: "mimir",
    num: "01",
    name: "Briefing ",
    nameEm: "Agent",
    codename: "Mí",
    codenameEm: "mir",
    tagline: "Brand Intelligence",
    subline: "Loop's own knowledge, structured.",
    team: "Performance · Creative Strategy",
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
      "Started with Creative Strategy, now expanding to Insights and Product Marketing. The aim is one source of truth on customer voice, business priorities, and channel performance — open to anyone in the company, from whatever surface they already work in.",
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
    walkthrough: {
      src: "/cases/videos/mimir.mp4",
    },
  },
  {
    id: "vesper",
    num: "02",
    name: "AI Image & Video ",
    nameEm: "Suite",
    codename: "Ves",
    codenameEm: "per",
    tagline: "AI Image & Video Generation",
    subline: "Replaced Krea. Built in-house.",
    team: "Studio · Design | Product Design",
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
      {
        k: "Headless REST + MCP",
        v: "Same Skill behind Claude.ai and the in-product enhance button.",
        status: "WIP",
      },
    ],
    surfaces: ["Web app", "MCP server", "REST", "Claude / Cursor"],
    stack: ["Next.js", "TanStack Query", "Supabase", "Prisma", "Anthropic", "Gemini", "Replicate", "Kling"],
    companyLeverage:
      "Vesper is expanding into Product Design next. CMF Studio is the first new pipeline: a workbook of colorways resolves through reference renders into a packet PDF, so industrial designers spec materials and finishes without booking Studio time for every revision.",
    image: "/cases/assets/vesper.png",
    screenshots: [
      { src: "/cases/screenshots/vesper/Vesper-Home.png", alt: "Vesper: home dashboard" },
      { src: "/cases/screenshots/vesper/Vesper-Prompt.png", alt: "Vesper: prompt enhancement" },
      { src: "/cases/screenshots/vesper/Vesper-Brainstorm.png", alt: "Vesper: brainstorm mode" },
      { src: "/cases/screenshots/vesper/Vesper-Video.png", alt: "Vesper: video generation" },
      { src: "/cases/screenshots/vesper/Vesper-Img-2-Video.png", alt: "Vesper: image-to-video" },
    ],
    walkthrough: {
      src: "/cases/videos/vesper.mp4",
    },
  },
  {
    id: "babylon",
    num: "03",
    name: "UGC ",
    nameEm: "Dubber",
    codename: "Baby",
    codenameEm: "lon",
    tagline: "UGC Localization",
    subline: "Top-performing UGC, dubbed at scale.",
    team: "Performance · Localization & Expansion",
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
      { k: "Proofreader integration", v: "Integrates proofreading in the loop without giving access to the full system." },
      { k: "Broader localization roadmap", v: "Expanding to other use-cases such as exporting PDP copy from Figma in bulk." },
      { k: "Custom review module", v: "Cultural judgment surfaced where it actually matters." },
      { k: "Single proofread surface", v: "Share-link review, no Figma seat needed." },
      { k: "30+ markets", v: "Linear scale-out across languages, not reviewers." },
      { k: "Auto-verification", v: "Gemini cross-check against on-screen captions." },
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
    walkthrough: {
      src: "/cases/videos/babylon.mp4",
    },
  },
  {
    id: "heimdall",
    num: "04",
    name: "Studio PM ",
    nameEm: "Orchestrator",
    codename: "Heim",
    codenameEm: "dall",
    tagline: "Workflow Orchestration",
    subline: "Everything around the creative work, in one tool.",
    team: "Studio · Project Management",
    status: "Production",
    year: "2025",
    challenge:
      "Built for the project managers around the creative team, collapsing the manual workflow that lives around the design work itself: briefings flow from Monday into Figma, copy gets extracted for proofreaders, and assets sync back through Frontify.",
    tone: "sage",
    workflowMode: "Repair",
    workflowBefore:
      "Briefings lived in Monday. Designers worked in Figma. Assets shipped through Frontify. Each handoff was manual copy-paste, and the proofreaders waited on whoever could pull the latest copy out by hand.",
    workflowAfter:
      "One webhook chain moves briefings from Monday into Figma, pulls copy out for proofreading, and routes the finished assets back through Frontify, without a single manual copy-paste.",
    capabilities: [
      { k: "Monday → Figma sync", v: "Structured briefings, GraphQL pipeline, instant Figma plugin update." },
      { k: "Frontify integration", v: "Asset intake, naming conventions, brand surface alignment." },
      { k: "Iterator plugin", v: "A prototype that quickly spins up variants from the best-performing ads." },
      { k: "Briefing split orchestrator", v: "Turns the revenue projections and use-case splits behind every cycle into clear briefing assignments for the creative team." },
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
    walkthrough: {
      src: "/cases/videos/heimdall.mp4",
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Stripe teaser — post-Heimdall card · the next move
 *
 * Sits inside the cases section after the four production rows and
 * before the closing callout. Intentionally NOT a fifth `CaseProject`
 * — the four-case "in production" count stays clean. This is a
 * separate content object the cases renderer reaches for explicitly.
 *
 * Carries the pattern from HarvestFields (encode brand judgment once,
 * inherit it across two workflows) into the Stripe Forward Deployed
 * AI Accelerator (Marketing) shape: encode the GTM substrate once,
 * let every cohort marketer's work inherit it.
 *
 * The CTA does not open a modal. It points at a placeholder booking
 * href — the meeting itself is the unlock. Replace `ctaHref` with a
 * real calendar link when one exists.
 *
 * Visuals: the schematic block fills the same `aiop-shot-frame` slot
 * a real screenshot would. If actual prototype snapshots get added
 * later under `/public/cases/screenshots/stripe-teaser/`, extend the
 * teaser data with a `screenshots` array and update the renderer to
 * swap in `ScreenshotGallery` ahead of the schematic.
 * ─────────────────────────────────────────────────────────────────── */

export type StripeTeaserCapability = { k: string; v: string };
export type StripeTeaserSubstrateLayer = { tag: string; name: string };
export type StripeTeaserSurface = { icon: string; name: string };

export const stripeTeaser: {
  metaLabel: string;
  metaTag: string;
  team: string;
  ctaLabel: string;
  ctaHref: string;
  railEyebrow: string;
  name: string;
  tagline: string;
  subline: string;
  challenge: string;
  workflowMode: WorkflowMode;
  workflowAfter: string;
  capabilities: StripeTeaserCapability[];
  stack: string[];
  /* Captured snapshots from the HarvestFields prototype at
     `/ai-operator/harvestfields`. Render through `ScreenshotGallery`
     in the same `aiop-shot-frame` slot the production case rows use,
     so the teaser shows the actual tool I want to walk Stripe
     through. Empty array falls back to the inline `schematic`. */
  screenshots: ProjectScreenshot[];
  schematic: {
    eyebrow: string;
    sourcesLabel: string;
    sources: string[];
    substrateLabel: string;
    substrateLayers: StripeTeaserSubstrateLayer[];
    surfacesLabel: string;
    surfaces: StripeTeaserSurface[];
  };
} = {
  /* Meta strip — TAG instead of NUM / TOTAL so the card never reads
     as a fifth production system. */
  metaLabel: "Teaser",
  metaTag: "Next move",
  team: "Stripe · Marketing FDA cohort",
  ctaLabel: "Book a meeting to unlock",
  ctaHref: "https://calendar.app.google/d1Zv2U6Ex1mGVYJR8",

  /* Card head — same display chrome as the case rows. The italic em
     treatment is dropped on this card so the teaser doesn't try to
     fake a product name; the name is the company. */
  railEyebrow: "For Stripe",
  name: "Stripe",
  tagline: "Encoded GTM Substrate",
  subline:
    "Brand truth and policy as the foundation under every marketer's tools.",

  /* Honest framing the visitor reads in the rail. Mirrors the
     `CaseProject.challenge` slot. Stays Stripe-shaped without naming
     the synthetic-brand prototype the snapshots come from — Stripe
     readers don't need to learn that vocabulary to land the offer. */
  challenge:
    "A working pattern I want to walk you through. A template for how navigation, encoding, and building come together in one scalable program.",

  /* Workflow shift — uses the existing legend vocabulary so the
     teaser reads inside the same Compress / Repair / Invent grammar
     without changing the four-case count. */
  workflowMode: "Invent" as const,
  workflowAfter:
    "Embed with ~20 marketers, encode each one's tacit GTM judgment into Skills and tools, and coach the cohort until starting work with AI is the default.",

  /* What I'd build, mirroring the case-row capability tile grid. Four
     entries so the 2x2 layout stays balanced. */
  capabilities: [
    {
      k: "GTM substrate Skill",
      v: "Voice, claim registry, policy boundaries, and audience register, encoded as one governed contract.",
    },
    {
      k: "Marketer-owned tools",
      v: "One agent or tool built inside each marketer's actual workflow until it sticks.",
    },
    {
      k: "Cohort playbooks",
      v: "Workflow transformations templated so a win for one marketer becomes a pattern for twenty.",
    },
    {
      k: "Self-sufficiency loop",
      v: "Awareness, first win, AI as default, building their own tools — coached through the maturity model.",
    },
  ] satisfies StripeTeaserCapability[],

  /* Stack hints — kept tight. Mirrors the chip strip on case rows so
     the teaser reads as buildable, not abstract. */
  stack: [
    "Claude Skills",
    "MCP",
    "Custom agents",
    "Workflow automation",
    "Eval rail",
  ],

  /* Snapshots from the HarvestFields prototype at
     `/ai-operator/harvestfields`. Rotated by `ScreenshotGallery`
     inside the teaser's `aiop-shot-frame` so the visitor sees the
     actual tool. Captured manually from the running prototype; to
     refresh, re-capture the same scroll positions and overwrite the
     PNGs in place. */
  screenshots: [
    {
      src: "/cases/screenshots/stripe-teaser/01-engine-hero.png",
      alt: "HarvestFields prototype: engine v2.0 panel with substrate metrics and ready endpoints.",
      caption: "Engine v2.0 · ready endpoints",
    },
    {
      src: "/cases/screenshots/stripe-teaser/02-architecture.png",
      alt: "HarvestFields prototype: engine, protocol, surfaces — three architecture layers.",
      caption: "Engine · protocol · surfaces",
    },
    {
      src: "/cases/screenshots/stripe-teaser/03-harness.png",
      alt: "HarvestFields prototype: seven harness stages from trap to connect.",
      caption: "Harness · trap to connect",
    },
    {
      src: "/cases/screenshots/stripe-teaser/04-validation.png",
      alt: "HarvestFields prototype: Navigate, Encode, Build validation loop owned by the brand team.",
      caption: "Validation loop · team-owned",
    },
  ] satisfies ProjectScreenshot[],

  /* Architecture-preview schematic — the documented fallback when
     `screenshots` is empty. Reads the substrate flow (sources →
     encoded substrate → inherited surfaces) inside the same shot
     frame the gallery would otherwise fill. */
  schematic: {
    eyebrow: "GTM substrate · architecture preview",
    sourcesLabel: "Brand + policy memory today",
    sources: [
      "Brand book",
      "Legal + policy",
      "Past campaigns",
      "Marketer judgment",
    ],
    substrateLabel: "Encoded once",
    substrateLayers: [
      { tag: "Voice", name: "How Stripe talks" },
      { tag: "Claims", name: "What's safe to say" },
      { tag: "Audience", name: "Devs · founders · finance" },
      { tag: "Examples", name: "What good looks like" },
    ] satisfies StripeTeaserSubstrateLayer[],
    surfacesLabel: "Inherited everywhere",
    surfaces: [
      { icon: "✎", name: "Brief drafts" },
      { icon: "C", name: "Claude" },
      { icon: "{ }", name: "Internal tools" },
      { icon: "A", name: "Agents" },
      { icon: "#", name: "Slack" },
      { icon: "✓", name: "Review gate" },
    ] satisfies StripeTeaserSurface[],
  },
} as const;

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
  /* v2 — reframe the section from a rhetorical question into the
   * answer it points at. The title names the category ("tools the
   * team builds for itself") and the body explains why this
   * category sat unsolved for so long, then names the threshold
   * that changed it. Closes by linking back to the Skill grid
   * above as the substrate those tools run on. */
  title: "Tools the team",
  titleEm: "builds for itself.",
  body:
    "Most of Loop\u2019s bottlenecks live in software too specific to buy off the shelf, and too small to justify an agency build. That category sat unsolved for years. AI models crossed a threshold at the end of 2025 where the team that owns the problem can now build the tool itself. The Skills above are what those tools run on.",
  actions: [
    { id: "cases", label: "Explore cases", href: "#cases" },
    { id: "headless", label: "Headless vision", href: "#substrate-map" },
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
  /* Quiet sign-off at the bottom of the section. Feynman as a
     credible outside voice that lands the same point the section
     argues — building is its own form of understanding — without
     restating it in our own language. Renders below the two-column
     layout as a standalone centered tile in `software-for-few.tsx`. */
  feynman: {
    quote: "\u201CWhat I cannot build, I do not understand.\u201D",
    attribution: "Richard Feynman",
  },
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
  /* Two-paragraph body now — the first names the industry pattern
     and the marketing-side translation in one beat (Salesforce
     Headless 360, Stripe Link + the Link CLI on top, then the
     "same shape one layer up" claim for marketing with the actual
     surface names in parens). The second is the ask. The earlier
     three-paragraph version split this into industry / hedge /
     specifics; the hedge is gone and the specifics fold into the
     first paragraph, so the section reads top-to-bottom as pattern
     -> my work -> ask without restating substrate vocabulary. */
  /* Body grounds the headless thesis in industry proof, then drops
   * one layer up into marketing. `bodyStrong` is the punch: Loop
   * is already building the same shape, encoded once, inherited
   * everywhere. The earlier version named Salesforce + Stripe as
   * twin proof points; this version keeps the Salesforce
   * reference (cleanly industry-public) and lets the rest of the
   * paragraph carry the marketing translation. */
  body:
    "Salesforce shipped Headless 360. The same shape is showing up one layer up in marketing \u2014 voice, claims, localization encoded once, every surface (Slack, Cursor, agents) inheriting the same judgment.",
  bodyStrong:
    "Loop is building this same shape one team at a time \u2014 voice, claims, localization encoded once, every surface inheriting the same substrate.",
  /* Third paragraph retired — the first paragraph now folds in the
     voice/claims/localization specifics that this beat used to
     carry, and the second paragraph carries the ask. Kept as an
     empty string so the data shape stays stable; `headless-shift.tsx`
     conditionally renders only when the string is non-empty. */
  bodyStripe: "",
  actions: [
    { id: "headless", label: "See the overview", href: "#substrate-map" },
  ],
  preview: {
    eyebrow: "Briefing agents",
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
 * Headless overview — what we mean by "headless"
 *
 * Concise plain-English explanation of headless. Replaces the older
 * heavy diagram + foot points + HarvestFields case, so the page tail
 * stays tight after the cases. The engine layers and surfaces grid
 * still appear, but the verbose meta strings and the three foot
 * cards are gone.
 * ─────────────────────────────────────────────────────────────────── */

export const headlessSection = {
  eyebrow: "Headless explained",
  title: "Build the engine once,",
  titleEm: "every surface inherits.",
  body:
    "Headless just means the engine and the interface are separate. You build the substrate once — rules, examples, sources, review loops — and every surface inherits from it, even as the model underneath keeps changing.",
  layers: [
    { tag: "RULES", name: "How the team decides" },
    { tag: "EXAMPLES", name: "What good looks like" },
    { tag: "SOURCES", name: "Datasources it can read" },
    { tag: "LOOPS", name: "Who confirms what" },
  ],
  surfaces: [
    { id: "chat", icon: "⌘", name: "Chat", verb: "Claude · ChatGPT · Cursor" },
    { id: "api", icon: "{ }", name: "API", verb: "MCP · REST" },
    { id: "agent", icon: "◐", name: "Agent", verb: "Scheduled · autonomous" },
    { id: "tool", icon: "⤴", name: "In-tool", verb: "Slack · Figma · Monday" },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Substrate map — sources, substrate, surfaces as one system
 *
 * First of two tail sections that follow the headless overview.
 * Translates the abstract "engine and the interface are separate"
 * line into a single inspectable map card: trusted sources on the
 * left (where marketer work already lives), the encoded substrate
 * in the middle (the authority layer the FDA builds with each
 * marketer), and the headless surfaces on the right (where the
 * cohort actually calls the engine). Two narrow connector cells
 * label the read/expose direction so the system grammar is
 * explicit, and a closing strip names the three-state transition
 * in the same mono caps grammar as the rest of the route.
 *
 * Mirrors the title-left + lede-right header rhythm shared by
 * Diagnosis, Vision, and Approach so the tail of the page reads as
 * one argument. Re-skinning for a different team only touches the
 * row arrays here.
 * ─────────────────────────────────────────────────────────────────── */

export const substrateMapSection = {
  /* v18 reframe — substrate map now lands as section 02 ("the
     product"), right under the hero. The earlier "Three layers, one
     operating model" framing read as architecture; the new framing
     reads as the answer to "what are we funding?". Body lifts the
     executive-case language straight out of `loop-ai-innovation-
     office-case.md` (the layer between how teams know things and
     what AI can do, encoded once, inherited everywhere). */
  title: "The solution is",
  titleEm: "an intelligence layer.",
  body:
    "An operating layer between how Loop teams work and what AI does. Encoded once. Inherited by every surface the team already uses.",
  /* v20: `cardLabel` ("Intelligence layer") and `flow`
     ("Source → Authority → Surface") retired with the card-head
     label strip. The card-head now renders the three phase pills
     (Navigate / Encode / Build) aligned to the three columns
     below. The phase pills also serve as the landing zone for
     the scroll-coupled handoff from the hero orbit. */
  columns: {
    sources: {
      n: "01",
      kicker: "Trusted sources",
      title: "Where the work already lives.",
      items: [
        "Brand framework",
        "Past campaigns",
        "Customer research",
        "Performance data",
        "Style guidelines",
        "Reviewer notes",
      ],
    },
    substrate: {
      n: "02",
      kicker: "Encoded substrate",
      badge: "Authority layer",
      title: "What matters, how to decide, what to check.",
      /* Canonical substrate labels — same `Rules / Examples /
         Sources / Loops` set the Encode flywheel card and the
         Headless-shift preview use, so the visitor sees the same
         vocabulary everywhere on the route. Earlier this section
         used Voice / Examples / Sources / Review (Voice was
         Loop-brand-specific; Review is a synonym for Loops). */
      items: [
        { tag: "Rules", name: "How the team decides" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Sources", name: "Data it can read" },
        { tag: "Loops", name: "Who confirms what" },
      ],
      tags: ["Owned internally", "Versioned", "Model-portable"],
    },
    surfaces: {
      n: "03",
      kicker: "Headless surfaces",
      badge: "Headless wrapper",
      title: "Where the cohort calls the engine.",
      /* Canonical surface set — same six the Headless-shift preview
         lists in its Build lane (`Cursor / Claude / Web app / REST /
         Slack / Agents`). Earlier this column reordered them and
         used "API" for what Headless-shift calls "REST"; unified
         here so the visitor sees the same surface vocabulary in
         both sections. */
      items: [
        { icon: "C", name: "Cursor" },
        { icon: "Cl", name: "Claude" },
        { icon: "◐", name: "Web app" },
        { icon: "{ }", name: "REST" },
        { icon: "#", name: "Slack" },
        { icon: "A", name: "Agents" },
      ],
    },
  },
  connectors: { left: "Reads from", right: "Exposed as" },
  /* Bottom phase row -- explains the three flywheel motions that
     produce + maintain the intelligence layer above. Lives below
     the three columns as a clean horizontal strip; replaces the
     inline column connectors (which crowded the grid) and the
     "Work stays in place / Substrate carries the judgment /
     Surfaces inherit it" footer (which restated what the diagram
     already shows). Each phase carries a short headline lifted
     from the Approach deep dive below. */
  phases: [
    {
      id: "navigate" as const,
      label: "Navigate",
      headline: "Teach the team what they're working with.",
    },
    {
      id: "encode" as const,
      label: "Encode",
      headline: "Turn how they work into a portable layer.",
    },
    {
      id: "build" as const,
      label: "Build",
      headline: "Hand them a running system they own.",
    },
  ],
  closing:
    "Work stays in place. Substrate carries the judgment. Surfaces inherit it.",
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * Surface pick — same engine, three ways in, lands everywhere
 *
 * Second tail section. Where the substrate map names the architecture,
 * this names the FDA pattern that makes it cohort-scalable: the
 * substrate underneath every tool stays the same, but a marketer
 * reaches it through whatever interface fits the moment. A tool
 * built for one marketer becomes a way in for another, which is how
 * one FDA serves ~20 marketers without each tool staying single-use.
 *
 * Mirrors the headless framing the Mímir repo ships at
 * `/briefing-assistant/headless`: three install paths (MCP / API /
 * CLI) on the left as the actual ways to talk to the engine, with
 * an "All surfaces" grid on the right naming where the engine shows
 * up. The previous "Power / Team / System" framing was retired
 * because it conflated transport (MCP, API, CLI — three protocols)
 * with destination (Cursor, Claude, Slack — concrete surfaces).
 * Cursor and Claude both ride MCP; an internal tool rides the REST
 * API; the old grouping made the architecture look split when it is
 * actually one engine, three callers, every surface inherits.
 * ─────────────────────────────────────────────────────────────────── */

export type SurfacePickInterface = {
  id: "mcp" | "api" | "cli";
  label: string;
  sublabel: string;
  icon: string;
  /** Marks the canonical way in for internal use; renders a small
   *  "Default" badge next to the label. */
  recommended?: boolean;
  detail: string;
};

/* Each row in the new "Where it lands" panel pairs one cohort role
   with one surface and a short editorial note. The icon stays
   coupled to the surface (mirroring the existing surface chip
   chrome — `C` for Cursor, `Cl` for Claude, etc.) while the role
   label is the new scannable left edge. */
export type SurfacePickRoleSurface = {
  role: string;
  icon: string;
  surface: string;
  note: string;
};

export const surfacePickSection = {
  title: "Pick the surface",
  titleEm: "that fits the workflow.",
  /* Lede threads two callbacks: it picks up the engine + surfaces
     architecture from the section above, and previews both halves
     of the card below it — the role-clustered "Where it lands"
     panel on the right (developers/Cursor, comms/Claude, PMs/
     Slack, marketers/UIs, ops/agents) and the three-protocol
     column on the left (MCP, API, CLI). Reads as: same engine,
     scaled by role, callable three ways. Drops "posture" and
     "cohort" — both read as consultancy vocabulary; "team" is
     the word Vince actually uses. */
  body:
    "Same engine, scaled across the team. Each role reaches it on the surface that fits — developers in Cursor, comms in Claude, PMs in Slack, marketers in their own UIs, ops in agents. Three ways in: MCP, API, CLI.",
  cardLabel: "Three ways in",
  flow: "Source → Surface",
  interfaces: [
    {
      id: "mcp",
      label: "MCP",
      sublabel: "Cursor / Claude",
      icon: "◇",
      recommended: true,
      detail:
        "The AI-native protocol. Drop the engine into any MCP-aware tool and the prompt context comes with it — Cursor, Claude, the cohort's own copilots.",
    },
    {
      id: "api",
      label: "API",
      sublabel: "REST · server-to-server",
      icon: "{ }",
      detail:
        "Same engine, called from a script, an internal tool, or any automation. No LLM in the loop required.",
    },
    {
      id: "cli",
      label: "CLI",
      sublabel: "curl from your terminal",
      icon: "$_",
      detail:
        "One-liner from the shell. Batch runs, quick checks, cron jobs that need to ask the engine without a UI.",
    },
  ] satisfies SurfacePickInterface[],
  surfacesLabel: "Where it lands",
  /* Role-clustered surfaces — replaces the earlier flat 6-cell grid
     so the right-hand panel reads as a sequence of "who reaches
     this engine, and on which surface". Internal tools dropped from
     this panel because the API column on the left already covers
     that path; Web app is the marketer's surface, Agents are the
     ops/automation surface. */
  roleSurfaces: [
    {
      role: "Developer",
      icon: "C",
      surface: "Cursor",
      note: "code-aware copilot",
    },
    {
      role: "PR · Comms",
      icon: "Cl",
      surface: "Claude",
      note: "long-form drafting",
    },
    {
      role: "PM",
      icon: "#",
      surface: "Slack",
      note: "where the team already lives",
    },
    {
      role: "Marketer",
      icon: "◐",
      surface: "Web app",
      note: "team-built UIs",
    },
    {
      role: "Ops",
      icon: "A",
      surface: "Agents",
      note: "scheduled, autonomous",
    },
  ] satisfies SurfacePickRoleSurface[],
  closing:
    "Build once → scale through surfaces → cohort inherits the capability",
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
        "One engine, two modes — Localise and Review. Every run becomes an eval case. Headless from day one: Web, Copilot Studio, Power Automate, MCP, all calling the same protocol.",
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
 * Closer · three sections (reflect → video → ledger) before the CTA
 *
 * The original single `StripeBridge` was split into three deliberate
 * beats so the closer breathes:
 *
 *   A · Stripe reflect — Evans-style interstitial. Cream gradient,
 *       lane washes, dot grid, a single tranquil self-quote that
 *       turns the page from "what I've built" toward "where does
 *       this fit at Stripe?". Sets up the video that follows.
 *   B · Stripe video — dark dedicated section. The visitor finally
 *       watches the Collison clip in a centered 16:9 frame; audio
 *       activates on viewport entry, pauses on exit. Small mono-caps
 *       attribution + one italic byline beneath the frame.
 *   C · Stripe ledger — dark editorial deep-dive. Three short
 *       paragraphs about the AI-invoice frustration and the Ledger
 *       build, paired with an inline schematic that visually rhymes
 *       with the actual Ledger product (dark warm + gold accents).
 *       A paraphrased Stripe-engineer reply card, then a closing
 *       call-out conclusion card whose italic clause echoes the
 *       hero's `ledeStrong` so the page reads as a closed loop.
 *
 * Video asset for section B: `/public/ai-operator/Stripe - High Agency.mp4`.
 * ─────────────────────────────────────────────────────────────────── */

/* Persistent mute-toggle pill copy, shared by section B (the video).
   Lifted out of the per-section data so the renderer can read it
   without coupling to the rest of the section's content. */
export const stripeAudioToggle = {
  listen: "Tap for sound",
  mute: "Mute",
} as const;

/* ─── Section A · Stripe reflect ─────────────────────────────────── */

export const stripeReflectSection = {
  /* Single tranquil self-quote. The reflect declares the ambition
     and primes the personal beat below: every AI tool I onboard
     teams onto runs through Stripe, so does the consultancy, and
     using Stripe daily from Europe — where payments get genuinely
     complicated — pushes me to think about the product. No
     external attribution — this is self-reflection; the figcaption
     row is dropped so the quote stands alone. */
  quote:
    "My ambition for Stripe runs beyond a marketing role. Stripe runs through all my work. Using it from Europe, where payments get genuinely complicated, you really start thinking about Stripe at a product level.",
  /* Optional parenthetical scroll-note. Renderer in
     `stripe-reflect.tsx` gates this on truthiness, so `null` makes
     the brackets disappear cleanly. */
  note: null as string | null,
  /* Tongue-in-cheek scroll affordance below the quote. Anchors to
     the Stripe-ledger section directly below, where the X-thread +
     Ledger case make the actual case for what I'd build at Stripe.
     Reads as a wink: the visitor pretends I'm advising Stripe even
     though it's a job application page. The down-arrow signals
     "scroll" rather than "open in a new tab". */
  cta: {
    label: "How Stripe could make my life better",
    href: "#stripe-ledger",
  },
} as const;

/* ─── Section B · Stripe video ───────────────────────────────────── */

export const stripeVideoSection = {
  /* Section is now a video-background hero. The clip itself does
     the editorial work; the foreground carries only what a converting
     landing-page hero needs: a title, a one-line body, a CTA. No
     eyebrow, no broadcast attribution row, no italic ornament.
     The two title pieces (`lead` + `role`) let the renderer keep
     `Forward-Deployed AI Operator` as one nowrap phrase no matter
     where `text-wrap: balance` decides to break the surrounding
     clause; the closing remark joins them as plain trailing text. */
  title: {
    lead: "Why I'm the",
    role: "Forward\u2011Deployed AI Operator",
    trail: "you're looking for.",
  },
  video: {
    src: "/ai-operator/Stripe - High Agency.mp4",
    /* Captions track slot. The .vtt file is not yet authored, so
       the renderer omits the <track> element when null. */
    captions: null as string | null,
  },
  /* One-line body that lands the connection: what Collison just
     described is the past 18 months at Loop. Sits beneath the
     title as the hero's secondary line; no card chrome, no italic. */
  body: "What John just described is what I've been doing for the past 18 months.",
  /* Single CTA. Subtle ghost button on a glass background that
     reads clearly over the video without competing with the title.
     Points the visitor at the proof: cases ship at `#cases` so a
     recruiter watching the clip can jump straight to the work. */
  cta: { label: "See the work", href: "#cases" },
} as const;

/* ─── Section C · Stripe ledger ──────────────────────────────────── *
 *
 * Rewritten as a context section: left column carries the editorial
 * eyebrow + title + body that frames why the Ledger build happened;
 * right column carries an embedded, auto-scrolling X-thread between
 * Stripe / @voidwalker_com / @irace that lands the receipt. The
 * earlier schematic, paraphrased email card, and full-width AMBITION
 * conclusion are gone — the schematic's job is now done by the X
 * thread, and the AMBITION clause migrated up to the CTA where the
 * visitor lands.
 */

export type XThreadVerified = "blue" | "business" | null;

export type XThreadStats = {
  /* Each metric is the pill string as it should render in the action
     bar (e.g. "16", "31", "1.2K", "71K"). Numbers stay strings to
     preserve the exact short-form X uses. */
  replies: string;
  reposts: string;
  likes: string;
  views: string;
};

export type XThreadMedia =
  | XThreadVideoMedia
  | XThreadCasePreviewMedia;

export type XThreadVideoMedia = {
  kind: "video";
  /* Poster image rendered as the still frame for the embedded video.
     Drop captures into `public/ai-operator/x-thread/`. */
  poster: string;
  /* Pill duration shown at the bottom-left corner of the player,
     matching X's overlay (e.g. "0:16"). */
  duration: string;
  /* Optional click-through. The video card links to the live mockup
     so visitors can experience what was demoed in the tweet. */
  href?: string;
  hrefLabel?: string;
  /* Width / height ratio for the player, defaulting to 9:16
     (mobile-vertical) which matches the original mockup recording. */
  ratio?: "9:16" | "16:9" | "1:1";
};

/* Minimalistic case-preview tile — replaces the X media image with a
   designed teaser of the case shown further down the page. No
   screenshot, just type and accent so the X thread reads as a quote
   referencing the case rather than embedding a raw asset. */
export type XThreadCasePreviewMedia = {
  kind: "case-preview";
  /* Mono caps strip across the top of the tile (e.g.
     "PERSONAL · 2026" or "THOUGHTFORM · PERSONAL SUBSTRATE"). */
  meta: string;
  /* Optional second mono caps strip rendered on the right side of
     the top row (e.g. team/lineage). */
  team?: string;
  /* Display title pair — `name` is rendered in the primary type
     colour and `nameEm` is rendered in the accent (amber) italic,
     matching the case-row heading on the page. */
  name: string;
  nameEm: string;
  /* Optional codename treatment shown under the display title
     ("Led" / "ger" → renders as "Ledger." with the second half in
     accent italic). */
  codename?: string;
  codenameEm?: string;
  /* Mono caps tagline shown above the subline (e.g.
     "FINANCIAL SUBSTRATE"). */
  tagline?: string;
  /* Short editorial subline. Quiet, italic. */
  subline?: string;
  /* Click-through. Same role as the video href — opens the live
     case landing page in a new tab. */
  href?: string;
  hrefLabel?: string;
  /* Tile aspect ratio. Defaults to 16:9 to match the case row's
     landscape format. */
  ratio?: "16:9" | "1:1" | "9:16";
};

export type XThreadTweet = {
  id: string;
  name: string;
  handle: string;
  date: string;
  verified: XThreadVerified;
  body: string;
  /* Avatar image path under `public/ai-operator/x-thread/`. When the
     PNG is missing, the renderer falls back to a monogram circle
     drawn in CSS using the first character of `name`. */
  avatar?: string;
  media?: XThreadMedia;
  stats: XThreadStats;
  /* When true, render a vertical reply line dropping from the avatar
     into the next tweet, matching X's threaded-conversation chrome. */
  hasReplyLine?: boolean;
};

export const stripeXThread: {
  /* Header label X shows when a single conversation is open. */
  headTitle: string;
  tweets: XThreadTweet[];
} = {
  headTitle: "Post",
  tweets: [
    {
      id: "stripe-roadmap",
      name: "Stripe",
      handle: "@stripe",
      date: "Apr 29",
      verified: "business",
      body:
        "Our roadmap is now public: see hundreds of upcoming product ships. We\u2019ll be adding to this list regularly.\n\nWhat\u2019s missing? @jeff_weinstein @jrfarr @kevinyien @hazelcough @backseatVC and others will be answering your questions today. \uD83E\uDDF5",
      avatar: "/ai-operator/x-thread/stripe.png",
      stats: { replies: "16", reposts: "31", likes: "273", views: "71K" },
      hasReplyLine: true,
    },
    {
      id: "vince-1",
      name: "Vince Buyssens",
      handle: "@voidwalker_com",
      date: "Apr 30",
      verified: "blue",
      body:
        "One portal in Link where we can download all our invoices! Doesn\u2019t make sense to log into dozens of different portals to collect invoices paid with the same account / card",
      avatar: "/ai-operator/x-thread/vince.png",
      stats: { replies: "1", reposts: "0", likes: "1", views: "511" },
      hasReplyLine: true,
    },
    {
      id: "irace-1",
      name: "Bryan Irace",
      handle: "@irace",
      date: "Apr 30",
      verified: null,
      body: "Fully agreed, thank you for the feedback!",
      avatar: "/ai-operator/x-thread/irace.png",
      stats: { replies: "1", reposts: "0", likes: "0", views: "56" },
      hasReplyLine: true,
    },
    {
      id: "vince-2",
      name: "Vince Buyssens",
      handle: "@voidwalker_com",
      date: "Apr 30",
      verified: "blue",
      body:
        "put way too much time into this mockup, but I really think people would LOVE this",
      avatar: "/ai-operator/x-thread/vince.png",
      /* Media card now previews the Financial Command Center
         (Ledger) case shown further down the page as a designed
         mini teaser — type + accent only, no screenshot — so
         the visitor sees the Slack briefing here as a teaser and
         then the full case walkthrough below. Switched the ratio
         to 16:9 because the Ledger screenshots are landscape
         the X thread reads as a quote pointing at the case below,
         not as a raw asset embed. Clicking the card opens the live
         `/link-to-collect.html` mockup. */
      media: {
        kind: "case-preview",
        meta: "PERSONAL \u00b7 2026",
        team: "Thoughtform \u00b7 Personal substrate",
        name: "Financial Command ",
        nameEm: "Center",
        codename: "Led",
        codenameEm: "ger",
        tagline: "Financial substrate",
        subline: "The flywheel, applied to my own business.",
        href: "/link-to-collect.html",
        hrefLabel:
          "Open the Financial Command Center case",
        ratio: "16:9",
      },
      stats: { replies: "1", reposts: "0", likes: "0", views: "59" },
      hasReplyLine: true,
    },
    {
      id: "irace-2",
      name: "Bryan Irace",
      handle: "@irace",
      date: "Apr 30",
      verified: null,
      body:
        "Oh wow, this is super cool \u2014 thank you so much for sharing. Will share with the rest of the team for inspiration.\n\nPlease keep the feedback coming!",
      avatar: "/ai-operator/x-thread/irace.png",
      stats: { replies: "1", reposts: "0", likes: "1", views: "61" },
      hasReplyLine: false,
    },
  ],
};

export const stripeLedgerSection: {
  eyebrow: string;
  title: string;
  /* Body is two paragraphs rendered as separate <p> elements in the
     copy column. Sentences avoid em dashes per the Thoughtform voice
     rule. */
  body: readonly string[];
  thread: typeof stripeXThread;
} = {
  eyebrow: "From both sides of the rails",
  title: "Why I vibecoded my own accounting tool",
  body: [
    "The thing that kicked off my vibe coding journey last year was honestly just a frustration. Most of the SaaS we use at Loop and through my own consultancy runs on Stripe. But collecting invoices means logging into every single dashboard, multiple times a month, by hand.",
    "I tried brute-forcing it with Puppeteer first. Got walled by security countermeasures pretty quickly. After a weekend of vibe coding I realized the actual answer wasn't on my side at all: Link already shows every transaction tied to my email and cards. Attaching the invoices would basically close the loop.",
    "So, out of pure desperation I dumped my frustration on X to which Bryan from the Link team replied, which then kicked off an email chain. And now we're here.",
    "I really looking forward to get started with Marketing, but being able to contribute on a Product level like this is what makes me even more excited.",
  ],
  thread: stripeXThread,
};

/* ─────────────────────────────────────────────────────────────────────
 * Ledger / Saga case row — standalone post-`stripe-ledger` slot
 *
 * Mirrors the production `CaseProject` shape so we can reuse the
 * existing `aiop-case-row` chrome verbatim, but renders as a single
 * standalone row (no modal trigger, no walkthrough button, no
 * num/total cell). The header meta strip uses the StripeTeaser
 * `metaLabel · metaTag` pattern instead of `01 / 04`.
 *
 * Content is the canonical Saga briefing authored in
 * `04_ledger.thoughtform/docs/AI_OPERATOR_PRODUCT_CARD.md`. Filenames
 * follow the existing `/cases/screenshots/<id>/` and `/cases/assets/`
 * conventions used by Mímir, Vesper, Babylon, Heimdall.
 *
 * Tone reuse (`gold`) is intentional: matches Ledger's brand colour
 * (#CAA554) and rhymes Saga with Mímir at a different scale.
 * No em dashes in the copy per Thoughtform voice rule.
 * ─────────────────────────────────────────────────────────────────── */

export const ledgerCase: {
  id: string;
  metaLabel: string;
  metaTag: string;
  name: string;
  nameEm: string;
  codename: string;
  codenameEm: string;
  tagline: string;
  subline: string;
  team: string;
  status: "Production" | "WIP";
  year: string;
  tone: CaseTone;
  workflowMode: WorkflowMode;
  challenge: string;
  workflowBefore: string;
  workflowAfter: string;
  capabilities: CaseCapability[];
  surfaces: string[];
  stack: string[];
  companyLeverage: string;
  image: string;
  screenshots: ProjectScreenshot[];
  cta: { label: string; href: string };
} = {
  id: "saga",
  metaLabel: "Personal",
  metaTag: "Production · 2026",
  name: "Financial Command ",
  nameEm: "Center",
  codename: "Led",
  codenameEm: "ger",
  tagline: "Financial Substrate",
  subline: "The flywheel, applied to my own business.",
  team: "Thoughtform · personal substrate",
  status: "Production",
  year: "2026",
  tone: "gold",
  workflowMode: "Repair",
  challenge:
    "My accountant was the reminder system, and every quarter became a tour of a dozen portals to collect invoices Stripe had already issued.",
  workflowBefore:
    "Every quarter meant logging into Cursor, Anthropic, Vercel, Krea, Loops, Midjourney, Supabase, Figma, and Linear to download the invoices Stripe had already issued. The accountant chased the missing PDFs by email, and Belgian VAT reverse-charge details lived in each merchant's billing UI.",
  workflowAfter:
    "Cloud Run watches Gmail and Drive, Claude classifies and files each PDF, a twice-weekly Slack briefing surfaces only the portals still due, and Navigator AI answers questions when it's time to file.",
  capabilities: [
    {
      k: "Multi-source intake",
      v: "Gmail, Drive, Slack, and bank CSV flow through one ingestion pipeline. Hash-deduped, classified by Claude, filed automatically.",
    },
    {
      k: "Portal cadence reminders",
      v: "Volume-weighted scoring surfaces only the vendors actually due in the upcoming window. Twice-weekly Slack briefings, nothing else.",
    },
    {
      k: "Navigator AI",
      v: "Claude grounded on the business context and live finance snapshot. Talks about the numbers like a colleague who knows the practice.",
    },
    {
      k: "Headless finance engine",
      v: "Same Cloud Run substrate answers the web dashboard, the Electron desktop, the Slack bot, and a finance MCP server.",
    },
  ],
  surfaces: [
    "Web app",
    "Electron desktop",
    "Slack bot",
    "Cloud Run worker",
    "MCP server",
    "Drive auto-sync",
  ],
  stack: [
    "Next.js",
    "Supabase",
    "Cloud Run",
    "Anthropic",
    "Voyage AI",
    "Electron",
    "MCP",
    "Slack",
    "Gmail API",
  ],
  companyLeverage:
    "The /link-to-collect page on thoughtform.co is the Stripe-facing pitch: a public preview of exactly this layer inside Stripe Link. After Stripe shared their roadmap publicly on April 29, I posted the use case and the mockup. Bryan Irace replied. The substrate I encoded for one consultant is the same one Stripe could run for every founder paying through Link.",
  image: "/ai-operator/ledger-screenshot-1.png",
  /* User-provided captures live directly under /public/ai-operator/.
     ScreenshotGallery rotates through the four entries every ~4.5s,
     pausing on hover/focus and respecting prefers-reduced-motion. */
  screenshots: [
    {
      src: "/ai-operator/ledger-screenshot-1.png",
      alt: "Saga: Ledger app screenshot 1",
      caption: "Ledger \u00b7 dashboard",
    },
    {
      src: "/ai-operator/ledger-screenshot-2.png",
      alt: "Saga: Ledger app screenshot 2",
      caption: "Ledger \u00b7 navigator",
    },
    {
      src: "/ai-operator/ledger-screenshot-3.png",
      alt: "Saga: Ledger app screenshot 3",
      caption: "Ledger \u00b7 portal briefing",
    },
    {
      src: "/ai-operator/ledger-screenshot-4.png",
      alt: "Saga: Ledger app screenshot 4",
      caption: "Ledger \u00b7 link collect",
    },
  ],
  cta: { label: "Visit landing page", href: "/link-to-collect.html" },
};

/* ─────────────────────────────────────────────────────────────────────
 * Executive summary — NEW (v16, Forward-Deployed Hub case)
 *
 * Single-screen forwardable beat. Sits between Hub Mandate and The
 * Signal so a busy reader (Dimitri, an investor he forwards the page
 * to) can land on the page, read this one section, and walk away with
 * the receipts: 21 days in, the function is already running.
 *
 * Composition:
 *   - Left column: eyebrow + display title + one paragraph + 4-up
 *     stat grid (`days`, `workshops`, `skills`, `shipped`).
 *   - Right column: faux Monday "Getting Started with Claude" board
 *     mockup. Sidebar with the 13 departments touched + 9 confirmed
 *     follow-ups; main panel with sub-items from the 21-day Monday
 *     board, each carrying an owner and a status pill (`done /
 *     running / pilot`). Pulled from the case file at
 *     ~/Downloads/loop-ai-innovation-office-case.md.
 *   - Closing line: editorial pull, italic display.
 *
 * No live data. The mockup is a designed schematic of the actual
 * Monday board so Dimitri recognises the shape, but no PII or
 * external rendering surface gets coupled to the page.
 * ─────────────────────────────────────────────────────────────────── */

export type ExecSummaryStat = {
  v: string;
  k: string;
  /* Optional secondary clause shown below the stat label as a thin
     mono-caps footnote. Used to qualify the number ("done + planned",
     "and accelerating") without inflating the headline value. */
  note?: string;
};

export type ExecSummaryDept = {
  /* Two-letter mono-caps glyph (Studio → ST, Legal → LG). Matches the
     Monday-board sidebar marker convention. */
  glyph: string;
  name: string;
  state: "done" | "running" | "queued";
};

export type ExecSummaryRowState = "done" | "running" | "pilot";

export type ExecSummaryRow = {
  /* Monday-style sub-item label. Matches the SKILL: / WORKFLOW: prefix
     pattern from the actual board. */
  tag: string;
  /* Short build name — what got shipped or is in flight. */
  name: string;
  owner: string;
  state: ExecSummaryRowState;
};

export const executiveSummarySection: {
  id: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  body: readonly string[];
  stats: ExecSummaryStat[];
  board: {
    /* Faux Monday-board chrome — the labels render as mono-caps on
       the mockup head, the sidebar shows the departments touched +
       queued, the main panel shows the recent shipped sub-items. */
    headTitle: string;
    headSub: string;
    sidebarLabel: string;
    sidebarFoot: string;
    mainLabel: string;
    mainFoot: string;
    departments: ExecSummaryDept[];
    rows: ExecSummaryRow[];
  };
  closing: string;
} = {
  id: "executive-summary",
  eyebrow: "Executive summary \u00b7 21 days in",
  title: "The function is",
  titleEm: "already running.",
  body: [
    "Three weeks ago, Loop had no enterprise AI contract, no SSO, no workshops, and no systematic way to encode team knowledge into reusable AI workflows. Today the contract is signed, SSO is live, the AI Learning Channel is running, and thirteen department sessions have shipped concrete builds with named owners.",
    "This isn't a training program. Every session identifies the workflows people actually spend their hours on, and encodes the best version of that workflow as a reusable Skill.",
  ],
  stats: [
    {
      v: "21",
      k: "days in",
      note: "Since the board started",
    },
    {
      v: "13 / 22",
      k: "Workshops",
      note: "Done + planned & confirmed",
    },
    {
      v: "50+",
      k: "Skills identified",
      note: "Across every workshop run",
    },
    {
      v: "5+",
      k: "Skills shipped",
      note: "And accelerating",
    },
  ],
  board: {
    headTitle: "Getting Started with Claude",
    headSub: "Loop \u00b7 Internal Monday board",
    sidebarLabel: "Departments",
    sidebarFoot: "13 done \u00b7 9 confirmed",
    mainLabel: "Recent skills shipped",
    mainFoot: "Each sub-item maps to one workshop, one owner.",
    departments: [
      { glyph: "ST", name: "Studio", state: "done" },
      { glyph: "EX", name: "Executives", state: "done" },
      { glyph: "IA", name: "Insights & Analytics", state: "done" },
      { glyph: "PD", name: "Product Design", state: "done" },
      { glyph: "UX", name: "User Experience", state: "done" },
      { glyph: "PE", name: "Product Engineering", state: "done" },
      { glyph: "PM", name: "Program Management", state: "done" },
      { glyph: "FA", name: "Finance & Accounting", state: "done" },
      { glyph: "PO", name: "People Ops", state: "done" },
      { glyph: "LG", name: "Legal", state: "done" },
      { glyph: "MK", name: "PMM", state: "done" },
      { glyph: "SH", name: "Shopify", state: "done" },
      { glyph: "TA", name: "Talent Acquisition", state: "done" },
      { glyph: "BP", name: "Brand & Partnerships", state: "queued" },
      { glyph: "WC", name: "Warehousing & CS", state: "queued" },
      { glyph: "SC", name: "Supply Chain", state: "queued" },
      { glyph: "CS", name: "Creative Strategy", state: "queued" },
      { glyph: "FP", name: "Finance / FP&A", state: "queued" },
    ],
    rows: [
      {
        tag: "SKILL",
        name: "NDA Pre-Check",
        owner: "Olga \u00b7 Legal",
        state: "done",
      },
      {
        tag: "SKILL",
        name: "Regulatory Watchlist",
        owner: "Herman \u00b7 Legal",
        state: "done",
      },
      {
        tag: "WORKFLOW",
        name: "Program status update",
        owner: "Robert \u00b7 PgM",
        state: "running",
      },
      {
        tag: "WORKFLOW",
        name: "Risk management",
        owner: "Sander \u00b7 PgM",
        state: "running",
      },
      {
        tag: "SKILL",
        name: "Employer branding pattern",
        owner: "Maxim + Studio",
        state: "running",
      },
      {
        tag: "SKILL",
        name: "Business case skill",
        owner: "Maxim + Jenna",
        state: "running",
      },
      {
        tag: "INTEGRATION",
        name: "Data platform integration",
        owner: "Charlotte \u00b7 I&A",
        state: "pilot",
      },
      {
        tag: "WORKFLOW",
        name: "SharePoint \u2192 Google Sites",
        owner: "People Ops",
        state: "running",
      },
    ],
  },
  closing:
    "Twenty-one days, thirteen departments, named owners on every build. Aether names what is already running.",
};

/* ─────────────────────────────────────────────────────────────────────
 * How we scale — NEW (replaces the old `flywheelBridgeSection` quote)
 *
 * Concrete three-card answer to "OK. So how do we scale this?". Same
 * lane colours as Approach (violet / amber / sage) so the section
 * reads as the same Navigate / Encode / Build spine, framed as the
 * scaling mechanism rather than the framework itself.
 *
 * Each card carries:
 *   - a lane label (Navigate / Encode / Build) and a tone for the
 *     accent rail
 *   - an eyebrow naming the scaling shape ("the workshop pattern",
 *     "the Skill library", "the Hub team")
 *   - a one-line headline + 2–3 sentence body
 *   - a 3-tile stat strip with the receipts the body references
 *   - an italic foot line that hands into the next card or the
 *     overall punchline
 *
 * The third card lands the Hub-team multiplier story (the verbatim
 * quote from the retired `flywheelBridgeSection`) so nothing is lost
 * from that beat. Vince + Nathan get a single foot mention here; the
 * full Team & Ask card lives further down the page.
 * ─────────────────────────────────────────────────────────────────── */

export type HowWeScaleTone = "violet" | "amber" | "sage";

export type HowWeScaleStat = {
  v: string;
  k: string;
};

export type HowWeScaleCard = {
  id: "navigate" | "encode" | "build";
  label: "Navigate" | "Encode" | "Build";
  tone: HowWeScaleTone;
  eyebrow: string;
  headline: string;
  body: readonly string[];
  stats: HowWeScaleStat[];
  foot: string;
};

export const howWeScaleSection: {
  id: string;
  eyebrow: string;
  /* Italic display lead retained from the old FlywheelBridge. The
     question still opens the section; the three cards below answer
     it concretely instead of leaving it as a quote. */
  lead: string;
  title: string;
  titleEm: string;
  /* One-paragraph framing under the title. Names what the three cards
     are: the scaling mechanism, not the framework. */
  caption: string;
  cards: HowWeScaleCard[];
  /* Quiet mono-caps line below the cards. Hands off into the deep
     stack (Approach + Cases + Headless) the same way the old bridge's
     `handoff` did. */
  handoff: string;
} = {
  id: "how-we-scale",
  eyebrow: "How we scale",
  lead: "OK. So how do we scale this?",
  title: "The flywheel turns,",
  titleEm: "and the team that received the tool ships the next one.",
  caption:
    "Same way it has scaled for 18 months. Three motions, three receipts, one operator at a time. The Hub does not accumulate work. It multiplies who can do it.",
  cards: [
    {
      id: "navigate",
      label: "Navigate",
      tone: "violet",
      eyebrow: "The workshop pattern",
      headline: "Every team gets a session, a follow-up, and a Skill they own.",
      body: [
        "Pre-digest the team's actual work, run a 45-minute live build in the room, recap into a Monday doc, follow up two weeks later when they have had time with the tools.",
        "The pattern is itself encoded: the AI Adoption Skill captures the playbook so any new operator can run the same flywheel without reinventing it.",
      ],
      stats: [
        { v: "13", k: "Workshops done" },
        { v: "9", k: "Confirmed next" },
        { v: "20+", k: "Departments touched" },
      ],
      foot: "Hands the team off to Encode with a workflow brief and one candidate Skill.",
    },
    {
      id: "encode",
      label: "Encode",
      tone: "amber",
      eyebrow: "The Skill library",
      headline: "Institutional knowledge that doesn't walk out the door.",
      body: [
        "Every workflow that gets encoded is a Skill the team owns. Brand voice, claim gates, NDA pre-checks, regulatory watchlists, status updates, employer branding. The library compounds.",
        "Models change. Tools change. The encoded layer carries forward.",
      ],
      stats: [
        { v: "50+", k: "Skills identified" },
        { v: "5+", k: "Shipped & live" },
        { v: "10", k: "Named owners" },
      ],
      foot: "Hands the engineer a versioned Skill the surfaces inherit.",
    },
    {
      id: "build",
      label: "Build",
      tone: "sage",
      eyebrow: "The Hub team",
      headline: "When the Hub turns, the team that received the tool ships the next one.",
      body: [
        "Studio designs its own AI canvas. Performance writes its own Skills. Localization extends the dubbing pipeline. Loopers teach each other how to use them.",
        "The two seats that make this multiplier real: a Forward Deployed Catalyst inside the cohort, and a full-stack engineer hardening the headless capabilities behind it.",
      ],
      stats: [
        { v: "4", k: "Programs in production" },
        { v: "2", k: "Seats to formalise" },
        { v: "1", k: "Mandate" },
      ],
      foot: "Vince \u00b7 Nathan. The Catalyst keeps flying between teams; the Engineer keeps the substrate running.",
    },
  ],
  handoff:
    "What follows is the operating model deep dive, the four programs in production, and the substrate that lets the next team start further along than the last.",
};

/* ─────────────────────────────────────────────────────────────────────
 * Team & Ask — NEW (Forward-Deployed Hub composition card)
 *
 * The explicit ask. Renders as a two-seat composition card (the same
 * shape the codebase originally designed for the Hub Mandate right
 * column before that slot got the orbit) with a 3-row cadence strip
 * below, a mandate clause, and a Seed / Mandate / Capability ladder
 * of investment so Dimitri sees the three commitment levels at a
 * glance.
 *
 * Named seats are deliberate: the page is internal first, but the
 * org-chart framing (role + codename + named incumbent) holds up if
 * Dimitri forwards the page to an investor — it reads as a credible
 * team shape, not as a job application.
 * ─────────────────────────────────────────────────────────────────── */

export type TeamShapeSeat = {
  id: "catalyst" | "engineer";
  /* Mono-caps role label rendered above the codename. Matches the
     Cases-row codename grammar used elsewhere on the page. */
  role: string;
  /* Codename split for the Bodoni italic accent treatment. The em
     half renders in the seat's lane colour (`Cata` + `lyst`,
     `For` + `ge`). */
  codename: string;
  codenameEm: string;
  /* Named incumbent. Internal pitch reads "Vince" / "Nathan"; an
     investor read still parses as the org-chart's current holders. */
  name: string;
  /* Short mono-caps team line under the name (where the seat sits
     today inside Loop). */
  team: string;
  /* Two-line summary of what the seat does. */
  summary: string;
  /* Three short bullets naming what the seat unlocks. Renders as a
     checklist below the summary. */
  unlocks: string[];
};

export type TeamShapeCadenceBeat = {
  k: string;
  v: string;
};

export type TeamShapeLadderRung = {
  id: "seed" | "mandate" | "capability";
  tag: string;
  title: string;
  body: string;
  /* Optional small marker rendered in the top-right corner of the
     rung — used to tag "next step" on the Seed rung so Dimitri sees
     which decision is on the table now. */
  marker?: string;
};

export const teamShapeSection: {
  id: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  body: readonly string[];
  composition: {
    headEyebrow: string;
    headBadge: string;
    seats: TeamShapeSeat[];
    cadenceLabel: string;
    cadence: TeamShapeCadenceBeat[];
    foot: string;
  };
  ladder: {
    label: string;
    rungs: TeamShapeLadderRung[];
    foot: string;
  };
  mandate: {
    label: string;
    clauses: string[];
  };
} = {
  id: "team-shape",
  eyebrow: "Team & ask",
  title: "Two seats.",
  titleEm: "One mandate. Three commitments.",
  body: [
    "The Hub is not a department. It is a layer the company inherits. Two seats run it; AI Stewards inside each cohort take the practice from there.",
    "The Catalyst keeps flying between teams. The Engineer keeps the substrate running. Together they hold the flywheel without becoming a bottleneck.",
  ],
  composition: {
    headEyebrow: "Hub composition",
    headBadge: "Founding seats",
    seats: [
      {
        id: "catalyst",
        role: "01 \u00b7 Forward Deployed Catalyst",
        codename: "Cata",
        codenameEm: "lyst",
        name: "Vince Buyssens",
        team: "Creative Technology \u00b7 18 months in production",
        summary:
          "Embeds inside the cohort, navigates the team's actual work, encodes how they decide into a Skill they own, hands back the running system.",
        unlocks: [
          "The workshop flywheel running at 13 / 22 today",
          "The encoded AI Adoption Skill the next operator inherits",
          "Pattern recognition across teams \u2192 the next Skill the cohort runs on",
        ],
      },
      {
        id: "engineer",
        role: "02 \u00b7 Full-Stack Engineer",
        codename: "For",
        codenameEm: "ge",
        name: "Nathan",
        team: "New seat \u00b7 hardening + shipping",
        summary:
          "Hardens the headless capabilities behind the Skills, ships the surfaces the cohort uses daily, owns the builder cockpit, MCP servers, and the Supabase + Anthropic glue.",
        unlocks: [
          "Production hardening of Mímir, Vesper, Babylon, Heimdall",
          "Builder cockpit so any Looper can clone a Skill template",
          "Faster turnaround on the next four workflows in queue",
        ],
      },
    ],
    cadenceLabel: "How the seats work together",
    cadence: [
      { k: "Embed", v: "Catalyst inside the cohort, weekly." },
      { k: "Encode", v: "Skill drafted in the room, ratified by review." },
      { k: "Hand back", v: "Engineer hardens; the team runs it." },
    ],
    foot:
      "Founding seats. AI Stewards (one per team) join from inside the cohort once the Skill ships.",
  },
  ladder: {
    label: "Ladder of investment",
    rungs: [
      {
        id: "seed",
        tag: "01 \u00b7 Seed",
        title: "One full-stack hire.",
        body: "Add Nathan. Keep the Catalyst flying. No platform spend yet \u2014 the existing stack carries us through the next three workflows.",
        marker: "On the table",
      },
      {
        id: "mandate",
        tag: "02 \u00b7 Mandate",
        title: "Formalise the AI Innovation Office.",
        body: "Name the function, give it the budget for AI Stewards, hand the cohort a recruiting line. Aether becomes the substrate every team inherits.",
      },
      {
        id: "capability",
        tag: "03 \u00b7 Capability",
        title: "Productise the headless platform.",
        body: "Multi-team builder cockpit, shared substrate registry, on-call rotation. Once the cadence is proven, the layer compounds across the company.",
      },
    ],
    foot: "Each rung is one quarter ahead of the last. Decide the first one now.",
  },
  mandate: {
    label: "What the office owns",
    clauses: [
      "Recruit AI Stewards inside every cohort, one per team.",
      "Own the Skill library and its quality, architecture, and coherence.",
      "Hold the connector policy, monitoring, and access groups with IT.",
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * CTA + footer
 * ─────────────────────────────────────────────────────────────────── */

export type CtaAction = {
  id: string;
  kind: "primary" | "ghost";
  label: string;
  href: string;
  external?: boolean;
};

export type CtaDecision = {
  id: string;
  tag: string;
  /* Imperative one-line decision Dimitri can act on. Stays as a verb
     phrase so the close reads as three specific moves, not three
     abstract concepts. */
  title: string;
  /* Single short clause beneath the title naming what the move
     unlocks. */
  body: string;
};

export const ctaSection: {
  eyebrow: string;
  /* The italic em is the editorial tagline retained from the Linear
     restructure — short, direct, the line a sponsor recognises as
     the punch the rest of the page leads to. */
  titleEm: string;
  /* One-paragraph body. Names the industry pressure (the labs are
     spending billions to package the same operating model and sell
     it back to companies) so the three-decision close reads as the
     internal answer to that external pressure. */
  body: readonly string[];
  fine: string;
  /* Three concrete decisions Dimitri is being asked to make. Renders
     as a three-card row above the action buttons so the close reads
     as a decision sheet, not a generic CTA. */
  decisions: CtaDecision[];
  /* Action list: primary actions kick off the formalisation
     conversation by walking the argument; ghost actions point back
     at the supporting reads (the operating model deep dive, the
     headless vision). */
  actions: CtaAction[];
} = {
  eyebrow: "The decision",
  titleEm: "Make the layer real before the labs sell it back to us.",
  body: [
    "OpenAI is buying Tomoro for 150 forward-deployed engineers. Anthropic is wiring Claude into Blackstone for $1.5B. PE-backed deployment companies are now offering the same operating model to every mid-size and enterprise team that will buy it. Loop has the proof in-house. Three moves formalise it.",
  ],
  fine:
    "Antwerp \u00b7 CET. Two seats. Three workflows. One quarter to encoded proof.",
  decisions: [
    {
      id: "office",
      tag: "01 \u00b7 Office",
      title: "Formalise the office.",
      body: "Name the function, give it the mandate. Aether becomes the substrate every team inherits.",
    },
    {
      id: "engineer",
      tag: "02 \u00b7 Engineer",
      title: "Add Nathan.",
      body: "Unlock the build seat. Headless capabilities harden. The Catalyst keeps flying between teams.",
    },
    {
      id: "workflows",
      tag: "03 \u00b7 Workflows",
      title: "Pick the next workflows.",
      body: "Nine departments are already on the waiting list. Choose the first three; we ship inside the quarter.",
    },
  ],
  actions: [
    {
      id: "team",
      kind: "primary",
      label: "Walk the team shape",
      href: "#team-shape",
    },
    {
      id: "proof",
      kind: "primary",
      label: "Walk the Loop proof",
      href: "#cases",
    },
    {
      id: "approach",
      kind: "ghost",
      label: "Read the operating model",
      href: "#approach",
    },
    {
      id: "headless",
      kind: "ghost",
      label: "Read the headless vision",
      href: "#substrate-map",
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────
 * Engine pattern · momentum carousel
 *
 * Sits between Signal and FunctionImpact and parallax-reveals over
 * Signal. Reads as a quick scan of company momentum: who shipped
 * what this week, who committed to what next.
 *
 * Composition:
 *
 *   1. Section header (Signal-style left-title + right-paragraph)
 *      lands the pattern story in two beats: "six teams, one engine"
 *      as the bicolour title, and the one-sentence proof as the sub
 *      on the right.
 *
 *   2. Carousel of landscape cards. One card per team workshop.
 *      Shipped cards lead (live receipt dot pulses), kickoff cards
 *      follow (committed receipt). Every body line is one short
 *      sentence — the eye scans, the brain doesn't have to read.
 *
 *   3. Final breadth card closes the carousel ("8 more through June"
 *      + the queued team names) so the breadth lands as a deliberate
 *      "and there's more" beat.
 *
 * The card array is a discriminated union on `kind` so future Monday
 * wiring (see `lib/monday.ts`) can merge live receipts onto the
 * static editorial framing by team name without reshaping the card
 * list.
 * ─────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────
 * Already-running pivot — minimalist editorial chapter that lands
 * the turn from "industry FOMO" (Signal) into "we already have it"
 * (Vision flywheel + Engine pattern carousel that follow).
 *
 * Tone: Benedict-Evans-style pull. Free-standing italic display
 * quote, hairline + mono-caps attribution. No card chrome. No
 * parallax. The section is a calm breathing beat between the
 * loud news cards above and the flywheel below.
 * ─────────────────────────────────────────────────────────── */

export type AlreadyRunningSection = {
  id: string;
  ariaLabel: string;
  /* Lead clause — declarative, lands first. */
  lead: string;
  /* Italic accent clause — the punch. Renders inside the same
     blockquote as `lead`, separated by a period. */
  accent: string;
  attribName: string;
  attribMeta: string;
};

export const alreadyRunningSection: AlreadyRunningSection = {
  id: "already-running",
  ariaLabel: "The pivot: we already have the layer running",
  lead: "We already have the layer running.",
  accent:
    "Let\u2019s scale it before the labs sell it back to us.",
  attribName: "Vince Buyssens",
  attribMeta: "Three weeks into the function",
};

export type EnginePatternTeamCard = {
  kind: "team";
  /* Department / function name. */
  team: string;
  /* Workshop date as it would render on the card. */
  date: string;
  /* `shipped` cards lead the carousel and use the live receipt
     tone. `kickoff` cards follow and use the committed tone. */
  status: "shipped" | "kickoff";
  /* One short sentence (≤ 90 chars) — the most concrete thing the
     team shipped or committed. Executive scan, not paragraph. */
  body: string;
  /* Receipt pill text. Mono-caps, honest verb taxonomy:
     `IN USE` (deployed daily), `BUILT` (encoded as a Skill, not
     yet in daily rotation), `IN BUILD` (actively being shaped),
     `IN FLIGHT` (work scheduled), `COMMITTED` (named owner,
     sessions booked). Avoid `LIVE` / `SHIPPED` — they overclaim. */
  receipt: string;
  /* Receipt pill tone — `live` for shipped work (pulsing dot),
     `committed` for named owners and booked sessions. */
  receiptTone: "live" | "committed";
  /* Optional named owners surfaced as a single thin line under
     the body. Keeps contributors visible without bulking the
     card. */
  owners?: readonly string[];
};

export type EnginePatternBreadthCard = {
  kind: "breadth";
  eyebrow: string;
  title: string;
  /* Names of upcoming workshops rendered as a chip grid. */
  queued: readonly string[];
  /* Closing receipt pill ("13 DONE · 8 CONFIRMED"). */
  receipt: string;
};

/* Skill-level card variant used by /intelligence-layer's engine-pattern
 * (3-up carousel of the fifteen Skills shipping across Loop). Same
 * gradient bleed and carousel chrome as the homepage's team-level cards,
 * but renders one Skill per card instead of one team per card. Shape
 * mirrors `SkillCard` in `content/skills-deck.ts`; the page that
 * consumes this flattens `skillsDeckSection.slides[*].cards` and
 * decorates each entry with its parent slide's team label. */
export type EnginePatternSkillCard = {
  kind: "skill";
  /* Stable React key (slug from the Skill id in skills-deck). */
  id: string;
  /* Mono-caps team tag printed above the title. Comes from the
     parent slide's `team` + `teamEm` joined into one string. */
  team: string;
  /* Concise Skill title — scan-first heading on the card. */
  title: string;
  /* One-line capability description (~110 chars max). */
  body: string;
  owners?: readonly string[];
  /* Mono-caps status label printed inside the receipt pill. */
  receipt: string;
  /* Pill tone — `live` for IN USE / BUILT, `committed` for IN BUILD /
     IN FLIGHT / COMMITTED, `scoping` for SCOPING. Maps 1:1 to the
     `SkillReceiptTone` used by the skills deck. */
  receiptTone: "live" | "committed" | "scoping";
  /* Optional external reference (Monday doc, advisory, internal repo)
     surfaced under the body as a small mono-caps link. */
  link?: { label: string; href: string };
};

export type EnginePatternCard =
  | EnginePatternTeamCard
  | EnginePatternBreadthCard
  | EnginePatternSkillCard;

export const enginePatternSection: {
  id: string;
  ariaLabel: string;
  /* Section header rendered above the carousel. Mirrors the
     `signalSection` shape — bicolour title on the left, single
     short paragraph on the right. */
  header: {
    title: string;
    titleEm: string;
    titleAfter?: string;
    sub: string;
  };
  cards: readonly EnginePatternCard[];
} = {
  id: "engine-pattern",
  ariaLabel:
    "Workshop momentum: six teams arrived at the same architecture, ten teams shipping or committed",
  header: {
    title: "Loop already has the layer",
    titleEm: "running.",
    sub: "Six teams converged on the same architecture without coordinating. The intelligence layer they built is running across Loop today.",
  },
  cards: [
    {
      kind: "team",
      team: "Product Engineering",
      date: "11 May",
      status: "shipped",
      body: "Tolerance Analysis Skill runs design specs against manufacturing tolerances before parts reach the floor. Three more Skills shipped alongside it.",
      receipt: "4 IN USE \u00b7 1 BUILT",
      receiptTone: "live",
      owners: ["Mansour", "Jennifer", "Miguel"],
    },
    {
      kind: "team",
      team: "Warehousing & Customer Ops",
      date: "13 May",
      status: "shipped",
      body: "Quality Auditor scores customer tickets ahead of the weekly review, surfacing the cases that need human judgement. Invoice Processor ingests vendor invoices with fraud-pattern checks.",
      receipt: "2 IN USE \u00b7 1 BUILT",
      receiptTone: "live",
      owners: ["Toby", "Maud", "Rob", "Samuel", "Davy"],
    },
    {
      kind: "team",
      team: "Product Design / UX",
      date: "30 April",
      status: "shipped",
      body: "CMF Skill wired into Vesper. Material specs in, SKU renders out — no manual rebuilds.",
      receipt: "CMF IN VESPER \u00b7 IN PRODUCTION",
      receiptTone: "live",
      owners: ["Damien", "Tibo"],
    },
    {
      kind: "team",
      team: "Legal",
      date: "11 May",
      status: "shipped",
      body: "Tracker-compliance Skill scans Loop's web properties weekly and reports consent violations to the team.",
      receipt: "1 IN USE \u00b7 5 IN DRAFT",
      receiptTone: "live",
      owners: ["Herman", "St\u00e9phanie", "Therese"],
    },
    {
      kind: "team",
      team: "Finance / Accounting",
      date: "8 May",
      status: "shipped",
      body: "Variance commentary Skill drafts the month-end narrative from raw cycle data. Excel add-in in heavy use; MEC tracker runs in Claude.",
      receipt: "2 IN USE \u00b7 1 BUILT",
      receiptTone: "live",
    },
    {
      kind: "team",
      team: "Strategic Insights",
      date: "24 April",
      status: "shipped",
      body: "M\u00edmir pulls Reddit, Magic Brief and SharePoint into one briefing surface for Creative Strategy.",
      receipt: "M\u00cdMIR IN BUILD",
      receiptTone: "live",
    },
    {
      kind: "team",
      team: "People Ops",
      date: "8 May",
      status: "shipped",
      body: "Tone-of-voice Skill keeps internal communications consistent across People Ops. Three more Skills committed by the team.",
      receipt: "1 BUILT \u00b7 3 COMMITTED",
      receiptTone: "live",
      owners: ["Thais", "Gabriel", "Bernice", "Astrid"],
    },
    {
      kind: "team",
      team: "Program Mgmt & Product",
      date: "12 May",
      status: "kickoff",
      body: "Status Updates and Risk Management Skills committed. Sessions booked with named owners.",
      receipt: "2 COMMITTED",
      receiptTone: "committed",
      owners: ["Robert", "Sander"],
    },
    {
      kind: "team",
      team: "Brand & Partnerships",
      date: "13 May",
      status: "kickoff",
      body: "Four Skills in flight from one kickoff. Owners assigned, scope locked.",
      receipt: "4 IN FLIGHT \u00b7 NAMED",
      receiptTone: "committed",
      owners: ["Nathalie", "Stan", "Monica", "Yalis"],
    },
    {
      kind: "team",
      team: "Talent Acquisition",
      date: "12 May",
      status: "kickoff",
      body: "Three Skills in flight from the Studio pilot; Business Case Skill committed.",
      receipt: "3 IN FLIGHT \u00b7 1 COMMITTED",
      receiptTone: "committed",
      owners: ["Maxim", "Jenn"],
    },
    {
      kind: "breadth",
      eyebrow: "Plus",
      title: "8 more through June.",
      queued: [
        "Manufacturing Programs",
        "Supply Chain",
        "IT",
        "Sourcing",
        "Marketplaces",
        "Finance FP&A",
        "Executive Assistants",
        "Paid Search & CRO",
      ],
      receipt: "13 DONE \u00b7 8 CONFIRMED",
    },
  ],
};

export const footer = {
  line: "Aether \u00b7 Loop's Forward-Deployed Hub",
  signature: "Creative Technology \u00b7 18 months in production \u00b7 Antwerp",
  studio: "Internal capability proposal \u00b7 Loop Earplugs",
} as const;

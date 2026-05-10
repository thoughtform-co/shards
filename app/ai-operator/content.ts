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
 *   03 Quote bridge  — Evans on the asking gap. Quote and chips fade
 *                      gently on scroll while a delayed parenthetical
 *                      "(because AI isn't software)" reveals below the
 *                      attribution.
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
    { id: "headless", label: "Headless", href: "#substrate-map" },
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
 *      brand voice at scale, localization at scale, brief handoff
 *      between product marketing and studio, and briefing synthesis
 *      across scattered inputs.
 *   3. Shared-gap card that names the asking gap. The card hands
 *      directly into the Evans quote, which elaborates the same idea
 *      in a credible outside voice ("the challenge is working out how
 *      to ask for what you want").
 *
 * Content is the only thing that changes when the page is re-skinned
 * for Delaware, Ml6, or any other client; the structure stays.
 *
 * The gap card deliberately does not preview Navigate / Encode / Build
 * pill chrome. The Quote Bridge frames the trio as bordered editorial
 * chips inside the Evans sentence; the Vision orbit is the first place
 * the visitor sees the lane pills proper.
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
  title: string;
  titleEm: string;
  lede: string;
  ledeStrong: string;
  useCases: DiagnosisUseCase[];
  gap: {
    title: string;
    titleEm: string;
    subline?: string;
  };
} = {
  title: "The missing layer is rarely",
  titleEm: "the model.",
  /* `lede` carries the setup; `ledeStrong` is the load-bearing
     phrase rendered as a `<strong>` so the missing-layer thesis
     reads at a glance even when the visitor scans the section. */
  lede:
    "Most companies already have AI tools, data, and founders who want to move fast. What they lack is the ",
  ledeStrong: "layer between what their teams know and what AI does.",
  useCases: [
    {
      n: "01",
      tag: "Brand voice at scale",
      title: "Brand voice slips faster than reviewers catch it.",
      body: "AI doubled the output. The voice rules still live in three senior heads, and drift only surfaces at retro meetings.",
      tone: "violet",
    },
    {
      n: "02",
      tag: "Localization at scale",
      title: "AI translates at scale, but cultural nuances never reach the system.",
      body: "AI handles the translation. The nuance stays in reviewer comments, claim checks, and local market calls, so the next launch starts from zero again.",
      tone: "gold",
    },
    {
      n: "03",
      tag: "Brief handoff",
      title: "The studio team making the ads has no clear briefing to fall back on.",
      body: "Product marketing has an ultra-clear view on how a new product should sell, but by the time the brief reaches the studio team downstream, the angle that mattered is gone.",
      tone: "sage",
    },
    {
      n: "04",
      tag: "Briefing synthesis",
      title: "All the data for a great briefing is there, but AI simply doesn't know how to interpret it.",
      body: "Customer reviews, social listening, competitor ads, paid performance, brand framework — all present, all in different tools, with no layer that turns them into a creative angle.",
      tone: "slate",
    },
  ],
  gap: {
    title: "The fix isn't more AI.",
    titleEm: "It's learning how to brief an AI.",
    /* Quiet parenthetical aside — flags that briefing is harder than
       it looks without trying to argue the WHY here. The Bridge's
       Evans quote names it as the asking gap and the parenthetical
       under the attribution lands the new-category insight, so the
       gap card just has to seed the difficulty. */
    subline: "(which is more difficult than it sounds.)",
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
  /* Title splits across an italicised pivot. The em wraps the verb
     `is` so the heading lands as "Adoption that works _is_
     automation." — a short declarative whose pivot reads at a glance.
     Rendering interleaves: title + <em>{titleEm}</em> + titleAfter. */
  title: "Adoption that works",
  titleEm: "is",
  titleAfter: "automation.",
  /* Centre of the orbit: the substrate is the deepest position in the
     architecture — the encoded layer everything else sits on. The
     file names below the label are the canonical examples (a brain
     dump of how the team works, a Skill that encodes GTM strategy,
     a meeting transcript that gets ingested next). */
  centerLabel: "SUBSTRATE",
  centerFiles: [
    "how-teams-work.md",
    "stripe-mkt-strategy.skill",
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
  caption:
    "Once you figure out how to navigate AI, you learn how to encode the way you work into a layer you can build any agent on.",
} as const;

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
export const visionMarketSignalsHeader = {
  ledeStart: "\u2026which is what everyone is betting on\u2026 ",
  ledeAccent: "and what I started 18 months ago.",
} as const;

export type VisionMarketSignal = {
  id: string;
  source: string;
  headline: string;
  date: string;
  href: string;
};

export const visionMarketSignals: VisionMarketSignal[] = [
  {
    id: "wsj-fde",
    source: "WSJ",
    headline:
      "Forward deployed engineers — Palantir's playbook is back.",
    date: "March 2026",
    href: "https://www.wsj.com/articles/ai-startups-have-a-new-old-secret-weapon-forward-deployed-engineers-d18ee609",
  },
  {
    id: "stripe-fda",
    source: "Stripe Careers",
    headline:
      "Forward Deployed AI Accelerator — operators embedded with marketing teams.",
    date: "May 2026",
    href: "https://stripe.com/jobs/listing/forward-deployed-ai-accelerator-marketing/7747638",
  },
  {
    id: "openai-jv",
    source: "Bloomberg",
    headline:
      "OpenAI's $10B \u201CDeployment Company\u201D to deploy AI in 2,000+ portfolio firms.",
    date: "May 2026",
    href: "https://www.bloomberg.com/news/articles/2026-05-04/openai-finalizes-10-billion-joint-venture-with-pe-firms-to-deploy-ai",
  },
  {
    id: "anthropic-jv",
    source: "WSJ",
    headline:
      "Anthropic's $1.5B PE venture embeds Claude engineers in mid-size firms.",
    date: "April 2026",
    href: "https://www.wsj.com/business/deals/anthropic-nears-1-5-billion-joint-venture-with-wall-street-firms-8f5448ee",
  },
];

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

export const flywheelBridgeSection = {
  quote:
    "18 months ago I moved from the AI team into marketing. Today the same team produces what would have taken twenty people \u2014 on tools they built themselves.",
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
    "I've led the AI adoption at Loop Earplugs since 2024, first across the whole company, then embedded inside marketing, helping teams turn the way they actually work into reusable skills they can build their own automations on.",
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
  /* Optional Three Degrees of Freedom mini-strip rendered below the
     `What gets encoded` chips and above the foot. Names the canonical
     Skill anatomy: which parts of the contract are LOCKED (banned
     terms, legal claims), which are GUIDED (audience register, market
     norms), which are OPEN (headlines, rhythm, framing). The framework
     is Anthropic's own best practice for Skill design ("Set
     appropriate degrees of freedom"), is the same trio shown on
     harvestfields slide 5, and rhymes with the LOCK/GUIDE/EXPLORE
     bands `thoughtform-strategy` documents. Surfacing it here makes
     the Encode visual scannable without forcing the visitor into the
     modal. */
  freedomBands?: {
    label: string;
    bands: {
      id: "locked" | "guided" | "open";
      tag: string;
      example: string;
    }[];
  };
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
    headline: "Turn how the team works into a portable layer any agent can use.",
    /* Body shape: insight → definition → proof → implication. The
       lead two sentences ("AI is intelligence. It just needs context.")
       carry the WHY skills work; everything after is the WHAT and the
       Loop proof. Length is held to roughly the previous body so the
       row keeps its rhythm. The temp-agency analogy from the Anthropic
       podcast is intentionally NOT in the body — the lead two
       sentences cover the same idea more efficiently. */
    body:
      "AI is intelligence. It just needs context. Encoding is how you teach it the nuances of your brand, your standards, your review process, written down so any agent can inherit it. That's what I've done at Loop: dozens of workflows captured as substrate — brand voice, claim gates, marketplace copy. A teammate can read it. An agent can run on it. Models change. The encoded layer carries forward.",
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
      /* Three Degrees of Freedom — the canonical Skill anatomy. Same
         framework that runs harvestfields slide 5 and that Anthropic
         documents in their Skill best-practices guide. Three short
         examples per band, deliberately concrete (banned terms /
         audience register / headlines) so the chip strip reads as
         operating instructions rather than abstract theory. */
      freedomBands: {
        label: "Three degrees of freedom",
        bands: [
          { id: "locked", tag: "Locked", example: "Banned terms, legal claims, product facts." },
          { id: "guided", tag: "Guided", example: "Audience register, market norms." },
          { id: "open", tag: "Open", example: "Headlines, rhythm, campaign framing." },
        ],
      },
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
      "AI collapses the distance between knowing the problem and shipping the tool. The person closest to the work can finally build the tool around it. The work starts in a Teams call. I listen for the frustration, turn the transcript into a user story in Cursor, and either build the interface around it or expose the logic headlessly through MCP. Then I hand it to the person I built it for. Nobody understands their domain better than they do.",
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
            "AI Image & Video Suite (Vesper) replaced Krea outright. Studio now runs every campaign through it.",
            "Studio PM Orchestrator (Heimdall) moves briefings from Monday into Figma every week.",
            "Briefing Agent (Mímir) is reshaping how Creative Strategy plans every campaign cycle.",
            "UGC Dubber (Babylon) is in pilot for the Japanese market and expanding into ATL content dubbing.",
          ],
        },
      ],
      signal: "Building is the unlock. The flywheel that follows is what keeps the team running without me.",
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
     "all of marketing" (which would overclaim). "The teams I embed
     with" lands the operator's actual reach honestly. */
  headline: "The teams I embed with run the program without me.",
  /* Body shape: escalating triplet (Navigate / Encode / Build, same
     three pills the bridge above seeds) → the new operator insight
     (pattern recognition across teams becomes the next Skill the
     cohort inherits). The Stripe tie-in is implicit through "cohort"
     and "next team" — language Stripe's FDA team will recognise
     without the body reading as copy-paste from the job posting. */
  body:
    "Navigate gives them the mental model. Encode gives them the substrate. Build gives them the tools. Moving between teams is the unlock — I see which patterns scale, encode them, and the next team starts further along than the last.",
  achievements: [
    {
      n: "01",
      label: "AI default",
      body: "90% of Studio briefings ship with AI — without needing me anymore.",
    },
    {
      n: "02",
      label: "Custom engine",
      body: "A custom image and video generation engine, built to remove friction so Studio keeps producing high-performing assets at scale.",
    },
    {
      n: "03",
      label: "Team handoff",
      body: "Localization managers now product-managing and shaping the UGC dubbing tool I built for them.",
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
  ctaHref: "#booking-placeholder",

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
  title: "Why",
  titleEm: "build custom tools?",
  body:
    "Most bottlenecks remain unsolved because existing SaaS isn't good enough and custom development for a problem-for-few doesn't make sense. That changed at the end of 2025 when AI models finally became good enough that people could actually build their own solutions — which I've started doing across the entire marketing department at Loop.",
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
    "Salesforce shipped Headless 360, Stripe shipped a CLI for the terminal — both bet on the same idea: the orchestration matters more than the surface that exposes it.",
  bodyStrong:
    "My Loop tools are partly there; the rest is what I'm working on. It's also the discipline I teach in workshops — design the orchestration first, because the surface is the cheapest layer to swap later.",
  actions: [
    { id: "headless", label: "See the overview", href: "#headless" },
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
  title: "Three layers,",
  titleEm: "one operating model.",
  body:
    "The substrate doesn't add a new database. It encodes the reasoning on top of the systems marketers already use — what matters, how to decide, what to check before something ships — so every surface inherits the same judgment, even when the model underneath changes.",
  cardLabel: "Substrate map",
  flow: "Source → Authority → Surface",
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
      items: [
        { tag: "Voice", name: "How the brand speaks" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Sources", name: "What data it can read" },
        { tag: "Review", name: "Who confirms what" },
      ],
      tags: ["Owned by marketing", "Versioned", "Model-portable"],
    },
    surfaces: {
      n: "03",
      kicker: "Headless surfaces",
      badge: "Headless wrapper",
      title: "Where the cohort calls the engine.",
      items: [
        { icon: "C", name: "Cursor" },
        { icon: "Cl", name: "Claude" },
        { icon: "◐", name: "Web app" },
        { icon: "#", name: "Slack" },
        { icon: "A", name: "Agents" },
        { icon: "{ }", name: "API" },
      ],
    },
  },
  connectors: { left: "Reads from", right: "Exposed as" },
  closing:
    "Work stays in place → substrate adds judgment → surfaces inherit it",
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
 * Mirrors the headless framing the Mimir repo ships at
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

export type SurfacePickSurface = {
  icon: string;
  name: string;
};

export const surfacePickSection = {
  title: "Pick the surface",
  titleEm: "that fits the workflow.",
  body:
    "A tool built for one marketer becomes a way in for another. The substrate underneath stays the same; the way to reach it adapts to where the work already happens — an AI-native protocol for tools like Cursor and Claude, a REST API for systems and automations, a CLI for quick scripts.",
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
  surfaces: [
    { icon: "C", name: "Cursor" },
    { icon: "Cl", name: "Claude" },
    { icon: "◐", name: "Web app" },
    { icon: "#", name: "Slack" },
    { icon: "A", name: "Agents" },
    { icon: "⤴", name: "Internal tools" },
  ] satisfies SurfacePickSurface[],
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
  /* Single tranquil self-quote. Picks up the Evans-bridge editorial
     weight (italic display centerpiece) but in the candidate's own
     voice — a question rather than a borrowed thesis. The mono-caps
     subline frames the voice without a real-person attribution. */
  quote:
    "I keep returning to the same question: what is the version of this work at Stripe?",
  attribName: "Vincent Buyssens",
  attribMeta: "A question I keep returning to",
  /* Optional parenthetical scroll-note. Mirrors Evans's
     "(because AI isn't software)" — adds a quiet editorial beat
     without asserting anything. Set to `null` to skip. */
  note: "asked once a week, lately",
} as const;

/* ─── Section B · Stripe video ───────────────────────────────────── */

export const stripeVideoSection = {
  video: {
    src: "/ai-operator/Stripe - High Agency.mp4",
    /* Captions track slot. The .vtt file is not yet authored, so
       the renderer omits the <track> element when null. */
    captions: null as string | null,
  },
  /* Mono-caps attribution row directly below the video frame. */
  attribName: "John Collison",
  attribMeta: "TBPN Live · May 2026",
  /* Italic byline below the attribution. Reflects the parallel
     between Collison's three threads (high-agency, double majors,
     marketing funnel) and the candidate's last 18 months without
     pointing at it explicitly. */
  byline: "What he describes is the work above.",
} as const;

/* ─── Section C · Stripe ledger ──────────────────────────────────── */

export type LedgerSchematicChip = { label: string; tone?: "default" | "accent" };

export const stripeLedgerSection = {
  /* Story column — three short editorial paragraphs. No headline,
     no eyebrow; the section reads as continued narration after the
     video lands. */
  story: [
    "Earlier this year I noticed something. The biggest bottleneck in my consultancy wasn't the work — it was downloading invoices from a dozen AI portals every month. Cursor, Anthropic, Krea, Vercel, Loops. Every one of them paid through Stripe.",
    "I wrote up the case for surfacing those invoices inside Stripe Link — GDPR notes, the actual user journey, why a single virtual card doesn't solve it. Then I emailed Irace. And while I waited, I built it anyway.",
    "Ledger reads invoices, clusters vendors semantically, and runs a Navigator that talks about the numbers like a thoughtful colleague — with context about the business, not generic advice. It's a small product, but everything I've been thinking about for 18 months at Loop runs underneath it.",
  ] as const,

  /* Right-column visual — inline Ledger schematic. CSS-rendered
     preview consistent with how `stripeTeaser.schematic` is built;
     no real screenshot needed for this cut. The chip list represents
     the AI-subscription pile that triggered the build; the connector
     names the Ledger pipeline at a glance; the insight strip gives
     the visitor a taste of what Navigator AI actually returns. */
  schematic: {
    eyebrow: "Ledger · financial command center",
    sourcesLabel: "AI subscriptions paid through Stripe",
    sources: [
      { label: "Cursor" },
      { label: "Anthropic" },
      { label: "Krea" },
      { label: "Vercel" },
      { label: "Loops" },
    ] as LedgerSchematicChip[],
    connector: "read · cluster · interpret",
    insightLabel: "Navigator · this quarter",
    insight:
      "67% of your Q2 spend is AI infrastructure — that's the substrate, not overhead.",
  },

  /* Stylised email card — paraphrased reply from the Stripe engineer.
     Stays small and discreet, sits below the schematic on desktop. */
  emailCard: {
    eyebrow: "From a Stripe engineer · May 2026",
    body: "Tell me a slight bit more about your invoicing needs.",
    foot: "(reply, lightly paraphrased)",
  },

  /* Closing call-out conclusion card. Sits at the bottom of the
     section as a single full-width card whose italic clause echoes
     the hero's `ledeStrong` so the page reads as a closed loop. */
  conclusion: {
    eyebrow: "Ambition",
    lead: "My ambition isn't to transform a marketing department.",
    em: "It's to help build the economic layer for the age of co-intelligence.",
  },
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

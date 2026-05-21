/*
 * Skills deck — content module.
 *
 * Companion deck for the workshop momentum carousel on the homepage.
 * Where `enginePatternSection` packs one card per team into a
 * horizontal rail, this deck unrolls per-team detail into a small
 * sequence of full-bleed slides — one slide per team cluster, each
 * with a tight grid of skill cards (concise title + one-line body +
 * owner + status pill).
 *
 * Hybrid clustering rules:
 *   - Mostly one team per slide.
 *   - Sparse teams (one skill) merge with their nearest neighbour so
 *     no slide reads visually empty.
 *   - Card count per slide aims at 3 (with 2- and 4-card outliers
 *     allowed when the team genuinely has that many initiatives).
 *
 * Sources:
 *   - Workshop notes from the Skill rollout (Loop internal).
 *   - Monday board:    https://loopearplugs.monday.com/boards/18409569683
 *   - UX foundations:  https://loopearplugs.monday.com/docs/18412757197
 *   - Product Ideation: https://loopearplugs.monday.com/docs/18413798022
 *   - VSME standard:   https://www.efrag.org/en/projects/voluntary-reporting-standard-for-smes-vsme/concluded
 *
 * Voice mirrors `enginePatternSection.cards`: declarative one-line
 * bodies, no marketing fluff, named owners surface naturally.
 */

export type SkillStatus =
  | "in-use"
  | "built"
  | "in-build"
  | "in-flight"
  | "scoping";

/* Receipt tone drives the dot colour on the status pill:
 *   - `live`      → emerald, pulsing (IN USE / BUILT)
 *   - `committed` → amber (IN BUILD / IN FLIGHT)
 *   - `scoping`   → slate (SCOPING — early exploration) */
export type SkillReceiptTone = "live" | "committed" | "scoping";

export type SkillCard = {
  /* Stable key (slug). Used as the React key and the slot anchor. */
  id: string;
  /* Very concise card heading (~3–5 words). Reads at a scan. */
  title: string;
  /* One-line description of what the Skill does. Up to ~110 chars. */
  body: string;
  /* Named contributors, surfaced as a single thin line under the
     body. Same shape as `EnginePatternTeamCard.owners`. */
  owners?: readonly string[];
  status: SkillStatus;
  /* Mono-caps label printed inside the status pill. */
  statusLabel: string;
  receiptTone: SkillReceiptTone;
  /* Optional external reference (Monday doc, advisory, internal
     repo). Rendered as a tiny mono-caps caption below the body in
     web view; print drops it to a footnote-style hint. */
  link?: { label: string; href: string };
};

export type SkillSlide = {
  id: string;
  /* The team or merged-team cluster name printed as the slide
     header. Sparse clusters use " & " (e.g. "Product & Program
     Management"). */
  team: string;
  /* Optional italic emphasis substring — usually the second half of
     the team name so the head reads with the same typographic beat
     as the rest of the deck. Renders inside `<em>` and inherits the
     Bodoni italic styling from `.aiop-skills-deck__slide-title em`. */
  teamEm?: string;
  /* Mono-caps eyebrow above the slide title. */
  kicker: string;
  /* One short framing sentence. Reads as the right-column sub to
     the slide title. */
  lede: string;
  cards: readonly SkillCard[];
};

export type SkillsDeckSection = {
  id: string;
  ariaLabel: string;
  header: {
    eyebrow: string;
    title: string;
    titleEm: string;
    titleAfter?: string;
    sub: string;
  };
  slides: readonly SkillSlide[];
};

export const skillsDeckSection: SkillsDeckSection = {
  id: "skills-deck",
  ariaLabel:
    "Skills shipping across Loop — one slide per team cluster, one card per Skill",
  header: {
    eyebrow: "Skill momentum \u00b7 By team",
    title: "Fifteen Skills shipping",
    titleEm: "across Loop.",
    sub: "One concise card per Skill — what it is, what it does, who owns it. Hybrid clusters: mostly one team per slide, sparse teams merge with their nearest neighbour.",
  },
  slides: [
    /* ─── Slide 1 · Product Design ──────────────────────────────── */
    {
      id: "product-design",
      team: "Product Design",
      teamEm: "& UX",
      kicker: "Slide 01 \u00b7 Product Design",
      lede: "From CMF to packaging to UX foundations — designers ship the substrate they used to brief.",
      cards: [
        {
          id: "cmf-skill",
          title: "CMF Skill in Vesper",
          body: "Generates the CMF PDF — material specs and SKU renders — end-to-end through Vesper, no manual rebuilds.",
          owners: ["Damien"],
          status: "in-use",
          statusLabel: "IN USE",
          receiptTone: "live",
        },
        {
          id: "packaging-skill",
          title: "Packaging Skill",
          body: "Same eco-system idea applied to packaging: structural designers, graphic designers, and engineers pull shared specs from one place.",
          owners: ["Ana", "Damien"],
          status: "scoping",
          statusLabel: "SCOPING",
          receiptTone: "scoping",
        },
        {
          id: "ux-foundations-skill",
          title: "UX Foundations",
          body: "Encodes the UX heuristics, research patterns, and review checklists Aur\u00e9lie\u2019s team uses to keep product judgement consistent.",
          owners: ["Aur\u00e9lie"],
          status: "built",
          statusLabel: "BUILT",
          receiptTone: "live",
          link: {
            label: "Monday doc",
            href: "https://loopearplugs.monday.com/docs/18412757197",
          },
        },
      ],
    },

    /* ─── Slide 2 · Product & Program Management ────────────────── */
    {
      id: "product-program-management",
      team: "Product & Program",
      teamEm: "Management",
      kicker: "Slide 02 \u00b7 PM \u00b7 PgM",
      lede: "Ideation up front, status and risk in the middle, sustainability reporting at the close — the management spine encoded as Skills.",
      cards: [
        {
          id: "product-ideation",
          title: "Product Ideation",
          body: "Structured ideation flow that turns raw briefs into scoped product bets, grounded in Loop\u2019s PM rituals.",
          owners: ["Carlota"],
          status: "built",
          statusLabel: "BUILT",
          receiptTone: "live",
          link: {
            label: "Monday doc",
            href: "https://loopearplugs.monday.com/docs/18413798022",
          },
        },
        {
          id: "program-status-updates",
          title: "Program Status Updates",
          body: "Reads meeting transcripts, checks risk boards on consistent templates, reviews the roadmap board, and writes the weekly delta.",
          owners: ["Robert"],
          status: "in-build",
          statusLabel: "IN BUILD",
          receiptTone: "committed",
        },
        {
          id: "risk-management",
          title: "Risk Management",
          body: "Encodes Loop\u2019s program-risk taxonomy and the rubric Sander uses to score, escalate, and close program risks.",
          owners: ["Sander"],
          status: "in-build",
          statusLabel: "IN BUILD",
          receiptTone: "committed",
        },
        {
          id: "vsme-reporting",
          title: "VSME Reporting",
          body: "Drafts the Voluntary Sustainability Reporting Standard answers for non-listed SMEs — basic and comprehensive modules.",
          status: "scoping",
          statusLabel: "SCOPING",
          receiptTone: "scoping",
          link: {
            label: "EFRAG VSME",
            href: "https://www.efrag.org/en/projects/voluntary-reporting-standard-for-smes-vsme/concluded",
          },
        },
      ],
    },

    /* ─── Slide 3 · Warehousing & Product Ops ───────────────────── */
    {
      id: "warehousing-product-ops",
      team: "Warehousing &",
      teamEm: "Product Ops",
      kicker: "Slide 03 \u00b7 Warehousing \u00b7 CX \u00b7 Ops",
      lede: "Fraud signals on Shopify, rubric-based ticket review against the CX partner, vendor invoices with built-in scam checks.",
      cards: [
        {
          id: "fraud-detection",
          title: "Shopify Fraud Detection",
          body: "Scans Shopify order logs for fraud-pattern signals and surfaces the cases that need a human call before fulfilment.",
          owners: ["Toby", "Maud"],
          status: "built",
          statusLabel: "BUILT",
          receiptTone: "live",
        },
        {
          id: "ticket-quality-auditor",
          title: "Ticket Quality Auditor",
          body: "Evaluates the CX partner\u2019s ticket handling against an internal rubric, side-by-side with the AI response, ahead of weekly review.",
          owners: ["Toby", "Maud"],
          status: "built",
          statusLabel: "BUILT",
          receiptTone: "live",
        },
        {
          id: "invoice-processor",
          title: "Invoice Processor",
          body: "Ingests vendor invoices, extracts line items, and flags scam patterns and amount mismatches before they reach Finance.",
          owners: ["Dennis"],
          status: "in-build",
          statusLabel: "IN BUILD",
          receiptTone: "committed",
        },
      ],
    },

    /* ─── Slide 4 · PMM ─────────────────────────────────────────── */
    {
      id: "pmm",
      team: "Product Marketing",
      teamEm: "(PMM)",
      kicker: "Slide 04 \u00b7 PMM",
      lede: "Marketing calendars stop being PDFs and become databases — wired straight into the briefing agent that uses them.",
      cards: [
        {
          id: "retail-marketing-calendar",
          title: "Retail Marketing Calendar",
          body: "Claude-Design retail calendar wired into M\u00edmir\u2019s database — briefings inherit the same year, retailer, and event grid the PMM team plans against.",
          owners: ["Pixie"],
          status: "in-use",
          statusLabel: "IN USE",
          receiptTone: "live",
        },
        {
          id: "partnership-calendar",
          title: "Partnership Calendar",
          body: "Same calendar-as-substrate idea applied to partnerships and brand events, so the briefing agent reads from a single source.",
          owners: ["Caro", "Katie"],
          status: "scoping",
          statusLabel: "SCOPING",
          receiptTone: "scoping",
        },
      ],
    },

    /* ─── Slide 5 · Brand & Partnerships ────────────────────────── */
    {
      id: "brand-partnerships",
      team: "Brand &",
      teamEm: "Partnerships",
      kicker: "Slide 05 \u00b7 Brand \u00b7 Partnerships",
      lede: "Triage the inbox, automate the social readout, lock the founder\u2019s voice — three skills, one tier of brand decisions.",
      cards: [
        {
          id: "partnership-inbox-filtering",
          title: "Partnership Inbox Filtering",
          body: "Sorts incoming partnership requests into Tier 1 / 2 / 3 and drafts the response by tier — gradient thinking for nuanced calls.",
          owners: ["Nathalie", "Stijn"],
          status: "in-build",
          statusLabel: "IN BUILD",
          receiptTone: "committed",
        },
        {
          id: "social-reporting-automation",
          title: "Social Reporting Automation",
          body: "Pulls Dash Hudson into the monthly report for Rob and threads Brandwatch listening into the same readout the team interprets together.",
          owners: ["Monica"],
          status: "in-build",
          statusLabel: "IN BUILD",
          receiptTone: "committed",
        },
        {
          id: "founder-tov",
          title: "Founder Tone-of-Voice",
          body: "Encodes Maartje\u2019s tone-of-voice as a Skill so founder-led copy stays consistent across LinkedIn, internal notes, and press.",
          owners: ["Sayrade"],
          status: "in-build",
          statusLabel: "IN BUILD",
          receiptTone: "committed",
        },
      ],
    },
  ],
};

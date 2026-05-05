/* ─────────────────────────────────────────────────────────────────────
 * AI Operator landing — V2 content.
 *
 * V2 is a Legend-inspired re-cut of the first three chapters: a centered
 * Navigate / Encode / Build flywheel that anchors the page, with text
 * arranged around it. Hero introduces the operator; the second section
 * carries the Loop transformation story; the third section breaks the
 * flywheel apart so each pill becomes a method anchor.
 *
 * The rest of the page (cases, headless, harvestfields, cta) is being
 * rethought separately, so this content module deliberately covers only
 * the first three chapters and the page chrome.
 * ─────────────────────────────────────────────────────────────────── */

export const v2Meta = {
  brandName: "Vincent Buyssens",
  brandSub: "AI Operator · V2",
  status: "Antwerp · CET",
  links: [
    { label: "V1", href: "/ai-operator" },
    { label: "Cases", href: "/ai-operator#cases" },
    { label: "Selected case", href: "/ai-operator/harvestfields" },
  ],
  cta: {
    label: "Get in touch",
    href: "mailto:vince@thoughtform.co?subject=Forward-deployed%20AI%20operator",
  },
} as const;

/* ─── Frame 01 · Hero ────────────────────────────────────────────── */

export const v2Hero = {
  index: "01 / 03",
  chapter: "Thesis",
  title: "AI capability,",
  titleEm: "built inside the work.",

  vision: {
    label: "Vision",
    /* Two short paragraphs with a paragraph break between — the
     * thesis sentence first, the operator promise second. Read top
     * to bottom under the Vision eyebrow. */
    paragraphs: [
      "The relationship between human intelligence and AI is the work of our generation.",
      "I help teams navigate it inside their actual work, encode what makes that work good, and build the capability underneath.",
    ],
    cta: { label: "Explore Vision", href: "#vision" },
  },

  bio: {
    label: "Operator",
    name: "Vincent Buyssens",
    /* Bio copy is now folded into the body paragraphs; the standalone
     * role label and meta rows are intentionally omitted on V2 so the
     * right column reads as a tight intro + CTA pair. */
    paragraphs: [
      "Creative technologist navigating the tides of digital change for over a decade.",
      "Embedded at Loop Earplugs to transform marketing with AI.",
    ],
    cta: { label: "Read CV", href: "#cv" },
  },
} as const;

/* ─── Frame 02 · Loop transformation ─────────────────────────────── */

export const v2Loop = {
  index: "02 / 03",
  chapter: "Proof",

  vision: {
    label: "My vision on AI",
    /* Title splits at the verb so the italic em carries the move
     * (mirrors the Hero "AI capability, built inside the work."
     * cadence). */
    title: "AI adoption and automation",
    titleEm: "is the same flywheel.",
    body:
      "Navigating real work, encoding know-how and building the first capability fast enough so strategy and delivery stay connected.",
    cta: { label: "See the engines", href: "/ai-operator#cases" },
  },

  proof: {
    label: "AI at Loop Earplugs",
    title: "The same loop, across an entire marketing department.",
    /* Two paragraphs: the embedded mandate first, the company-wide
     * fluency mandate second. The space between reads as a beat. */
    paragraphs: [
      "Embedded inside marketing to transform everything from our content creation pipeline to building \u201Ctools-for-few\u201D around team bottlenecks.",
      "Responsible for company-wide Claude rollout and AI fluency.",
    ],
    metrics: [
      { v: "4", k: "Full-stack AI tools" },
      { v: "20+", k: "Workflows encoded in Skills" },
      { v: "10+", k: "Teams self-sufficient with Claude" },
      { v: "90%", k: "Paid social content with AI" },
    ],
  },
} as const;

/* ─── Frame 03 · Method (Navigate / Encode / Build) ──────────────── */

export type V2Tone = "navigate" | "encode" | "build";

export type V2Step = {
  id: V2Tone;
  label: string;
  headline: string;
  body: string;
  signal: { k: string; v: string };
  visual: { k: string; v: string }[];
};

export const v2Method = {
  index: "03 / 03",
  chapter: "Method",
  title: "One method.",
  titleEm: "Three motions that compound.",

  steps: [
    {
      id: "navigate",
      label: "Navigate",
      headline: "Inside the workflow until the patterns surface.",
      body:
        "Sit alongside the team in their highest-leverage routines. Watch where judgment actually happens. Coach a cohort from awareness to first win to self-sufficient.",
      signal: {
        k: "Outcome",
        v: "A workflow brief and a maturity model per marketer.",
      },
      visual: [
        { k: "Aware", v: "01" },
        { k: "First win", v: "02" },
        { k: "Regular", v: "03" },
        { k: "Self-sufficient", v: "04" },
      ],
    },
    {
      id: "encode",
      label: "Encode",
      headline: "Turn the way the team works into substrate the system can hold.",
      body:
        "Field notes become legible substrate: rules, examples, sources, loops. Drafted by the operator, ratified by the team, versioned in Git. The asset that survives the next model.",
      signal: {
        k: "Outcome",
        v: "A Skill the team owns. Plain text. Reviewable like code.",
      },
      visual: [
        { k: "Rules", v: "12" },
        { k: "Examples", v: "38" },
        { k: "Sources", v: "3" },
        { k: "Loops", v: "2" },
      ],
    },
    {
      id: "build",
      label: "Build",
      headline: "Show a working proof on their own deliverable today.",
      body:
        "Vibe-coded inside days. Hardened to production over weeks. Headless from day one — the same engine answers Claude, Cursor, Slack, and an in-tool button.",
      signal: {
        k: "Outcome",
        v: "A thin running surface the team uses daily.",
      },
      visual: [
        { k: "Chat", v: "⌘" },
        { k: "API", v: "{ }" },
        { k: "Agent", v: "◐" },
        { k: "In-tool", v: "⤴" },
      ],
    },
  ] as V2Step[],
} as const;

/* ─── Footer ─────────────────────────────────────────────────────── */

export const v2Footer = {
  line: "Vincent Buyssens · Forward-Deployed AI Operator",
  signature: "Antwerp · Belgium",
  studio: "Practice: Thoughtform",
} as const;

/*
 * Content for the Claude Workshop v1 fork of `/`
 * (route: /claude-workshop-v1).
 *
 * One module so the "Let's get Claudin'" interlude, the three
 * getting-started panes (Settings, Models & Tokens, Connectors)
 * and the two folded-in Skills sections share a single voice and
 * a single edit surface. Components in
 * `components/claude-workshop/` import from here; nothing else
 * does, so this file is the source of truth for the workshop fork
 * without touching `content/intelligence-layer.ts` or
 * `content/operator.ts`.
 *
 * Voice rules (project-wide):
 *   - no em dashes
 *   - declarative sentences
 *   - no forced rule-of-three
 *   - no "X is not Y, it is Z" balanced pairs
 *   - mono-caps eyebrows read as labels, not as taglines
 *
 * Visual rules:
 *   - The interlude carries the Anthropic palette through its
 *     `aiop-question-bridge--claude` modifier.
 *   - The three getting-started panes sit inside the
 *     `.aiop-claude-zone` wrapper on the page, which scopes the
 *     Anthropic surface tokens (Ivory / Slate / Clay) over the
 *     usual Aether ones for that stretch.
 *   - The two Skills sections (`ClaudeSkillAnatomy` and
 *     `ClaudeSkillsAtLoop`) sit OUTSIDE the Anthropic zone, back
 *     on the Aether palette. They reuse one Clay accent badge so
 *     the Claude origin stays visible without flipping the
 *     surrounding encode deep-dive into a different brand.
 */

/* ─── Shared types ────────────────────────────────────────────────── */

export type ClaudeBridgeSection = {
  id: string;
  ariaLabel: string;
  /* Mono-caps eyebrow above the editorial question. Pass an empty
     string to suppress (matches QuestionInterstitial's behaviour). */
  eyebrow: string;
  /* The italic display question — the visual hero of the section. */
  question: string;
  /* Upright follow-up line that lands the answer hint. */
  subline: string;
  /* Optional delayed parenthetical. Empty string suppresses. */
  scrollNote: string;
};

export type ClaudeCard = {
  id: string;
  /* Mono-caps counter (e.g. "01"). */
  n: string;
  /* Bodoni-italic label sitting above the body. */
  label: string;
  /* One-paragraph card body. */
  body: string;
};

export type ClaudeTip = {
  id: string;
  /* Two-segment mono-caps tag, e.g. `TIP · MEMORY`. */
  tag: string;
  body: string;
};

export type ClaudeStackSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  /* Optional trailing fragment after `<em>`, e.g. ".". */
  titleAfter?: string;
  sub: string;
  cards: readonly ClaudeCard[];
  /* Optional tip strip below the card grid. */
  tips?: readonly ClaudeTip[];
  /* Optional mono-caps receipt line under the tips. */
  receipt?: string;
};

export type ClaudeConnector = {
  id: string;
  name: string;
  /* One-line use case explaining what Claude does with the
     connector. */
  body: string;
};

export type ClaudeConnectorGroup = {
  id: "live" | "wip" | "gap";
  /* Mono-caps label for the group ("LIVE", "IN PROGRESS",
     "NOT YET"). */
  label: string;
  /* Short sentence under the label that frames the group. */
  blurb: string;
  connectors: readonly ClaudeConnector[];
};

export type ClaudeConnectorsSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  sub: string;
  groups: readonly ClaudeConnectorGroup[];
};

export type ClaudeAnatomyRow = {
  id: string;
  label: string;
  body: string;
};

export type ClaudeAnatomySection = {
  id: string;
  ariaLabel: string;
  /* Small Clay-tinted badge sitting in the top-left of the
     section card. The single Anthropic accent on this section. */
  badge: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  body: string;
  rows: readonly ClaudeAnatomyRow[];
};

export type ClaudeSkillEntry = {
  id: string;
  /* Skill title (e.g. "Loop Legal Risk"). */
  title: string;
  /* Single-line owner credit ("by Olga"). Empty string when the
     owner credit doesn't apply. */
  owner: string;
  /* One-sentence description of what the Skill does. */
  body: string;
};

export type ClaudeSkillsAtLoopSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  sub: string;
  skills: readonly ClaudeSkillEntry[];
  /* Footnote that stitches this list to the 15-Skill carousel
     earlier on the page. */
  footnote: string;
};

/* ─── Section 1 · "Let's get Claudin'" interlude ──────────────────── */

export const claudeBridgeSection: ClaudeBridgeSection = {
  id: "claude",
  ariaLabel:
    "An interlude that opens the Claude getting-started chapter below",
  eyebrow: "Claude \u00b7 let\u2019s get going",
  question: "Let\u2019s get Claudin\u2019.",
  subline:
    "Open the app, switch on the right toggles, and put the smartest model to work.",
  scrollNote: "",
};

/* ─── Section 2 · Settings & Configuration ────────────────────────── */

export const claudeSettingsSection: ClaudeStackSection = {
  id: "claude-settings",
  ariaLabel: "Claude settings and configuration",
  title: "Switch on the",
  titleEm: "right toggles",
  titleAfter: ".",
  sub: "Three settings carry most of what makes Claude feel like a colleague who remembers you. Turn them on once and the rest of the work stops starting from zero.",
  cards: [
    {
      id: "search-chats",
      n: "01",
      label: "Search and reference chats",
      body: "Claude can search your previous conversations for context, so a new chat lands inside the thread instead of restarting it.",
    },
    {
      id: "memory",
      n: "02",
      label: "Generate memory from chat history",
      body: "An ambient memory layer learns your preferences over time. Tone, recurring projects, the way you brief work, what good looks like.",
    },
    {
      id: "artifacts",
      n: "03",
      label: "Artifacts and live visualizations",
      body: "Lets Claude produce HTML dashboards and interactive views inside the chat instead of describing them in text.",
    },
  ],
  tips: [
    {
      id: "memory-tip",
      tag: "TIP \u00b7 MEMORY",
      body: "Review and edit memories every few weeks. Claude can over-fixate on details mentioned multiple times.",
    },
    {
      id: "instructions-tip",
      tag: "TIP \u00b7 INSTRUCTIONS",
      body: "Leave the custom instructions field empty. Memory and Skills carry preferences better, and constraints here (like \u201cdon\u2019t use em dashes\u201d) flatten creativity across every chat.",
    },
  ],
};

/* ─── Section 3 · Model selection & token usage ───────────────────── */

export const claudeModelsSection: ClaudeStackSection = {
  id: "claude-models",
  ariaLabel: "Claude model selection and token usage",
  title: "Pick the smartest model,",
  titleEm: "every time",
  titleAfter: ".",
  sub: "Opus is the lever that decides whether the answer compounds or evaporates. Pair it with extended thinking and the cost difference earns itself back in one good run.",
  cards: [
    {
      id: "opus",
      n: "01",
      label: "Opus first",
      body: "Opus is the smartest model. Sonnet and Haiku are cheaper, not smarter. For analysis and creative work, default to Opus.",
    },
    {
      id: "extended-thinking",
      n: "02",
      label: "Extended thinking on",
      body: "Keep the extended thinking toggle on. It reduces hallucinations and gives the model room to actually reason instead of pattern-matching.",
    },
    {
      id: "budget",
      n: "03",
      label: "Budget reality",
      body: "Average is around 80 euros per person per month. Power users land at 180 to 200. Treat the first weeks as exploration, not as a budget exercise.",
    },
  ],
  receipt: "Hit a limit? Reach out. The upgrade is instant.",
};

/* ─── Section 4 · Connectors & integrations ───────────────────────── */

export const claudeConnectorsSection: ClaudeConnectorsSection = {
  id: "claude-connectors",
  ariaLabel: "Claude connectors and integrations",
  title: "Wire Claude into",
  titleEm: "the tools you already use",
  titleAfter: ".",
  sub: "The point of a connector is to stop copy-pasting. Each one Claude reaches into shortens the loop between a question and the answer that already lives in the system.",
  groups: [
    {
      id: "live",
      label: "LIVE",
      blurb: "Working today across the team.",
      connectors: [
        {
          id: "gmail-calendar",
          name: "Gmail and Calendar",
          body: "Query the inbox, label threads, prep the week, and summarise long threads into something you can read in a minute.",
        },
        {
          id: "monday",
          name: "Monday",
          body: "Format meeting transcripts and populate boards with structured data automatically.",
        },
        {
          id: "google-docs-notion",
          name: "Google Docs and Notion",
          body: "Store and retrieve ways of working, meeting notes, and team documentation.",
        },
        {
          id: "figma",
          name: "Figma",
          body: "Link Figma files to review copy, summarise comments, and read assets against creative strategies.",
        },
        {
          id: "canva",
          name: "Canva",
          body: "Read templates to encode Skills about well-performing creatives, or draft mock-ups from copy.",
        },
        {
          id: "shopify",
          name: "Shopify",
          body: "Testing live for inventory levels and e-commerce data.",
        },
      ],
    },
    {
      id: "wip",
      label: "IN PROGRESS",
      blurb: "Wired up, waiting on the right gate.",
      connectors: [
        {
          id: "meta-ads",
          name: "Meta Ads",
          body: "MCP connector in progress. Waiting on legal approval because of account ban risk.",
        },
        {
          id: "tiktok-ads",
          name: "TikTok Ads",
          body: "Integration being explored in parallel with Meta.",
        },
      ],
    },
    {
      id: "gap",
      label: "NOT YET",
      blurb: "No connector available; workarounds in place.",
      connectors: [
        {
          id: "frontify",
          name: "Frontify",
          body: "No direct connector. Workarounds exist via the API and manual exports.",
        },
        {
          id: "contentino",
          name: "Contentino",
          body: "No MCP or API available today.",
        },
      ],
    },
  ],
};

/* ─── Section 5 · What a Skill is (folds into Encode deep dive) ───── */

export const claudeSkillAnatomySection: ClaudeAnatomySection = {
  id: "claude-skill-anatomy",
  ariaLabel: "What a Claude Skill is",
  badge: "Claude \u00b7 Skill",
  title: "A Skill is one file",
  titleEm: "that hands Claude your judgment",
  titleAfter: ".",
  body: "A Skill is a text file with instructions and reference materials that encodes the way you think about a specific kind of work. Claude reads the Skill the same way a new colleague would read a notebook: it picks up the rules, the examples, and the taste, then applies them inside the chat.",
  rows: [
    {
      id: "skills-vs-projects",
      label: "Skills vs Projects",
      body: "Projects cluster related chats. Skills carry judgment, and they stack. Three Skills (say, presentation creation plus brand voice plus an adoption playbook) can run on the same answer. Use Projects as folders for chat organisation, encode the actual workflow in Skills.",
    },
    {
      id: "creating-a-skill",
      label: "Creating a Skill",
      body: "Start with /skillcreator. Bring examples, documents, and a short narration of how you think about the task. Claude detects the pattern from the inputs and drafts the Skill back to you.",
    },
    {
      id: "sharing",
      label: "Sharing Skills",
      body: "Skills can be shared company-wide. Today there is a display bug that hides some shared Skills, and there is no clean collaboration flow for editing a Skill together. Both are known and on the roadmap.",
    },
  ],
};

/* ─── Section 6 · Skills at Loop ─────────────────────────────────── */

export const claudeSkillsAtLoopSection: ClaudeSkillsAtLoopSection = {
  id: "claude-skills-at-loop",
  ariaLabel: "Claude Skills already in use at Loop",
  title: "What\u2019s already running",
  titleEm: "inside Loop\u2019s Claude",
  titleAfter: ".",
  sub: "Five Skills already encode a way of working across legal, brand, marketing, and adoption. They show up in the chats the team is having today.",
  skills: [
    {
      id: "loop-legal-risk",
      title: "Loop Legal Risk",
      owner: "by Olga",
      body: "Reads a draft, a clause, or a NDA and flags risk against the way Loop\u2019s legal team thinks.",
    },
    {
      id: "founder-voice",
      title: "Founder Voice",
      owner: "by Serrazo, Martin & Dimitri",
      body: "The founders\u2019 written voice encoded. Drafts emails, posts, and statements that land as them, not as Claude.",
    },
    {
      id: "creating-presentations",
      title: "Creating Presentations",
      owner: "",
      body: "Turns a brief into a deck with a clear arc and slide rhythm, ready to drop into .pptx.",
    },
    {
      id: "tone-of-voice",
      title: "Tone of Voice",
      owner: "for paid social, Amazon, marketplaces, CRM",
      body: "Loop\u2019s register for each surface, so copy lands as Loop wherever it shows up.",
    },
    {
      id: "ai-adoption-strategy",
      title: "AI Adoption Strategy",
      owner: "",
      body: "Encodes the way Loop runs the AI program: how to read a team, where to start, what to encode next.",
    },
  ],
  footnote:
    "These sit alongside the fifteen Skills shown earlier on this page. Same shape, same contract, different teams.",
};

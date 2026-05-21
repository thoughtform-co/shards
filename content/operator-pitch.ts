/**
 * Google-facing pitch copy for `/pitch`.
 *
 * Voice: Vince + Google co-program. Vince is a brand-side AI operator
 * who embeds inside brand teams and turns how they work into Google
 * Skills running on Gemini, Workspace, and the Gemini Enterprise Agent
 * Platform. Loop Earplugs is the named production proof. The page is
 * used by Google AMs / partnerships to forward to brand clients
 * considering a workshop engagement.
 */

import type { ApproachStep, CaseProject, CtaAction } from "./operator";
import {
  cases as baseCases,
  casesSection as baseCasesSection,
  enginePatternSection as baseEnginePattern,
  functionImpactSection as baseFunctionImpact,
} from "./operator";

export const meta = {
  brandLeft: "Aether",
  brandSub: "Skills workshops with Google",
  status: "Workshops \u00b7 Skills \u00b7 Gemini \u00b7 Workspace",
  links: [
    { id: "product", label: "Product", href: "#substrate-map" },
    { id: "proof", label: "Proof", href: "#engine-pattern" },
    { id: "vision", label: "Vision", href: "#vision" },
    { id: "approach", label: "Approach", href: "#approach" },
    { id: "cases", label: "Cases", href: "#cases" },
    { id: "team", label: "Program", href: "#team-shape" },
  ],
  cta: { label: "Book the workshop", href: "#cta" },
} as const;

export const hero = {
  eyebrow: "Skills workshops \u00b7 powered by Google",
  titleLines: [
    "Encode how your team works.",
    { em: "Into the Google stack." },
  ] as const,
  lede: [
    "A four-week embedded program that turns how a team actually works into Google Skills, ships running surfaces on Gemini and Workspace, and hands the team a substrate they own.",
  ] as const,
  actions: [
    { id: "book", label: "Book a workshop", href: "#cta", primary: true },
    { id: "proof", label: "See the proof", href: "#engine-pattern" },
  ] as const,
  meta: [
    { v: "21", k: "days to live function" },
    { v: "13 / 22", k: "Loop workshops shipped" },
    { v: "4", k: "production programs" },
  ] as const,
  rightLockup: {
    mark: "Aether",
    sub: "Skills workshops with Google",
    badge: "Co-program",
    programs: [
      "Briefing intelligence",
      "Creative canvas",
      "Localization pipeline",
      "Program orchestration",
    ] as const,
    foot: "Four production programs at Loop. Same shape, on your stack, inside your team.",
  },
  productCard: {
    eyebrow: "Operating model",
    statusLabel: "Live",
    foot: "Navigate the workflow \u00b7 Encode the judgment \u00b7 Build the headless capability",
  },
} as const;

export const diagnosisSection = {
  label: "Diagnosis",
  title: "You have the know-how,",
  titleEm: "but it doesn't compound.",
  sub:
    "When the layer is missing, the work doesn't compound. Every team solves the same problem alone, every month.",
  useCases: [
    {
      id: "contract-review",
      tag: "Legal",
      tone: "violet" as const,
      title: "Every contract still waits on one person to read it.",
      body:
        "Counsel knows which clauses are routine and which need a flag. That judgment isn't written down anywhere, so every NDA, MSA, and DPA queues up behind one set of eyes.",
    },
    {
      id: "campaign-briefs",
      tag: "Marketing",
      tone: "gold" as const,
      title: "Every campaign brief gets rebuilt from scratch.",
      body:
        "Brand voice, claim norms, and audience register live in a PDF, a Slack channel, and the brand lead's head. AI starts from zero every cycle because the team's actual operating principles are nowhere it can read.",
    },
    {
      id: "variance-commentary",
      tag: "Finance",
      tone: "sage" as const,
      title: "Monthly reporting starts from a blank page every cycle.",
      body:
        "Variance commentary, board narrative, and management updates follow the same shape and voice every cycle. None of it is encoded, so analysts rewrite the same sentences month after month.",
    },
    {
      id: "ticket-triage",
      tag: "Customer Ops",
      tone: "slate" as const,
      title: "Tickets get triaged and scored by hand every week.",
      body:
        "The quality scorecard, the fraud signals, and the escalation rules live across a deck, a wiki, and one team lead's experience. Volume scales but the judgment doesn't.",
    },
  ],
  gap: {
    eyebrow: "Shared gap",
    title: "Four teams. The same missing layer.",
  },
};

export const visionSection = {
  title: "This is the engine",
  titleEm: "running it.",
  titleAfter: "",
  centerLabel: "Intelligence Layer",
  centerFiles: [
    "how-teams-work.md",
    "go-to-market.skill",
    "weekly-standup-transcript.txt",
  ],
  orbits: [
    { id: "navigate", label: "Navigate", ring: "outer" },
    { id: "encode", label: "Encode", ring: "middle" },
    { id: "build", label: "Build", ring: "inner" },
  ] as const,
  satellite: { id: "headless", label: "Headless" },
  caption:
    "Good adoption is encoding. Encoding compounds into headless automation. Each cycle hands the next team a stronger substrate.",
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
        sub: "A bit of both. Trained on us, but not like us. A new paradigm that training decks do not teach you how to navigate.",
        highlight: true,
      },
      {
        id: "collab",
        label: "Collaborator",
        title: "Interprets intent",
        sub: "Opinionated. Brainstorms with you, challenges your ideas, just listens when you vent.",
      },
    ],
    foot: "Before AI can understand how your teams work, you have to learn how to navigate it.",
  },
} as const;

export const substrateMapSection = {
  title: "The solution is",
  titleEm: "an intelligence layer.",
  body:
    "An operating layer between how teams work and what generative AI does. Encoded once as Skills. Inherited by Gemini, Chat, Sheets, and Slack — the surfaces people already use.",
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
      items: [
        { icon: "G", name: "Gemini" },
        { icon: "S", name: "Slack" },
        { icon: "◐", name: "Web app" },
        { icon: "{ }", name: "REST" },
        { icon: "▦", name: "Sheets" },
        { icon: "A", name: "Agents" },
      ],
    },
  },
  connectors: { left: "Reads from", right: "Exposed as" },
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
  closing: "Work stays in place. Substrate carries the judgment. Surfaces inherit it.",
} as const;

export const surfacePickSection = {
  title: "Pick the surface",
  titleEm: "that fits the workflow.",
  body:
    "Same engine, scaled across the team. Each role reaches it on the surface that fits — developers through MCP, analysts in Sheets, comms in Gemini, PMs in Slack, marketers in team-built web apps, ops in agents. Three ways in: MCP, API, CLI.",
  cardLabel: "Three ways in",
  flow: "Source → Surface",
  interfaces: [
    {
      id: "mcp",
      label: "MCP",
      sublabel: "Gemini · Workspace",
      icon: "◇",
      recommended: true,
      detail:
        "The AI-native protocol. Drop the engine into any MCP-aware client and the Skill context comes with it — Gemini Code Assist, Chat, and internal copilots.",
    },
    {
      id: "api",
      label: "API",
      sublabel: "REST · server-to-server",
      icon: "{ }",
      recommended: false,
      detail:
        "Same engine, called from a script, an internal tool, or any automation. No chat UI required.",
    },
    {
      id: "cli",
      label: "CLI",
      sublabel: "curl from your terminal",
      icon: "$_",
      recommended: false,
      detail:
        "One-liner from the shell. Batch runs, quick checks, cron jobs that need to call the engine without a UI.",
    },
  ],
  surfacesLabel: "Where it lands",
  roleSurfaces: [
    {
      role: "Developer",
      icon: "◇",
      surface: "MCP",
      note: "repo-aware assist",
    },
    {
      role: "PM",
      icon: "#",
      surface: "Slack",
      note: "where the team already lives",
    },
    {
      role: "Analyst",
      icon: "▦",
      surface: "Sheets",
      note: "tabular answers",
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
  ],
  closing: "Build once → scale through surfaces → cohort inherits the capability",
} as const;

export const signalSection = {
  id: "signal",
  eyebrow: "The signal",
  title: "Brands are coming",
  titleEm: "for the layer.",
  titleAfter: "",
  sub: "Mars, Valeo, GE Appliances, Docusign \u2014 global brands are landing Gemini Enterprise across their workforce. The substrate is open. The platform is governed. The pattern is repeatable, and we run it inside your team.",
  masthead: {
    name: "The Skills Beat",
    issue: "VOL. I \u00b7 NO. 1",
    track: "BRANDS \u00b7 GEMINI \u00b7 WORKSPACE",
    date: "MAY 2026",
  },
  /* Four cards build the brand-side adoption argument:
     1. Format (Google Skills) - the open substrate workshops produce.
     2. Platform (Gemini Enterprise Agent Platform) - the runtime brands deploy onto.
     3. Brand adoption (Mars) - global consumer brand on Gemini Enterprise.
     4. Practitioner pattern (Stripe FDE Marketing) - brands hiring this role inside marketing. */
  cards: [
    {
      id: "google-workspace" as const,
      thumb: {
        mark: "GOOGLE",
        tag: "Open format \u00b7 Skills",
        corner: "2026",
      },
      kicker: "Repository \u00b7 google/skills",
      headline: "An open Skill format brands can own.",
      dek: [
        { text: "Google Skills", strong: true },
        {
          text: " ships as an open repository. `npx skills add google/skills`. The substrate every workshop produces \u2014 portable, versioned, model-agnostic.",
        },
      ],
      byline: { source: "github.com/google/skills", date: "Mar 2026" },
      href: "https://github.com/google/skills",
    },
    {
      id: "vertex-ai" as const,
      thumb: {
        mark: "GEMINI",
        tag: "Enterprise Agent Platform",
        corner: "Apr 2026",
      },
      kicker: "Platform \u00b7 Apr 2026",
      headline: "Vertex AI is now the Gemini Enterprise Agent Platform.",
      dek: [
        { text: "Build, scale, govern, optimise.", strong: true },
        {
          text: " Memory Bank, Agent Registry, Agent Gateway. 200+ models. The runtime brands deploy onto when the workshop ships.",
        },
      ],
      byline: { source: "cloud.google.com", date: "Apr 2026" },
      href: "https://cloud.google.com/products/gemini-enterprise-agent-platform",
    },
    {
      id: "mars" as const,
      thumb: {
        mark: "MARS",
        tag: "Consumer goods \u00b7 global",
        corner: "2026",
      },
      kicker: "Adoption \u00b7 Mars + Google Cloud",
      headline: "Gemini Enterprise as the primary AI operating system.",
      dek: [
        { text: "Petcare, Snacking, Food and Nutrition.", strong: true },
        {
          text: " The global Mars workforce on one Gemini layer \u2014 unified enterprise search, agentic workflows, one substrate inherited everywhere.",
        },
      ],
      byline: { source: "PR Newswire", date: "Nov 2025" },
      href: "https://www.prnewswire.com/news-releases/mars-partners-with-google-cloud-to-empower-global-associates-with-gemini-enterprise-302749614.html",
    },
    {
      id: "stripe" as const,
      thumb: {
        mark: "/stripe",
        tag: "Job listing \u00b7 Marketing",
        corner: "2026",
      },
      kicker: "Practitioner \u00b7 Forward Deployed",
      headline: "Brands are hiring this role inside marketing.",
      dek: [
        { text: "5+ years AI, $132\u2013198k.", strong: true },
        {
          text: " Stripe's Forward Deployed AI Accelerator embeds an operator inside marketing. Success measured in permanently transformed processes \u2014 the shape your team will recognise.",
        },
      ],
      byline: { source: "biztechweekly.com", date: "2026" },
      href: "https://biztechweekly.com/stripe-launches-forward-deployed-ai-accelerator-role-to-drive-ai-integration-in-marketing-teams/",
    },
  ],
  /* Optional pivot beat between Signal and the engine-pattern carousel.
     Lands the "we run it inside your team" claim that Loop's receipts
     then back up. */
  closing: {
    lead: "Brands are running this.",
    accent: "We help your team be next.",
  },
};

/* Engine pattern - the proof we bring into Google's workshops.
   Reuses Loop's real cards verbatim from `content/operator.ts` so the
   named owners and receipts stay intact (those are the actual proof);
   only the team labels and the queued breadth list flip to universal
   function names so a Google client (Mars, Valeo, GE Appliances,
   Docusign, ATB Financial) recognises their own org chart on the page. */

/* Loop's internal team naming -> universal function names. Keep the
   short, calm form a brand-side reader scans without needing context
   ("Customer Operations" not "Warehousing & Customer Ops"; "Insights"
   not "Strategic Insights"). When Loop spins up a new team that runs a
   workshop, add the row here. */
const pitchTeamLabels: Record<string, string> = {
  "Product Engineering": "Engineering",
  "Warehousing & Customer Ops": "Customer Operations",
  "Product Design / UX": "Product Design",
  "Legal": "Legal",
  "Finance / Accounting": "Finance",
  "Strategic Insights": "Insights",
  "People Ops": "People",
  "Program Mgmt & Product": "Program Management",
  "Brand & Partnerships": "Brand",
  "Talent Acquisition": "Talent",
};

/* Breadth card queue. Loop's internal queue includes consumer-product
   functions (Manufacturing, Marketplaces, Paid Search) that don't read
   universally; the pitch queue trades them for functions present in
   every brand. */
const pitchQueuedLabels: readonly string[] = [
  "IT",
  "Procurement",
  "Customer Success",
  "Product Marketing",
  "HR Operations",
  "Communications",
  "Executive Office",
  "Performance Marketing",
];

export const enginePatternSection = {
  id: "engine-pattern",
  ariaLabel:
    "Loop Earplugs proof: ten teams converged on the same Skills architecture in 21 days",
  header: {
    title: "Loop Earplugs is",
    titleEm: "running it today.",
    sub: "The proof we bring into your workshops. Ten teams converged on the Skills pattern in 21 days. Real owners. Real receipts. The same shape ships inside your team.",
  },
  cards: baseEnginePattern.cards.map((card) =>
    card.kind === "team"
      ? { ...card, team: pitchTeamLabels[card.team] ?? card.team }
      : { ...card, queued: pitchQueuedLabels },
  ),
};

/* Function impact - reframed as Loop receipts a Google client can read.
   Same lanes, same encoded-loop ticker; the title and label flip from
   "now it needs to scale" (internal Loop voice) to "here is what 21
   days produced inside Loop" (proof voice). The encoded-loop rows still
   get the Claude -> Gemini and Loop -> the brand replacements so the
   ticker reads as portable evidence rather than Loop-internal slang. */
export const functionImpactSection = {
  ...baseFunctionImpact,
  label: "Inside Loop \u00b7 workshop program receipts",
  title: "Inside Loop, the function",
  titleEm: "scaled in 21 days.",
  titleAfter: "",
  sub:
    "Three weeks from zero enterprise contract to live workshops, Skills, and named owners. The same shape ships inside your team.",
  composition:
    "Google ships the platform. The workshops embed the practice. Stewards inside your team carry it forward.",
  encodedLoops: {
    ...baseFunctionImpact.encodedLoops,
    rows: baseFunctionImpact.encodedLoops.rows.map((row) => ({
      ...row,
      text: row.text
        .replace(/\bClaude\b/g, "Gemini")
        .replace(/Olga/g, "counsel")
        .replace(/Loop\u2019s/g, "the brand's")
        .replace(/against Loop\u2019s brand system/g, "against the brand system")
        .replace(/Loop templates/g, "approved templates"),
    })),
  },
  lanes: baseFunctionImpact.lanes.map((lane) =>
    lane.id === "build"
      ? {
          ...lane,
          summary:
            "Briefing intelligence, creative canvas, localization pipeline, and program orchestration \u2014 four headless tools shipped from the same Skills substrate. The same shape ships into your team.",
        }
      : lane.id === "mandate"
        ? {
            ...lane,
            summary:
              "Function proven inside Loop. Workshop program now offered to Google's brand clients on the same operating model.",
          }
        : lane,
  ),
};

export const approachSection = {
  title: "The AI flywheel",
  titleEm: "as Google Skills.",
  caption:
    "Three weeks per team. Workshops on the Google stack. Skills the team owns. Surfaces on Gemini, Workspace, and the Gemini Enterprise Agent Platform. Three motions, one operator at a time, compounding into one substrate every surface inherits.",
} as const;

export const approachOutcome = {
  eyebrow: "Outcome",
  headline: "The teams we embed with run the program without us.",
  body:
    "Navigate gives them the mental model. Encode gives them the substrate. Build gives them the tools. Moving between teams is the unlock — I see which patterns scale, encode them, and the next team starts further along than the last.",
  achievements: [
    {
      n: "01",
      label: "AI default",
      body: "Most creative briefings ship with AI assistance — without needing me in the room every time.",
    },
    {
      n: "02",
      label: "Custom engine",
      body: "A custom image and video generation canvas, built to remove friction so creative keeps producing high-performing assets at scale.",
    },
    {
      n: "03",
      label: "Team handoff",
      body: "Localization managers now product-manage the dubbing pipeline they co-built.",
    },
    {
      n: "04",
      label: "Headless layer",
      body: "Strategy methodology exposed headlessly so performance teams build their own dashboards on top.",
    },
  ],
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
        "Navigation teaches teams how to work and think with AI inside their real work. One 45-minute session per team is the ignition: people leave briefing AI like a colleague who is smart but missing context, and start using it inside the workflow the same week. Stewards inside the team carry the practice forward, and the first candidate Skill from each session becomes the seed Encode turns into substrate.",
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
            "45-minute workshop per team. We run each answer through Gemini, see where it works and where it breaks, build one Skill before the session ends.",
            "That single session is the ignition: people leave with a working mental model and start briefing AI like a colleague the same week.",
            "The session gets transcribed into a doc the team owns and updates.",
            "Stewards inside the team take it from there. Bi-weekly showcases let other teams copy what works.",
          ],
        },
        {
          heading: "What it produced in cohort",
          bullets: [
            "Enterprise assistants in daily production across marketing and G&A.",
            "Full rollout mandate aligned with legal, IT, and security.",
            "Scalable plan across many teams, built to make every cohort member self-sufficient.",
            "Skills plus automation surfacing weekly progress and wins.",
          ],
          note: "The fluency transfers across vendors — the motion is vendor-neutral.",
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
    body:
      "Once a team knows what they want AI to take on, you encode how they actually do it: brand nuances, standards, review process — written down so any agent can inherit them. Dozens of workflows now live as substrate: brand voice, claim gates, marketplace copy. A teammate can read it. An agent can run on it. Models change. The encoded layer carries forward.",
    signal: { k: "Outcome", v: "A Skill the team owns. Versioned. Headless." },
    visual: {
      kind: "substrate",
      sub: "Encoded substrate · headless",
      inputs: ["AI intuition", "Workflow brief"],
      layers: [
        { tag: "Rules", name: "How the team decides", meta: "12 entries" },
        { tag: "Examples", name: "What good looks like", meta: "38 artifacts" },
        { tag: "Sources", name: "Data it can read", meta: "3 connectors" },
        { tag: "Loops", name: "Who confirms it", meta: "2 gates" },
      ],
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
            "Three degrees of freedom — what to lock, what to guide, what to leave open.",
          ],
        },
        {
          heading: "Encoded in production",
          bullets: [
            "Ten-plus reusable Skills shipped across creative, performance, CRM, e-commerce, people, legal, and UGC.",
            "Cohort members teach each other how to use them. Non-technical members build their own automations in Workspace.",
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
      "With substrate in place, AI collapses the distance between knowing the problem and shipping the tool. The work starts in a working session: I listen for the frustration, turn the transcript into a user story, then either build the interface around it or expose the logic headlessly through MCP. Then I hand it to the person closest to the work. Nobody understands their domain better than they do.",
    signal: { k: "Outcome", v: "A thin running surface the team uses daily." },
    visual: {
      kind: "engine",
      sub: "Headless first · every surface inherits",
      inputs: ["A versioned Skill"],
      surfaces: [
        { icon: "G", name: "Gemini", verb: "Chat · Workspace" },
        { icon: "{ }", name: "API", verb: "MCP · REST" },
        { icon: "◐", name: "Agent", verb: "Scheduled · autonomous" },
        { icon: "⤴", name: "In-tool", verb: "Slack · Sheets · Drive" },
      ],
      outputs: ["A running surface the team uses daily"],
    },
    modal: {
      eyebrow: "03 · Build",
      title: "What building looks like",
      titleEm: "from prototype to production.",
      lede:
        "Rapid prototypes within days. Hardened to production over the following weeks. Live next to the work in Slack, Sheets, Drive, and team web apps. Same engine exposed via REST, MCP, scheduled agents, in-tool buttons. The interface is one face of many.",
      meta: [
        { k: "TEMPO", v: "Days to demo · weeks to harden" },
        { k: "SHAPE", v: "Engine + surfaces · headless first" },
        { k: "STACK", v: "Next.js · GCP · Vertex AI · MCP" },
      ],
      sections: [
        {
          heading: "How it ships",
          bullets: [
            "Day-one prototype on the team's actual work. No deck-first detours.",
            "Operator builds and hardens in the same loop. No handoff between prototype and production.",
            "Headless API + MCP server from day one so the engine isn't tied to one UI.",
            "Token allowlists, scopes, audit log, durable rate buckets — policy lives in one verifier.",
          ],
        },
        {
          heading: "What it produced in production",
          bullets: [
            "Creative image and video suite replaced scattered tools. Campaigns run through one opinionated canvas.",
            "Program orchestration moves briefings from work management into design tools every week.",
            "Briefing intelligence reshapes how strategy plans each cycle.",
            "Localization dubbing pipeline in pilot and expanding into broader content.",
          ],
        },
      ],
      signal: "Building is the unlock. The flywheel that follows is what keeps the team running without me.",
    },
  },
];

/* Cases - Loop's four production programs reused verbatim from
   `content/operator.ts` so the named codenames (Mímir / Vesper /
   Babylon / Heimdall), screenshots, and walkthroughs all come back.
   Loop is openly the proof brand on this page; only the section lede
   shifts to read as "workshop outputs we bring into your engagement". */
export const casesSection = {
  ...baseCasesSection,
  lede:
    "These are the four production programs running inside Loop today. Each one is a workshop output: a workflow encoded as a Skill, exposed headlessly, surfaced where the team already lives. Same shape ships inside your team.",
};

export const cases: CaseProject[] = baseCases;

export const softwareForFewSection = {
  title: "Why",
  titleEm: "build custom tools?",
  body:
    "Most bottlenecks stay unsolved because off-the-shelf SaaS is too generic and bespoke agency builds do not pay back for a problem-for-few. Models are now good enough that teams can ship their own thin surfaces — which is what we have been doing across marketing and adjacent functions, encoded as Skills and headless APIs.",
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
  ],
  feynman: {
    quote: "\u201CWhat I cannot build, I do not understand.\u201D",
    attribution: "Richard Feynman",
  },
} as const;

export const headlessShiftSection = {
  title: "Software is going",
  titleEm: "headless.",
  body:
    "Salesforce shipped Headless 360. Google ships Workspace add-ons, Chat apps, and the Gemini Enterprise Agent Platform on the same APIs marketing already trusts. The same shape applies one layer up: encode voice, claims, and localization once, and every surface \u2014 Gemini, Workspace, Slack, agents \u2014 inherits the same judgment.",
  bodyStrong:
    "We bring this pattern into your team on Google's stack.",
  bodyStripe: "",
  actions: [{ id: "headless", label: "See the overview", href: "#substrate-map" }],
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
      ],
    },
    connector: "Exposed headlessly",
    interface: {
      pill: "Build",
      title: "Headless interface",
      tabs: [
        { id: "mcp", label: "MCP", note: "Default", active: true },
        { id: "api", label: "API" },
        { id: "cli", label: "CLI" },
      ],
      snippetLabel: "Add as MCP server",
      snippetUrl: "https://<engine>/api/mcp",
      surfacesLabel: "All surfaces",
      surfaces: [
        { id: "gemini", icon: "G", name: "Gemini" },
        { id: "slack", icon: "#", name: "Slack" },
        { id: "web", icon: "◐", name: "Web app" },
        { id: "rest", icon: "{ }", name: "REST" },
        { id: "sheets", icon: "▦", name: "Sheets" },
        { id: "agents", icon: "A", name: "Agents" },
      ],
    },
    foot: "One token. Six surfaces. Same engine.",
  },
} as const;

export const teamShapeSection = {
  id: "team-shape",
  eyebrow: "Program shape",
  title: "Four weeks per team.",
  titleEm: "One Skill they own. One surface they use.",
  body: [
    "Each engagement is a four-week embedded run. Week 1 Navigate, weeks 2\u20133 Encode, week 4 Build and handoff. The workshop is the ignition; the substrate is the compounding asset.",
    "Stewards inside the team take the practice from there. The catalyst keeps moving between teams; Google ships the platform underneath. Together they hold the flywheel without becoming a bottleneck.",
  ],
  composition: {
    headEyebrow: "Co-program",
    headBadge: "Two partners",
    seats: [
      {
        id: "catalyst",
        role: "01 \u00b7 Forward-Deployed Catalyst",
        codename: "Cata",
        codenameEm: "lyst",
        name: "Vince Buyssens",
        team: "Brand-side AI operator \u00b7 18 months in production",
        summary:
          "Embeds inside the team, navigates the real work, encodes how the team decides into a Google Skill they own, hands back the running system.",
        unlocks: [
          "Workshop flywheel running across departments",
          "An encoded adoption Skill the next team inherits",
          "Pattern recognition across teams \u2192 the next Skill the cohort runs on",
        ],
      },
      {
        id: "platform",
        role: "02 \u00b7 Platform Partner",
        codename: "Goog",
        codenameEm: "le",
        name: "Google Cloud",
        team: "Skills \u00b7 Gemini \u00b7 Workspace \u00b7 Agent Platform",
        summary:
          "Provides the substrate format (Skills), the runtime (Gemini Enterprise Agent Platform), and the surfaces (Gemini, Workspace, Chat) the team already uses.",
        unlocks: [
          "Open Skill format the team owns and versions",
          "Governed runtime with Memory Bank, Agent Registry, Agent Gateway",
          "Surfaces inherit the Skill on day one \u2014 Gemini, Sheets, Slides, Chat",
        ],
      },
    ],
    cadenceLabel: "How the workshop runs",
    cadence: [
      { k: "Week 1", v: "Navigate \u2014 inside the workflow with the team." },
      { k: "Weeks 2\u20133", v: "Encode \u2014 the Skill drafted in the room, ratified by review." },
      { k: "Week 4", v: "Build \u2014 the surface ships, stewards take it from there." },
    ],
    foot: "Stewards inside the team carry the practice forward. Each engagement leaves a Skill behind.",
  },
  ladder: {
    label: "Levels of engagement",
    rungs: [
      {
        id: "pilot",
        tag: "01 \u00b7 Pilot",
        title: "One team. One workflow. Four weeks.",
        body: "The fastest way in. We pick the loudest bottleneck, run the four-week shape, leave behind a Skill the team owns and a running surface on the Google stack.",
        marker: "Start here",
      },
      {
        id: "cohort",
        tag: "02 \u00b7 Cohort",
        title: "Five teams in parallel over a quarter.",
        body: "Once the pilot lands, run five teams in parallel. Stewards from the pilot carry the practice; the cohort produces a portfolio of Skills compounding on one substrate.",
      },
      {
        id: "programmatic",
        tag: "03 \u00b7 Programmatic",
        title: "Ongoing program with stewards inside the brand.",
        body: "An always-on engagement: new teams onboarded each quarter, the catalyst rotating between them, Google's platform partner team supporting the runtime and governance.",
      },
    ],
    foot: "Each rung is one quarter ahead of the last. Pilot first, then compound.",
  },
  mandate: {
    label: "What the program produces",
    clauses: [
      "Open Google Skills the team owns, versioned in their own repo.",
      "Running surfaces on Gemini, Workspace, Chat \u2014 inherited on day one.",
      "Stewards inside the team trained to extend the Skill library themselves.",
    ],
  },
};

export const ctaSection: {
  eyebrow: string;
  titleEm: string;
  body: readonly string[];
  fine: string;
  decisions: {
    id: string;
    tag: string;
    title: string;
    body: string;
  }[];
  actions: CtaAction[];
} = {
  eyebrow: "Book the workshop",
  titleEm: "Pick the team. Pick the workflow. Ship the Skill.",
  body: [
    "Three weeks ago Loop had no enterprise contract. Today the function exists with Skills shipped across departments. The same shape, on your stack, inside your team.",
  ],
  fine: "Antwerp \u00b7 CET. Four weeks per team. One Skill, one surface, one steward.",
  decisions: [
    {
      id: "team",
      tag: "01 \u00b7 Team",
      title: "Pick the team.",
      body: "Marketing, Legal, Finance, Ops \u2014 wherever the bottleneck is loudest.",
    },
    {
      id: "workflow",
      tag: "02 \u00b7 Workflow",
      title: "Pick the workflow.",
      body: "The cycle that gets rebuilt every month. We encode it into a Skill the team owns.",
    },
    {
      id: "workshop",
      tag: "03 \u00b7 Workshop",
      title: "Book the workshop.",
      body: "Four weeks, embedded. Week 1 Navigate, weeks 2\u20133 Encode, week 4 Build and handoff.",
    },
  ],
  actions: [
    { id: "discovery", kind: "primary" as const, label: "Book a discovery call", href: "#cta" },
    { id: "format", kind: "primary" as const, label: "See the workshop format", href: "#approach" },
    { id: "proof", kind: "ghost" as const, label: "Walk the Loop proof", href: "#cases" },
    { id: "model", kind: "ghost" as const, label: "Read the operating model", href: "#substrate-map" },
  ],
};

export const footer = {
  line: "Aether \u00b7 Skills workshops with Google",
  signature: "Vince Buyssens \u00b7 brand-side AI operator",
  studio: "Co-program with Google \u00b7 Antwerp",
} as const;

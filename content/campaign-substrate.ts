/*
 * Campaign substrate demo content.
 *
 * The pitch: Greg's campaign-management work is currently sketched as eight
 * specialised agents. The Aether move is to encode the campaign judgment once
 * and let every "agent" run as a checkpoint on the same engine.
 *
 * This file holds all copy and the synthetic case data. The interactive demo
 * runs deterministically against this object so the architecture is
 * inspectable; the numbers are illustrative, the shape is real.
 */

export type SkillBand = {
  id: string;
  label: string;
  freedom: "low" | "med" | "high";
  body: string;
  examples: string[];
};

export type SourceRow = {
  id: string;
  source: string;
  role: string;
  status: "primary" | "supporting" | "context";
};

export type AgentSurface = {
  id: string;
  label: string;
  inherits: string;
  ships: string;
};

export type DemoCheckId =
  | "completeness"
  | "audience"
  | "channel"
  | "claim"
  | "calendar"
  | "ownership";

export type DemoCheck = {
  id: DemoCheckId;
  label: string;
  description: string;
};

export type DemoVerdict = "pass" | "review" | "block";

export type DemoOutcome = {
  checkId: DemoCheckId;
  verdict: DemoVerdict;
  finding: string;
  evidence: string;
};

export type DemoBrief = {
  id: string;
  campaign: string;
  status: "Draft" | "In review" | "Studio-ready";
  market: string;
  channel: string;
  owner: string;
  ask: string;
  inputs: string[];
  outcomes: DemoOutcome[];
  verdict: DemoVerdict;
  patch?: string;
};

export type SurfaceMode = {
  id: string;
  surface: string;
  state: "live" | "next" | "contract";
  body: string;
};

export const hero = {
  eyebrow: "Demo · Campaign portfolio governance",
  titlePre: "Greg's eight campaign agents.",
  titleEm: "Refactored as one.",
  lede:
    "Greg wants one or two campaign managers to run the whole portfolio with AI support. His eight agent ideas share the same campaign judgment. Aether turns that judgment into one Skill with multiple checkpoints.",
  meta: [
    { key: "Use case", value: "Campaign portfolio governance" },
    { key: "Owner", value: "Greg · Marketing Operations" },
    { key: "Surfaces", value: "Monday · Slack · Claude · MCP" },
    { key: "Status", value: "v0.1 · Eval-driven" },
  ],
};

export const compressionSection = {
  eyebrow: "The compression",
  eyebrowTone: "violet" as const,
  title: "One Skill",
  titleEm: "under every checkpoint.",
  lede:
    "Brief review, channel checks, risk scans and recaps all reuse the same rules. The update happens once, then every surface inherits it.",
  before: {
    label: "Before · agent sprawl",
    cardTitle: "Eight separate prompts.",
    description:
      "Each agent is a separate prompt set. Logic drifts. Updates ship eight times.",
    rows: [
      "Outline agreement draft agent",
      "Channel requirements agent",
      "Creative brief review agent",
      "Risk level / bottleneck monitor",
      "Performance recap agent",
      "Studio readiness gate",
      "Campaign retrospective agent",
      "Stakeholder summary agent",
    ],
  },
  after: {
    label: "After · one Skill, many surfaces",
    cardTitle: "One Skill. Many surfaces.",
    description:
      "The instructions live in one Skill. The agents become checkpoints on it.",
    rows: [
      "Campaign-management Skill (this page)",
      "+ Monday checkpoint: outline agreement",
      "+ Monday checkpoint: channel requirements",
      "+ Slack workflow: brief review",
      "+ Slack alert: risk + bottleneck",
      "+ Slack digest: performance recap",
      "+ Studio gate: readiness",
      "+ Claude conversation: any of the above",
    ],
  },
};

export const skillSection = {
  eyebrow: "What the operating layer knows",
  eyebrowTone: "blue" as const,
  title: "Campaign judgment",
  titleEm: "in a reviewable file.",
  lede:
    "The Skill records how Loop's campaign managers work: vocabulary, judgment, source order, fixed rules and flexible choices.",
  filename: "campaign-management/SKILL.md",
};

export const skillBands: SkillBand[] = [
  {
    id: "locked",
    label: "LOCKED",
    freedom: "low",
    body: "Things that cannot drift. Compliance, claims, calendar truth, ownership.",
    examples: [
      "Performance claims must cite an approved source",
      "Studio handoff dates from Monday are canonical",
      "Stakeholder ownership comes from the org Skill",
      "No campaign launches without legal-reviewed claim list",
    ],
  },
  {
    id: "guided",
    label: "GUIDED",
    freedom: "med",
    body: "Things that vary by market or audience but follow Loop's playbook.",
    examples: [
      "Channel mix prioritisation by market",
      "Audience register: Sleep, Engage, Experience, Quiet",
      "Risk severity scoring from Freedom Framework",
      "Recap tone: warm, evidence-led, never adversarial",
    ],
  },
  {
    id: "open",
    label: "OPEN",
    freedom: "high",
    body: "Things the manager owns. The Skill defers to judgment here.",
    examples: [
      "Headlines, openers, narrative arc",
      "Stakeholder phrasing in retrospectives",
      "Which insights to surface in a recap",
      "Campaign metaphor and creative concept",
    ],
  },
];

export const sourceRows: SourceRow[] = [
  {
    id: "monday",
    source: "Monday · campaign board",
    role: "System of record · dates, owners, dependencies",
    status: "primary",
  },
  {
    id: "freedom",
    source: "Freedom Framework",
    role: "Risk severity scoring · escalation thresholds",
    status: "primary",
  },
  {
    id: "marketing-cal",
    source: "Marketing calendar",
    role: "Cadence · windows · seasonal context",
    status: "primary",
  },
  {
    id: "insights",
    source: "Insights hub",
    role: "Performance signals · prior recap memory",
    status: "supporting",
  },
  {
    id: "studio",
    source: "Studio readiness rules",
    role: "Brief completeness · creative gating criteria",
    status: "supporting",
  },
  {
    id: "industry",
    source: "Industry insight digest",
    role: "Trend context · competitive activity",
    status: "context",
  },
  {
    id: "council",
    source: "Creative prioritisation council",
    role: "Strategic weighting · portfolio fit",
    status: "context",
  },
];

export const harnessSection = {
  eyebrow: "How it runs on a brief",
  eyebrowTone: "violet" as const,
  title: "Six checks.",
  titleEm: "Pass. Review. Block.",
  lede:
    "When a brief moves from draft to studio, the harness reads it against the operating layer. Every check has a verdict and an evidence pointer. Nothing is opaque; patches to the Skill are queued the moment a check explains itself.",
};

export const demoChecks: DemoCheck[] = [
  {
    id: "completeness",
    label: "Completeness",
    description: "Every required field present. No silent gaps.",
  },
  {
    id: "audience",
    label: "Audience register",
    description: "Tone matches Sleep / Engage / Experience / Quiet.",
  },
  {
    id: "channel",
    label: "Channel fit",
    description: "Format and length match channel requirements per market.",
  },
  {
    id: "claim",
    label: "Claim policy",
    description: "Performance claims trace to approved source. No fresh assertions.",
  },
  {
    id: "calendar",
    label: "Calendar truth",
    description: "Dates, owners and dependencies align to Monday source of record.",
  },
  {
    id: "ownership",
    label: "Ownership",
    description: "Every workstream has a named owner and an escalation path.",
  },
];

export const demoBriefs: DemoBrief[] = [
  {
    id: "brief-1",
    campaign: "Engage · Q3 launch · DACH",
    status: "Draft",
    market: "DACH",
    channel: "Paid social + CRM",
    owner: "Hannah · Studio",
    ask: "Brief review before studio handoff. Claim language likely needs scrubbing.",
    inputs: [
      "Outline agreement v3 · Marketing",
      "Channel requirements · DACH paid social",
      "Three reference assets · CRM Q2",
      "Insights snapshot · Engage performance Q1–Q2",
    ],
    outcomes: [
      {
        checkId: "completeness",
        verdict: "pass",
        finding: "All required fields filled in.",
        evidence: "Monday board · campaign-23814.",
      },
      {
        checkId: "audience",
        verdict: "pass",
        finding: "Engage register held throughout.",
        evidence: "Skill band · Audience register.",
      },
      {
        checkId: "channel",
        verdict: "review",
        finding: "Caption length runs long for IG paid in DACH.",
        evidence: "Channel requirements · IG paid · DACH.",
      },
      {
        checkId: "claim",
        verdict: "block",
        finding: '"Industry-leading focus" claim has no approved source.',
        evidence: "Approved claim registry · 2026-04-22.",
      },
      {
        checkId: "calendar",
        verdict: "pass",
        finding: "Studio handoff date matches Monday board.",
        evidence: "Monday board · campaign-23814.",
      },
      {
        checkId: "ownership",
        verdict: "pass",
        finding: "Owner present, escalation to Britta on file.",
        evidence: "Org Skill · Marketing → Studio.",
      },
    ],
    verdict: "block",
    patch:
      "Claim catalogue updated: replace \"industry-leading focus\" with approved alternative or escalate to legal review.",
  },
  {
    id: "brief-2",
    campaign: "Sleep · Always-on · UK",
    status: "In review",
    market: "UK",
    channel: "Paid social",
    owner: "Lindsay · Studio",
    ask: "Risk and ownership audit before Monday board lock.",
    inputs: [
      "Outline agreement v2 · Marketing",
      "Channel requirements · UK paid social",
      "Always-on baseline · prior 90 days",
      "Insights snapshot · Sleep audience",
    ],
    outcomes: [
      {
        checkId: "completeness",
        verdict: "review",
        finding: "Caption variants placeholder. Three needed.",
        evidence: "Brief template v6 · row 12.",
      },
      {
        checkId: "audience",
        verdict: "pass",
        finding: "Sleep register clear and consistent.",
        evidence: "Skill band · Audience register.",
      },
      {
        checkId: "channel",
        verdict: "pass",
        finding: "Channel mix matches UK always-on standard.",
        evidence: "Channel requirements · UK paid social.",
      },
      {
        checkId: "claim",
        verdict: "pass",
        finding: "No new performance claims; existing claims sourced.",
        evidence: "Approved claim registry · 2026-04-22.",
      },
      {
        checkId: "calendar",
        verdict: "review",
        finding: "Two dependencies have no Monday counterpart.",
        evidence: "Monday board · campaign-21002.",
      },
      {
        checkId: "ownership",
        verdict: "pass",
        finding: "Owners and escalation paths complete.",
        evidence: "Org Skill · Marketing → Studio.",
      },
    ],
    verdict: "review",
    patch:
      "Surface the dependency gap on Monday board · campaign-21002 and request caption variants from Hannah.",
  },
  {
    id: "brief-3",
    campaign: "Quiet · Workplace · NL",
    status: "Studio-ready",
    market: "Netherlands",
    channel: "CRM + paid",
    owner: "Studio",
    ask: "Final pass before studio kickoff. Confirm the brief is intact.",
    inputs: [
      "Outline agreement v4 · Marketing",
      "Channel requirements · NL CRM + paid",
      "Insights snapshot · Quiet workplace audience",
      "Performance recap · prior workplace push",
    ],
    outcomes: [
      {
        checkId: "completeness",
        verdict: "pass",
        finding: "All required fields filled and reviewed.",
        evidence: "Brief template v6 · all rows green.",
      },
      {
        checkId: "audience",
        verdict: "pass",
        finding: "Quiet register held; tone aligns with workplace context.",
        evidence: "Skill band · Audience register.",
      },
      {
        checkId: "channel",
        verdict: "pass",
        finding: "Channel mix and asset specs match NL standard.",
        evidence: "Channel requirements · NL CRM + paid.",
      },
      {
        checkId: "claim",
        verdict: "pass",
        finding: "No new claims; existing claims sourced.",
        evidence: "Approved claim registry · 2026-04-22.",
      },
      {
        checkId: "calendar",
        verdict: "pass",
        finding: "Calendar, dependencies and owners aligned.",
        evidence: "Monday board · campaign-19842.",
      },
      {
        checkId: "ownership",
        verdict: "pass",
        finding: "Studio owner, retrospective owner, channel owner all named.",
        evidence: "Org Skill · Marketing → Studio.",
      },
    ],
    verdict: "pass",
  },
];

export const surfacesSection = {
  eyebrow: "Where it surfaces",
  eyebrowTone: "blue" as const,
  title: "Same engine.",
  titleEm: "Multiple sockets.",
  lede:
    "The eight agents Greg sketched out become checkpoints on the same engine. Each inherits the Skill, runs the harness, and writes back to the place the work actually happens.",
};

export const agentSurfaces: AgentSurface[] = [
  {
    id: "outline",
    label: "Outline agreement",
    inherits: "Skill bands · LOCKED + GUIDED",
    ships:
      "Drafts the outline agreement using the Marketing calendar + Insights hub + Council inputs. Surface: Monday checkpoint.",
  },
  {
    id: "channel",
    label: "Channel requirements",
    inherits: "Source: Channel requirements per market",
    ships:
      "Generates the channel matrix and flags gaps before brief sign-off. Surface: Monday checkpoint.",
  },
  {
    id: "review",
    label: "Brief review",
    inherits: "Six-check harness",
    ships:
      "Reviews the brief on draft. Pass / Review / Block per check. Surface: Slack workflow + Monday comment.",
  },
  {
    id: "risk",
    label: "Risk + bottleneck",
    inherits: "Source: Freedom Framework + Monday calendar",
    ships:
      "Reads the entire portfolio for missing items, late dates, dependency gaps. Surface: Slack alert.",
  },
  {
    id: "recap",
    label: "Performance recap",
    inherits: "Source: Insights hub + prior recap memory",
    ships:
      "Drafts post-campaign recaps grounded in performance signals and prior context. Surface: Monday + Slack digest.",
  },
];

export const surfaceModes: SurfaceMode[] = [
  {
    id: "monday",
    surface: "Monday · system of record",
    state: "live",
    body: "The campaign engine writes back into Monday via MCP. Status, dates, owners and risk levels stay in one place.",
  },
  {
    id: "slack",
    surface: "Slack · work signal",
    state: "live",
    body: "Slack notifications surface the harness verdicts. People see what needs action without scanning a board.",
  },
  {
    id: "claude",
    surface: "Claude · conversation",
    state: "live",
    body: "Anyone with a Claude seat can ask the engine directly. The Skill loads automatically; sources are cited.",
  },
  {
    id: "mcp",
    surface: "MCP · protocol",
    state: "contract",
    body: "Headless contract. Future agents (in Gemini, in Copilot Studio, on a custom UI) inherit the same engine the moment they ship.",
  },
];

export const handoffSection = {
  eyebrow: "What this leaves behind",
  eyebrowTone: "green" as const,
  title: "An engine that ages well.",
  titleEm: "Surfaces that can change.",
  lede:
    "The campaign judgment travels with the Skill. Models can change, interfaces can change, and new tools can join the stack. Product Design foundations and Mímir-led briefing intelligence can use the same shape.",
  bullets: [
    {
      title: "From eight prompts to one Skill.",
      body: "Same encoded judgment under every agent. Logic drifts in one place; updates ship once.",
    },
    {
      title: "From Monday-as-residence to Monday-as-record.",
      body: "Slack and Claude become surfaces. Monday stays the source of truth. The engine writes both ways.",
    },
    {
      title: "From custom code to portable Skills.",
      body: "Skills format is open. Claude today, Gemini tomorrow, MCP everywhere. Loop keeps its judgment portable.",
    },
  ],
};

export const footer = {
  line: "Aether · Campaign demo · Synthetic data, real architecture.",
  signature: "Demo built by Creative Technology · April 2026.",
};

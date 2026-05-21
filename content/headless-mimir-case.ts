/*
 * Mímir as the canonical headless-substrate proof case.
 *
 * Aether's homepage already names Mímir in the proof carousel. This file
 * is the long-form narrative: a deck-ready case study that turns Mímir
 * into the concrete evidence behind the headless thesis the homepage
 * argues. Use it for keynote slides, sales conversations, blog posts,
 * landing-page sub-routes, or anywhere a reader needs more than three
 * lines of proof carousel.
 *
 * The structure mirrors the Aether voice:
 *
 *   1. Frame   — collapse + headless framing, one paragraph.
 *   2. Before  — what the Loop team had before headless.
 *   3. After   — what the Loop team has now.
 *   4. Engine  — what is encoded, what is callable, what is gated.
 *   5. Surfaces — every place the same engine now serves.
 *   6. Lessons — durable patterns other teams can copy.
 *   7. CTA     — invitation back into the operator ladder.
 *
 * The arc is: stop building dashboards, start exposing substrate. The
 * dashboard becomes one face of many; the engine underneath compounds.
 */

export type HeadlessCaseFrame = {
  eyebrow: string;
  title: string;
  titleEm: string;
  lede: string;
};

export type HeadlessCaseAxis = {
  id: "before" | "after";
  label: string;
  title: string;
  body: string;
  bullets: string[];
};

export type HeadlessCaseEnginePart = {
  id: "encoded" | "callable" | "gated";
  label: string;
  title: string;
  body: string;
  examples: string[];
};

export type HeadlessCaseSurface = {
  id: string;
  name: string;
  verb: string;
  detail: string;
};

export type HeadlessCaseLesson = {
  id: string;
  title: string;
  body: string;
};

export type HeadlessCaseCTA = {
  label: string;
  href: string;
};

export const headlessMimirCaseFrame: HeadlessCaseFrame = {
  eyebrow: "Mímir · headless substrate",
  title: "The briefing engine moved out of the dashboard.",
  titleEm: "Same logic. Many surfaces. Substrate compounds.",
  lede:
    "Salesforce announced Headless 360. Stripe shipped agentic infrastructure. The pattern is the same in every case: the interface gets demoted, the substrate gets promoted. Mímir is Loop's first proof of that move. The briefing intelligence used to live behind one web app; now Claude, Cursor, Slack, ChatGPT, and the original UI all stand on the same engine. The model is the disposable part. The substrate is the asset.",
};

export const headlessMimirAxes: HeadlessCaseAxis[] = [
  {
    id: "before",
    label: "Before",
    title: "Intelligence locked behind one face.",
    body:
      "Mímir was a strong web app and a weak callable. Creative Strategy could open the dashboard, browse evidence, and generate briefs. Anyone who wanted to use that intelligence elsewhere — pulling Loop Ads numbers into a Slack thread, asking Claude to draft a campaign idea grounded in real evidence, letting Cursor query the knowledge graph during planning — had to recreate the work by hand.",
    bullets: [
      "One web UI, one cookie session.",
      "Every other surface relearned the domain.",
      "The substrate underneath was strong, but invisible.",
    ],
  },
  {
    id: "after",
    label: "After",
    title: "Intelligence callable by any model-powered surface.",
    body:
      "Mímir now exposes its engine over MCP and (soon) REST. The same evidence retrieval, Loop Ads aggregation, knowledge graph search, and skill-backed briefing generation that powers the dashboard powers everything else. Tokens are scoped, audited, and rate-limited. Generation lives behind a separate scope so retrieval credentials cannot trigger model cost. The dashboard becomes one face of many.",
    bullets: [
      "MCP server: tools/list, tools/call, JSON-RPC over HTTP.",
      "Bearer credentials with tool + scope allowlists.",
      "Durable per-credential rate limits and structured audit logs.",
    ],
  },
];

export const headlessMimirEngine: HeadlessCaseEnginePart[] = [
  {
    id: "encoded",
    label: "Encoded",
    title: "Substrate that compounds.",
    body:
      "Loop's creative judgment is encoded in two skills the engine inherits: the briefing strategy skill (graph-informed Loop briefs) and a new orchestration skill (how agents should call Mímir safely). The intelligence is reviewable, versioned, owned by the team — not trapped inside a frozen prompt or a vendor's chat product.",
    examples: [
      "loop-briefing-strategy: growth framework, Andromeda diversity, performance-creatives-101, guardrails.",
      "mimir-headless-orchestration: tool catalog, source authority, freedom bands, examples.",
      "Datasource registry: ad_performance, social_comments, untapped_use_cases, prior_briefings.",
    ],
  },
  {
    id: "callable",
    label: "Callable",
    title: "Read-mostly first, generation second.",
    body:
      "The Phase 1 surface is deliberately read-heavy: capability discovery, datasource listing, Loop Ads snapshots, creative reports, briefing context, knowledge graph search. Phase 2 layers generation on top, gated behind a separate scope. Every tool maps 1:1 to one engine function — the same function the web app calls — so the surfaces cannot drift.",
    examples: [
      "list_mimir_capabilities, list_briefing_datasources.",
      "get_loop_ads_snapshot, build_creative_report.",
      "get_briefing_context, search_mimir_insights.",
      "generate_briefing_sections (gated, generation scope).",
    ],
  },
  {
    id: "gated",
    label: "Gated",
    title: "Trust at the protocol level.",
    body:
      "Auth lives in one shared verifier used by every transport. Tokens are SHA-256 hashed, return plaintext only at issuance, and carry tool + scope allowlists plus per-credential rate limits. The verifier is the seam where REST and MCP cannot drift the way Vesper's REST/MCP model allowlist did.",
    examples: [
      "mim_live_<prefix>_<secret> bearer credentials.",
      "Per-tool + per-scope allowlist enforcement.",
      "Durable Postgres rate buckets (minute + day).",
      "Structured audit log: credential, surface, tool, latency, evidence count.",
    ],
  },
];

export const headlessMimirSurfaces: HeadlessCaseSurface[] = [
  {
    id: "claude-mcp",
    name: "Claude (MCP connector)",
    verb: "Pulls evidence-grounded answers into chat",
    detail:
      "Anthropic's MCP connector points at /api/mcp. Claude can call list_briefing_datasources, get_briefing_context, search_mimir_insights, and (with the right scope) generate validated briefing JSON.",
  },
  {
    id: "cursor",
    name: "Cursor",
    verb: "Reasons inside the codebase with live Loop context",
    detail:
      "A Cursor MCP entry exposes the same tools to whoever is editing the repo. Drafting Aether copy with real Loop Ads numbers, no tab-switching.",
  },
  {
    id: "chatgpt-gemini",
    name: "ChatGPT / Gemini",
    verb: "Same engine via OpenAI Apps SDK or Gemini agent",
    detail:
      "Any client that can talk MCP — or, later, the REST surface — can host the same tools. The substrate stays single-source.",
  },
  {
    id: "slack",
    name: "Slack",
    verb: "Daily snapshots and on-demand pulls",
    detail:
      "A bot calls get_loop_ads_snapshot every morning and posts the summary into the team channel. No new dashboard, no new login.",
  },
  {
    id: "ui",
    name: "Mímir web app",
    verb: "Still the highest-density surface",
    detail:
      "The original UI keeps its place — but as one face of many, calling the same engine. The dashboard becomes proof, not the product.",
  },
];

export const headlessMimirLessons: HeadlessCaseLesson[] = [
  {
    id: "engine-not-dashboard",
    title: "Build the engine, not the dashboard.",
    body:
      "The dashboard is a face. The engine is the asset. Once the engine is callable, every future surface inherits it. If you build the dashboard first, every new surface is a rewrite.",
  },
  {
    id: "policy-in-one-place",
    title: "Policy lives in one verifier, not at the edge of every transport.",
    body:
      "Vesper taught us: when REST and MCP each implement their own model allowlist, they drift. Mímir routes both surfaces through one verifier so allowlists, scopes, and rate limits cannot disagree.",
  },
  {
    id: "retrieval-before-generation",
    title: "Retrieval before generation. Always.",
    body:
      "The Phase 1 tools are read-mostly because evidence is the hard part. Generation is cheap once the substrate is encoded. Putting generation behind a separate scope keeps cost and authorship under intentional control.",
  },
  {
    id: "skill-and-mcp-pair",
    title: "Skills teach. MCP runs.",
    body:
      "A Claude API Skill cannot reliably fetch live data. An MCP server cannot teach an agent how to act well. The pair is the unit: the skill teaches when to call which tool; MCP supplies the live capability.",
  },
  {
    id: "model-disposable",
    title: "The model is the most disposable part of the stack.",
    body:
      "Every encoded judgment outlives the model that ran it. The substrate runs on whatever model the room can afford this quarter, on whatever architecture replaces transformers next year.",
  },
];

export const headlessMimirCta: HeadlessCaseCTA[] = [
  { label: "Read the headless thesis", href: "/#headless" },
  { label: "Bring an operator in", href: "#cta" },
];

export const headlessMimirCase = {
  frame: headlessMimirCaseFrame,
  axes: headlessMimirAxes,
  engine: headlessMimirEngine,
  surfaces: headlessMimirSurfaces,
  lessons: headlessMimirLessons,
  cta: headlessMimirCta,
} as const;

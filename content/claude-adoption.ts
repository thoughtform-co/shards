/*
 * Claude Adoption subpage â€” content module.
 *
 * Route-local content for `/claude-adoption`. Exec-tuned fork of
 * `/intelligence-layer-v3`. Forked so the Claude-only view can stay
 * lean without touching the canonical homepage, the v3 deck, or the
 * Claude Workshop v1 fork.
 *
 * Source of truth for the 10-team / 26-Skill block list is the
 * Senior Leadership Days brief (`loop_intelligence_layer_sld_brief.html`).
 * Card copy is ported verbatim; voice already matches project rules
 * (no em dashes, plain declaratives, no forced rule of three).
 *
 * Section composition lives in `app/claude-adoption/page.tsx`. This
 * file owns the copy + structural typing only.
 */

import { cases as operatorCases, type CaseProject } from "./operator";

import { caSkillsTeams } from "./claude-adoption-teams";

/* â”€â”€â”€ Shared types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export type CaPageMeta = {
  brandLeft: string;
  brandSub: string;
  status: string;
  links: readonly { id: string; label: string; href: string }[];
};

export type CaHeroLine = string | { em: string };

export type CaHeroAction = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
};

export type CaHero = {
  titleLines: readonly CaHeroLine[];
  lede: readonly string[];
  actions: readonly CaHeroAction[];
};

export type CaHeroQuote = {
  id: string;
  text: string;
  name: string;
  role: string;
};

export type CaHeroTicker = {
  ariaLabel: string;
  quotes: readonly CaHeroQuote[];
};

export type CaSparklinePoint = { date: string; value: number };

export type CaSparkline = {
  kicker: string;
  unit: string;
  currentValue: number;
  startValue: number;
  delta: string;
  windowLabel: string;
  series: readonly CaSparklinePoint[];
};

export type CaSparklineViewId = "onboarded" | "wau";

export type CaSparklineViews = {
  defaultView: CaSparklineViewId;
  views: Record<CaSparklineViewId, CaSparkline>;
};

export type CaUsageBar = { name: string; value: number };

export type CaUsageBars = {
  kicker: string;
  windowLabel: string;
  total?: string;
  bars: readonly CaUsageBar[];
};

export type CaMomentumStat = {
  id: string;
  label: string;
  value: string;
  /** Optional caption rendered under the value. Currently omitted
      on all four momentum tiles — kept on the type so a future tile
      can opt in without a type change. */
  sub?: string;
  featured?: boolean;
};

export type CaNumbersSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  sub: string;
  sparklineViews: CaSparklineViews;
  momentum: readonly CaMomentumStat[];
  connectors: CaUsageBars;
  skillsUsage: CaUsageBars;
  footnote: string;
};

export type CaFlywheelPhase = {
  id: "navigate" | "encode" | "build";
  label: string;
  body: string;
};

export type CaFlywheelSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  caption: string;
  phasesKicker: string;
  phases: readonly CaFlywheelPhase[];
};

export type CaApproachCard = {
  id: string;
  n: string;
  /** Verb naming this stage in the flywheel ("Navigate", "Encode",
      "Build"). Surfaces in the stage tag as `${n} ${motion}` so the
      pill reads e.g. "01 NAVIGATE" — the same triplet that names
      the per-team loop in the Flywheel chapter directly beneath
      this section. Pairing the verbs across the two sections turns
      Approach into the cross-team rendering of the same loop the
      Flywheel makes explicit. Optional so older consumers (if any)
      don't break; current Approach cards all set it. */
  motion?: string;
  label: string;
  body: string;
  receipt: string;
};

/** Decorative chrome that sits in the gutter between two stage
    cards in the Workshop Approach section. Carries the verb that
    names the action of going from one stage to the next ("One
    record", "One layer"), rendered as a short uppercase mono
    kicker above a hairline rail + Clay chevron. `from` / `to`
    reference `CaApproachCard.id`s so the wiring is explicit. */
export type CaApproachConnector = {
  from: string;
  to: string;
  verb: string;
};

export type CaWorkshopApproachSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  /** When true, the `<em>{titleEm}</em>` drops to a new line under
      `{title}` instead of running inline. Used on /claude-adoption
      so "team by team" sits as the rhyming second line of "How we
      run it,". */
  titleBreakBeforeEm?: boolean;
  sub: string;
  cards: readonly CaApproachCard[];
  /** Narrative chrome between stage cards. Ordered the same way as
      the gutters they sit in (first connector lives between
      `cards[0]` and `cards[1]`, etc.). Decorative — labels stay
      out of the assistive-tech narrative since the stage labels
      themselves already carry the sequence. */
  connectors?: readonly CaApproachConnector[];
  engineCta: {
    label: string;
    href: string;
    ariaLabel: string;
  };
  /** Optional secondary CTA that sits next to the Engine pill at
      the bottom of the section. External link styled in monday
      purple (Pantone 2725 C, the primary brand colour on
      brand-monday.com) via the `.aiop-engine-pattern__bridge--
      monday` modifier in claude-adoption.css. Used here to point
      at the workshop record board so an exec reader can drop into
      the source of truth without leaving the section. */
  mondayCta?: {
    label: string;
    href: string;
    ariaLabel: string;
  };
};

export type CaSkillStatus = "in-use" | "shipped" | "in-build" | "scoped";

export type CaSubstrate =
  | "judgment"
  | "voice"
  | "validation"
  | "stakeholder"
  | "pattern";

export type CaPhase = "navigate" | "encode" | "build";

export type CaAxis = "engine" | "team" | "phase";

export type CaSkillCard = {
  id: string;
  title: string;
  /** When true, the Skill card renders with a subtle sage-green
      highlight to signal that this Skill composes one of the Build-
      phase tool surfaces (Mímir / Vesper). The narrative move: when
      a reader scrolls through the Skills section, the green-tinted
      cards visibly cluster in the teams that sit closest to the
      Build chapter below, foreshadowing "these become the tools
      you're about to meet". Set on `cmf-file-generator`,
      `loop-packaging-system`, `loop-creative-strategy`, and
      `loop-paid-social` — the four real source cards behind
      Mímir's + Vesper's `Runs on` chips today. */
  feedsBuildPhase?: boolean;
  /** Mono-caps owner credit, e.g. "Olga Â· Vince". */
  owner: string;
  body: string;
  footnote: string;
  status: CaSkillStatus;
  /** Mono-caps pill label, e.g. "IN USE". */
  statusLabel: string;
  substrate?: CaSubstrate;
};

export type CaTeamBlock = {
  id: string;
  team: string;
  /** Workshop date for accessibility; not shown in header row. */
  workshopDate?: string;
  /** Adoption phase per v3 digest: Navigate / Encode / Build. */
  phase: CaPhase;
  cards: readonly CaSkillCard[];
  /** Curated tail when the doc lists more items than fit the grid. */
  moreTail?: string;
};


export type CaEngineSkillRef = {
  id: string;
  title: string;
  team: string;
};

export type CaSubstrateEngine = {
  id: CaSubstrate;
  label: string;
  verb: string;
  gloss: string;
  skillCount: number;
  teamCount: number;
  skills: readonly CaEngineSkillRef[];
};

/* ─── Generic cluster shape ───────────────────────────────────────
 * A cluster groups skills along one of three axes (engine, team,
 * phase). The donut + breakdown both render from the same shape so
 * switching axes is just swapping the input list.
 */
export type CaCluster = {
  /** Substrate id, team id, or phase id. Stable across renders. */
  id: string;
  axis: CaAxis;
  label: string;
  /** One-line caption shown under the cluster title in the breakdown. */
  sublabel?: string;
  skillCount: number;
  teamCount: number;
  skills: readonly CaEngineSkillRef[];
};

export type CaEnginesIntro = {
  statLine: string;
  bridge: string;
};

const CA_SUBSTRATE_ORDER: readonly CaSubstrate[] = [
  "judgment",
  "voice",
  "validation",
  "stakeholder",
  "pattern",
] as const;

const CA_SUBSTRATE_LABELS: Record<CaSubstrate, string> = {
  judgment: "Judgment",
  voice: "Voice",
  validation: "Validation",
  stakeholder: "Stakeholder",
  pattern: "Pattern",
};

const caSubstrateEngineCopy: Record<
  CaSubstrate,
  { verb: string; gloss: string }
> = {
  judgment: {
    verb: "Applies senior judgment to varied inputs.",
    gloss:
      "Source intake, judgment applied, output gate. Output is a recommendation, draft, or decision rail with reasoning.",
  },
  voice: {
    verb: "Writes in a specific Loop voice.",
    gloss: "Tone-of-voice rules, examples, counter-examples.",
  },
  validation: {
    verb: "Checks output against a Loop bar.",
    gloss:
      "Extract, compare, flag. Output is a flag, score, or anomaly list.",
  },
  stakeholder: {
    verb: "Frames information for a specific reader.",
    gloss: "Raw notes to themed readout to action.",
  },
  pattern: {
    verb: "Composes structured outputs from recurring inputs.",
    gloss: "Inputs to template to fielded output.",
  },
};

function buildSubstrateEngines(
  teams: readonly CaTeamBlock[],
): readonly CaSubstrateEngine[] {
  const buckets = new Map<CaSubstrate, CaEngineSkillRef[]>(
    CA_SUBSTRATE_ORDER.map((id) => [id, []]),
  );

  for (const team of teams) {
    for (const card of team.cards) {
      if (!card.substrate) continue;
      buckets.get(card.substrate)!.push({
        id: card.id,
        title: card.title,
        team: team.team,
      });
    }
  }

  return CA_SUBSTRATE_ORDER.map((id) => {
    const skills = buckets.get(id)!;
    const teamSet = new Set(skills.map((s) => s.team));
    const copy = caSubstrateEngineCopy[id];
    return {
      id,
      label: CA_SUBSTRATE_LABELS[id],
      verb: copy.verb,
      gloss: copy.gloss,
      skillCount: skills.length,
      teamCount: teamSet.size,
      skills,
    };
  });
}

function buildEnginesIntro(
  teams: readonly CaTeamBlock[],
  engines: readonly CaSubstrateEngine[],
): CaEnginesIntro {
  const taggedCount = engines.reduce((n, e) => n + e.skillCount, 0);
  const crossTeamEngines = engines.filter((e) => e.teamCount >= 3).length;

  return {
    statLine: `5 substrate engines \u00b7 ${teams.length} teams \u00b7 ${taggedCount} skills tagged \u00b7 ${crossTeamEngines} engines cross 3+ teams`,
    bridge:
      "Same Skills, by the team that encoded them. Click a skill above to jump to its block.",
  };
}

export const caSubstrateEngines = buildSubstrateEngines(caSkillsTeams);

export const caEnginesIntro = buildEnginesIntro(
  caSkillsTeams,
  caSubstrateEngines,
);

/* ─── Phase + cluster builders ─────────────────────────────────── */

const CA_PHASE_ORDER: readonly CaPhase[] = ["build", "encode", "navigate"];

const CA_PHASE_LABELS: Record<CaPhase, string> = {
  navigate: "Navigate",
  encode: "Encode",
  build: "Build",
};

const CA_PHASE_VERBS: Record<CaPhase, string> = {
  navigate:
    "Workshop happened. Team is working inside Claude on real workflows.",
  encode:
    "At least one Skill drafted or in build. The team's way of working starts to live outside one person's head.",
  build:
    "A tool surface runs on top of one or more encoded Skills. Build adds a layer; it does not replace Encode.",
};

function enginesAsClusters(
  engines: readonly CaSubstrateEngine[],
): readonly CaCluster[] {
  return engines.map((engine) => ({
    id: engine.id,
    axis: "engine" as const,
    label: engine.label,
    sublabel: engine.verb,
    skillCount: engine.skillCount,
    teamCount: engine.teamCount,
    skills: engine.skills,
  }));
}

function teamsAsClusters(
  teams: readonly CaTeamBlock[],
): readonly CaCluster[] {
  return teams.map((team) => {
    const taggedSkills = team.cards
      .filter((card) => card.substrate)
      .map((card) => ({ id: card.id, title: card.title, team: team.team }));
    return {
      id: team.id,
      axis: "team" as const,
      label: team.team,
      sublabel: team.workshopDate,
      skillCount: taggedSkills.length,
      teamCount: 1,
      skills: taggedSkills,
    };
  });
}

function phasesAsClusters(
  teams: readonly CaTeamBlock[],
): readonly CaCluster[] {
  const buckets = new Map<CaPhase, CaEngineSkillRef[]>(
    CA_PHASE_ORDER.map((id) => [id, []]),
  );
  const teamSets = new Map<CaPhase, Set<string>>(
    CA_PHASE_ORDER.map((id) => [id, new Set<string>()]),
  );

  for (const team of teams) {
    teamSets.get(team.phase)!.add(team.id);
    for (const card of team.cards) {
      if (!card.substrate) continue;
      buckets.get(team.phase)!.push({
        id: card.id,
        title: card.title,
        team: team.team,
      });
    }
  }

  return CA_PHASE_ORDER.map((id) => {
    const skills = buckets.get(id)!;
    return {
      id,
      axis: "phase" as const,
      label: CA_PHASE_LABELS[id],
      sublabel: CA_PHASE_VERBS[id],
      skillCount: skills.length,
      teamCount: teamSets.get(id)!.size,
      skills,
    };
  });
}

export const caClustersByAxis: Record<CaAxis, readonly CaCluster[]> = {
  engine: enginesAsClusters(caSubstrateEngines),
  team: teamsAsClusters(caSkillsTeams),
  phase: phasesAsClusters(caSkillsTeams),
};

export const caPhaseLabels = CA_PHASE_LABELS;
export const caPhaseVerbs = CA_PHASE_VERBS;
export const caSubstrateLabels = CA_SUBSTRATE_LABELS;
export const caPhaseOrder = CA_PHASE_ORDER;
export const caSubstrateOrder = CA_SUBSTRATE_ORDER;

export type CaSkillsByTeamSection = {
  id: string;
  ariaLabel: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  sub: string;
  count: string;
  teams: readonly CaTeamBlock[];
};

export type CaLayerTieBack = {
  /** Lead-in line above the diagram. */
  lead: string;
  /** Bridge band below the diagram. */
  bridgeKicker: string;
  bridgeBody: string;
  bridgeCta: {
    label: string;
    href: string;
  };
};

export type CaCloseSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  body: string;
  action: {
    label: string;
    href: string;
    external?: boolean;
  };
};

/* ─── Tools (Build layer) ─────────────────────────────────────────
   Simplified mapping of Skills onto the two tool surfaces currently
   in production: Mímir (marketing briefing agent) and Vesper (image
   and video gen surface). Each tool block names which Skills it
   runs on; the chips link back to the corresponding Skill anchor
   in the Skills-by-team section above. */

export type CaToolStatus = "in-use" | "in-build" | "scoped";

export type CaToolSkillRef = {
  /** Skill ID matching `id` on a `CaSkillCard` somewhere in
      `caSkillsTeams`. Used to build the in-page anchor href
      (`#skill-${id}`) and to look up the resolved title + team
      name at render time. When the chip references a Skill that
      isn't in the source data yet (e.g. scoped but unencoded),
      pair the id with `titleOverride` + `teamOverride` and the
      chip will render as a non-linking pill. */
  skillId: string;
  /** Override the chip title that would otherwise come from
      resolving `skillId` against `caSkillsTeams`. Use when a
      Skill has been renamed for tool-display purposes only and we
      don't want to ripple the rename across the rest of the
      codebase (engine pages, API routes, docs). */
  titleOverride?: string;
  /** Override the team caption shown under the chip title. Use
      when the Skill is genuinely shared across the org (e.g. a
      content asset like the Roadmap Calendar) and showing one
      team's name underneath would mislead the reader. */
  teamOverride?: string;
};

export type CaToolBlock = {
  id: "mimir" | "vesper";
  /** Display name. Mímir uses the í; Vesper is plain ASCII. */
  name: string;
  status: CaToolStatus;
  statusLabel: string;
  /** One-line role sentence ("Marketing briefing agent.", etc.). */
  role: string;
  /** Short paragraph describing what the tool does at the level a
      reader of the v3 digest would expect. */
  body: string;
  /** Teams currently using or owning the surface, in display
      order. Sourced from the v3 digest. */
  teams: readonly string[];
  /** Skills the tool runs on. Order is editorial, not alphabetic. */
  consumes: readonly CaToolSkillRef[];
  /** Optional pill CTA at the bottom of the tool block ("Book a
      demo with X"). Renders in the homepage's
      `aiop-engine-pattern__bridge` style. Leave undefined to
      suppress the CTA. The href is wired to a real
      Calendly/email link by the page owner; until then it falls
      back to a `#` placeholder. */
  cta?: {
    label: string;
    href: string;
    ariaLabel: string;
  };
};

export type CaToolsSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  sub: string;
  /** Phase pill ordinal shown on each tool card ("01", "02", "03").
      Tools live in the third (Build) lane of the flywheel, so the
      default for both Mímir and Vesper is "03" — keeping the same
      `{n} · {kicker}` format the intelligence-layer columns use. */
  phaseN: string;
  /** Phase pill kicker word (e.g. "BUILD"). Anchors the section in
      the flywheel's Navigate / Encode / Build sequence. */
  phaseKicker: string;
  tools: readonly CaToolBlock[];
};

/* â”€â”€â”€ Page chrome â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const caPageMeta: CaPageMeta = {
  brandLeft: "Aether",
  brandSub: "Claude Adoption",
  status: "22 teams running \u00b7 42 Skills compounding",
  links: [
    { id: "numbers", label: "Numbers", href: "#numbers" },
    { id: "approach", label: "Approach", href: "#approach" },
    { id: "vision", label: "The flywheel", href: "#vision" },
    { id: "skills", label: "Skills", href: "#skills" },
    { id: "build", label: "Build", href: "#build" },
    { id: "layer", label: "The layer", href: "#layer" },
  ],
};

/* â”€â”€â”€ 01 Â· Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const caHero: CaHero = {
  titleLines: [
    "Adopting Claude",
    { em: "The Loop Way." },
  ],
  lede: [
    "Software gets installed. AI has to be adopted. We run the same loop with every team, turn what works into Skills, and reuse them everywhere.",
  ],
  actions: [
    { id: "see-skills", label: "See the receipts", href: "#skills", primary: true },
    { id: "see-layer", label: "See the layer", href: "#layer" },
  ],
};

export const caHeroTicker: CaHeroTicker = {
  ariaLabel: "Loop teammates on how Claude has changed their work",
  quotes: [
    {
      id: "haruka",
      text: "We tested our Claude localization skills vs agencies. Claude lands at 90% on first try, 97% after a few notes on general phrasing. Agencies charge €0,05 per translated word so you can imagine the savings!",
      name: "Haruka",
      role: "Expansion",
    },
    {
      id: "carlota",
      text: "The creating-presentation skill is CRAZYYYYY. Ok I'm amazed, officially converted.",
      name: "Carlota",
      role: "Product Management",
    },
    {
      id: "morgane",
      text: "Claude just thinks deeper and captures tone-of-voice much better.",
      name: "Morgane",
      role: "Brand & PR",
    },
    {
      id: "jennifer",
      text: "Ideas that often used to be spaghetti in my brain now have a way to sort themselves and make their way to the real world as well. Such a cool feeling!",
      name: "Jennifer",
      role: "Product Design Engineering",
    },
    {
      id: "charlotte",
      text: "Claude is allowing me to do really incredible stuff.",
      name: "Charlotte",
      role: "Marketing Data & Analytics",
    },
    {
      id: "lotte",
      text: "Claude is really good at detecting red flags in contracts which saves us hours per month.",
      name: "Lotte",
      role: "Legal",
    },
    {
      id: "linsey",
      text: "Claude with the Paid Social Copy skill is saving us hours per month. It can read briefings, check Figma designs and then add the on-brand copy in the right Monday board.",
      name: "Linsey",
      role: "Studio PM",
    },
  ],
} as const;

/* â”€â”€â”€ 02 Â· Numbers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/** ~30 daily onboarded-user points (21 Apr â€“ 20 May). Approximated from
    admin console / adoption rollout. */
const caSparklineOnboardedSeries: readonly CaSparklinePoint[] = [
  { date: "2026-04-21", value: 143 },
  { date: "2026-04-22", value: 144 },
  { date: "2026-04-23", value: 146 },
  { date: "2026-04-24", value: 148 },
  { date: "2026-04-25", value: 148 },
  { date: "2026-04-26", value: 149 },
  { date: "2026-04-27", value: 151 },
  { date: "2026-04-28", value: 153 },
  { date: "2026-04-29", value: 154 },
  { date: "2026-04-30", value: 156 },
  { date: "2026-05-01", value: 158 },
  { date: "2026-05-02", value: 159 },
  { date: "2026-05-03", value: 161 },
  { date: "2026-05-04", value: 165 },
  { date: "2026-05-05", value: 168 },
  { date: "2026-05-06", value: 171 },
  { date: "2026-05-07", value: 175 },
  { date: "2026-05-08", value: 178 },
  { date: "2026-05-09", value: 182 },
  { date: "2026-05-10", value: 185 },
  { date: "2026-05-11", value: 200 },
  { date: "2026-05-12", value: 241 },
  { date: "2026-05-13", value: 263 },
  { date: "2026-05-14", value: 268 },
  { date: "2026-05-15", value: 272 },
  { date: "2026-05-16", value: 273 },
  { date: "2026-05-17", value: 275 },
  { date: "2026-05-18", value: 277 },
  { date: "2026-05-19", value: 278 },
  { date: "2026-05-20", value: 280 },
] as const;

/** ~30 daily WAU points (same window). Approximated from admin console. */
const caSparklineWauSeries: readonly CaSparklinePoint[] = [
  { date: "2026-04-21", value: 58 },
  { date: "2026-04-22", value: 60 },
  { date: "2026-04-23", value: 62 },
  { date: "2026-04-24", value: 65 },
  { date: "2026-04-25", value: 66 },
  { date: "2026-04-26", value: 68 },
  { date: "2026-04-27", value: 72 },
  { date: "2026-04-28", value: 76 },
  { date: "2026-04-29", value: 80 },
  { date: "2026-04-30", value: 84 },
  { date: "2026-05-01", value: 88 },
  { date: "2026-05-02", value: 91 },
  { date: "2026-05-03", value: 95 },
  { date: "2026-05-04", value: 102 },
  { date: "2026-05-05", value: 108 },
  { date: "2026-05-06", value: 114 },
  { date: "2026-05-07", value: 120 },
  { date: "2026-05-08", value: 126 },
  { date: "2026-05-09", value: 131 },
  { date: "2026-05-10", value: 136 },
  { date: "2026-05-11", value: 142 },
  { date: "2026-05-12", value: 148 },
  { date: "2026-05-13", value: 154 },
  { date: "2026-05-14", value: 158 },
  { date: "2026-05-15", value: 161 },
  { date: "2026-05-16", value: 163 },
  { date: "2026-05-17", value: 165 },
  { date: "2026-05-18", value: 167 },
  { date: "2026-05-19", value: 168 },
  { date: "2026-05-20", value: 170 },
] as const;

export const caNumbersSection: CaNumbersSection = {
  id: "numbers",
  ariaLabel:
    "Workshop momentum counts and Claude product usage",
  title: "Where we",
  titleEm: "stand.",
  sub: "Workshop momentum from Monday, plus live Claude usage from the admin console. Toggle onboarded seats vs. weekly active users. Snapshot 22 May; series approximated from the admin console.",
  sparklineViews: {
    defaultView: "wau",
    views: {
      onboarded: {
        kicker: "Active users",
        unit: "Onboarded",
        currentValue: 280,
        startValue: 143,
        delta: "+96% in 30 days",
        windowLabel: "21 Apr \u2013 20 May",
        series: caSparklineOnboardedSeries,
      },
      wau: {
        kicker: "Active users",
        unit: "WAU",
        currentValue: 170,
        startValue: 58,
        delta: "+193% in 30 days",
        windowLabel: "21 Apr \u2013 20 May",
        series: caSparklineWauSeries,
      },
    },
  },
  /* Momentum counts pulled fresh from Monday board `18409569683`
     on 2026-05-22 (all items + subitems). Workshops Run leads as
     the featured tile because it's the highest-signal proof of
     motion — every other count flows from it. Skills sits next to
     it because "Skills encoded" is what the workshops produce.
     Substrates names the five recurring shapes of work the Skills
     cluster into (Judgment / Voice / Validation / Stakeholder /
     Pattern). Tools built anchors the bottom-right as the
     downstream outcome: stack enough Skills and a tool emerges.
     Tile bodies (sub captions) are intentionally omitted — the
     headline number + label is the whole story at this level. */
  momentum: [
    {
      id: "workshops",
      label: "Workshops run",
      value: "22",
      featured: true,
    },
    {
      id: "skills",
      label: "Skills being encoded",
      value: "42",
    },
    {
      id: "substrates",
      label: "Substrates identified",
      value: "5",
    },
    {
      id: "tools",
      label: "Tools built",
      value: "3",
    },
  ],
  connectors: {
    kicker: "Top connectors",
    windowLabel: "MTD",
    total: "+28 more connectors",
    bars: [
      { name: "visualize", value: 30 },
      { name: "workspace", value: 21 },
      { name: "monday.com", value: 13 },
      { name: "cowork", value: 10 },
      { name: "microsoft-365", value: 8 },
      { name: "registry", value: 7 },
    ],
  },
  skillsUsage: {
    kicker: "Top skills",
    windowLabel: "Last 30 days",
    total: "+14 more skills",
    bars: [
      { name: "docx", value: 17 },
      { name: "xlsx", value: 11 },
      { name: "loop-brand-guidelines", value: 8 },
      { name: "frontend-design", value: 7 },
      { name: "pptx", value: 7 },
      { name: "pdf", value: 6 },
    ],
  },
  footnote:
    "Workshop counts from Monday board 18409569683. Claude usage from the Anthropic admin console, snapshot 20 May 2026.",
};

/* â”€â”€â”€ 03 Â· The flywheel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const caFlywheelSection: CaFlywheelSection = {
  id: "vision",
  ariaLabel: "The flywheel running the adoption program",
  title: "Why adoption comes before",
  titleEm: "automation.",
  caption:
    "Navigate first. Then encode what works into something both the team and the agents you build can reuse. Experience stops living with a few people, and the team takes on work it couldn\u2019t do before.",
  /* Kicker is kept in the type for parity with other sections,
     but no longer rendered \u2014 the flywheel orbit + minimal
     annotations carry the visual signal without a redundant
     header. */
  phasesKicker: "The motions",
  phases: [
    {
      id: "navigate",
      label: "Navigate",
      body: "Team works with Claude inside real, named workflows.",
    },
    {
      id: "encode",
      label: "Encode",
      body: "Ways of working, judgement, and taste get encoded into a portable Skill.",
    },
    {
      id: "build",
      label: "Build",
      body: "Encoded Skills wire into tools, dashboards, and agents.",
    },
  ],
};

/* â”€â”€â”€ 04 Â· Workshop approach â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const caWorkshopApproachSection: CaWorkshopApproachSection = {
  id: "approach",
  ariaLabel:
    "How the adoption program compounds across teams: same start, one record, patterns become tools",
  title: "How we run it,",
  titleEm: "team by team",
  titleAfter: ".",
  titleBreakBeforeEm: true,
  sub: "Vince runs the workshops and built the Skill that turns each transcript into a uniform Monday recap. Astrid runs the operating side: scheduling, comms, the board. Every record lands in the same shape, so cross-team patterns surface. That\u2019s how the Intelligence Layer gets built.",
  cards: [
    {
      id: "same-start",
      n: "01",
      motion: "Navigate",
      label: "Every team starts here",
      body: "Same 45-minute kickoff, same Claude. Each team leaves with one workflow worth encoding as a Skill.",
      receipt: "Same kickoff structure used across 22 workshops to date.",
    },
    {
      id: "every-record",
      n: "02",
      motion: "Encode",
      label: "Records feed the layer",
      body: "Transcript becomes a Skill, the result lands in the same Monday board, production-grade Skills graduate to a mono-repo.",
      receipt:
        "Monday board 18409569683 \u00b7 13 teams, same shape \u00b7 mono-repo for Skills that ship.",
    },
    {
      id: "patterns-become-tools",
      n: "03",
      motion: "Build",
      label: "Patterns become tools",
      body: "Three teams doing the same work \u2192 a Skill worth sharing. Three teams needing the same surface \u2192 a tool worth building.",
      receipt:
        "M\u00edmir started as a creative-strategy briefing agent and now also serves product marketing and campaign management \u2014 the pattern was already in the layer.",
    },
  ],
  connectors: [
    { from: "same-start", to: "every-record", verb: "One record" },
    { from: "every-record", to: "patterns-become-tools", verb: "One layer" },
  ],
  engineCta: {
    label: "And this is the engine",
    href: "#vision",
    ariaLabel: "Continue to the flywheel running across every team",
  },
  mondayCta: {
    label: "Monday board",
    href: "https://loopearplugs.monday.com/boards/18409569683",
    ariaLabel:
      "Open the workshop record on the Loop Monday board (opens in a new tab)",
  },
};

/* â”€â”€â”€ 05 Â· Skills, by team â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const caSkillsByTeamSection: CaSkillsByTeamSection = {
  id: "skills",
  ariaLabel: "Skills shipped, in build, and scoped across Loop teams",
  eyebrow: "Proof",
  title: "What\u2019s being",
  titleEm: "encoded.",
  sub: "Forty-two Skills across the entire company. Each one captures how the team handles a specific piece of work, so both the team and agents can build on top of this experience.",
  count: caEnginesIntro.statLine,
  teams: caSkillsTeams,
};

/* --- 06 Scaling interstitial (quote chapter break) --- */

/* Editorial pull-quote that bridges the Skills section above and
   the Intelligence Layer chapter below. Renders inside the canonical
   `.aiop-question-bridge` chrome (atmospheric bleed + italic display
   pull-quote) so the visual family matches the homepage interlude
   ("But how do you actually get here?"). Paired with the layer
   block below in DOM via `.ca-scaling-and-layer`, which drives the
   freeze-and-rise parallax: this section stays visually frozen
   while the layer slides up over it. */
export const caScalingInterstitial = {
  id: "scaling",
  ariaLabel:
    "An interlude line that opens the intelligence-layer chapter below",
  question: "And this is how we\u2019re scaling it.",
} as const;

/* --- 07 Intelligence Layer tie-back --- */

export const caLayerTieBack: CaLayerTieBack = {
  lead: "Every Skill above lives in this layer.",
  bridgeKicker: "Where this goes next",
  bridgeBody:
    "Claude adoption is the qualitative half of Loop\u2019s intelligence layer. The full v3 deck pairs it with the data track, the labs signal, the four-stage roadmap, and the exec ask.",
  bridgeCta: {
    label: "Read the full v3",
    href: "/intelligence-layer-v3",
  },
};

/* â”€â”€â”€ 07 Â· Close â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const caCloseSection: CaCloseSection = {
  id: "close",
  ariaLabel: "Closing statement and link to the workshop record",
  title: "The substrate stays useful",
  titleEm: "whichever model Loop runs.",
  body:
    "Every Skill above is a piece of Loop\u2019s reasoning surface, encoded once, re-callable from any tool. When the model changes, the substrate stays. When a team rotates, the judgment stays. When a new surface launches, it inherits the layer that was already there.",
  action: {
    label: "See the workshop record",
    href: "https://loopearplugs.monday.com/boards/18409569683",
    external: true,
  },
};

/* --- 07b Software for few (route override) --- */

/* Local fork of `softwareForFewSection` from `content/operator.ts`.
   Title + comparison rows are reused; body is rewritten so the
   beat sits in this page's narrative arc (Skills → Tools) rather
   than the homepage's broader Loop-bottlenecks framing. Drops the
   homepage's #cases / #substrate-map cross-links (those anchors
   don't exist here) and the Feynman closer (the surrounding
   chapter already carries an outside-voice register). The shared
   component reads `actions` and `feynman` as optional props (see
   `components/operator/software-for-few.tsx`) and skips their
   render branches when omitted. */
export const caSoftwareForFew = {
  title: "What we\u2019re building on top of",
  titleEm: "these Skills.",
  body:
    "Each Skill encodes one piece of how a team works. Stack enough on one workflow and a tool emerges \u2014 built by the team that owns the work, on Skills they already authored. Two are live at Loop today.",
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
} as const;

/* --- 08 Tools (Build layer): Mímir + Vesper --- */

/* Sourced from `claude-adoption-skills-digest-v3.md` (snapshot
   22 May 2026, "Tools" section). The digest lists six surfaces;
   this section deliberately shows only the two that read as
   externally-recognisable products today (Mímir + Vesper). The
   four Skill-as-tool surfaces (Invoice Processor, Quality Auditor,
   Product Roadmap Briefing Agent, AI-Powered Recruiting Dashboard)
   already surface as cards in the Skills-by-team section above
   and don't need a second slot here.

   Skill IDs below reference rows in `caSkillsTeams`. They're
   resolved at render time so chip titles + team names stay in
   sync with the source-of-truth data. The digest also mentions
   "Packaging Design" as a Vesper consumer; this lands now as the
   `loop-packaging-system` Skill under Product Design (broader
   scope than the older `packaging-review` framing — covers the
   full editable Illustrator → supplier PDF + Creative Intent
   brief production workflow). Vesper consumes
   `genai-prompting` + `cmf-file-generator` + `loop-packaging-
   system` so its three chips read as substrate → CMF pipeline →
   packaging pipeline. */
export const caToolsSection: CaToolsSection = {
  id: "tools",
  ariaLabel:
    "The two tool surfaces running on top of Loop\u2019s Skills today",
  title: "From Skills to",
  titleEm: "tool surfaces.",
  sub: "Two surfaces are already running on top of the Skills above. Each one composes several Skills into something a team uses end-to-end \u2014 not a Claude conversation, a working tool with its own UI.",
  phaseN: "03",
  phaseKicker: "BUILD",
  tools: [
    {
      id: "mimir",
      name: "M\u00edmir",
      status: "in-use",
      statusLabel: "IN USE",
      role: "Marketing Intelligence.",
      body: "Brings together Loop\u2019s paid social voice, the 360 Marketing Agent, the Roadmap Calendar, and the Creative Strategy Skill, then produces campaign-ready briefs the team can ship. Started as a Brand & Partnerships surface; now also serves PMM and Campaign Management.",
      teams: ["Brand & Partnerships", "PMM", "Campaign Management"],
      consumes: [
        /* Loop Creative Strategy is the substrate Mímir composes
           off — four axes (Reiss, Life Force 8, awareness stage,
           transformation arc) plus ten hook archetypes. Lives as
           a real card under the Performance team in
           claude-adoption-teams.ts, so the chip resolves to a
           linked anchor (clicking scrolls to the source card). */
        { skillId: "loop-creative-strategy" },
        /* Loop Paid Social (Studio) replaced Founder Tone of Voice
           as the voice substrate Mímir composes off. Paid Social
           is grounded in 295 real Loop ads across every product +
           audience angle, so it carries more reach than the
           single-voice Founder skill while still picking up the
           same brand register. The card itself sits at the bottom
           of the Skills section above (Studio team, sage-green
           feedsBuildPhase highlight). */
        { skillId: "loop-paid-social" },
        /* The 360 Marketing Agent Skill ships under Brand &
           Partnerships in the source data, but inside Mímir it
           plays the Campaign Management role and the operating
           owner is Ecomm Program Management. We override the chip
           title + team here so the Tools section reflects how the
           Skill is actually used inside Mímir, without renaming
           the underlying card in the Skills donut (Yalis is still
           the listed Brand & Partnerships owner there). */
        {
          skillId: "360-marketing-agent",
          titleOverride: "Campaign Management",
          teamOverride: "Ecomm Program Management",
        },
        /* The Retail Marketing Calendar Skill is shared across
           Brand & Partnerships, PMM, and Campaign Management, so
           we display it as the company-wide Roadmap Calendar in
           Mímir's chip list. The underlying skill id stays the
           same to avoid rippling the rename across the engine
           page, skills deck, API route, and docs that already
           reference `retail-marketing-calendar`. */
        {
          skillId: "retail-marketing-calendar",
          titleOverride: "Roadmap Calendar",
          teamOverride: "Company-wide",
        },
      ],
      cta: {
        label: "Book a demo with Alexander P.",
        href: "mailto:alexander.pauwelyn@loopearplugs.com?subject=M%C3%ADmir%20demo%20request",
        ariaLabel:
          "Email Alexander Pauwelyn to book a M\u00edmir demo",
      },
    },
    {
      id: "vesper",
      name: "Vesper",
      status: "in-use",
      statusLabel: "IN USE",
      role: "Image and video generation surface.",
      body: "Image and video generation grounded in Loop\u2019s product catalogue. Runs the CMF File Generator and the Loop Packaging System end-to-end, so Product Design ships colour pipelines and supplier-ready packaging from one canvas instead of two parallel files.",
      teams: ["Product Design & UX", "Studio"],
      consumes: [
        /* GenAI Prompting (Studio) is the prompt-pattern substrate
           that grounds every generation. Sits first in the list so
           the chip reads as "this is what Vesper builds on" before
           the workflow-specific Skills (CMF generation, packaging
           production) follow. */
        { skillId: "genai-prompting" },
        { skillId: "cmf-file-generator" },
        { skillId: "loop-packaging-system" },
      ],
      cta: {
        label: "Book a demo with Damien",
        href: "mailto:damien@loopearplugs.com?subject=Vesper%20demo%20request",
        ariaLabel: "Email Damien to book a Vesper demo",
      },
    },
  ],
};

/* ─── Tool case detail (modal content for /claude-adoption) ──────
 *
 * The Tools section on /claude-adoption (Mímir + Vesper, the two
 * live build-layer surfaces) renders a "See how it works" button
 * on each block. That button opens an OperatorModal that reuses
 * the homepage's CaseModalBody — same long-form chrome (hero
 * screenshot gallery, capabilities, workflow shift, stack, where
 * it goes next) — but with case copy tuned for the Claude
 * Adoption narrative.
 *
 * The overrides spread on top of the canonical homepage cases in
 * `content/operator.ts` so screenshot paths, walkthrough videos,
 * and structural fields stay sourced from one place. The deltas
 * here are the ones that matter for the exec reader who lands on
 * /claude-adoption:
 *
 *   - Mímir is renamed from "Briefing Agent" to "Marketing
 *     Intelligence" — matches how the tool block above the modal
 *     already names it. The name "Briefing Agent" was the early
 *     framing focused on the briefing workflow specifically;
 *     Mímir grew beyond that into a multi-surface newsroom
 *     (insights feed, four research surfaces, three-panel
 *     briefing composer, Loop Ads dashboard, persona profiles,
 *     server-side workflow agents). "Marketing Intelligence" is
 *     the broader product description that's accurate today.
 *     Canonical source: mimir repo `docs/case-note.md`.
 *
 *   - Vesper foregrounds the CMF flow. The original case copy
 *     leads with the AI Image & Video Suite story (replacing
 *     Krea + ChatGPT + VEO 3). The exec page reader is meeting
 *     Vesper through the build-layer beat above, where the tool
 *     block names "CMF File Generator end-to-end" and "Packaging
 *     Review on the manufacturing side". The capabilities list
 *     and workflow shift now name the CMF pipeline as a
 *     first-class capability instead of leaving it in "where it
 *     goes next". Canonical source: vesper repo
 *     `docs/case-note.md`.
 *
 * Stored as a Record keyed by tool id so the tools-by-skill
 * component can look up the right override via `tool.id`.
 */

const findOperatorCase = (id: string): CaseProject => {
  const found = operatorCases.find((c) => c.id === id);
  if (!found) {
    throw new Error(
      `caToolCases override expected operator case "${id}" to exist`,
    );
  }
  return found;
};

const mimirOperatorCase = findOperatorCase("mimir");
const vesperOperatorCase = findOperatorCase("vesper");

export const caToolCases: Record<string, CaseProject> = {
  mimir: {
    ...mimirOperatorCase,
    name: "Marketing ",
    nameEm: "Intelligence",
    tagline: "Marketing Intelligence",
    subline: "Loop\u2019s own brand knowledge, structured.",
    challenge:
      "Creative Strategy and Brand drove the briefings, but each cycle meant manual digging across Reddit, ad dashboards, Meta Ad Library, persona notes, and past briefs, with Loop\u2019s proprietary ad data too sensitive to hand to outside tools.",
    workflowBefore:
      "Strategists assembled briefs from memory across Reddit, Meta Ad Library, ad performance spreadsheets, review notes, and persona docs. Every cycle started from scratch and every handoff absorbed a slightly different brief shape.",
    workflowAfter:
      "M\u00edmir runs as a newsroom: a daily insights feed, four research surfaces (Trends, Social Comments, Meta Ads Library, Strategic Insights), and a three-panel briefing composer that pulls from those surfaces and writes the finished brief into Monday for the design team.",
    capabilities: [
      {
        k: "Newsroom workspace",
        v: "A daily feed and four research surfaces shaped like the work, not like a database query.",
      },
      {
        k: "Three-panel composer",
        v: "Briefing composer pulls evidence from the surfaces and hands the finished brief to Monday for design.",
      },
      {
        k: "Degrees-of-freedom Skills",
        v: "Sourcing and KPI interpretation are locked; brand framework is guided; angle generation is open. One substrate, both rigorous and creative.",
      },
      {
        k: "Headless via MCP",
        v: "The same briefing Skills answer the web app, Claude, Cursor, Slack, and ChatGPT.",
      },
    ],
    companyLeverage:
      "Started in Creative Strategy and Brand & Partnerships. Now also serves PMM and Campaign Management on the same substrate. The aim is one source of truth on customer voice, business priorities, and channel performance — open to anyone in the company, from whatever surface they already work in.",
  },
  vesper: {
    ...vesperOperatorCase,
    workflowBefore:
      "Designers tabbed between Krea for generation, Claude for prompting, and separate tabs for image-to-video. CMF colourways lived in a workbook that Studio re-rendered for every revision, with Manufacturing Programs running off a parallel file.",
    workflowAfter:
      "One canvas runs prompt enhancement, multi-model generation, and image-to-video on the models Studio actually uses. The CMF File Generator resolves a colourway workbook through reference renders into a packet PDF, and Packaging Review pairs with it so Product Design and Manufacturing Programs work off one pipeline.",
    capabilities: [
      {
        k: "CMF File Generator",
        v: "Workbook of colourways resolves through reference renders into a packet PDF. Product Design and Manufacturing Programs work off the same file instead of two parallel ones.",
      },
      {
        k: "Prompt enhancement",
        v: "Claude refines visual prompts using the Loop product catalogue, same Skill behind Claude.ai and the in-product enhance button.",
      },
      {
        k: "Multi-model generation",
        v: "Gemini Flash Image, Veo 3.1, Replicate Seedream, and Kling under one tab. Animate-still in place, no extra app to open.",
      },
      {
        k: "Headless REST + MCP",
        v: "Same generation Skills callable from Claude / Cursor / a future Sigil surface; the canvas is one interface, not the only one.",
        status: "WIP",
      },
    ],
    companyLeverage:
      "Vesper started in Studio replacing Krea; the same canvas now anchors the CMF flow with Product Design and Manufacturing Programs. The model adapter shape and the prompt enhancement pipeline have already carried into Sigil\u2019s generation suite — Vesper is the first repo that ran the full Loop loop end-to-end.",
  },
};

/* â”€â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const caFooter = {
  line: "Aether \u00b7 Claude Adoption \u00b7 Standing report \u00b7 Monday board 18409569683.",
  signature: "Senior Leadership Days companion \u00b7 May 2026.",
} as const;

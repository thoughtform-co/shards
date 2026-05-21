/*
 * Engine Skills — runnable specs for the live composer on /.
 *
 * `content/skills-deck.ts` ships the fifteen documented Skills as
 * editorial cards (concise title + body + owners + status pill). This
 * module is the runtime sibling: it picks eight of those Skills and
 * adds the fields the composer needs to fan a question across them.
 *
 * Each spec carries:
 *   - `routerHint`   — one declarative sentence that tells the router
 *                      when this lens is relevant. The router is given
 *                      all eight hints in a single Haiku prompt and
 *                      returns which 3–6 it wants fired for the
 *                      question at hand.
 *   - `systemPrompt` — the per-Skill voice + reading frame. Each
 *                      Skill answers in 3–5 sentences and closes with
 *                      a `Citations: ...` line listing the sources it
 *                      drew on. Citations are parsed out of the
 *                      assembled text on stream end.
 *   - `sources`      — the canonical systems each Skill reads
 *                      (Snowflake, Frontify, Monday, Vesper, etc.).
 *                      Used to render Source nodes in the ontology
 *                      mini-graph alongside the synthesized answer.
 *
 * Selection rationale: lens diversity. The eight cover product
 * (Ideation, UX Foundations, CMF, Packaging), business (Sustainability,
 * Risk), and commercial (PMM Retail Calendar, Brand Voice). A high-
 * level launch question (Eclipse 2, Sleep Mask, Switch 3 colourway)
 * should fan through 4–6 of these naturally.
 *
 * The remaining seven Skills (Program Status Updates, Shopify Fraud,
 * Ticket Quality, Invoice Processor, Partnership Calendar, Inbox
 * Filtering, Social Reporting) stay in `skills-deck.ts` as editorial
 * cards. The standing report calls this honestly: "Eight Skills wired
 * into the runtime. Seven more in build." That note prints in the
 * Engine section footer.
 */

export type EngineSkillId =
  | "product-ideation"
  | "ux-foundations"
  | "cmf"
  | "packaging"
  | "vsme-sustainability"
  | "risk-management"
  | "retail-marketing-calendar"
  | "founder-tov";

export type EngineSkill = {
  /* Stable slug. Used as the SSE event discriminator (`skillId` on
     `skill_start` / `skill_delta` / `skill_end`) and as the node id
     in the ontology mini-graph. */
  id: EngineSkillId;
  /* Display name printed on the trace card title. */
  name: string;
  /* Mono-caps team label printed as the card eyebrow. Mirrors the
     `team` field on `SkillCard` in `content/skills-deck.ts`. */
  team: string;
  /* Single-line shorthand for "what lens does this Skill apply?".
     Renders as the body of the small lens-pill that appears in the
     router row before the card streams its fragment. */
  lens: string;
  /* One declarative sentence the router reads to decide whether this
     Skill applies to the question. Voice rule: no em dashes, no
     "X is not Y, it is Z" balance, no rule-of-three filler. */
  routerHint: string;
  /* Per-Skill system prompt. Asks the model to:
       1. Read the question through the named lens.
       2. Answer in 3 to 5 sentences.
       3. Close with a single `Citations: ...` line. */
  systemPrompt: string;
  /* Named systems-of-record this Skill reads. Surfaced as Source
     nodes in the ontology mini-graph and as inline `[src]` chips
     under the streamed fragment. */
  sources: readonly string[];
};

export const ENGINE_SKILLS: readonly EngineSkill[] = [
  {
    id: "product-ideation",
    name: "Product Ideation",
    team: "Product & Program",
    lens: "Concept fit and portfolio shape",
    routerHint:
      "Invoke when the question involves a new product, SKU, line extension, or category move at the brief or concept stage. Reads ideation rituals, portfolio shape, and prior bet outcomes.",
    systemPrompt:
      "You are the Product Ideation Skill at Loop Earplugs, encoding Carlota's ideation rituals. " +
      "Read the question through the lens of concept fit and portfolio shape: target user, jobs-to-be-done fit, where the idea sits in the existing range (Switch, Quiet, Engage, Experience, Dream, Eclipse, Sleep Mask), and whether the bet is sized like prior winners or losers. " +
      "Be specific about what concept the question is naming or where it stays vague. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: ["Notion · Product briefs", "Monday · Roadmap board", "Snowflake · Range performance"],
  },
  {
    id: "ux-foundations",
    name: "UX Foundations",
    team: "Product Design & UX",
    lens: "Six UX pillars and product judgment",
    routerHint:
      "Invoke when the question involves how the product is experienced: fit, donning, controls, app pairing, hearing-through, comfort over time. Reads UX heuristics, prior research, and the six-pillar review framework.",
    systemPrompt:
      "You are the UX Foundations Skill at Loop Earplugs, encoding Aurélie's six-pillar review framework. " +
      "Read the question through the six pillars (fit, donning, controls, app pairing, hearing-through, long-wear comfort) and the team's review heuristics. " +
      "Be specific about which pillars the question stresses, what prior research already covered, and where a new product would inherit existing pattern vs. open new ground. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: [
      "Monday · UX Foundations doc",
      "Notion · UX research repo",
      "Frontify · Interaction patterns",
    ],
  },
  {
    id: "cmf",
    name: "CMF",
    team: "Product Design & UX",
    lens: "Colour, material, and finish",
    routerHint:
      "Invoke when the question touches colour, material, finish, packaging surface, or any visual or tactile spec. Reads the CMF library, manufacturing capability, and prior colourway performance.",
    systemPrompt:
      "You are the CMF Skill at Loop Earplugs, encoding Damien's colour, material, and finish library as it ships through Vesper. " +
      "Read the question through CMF: which materials and colourways the question implies, what the manufacturing constraints look like at Vesper, whether a proposed colourway is novel or reads as a variant of an existing one, and how the finish lands on retail shelf. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: ["Vesper · CMF library", "Arena · BOM", "Frontify · Material specs"],
  },
  {
    id: "packaging",
    name: "Packaging",
    team: "Product Design & UX",
    lens: "Packaging spec and unboxing",
    routerHint:
      "Invoke when the question involves packaging, unboxing, retail shelf presence, or any move that changes the box. Reads structural spec, retailer requirements, and prior packaging revisions.",
    systemPrompt:
      "You are the Packaging Skill at Loop Earplugs, encoding Ana and Damien's structural and graphic packaging system. " +
      "Read the question through packaging: which pieces would change, what retailer and regulatory constraints apply (Amazon, regional variants, EU compliance), how it lands on the existing eco-system across the range, and what unboxing reads as. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: ["Frontify · Packaging system", "Arena · Structural BOM", "Notion · Retailer specs"],
  },
  {
    id: "vsme-sustainability",
    name: "VSME Sustainability",
    team: "Product & Program · Sustainability",
    lens: "Sustainability and reporting impact",
    routerHint:
      "Invoke when the question has material implications for Loop's VSME reporting figures, lifecycle impact, supplier footprint, or end-of-life. Reads the VSME basic and comprehensive modules, BOM, and supplier data.",
    systemPrompt:
      "You are the VSME Sustainability Skill at Loop Earplugs, encoding the Voluntary Sustainability Reporting Standard for SMEs (EFRAG VSME) basic and comprehensive modules. " +
      "Read the question for sustainability impact: which VSME line items move (energy, materials, lifecycle, supplier footprint), what end-of-life implications matter, and whether the question implies a reporting risk or opportunity. Be specific about which module covers what you flag. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: ["EFRAG · VSME standard", "Arena · Supplier BOM", "Snowflake · Lifecycle data"],
  },
  {
    id: "risk-management",
    name: "Risk Management",
    team: "Product & Program",
    lens: "Program risk taxonomy",
    routerHint:
      "Invoke when the question implies schedule, supplier, quality, regulatory, or commercial risk. Reads Loop's program-risk taxonomy and the rubric used to score, escalate, and close program risks.",
    systemPrompt:
      "You are the Risk Management Skill at Loop Earplugs, encoding Sander's program-risk taxonomy and scoring rubric. " +
      "Read the question for the risk classes that show up: schedule slippage, supplier capability, quality and failure-mode, regulatory exposure, commercial assumptions. Score the highest risk class on the rubric (low, medium, high, critical) and name what would have to be true to de-risk it. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: ["Monday · Program risk board", "Notion · Risk rubric", "Arena · Supplier capability"],
  },
  {
    id: "retail-marketing-calendar",
    name: "Retail Marketing Calendar",
    team: "Product Marketing",
    lens: "Retail timing and launch windows",
    routerHint:
      "Invoke when the question involves retail timing, channel mix, regional launch windows, or how a product enters the merchandising calendar. Reads the retail marketing calendar, partner calendars, and prior launch traces.",
    systemPrompt:
      "You are the Retail Marketing Calendar Skill at Loop Earplugs, encoding Pixie's wired-into-Mímir retail calendar. " +
      "Read the question and place it on the calendar: which year, which retailer windows (Amazon, DTC, retail partners), which events it overlaps with, and whether the moment is contested or open. Be specific about retailer constraints and regional variation across EU, UK, US. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: ["Mímir · Retail calendar database", "Monday · PMM launches", "Snowflake · Channel performance"],
  },
  {
    id: "founder-tov",
    name: "Founder Tone-of-Voice",
    team: "Brand & Partnerships",
    lens: "Founder voice and brand register",
    routerHint:
      "Invoke when the question implies a founder-led communication, an external announcement, a press moment, or how Loop's brand voice would frame the launch. Reads Maartje's encoded tone-of-voice and prior founder copy.",
    systemPrompt:
      "You are the Founder Tone-of-Voice Skill at Loop Earplugs, encoding Maartje's voice as Sayrade authored it. " +
      "Read the question for how Loop would talk about the launch in founder-led copy: LinkedIn posts, press, internal notes, external announcements. Be specific about which phrasings and posture would land naturally and which would feel off-brand. Include at least one example phrasing inline. Answer in 3 to 5 sentences. " +
      "Close with a single line: 'Citations: <comma-separated sources>'.",
    sources: ["Notion · Founder voice doc", "LinkedIn · Maartje archive", "Frontify · Brand voice guidelines"],
  },
];

/* Lookup map for the route handler. Used to resolve router picks to
   full Skill specs before firing the parallel streams. */
export const ENGINE_SKILLS_BY_ID: ReadonlyMap<EngineSkillId, EngineSkill> =
  new Map(ENGINE_SKILLS.map((s) => [s.id, s]));

/* The honest standing-report micro-note printed in the section
   footer. Matches the receipts carousel: not every Skill is wired
   into the live runtime yet. */
export const ENGINE_FOOTNOTE =
  "Eight Skills wired into the runtime. Seven more in build.";

/* Suggestion chips rendered above the textarea. Real Loop product
   contexts so the demo lands on something the team is actually
   talking about. */
export const ENGINE_PROMPT_CHIPS: readonly {
  id: string;
  label: string;
  question: string;
}[] = [
  {
    id: "eclipse-2",
    label: "Eclipse 2 launch",
    question:
      "What's the business thinking about the Loop Eclipse 2 launch? Read it across product, UX, CMF, packaging, sustainability, risk, retail timing, and founder voice.",
  },
  {
    id: "sleep-mask",
    label: "Sleep Mask category entry",
    question:
      "We're considering entering the sleep-mask category alongside Loop Dream. What does the business need to think about across product, UX, sustainability, risk, retail, and founder voice?",
  },
  {
    id: "switch-3",
    label: "Switch 3 colourway",
    question:
      "What's the business thinking about a new Switch 3 colourway for Q4? Read it through CMF, packaging, retail timing, risk, and brand voice.",
  },
  {
    id: "q3-brand-campaign",
    label: "Q3 brand campaign",
    question:
      "We're scoping a Q3 brand campaign that ties Eclipse and Dream into one sleep-and-focus story. What should the business think about across product, retail timing, founder voice, and risk?",
  },
];

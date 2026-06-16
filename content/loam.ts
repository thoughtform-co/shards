/*
 * Loam content layer.
 *
 * Loam is a forward-deployed AI consultancy embedded inside creative
 * agencies and marketing departments. Two operators (Vince Buyssens and
 * Rob Weston) sit inside one team for a quarter, ship the work, encode
 * how the team decides, and leave behind the intelligence layer every
 * future AI tool inherits from.
 *
 * The metaphor is the spine: Loam is fertile soil. Topsoil is the data
 * half (warehouse, CRM, ontology). The loam itself is the encoded
 * judgment half. Above the surface, every campaign and tool grows from
 * what is below.
 *
 * Voice rules carried over from Thoughtform: no em dashes, no balanced
 * "not X but Y" constructions, no forced rule-of-three, no filler
 * authority words. Declarative sentences only.
 */

/* -----------------------------------------------------------------------
 * Page metadata + nav
 * --------------------------------------------------------------------- */

export const loamMeta = {
  brand: "Loam",
  brandSub: "Forward-deployed AI for creative work",
  status: "Embedded inside the work",
  links: [
    { id: "shift", label: "Shift", href: "#shift" },
    { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
    { id: "spectrum", label: "Spectrum", href: "#spectrum" },
    { id: "layer", label: "The layer", href: "#layer" },
    { id: "method", label: "Method", href: "#method" },
    { id: "engage", label: "Engage", href: "#engage" },
    { id: "founders", label: "Founders", href: "#founders" },
  ],
  cta: { label: "Start a conversation", href: "#close" },
} as const;

/* -----------------------------------------------------------------------
 * Hero
 * --------------------------------------------------------------------- */

export const loamHero = {
  wordmark: "Loam",
  eyebrow: "Forward-deployed AI for creative work",
  titleLines: [
    "The intelligence layer",
    { em: "your work grows from." },
  ] as const,
  lede: [
    "Loam is a forward-deployed AI consultancy. Two operators embed inside a creative agency or a marketing department for a quarter. They ship the work that pays back, encode how the team actually decides, and leave behind the intelligence layer every future AI tool will inherit from.",
  ] as const,
  hudLabels: {
    a: "01 / Embed",
    b: "02 / Encode",
    c: "03 / Leave behind",
    centerTop: "INTELLIGENCE LAYER",
    centerBottom: "L O A M",
  },
  actions: [
    {
      id: "engage",
      label: "Start a conversation",
      href: "#close",
      primary: true,
    },
    { id: "method", label: "See the method", href: "#method" },
  ] as const,
  scrollHint: "Scroll",
} as const;

/* -----------------------------------------------------------------------
 * The shift / why now
 *
 * Frontier signal: Palantir invented forward-deployed engineering,
 * Stripe is hiring forward-deployed marketing, OpenAI and Anthropic
 * have committed eleven and a half billion dollars to deployment-first
 * joint ventures. The shape Loam runs has just become consensus.
 * --------------------------------------------------------------------- */

export const loamShiftSection = {
  id: "shift",
  eyebrow: "The shift",
  title: "The frontier is betting",
  titleEm: "billions",
  titleAfter: "on deployment, not the model.",
  sub: "Palantir invented the shape. Stripe is hiring for it. OpenAI and Anthropic just put eleven and a half billion behind it. Forward-deployed teams that embed inside the work, encode it, and leave behind a running system. We have run that motion inside marketing and creative for two years.",
  cards: [
    {
      id: "palantir",
      mark: "Palantir",
      tag: "Origin pattern",
      kicker: "The FDE pattern",
      headline: "The role every AI lab is now copying.",
      body: "Palantir invented the Forward Deployed Engineer. Embed inside customer ops, encode the workflow, leave behind a running system. The shape that defined enterprise software.",
      meta: "Palantir / FDE program",
      href: "https://www.palantir.com/careers/forward-deployed-engineer/",
    },
    {
      id: "stripe",
      mark: "Stripe",
      tag: "Job listing",
      kicker: "Forward-deployed marketing",
      headline: "Stripe created a role that did not exist a year ago.",
      body: "Multiple six figures to embed AI-natives inside marketing. Each assigned to twenty marketers until the team is self-sufficient. AI as default, not as occasional tool.",
      meta: "@andruyeung via X",
      href: "https://www.wsj.com/articles/ai-startups-have-a-new-old-secret-weapon-forward-deployed-engineers-d18ee609",
    },
    {
      id: "openai",
      mark: "OpenAI",
      tag: "Joint venture",
      kicker: "$10B DeployCo",
      headline: "OpenAI launches the deployment company.",
      body: "Ten billion dollar joint venture, nineteen partners. Acquired Tomoro for around 150 forward-deployed engineers on day one. Deployment is the new distribution.",
      meta: "openai.com / May 2026",
      href: "https://openai.com/index/openai-launches-the-deployment-company/",
    },
    {
      id: "anthropic",
      mark: "Anthropic",
      tag: "Joint venture",
      kicker: "$1.5B Claude Services",
      headline: "Anthropic answer the same way.",
      body: "Blackstone, Hellman and Friedman, Goldman Sachs. Applied AI engineers deployed into portfolio companies to build custom Claude. Zero consulting firms in the cap table.",
      meta: "Bloomberg / enterprise track",
      href: "https://www.wsj.com/business/deals/anthropic-nears-1-5-billion-joint-venture-with-wall-street-firms-8f5448ee",
    },
  ],
  closing: {
    lead: "The frontier is paying for this shape.",
    accent: "We run it inside marketing today.",
  },
} as const;

/* -----------------------------------------------------------------------
 * Diagnosis
 * --------------------------------------------------------------------- */

export const loamDiagnosisHead = {
  id: "diagnosis",
  eyebrow: "The diagnosis",
  title: "Most AI programs",
  titleEm: "do not compound.",
  sub: "Bigger marketing teams have run the pilots, bought the seats, and ratified the policies. The work still does not get faster, the output still reads generic, and the board still asks where the ROI went. Four reasons we see in every room.",
} as const;

export type LoamDiagnosisCard = {
  id: string;
  tag: string;
  title: string;
  body: string;
};

export const loamDiagnosisCards: readonly LoamDiagnosisCard[] = [
  {
    id: "pilots",
    tag: "01",
    title: "Pilots stall before they ship.",
    body: "A successful experiment in one corner of the team never becomes a system. Nobody in the room can take it from prompt to product, so the prototype gets archived and the slide deck moves on.",
  },
  {
    id: "generic",
    tag: "02",
    title: "The output reads generic.",
    body: "Without the team's real standards in the loop, every AI tool defaults to the average of the internet. The brand loses its edge, the work loses its taste, and the team stops trusting the tool.",
  },
  {
    id: "tacit",
    tag: "03",
    title: "The best judgment lives in three people's heads.",
    body: "How your strongest operators actually decide is rarely written down. New hires take a year to catch up. Agents start from zero every chat. The senior bench becomes the bottleneck.",
  },
  {
    id: "roi",
    tag: "04",
    title: "ROI is impossible to defend.",
    body: "Seats are bought, usage is patchy, governance is unclear, and nobody can show the board what the spend bought. The CFO asks for the receipts and the function goes quiet.",
  },
];

export const loamDiagnosisGap = {
  eyebrow: "Shared cause",
  body: "All four come from the same gap. Nothing holds how your team actually works in a form AI can use.",
} as const;

/* -----------------------------------------------------------------------
 * Spectrum
 * --------------------------------------------------------------------- */

export const loamSpectrumHead = {
  id: "spectrum",
  eyebrow: "The full spectrum",
  title: "Production, adoption, automation.",
  titleEm: "One operating model across all three.",
  sub: "Most agencies sell one band. We run the full motion. The ads ship and pay back. The team learns to work this way without us in the room. The tools that come out of those workflows become the durable layer the next campaign inherits.",
} as const;

export type LoamSpectrumStat = { value: string; label: string };
export type LoamSpectrumBand = {
  id: "production" | "adoption" | "automation";
  tag: string;
  title: string;
  body: string;
  stats: readonly LoamSpectrumStat[];
  note: string;
};

export const loamSpectrumBands: readonly LoamSpectrumBand[] = [
  {
    id: "production",
    tag: "01 / Production",
    title: "We ship work that pays back.",
    body: "AI-generated visuals, AI-assisted copy, real production. Concept to broadcast, the whole pipeline shaped by AI and finished by the team. The cuts that go live pay out above the performance benchmark.",
    stats: [
      { value: "95%", label: "of briefings done with AI" },
      { value: "2-3x", label: "faster than external agencies" },
      { value: "World-first", label: "AI above-the-line film" },
    ],
    note: "Loop Studio. AI in production since 2024.",
  },
  {
    id: "adoption",
    tag: "02 / Adoption",
    title: "Teams become self-sufficient.",
    body: "We embed alongside the team. Run the workshop. Activate stewards inside each function. Coach the cohort from awareness to daily use. After a quarter the team runs without us, and the next team starts further along than the last.",
    stats: [
      { value: "5 to 130+", label: "users in 18 months" },
      { value: "20+", label: "workflows encoded as Skills" },
      { value: "Every team", label: "with an internal AI steward" },
    ],
    note: "Loop Earplugs. Company-wide rollout, every function.",
  },
  {
    id: "automation",
    tag: "03 / Automation",
    title: "The workflows become tools.",
    body: "When three teams hit the same friction we build the tool that removes it. Headless from day one, so the substrate underneath is shared and the next surface inherits the same judgment. Days of manual work collapse into minutes.",
    stats: [
      { value: "4", label: "production tools shipped" },
      { value: "Days to minutes", label: "on briefing synthesis" },
      { value: "Headless", label: "every tool, day one" },
    ],
    note: "Briefing intelligence, studio orchestration, image and video suite, UGC dubbing pipeline.",
  },
];

export const loamSpectrumFoot =
  "One team. One operator pair. All three bands in the same engagement. Each band feeds the next.";

/* -----------------------------------------------------------------------
 * The layer (substrate map)
 *
 * Re-framed in soil terms: topsoil = data half, loam = judgment half,
 * surface = the work that grows from it.
 * --------------------------------------------------------------------- */

export const loamLayerSection = {
  id: "layer",
  eyebrow: "What compounds",
  title: "Loam is the layer",
  titleEm: "your work grows from.",
  body: "The data half sits in your warehouse and your ontology. The judgment half lives in three people's heads. Encode it once, version it, and every AI surface you ever buy inherits the same standards.",
  columns: {
    sources: {
      n: "01",
      kicker: "Topsoil",
      title: "Where the work already lives.",
      caption: "Your systems of record and the ontology that sits above them. The data half. Owned by engineering and data, procurable from any vendor.",
      ontology: {
        kind: "Knowledge graph",
        objects: ["Customer", "Brief", "Persona", "Campaign", "Asset"],
      },
      systems: {
        items: [
          "Warehouse",
          "CRM",
          "DAM",
          "Brand system",
          "Performance data",
          "Project board",
        ],
      },
    },
    substrate: {
      n: "02",
      kicker: "Loam",
      badge: "Judgment half",
      title: "How the team actually decides.",
      caption: "Rules, examples, voice, review gates. The judgment half. Not procurable. No vendor sells it. Owned internally, versioned, model-portable. This is the moat.",
      items: [
        { tag: "Rules", name: "How the team decides" },
        { tag: "Examples", name: "What good looks like" },
        { tag: "Voice", name: "How the brand sounds" },
        { tag: "Loops", name: "Who confirms what" },
      ],
      tags: ["Owned internally", "Versioned", "Survives any model change"],
    },
    surfaces: {
      n: "03",
      kicker: "Surface",
      badge: "Inherited everywhere",
      title: "Where the team calls the engine.",
      caption: "One layer, many surfaces. Chat, docs, agents, internal apps. The next model wins something cheaper. The layer carries forward.",
      items: [
        { icon: "Cl", name: "Claude" },
        { icon: "G", name: "Gemini" },
        { icon: "W", name: "Web app" },
        { icon: "#", name: "Slack" },
        { icon: "{ }", name: "API" },
        { icon: "A", name: "Agents" },
      ],
    },
  },
  closing: "The data half plus the judgment half compose. Without the second half, every prompt starts from zero and every tool reads generic.",
} as const;

/* -----------------------------------------------------------------------
 * Method (Navigate / Encode / Build)
 * --------------------------------------------------------------------- */

export const loamMethodSection = {
  id: "method",
  eyebrow: "The method",
  title: "Navigate, encode, build.",
  titleEm: "One motion, two readings.",
  sub: "Adoption is the loop run inside real work. Navigate with the team, encode what makes the work good, build the tool that removes the friction. Automation is what comes out the other side. Same motion, two readings.",
  steps: [
    {
      id: "navigate",
      n: "01",
      label: "Navigate",
      title: "Sit inside the workflow.",
      body: "We embed alongside one team. Watch where judgment happens. Field notes, not strategy slides. The first month is patterns, not deliverables.",
    },
    {
      id: "encode",
      n: "02",
      label: "Encode",
      title: "Capture what makes the work good.",
      body: "Rules, examples, voice, review gates, loops. Drafted by the operator, reviewed by the team, versioned in your repo. The substrate the next campaign inherits.",
    },
    {
      id: "build",
      n: "03",
      label: "Build",
      title: "Ship the tool that removes the friction.",
      body: "Headless from day one. The substrate runs the chat, the docs, the agents, the internal app. Days of manual work collapse into minutes.",
    },
  ],
  centerLabel: "Loam",
  centerSub: "Intelligence layer",
  satellite: "Headless",
} as const;

/* -----------------------------------------------------------------------
 * Scope (what we own)
 * --------------------------------------------------------------------- */

export type LoamScopeCard = {
  id: string;
  n: string;
  title: string;
  body: string;
};

export const loamScopeSection = {
  id: "scope",
  eyebrow: "What we own",
  title: "Broader than",
  titleEm: '"how to use AI."',
  sub: "We sit at the executive table. The four motions below are inside the engagement, not adjacent to it.",
  cards: [
    {
      id: "strategy",
      n: "01",
      title: "Strategy and operating model.",
      body: "The function shape, the swim lanes between technology, people, legal, and adoption, and the executive thesis that holds them together. We have run this at exec level inside a scale-up for eighteen months.",
    },
    {
      id: "governance",
      n: "02",
      title: "Governance, legal, and platform.",
      body: "Vendor selection, enterprise contracts, SSO, DPA, AI policy, data classification, model routing, observability. We do the work and we sit in the room when legal and IT need a peer to align with.",
    },
    {
      id: "change",
      n: "03",
      title: "Change management at executive depth.",
      body: "Stakeholder mapping, exec communications, cohort programs, stewards inside every team, internal showcases. The cultural work that decides whether the platform actually changes how people show up to work.",
    },
    {
      id: "roi",
      n: "04",
      title: "ROI and measurement.",
      body: "Spend modelling, usage telemetry, per-team dollars, the receipts that defend the budget to the board. We expect to argue the ROI of the layer and we know how to instrument it.",
    },
  ] satisfies readonly LoamScopeCard[],
} as const;

/* -----------------------------------------------------------------------
 * Engage (three formats)
 * --------------------------------------------------------------------- */

export type LoamOfferCard = {
  n: string;
  title: string;
  body: string;
  bullets: readonly string[];
  meta: string;
  cta: string;
};

export const loamOfferSection = {
  id: "engage",
  eyebrow: "Three ways to engage",
  title: "Three formats.",
  titleEm: "One operating model.",
  sub: "Every engagement runs the same motion. Embed, encode, hand back. The format names the scope.",
  cards: [
    {
      n: "01",
      title: "Diagnostic.",
      body: "A two-week embedded read. We sit with the team, map the workflows, surface the bottlenecks, and write back what we found with a scoped recommendation for the program. No deck-first detours.",
      bullets: [
        "Two-week embed with one team",
        "Workflow map and bottleneck inventory",
        "Scoped program proposal",
      ],
      meta: "Two weeks / one team / fixed scope",
      cta: "Pricing on request",
    },
    {
      n: "02",
      title: "Pilot.",
      body: "One quarter, one function, one operator pair embedded. We run production work, encode the workflows that recur, and ship one tool the team will keep using after we leave. The most common starting point.",
      bullets: [
        "One quarter embedded inside the function",
        "Production work shipped under AI assist",
        "One Skill library plus one shipped tool",
        "Stewards trained to extend the library themselves",
      ],
      meta: "One quarter / one function / two operators",
      cta: "Pricing on request",
    },
    {
      n: "03",
      title: "Programmatic.",
      body: "An always-on engagement. New functions onboarded each quarter, the operator pair rotating between them, the substrate and tool library compounding across the company. The shape Anthropic and OpenAI are now selling.",
      bullets: [
        "Multi-quarter program across functions",
        "Compounding substrate library, owned by the company",
        "Quarterly board update with the ROI receipts",
        "Path to an internal AI Adoption Lead inside the org",
      ],
      meta: "Multi-quarter / cross-functional / operator pair plus stewards",
      cta: "Pricing on request",
    },
  ] satisfies readonly LoamOfferCard[],
} as const;

export const loamQualifierSection = {
  eyebrow: "Who this is for",
  title: "Creative agencies and marketing teams ready to build.",
  cards: [
    {
      id: "fit",
      label: "Fit",
      body: "Creative agencies of fifteen to two hundred. Marketing teams inside scale-ups or PE portfolios. Execs who want the layer their portfolio companies will inherit. CMOs who want their function to compound.",
    },
    {
      id: "not-fit",
      label: "Not a fit",
      body: "Teams looking for a one-off training day, a vendor evaluation slide, or a list of tools to buy. We do not run pilots that end in a recommendation deck. Every engagement ships work.",
    },
  ],
} as const;

/* -----------------------------------------------------------------------
 * Founders
 * --------------------------------------------------------------------- */

export type LoamFounder = {
  id: "rob" | "vince";
  name: string;
  role: string;
  portrait: { src: string; alt: string };
  bio: readonly string[];
  credentials: readonly string[];
  owns: string;
};

export const loamFoundersSection = {
  id: "founders",
  eyebrow: "Founders",
  title: "Two operators.",
  titleEm: "One mandate.",
  sub: "Forward-deployed only works when the executive register and the AI register are inside the same engagement. We pair the two so neither half waits on translation.",
  founders: [
    {
      id: "rob",
      name: "Rob Weston",
      role: "Executive operator / marketing transformation",
      portrait: {
        src: "/images/rob-weston.png",
        alt: "Rob Weston portrait",
      },
      bio: [
        "Scaling commercial and marketing leader for consumer brands across DTC, retail, and marketplaces. Most recently Chief Commercial and Marketing Officer at Loop Earplugs, joined in 2024 to diversify the business beyond Meta dependency and build a scalable omnichannel operating model.",
        "Before Loop, Chief Marketing Officer at Beauty Pie through Series A to B, Interim CMO at Asda leading the 2023 rebrand and the Christmas campaign, and Director of Omnichannel Growth Strategy at Samsung Electronics across the UK and Europe.",
      ],
      credentials: [
        "Loop Earplugs / CCMO",
        "Beauty Pie / CMO",
        "Asda / Interim CMO",
        "Samsung Electronics / Omnichannel Growth",
        "McKinsey and Company",
        "Stanford GSB",
      ],
      owns: "The executive register. Stakeholder alignment, change management, board reporting, and the marketing thesis the AI layer has to defend.",
    },
    {
      id: "vince",
      name: "Vince Buyssens",
      role: "Forward-deployed AI operator / founder, Thoughtform",
      portrait: {
        src: "/images/vince-portrait.png",
        alt: "Vince Buyssens portrait",
      },
      bio: [
        "Forward-deployed creative technologist, embedded with marketing and creative teams since 2024. Founder of Thoughtform. Lead Creative Technologist at Loop Earplugs, where he scaled Claude from five to one hundred and thirty plus users, encoded twenty plus workflows as reusable Skills, and shipped four production tools alongside the teams that use them.",
        "Before Loop, AI Captain at StoryMe leading the first hybrid AI-video production in Belgium, AI Technical and Creative Director at Tool of North America on the Under Armour and Anthony Joshua campaign, and founder of Starhaven, one of Belgium's first AI consultancies for the creative industry.",
      ],
      credentials: [
        "Loop Earplugs / Lead Creative Technologist",
        "Thoughtform / Founder",
        "StoryMe / AI Captain",
        "Tool of North America / AI Director",
        "Thomas More / Cross-program AI Lead",
        "UBA / ACC / AI Charter co-author",
      ],
      owns: "The AI register. Embedded delivery, workflow encoding, governance with legal and IT, tool building, and the intelligence layer the work compounds into.",
    },
  ] satisfies readonly LoamFounder[],
  pairing: {
    eyebrow: "Why two seats",
    headline: "The exec half opens the room. The AI half ships the work inside it.",
    body: "Most AI consultancy is one or the other. A strategy deck that never lands inside the team, or an engineering pair that never reaches the executive table. We pair the two roles so the same engagement covers the boardroom and the working session, with one shared mandate.",
  },
} as const;

/* -----------------------------------------------------------------------
 * Testimonial
 * --------------------------------------------------------------------- */

export const loamTestimonial = {
  quote: "Vince pioneered how to integrate our AI products (Veo 3, Nano Banana 2) and non-Google AI into creative production, and how to upskill marketing teams to use them at scale.",
  name: "Betty Jakobsen",
  role: "Global and EMEA Export Marketing / Google",
} as const;

/* -----------------------------------------------------------------------
 * Close
 * --------------------------------------------------------------------- */

export const loamClose = {
  id: "close",
  eyebrow: "The ask",
  title: "Pick the function. Pick the quarter.",
  titleEm: "We deploy.",
  body: "If a function in your portfolio is ready to compound, we can run a two-week diagnostic inside it before the quarter starts. If you want to talk through the shape first, send a note.",
  actions: [
    {
      id: "email",
      label: "vince@thoughtform.co",
      href: "mailto:vince@thoughtform.co?subject=Loam",
      primary: true,
    },
    { id: "spectrum", label: "Walk the spectrum again", href: "#spectrum" },
  ],
} as const;

export const loamFooter = {
  line: "Loam / Forward-deployed AI / Embedded inside the work.",
  signature: "Co-founded by Vince Buyssens and Rob Weston / 2026.",
} as const;

/* -----------------------------------------------------------------------
 * Substrate direction — additive overlay used by /loam/substrate.
 *
 * Only the parts that differ from the Weave direction live here. The
 * shift cards, diagnosis cards, spectrum bands, method steps, scope
 * cards, offer cards, founders, testimonial, and close are reused from
 * the existing exports above without mutation.
 *
 * The substrate direction carries an engineering-document register:
 * DWG / FIG. / SCALE / STRATA / SECTION annotations sit next to the
 * content, and the hero reads as a forward-deployed practice rather
 * than a product. Voice rules carry over: no em dashes, no balanced
 * not-X-but-Y constructions, no filler authority words.
 * --------------------------------------------------------------------- */

export const loamSubstrate = {
  hero: {
    /* Enerblock-style technical kicker placed near the brand mark. */
    kind: "PRACTICE",
    operators: "TWO OPERATORS",
    est: "EST. 2026",
    drawing: "DWG-00 / LIVING LAYER",
    scale: "SCALE 1:1",

    /* Split headline thrown to opposite edges of the viewport. */
    left: "Loam",
    right: { lead: "the", em: "living layer." },

    /* Confident consultancy descriptor. Declarative, no balanced
       constructions, three beats that each carry distinct content. */
    descriptor:
      "A forward-deployed AI practice for creative work. Two operators embed inside one team for a quarter. The work ships under our hand, the judgment gets encoded as we go, and the intelligence layer stays in your repo.",

    actions: [
      { id: "engage", label: "Start a conversation", href: "#close", primary: true },
      { id: "substrate", label: "Walk the substrate", href: "#substrate" },
    ] as const,
  },

  /* Top-bar links scoped to the substrate IA. */
  nav: [
    { id: "shift", label: "Shift", href: "#shift" },
    { id: "diagnosis", label: "Diagnosis", href: "#diagnosis" },
    { id: "substrate", label: "Substrate", href: "#substrate" },
    { id: "method", label: "Method", href: "#method" },
    { id: "engage", label: "Engage", href: "#engage" },
    { id: "founders", label: "Founders", href: "#founders" },
  ] as const,

  /* Per-section technical annotations rendered by <SubstrateFigure/>. */
  figs: {
    hero: { label: "DWG-00", caption: "Living layer / SCALE 1:1" },
    shift: { label: "FIG. 01-04", caption: "Frontier ledger" },
    diagnosis: { label: "STRATA 01-04", caption: "Core sample" },
    substrate: { label: "SECTION A-A", caption: "Living layer / cross-section" },
    spectrum: { label: "SPAN 01-03", caption: "Production / Adoption / Automation" },
    method: { label: "PHASE 01-03", caption: "Navigate / Encode / Build" },
    scope: { label: "BAND 01-04", caption: "Executive depth" },
    engage: { label: "TIER 01-03", caption: "Engagement ladder" },
    founders: { label: "PAIR / 02", caption: "Operators" },
    close: { label: "ASK / FINAL", caption: "Engagement" },
  },

  /* Anti-positioning frame used inside the Scope section. Declarative,
     no not-X-but-Y, no forced triad. */
  scopeFrame: {
    overline: "What this is",
    statement: "Loam is consulting, sold by the quarter.",
    body: "Two operators embed inside one team for the duration. The work ships under our hand and the judgment gets encoded as we go. What we leave behind is the intelligence layer every future AI tool inherits from.",
  },

  /* The Engage ladder header for the substrate direction. */
  tiers: {
    overline: "Engage",
    headline: "Three tiers.",
    headlineEm: "One operating model.",
    body: "The check size scales with the scope of the embed.",
    tagline: "Pricing on request.",
    footnote: "The shape Anthropic and OpenAI now sell to the enterprise. We have run it inside marketing for two years.",
  },

  /* Engineering-document colophon for the footer band. */
  colophon: {
    drawing: "DWG-00",
    title: "LIVING LAYER",
    est: "EST. 2026",
    scale: "SCALE 1:1",
    authors: "VINCE BUYSSENS / ROB WESTON",
    statement: "Forward-deployed AI for creative work.",
  },

  /* Close section overrides for the substrate direction. */
  close: {
    overline: "ASK / FINAL",
    title: "Pick the function.",
    titleEm: "Pick the quarter.",
    titleAfter: "We deploy.",
    body: "If a function in your portfolio is ready to compound, we can run a two-week diagnostic inside it before the quarter starts. If you want to talk through the shape first, send a note.",
  },
} as const;

import type { Metadata } from "next";
import { ScrollReveal } from "../reveal";

/*
 * HarvestFields case · long-form companion to /ai-operator.
 *
 * The /ai-operator landing page introduces HarvestFields in three
 * compressed pillars (diagnosis, reframe, architecture). This route
 * is the deeper read: the same case, told as a narrative of strategic
 * moves, with the engine architecture and validation loop spelled out.
 *
 * The point of this page is to show how I think — strategy and
 * building staying in the same hands. Synthetic client. Real
 * architecture. Real corpus pipeline (243 chunks, source-attributed).
 *
 * Arc:
 *   01 Hero            — Name the case, name the move.
 *   02 Brief           — What was on the table.
 *   03 Decision        — One engine for two workflows.
 *   04 Diagnosis       — Speed + control share one root cause.
 *   05 Reframe         — Encode the judgment, not the wording.
 *   06 Architecture    — Engine / protocol / surfaces.
 *   07 Harness         — How the engine is assembled.
 *   08 Validation      — Navigate / Encode / Build, owned by the team.
 *   09 Sprint handoff  — What the team takes home.
 *   10 CTA             — Back to operator + email.
 */

export const metadata: Metadata = {
  title: "HarvestFields · Case · Vincent Buyssens",
  description:
    "A working brand-engine prototype demonstrating the embedded operator pattern: encode brand judgment once, run it across localisation and review, expose it headlessly so every surface inherits the same substrate.",
  robots: { index: true, follow: true },
};

const meta = {
  brandLeft: "Vincent Buyssens",
  brandSub: "Case · HarvestFields",
  status: "Engine v2.0 · synthetic client",
  back: { label: "Back to /ai-operator", href: "/ai-operator" },
} as const;

const hero = {
  eyebrow: "Selected case · 2026",
  title: "Brand speed and brand safety,",
  titleEm: "as the same system.",
  lede:
    "A working prototype I built to demonstrate the operating model on a brand the size of Vandemoortele. Two workflows that look like two problems — localisation needs speed, review needs control — share the same root cause: brand memory is unencoded. Encode it once, both problems shrink.",
  meta: [
    { k: "BRAND", v: "Synthetic · grounded corpus" },
    { k: "ENGINE", v: "v2.0 · headless" },
    { k: "SUBSTRATE", v: "243 chunks · 5 drift categories" },
    { k: "PROOF", v: "Real architecture · synthetic data" },
  ],
  panel: {
    title: "HarvestFields",
    sub: "Brand engine · v2.0",
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
  },
};

const brief = {
  eyebrow: "01 · The brief",
  title: "Two RFPs.",
  titleEm: "On the same week. On the same brand.",
  body: [
    "A multi-brand food group, ~6,000 employees, eight markets, double-digit brand portfolio. Marketing wants a localisation tool that respects the voice rails. Brand wants a review tool that catches drift before it reaches campaign.",
    "On the surface this is two RFPs that go to two vendors. The trap is to deliver two demos.",
    "The decision was to deliver one.",
  ],
} as const;

const decision = {
  eyebrow: "02 · The decision",
  title: "Build one governed brand engine.",
  titleEm: "Run it twice.",
  body:
    "Localise drafts. Review checks. Both inherit the same encoded brand: voice rules, claim registry, audience register, examples, eval cases. The engine doesn't change posture by re-prompting. It changes posture by inheriting different harness gates.",
  pairs: [
    {
      id: "localise",
      label: "LOCALISE",
      role: "Drafts and checks",
      surfaces: "Marketing · agency briefings",
    },
    {
      id: "review",
      label: "REVIEW",
      role: "Check only",
      surfaces: "Brand stewards · campaign QA",
    },
  ],
} as const;

const diagnosis = {
  eyebrow: "03 · The diagnosis",
  title: "Two problems.",
  titleEm: "One missing piece of substrate.",
  body:
    "Localise needs speed. Every market team rebuilds the brand from scratch. Review needs control. Every campaign invents the brand again. Both lose against the same root cause: voice, claims, audience register live in PDFs, lead heads, Slack threads. Brand memory is unencoded.",
  rows: [
    {
      n: "01",
      label: "LOCALISE · SPEED",
      lead: "Every team rebuilds the brand.",
      body: "5–8 adaptations per campaign. In-market quality drift. Founder's voice gets diluted by the third translation.",
    },
    {
      n: "02",
      label: "REVIEW · CONTROL",
      lead: "Every prompt invents the brand.",
      body: "Ad-hoc AI use across teams. Claims flagged in Q1 because nobody encoded which ones are safe. Brand stewards become the throttle.",
    },
    {
      n: "03",
      label: "SHARED GAP",
      lead: "Brand memory is unencoded.",
      body: "Voice, tone, claims, facts. Encode it once. Both problems shrink.",
    },
  ],
} as const;

const reframe = {
  eyebrow: "04 · The reframe",
  title: "Don't automate the wording.",
  titleEm: "Encode the judgment.",
  body:
    "The work is not generating more copy. The work is making the brand legible to the model. Encode the judgment once, and the model has the brand to work from. The Skill is not a prompt. It is a governed operating contract: voice rules, claim registry, audience register, examples, eval cases — versioned, reviewable, owned by the team.",
  contract: [
    { tag: "VOICE", body: "Rules. House style. Sentence rhythm." },
    { tag: "CLAIMS", body: "Registry. What's approved, what needs legal." },
    { tag: "AUDIENCE", body: "Register. Trade vs consumer vs internal." },
    { tag: "EXAMPLES", body: "What good looks like. Past work, encoded." },
    { tag: "EVALS", body: "Cases the harness runs on every change." },
  ],
  freedom: [
    { id: "low", label: "LOW · locked", body: "Banned terms, legal claims, product facts." },
    { id: "mid", label: "MEDIUM · guided", body: "Audience register, localisation register." },
    { id: "high", label: "HIGH · interpretive", body: "Headlines, rhythm, campaign framing." },
  ],
} as const;

const architecture = {
  eyebrow: "05 · The architecture",
  title: "Build the engine,",
  titleEm: "not the dashboard.",
  body:
    "The dashboard is the most legible face. The durable deliverable is the headless capability underneath. Three layers, end-to-end git-versioned. One update, every surface inherits.",
  layers: [
    {
      id: "engine",
      tag: "ENGINE",
      title: "Skill + knowledge graph + eval + corpus.",
      body: "One markdown contract carrying voice, audience, claims. A grounded corpus (243 chunks, source-attributed) provides retrieval. A synthetic dataset grades it. The asset that survives the model swap.",
    },
    {
      id: "protocol",
      tag: "PROTOCOL",
      title: "API · MCP · Copilot Studio · Power Automate.",
      body: "Each surface is just a way to invoke the same engine. Web app for the design team. MCP for Claude. Copilot Studio for the marketing operator. Power Automate for the approval flow.",
    },
    {
      id: "surfaces",
      tag: "SURFACES",
      title: "Web · Teams · SharePoint · SAP · Slack · CLI.",
      body: "The interface comes last. The substrate stays single-source. When the next surface comes online, it inherits the brand without rebuilding it.",
    },
  ],
} as const;

const harness = {
  eyebrow: "06 · The harness",
  title: "How the engine assembles itself.",
  titleEm: "Stage by stage.",
  body:
    "Quality is a gate, not a score. Every run becomes an eval case. The harness is what turns a one-off prompt into an operating system.",
  stages: [
    { n: "01", title: "Trap", body: "The dashboard is not the product." },
    { n: "02", title: "Navigate", body: "Surface the brand judgment from the team." },
    { n: "03", title: "Evidence", body: "One library, two jobs." },
    { n: "04", title: "Skill", body: "Set the freedom bands." },
    { n: "05", title: "Run", body: "Choose the workstream — localise or review." },
    { n: "06", title: "Eval rail", body: "Every run becomes a review case." },
    { n: "07", title: "Connect", body: "The surface comes last." },
  ],
} as const;

const validation = {
  eyebrow: "07 · The validation loop",
  title: "Validation belongs to",
  titleEm: "the team that owns the brand.",
  body:
    "The harness isn't a score the engine produces. It's where brand and localisation run the same Navigate, Encode, Build loop daily on real work. The engine doesn't replace judgment. It makes judgment visible, reusable, and inheritable.",
  cycle: [
    { id: "navigate", n: "01", verb: "NAVIGATE", body: "See drift in real drafts." },
    { id: "encode", n: "02", verb: "ENCODE", body: "Patch the Skill or registry." },
    { id: "build", n: "03", verb: "BUILD", body: "Re-run the engine on the next batch." },
  ],
} as const;

const sprint = {
  eyebrow: "08 · The sprint handoff",
  title: "Encode and Build are proven.",
  titleEm: "Now the team learns to feed it.",
  body:
    "The prototype proves the substrate. The flywheel only turns when the team stays close enough to the work to keep surfacing what the engine should inherit next. The sprint promise: six weeks, five champions, three things the director can point to.",
  takeaways: [
    "Brand engine running on the team's own brand book.",
    "Five trained champions who can encode the next workflow.",
    "Eval queue feeding back into the Skill, every week.",
  ],
} as const;

const cta = {
  eyebrow: "Want the walk-through?",
  title: "Same engine.",
  titleEm: "Different brand.",
  body:
    "I can run the same case on a brand of your choosing — with synthetic data above the line and your own voice book underneath. The walk-through takes about 45 minutes; the deliverable takes a sprint.",
  primary: {
    label: "vince@thoughtform.co",
    href: "mailto:vince@thoughtform.co?subject=HarvestFields%20case%20%C2%B7%20walk-through",
  },
  secondary: { label: "Back to /ai-operator", href: "/ai-operator" },
} as const;

function Arrow() {
  return (
    <span className="aiop-button__arrow" aria-hidden="true">
      →
    </span>
  );
}

export default function HarvestFieldsCase() {
  return (
    <main className="aiop-stage">
      <ScrollReveal />

      {/* Header */}
      <header className="aiop-header">
        <div className="aiop-wrap aiop-header__inner">
          <a className="aiop-brand" href="/ai-operator">
            <span className="aiop-brand__mark">
              <span className="aiop-brand__diamond" aria-hidden="true" />
              <span className="aiop-brand__name">{meta.brandLeft}</span>
            </span>
            <span className="aiop-brand__sub">{meta.brandSub}</span>
          </a>
          <span aria-hidden="true" />
          <a className="aiop-header__cta" href={meta.back.href}>
            <span className="aiop-header__cta-pulse" aria-hidden="true" />
            {meta.back.label}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="aiop-hero" id="top">
        <div className="aiop-grid-bg" aria-hidden="true" />
        <div className="aiop-wrap aiop-hero__inner">
          <div className="aiop-hero__copy aiop-reveal">
            <p className="aiop-eyebrow">
              <span className="aiop-slash" aria-hidden="true" />
              {hero.eyebrow}
            </p>
            <h1 className="aiop-hero__title">
              <span className="aiop-hero__title-line">{hero.title}</span>
              <span className="aiop-hero__title-line">
                <em>{hero.titleEm}</em>
              </span>
            </h1>
            <p className="aiop-hero__lede">{hero.lede}</p>
            <dl className="aiop-hero__meta">
              {hero.meta.map((row) => (
                <div key={row.k} className="aiop-hero__meta-row">
                  <dt className="aiop-hero__meta-k">{row.k}</dt>
                  <dd className="aiop-hero__meta-v">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside
            className="aiop-case__panel aiop-reveal"
            aria-label="Engine snapshot"
            style={{ alignSelf: "stretch" }}
          >
            <header className="aiop-case__panel-head">
              <strong>{hero.panel.title}</strong>
              <span>{hero.panel.sub}</span>
            </header>
            <div className="aiop-case__metrics" role="list">
              {hero.panel.metrics.map((m) => (
                <div key={m.k} className="aiop-case__metric" role="listitem">
                  <span className="aiop-case__metric-v">{m.v}</span>
                  <span className="aiop-case__metric-k">{m.k}</span>
                </div>
              ))}
            </div>
            <ul className="aiop-case__endpoints" role="list">
              {hero.panel.endpoints.map((e) => (
                <li key={e.path} className="aiop-case__endpoint">
                  <span className="aiop-case__endpoint-method">{e.method}</span>
                  <span className="aiop-case__endpoint-path">{e.path}</span>
                  <span className="aiop-case__endpoint-state">{e.state}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* 01 · Brief */}
      <section className="aiop-section aiop-section--tight">
        <div className="aiop-wrap">
          <div className="aiop-reveal">
            <p className="aiop-eyebrow aiop-eyebrow--ink">{brief.eyebrow}</p>
            <h2 className="aiop-section-title">
              {brief.title} <em>{brief.titleEm}</em>
            </h2>
          </div>
          <div
            className="aiop-reveal"
            style={{
              marginTop: 28,
              display: "grid",
              gap: 16,
              maxWidth: "60ch",
            }}
          >
            {brief.body.map((para, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.6,
                  color: "var(--aiop-ink-soft)",
                  margin: 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 02 · Decision */}
      <section className="aiop-section aiop-section--tight aiop-motions">
        <div className="aiop-wrap">
          <div className="aiop-reveal" style={{ marginBottom: 40 }}>
            <p className="aiop-eyebrow">{decision.eyebrow}</p>
            <h2 className="aiop-section-title">
              {decision.title} <em>{decision.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{decision.body}</p>
          </div>

          <div className="aiop-motions__grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {decision.pairs.map((pair, idx) => (
              <article
                key={pair.id}
                className={`aiop-motion ${idx === 0 ? "aiop-motion--build" : "aiop-motion--coach"} aiop-reveal`}
              >
                <header className="aiop-motion__head">
                  <span className="aiop-motion__n">{pair.label}</span>
                  <span className="aiop-motion__name">Workstream</span>
                </header>
                <h3 className="aiop-motion__headline">{pair.role}</h3>
                <p className="aiop-motion__body">
                  Used by {pair.surfaces}. Inherits the same engine, the same
                  Skill, the same evidence, the same harness.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · Diagnosis */}
      <section className="aiop-section aiop-section--tight">
        <div className="aiop-wrap">
          <div className="aiop-reveal" style={{ marginBottom: 40 }}>
            <p className="aiop-eyebrow">{diagnosis.eyebrow}</p>
            <h2 className="aiop-section-title">
              {diagnosis.title} <em>{diagnosis.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{diagnosis.body}</p>
          </div>

          <div className="aiop-pillars">
            {diagnosis.rows.map((row, idx) => (
              <section
                key={row.n}
                className={`aiop-pillar-row ${idx === 1 ? "aiop-pillar-row--sage" : idx === 2 ? "aiop-pillar-row--slate" : ""} aiop-reveal`}
              >
                <div className="aiop-pillar-row__label">
                  <span
                    className={`aiop-dot${idx === 1 ? " aiop-dot--sage" : idx === 2 ? " aiop-dot--slate" : ""}`}
                    aria-hidden="true"
                  />
                  {row.label}
                </div>
                <div>
                  <h3 className="aiop-pillar-row__lead">{row.lead}</h3>
                  <p
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: "var(--aiop-ink-soft)",
                      margin: 0,
                    }}
                  >
                    {row.body}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · Reframe */}
      <section className="aiop-section aiop-section--tight aiop-case">
        <div className="aiop-wrap">
          <div className="aiop-reveal" style={{ marginBottom: 40 }}>
            <p className="aiop-eyebrow">{reframe.eyebrow}</p>
            <h2 className="aiop-section-title">
              {reframe.title} <em>{reframe.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{reframe.body}</p>
          </div>

          <div className="aiop-case__body">
            <div className="aiop-case__pillars aiop-reveal">
              {reframe.contract.map((item) => (
                <article key={item.tag} className="aiop-case__pillar">
                  <span className="aiop-case__pillar-n">{item.tag}</span>
                  <div>
                    <p
                      className="aiop-case__pillar-body"
                      style={{ fontSize: 15 }}
                    >
                      {item.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <aside
              className="aiop-case__panel aiop-reveal"
              aria-label="Degrees of freedom"
            >
              <header className="aiop-case__panel-head">
                <strong>Degrees of freedom</strong>
                <span>per Skill section</span>
              </header>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: 1,
                  background: "rgba(243,236,224,0.08)",
                  border: "1px solid rgba(243,236,224,0.08)",
                }}
              >
                {reframe.freedom.map((f) => (
                  <li
                    key={f.id}
                    style={{
                      background: "#15110d",
                      padding: "14px 16px",
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--aiop-mono)",
                        fontSize: 11,
                        letterSpacing: "0.16em",
                        color: "var(--aiop-gold-bright)",
                      }}
                    >
                      {f.label}
                    </span>
                    <span
                      style={{
                        color: "rgba(243,236,224,0.85)",
                        fontSize: 13.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {f.body}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* 05 · Architecture */}
      <section className="aiop-section aiop-section--tight">
        <div className="aiop-wrap">
          <div className="aiop-reveal" style={{ marginBottom: 40 }}>
            <p className="aiop-eyebrow">{architecture.eyebrow}</p>
            <h2 className="aiop-section-title">
              {architecture.title} <em>{architecture.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{architecture.body}</p>
          </div>

          <div className="aiop-pillars">
            {architecture.layers.map((l, idx) => (
              <section
                key={l.id}
                className={`aiop-pillar-row ${idx === 1 ? "aiop-pillar-row--sage" : idx === 2 ? "aiop-pillar-row--slate" : ""} aiop-reveal`}
              >
                <div className="aiop-pillar-row__label">
                  <span
                    className={`aiop-dot${idx === 1 ? " aiop-dot--sage" : idx === 2 ? " aiop-dot--slate" : ""}`}
                    aria-hidden="true"
                  />
                  {l.tag}
                </div>
                <div>
                  <h3 className="aiop-pillar-row__lead">{l.title}</h3>
                  <p
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: "var(--aiop-ink-soft)",
                      margin: 0,
                    }}
                  >
                    {l.body}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* 06 · Harness */}
      <section className="aiop-section aiop-section--tight aiop-motions">
        <div className="aiop-wrap">
          <div className="aiop-reveal" style={{ marginBottom: 40 }}>
            <p className="aiop-eyebrow">{harness.eyebrow}</p>
            <h2 className="aiop-section-title">
              {harness.title} <em>{harness.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{harness.body}</p>
          </div>

          <div
            className="aiop-motions__grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            {harness.stages.map((s, idx) => {
              const tones = ["navigate", "build", "coach", "scale"] as const;
              return (
                <article
                  key={s.n}
                  className={`aiop-motion aiop-motion--${tones[idx % 4]} aiop-reveal`}
                  style={{ padding: "20px 18px 18px" }}
                >
                  <header className="aiop-motion__head">
                    <span className="aiop-motion__n">{s.n}</span>
                  </header>
                  <h3
                    className="aiop-motion__headline"
                    style={{ fontSize: 19 }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="aiop-motion__body"
                    style={{ fontSize: 13.5 }}
                  >
                    {s.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 · Validation */}
      <section className="aiop-section aiop-section--tight aiop-case">
        <div className="aiop-wrap">
          <div className="aiop-reveal" style={{ marginBottom: 40 }}>
            <p className="aiop-eyebrow">{validation.eyebrow}</p>
            <h2 className="aiop-section-title">
              {validation.title} <em>{validation.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{validation.body}</p>
          </div>

          <div
            className="aiop-motions__grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {validation.cycle.map((c) => (
              <article
                key={c.id}
                className={`aiop-motion aiop-motion--${c.id} aiop-reveal`}
              >
                <header className="aiop-motion__head">
                  <span className="aiop-motion__n">{c.n}</span>
                  <span className="aiop-motion__name">{c.verb}</span>
                </header>
                <h3 className="aiop-motion__headline">{c.body}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 08 · Sprint handoff */}
      <section className="aiop-section aiop-section--tight">
        <div className="aiop-wrap">
          <div className="aiop-reveal" style={{ marginBottom: 32 }}>
            <p className="aiop-eyebrow">{sprint.eyebrow}</p>
            <h2 className="aiop-section-title">
              {sprint.title} <em>{sprint.titleEm}</em>
            </h2>
            <p className="aiop-section-lede">{sprint.body}</p>
          </div>

          <ul
            className="aiop-reveal"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gap: 14,
              maxWidth: "60ch",
            }}
          >
            {sprint.takeaways.map((t) => (
              <li
                key={t}
                style={{
                  position: "relative",
                  paddingLeft: 28,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--aiop-ink)",
                  fontFamily: "var(--aiop-display)",
                  fontWeight: 500,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    width: 18,
                    height: 1,
                    background: "var(--aiop-gold-bright)",
                  }}
                />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 09 · CTA */}
      <section className="aiop-section aiop-section--tight aiop-cta" id="cta">
        <div className="aiop-wrap aiop-cta__grid">
          <div className="aiop-reveal">
            <p className="aiop-eyebrow aiop-eyebrow--ink">{cta.eyebrow}</p>
            <h2 className="aiop-cta__title">
              {cta.title} <em>{cta.titleEm}</em>
            </h2>
            <p className="aiop-cta__body">{cta.body}</p>
          </div>
          <div className="aiop-cta__actions aiop-reveal">
            <a className="aiop-button" href={cta.primary.href}>
              {cta.primary.label}
              <Arrow />
            </a>
            <a className="aiop-button aiop-button--ghost" href={cta.secondary.href}>
              {cta.secondary.label}
              <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="aiop-footer">
        <div className="aiop-wrap aiop-footer__inner">
          <span>HarvestFields · case · synthetic data, real architecture</span>
          <span>{meta.status}</span>
          <span>Vincent Buyssens · Antwerp</span>
        </div>
      </footer>
    </main>
  );
}

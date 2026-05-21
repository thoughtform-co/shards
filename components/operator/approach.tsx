"use client";

import { useCallback, useState, type ReactNode } from "react";
import {
  approachOutcome,
  approachSection,
  approachSteps,
  type ApproachHandoff,
  type ApproachStep,
  type EngineVisual,
  type RolloutVisual,
  type SubstrateVisual,
} from "@/content/operator";
import { OperatorModal } from "./operator-modal";

/* Split a paragraph at the end of its first sentence so the
 * `collapsibleBody` variant can keep the leading sentence in clear
 * view and fade out the rest behind a toggle. Matches `.`, `!`, or
 * `?` followed by whitespace; falls back to a single-clause body if
 * no terminator is found. */
function splitFirstSentence(text: string): {
  first: string;
  rest: string | null;
} {
  const match = text.match(/^[^.!?]*[.!?]/);
  if (!match) return { first: text, rest: null };
  const first = match[0].trim();
  const rest = text.slice(match[0].length).trim();
  return { first, rest: rest.length > 0 ? rest : null };
}

/*
 * Approach — Navigate, Encode, Build.
 *
 * Three self-contained method sections. Each row pairs a copy column
 * (number, verb, headline, body, signal, "practice in motion" CTA)
 * with an executive-level visual that reflects how the motion plays
 * out in real cohorts. The button opens a Heimdall-style modal that
 * goes one level deeper: how the work runs, what it produced.
 *
 * `section`, `steps`, and `outcome` props let route variants
 * override the copy without touching the home page wiring.
 */
export function Approach({
  section = approachSection,
  steps = approachSteps,
  outcome = approachOutcome,
  collapsibleBody = false,
  showOutcome = true,
}: {
  section?: { title: string; titleEm: string; caption: string };
  steps?: ApproachStep[];
  outcome?: {
    eyebrow: string;
    headline: string;
    body: string;
    achievements: { n: string; label: string; body: string }[];
  };
  /* When true (currently `/`, the intelligence-layer page that was
   * promoted to the site root), each step's body paragraph keeps
   * its first sentence in clear view while the rest fades to a
   * quiet preview. A small "Read more" toggle below pulls the
   * faded portion back to full opacity; clicking again restores
   * the faded preview. Layout heights stay stable in both states
   * so the section never jumps. Homepage variants that don't pass
   * `collapsibleBody` show the entire body inline (legacy
   * behaviour). */
  collapsibleBody?: boolean;
  /* When false, the trailing OUTCOME aside (Embedded teams run the
   * program on their own + four achievement cards) is hidden. Used
   * by route forks that want to hand off to a different closing
   * chapter directly after the three approach steps (e.g. the
   * /claude-workshop-v1 fork inserts its own Claude getting-started
   * chapter where the outcome would normally land). Defaults to
   * true so every existing call site keeps the outcome. */
  showOutcome?: boolean;
} = {}) {
  const [open, setOpen] = useState<ApproachStep | null>(null);
  /* Per-step expanded state for the collapsible body. Keyed by
   * `step.id` so navigating between steps preserves the user's
   * choice on each one. */
  const [expandedBodies, setExpandedBodies] = useState<Set<string>>(
    () => new Set(),
  );
  const toggleExpanded = useCallback((id: string) => {
    setExpandedBodies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <section className="aiop-section aiop-approach" id="approach">
      <div className="aiop-wrap">
        <header className="aiop-approach__head aiop-reveal">
          <h2 className="aiop-section-title">
            {section.title} <em>{section.titleEm}</em>
          </h2>
          <p className="aiop-approach__caption">{section.caption}</p>
        </header>

        <ol className="aiop-approach__list" role="list">
          {steps.map((step, idx) => (
            <li
              key={step.id}
              className={[
                "aiop-approach__step",
                `aiop-approach__step--${step.tone}`,
                `aiop-approach__step--${step.id}`,
                idx % 2 === 1 ? "aiop-approach__step--reverse" : "",
                "aiop-reveal",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="aiop-approach__copy">
                <header className="aiop-approach__head-row">
                  <h3 className="aiop-approach__label">
                    <span className="aiop-approach__label-dot" aria-hidden="true" />
                    {step.label}
                  </h3>
                </header>
                <p className="aiop-approach__headline">{step.headline}</p>
                {collapsibleBody ? (
                  (() => {
                    const { first, rest } = splitFirstSentence(step.body);
                    if (rest === null) {
                      /* No second sentence to fade out — render the
                         whole body as-is and skip the toggle. */
                      return <p className="aiop-approach__body">{first}</p>;
                    }
                    const isExpanded = expandedBodies.has(step.id);
                    return (
                      <div
                        className="aiop-approach__body-stack"
                        data-expanded={isExpanded}
                      >
                        <p className="aiop-approach__body aiop-approach__body--first">
                          {first}
                        </p>
                        {/* Rest paragraph lives in a height-collapsing
                            container so the default state is "first
                            sentence only". Expanding slides the rest
                            into view and fades it in (height +
                            opacity transition). aria-hidden tracks
                            visibility so SR users skip the collapsed
                            chunk. */}
                        <div className="aiop-approach__body-collapser">
                          <p
                            className="aiop-approach__body aiop-approach__body--rest"
                            aria-hidden={!isExpanded}
                          >
                            {rest}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="aiop-approach__body-toggle"
                          aria-expanded={isExpanded}
                          onClick={() => toggleExpanded(step.id)}
                        >
                          <span
                            className="aiop-approach__body-toggle-icon"
                            aria-hidden="true"
                          />
                          <span className="aiop-approach__body-toggle-label">
                            {isExpanded ? "Show less" : "Read more"}
                          </span>
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <p className="aiop-approach__body">{step.body}</p>
                )}
                <dl className="aiop-approach__signal">
                  <dt>{step.signal.k}</dt>
                  <dd>{step.signal.v}</dd>
                </dl>
              </div>
              <div className="aiop-approach__visual">
                {step.visual.kind === "rollout" && (
                  <RolloutCard
                    visual={step.visual}
                    onPractice={() => setOpen(step)}
                  />
                )}
                {step.visual.kind === "substrate" && (
                  <SubstrateCard
                    visual={step.visual}
                    /* Visual inheritance: Encode's INPUTS show a
                       compressed mini version of Navigate's stage
                       rail, so the card literally renders "what
                       comes in" from the previous phase. */
                    inheritedFrom={(() => {
                      const prev = steps[idx - 1];
                      if (!prev || prev.visual.kind !== "rollout") return undefined;
                      return {
                        fromPhase: "Navigate" as const,
                        items: prev.visual.stages.map((s) => ({
                          tag: s.tag,
                          label: s.label,
                        })),
                        separator: "arrow" as const,
                      };
                    })()}
                    onPractice={() => setOpen(step)}
                  />
                )}
                {step.visual.kind === "engine" && (
                  <EngineCard
                    visual={step.visual}
                    /* Visual inheritance: Build's INPUTS show a
                       compressed mini version of Encode's substrate
                       table (just the four tag names), so the
                       visitor sees the substrate going into the
                       engine. */
                    inheritedFrom={(() => {
                      const prev = steps[idx - 1];
                      if (!prev || prev.visual.kind !== "substrate") return undefined;
                      return {
                        fromPhase: "Encode" as const,
                        items: prev.visual.layers.map((l) => ({ tag: l.tag })),
                        separator: "bullet" as const,
                      };
                    })()}
                    onPractice={() => setOpen(step)}
                  />
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* Outcome card — names self-sufficiency as the visible result
            of the three phases turning together. The five-stage ladder
            mirrors the Stripe FDA job posting language verbatim and
            rhymes with the Stripe teaser's `Self-sufficiency loop`
            capability further down the page. Visual posture mirrors
            `.aiop-diagnosis__gap` (centered card with diamond markers)
            so the section opens (diagnosis gap) and closes (approach
            outcome) on the same typographic gesture. Suppressed when
            the route fork passes `showOutcome={false}` (e.g.
            /claude-workshop-v1, which hands off to its own
            getting-started chapter instead). */}
        {showOutcome ? (
          <aside
            className="aiop-approach__outcome aiop-reveal"
            aria-labelledby="aiop-approach-outcome-headline"
          >
            <p className="aiop-approach__outcome-eyebrow">
              {outcome.eyebrow}
            </p>
            <h3
              className="aiop-approach__outcome-headline"
              id="aiop-approach-outcome-headline"
            >
              {outcome.headline}
            </h3>
            <p className="aiop-approach__outcome-body">
              {outcome.body}
            </p>
            {/* Four concrete achievement cards across teams. Replaces
                the earlier 5-stage maturity ladder so the Outcome lands
                as proof, not as a generic progression. Each card seeds a
                section that follows further down the page (Build body,
                Why-build-custom-tools, Cases, Headless / Substrate-map),
                so this card reads forward as well as backward. */}
            <ol className="aiop-approach__outcome-achievements" role="list">
              {outcome.achievements.map((achievement) => (
                <li
                  key={achievement.n}
                  className="aiop-approach__outcome-card"
                  data-aiop-achievement={achievement.n}
                >
                  {/* Header row: small mono number sits inline next to
                      the label, baseline-aligned, so the label reads as
                      the primary anchor and the number stays as a quiet
                      counter. Replaces the earlier stacked layout where
                      the team name was getting lost above the body. */}
                  <header className="aiop-approach__outcome-card-head">
                    <span className="aiop-approach__outcome-card-n">
                      {achievement.n}
                    </span>
                    <span className="aiop-approach__outcome-card-label">
                      {achievement.label}
                    </span>
                  </header>
                  <p className="aiop-approach__outcome-card-body">
                    {achievement.body}
                  </p>
                </li>
              ))}
            </ol>
          </aside>
        ) : null}
      </div>

      <OperatorModal
        open={open !== null}
        onClose={() => setOpen(null)}
        accent={open ? toneAccent(open.tone) : undefined}
        ariaLabel={open ? `${open.label} · practice` : "Practice"}
      >
        {open ? <ApproachModalBody step={open} /> : null}
      </OperatorModal>
    </section>
  );
}

/* ─── Visuals ──────────────────────────────────────────────────────── */

/*
 * Inheritance card — a collapsed version of the previous phase's
 * framed lane rendered in the INPUTS row of Encode and Build. Makes
 * the flywheel literal: Encode receives a mini Navigate lane; Build
 * receives a mini Encode lane. Navigate has no previous phase, so it
 * falls back to the light text chips below.
 */
type ApproachInheritedStrip = {
  fromPhase: "Navigate" | "Encode";
  items: { tag: string; label?: string }[];
  /* Arrow separators for sequential things (Navigate's stages);
   * bullet separators for categorical things (Encode's layers). */
  separator: "arrow" | "bullet";
};

/*
 * Shared shell for all three flywheel visual cards. Renders the
 * common scaffolding once — INPUTS row (collapsed inherited lane OR
 * text chips), phase-specific framed lane, OUTPUTS chip row with
 * optional handoff marker, and the "See how it runs" CTA — so
 * Navigate / Encode / Build read as one artifact at three stages
 * instead of three different artifacts.
 *
 * Each variant card (`RolloutCard` / `SubstrateCard` / `EngineCard`)
 * passes its phase-specific dark-core content through `children`.
 * Per-tone visual signals (chip dot colour, phase pill, CTA accent)
 * cascade through `.aiop-approach__step--violet/gold/sage` set on
 * the parent `<li>` step, so the shell doesn't need to know the
 * tone directly.
 */
function ApproachCardShell({
  phase,
  laneLabel,
  inputs,
  outputs,
  handoffTo,
  inheritedFrom,
  onPractice,
  children,
}: {
  phase: "Navigate" | "Encode" | "Build";
  /* Mono-caps label shown above the artifact inside the lane —
   * names the asset (e.g. "Workshop ladder", "Encoded substrate",
   * "Headless interface"). Matches the `.aiop-shift__lane-label`
   * pattern used by the Headless-shift section so the visual
   * vocabulary stays consistent. The previous outer-card
   * descriptor eyebrow (`visual.sub`) is no longer rendered — the
   * notched pill on the lane edge + this inner label do the
   * identification job the eyebrow used to do, with less
   * scaffolding. */
  laneLabel: string;
  inputs: string[];
  outputs: string[];
  handoffTo?: ApproachHandoff;
  inheritedFrom?: ApproachInheritedStrip;
  onPractice: () => void;
  children: ReactNode;
}) {
  const phaseSlug = phase.toLowerCase();
  return (
    <article className="aiop-approach-card">
      <section className="aiop-approach-card__chips-block aiop-approach-card__chips-block--inputs">
        <p className="aiop-approach-card__chips-label">
          Inputs
          {inheritedFrom ? (
            <span className="aiop-approach-card__chips-from">
              {" "}
              <span aria-hidden="true">·</span> from {inheritedFrom.fromPhase}
            </span>
          ) : null}
        </p>
        {inheritedFrom ? (
          <>
            <InheritedPhaseCard inheritedFrom={inheritedFrom} />
            {/* Conceptual caption below the collapsed card — names the actual
                artifacts the previous phase produced (e.g. "AI
                intuition", "Workflow brief", "A versioned Skill"),
                kept as a quiet line so the mini lane stays the
                primary visual. */}
            <p className="aiop-approach-card__inheritance-caption">
              <span
                className="aiop-approach-card__inheritance-arrow"
                aria-hidden="true"
              >
                ↳
              </span>{" "}
              {inputs.join(" · ")}
            </p>
          </>
        ) : (
          <ul className="aiop-approach-card__chips" role="list">
            {inputs.map((input) => (
              <li key={input} className="aiop-approach-card__chip">
                <span
                  className="aiop-approach-card__chip-dot"
                  aria-hidden="true"
                />
                {input}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Phase frame — mirrors the `.aiop-shift__lane` chrome used by
          the Headless-shift section so the page reads with one
          consistent wrapper-and-pill vocabulary. Light interior
          with a phase-tone halo border; a `● PHASE` pill is notched
          onto the top edge as the single phase identifier (replacing
          the old outer-card phase pill + descriptor eyebrow header).
          The lane label sits inside as a mono-caps caption above
          the artifact, and `sub` lands as a small badge on the
          right side of the lane head. */}
      <section
        className={`aiop-approach-card__lane aiop-approach-card__lane--${phaseSlug}`}
        aria-label={phase}
      >
        <span
          className={`aiop-approach-card__pill aiop-approach-card__pill--${phaseSlug}`}
        >
          <span
            className="aiop-approach-card__pill-dot"
            aria-hidden="true"
          />
          {phase}
        </span>

        <p className="aiop-approach-card__lane-label">{laneLabel}</p>

        {children}
      </section>

      <section className="aiop-approach-card__chips-block aiop-approach-card__chips-block--outputs">
        <p className="aiop-approach-card__chips-label">Outputs</p>
        <ul className="aiop-approach-card__chips" role="list">
          {outputs.map((output) => (
            <li key={output} className="aiop-approach-card__chip">
              <span
                className="aiop-approach-card__chip-dot"
                aria-hidden="true"
              />
              {output}
            </li>
          ))}
          {handoffTo ? (
            <li
              className="aiop-approach-card__chip aiop-approach-card__chip--handoff"
              data-aiop-handoff={handoffTo.toLowerCase()}
            >
              <span
                className="aiop-approach-card__handoff-arrow"
                aria-hidden="true"
              >
                →
              </span>
              {handoffTo}
            </li>
          ) : null}
        </ul>
      </section>

      <VisualAction onClick={onPractice} />
    </article>
  );
}

function InheritedPhaseCard({
  inheritedFrom,
}: {
  inheritedFrom: ApproachInheritedStrip;
}) {
  const sourceSlug = inheritedFrom.fromPhase.toLowerCase();
  const laneLabel =
    inheritedFrom.fromPhase === "Navigate"
      ? "Workshop ladder"
      : "Encoded substrate";

  return (
    <section
      className={`aiop-approach-card__inheritance-lane aiop-approach-card__inheritance-lane--from-${sourceSlug}`}
      aria-label={`Collapsed ${inheritedFrom.fromPhase} card`}
    >
      <span
        className={`aiop-approach-card__inheritance-pill aiop-approach-card__inheritance-pill--${sourceSlug}`}
      >
        <span
          className="aiop-approach-card__inheritance-pill-dot"
          aria-hidden="true"
        />
        {inheritedFrom.fromPhase}
      </span>

      <p className="aiop-approach-card__inheritance-lane-label">
        {laneLabel}
      </p>

      <div
        className={`aiop-approach-card__inheritance-core aiop-approach-card__inheritance-core--from-${sourceSlug}`}
      >
        {inheritedFrom.items.map((item, idx) => (
          <span
            key={item.tag}
            className="aiop-approach-card__inheritance-item"
          >
            <span className="aiop-approach-card__inheritance-tag">
              {item.tag}
            </span>
            {item.label ? (
              <span className="aiop-approach-card__inheritance-label">
                {item.label}
              </span>
            ) : null}
            {idx < inheritedFrom.items.length - 1 ? (
              <span
                className="aiop-approach-card__inheritance-sep"
                aria-hidden="true"
              >
                {inheritedFrom.separator === "arrow" ? "›" : "·"}
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </section>
  );
}

function RolloutCard({
  visual,
  onPractice,
}: {
  visual: RolloutVisual;
  onPractice: () => void;
}) {
  return (
    <ApproachCardShell
      phase="Navigate"
      laneLabel="Workshop ladder"
      inputs={visual.inputs}
      outputs={visual.outputs}
      handoffTo={visual.handoffTo}
      onPractice={onPractice}
    >
      {/* Stages rail sits inside the violet-haloed Navigate lane as
          a single dark block, mirroring the way Encode's substrate
          table sits inside its amber lane. The dark block carries
          the workshop process; the lane carries the wrapping. */}
      <div className="aiop-approach-card__core aiop-approach-card__core--rollout">
        <ol className="aiop-rollout__stages" role="list">
          {visual.stages.map((stage, idx) => (
            <li key={stage.tag} className="aiop-rollout__stage">
              <span className="aiop-rollout__stage-tag">{stage.tag}</span>
              <span className="aiop-rollout__stage-label">{stage.label}</span>
              {idx < visual.stages.length - 1 ? (
                <span
                  className="aiop-rollout__stage-arrow"
                  aria-hidden="true"
                >
                  ›
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </ApproachCardShell>
  );
}

function SubstrateCard({
  visual,
  inheritedFrom,
  onPractice,
}: {
  visual: SubstrateVisual;
  inheritedFrom?: ApproachInheritedStrip;
  onPractice: () => void;
}) {
  return (
    <ApproachCardShell
      phase="Encode"
      laneLabel="Encoded substrate"
      inputs={visual.inputs}
      outputs={visual.outputs}
      handoffTo={visual.handoffTo}
      inheritedFrom={inheritedFrom}
      onPractice={onPractice}
    >
      {/* Substrate table sits as a dark block inside the amber lane,
          matching the Headless-shift Encode lane's dark substrate
          stack. Same visual treatment, slightly more rows because
          the deep-dive can carry the full anatomy. */}
      <div className="aiop-approach-card__core aiop-approach-card__core--substrate">
        <ul className="aiop-substrate__layers" role="list">
          {visual.layers.map((layer) => (
            <li key={layer.tag} className="aiop-substrate__layer">
              <span className="aiop-substrate__layer-tag">{layer.tag}</span>
              <span className="aiop-substrate__layer-name">{layer.name}</span>
              <span className="aiop-substrate__layer-meta">{layer.meta}</span>
            </li>
          ))}
        </ul>
      </div>

      {visual.freedomStrip ? (
        <section
          className="aiop-approach-card__freedom"
          aria-label={visual.freedomStrip.intro}
        >
          <p className="aiop-approach-card__freedom-intro">
            {visual.freedomStrip.intro}
          </p>
          <ul className="aiop-approach-card__freedom-list" role="list">
            {visual.freedomStrip.bands.map((band) => (
              <li
                key={band.id}
                className={`aiop-approach-card__freedom-band aiop-approach-card__freedom-band--${band.id}`}
              >
                <span className="aiop-approach-card__freedom-tag">
                  {band.tag}
                </span>
                <span className="aiop-approach-card__freedom-example">
                  {band.example}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </ApproachCardShell>
  );
}

function EngineCard({
  visual,
  inheritedFrom,
  onPractice,
}: {
  visual: EngineVisual;
  inheritedFrom?: ApproachInheritedStrip;
  onPractice: () => void;
}) {
  return (
    <ApproachCardShell
      phase="Build"
      laneLabel="Headless interface"
      inputs={visual.inputs}
      outputs={visual.outputs}
      handoffTo={visual.handoffTo}
      inheritedFrom={inheritedFrom}
      onPractice={onPractice}
    >
      {/* Surfaces grid sits directly inside the sage-haloed Build
          lane. The previous "Engine | HEADLESS" dark banner is gone
          — the lane itself (with its `● BUILD` notched pill + sage
          halo) IS the engine wrapper, mirroring the Headless-shift
          Build lane and the Mímir SurfacesPillar. The four light
          surface tiles inside the lane are what the engine
          produces. */}
      <ul className="aiop-engine__surfaces" role="list">
        {visual.surfaces.map((surface) => (
          <li key={surface.name} className="aiop-engine__surface">
            <span className="aiop-engine__surface-icon" aria-hidden="true">
              {surface.icon}
            </span>
            <span className="aiop-engine__surface-name">{surface.name}</span>
            <span className="aiop-engine__surface-verb">{surface.verb}</span>
          </li>
        ))}
      </ul>
    </ApproachCardShell>
  );
}

function VisualAction({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="aiop-visual-action" onClick={onClick}>
      See how it runs
      <span className="aiop-visual-action__arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

/* ─── Modal body ─────────────────────────────────────────────────────── */

function ApproachModalBody({ step }: { step: ApproachStep }) {
  const { modal } = step;
  return (
    <div className="aiop-modal__body">
      <header className="aiop-modal__hero">
        <p
          className={`aiop-eyebrow aiop-eyebrow--ink aiop-eyebrow--${step.tone}`}
        >
          {modal.eyebrow}
        </p>
        <h2 className="aiop-modal__title">
          {modal.title} <em>{modal.titleEm}</em>
        </h2>
        <p className="aiop-modal__lede">{renderModalLede(modal.lede)}</p>
        <dl className="aiop-modal__meta">
          {modal.meta.map((row) => (
            <div key={row.k} className="aiop-modal__meta-row">
              <dt>{row.k}</dt>
              <dd>{row.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {modal.sections.map((section) => (
        <section key={section.heading} className="aiop-modal__section">
          <h3 className="aiop-modal__section-heading">{section.heading}</h3>
          <ul className="aiop-modal__bullets" role="list">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          {section.note ? (
            <p className="aiop-modal__section-note">{section.note}</p>
          ) : null}
        </section>
      ))}

      <p className="aiop-modal__signal">{modal.signal}</p>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function renderModalLede(lede: string) {
  return lede.split(/(Navigate|Encode|Build)/g).map((part, idx) =>
    part === "Navigate" || part === "Encode" || part === "Build" ? (
      <span
        key={`${part}-${idx}`}
        className={`aiop-term-pill aiop-term-pill--${part.toLowerCase()}`}
      >
        <span className="aiop-term-pill__dot" aria-hidden="true" />
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function toneAccent(tone: ApproachStep["tone"]): string {
  switch (tone) {
    case "violet":
      return "var(--aiop-violet)";
    case "gold":
      return "var(--aiop-gold-bright)";
    case "sage":
      return "var(--aiop-sage)";
  }
}

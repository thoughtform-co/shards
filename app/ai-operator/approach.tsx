"use client";

import { useState, type ReactNode } from "react";
import {
  approachOutcome,
  approachSection,
  approachSteps,
  type ApproachHandoff,
  type ApproachStep,
  type EngineVisual,
  type RolloutVisual,
  type SubstrateVisual,
} from "./content";
import { OperatorModal } from "./operator-modal";

/*
 * Approach — Navigate, Encode, Build.
 *
 * Three self-contained method sections. Each row pairs a copy column
 * (number, verb, headline, body, signal, "practice in motion" CTA)
 * with an executive-level visual that reflects how the motion plays
 * out in real cohorts. The button opens a Heimdall-style modal that
 * goes one level deeper: how the work runs, what it produced.
 */
export function Approach() {
  const [open, setOpen] = useState<ApproachStep | null>(null);

  return (
    <section className="aiop-section aiop-approach" id="approach">
      <div className="aiop-wrap">
        <header className="aiop-approach__head aiop-reveal">
          <h2 className="aiop-section-title">
            {approachSection.title} <em>{approachSection.titleEm}</em>
          </h2>
          <p className="aiop-approach__caption">{approachSection.caption}</p>
        </header>

        <ol className="aiop-approach__list" role="list">
          {approachSteps.map((step, idx) => (
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
                <p className="aiop-approach__body">{step.body}</p>
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
                    onPractice={() => setOpen(step)}
                  />
                )}
                {step.visual.kind === "engine" && (
                  <EngineCard
                    visual={step.visual}
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
            outcome) on the same typographic gesture. */}
        <aside
          className="aiop-approach__outcome aiop-reveal"
          aria-labelledby="aiop-approach-outcome-headline"
        >
          <p className="aiop-approach__outcome-eyebrow">
            {approachOutcome.eyebrow}
          </p>
          <h3
            className="aiop-approach__outcome-headline"
            id="aiop-approach-outcome-headline"
          >
            {approachOutcome.headline}
          </h3>
          <p className="aiop-approach__outcome-body">
            {approachOutcome.body}
          </p>
          {/* Four concrete achievement cards across teams. Replaces
              the earlier 5-stage maturity ladder so the Outcome lands
              as proof, not as a generic progression. Each card seeds a
              section that follows further down the page (Build body,
              Why-build-custom-tools, Cases, Headless / Substrate-map),
              so this card reads forward as well as backward. */}
          <ol className="aiop-approach__outcome-achievements" role="list">
            {approachOutcome.achievements.map((achievement) => (
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
 * Shared shell for all three flywheel visual cards. Renders the
 * common scaffolding once — header (phase pill + descriptor eyebrow),
 * INPUTS chip row, phase-specific dark core slot, OUTPUTS chip row
 * with optional handoff marker, and the "See how it runs" CTA — so
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
  sub,
  inputs,
  outputs,
  handoffTo,
  onPractice,
  children,
}: {
  phase: "Navigate" | "Encode" | "Build";
  sub: string;
  inputs: string[];
  outputs: string[];
  handoffTo?: ApproachHandoff;
  onPractice: () => void;
  children: ReactNode;
}) {
  return (
    <article className="aiop-approach-card">
      <header className="aiop-approach-card__header">
        <span className="aiop-approach-card__phase">
          <span className="aiop-approach-card__phase-dot" aria-hidden="true" />
          {phase}
        </span>
        <span className="aiop-approach-card__sub">{sub}</span>
      </header>

      <section className="aiop-approach-card__chips-block aiop-approach-card__chips-block--inputs">
        <p className="aiop-approach-card__chips-label">Inputs</p>
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
      </section>

      {children}

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
      sub={visual.sub}
      inputs={visual.inputs}
      outputs={visual.outputs}
      handoffTo={visual.handoffTo}
      onPractice={onPractice}
    >
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
  onPractice,
}: {
  visual: SubstrateVisual;
  onPractice: () => void;
}) {
  return (
    <ApproachCardShell
      phase="Encode"
      sub={visual.sub}
      inputs={visual.inputs}
      outputs={visual.outputs}
      handoffTo={visual.handoffTo}
      onPractice={onPractice}
    >
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
  onPractice,
}: {
  visual: EngineVisual;
  onPractice: () => void;
}) {
  return (
    <ApproachCardShell
      phase="Build"
      sub={visual.sub}
      inputs={visual.inputs}
      outputs={visual.outputs}
      handoffTo={visual.handoffTo}
      onPractice={onPractice}
    >
      <div className="aiop-approach-card__core aiop-approach-card__core--engine">
        <div className="aiop-engine__core">
          <span className="aiop-engine__core-l">Engine</span>
          <span className="aiop-engine__core-r">Headless</span>
        </div>
      </div>

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

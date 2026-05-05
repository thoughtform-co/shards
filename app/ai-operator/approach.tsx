"use client";

import { useState } from "react";
import {
  approachSection,
  approachSteps,
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
          <p className="aiop-eyebrow">{approachSection.eyebrow}</p>
          <p className="aiop-section-lede">{approachSection.lede}</p>
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
                  <h3 className="aiop-approach__label">{step.label}.</h3>
                </header>
                <p className="aiop-approach__headline">{step.headline}</p>
                <p className="aiop-approach__body">{step.body}</p>
                <dl className="aiop-approach__signal">
                  <dt>{step.signal.k}</dt>
                  <dd>{step.signal.v}</dd>
                </dl>
                <button
                  type="button"
                  className="aiop-approach__cta"
                  onClick={() => setOpen(step)}
                >
                  Practice in motion
                  <span className="aiop-approach__cta-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
              <div className="aiop-approach__visual">
                {step.visual.kind === "rollout" && (
                  <RolloutCard visual={step.visual} />
                )}
                {step.visual.kind === "substrate" && (
                  <SubstrateCard visual={step.visual} />
                )}
                {step.visual.kind === "engine" && (
                  <EngineCard visual={step.visual} />
                )}
              </div>
            </li>
          ))}
        </ol>

        <p className="aiop-approach__close aiop-reveal">
          {approachSection.close}
        </p>
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

function RolloutCard({ visual }: { visual: RolloutVisual }) {
  return (
    <article className="aiop-rollout">
      <header className="aiop-rollout__head">
        <span className="aiop-rollout__title">{visual.title}</span>
        <span className="aiop-rollout__sub">{visual.sub}</span>
      </header>
      <ol className="aiop-rollout__stages" role="list">
        {visual.stages.map((stage, idx) => (
          <li key={stage.tag} className="aiop-rollout__stage">
            <span className="aiop-rollout__stage-tag">{stage.tag}</span>
            <span className="aiop-rollout__stage-label">{stage.label}</span>
            {idx < visual.stages.length - 1 ? (
              <span className="aiop-rollout__stage-arrow" aria-hidden="true">
                ›
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <ul className="aiop-rollout__surfaces" role="list">
        {visual.surfaces.map((surface) => (
          <li
            key={surface.name}
            className={`aiop-rollout__surface aiop-rollout__surface--${surface.tone}`}
          >
            <span className="aiop-rollout__surface-dot" aria-hidden="true" />
            {surface.name}
          </li>
        ))}
      </ul>
      <footer className="aiop-rollout__foot">
        <span className="aiop-rollout__foot-k">{visual.meta.k}</span>
        <span className="aiop-rollout__foot-v">{visual.meta.v}</span>
      </footer>
    </article>
  );
}

function SubstrateCard({ visual }: { visual: SubstrateVisual }) {
  return (
    <article className="aiop-substrate">
      <header className="aiop-substrate__head">
        <strong>{visual.title}</strong>
        <span>{visual.sub}</span>
      </header>
      <ul className="aiop-substrate__layers" role="list">
        {visual.layers.map((layer) => (
          <li key={layer.tag} className="aiop-substrate__layer">
            <span className="aiop-substrate__layer-tag">{layer.tag}</span>
            <span className="aiop-substrate__layer-name">{layer.name}</span>
            <span className="aiop-substrate__layer-meta">{layer.meta}</span>
          </li>
        ))}
      </ul>
      <div className="aiop-substrate__inputs">
        <p className="aiop-substrate__inputs-h">What gets encoded</p>
        <ul className="aiop-substrate__inputs-list" role="list">
          {visual.inputs.map((input) => (
            <li
              key={input.label}
              className={`aiop-substrate__input aiop-substrate__input--${input.tone}`}
            >
              <span className="aiop-substrate__input-dot" aria-hidden="true">
                {input.initial}
              </span>
              {input.label}
            </li>
          ))}
        </ul>
      </div>
      <p className="aiop-substrate__foot">{visual.foot}</p>
    </article>
  );
}

function EngineCard({ visual }: { visual: EngineVisual }) {
  return (
    <article className="aiop-engine">
      <header className="aiop-engine__head">
        <span className="aiop-engine__title">{visual.title}</span>
        <span className="aiop-engine__sub">{visual.sub}</span>
      </header>
      <div className="aiop-engine__diagram">
        <div className="aiop-engine__core">
          <span className="aiop-engine__core-l">Engine</span>
          <span className="aiop-engine__core-r">Headless</span>
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
      </div>
      <footer className="aiop-engine__foot">
        <span className="aiop-engine__foot-k">{visual.meta.k}</span>
        <span className="aiop-engine__foot-v">{visual.meta.v}</span>
      </footer>
    </article>
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
        <p className="aiop-modal__lede">{modal.lede}</p>
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
        </section>
      ))}

      <p className="aiop-modal__signal">{modal.signal}</p>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

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

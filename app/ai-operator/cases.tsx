"use client";

import { useState, type CSSProperties } from "react";
import {
  cases,
  casesSection,
  type CaseProject,
  type CaseTone,
} from "./content";
import { OperatorModal } from "./operator-modal";
import { ScreenshotGallery } from "./screenshot-gallery";

/*
 * Cases — Heimdall-style showcase.
 *
 * Each case is a row that mirrors Heimdall's `FrameSection`: a sticky
 * left rail of project metadata + summary + workflow shift + metrics +
 * stack, paired with a right column carrying the screenshot frame, a
 * 2x2 capability tile grid, and a "View case detail" CTA.
 *
 * The accent color is injected as `--aiop-case-accent` per case so the
 * screenshot frame's shadow ring, the eyebrow, and the CTA pick up the
 * project's tone without recoloring the surrounding chrome.
 */
export function Cases() {
  const [open, setOpen] = useState<CaseProject | null>(null);
  const total = cases.length;

  return (
    <section className="aiop-section aiop-cases" id="cases">
      <div className="aiop-wrap">
        <header className="aiop-cases__head aiop-reveal">
          <p className="aiop-eyebrow">{casesSection.eyebrow}</p>
          <h2 className="aiop-section-title">
            {casesSection.title} <em>{casesSection.titleEm}</em>
          </h2>
          <p className="aiop-section-lede">{casesSection.lede}</p>
          <ul className="aiop-cases__legend" role="list">
            {casesSection.legend.map((item) => (
              <li key={item.mode} className="aiop-cases__legend-item">
                <span
                  className={`aiop-cases__mode aiop-cases__mode--${item.mode.toLowerCase()}`}
                >
                  {item.mode}
                </span>
                <span className="aiop-cases__legend-def">{item.def}</span>
              </li>
            ))}
          </ul>
        </header>
      </div>

      <div className="aiop-cases__list">
        {cases.map((project) => (
          <CaseRow
            key={project.id}
            project={project}
            total={total}
            onOpen={setOpen}
          />
        ))}
      </div>

      <OperatorModal
        open={open !== null}
        onClose={() => setOpen(null)}
        accent={open ? toneAccent(open.tone) : undefined}
        ariaLabel={
          open
            ? `${open.name}${open.nameEm ?? ""} · case detail`
            : "Case detail"
        }
      >
        {open ? <CaseModalBody project={open} /> : null}
      </OperatorModal>
    </section>
  );
}

/* ─── Row ──────────────────────────────────────────────────────────── */

function CaseRow({
  project,
  total,
  onOpen,
}: {
  project: CaseProject;
  total: number;
  onOpen: (p: CaseProject) => void;
}) {
  const accentVar: CSSProperties = {
    ["--aiop-case-accent" as string]: toneAccent(project.tone),
  } as CSSProperties;

  return (
    <section
      className={`aiop-case-row aiop-case-row--${project.tone}`}
      id={`case-${project.id}`}
      style={accentVar}
    >
      <div className="aiop-wrap aiop-case-row__inner">
        <header className="aiop-case-row__meta aiop-reveal">
          <span className="aiop-case-row__num">
            {project.num}
            <span className="aiop-case-row__num-total">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </span>
          <span className="aiop-case-row__divider" aria-hidden="true" />
          <span className="aiop-case-row__team">{project.team}</span>
          <span className="aiop-case-row__status">{project.status}</span>
        </header>

        <div className="aiop-case-row__grid">
          <aside className="aiop-case-row__rail">
            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Project</p>
              <h3 className="aiop-case-row__name">
                {project.name}
                {project.nameEm ? <em>{project.nameEm}</em> : null}
                <span className="aiop-case-row__period">.</span>
              </h3>
              <p className="aiop-case-row__tagline">{project.tagline}</p>
              {project.subline ? (
                <p className="aiop-case-row__subline">{project.subline}</p>
              ) : null}
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Summary</p>
              <p className="aiop-case-row__lede">{project.oneLiner}</p>
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Workflow shift</p>
              <div className="aiop-case-row__workflow">
                <span
                  className={`aiop-cases__mode aiop-cases__mode--${project.workflowMode.toLowerCase()}`}
                >
                  {project.workflowMode}
                </span>
                <p className="aiop-case-row__workflow-text">
                  {project.workflowAfter}
                </p>
              </div>
            </div>

            <div className="aiop-rail-block aiop-rail-block--metrics aiop-reveal">
              {project.metrics.map((metric) => (
                <div key={metric.k} className="aiop-case-row__metric">
                  <span className="aiop-case-row__metric-v">{metric.v}</span>
                  <span className="aiop-case-row__metric-k">{metric.k}</span>
                </div>
              ))}
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Stack</p>
              <div className="aiop-case-row__chips">
                {project.stack.map((item) => (
                  <span key={item} className="aiop-case-row__chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="aiop-case-row__shot aiop-reveal">
            <div className="aiop-shot-frame">
              {project.screenshots.length > 1 ? (
                <ScreenshotGallery
                  screenshots={project.screenshots}
                  name={project.name + (project.nameEm ?? "")}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={
                    project.screenshots[0]?.src ?? project.image
                  }
                  alt={
                    project.screenshots[0]?.alt ??
                    `${project.name} screenshot`
                  }
                  loading="lazy"
                />
              )}
            </div>

            <ul className="aiop-case-row__caps" role="list">
              {project.capabilities.slice(0, 4).map((cap) => (
                <li key={cap.k} className="aiop-case-row__cap">
                  <p className="aiop-case-row__cap-k">{cap.k}</p>
                  <p className="aiop-case-row__cap-v">{cap.v}</p>
                </li>
              ))}
            </ul>

            <footer className="aiop-case-row__shot-foot">
              <button
                type="button"
                className="aiop-case-row__cta"
                onClick={() => onOpen(project)}
                aria-label={`Open ${project.name}${project.nameEm ?? ""} case detail`}
              >
                View case detail
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7h8M8 4l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    fill="none"
                  />
                </svg>
              </button>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Modal body ─────────────────────────────────────────────────────── */

function CaseModalBody({ project }: { project: CaseProject }) {
  return (
    <div className="aiop-modal__body">
      <header className="aiop-modal__hero">
        <p
          className={`aiop-eyebrow aiop-eyebrow--ink aiop-eyebrow--${project.tone}`}
        >
          Case · {project.num}
        </p>
        <h2 className="aiop-modal__title">
          {project.name}
          {project.nameEm ? <em>{project.nameEm}</em> : null}
          <span className="aiop-case-row__period">.</span>
        </h2>
        <p className="aiop-modal__tagline">{project.tagline}</p>
        <p className="aiop-modal__lede">{project.oneLiner}</p>

        <div className="aiop-modal__shot">
          {project.screenshots.length > 1 ? (
            <ScreenshotGallery
              screenshots={project.screenshots}
              name={project.name + (project.nameEm ?? "")}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={project.screenshots[0]?.src ?? project.image}
              alt={project.screenshots[0]?.alt ?? `${project.name} screenshot`}
            />
          )}
        </div>

        <dl className="aiop-modal__meta">
          <div className="aiop-modal__meta-row">
            <dt>TEAM</dt>
            <dd>{project.team}</dd>
          </div>
          <div className="aiop-modal__meta-row">
            <dt>YEAR</dt>
            <dd>{project.year}</dd>
          </div>
          <div className="aiop-modal__meta-row">
            <dt>STATUS</dt>
            <dd>{project.status}</dd>
          </div>
          <div className="aiop-modal__meta-row">
            <dt>SHIFT</dt>
            <dd>{project.workflowMode}</dd>
          </div>
        </dl>
      </header>

      <section className="aiop-modal__section">
        <h3 className="aiop-modal__section-heading">What it does</h3>
        <ul className="aiop-modal__caps" role="list">
          {project.capabilities.map((cap, idx) => (
            <li key={cap.k} className="aiop-modal__cap">
              <span className="aiop-modal__cap-n">0{idx + 1}</span>
              <div>
                <p className="aiop-modal__cap-k">{cap.k}</p>
                <p className="aiop-modal__cap-v">{cap.v}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="aiop-modal__section">
        <h3 className="aiop-modal__section-heading">Workflow shift</h3>
        <div className="aiop-modal__compare">
          <div className="aiop-modal__compare-col">
            <p className="aiop-modal__compare-label">Before</p>
            <p className="aiop-modal__compare-text">{project.workflowBefore}</p>
          </div>
          <div className="aiop-modal__compare-col aiop-modal__compare-col--after">
            <p className="aiop-modal__compare-label">After</p>
            <p className="aiop-modal__compare-text">{project.workflowAfter}</p>
          </div>
        </div>
      </section>

      <section className="aiop-modal__section">
        <h3 className="aiop-modal__section-heading">Where it goes next</h3>
        <p className="aiop-modal__body-text">{project.companyLeverage}</p>
      </section>

      <section className="aiop-modal__section">
        <h3 className="aiop-modal__section-heading">Stack</h3>
        <div className="aiop-case-row__chips">
          {project.stack.map((item) => (
            <span key={item} className="aiop-case-row__chip">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function toneAccent(tone: CaseTone): string {
  switch (tone) {
    case "violet":
      return "var(--aiop-violet)";
    case "gold":
      return "var(--aiop-gold-bright)";
    case "sage":
      return "var(--aiop-sage)";
    case "slate":
      return "var(--aiop-slate)";
  }
}

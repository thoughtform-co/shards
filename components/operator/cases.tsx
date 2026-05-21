"use client";

import { useState, type CSSProperties } from "react";
import {
  cases,
  casesSection,
  type CaseProject,
  type CaseTone,
  type WorkflowMode,
} from "@/content/operator";
import { OperatorModal } from "./operator-modal";
import { ScreenshotGallery } from "./screenshot-gallery";

/*
 * Cases — Heimdall-style showcase.
 *
 * Each case is a row that mirrors Heimdall's `FrameSection`: a sticky
 * left rail of project metadata + challenge + workflow shift +
 * stack, paired with a right column carrying the screenshot frame, a
 * 2x2 capability tile grid, and a "View case detail" CTA.
 *
 * The accent color is injected as `--aiop-case-accent` per case so the
 * screenshot frame's shadow ring, the eyebrow, and the CTA pick up the
 * project's tone without recoloring the surrounding chrome.
 *
 * Two modal channels live on this section: the case-detail modal
 * (`open`) renders the long-form `CaseModalBody`, and the walkthrough
 * modal (`watch`) renders the short narrated screen-recording for the
 * row when one exists. Both reuse `OperatorModal` for the overlay,
 * portal, focus-trap, and accent token plumbing.
 *
 * The four production rows (Mímir, Vesper, Babylon, Heimdall) are
 * the only rows on this internal Loop landing. The closing bridge
 * callout sits as the last child of `.aiop-cases__list` and hands
 * the visitor into the headless-shift interstitial below.
 *
 * `section` and `projects` props let route variants override the
 * copy without forking the component.
 */
export function Cases({
  section = casesSection,
  projects = cases,
}: {
  section?: {
    title: string;
    titleEm: string;
    lede: string;
    legend: readonly { mode: WorkflowMode; def: string }[];
    bridgeCallout: { lead: string; em: string };
  };
  projects?: CaseProject[];
} = {}) {
  const [open, setOpen] = useState<CaseProject | null>(null);
  const [watch, setWatch] = useState<CaseProject | null>(null);
  const total = projects.length;

  return (
    <section className="aiop-section aiop-cases" id="cases">
      <div className="aiop-wrap">
        <header className="aiop-cases__head aiop-reveal">
          <h2 className="aiop-section-title">
            {section.title} <em>{section.titleEm}</em>
          </h2>
          <p className="aiop-section-lede">{section.lede}</p>
          <ul className="aiop-cases__legend" role="list">
            {section.legend.map((item) => (
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
        {projects.map((project) => (
          <CaseRow
            key={project.id}
            project={project}
            total={total}
            onOpen={setOpen}
            onWatch={setWatch}
          />
        ))}

        {/* Bridge callout — last child of the list, the final beat
            the visitor reads on the Cases side before the headless-
            shift section slides up over it. Soft-framed cream card
            with no eyebrow so the two-line display body is the only
            beat. The italic em ("the interface is the cheapest layer
            to swap") rhymes with the headless-shift body strong line
            below ("decoupling the rest is the work I'm doing now")
            so the callout reads as setup → headless-shift reads as
            elaboration. */}
        <aside
          className="aiop-cases__bridge aiop-reveal"
          aria-label="Cases-to-headless bridge callout"
        >
          <p className="aiop-cases__bridge-body">
            <span className="aiop-cases__bridge-lead">
              {section.bridgeCallout.lead}
            </span>
            <em className="aiop-cases__bridge-em">
              {section.bridgeCallout.em}
            </em>
          </p>
        </aside>
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

      <OperatorModal
        open={watch !== null}
        onClose={() => setWatch(null)}
        accent={watch ? toneAccent(watch.tone) : undefined}
        variant="wide"
        ariaLabel={
          watch
            ? `${watch.name}${watch.nameEm ?? ""} · walkthrough`
            : "Walkthrough"
        }
      >
        {watch && watch.walkthrough ? (
          <WalkthroughModalBody project={watch} />
        ) : null}
      </OperatorModal>
    </section>
  );
}

/* ─── Row ──────────────────────────────────────────────────────────── */

function CaseRow({
  project,
  total,
  onOpen,
  onWatch,
}: {
  project: CaseProject;
  total: number;
  onOpen: (p: CaseProject) => void;
  onWatch: (p: CaseProject) => void;
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
          {project.walkthrough ? (
            <button
              type="button"
              className="aiop-case-row__cta aiop-case-row__cta--watch"
              onClick={() => onWatch(project)}
              aria-label={`Watch ${project.name}${project.nameEm ?? ""} walkthrough video`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                aria-hidden="true"
              >
                <path
                  d="M4 3.2v7.6a.4.4 0 0 0 .61.34l5.7-3.78a.4.4 0 0 0 0-.68L4.61 2.86A.4.4 0 0 0 4 3.2Z"
                  fill="currentColor"
                />
              </svg>
              Watch walkthrough
            </button>
          ) : null}
          <button
            type="button"
            className="aiop-case-row__cta"
            onClick={() => onOpen(project)}
            aria-label={`Open ${project.name}${project.nameEm ?? ""} case detail`}
          >
            View case detail
            <svg
              width="12"
              height="12"
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
        </header>

        <div className="aiop-case-row__grid">
          <aside className="aiop-case-row__rail">
            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">
                Project
                <span
                  className={`aiop-rail-block__status aiop-rail-block__status--${project.status.toLowerCase()}`}
                  aria-label={`${project.status} status`}
                  title={project.status}
                />
              </p>
              <h3 className="aiop-case-row__name">
                {project.name}
                {project.nameEm ? <em>{project.nameEm}</em> : null}
                <span className="aiop-case-row__period">.</span>
              </h3>
              {project.codename ? (
                <p
                  className="aiop-case-row__codename"
                  aria-label={`Codename ${project.codename}${project.codenameEm ?? ""}`}
                >
                  {project.codename}
                  {project.codenameEm ? (
                    <em>{project.codenameEm}</em>
                  ) : null}
                  <span className="aiop-case-row__period">.</span>
                </p>
              ) : null}
              <p className="aiop-case-row__tagline">{project.tagline}</p>
              {project.subline ? (
                <p className="aiop-case-row__subline">{project.subline}</p>
              ) : null}
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Challenge</p>
              <p className="aiop-case-row__lede">{project.challenge}</p>
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
                  <p className="aiop-case-row__cap-k">
                    {cap.k}
                    {cap.status ? (
                      <span
                        className={`aiop-case-row__cap-status aiop-case-row__cap-status--${cap.status.toLowerCase()}`}
                        aria-label={`${cap.status} status`}
                      >
                        {cap.status}
                      </span>
                    ) : null}
                  </p>
                  <p className="aiop-case-row__cap-v">{cap.v}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Walkthrough modal body ───────────────────────────────────────── */

/*
 * WalkthroughModalBody — short narrated screen recording for a case.
 *
 * Reuses `OperatorModal` (variant="wide") for the overlay/portal/focus-
 * trap and a wider frame so the video element gets more horizontal
 * room without breaking responsiveness. The body itself is
 * deliberately spare: a single small label that combines the project
 * name + tagline, and a `<video>` element that fills the available
 * width while preserving its native aspect ratio. The eyebrow and the
 * large display title were retired — the trigger button already
 * carried the "Watch walkthrough" framing, and the case row sitting
 * behind the modal carries the project's full identity, so a tight
 * label reads as confirmation rather than restatement.
 *
 * Autoplay starts the video the moment the modal opens (the click on
 * the trigger button is the user gesture browsers require). The
 * video is muted on autoplay because none of the source files carry
 * an audio track — keeping `muted` explicit also satisfies the
 * universal autoplay policy in case audio is added later. The
 * `playsInline` flag lets iOS render the video inline rather than
 * launching the native fullscreen overlay.
 *
 * The `<video>` element is keyed by the project id so the React tree
 * unmounts the old element when the modal switches between cases.
 * Without the key, the same `<video>` would be reused and the old
 * source frame would briefly persist before the new one loads.
 */
function WalkthroughModalBody({ project }: { project: CaseProject }) {
  const walkthrough = project.walkthrough;
  if (!walkthrough) return null;

  const fullName = project.name + (project.nameEm ?? "");

  return (
    <div className="aiop-modal__body aiop-modal__body--walkthrough">
      <header className="aiop-modal__hero--walkthrough">
        <p
          className={`aiop-eyebrow aiop-eyebrow--ink aiop-eyebrow--${project.tone}`}
        >
          {fullName}
          <span
            className="aiop-modal__hero-divider aiop-modal__hero-divider--walkthrough"
            aria-hidden="true"
          >
            ·
          </span>
          {project.tagline}
        </p>
      </header>

      <div className="aiop-modal__video">
        <video
          key={project.id}
          src={walkthrough.src}
          poster={walkthrough.poster}
          controls
          autoPlay
          muted
          playsInline
          preload="metadata"
          aria-label={`${fullName} walkthrough video`}
        />
      </div>
    </div>
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
        {project.codename ? (
          <p
            className="aiop-modal__codename"
            aria-label={`Codename ${project.codename}${project.codenameEm ?? ""}`}
          >
            {project.codename}
            {project.codenameEm ? <em>{project.codenameEm}</em> : null}
            <span className="aiop-case-row__period">.</span>
          </p>
        ) : null}
        <p className="aiop-modal__tagline">{project.tagline}</p>
        <p className="aiop-modal__lede">{project.challenge}</p>

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

      {/* Walkthrough section — sits between the visual hero (still
          screenshots) and the structured copy below, treating the
          recording as the second half of the visual proof. Renders
          only if a walkthrough is wired for the case; controls are
          enabled but autoplay is intentionally off (the visitor came
          here to read; the dedicated `WalkthroughModalBody` is where
          autoplay belongs). */}
      {project.walkthrough ? (
        <section className="aiop-modal__section aiop-modal__section--walkthrough">
          <h3 className="aiop-modal__section-heading">Walkthrough</h3>
          <div className="aiop-modal__video aiop-modal__video--inline">
            <video
              key={project.id}
              src={project.walkthrough.src}
              poster={project.walkthrough.poster}
              controls
              muted
              playsInline
              preload="metadata"
              aria-label={`${project.name}${project.nameEm ?? ""} walkthrough video`}
            />
          </div>
        </section>
      ) : null}

      <section className="aiop-modal__section">
        <h3 className="aiop-modal__section-heading">What it does</h3>
        <ul className="aiop-modal__caps" role="list">
          {project.capabilities.map((cap, idx) => (
            <li key={cap.k} className="aiop-modal__cap">
              <span className="aiop-modal__cap-n">0{idx + 1}</span>
              <div>
                <p className="aiop-modal__cap-k">
                  {cap.k}
                  {cap.status ? (
                    <span
                      className={`aiop-case-row__cap-status aiop-case-row__cap-status--${cap.status.toLowerCase()}`}
                      aria-label={`${cap.status} status`}
                    >
                      {cap.status}
                    </span>
                  ) : null}
                </p>
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

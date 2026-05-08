"use client";

import { useState, type CSSProperties } from "react";
import {
  cases,
  casesSection,
  stripeTeaser,
  type CaseProject,
  type CaseTone,
} from "./content";
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
 * After the four production case rows, a `StripeTeaserCard` renders
 * inside the same `.aiop-cases__list` container. It is not a fifth
 * `CaseProject` — it carries its own data shape (`stripeTeaser`) and
 * its CTA is a plain link to a placeholder booking href instead of an
 * `OperatorModal` open. The "four production systems" count stays
 * intact while the teaser still benefits from the case-row chrome.
 */
export function Cases() {
  const [open, setOpen] = useState<CaseProject | null>(null);
  const [watch, setWatch] = useState<CaseProject | null>(null);
  const total = cases.length;

  return (
    <section className="aiop-section aiop-cases" id="cases">
      <div className="aiop-wrap">
        <header className="aiop-cases__head aiop-reveal">
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
            onWatch={setWatch}
          />
        ))}

        {/* Stripe teaser — sits after the four production case rows
            inside the same list container so the parallax-pinned
            `.aiop-cases` block stays one continuous frozen surface
            during the HeadlessShift slide-over. The teaser is the
            section's closing beat now; the previous `aiop-cases__close`
            editorial line was retired so the booking ask hands
            directly into the headless thesis below. */}
        <StripeTeaserCard />
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
                  <p className="aiop-case-row__cap-k">{cap.k}</p>
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

/* ─── Stripe teaser ─────────────────────────────────────────────────── */

/*
 * StripeTeaserCard — the post-Heimdall teaser row.
 *
 * Reuses the case-row chrome (meta strip, sticky rail, shot frame, 2x2
 * capability grid) so it slots into the same visual rhythm as the four
 * production cards. The differences are intentional:
 *
 *   - Meta strip carries a TEASER · NEXT MOVE tag instead of a
 *     "05 / 04" pair so the four-case production count stays clean.
 *   - The CTA is a plain `<a>` to a booking href, not a button that
 *     opens a modal. The label reads as an unlock; the meeting is
 *     the only path into the actual prototype walk-through.
 *   - The visual frame holds an inline architecture schematic
 *     (`StripeTeaserSchematic`) instead of a screenshot. If real
 *     prototype snapshots are added later, swap in `ScreenshotGallery`
 *     and keep the schematic as a fallback.
 *   - A foot line sits below the capability tiles, mirroring where
 *     `companyLeverage` would surface in the modal — it lands the
 *     teaser ask without requiring the visitor to open anything.
 *
 * The accent token defaults to violet (Stripe-aligned) via the row
 * tone modifier, and a `--teaser` modifier pushes the chrome a step
 * louder than the production rows.
 */
function StripeTeaserCard() {
  return (
    <section
      className="aiop-case-row aiop-case-row--violet aiop-case-row--teaser"
      id="case-stripe"
      aria-label="Stripe teaser case"
    >
      <div className="aiop-wrap aiop-case-row__inner aiop-case-row__inner--teaser">
        <header className="aiop-case-row__meta aiop-reveal">
          <span className="aiop-case-row__teaser-tag">
            <span className="aiop-case-row__teaser-dot" aria-hidden="true" />
            {stripeTeaser.metaLabel}
            <span className="aiop-case-row__teaser-tag-divider" aria-hidden="true">
              ·
            </span>
            {stripeTeaser.metaTag}
          </span>
          <span className="aiop-case-row__divider" aria-hidden="true" />
          <span className="aiop-case-row__team">{stripeTeaser.team}</span>
          <a
            className="aiop-case-row__cta aiop-case-row__cta--unlock"
            href={stripeTeaser.ctaHref}
            aria-label="Book a meeting to unlock the Stripe teaser walk-through"
          >
            {stripeTeaser.ctaLabel}
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
          </a>
        </header>

        <div className="aiop-case-row__grid">
          <aside className="aiop-case-row__rail">
            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">
                {stripeTeaser.railEyebrow}
              </p>
              <h3 className="aiop-case-row__name">
                {stripeTeaser.name}
                <span className="aiop-case-row__period">.</span>
              </h3>
              <p className="aiop-case-row__tagline">{stripeTeaser.tagline}</p>
              <p className="aiop-case-row__subline">{stripeTeaser.subline}</p>
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">The pattern</p>
              <p className="aiop-case-row__lede">{stripeTeaser.challenge}</p>
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Workflow shift</p>
              <div className="aiop-case-row__workflow">
                <span
                  className={`aiop-cases__mode aiop-cases__mode--${stripeTeaser.workflowMode.toLowerCase()}`}
                >
                  {stripeTeaser.workflowMode}
                </span>
                <p className="aiop-case-row__workflow-text">
                  {stripeTeaser.workflowAfter}
                </p>
              </div>
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Stack</p>
              <div className="aiop-case-row__chips">
                {stripeTeaser.stack.map((item) => (
                  <span key={item} className="aiop-case-row__chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="aiop-case-row__shot aiop-reveal">
            {/* Visual frame — gallery rotates real prototype snapshots
                when `stripeTeaser.screenshots` is populated; falls
                back to the inline architecture schematic otherwise.
                The frame itself keeps the violet ring chrome the
                production case shots use. */}
            <div
              className={`aiop-shot-frame${
                stripeTeaser.screenshots.length === 0
                  ? " aiop-shot-frame--teaser"
                  : ""
              }`}
            >
              {stripeTeaser.screenshots.length > 0 ? (
                <ScreenshotGallery
                  screenshots={stripeTeaser.screenshots}
                  name="Stripe teaser · HarvestFields prototype"
                />
              ) : (
                <StripeTeaserSchematic />
              )}
            </div>

            {/* Capability tiles — blurred by the `--locked` modifier
                so the structure (four buckets, two columns) reads at
                a glance while the actual content stays behind the
                booking CTA. The blur is the teaser; the meeting is
                the unlock. */}
            <ul
              className="aiop-case-row__caps aiop-case-row__caps--locked"
              role="list"
              aria-label="Capabilities (preview locked, book a meeting to unlock)"
            >
              {stripeTeaser.capabilities.map((cap) => (
                <li
                  key={cap.k}
                  className="aiop-case-row__cap"
                  aria-hidden="true"
                >
                  <p className="aiop-case-row__cap-k">{cap.k}</p>
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

/*
 * StripeTeaserSchematic — three-column architecture preview that fills
 * the `aiop-shot-frame` slot in place of a screenshot.
 *
 * Reads the substrate flow (sources → encoded substrate → inherited
 * surfaces) the way the headless-shift card reads encode → build, but
 * scoped to the GTM substrate this teaser is about. Stays paper-on-dark
 * inside the frame so the violet ring around the frame keeps reading
 * the same way it does on the production case shots above.
 */
function StripeTeaserSchematic() {
  const { schematic } = stripeTeaser;

  return (
    <div className="aiop-teaser-vis" aria-label={schematic.eyebrow}>
      <header className="aiop-teaser-vis__head">
        <span className="aiop-teaser-vis__eyebrow">
          <span className="aiop-teaser-vis__eyebrow-dot" aria-hidden="true" />
          {schematic.eyebrow}
        </span>
      </header>

      <div className="aiop-teaser-vis__flow">
        <section
          className="aiop-teaser-vis__col aiop-teaser-vis__col--sources"
          aria-label={schematic.sourcesLabel}
        >
          <span className="aiop-teaser-vis__col-label">
            {schematic.sourcesLabel}
          </span>
          <ul className="aiop-teaser-vis__list">
            {schematic.sources.map((source) => (
              <li key={source} className="aiop-teaser-vis__source">
                {source}
              </li>
            ))}
          </ul>
        </section>

        <span
          className="aiop-teaser-vis__connector"
          aria-hidden="true"
        >
          <span className="aiop-teaser-vis__connector-line" />
          <span className="aiop-teaser-vis__connector-arrow">→</span>
          <span className="aiop-teaser-vis__connector-line" />
        </span>

        <section
          className="aiop-teaser-vis__col aiop-teaser-vis__col--substrate"
          aria-label={schematic.substrateLabel}
        >
          <span className="aiop-teaser-vis__col-label">
            {schematic.substrateLabel}
          </span>
          <ul className="aiop-teaser-vis__list">
            {schematic.substrateLayers.map((layer) => (
              <li key={layer.tag} className="aiop-teaser-vis__substrate">
                <span className="aiop-teaser-vis__substrate-tag">
                  {layer.tag}
                </span>
                <span className="aiop-teaser-vis__substrate-name">
                  {layer.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <span
          className="aiop-teaser-vis__connector"
          aria-hidden="true"
        >
          <span className="aiop-teaser-vis__connector-line" />
          <span className="aiop-teaser-vis__connector-arrow">→</span>
          <span className="aiop-teaser-vis__connector-line" />
        </span>

        <section
          className="aiop-teaser-vis__col aiop-teaser-vis__col--surfaces"
          aria-label={schematic.surfacesLabel}
        >
          <span className="aiop-teaser-vis__col-label">
            {schematic.surfacesLabel}
          </span>
          <ul className="aiop-teaser-vis__list aiop-teaser-vis__list--surfaces">
            {schematic.surfaces.map((surface) => (
              <li key={surface.name} className="aiop-teaser-vis__surface">
                <span
                  className="aiop-teaser-vis__surface-icon"
                  aria-hidden="true"
                >
                  {surface.icon}
                </span>
                <span className="aiop-teaser-vis__surface-name">
                  {surface.name}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ─── Walkthrough modal body ───────────────────────────────────────── */

/*
 * WalkthroughModalBody — short narrated screen recording for a case.
 *
 * Reuses `OperatorModal` for the overlay/portal/focus-trap. The body
 * itself is purposefully tight: a small header (project name + the
 * label "Walkthrough") and a single `<video controls autoplay muted>`
 * element that fills the modal width while preserving its native
 * aspect ratio.
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
      <header className="aiop-modal__hero aiop-modal__hero--walkthrough">
        <p
          className={`aiop-eyebrow aiop-eyebrow--ink aiop-eyebrow--${project.tone}`}
        >
          Walkthrough · {project.num}
        </p>
        <h2 className="aiop-modal__title">
          {project.name}
          {project.nameEm ? <em>{project.nameEm}</em> : null}
          <span className="aiop-case-row__period">.</span>
        </h2>
        <p className="aiop-modal__tagline">{project.tagline}</p>
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

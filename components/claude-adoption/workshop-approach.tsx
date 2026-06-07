import { Fragment } from "react";

import {
  type CaWorkshopApproachSection,
  caWorkshopApproachSection,
} from "@/content/claude-adoption";

/*
 * Workshop approach — operator machine (cross-team mechanics).
 *
 * Distinct from the Flywheel interstitial that follows: the
 * flywheel is each team's Navigate / Encode / Build loop. This
 * section is what one operator does across all teams so that
 * loop compounds into the intelligence layer.
 *
 * Three stages:
 *   01 Same starting line — uniform kickoff, thinking exercise
 *   02 Every record feeds one layer — transcript → Skill → Monday → repo
 *   03 Patterns become tools — cross-team pattern detection
 *
 * Closes with an "And this is the engine" CTA pill that hands the
 * reader into the Flywheel chapter below — the per-team loop the
 * cross-team machine is feeding. The Flywheel section parallaxes
 * up over the tail of this one (see `vision-flywheel.tsx` and the
 * `.ca-approach-and-vision` wrapper in `page.tsx`).
 *
 * Server component — no client hooks.
 */
type WorkshopApproachProps = {
  /* Optional content override. When set, the section's header copy
     (title, titleEm, titleAfter, titleBreakBeforeEm, sub, ariaLabel,
     id) is read from this object instead of the shared
     `caWorkshopApproachSection` constant. The diagram body
     (cards, connectors, CTAs) stays Loop-grown by default; pass
     full `cards`/`connectors` to override those too. */
  section?: CaWorkshopApproachSection;
};

export function WorkshopApproach({ section }: WorkshopApproachProps = {}) {
  const {
    id,
    ariaLabel,
    title,
    titleEm,
    titleAfter,
    titleBreakBeforeEm,
    sub,
    cards,
    connectors,
    engineCta,
    mondayCta,
  } = section ?? caWorkshopApproachSection;

  return (
    <section
      className="aiop-section ca-approach"
      id={id}
      aria-label={ariaLabel}
    >
      <div className="aiop-wrap ca-approach__inner">
        <header className="aiop-section-head ca-approach__head aiop-reveal">
          <h2 className="aiop-section-title">
            {title}
            {titleBreakBeforeEm ? <br /> : " "}
            <em>{titleEm}</em>
            {titleAfter ?? ""}
          </h2>
          <p className="aiop-section-head__sub">{sub}</p>
        </header>

        {/* The stages render as one wide annotated diagram. At
            >= 980px the row resolves to a 5-row × 5-column subgrid
            (stage / connector / stage / connector / stage) so all
            three stages and the two connectors between them share
            the same row tracks for label / spine / tag / art /
            caption.

            The signature element is the "datum line" — a single
            horizontal hairline running across the entire row at
            spine-row height, punctuated by Clay station dots over
            each stage and broken by uppercase mono verb kickers
            ("One record" / "One layer") in the gutters between.
            Each stage and connector renders its own segment of
            the line via ::before; placed side-by-side on the same
            subgrid row, they tile into one continuous datum.

            Below 980px the spine + connectors hide and the layout
            collapses into a clean stack (stage tag → label → art
            → caption). Connectors stay decorative — `aria-hidden`
            keeps them out of the list semantics so screen readers
            still get a three-step sequence. The duplicated stage
            tag (one above the label for stacked, one below the
            datum dot for desktop) is the only DOM redundancy; the
            inactive variant in either layout is `display: none`
            (removed from the a11y tree), so screen readers
            announce exactly one stage tag per stage per layout. */}
        <ol className="ca-approach__stages aiop-reveal" role="list">
          {cards.map((card, idx) => {
            const connector = connectors?.[idx];
            return (
              <Fragment key={card.id}>
                <li
                  className={`ca-approach__stage ca-approach__stage--${card.id}`}
                >
                  <span className="ca-approach__stage-tag ca-approach__stage-tag--stacked">
                    {stageTagText(card)}
                  </span>

                  <h3 className="ca-approach__stage-label">{card.label}</h3>

                  <div
                    className="ca-approach__spine"
                    aria-hidden="true"
                  >
                    <span className="ca-approach__spine-dot" />
                  </div>

                  {/* The stage pill (e.g. "01 NAVIGATE") lives INSIDE
                      .stage-art so it can anchor absolutely against
                      the art-frame's container at desktop. The whole
                      .stage-art is already aria-hidden because the
                      diagrams below are decorative — the pill rides
                      on that hiding since the verb pair is
                      structural chrome that's repeated explicitly in
                      the Flywheel chapter directly beneath this
                      section (Navigate / Encode / Build). */}
                  <div className="ca-approach__stage-art" aria-hidden="true">
                    <span className="ca-approach__stage-tag ca-approach__stage-tag--spine">
                      {stageTagText(card)}
                    </span>
                    <StageArt id={card.id} />
                  </div>

                  <p className="ca-approach__stage-body">{card.body}</p>
                </li>

                {connector ? (
                  <li
                    className="ca-approach__connector"
                    data-to={connector.to}
                    aria-hidden="true"
                    role="presentation"
                  >
                    <div className="ca-approach__connector-spine">
                      <span className="ca-approach__connector-kicker">
                        <span className="ca-approach__connector-verb">
                          {connector.verb}
                        </span>
                        <span
                          className="ca-approach__connector-chevron"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ol>

        {/* CTA row — closes the cross-team machine. Two pills sit
            side-by-side at the bottom of the section:

            1. Engine pill (primary) hands the reader to the
               Flywheel chapter that rises over this section.
               Reuses the homepage's `aiop-engine-pattern__bridge`
               recipe (Clay-tinted gradient pill with chevron-down)
               via the page-scoped `--aiop-violet` override.

            2. Monday-board pill (secondary, optional) sits to the
               right and opens the workshop-record board in a new
               tab. Same chrome as the engine pill but recoloured
               in Monday cobalt via the
               `.aiop-engine-pattern__bridge--monday` modifier —
               which locally overrides `--aiop-violet` inside that
               one element only, so every inherited gradient /
               border / arrow rule repaints in blue without
               duplicated chrome. */}
        <div className="ca-approach__cta aiop-reveal">
          <a
            href={engineCta.href}
            className="aiop-engine-pattern__bridge"
            aria-label={engineCta.ariaLabel}
          >
            <span className="aiop-engine-pattern__bridge-label">
              {engineCta.label}
            </span>
            <span
              className="aiop-engine-pattern__bridge-arrow"
              aria-hidden="true"
            >
              <ChevronDown size={16} />
            </span>
          </a>

          {mondayCta ? (
            <a
              href={mondayCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="aiop-engine-pattern__bridge aiop-engine-pattern__bridge--monday"
              aria-label={mondayCta.ariaLabel}
            >
              <span className="aiop-engine-pattern__bridge-label">
                {mondayCta.label}
              </span>
              <span
                className="aiop-engine-pattern__bridge-arrow"
                aria-hidden="true"
              >
                <MondayMark size={16} />
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Pill text — number + middle dot + motion verb ("01 · Navigate"),
   else falls back to the legacy "Stage 0X" shape so older content
   shapes still render. The middle dot separator matches the other
   numbered pills on the page (.ca-tools__phase on the M\u00edmir /
   Vesper tool blocks and .ca-skill__phase-pill on the build-feeding
   Skill cards both render `03 \u00b7 BUILD`) so all phase chrome
   shares one typographic format. CSS uppercases at render time. */
function stageTagText(card: {
  n: string;
  motion?: string;
}): string {
  return card.motion
    ? `${card.n} \u00b7 ${card.motion}`
    : `Stage ${card.n}`;
}

function StageArt({ id }: { id: string }) {
  if (id === "same-start") return <SameStartArt />;
  if (id === "every-record") return <EveryRecordArt />;
  if (id === "patterns-become-tools") return <PatternsArt />;
  return null;
}

type TeamStatus = "done" | "queued";
type TeamRow = { name: string; status: TeamStatus };

/* Queued teams render first so the "what's next" rows lead — done
   rows continue below as the proof that the same kickoff has run
   across the rest of the org. */
const SAME_START_TEAMS: readonly TeamRow[] = [
  { name: "CRO", status: "queued" },
  { name: "Expansion", status: "queued" },
  { name: "Supply Chain & Sourcing", status: "queued" },
  { name: "Legal", status: "done" },
  { name: "Finance", status: "done" },
  { name: "Product Design", status: "done" },
  { name: "Program Mgmt", status: "done" },
  { name: "Studio", status: "done" },
  { name: "People Ops", status: "done" },
  { name: "Brand", status: "done" },
  { name: "Insights", status: "done" },
  { name: "Warehousing", status: "done" },
  { name: "Talent", status: "done" },
  { name: "Eng", status: "done" },
  { name: "PM", status: "done" },
  { name: "Mfg", status: "done" },
];

function SameStartArt() {
  return (
    <figure className="ca-approach__art ca-approach__art--same-start">
      <div className="ca-approach__art-frame">
        {/* Same uppercase mono kicker style as RECORD PIPELINE and
            PATTERN DETECTOR on the next two stages so the three art
            frames carry consistent chrome. The "same kickoff"
            qualifier was dropped; the row stack below makes the
            point on its own. */}
        <span className="ca-approach__art-frame-label">22 workshops</span>
        <ul className="ca-approach__art-team-stack" role="list">
          {SAME_START_TEAMS.map((team) => (
            <li
              key={team.name}
              className={`ca-approach__art-team-row ca-approach__art-team-row--${team.status}`}
            >
              <span className="ca-approach__art-team-dot" aria-hidden="true" />
              <span className="ca-approach__art-team-name">{team.name}</span>
              <span
                className={`ca-approach__art-team-status ca-approach__art-team-status--${team.status}`}
              >
                {team.status === "done" ? "done" : "queued"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

function EveryRecordArt() {
  return (
    <figure className="ca-approach__art ca-approach__art--every-record">
      <div className="ca-approach__art-frame">
        <span className="ca-approach__art-frame-label">Record pipeline</span>

        <ol className="ca-approach__art-pipeline" role="list">
          <li className="ca-approach__art-pipeline-step">
            <span className="ca-approach__art-pipeline-k">Meeting</span>
            <span className="ca-approach__art-pipeline-v">recorded & transcribed</span>
          </li>
          <li
            className="ca-approach__art-pipeline-arrow"
            aria-hidden="true"
          >
            <DownArrow />
          </li>
          <li className="ca-approach__art-pipeline-step">
            <span className="ca-approach__art-pipeline-k">Skill</span>
            <span className="ca-approach__art-pipeline-v">ai-adoption-loop</span>
          </li>
          <li
            className="ca-approach__art-pipeline-arrow"
            aria-hidden="true"
          >
            <DownArrow />
          </li>
          <li
            className="ca-approach__art-pipeline-step ca-approach__art-pipeline-step--header"
            aria-hidden="true"
          >
            <span className="ca-approach__art-pipeline-k">Monday</span>
            <span className="ca-approach__art-pipeline-v">uniform doc</span>
          </li>
        </ol>

        {/* Monday board card reads as the bottom of the pipeline —
            the destination the third step lands in. The little
            header row above acts as the same MEETING/SKILL pill so
            the three steps read as one continuous flow. */}
        <div className="ca-approach__art-monday ca-approach__art-monday--board">
          <header className="ca-approach__art-monday-head">
            <span className="ca-approach__art-monday-kicker">Monday board</span>
            <span className="ca-approach__art-monday-id">18409569683</span>
          </header>
          <ul className="ca-approach__art-monday-rows" role="list">
            <li>
              <span className="ca-approach__art-monday-pill">DOC</span>
              <span>Legal · recap</span>
            </li>
            <li>
              <span className="ca-approach__art-monday-pill">DOC</span>
              <span>Finance · recap</span>
            </li>
            <li>
              <span className="ca-approach__art-monday-pill ca-approach__art-monday-pill--draft">
                SKILL
              </span>
              <span>Design · CMF v0.3</span>
            </li>
          </ul>
        </div>

        {/* GitHub card — production-ready Skills graduate out of
            the Monday board into a versioned mono-repo. Distinct
            chrome from Monday so the two read as two destinations
            on different surfaces, not as one stacked block. */}
        <div className="ca-approach__art-repo">
          <header className="ca-approach__art-repo-head">
            <span className="ca-approach__art-repo-kicker">GitHub</span>
            <span className="ca-approach__art-repo-id">monorepo</span>
          </header>
          <p className="ca-approach__art-repo-body">
            Skills that ship graduate to a versioned mono-repo.
          </p>
        </div>
      </div>
    </figure>
  );
}

function PatternsArt() {
  return (
    <figure className="ca-approach__art ca-approach__art--patterns">
      <div className="ca-approach__art-frame">
        <span className="ca-approach__art-frame-label">Pattern detector</span>

        <ul className="ca-approach__art-pattern-sources" role="list">
          <li>
            <span className="ca-approach__art-pattern-chip">Creative strategy</span>
            <span className="ca-approach__art-pattern-verb">briefing</span>
          </li>
          <li>
            <span className="ca-approach__art-pattern-chip">Product marketing</span>
            <span className="ca-approach__art-pattern-verb">briefing</span>
          </li>
          <li>
            <span className="ca-approach__art-pattern-chip">Campaign mgmt</span>
            <span className="ca-approach__art-pattern-verb">briefing</span>
          </li>
        </ul>

        <div className="ca-approach__art-pattern-converge" aria-hidden="true">
          <span className="ca-approach__art-pattern-line" />
          <span className="ca-approach__art-pattern-line" />
          <span className="ca-approach__art-pattern-line" />
        </div>

        <div className="ca-approach__art-pattern-target">
          <span className="ca-approach__art-pattern-target-kicker">
            Mímir
          </span>
          <span className="ca-approach__art-pattern-target-name">
            Marketing Intelligence
          </span>
          <span className="ca-approach__art-pattern-target-sub">
            (aka Briefing Agent)
          </span>
        </div>
      </div>
    </figure>
  );
}

function DownArrow() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 4v11M5 11l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 7l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Monday brand mark — three status capsules in their canonical
   Stuck / Working on it / Done colours (red / yellow / green).
   Per brand-monday.com these three colours are the spine of the
   Monday identity; combined with the surrounding label text
   ("Monday board") the mark reads unambiguously as Monday
   without needing the full monday.com wordmark, which wouldn't
   fit inside the right-side arrow slot.

   Colour tokens are inlined rather than pulled into the page's
   token system because they belong to Monday's brand, not the
   Aether/Claude palette. Pinned to the official brand values
   from brand-monday.com/colors. */
function MondayMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="5" cy="12" r="3" fill="#fb275d" />
      <circle cx="12" cy="12" r="3" fill="#ffcc00" />
      <circle cx="19" cy="12" r="3" fill="#00ca72" />
    </svg>
  );
}

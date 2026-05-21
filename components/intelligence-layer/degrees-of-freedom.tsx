"use client";

import { useState } from "react";

import {
  creativeStrategyFreedomWorkstreams,
  type FreedomBand,
  type FreedomBandLevel,
} from "@/content/intelligence-layer";

/**
 * 05 Degrees of Freedom — Creative Strategy workstreams.
 *
 * Layout:
 *
 *   header            — title + sub via `.aiop-section-head`
 *   tabs / eyebrow    — `.je-freedom__tabs` strip when >1 workstream is
 *                       defined; otherwise a quiet
 *                       `WORKSTREAM 01 \u00b7 Creative Strategy` eyebrow
 *                       so the section doesn't read as a lonely tab
 *   panel description — one-line framing for the active workstream
 *   panel layout      — three band cards laid out horizontally
 *                       (Low / Medium / High). Red rail on Low so the
 *                       locked foundations read as a guardrail before
 *                       the looser bands
 *   caption           — Mímir attribution under the panel
 *
 * The dark "skill.md, compressed" card from earlier revisions was
 * dropped because it duplicated what the three band cards already
 * say at a scan; the new shape lands the contract in one pass.
 *
 * Decoupled from the role context on purpose: the section always
 * runs Creative Strategy regardless of which role is active above
 * in Diagnosis. Other workstream families (Product Management,
 * Talent Acquisition, etc.) can join later via additional dataset
 * entries; the tab strip will re-enable automatically the moment a
 * second workstream lands.
 */

const WORKSTREAMS = creativeStrategyFreedomWorkstreams;
const DEFAULT_ID = WORKSTREAMS[0]?.id ?? "creative-strategy";

const PANEL_ID = "je-freedom-panel";

/**
 * `hideCaption` (default false) hides the trailing skillNote
 * paragraph ("Creative Strategy ships as one Skill in the team's
 * repo. Every surface that drafts campaigns — Mímir, Claude,
 * Cursor, Slack — reads the same contract."). Used by the
 * /claude-workshop-v1 route where the section is generalised and
 * the Mímir-specific caption would re-pin the framing to Loop.
 * Default keeps the homepage behaviour unchanged.
 */
export function DegreesOfFreedom({
  hideCaption = false,
}: {
  hideCaption?: boolean;
} = {}) {
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_ID);
  const active =
    WORKSTREAMS.find((w) => w.id === selectedId) ?? WORKSTREAMS[0]!;

  const bands: { key: FreedomBandLevel; band: FreedomBand }[] = [
    { key: "low", band: active.bands.low },
    { key: "medium", band: active.bands.medium },
    { key: "high", band: active.bands.high },
  ];

  return (
    <section
      className="section je-freedom-section"
      id="freedom"
      aria-labelledby="freedom-title"
    >
      <div className="wrap">
        <header className="aiop-section-head je-freedom-section__head reveal">
          <h2 className="aiop-section-title" id="freedom-title">
            One Skill. <em>Three degrees of freedom.</em>
          </h2>
          <p className="aiop-section-head__sub">
            Every Skill ships with the same three bands. Some things stay
            locked, so every team calling in gets the same foundations. Some
            shift with context, where judgment matters more than rules. Some
            stay open, where the AI should be free to create. The same Skill
            holds all three, and getting the balance right is most of the work.
          </p>
        </header>

        <div className="je-freedom reveal">
          {/* Local tab strip — only renders when there is more than
              one workstream. With a single workstream we surface a
              quiet eyebrow instead so the section reads as "one
              workstream wired up, more coming" rather than a lonely
              pill floating above the panel. State + a11y wiring stay
              ready so adding a second workstream (e.g. Product
              Management) re-enables the tabs without component
              churn. */}
          {WORKSTREAMS.length > 1 ? (
            <div
              className="je-tabs je-freedom__tabs"
              role="tablist"
              aria-label="Pick a workstream to see its freedom bands"
              aria-orientation="horizontal"
            >
              {WORKSTREAMS.map((w) => {
                const isActive = w.id === selectedId;
                return (
                  <button
                    key={w.id}
                    type="button"
                    role="tab"
                    id={`je-tab-${PANEL_ID}-${w.id}`}
                    aria-selected={isActive}
                    aria-controls={PANEL_ID}
                    tabIndex={isActive ? 0 : -1}
                    data-state={isActive ? "active" : "idle"}
                    className="je-tabs__tab"
                    onClick={() => setSelectedId(w.id)}
                  >
                    <span className="je-tabs__tab-num">{w.badge}</span>
                    <span className="je-tabs__tab-name">{w.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="je-freedom__eyebrow">
              <span className="je-freedom__eyebrow-badge">{active.badge}</span>
              <span className="je-freedom__eyebrow-name">{active.label}</span>
            </p>
          )}

          <div
            id={PANEL_ID}
            className="je-freedom__panel"
            role={WORKSTREAMS.length > 1 ? "tabpanel" : undefined}
            aria-labelledby={
              WORKSTREAMS.length > 1
                ? `je-tab-${PANEL_ID}-${active.id}`
                : undefined
            }
            key={active.id}
          >
            <p className="je-freedom__panel-description">
              {active.description}
            </p>

            {/* Three band cards laid out horizontally (Low / Medium
                / High). Each card has a coloured rail (red / violet
                / sage), a level badge, a headline, and three
                bullets. The previous dark Skill template card on
                the right retired because it duplicated the bullet
                list at a glance. */}
            <ol className="je-freedom__bands" role="list">
              {bands.map(({ key, band }) => (
                <li
                  key={key}
                  className={`je-freedom__band je-freedom__band--${key}`}
                >
                  <header className="je-freedom__band-head">
                    <span className="je-freedom__band-level">
                      {band.label}
                    </span>
                  </header>
                  <h3 className="je-freedom__band-headline">
                    {band.headline}
                  </h3>
                  <ul className="je-freedom__band-examples" role="list">
                    {band.examples.map((ex) => (
                      <li key={ex} className="je-freedom__band-example">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {hideCaption ? null : (
          <p className="je-freedom__caption reveal">{active.skillNote}</p>
        )}
      </div>
    </section>
  );
}

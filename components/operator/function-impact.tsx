import type { CSSProperties, ReactNode } from "react";

import {
  type FunctionImpactLane,
  type FunctionImpactMetric,
  type EncodedLoopRow,
  functionImpactSection,
} from "@/content/operator";

/* Lane ids that belong to the AI Innovation Office cluster. The
   roadmap renders these three lanes (Adoption / Intelligence layer
   / Build) inside one bordered wrapper with a floating "AI Innovation
   Office" pill label, so ownership reads top-down as
   VP Tech | AIO | Founder. Standalone lanes (infrastructure +
   mandate) render as direct <li> siblings outside the wrapper. */
const AIO_LANE_IDS = new Set<FunctionImpactLane["id"]>([
  "adoption",
  "intelligence",
  "build",
]);

/* Renders a single lane row. Extracted from the previous inline
   `lanes.map(...)` callback so the same body can render inside the
   AIO group wrapper or as a standalone <li> sibling without
   diverging. */
function renderLane(lane: FunctionImpactLane): ReactNode {
  const markPct = Math.max(2, Math.min(100, lane.progress));
  const laneStyle = {
    "--aiop-fi-mark": `${markPct}%`,
  } as CSSProperties;
  return (
    <li
      key={lane.id}
      className={`aiop-function-impact__lane aiop-function-impact__lane--${lane.tone}`}
      aria-label={`${lane.ordinal} ${lane.name} — ${lane.status}`}
      style={laneStyle}
    >
      <div className="aiop-function-impact__lane-id">
        <span className="aiop-function-impact__lane-ordinal">
          {lane.ordinal}
        </span>
        <span className="aiop-function-impact__lane-name">{lane.name}</span>
        <span className="aiop-function-impact__lane-headline">
          {lane.headline}
        </span>
      </div>

      <div className="aiop-function-impact__lane-bar">
        <span
          className="aiop-function-impact__lane-bar-track"
          aria-hidden="true"
        >
          <span className="aiop-function-impact__lane-bar-fill" />
          <span className="aiop-function-impact__lane-bar-dash" />
          <span className="aiop-function-impact__lane-bar-marker">
            <span className="aiop-function-impact__lane-bar-diamond" />
          </span>
        </span>
        <p className="aiop-function-impact__lane-summary">{lane.summary}</p>
      </div>

      <span
        className={`aiop-function-impact__lane-pill aiop-function-impact__lane-pill--${lane.tone}`}
      >
        {lane.status}
      </span>
    </li>
  );
}

/* Walks the lanes in order and wraps any contiguous run of AIO
   lane ids inside a single bordered group <li>. Standalone lanes
   render as direct <li> siblings on either side of the group. The
   walker uses a flush-on-boundary pattern so the AIO group is
   only emitted when at least one AIO lane appears in the run. */
function renderLaneRows(lanes: readonly FunctionImpactLane[]): ReactNode[] {
  const out: ReactNode[] = [];
  let buffer: FunctionImpactLane[] = [];

  const flushGroup = () => {
    if (buffer.length === 0) return;
    const groupLanes = buffer;
    buffer = [];
    out.push(
      <li
        key="aio-group"
        className="aiop-function-impact__group"
        role="group"
        aria-label="AI Innovation Office"
      >
        <span className="aiop-function-impact__group-pill">
          <span
            className="aiop-function-impact__group-pill-dot"
            aria-hidden="true"
          />
          AI Innovation Office
        </span>
        <ol
          className="aiop-function-impact__group-lanes"
          role="list"
          aria-label="Three lanes the AI Innovation Office owns"
        >
          {groupLanes.map(renderLane)}
        </ol>
      </li>,
    );
  };

  for (const lane of lanes) {
    if (AIO_LANE_IDS.has(lane.id)) {
      buffer.push(lane);
    } else {
      flushGroup();
      out.push(renderLane(lane));
    }
  }
  flushGroup();
  return out;
}

/*
 * FunctionImpact — Section 04 (v20.1 "Roadmap + Encoded Loops").
 *
 * The selected "Loop already has the layer. And it can scale." beat
 * at executive density.
 *
 * Composition:
 *   1. Section head            eyebrow + title + sub on the left,
 *                              compact intro line on the right.
 *   2. Stat strip              five program receipts on one row.
 *   3. Six lane bars           AI vision + Infrastructure + AIO group
 *                              (Adoption / Intelligence / Build) +
 *                              Scale mandate. Each lane is one row:
 *                                ordinal · name · italic headline
 *                                horizontal progress track (filled
 *                                segment up to a diamond marker,
 *                                dashed after) — status pill at the
 *                                right edge.
 *   4. Composition line        one-line VP <> Office adjacency note.
 *   5. Encoded loops ticker    news-show-style marquee at the foot
 *                              of the section naming every workflow
 *                              already running inside Loop (14 items
 *                              across 9 functions). Loops seamlessly
 *                              via a duplicated track + -50% translate.
 *                              Pauses on hover/focus. The section
 *                              closes on receipts, not rhetoric.
 *
 * The v19 column-matrix, ownership rail, and decision gate retire
 * here. Ownership lives in TeamShape; the decision rows live in the
 * CTA. This section is the roadmap visual, nothing else.
 *
 * Server component — no client hooks.
 *
 * `section` prop lets route variants override copy.
 */
export function FunctionImpact({
  section = functionImpactSection,
}: {
  section?: {
    id: string;
    label: string;
    title: string;
    titleEm: string;
    titleAfter: string;
    sub: string;
    intro: string;
    metrics: FunctionImpactMetric[];
    lanes: FunctionImpactLane[];
    composition: string;
    encodedLoops: { eyebrow: string; rows: EncodedLoopRow[] };
  };
} = {}) {
  const {
    id,
    label,
    title,
    titleEm,
    titleAfter,
    sub,
    intro,
    metrics,
    lanes,
    composition,
    encodedLoops,
  } = section;

  return (
    <section
      className="aiop-section aiop-section--soft aiop-function-impact"
      id={id}
      aria-label="The function is already running and it can scale"
    >
      <div className="aiop-wrap aiop-function-impact__inner">
        <header className="aiop-section-head aiop-function-impact__head aiop-reveal">
          <h2 className="aiop-section-title aiop-function-impact__title">
            {title} <em>{titleEm}</em>
            {titleAfter ? ` ${titleAfter}` : ""}
          </h2>
          <p className="aiop-section-head__sub aiop-function-impact__sub">
            {sub}
          </p>
        </header>

        <div
          className="aiop-function-impact__console aiop-reveal"
          aria-label="Operating roadmap"
        >
          <header className="aiop-function-impact__console-head">
            <span className="aiop-function-impact__console-label">
              <span
                className="aiop-function-impact__console-dot"
                aria-hidden="true"
              />
              {label}
            </span>
            <span className="aiop-function-impact__console-intro">
              {intro}
            </span>
          </header>

          <ol
            className="aiop-function-impact__metrics"
            role="list"
            aria-label="Twenty-one-day program receipts"
          >
            {metrics.map((metric) => (
              <li key={metric.k} className="aiop-function-impact__metric">
                <span className="aiop-function-impact__metric-v">
                  {metric.v}
                </span>
                <span className="aiop-function-impact__metric-k">
                  {metric.k}
                </span>
              </li>
            ))}
          </ol>

          <ol
            className="aiop-function-impact__lanes"
            role="list"
            aria-label="Six operating lanes"
          >
            {renderLaneRows(lanes)}
          </ol>

          <p className="aiop-function-impact__composition">
            <span
              className="aiop-function-impact__composition-dot"
              aria-hidden="true"
            />
            {composition}
          </p>
        </div>

        {/* News-show-style ticker at the bottom of the section. Names
            every workflow already running inside Loop without commentary,
            so the strip reads as receipts, not embellishment. The track
            is duplicated so the marquee can loop seamlessly via a
            -50% translateX in CSS. Same pattern as the Vision news
            ticker on the ai-operator route. */}
        <aside
          className="aiop-function-impact__ticker"
          aria-label="What's already encoded and running inside Loop"
        >
          <div className="aiop-wrap aiop-function-impact__ticker-head">
            <span className="aiop-function-impact__ticker-eyebrow">
              {encodedLoops.eyebrow}
            </span>
          </div>

          <div className="aiop-function-impact__ticker-marquee">
            <div className="aiop-function-impact__ticker-track" role="list">
              {[...encodedLoops.rows, ...encodedLoops.rows].map(
                (row, idx) => (
                  <span
                    key={`${row.fn}-${idx}`}
                    role="listitem"
                    aria-hidden={
                      idx >= encodedLoops.rows.length ? true : undefined
                    }
                    className={`aiop-function-impact__ticker-item aiop-function-impact__ticker-item--${row.tone}`}
                  >
                    <span className="aiop-function-impact__ticker-fn">
                      {row.fn}
                    </span>
                    <span
                      className="aiop-function-impact__ticker-sep"
                      aria-hidden="true"
                    />
                    <span className="aiop-function-impact__ticker-text">
                      {row.text}
                    </span>
                  </span>
                ),
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

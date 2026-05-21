"use client";

import { useMemo } from "react";

import type { EngineSkillId } from "@/content/engine-skills";

/*
 * EngineOntology — small SVG mini-graph that re-reads the current
 * composition's trace as nodes and edges.
 *
 * The point of pairing this with the trace rail is to land the
 * argument from the strategy spine: trace = runtime, graph =
 * memory. Same run, two readings. The trace rail shows the
 * fragments streaming in. The ontology view shows the same run as
 * a small graph: the question is a node, the Skills are nodes,
 * the sources are nodes, the decision is a node, every edge is a
 * read or a write.
 *
 * Layout (viewBox 0 0 360 340):
 *
 *           Question                  · top centre
 *              |
 *           Router
 *           /   \
 *      Skill   Skill   ...            · arc, evenly spaced
 *      /  \    /  \
 *    src  src src src                 · de-duplicated bag below
 *           \   /
 *          Decision                   · bottom centre, only when
 *                                       the synthesis lands
 *
 * Edge timing follows the trace state:
 *   - Question → Router            visible the moment picks land
 *   - Router → Skill               on `skill_start`
 *   - Skill → Source bag           on `skill_end` (citations row)
 *   - Skill → Decision             on `synthDone`
 *
 * Edges draw with a `stroke-dashoffset` keyframe defined in
 * `operator.css` (`.aiop-engine__edge.is-in`). Nodes fade in via
 * the `is-in` class on the wrapping `<g>`. Reduced-motion users
 * still see every node + edge — the keyframes just short-circuit
 * to their final state in operator.css.
 *
 * The whole thing is intentionally tiny (no graph layout library,
 * no force simulation). Positions are derived deterministically
 * from the picks order so re-renders during streaming never
 * shuffle node placement.
 */

type SkillTrace = {
  id: EngineSkillId;
  name: string;
  team: string;
  sources: readonly string[];
  status: "pending" | "streaming" | "done" | "failed";
  citations: string[];
};

type EngineOntologyProps = {
  question: string;
  skills: readonly SkillTrace[];
  synthDone: boolean;
};

/* ─── Geometry ────────────────────────────────────────────────── */

const VIEWBOX = { w: 360, h: 340 };
const QUESTION = { x: 180, y: 30 };
const ROUTER = { x: 180, y: 86 };
const DECISION = { x: 180, y: 312 };
const SKILL_RADIUS = 96;
const SOURCE_ROW_Y = 250;

/* Stable short labels for each Skill. Used as the in-graph node
   text so the graph reads at a glance without overflowing. */
const SHORT_LABEL: Record<EngineSkillId, string> = {
  "product-ideation": "Ideation",
  "ux-foundations": "UX",
  cmf: "CMF",
  packaging: "Packaging",
  "vsme-sustainability": "VSME",
  "risk-management": "Risk",
  "retail-marketing-calendar": "Calendar",
  "founder-tov": "Voice",
};

/* Returns the position of the Nth Skill node on the fan. The fan
   sweeps -55° to +55° from straight-down, centred on the router. */
function skillPosition(index: number, total: number) {
  const sweep = total === 1 ? 0 : 60; // degrees on each side of vertical
  const t = total === 1 ? 0.5 : index / (total - 1);
  const angleDeg = -sweep + t * (2 * sweep);
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: ROUTER.x + Math.sin(angleRad) * SKILL_RADIUS,
    y: ROUTER.y + Math.cos(angleRad) * SKILL_RADIUS,
  };
}

/* ─── Component ───────────────────────────────────────────────── */

export function EngineOntology({
  question,
  skills,
  synthDone,
}: EngineOntologyProps) {
  /* De-duplicated source bag for the row below the Skill arc.
     Sources only enter the graph once their owning Skill emits
     `skill_end` (status `done` or `failed`). The row is rendered
     as evenly-spaced small dots; we cap visible labels at 6 to
     avoid overcrowding the small viewport. */
  const sourceBag = useMemo(() => {
    const seen = new Map<string, EngineSkillId[]>();
    for (const s of skills) {
      if (s.status !== "done" && s.status !== "failed") continue;
      const list = s.citations.length > 0 ? s.citations : s.sources;
      for (const src of list) {
        const existing = seen.get(src);
        if (existing) existing.push(s.id);
        else seen.set(src, [s.id]);
      }
    }
    return [...seen.entries()].slice(0, 8).map(([label, owners]) => ({
      label,
      owners,
    }));
  }, [skills]);

  /* Source row positions — evenly spaced across the inner width. */
  const sourceRow = useMemo(() => {
    if (sourceBag.length === 0) return [] as { x: number; y: number }[];
    const pad = 28;
    const inner = VIEWBOX.w - pad * 2;
    if (sourceBag.length === 1) {
      return [{ x: VIEWBOX.w / 2, y: SOURCE_ROW_Y }];
    }
    return sourceBag.map((_, i) => {
      const t = i / (sourceBag.length - 1);
      return { x: pad + t * inner, y: SOURCE_ROW_Y };
    });
  }, [sourceBag]);

  const hasQuestion = question.length > 0;
  const hasRouter = skills.length > 0;

  return (
    <div className="aiop-engine__ontology-stage">
      <svg
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        className="aiop-engine__ontology-svg"
        role="img"
        aria-label="Composition rendered as an ontology graph"
      >
        <defs>
          {/* Soft halo behind the Question + Decision nodes so
              they read as the run's endpoints. */}
          <radialGradient
            id="aiop-engine-ontology-glow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stopColor="var(--aiop-violet, #6b5fff)"
              stopOpacity="0.28"
            />
            <stop
              offset="100%"
              stopColor="var(--aiop-violet, #6b5fff)"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* ─── Edges (drawn behind nodes) ───────────────────── */}
        <g className="aiop-engine__edges">
          {/* Question → Router */}
          {hasRouter ? (
            <line
              className="aiop-engine__edge aiop-engine__edge--spine is-in"
              x1={QUESTION.x}
              y1={QUESTION.y}
              x2={ROUTER.x}
              y2={ROUTER.y}
            />
          ) : null}

          {/* Router → Skill */}
          {skills.map((skill, idx) => {
            const pos = skillPosition(idx, skills.length);
            const active =
              skill.status === "streaming" ||
              skill.status === "done" ||
              skill.status === "failed";
            return (
              <line
                key={`edge-rs-${skill.id}`}
                className={`aiop-engine__edge aiop-engine__edge--router${
                  active ? " is-in" : ""
                }`}
                x1={ROUTER.x}
                y1={ROUTER.y}
                x2={pos.x}
                y2={pos.y}
              />
            );
          })}

          {/* Skill → Source bag (drawn dashed; appears on
              skill_end). We pick the first source-bag node a
              skill cites and run a single edge there, keeping the
              graph readable even with 6 skills × 4 sources. */}
          {skills.map((skill, idx) => {
            const skillPos = skillPosition(idx, skills.length);
            const list =
              skill.citations.length > 0 ? skill.citations : skill.sources;
            if (skill.status !== "done" && skill.status !== "failed") {
              return null;
            }
            return list.slice(0, 2).map((src, j) => {
              const srcIdx = sourceBag.findIndex((s) => s.label === src);
              if (srcIdx < 0) return null;
              const srcPos = sourceRow[srcIdx];
              if (!srcPos) return null;
              return (
                <line
                  key={`edge-ss-${skill.id}-${j}`}
                  className="aiop-engine__edge aiop-engine__edge--source is-in"
                  x1={skillPos.x}
                  y1={skillPos.y}
                  x2={srcPos.x}
                  y2={srcPos.y}
                />
              );
            });
          })}

          {/* Skill → Decision (only once synthesis lands) */}
          {synthDone
            ? skills.map((skill, idx) => {
                const pos = skillPosition(idx, skills.length);
                return (
                  <line
                    key={`edge-sd-${skill.id}`}
                    className="aiop-engine__edge aiop-engine__edge--decision is-in"
                    x1={pos.x}
                    y1={pos.y}
                    x2={DECISION.x}
                    y2={DECISION.y}
                  />
                );
              })
            : null}
        </g>

        {/* ─── Nodes ─────────────────────────────────────────── */}

        {/* Question */}
        {hasQuestion ? (
          <g
            className="aiop-engine__node aiop-engine__node--question is-in"
            transform={`translate(${QUESTION.x} ${QUESTION.y})`}
          >
            <circle r="22" className="aiop-engine__node-halo" />
            <circle r="13" className="aiop-engine__node-disc" />
            <text
              y="-22"
              className="aiop-engine__node-label aiop-engine__node-label--top"
              textAnchor="middle"
            >
              Question
            </text>
          </g>
        ) : null}

        {/* Router */}
        {hasRouter ? (
          <g
            className="aiop-engine__node aiop-engine__node--router is-in"
            transform={`translate(${ROUTER.x} ${ROUTER.y})`}
          >
            <circle r="10" className="aiop-engine__node-disc" />
            <text
              x="14"
              y="4"
              className="aiop-engine__node-label aiop-engine__node-label--side"
            >
              Router
            </text>
          </g>
        ) : null}

        {/* Skills */}
        {skills.map((skill, idx) => {
          const pos = skillPosition(idx, skills.length);
          const label = SHORT_LABEL[skill.id] ?? skill.name.split(" ")[0]!;
          return (
            <g
              key={`node-${skill.id}`}
              className={`aiop-engine__node aiop-engine__node--skill is-in aiop-engine__node--${skill.status}`}
              transform={`translate(${pos.x} ${pos.y})`}
            >
              <circle r="12" className="aiop-engine__node-halo" />
              <circle r="8" className="aiop-engine__node-disc" />
              <text
                y={pos.y > ROUTER.y + SKILL_RADIUS * 0.7 ? 22 : -14}
                className="aiop-engine__node-label aiop-engine__node-label--skill"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Sources */}
        {sourceBag.map((src, idx) => {
          const pos = sourceRow[idx];
          if (!pos) return null;
          return (
            <g
              key={`source-${src.label}`}
              className="aiop-engine__node aiop-engine__node--source is-in"
              transform={`translate(${pos.x} ${pos.y})`}
            >
              <rect
                x="-4"
                y="-4"
                width="8"
                height="8"
                className="aiop-engine__node-square"
              />
            </g>
          );
        })}

        {/* Decision — only renders once synth lands */}
        {synthDone ? (
          <g
            className="aiop-engine__node aiop-engine__node--decision is-in"
            transform={`translate(${DECISION.x} ${DECISION.y})`}
          >
            <circle
              r="22"
              className="aiop-engine__node-halo"
              fill="url(#aiop-engine-ontology-glow)"
            />
            <circle r="13" className="aiop-engine__node-disc" />
            <text
              y="26"
              className="aiop-engine__node-label aiop-engine__node-label--bottom"
              textAnchor="middle"
            >
              Decision
            </text>
          </g>
        ) : null}
      </svg>

      {/* Small legend below the SVG. Kept tiny + mono so it reads
          as instrumentation, not navigation. */}
      <ul className="aiop-engine__ontology-legend" role="list">
        <li>
          <span className="aiop-engine__legend-dot aiop-engine__legend-dot--node" />
          Node
        </li>
        <li>
          <span className="aiop-engine__legend-dot aiop-engine__legend-dot--square" />
          Source
        </li>
        <li>
          <span className="aiop-engine__legend-line" />
          Edge
        </li>
      </ul>
    </div>
  );
}

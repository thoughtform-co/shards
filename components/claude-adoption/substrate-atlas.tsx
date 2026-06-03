"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  caClustersByAxis,
  caSubstrateEngines,
  caSubstrateLabels,
  type CaAxis,
  type CaCluster,
  type CaSkillCard,
  type CaSubstrate,
  type CaTeamBlock,
} from "@/content/claude-adoption";
import { caSkillsTeams } from "@/content/claude-adoption-teams";

/*
 * SubstrateAtlas — weighted donut of clusters with skill chips on the
 * outer rim. The donut is axis-aware: pass `axis="engine"` (default),
 * `"team"`, or `"phase"` to re-slice the same skill set.
 *
 * Chip color is always bound to the skill's intrinsic substrate.
 * Sector color is bound to the active axis (via [data-axis] +
 * [data-cluster-id] hooks consumed in CSS).
 */

const VIEW = 720;
const CX = VIEW / 2;
const CY = VIEW / 2;
const ARC_INNER = 110;
const ARC_OUTER = 230;
const CHIP_R = 264;
const TICK_R0 = 230;
const TICK_R1 = 258;
const SECTOR_GAP_DEG = 4;

type SkillCatalogEntry = {
  card: CaSkillCard;
  teamName: string;
  teamId: string;
  workshopDate?: string;
  substrate: CaSubstrate;
  engineLabel: string;
};

type ChipGeom = {
  skillId: string;
  /** Cluster (sector) the chip belongs to in the active axis. */
  sectorId: string;
  /** Skill's intrinsic substrate. Drives chip color across all axes. */
  substrate: CaSubstrate;
  title: string;
  team: string;
  status: CaSkillCard["status"];
  statusLabel: string;
  angleDeg: number;
  x: number;
  y: number;
  tickX0: number;
  tickY0: number;
  tickX1: number;
  tickY1: number;
  sectorIndex: number;
  indexInSector: number;
};

type SectorGeom = {
  id: string;
  label: string;
  sublabel?: string;
  skillCount: number;
  teamCount: number;
  startDeg: number;
  endDeg: number;
  midDeg: number;
  path: string;
  labelX: number;
  labelY: number;
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function sectorPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number,
): string {
  const sO = polar(cx, cy, rOuter, startDeg);
  const eO = polar(cx, cy, rOuter, endDeg);
  const eI = polar(cx, cy, rInner, endDeg);
  const sI = polar(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${sO.x.toFixed(2)} ${sO.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${eO.x.toFixed(2)} ${eO.y.toFixed(2)}`,
    `L ${eI.x.toFixed(2)} ${eI.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${sI.x.toFixed(2)} ${sI.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function buildSkillCatalog(
  teams: readonly CaTeamBlock[],
): Map<string, SkillCatalogEntry> {
  const map = new Map<string, SkillCatalogEntry>();
  for (const team of teams) {
    for (const card of team.cards) {
      if (!card.substrate) continue;
      map.set(card.id, {
        card,
        teamName: team.team,
        teamId: team.id,
        workshopDate: team.workshopDate,
        substrate: card.substrate,
        engineLabel: caSubstrateLabels[card.substrate],
      });
    }
  }
  return map;
}

/** Split a short sentence into two roughly-balanced lines on a word
 *  boundary. Used for the verb tspans inside each sector slice so a
 *  ~6-word substrate verb (e.g. "Composes structured outputs from
 *  recurring inputs.") can wrap inside the slice without SVG text
 *  needing real wrapping. */
function splitToTwoLines(text: string): [string, string] {
  const words = text.split(" ");
  if (words.length <= 1) return [text, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function buildAtlasGeometry(
  clusters: readonly CaCluster[],
  catalog: Map<string, SkillCatalogEntry>,
) {
  const taggedTotal = clusters.reduce((n, c) => n + c.skillCount, 0);
  const activeSectorCount = clusters.filter((c) => c.skillCount > 0).length;
  const gapTotal = activeSectorCount * SECTOR_GAP_DEG;
  const usableDeg = 360 - gapTotal;
  let cursor = 0;

  const sectors: SectorGeom[] = [];
  const chips: ChipGeom[] = [];
  const chipOrder: string[] = [];

  clusters.forEach((cluster, sectorIndex) => {
    if (cluster.skillCount === 0) {
      sectors.push({
        id: cluster.id,
        label: cluster.label,
        sublabel: cluster.sublabel,
        skillCount: 0,
        teamCount: cluster.teamCount,
        startDeg: cursor,
        endDeg: cursor,
        midDeg: cursor,
        path: "",
        labelX: CX,
        labelY: CY,
      });
      return;
    }

    const span =
      taggedTotal > 0
        ? (cluster.skillCount / taggedTotal) * usableDeg
        : usableDeg / clusters.length;
    const startDeg = cursor + SECTOR_GAP_DEG / 2;
    const endDeg = startDeg + span;
    cursor = endDeg + SECTOR_GAP_DEG / 2;
    const midDeg = (startDeg + endDeg) / 2;
    const labelPt = polar(CX, CY, (ARC_INNER + ARC_OUTER) / 2, midDeg);

    sectors.push({
      id: cluster.id,
      label: cluster.label,
      sublabel: cluster.sublabel,
      skillCount: cluster.skillCount,
      teamCount: cluster.teamCount,
      startDeg,
      endDeg,
      midDeg,
      path: sectorPath(CX, CY, ARC_INNER, ARC_OUTER, startDeg, endDeg),
      labelX: labelPt.x,
      labelY: labelPt.y,
    });

    const n = cluster.skills.length;
    cluster.skills.forEach((skill, i) => {
      const t = n === 1 ? 0.5 : (i + 0.5) / n;
      const angleDeg = startDeg + t * (endDeg - startDeg);
      const pt = polar(CX, CY, CHIP_R, angleDeg);
      const t0 = polar(CX, CY, TICK_R0, angleDeg);
      const t1 = polar(CX, CY, TICK_R1, angleDeg);
      const entry = catalog.get(skill.id);
      const substrate = entry?.substrate ?? "pattern";

      chips.push({
        skillId: skill.id,
        sectorId: cluster.id,
        substrate,
        title: skill.title,
        team: skill.team,
        status: entry?.card.status ?? "scoped",
        statusLabel: entry?.card.statusLabel ?? "SCOPED",
        angleDeg,
        x: pt.x,
        y: pt.y,
        tickX0: t0.x,
        tickY0: t0.y,
        tickX1: t1.x,
        tickY1: t1.y,
        sectorIndex,
        indexInSector: i,
      });
      chipOrder.push(skill.id);
    });
  });

  return { sectors, chips, chipOrder, taggedTotal };
}

export function SubstrateAtlas({ axis = "engine" }: { axis?: CaAxis } = {}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hoveredSectorId, setHoveredSectorId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const catalog = useMemo(
    () => buildSkillCatalog(caSkillsTeams),
    [],
  );

  const clusters = caClustersByAxis[axis];

  const geometry = useMemo(
    () => buildAtlasGeometry(clusters, catalog),
    [clusters, catalog],
  );

  const chipById = useMemo(() => {
    const m = new Map<string, (typeof geometry.chips)[number]>();
    for (const c of geometry.chips) m.set(c.skillId, c);
    return m;
  }, [geometry.chips]);

  const totalCards = useMemo(
    () => caSkillsTeams.reduce((n, t) => n + t.cards.length, 0),
    [],
  );
  const untaggedCount = totalCards - geometry.taggedTotal;

  const activeSectorId =
    hoveredSectorId ??
    (selectedSkillId
      ? chipById.get(selectedSkillId)?.sectorId ?? null
      : null) ??
    (hoveredSkillId ? chipById.get(hoveredSkillId)?.sectorId ?? null : null) ??
    (focusedSkillId ? chipById.get(focusedSkillId)?.sectorId ?? null : null);

  const activeSkillId = selectedSkillId ?? hoveredSkillId ?? focusedSkillId;

  // Per-substrate verb (e.g. "Applies senior judgment to varied
  // inputs.") rendered as a 2-line label inside each sector slice
  // when the donut is sliced by substrate. Lookup is by sector id —
  // which is the substrate id in this axis.
  const substrateVerbById = useMemo(() => {
    const m = new Map<string, string>();
    if (axis !== "engine") return m;
    for (const engine of caSubstrateEngines) m.set(engine.id, engine.verb);
    return m;
  }, [axis]);

  const closeSelected = useCallback(() => setSelectedSkillId(null), []);

  // Reset transient atlas state when the axis changes so a stale
  // selection or hover from the previous slicing doesn't carry over.
  useEffect(() => {
    setHoveredSectorId(null);
    setHoveredSkillId(null);
    setFocusedSkillId(null);
    setSelectedSkillId(null);
  }, [axis]);

  useEffect(() => {
    if (!selectedSkillId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSelected();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedSkillId, closeSelected]);

  useEffect(() => {
    if (!selectedSkillId) return;
    const onPointer = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const target = e.target as Node;
      const selectedWrap = stage.querySelector(
        `[data-skill-wrap="${selectedSkillId}"]`,
      );
      if (selectedWrap?.contains(target)) return;
      closeSelected();
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [selectedSkillId, closeSelected]);

  const moveChipFocus = useCallback(
    (
      skillId: string,
      direction: "prev" | "next" | "sectorUp" | "sectorDown",
    ) => {
      const chip = chipById.get(skillId);
      if (!chip) return;

      const sectorChips = geometry.chips.filter(
        (c) => c.sectorId === chip.sectorId,
      );
      const sectorIdx = chip.sectorIndex;

      if (direction === "prev" || direction === "next") {
        const idx = sectorChips.findIndex((c) => c.skillId === skillId);
        const next =
          direction === "next"
            ? sectorChips[(idx + 1) % sectorChips.length]
            : sectorChips[(idx - 1 + sectorChips.length) % sectorChips.length];
        if (next) setFocusedSkillId(next.skillId);
        return;
      }

      const totalSectors = clusters.length;
      const targetSectorIndex =
        direction === "sectorUp"
          ? (sectorIdx - 1 + totalSectors) % totalSectors
          : (sectorIdx + 1) % totalSectors;

      const targetSector = geometry.chips.filter(
        (c) => c.sectorIndex === targetSectorIndex,
      );
      if (targetSector.length === 0) return;

      const slot = Math.min(chip.indexInSector, targetSector.length - 1);
      setFocusedSkillId(targetSector[slot]!.skillId);
    },
    [chipById, clusters.length, geometry.chips],
  );

  const onChipKeyDown = (e: React.KeyboardEvent, skillId: string) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSelected();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveChipFocus(skillId, "next");
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveChipFocus(skillId, "prev");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveChipFocus(skillId, "sectorUp");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveChipFocus(skillId, "sectorDown");
    }
  };

  const toggleSelected = (skillId: string) => {
    setSelectedSkillId((prev) => (prev === skillId ? null : skillId));
  };

  const isDimmedSector = (sectorId: string) =>
    activeSectorId != null && activeSectorId !== sectorId;

  const isDimmedChip = (chip: (typeof geometry.chips)[number]) =>
    activeSectorId != null && activeSectorId !== chip.sectorId;

  return (
    <div
      className="ca-atlas"
      data-axis={axis}
      data-ca-atlas-dim={activeSectorId ? "on" : undefined}
      data-ca-atlas-sector={activeSectorId ?? undefined}
      data-ca-atlas-skill={activeSkillId ?? undefined}
      data-ca-atlas-expanded={selectedSkillId ? "true" : undefined}
    >
      <div className="ca-atlas__stage" ref={stageRef}>
        <svg
          className="ca-atlas__svg"
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          role="img"
          aria-label={
            axis === "engine"
              ? "Substrate engines as a weighted ring. Each sector is a substrate type; outer chips are encoded skills."
              : axis === "team"
                ? "Skills weighted by team. Each sector is one team; outer chips are that team's encoded skills."
                : "Skills weighted by adoption phase. Each sector is one phase; outer chips are skills from teams in that phase."
          }
        >
          <circle
            className="ca-atlas__ring ca-atlas__ring--outer"
            cx={CX}
            cy={CY}
            r={ARC_OUTER + 8}
            aria-hidden="true"
          />
          <circle
            className="ca-atlas__ring ca-atlas__ring--inner"
            cx={CX}
            cy={CY}
            r={ARC_INNER - 6}
            aria-hidden="true"
          />

          {geometry.sectors.map((sector) =>
            sector.skillCount > 0 ? (
              <path
                key={sector.id}
                d={sector.path}
                className="ca-atlas__sector"
                data-axis={axis}
                data-cluster-id={sector.id}
                data-substrate={axis === "engine" ? sector.id : undefined}
                data-phase={axis === "phase" ? sector.id : undefined}
                data-team={axis === "team" ? sector.id : undefined}
                data-dimmed={isDimmedSector(sector.id) ? "true" : undefined}
                tabIndex={-1}
                aria-label={`${sector.label}, ${sector.skillCount} skills, ${sector.teamCount} teams`}
                onMouseEnter={() => setHoveredSectorId(sector.id)}
                onMouseLeave={() => setHoveredSectorId(null)}
              />
            ) : null,
          )}

          {geometry.chips.map((chip) => (
            <line
              key={`tick-${chip.skillId}`}
              className="ca-atlas__tick"
              data-substrate={chip.substrate}
              data-dimmed={isDimmedChip(chip) ? "true" : undefined}
              x1={chip.tickX0}
              y1={chip.tickY0}
              x2={chip.tickX1}
              y2={chip.tickY1}
              aria-hidden="true"
            />
          ))}

          {geometry.sectors.map((sector) => {
            if (sector.skillCount === 0) return null;
            const verb = substrateVerbById.get(sector.id);
            const [verbLine1, verbLine2] = verb
              ? splitToTwoLines(verb)
              : ["", ""];
            const hasVerb = Boolean(verb);
            return (
              <text
                key={`label-${sector.id}`}
                className="ca-atlas__sector-label"
                data-axis={axis}
                data-cluster-id={sector.id}
                data-substrate={axis === "engine" ? sector.id : undefined}
                data-phase={axis === "phase" ? sector.id : undefined}
                data-dimmed={isDimmedSector(sector.id) ? "true" : undefined}
                x={sector.labelX}
                y={sector.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                aria-hidden="true"
              >
                <tspan
                  className="ca-atlas__sector-label-name"
                  x={sector.labelX}
                  dy={hasVerb ? "-1.65em" : "-0.35em"}
                >
                  {sector.label}
                </tspan>
                <tspan
                  className="ca-atlas__sector-label-count"
                  x={sector.labelX}
                  dy="1.2em"
                >
                  {sector.skillCount} skills
                </tspan>
                {hasVerb ? (
                  <>
                    <tspan
                      className="ca-atlas__sector-label-verb"
                      x={sector.labelX}
                      dy="1.7em"
                    >
                      {verbLine1}
                    </tspan>
                    {verbLine2 ? (
                      <tspan
                        className="ca-atlas__sector-label-verb"
                        x={sector.labelX}
                        dy="1.15em"
                      >
                        {verbLine2}
                      </tspan>
                    ) : null}
                  </>
                ) : null}
              </text>
            );
          })}
        </svg>

        <div className="ca-atlas__core" aria-hidden="true">
          <span className="ca-atlas__core-kicker">Intelligence layer</span>
          <strong className="ca-atlas__core-count">
            {geometry.taggedTotal} skills
          </strong>
          <span className="ca-atlas__core-teams">
            {caSkillsTeams.length} teams
          </span>
          {untaggedCount > 0 ? (
            <span className="ca-atlas__core-untagged">
              +{untaggedCount} untagged below
            </span>
          ) : null}
        </div>

        <div className="ca-atlas__chips" role="list">
          {geometry.chips.map((chip) => {
            const isActive = activeSkillId === chip.skillId;
            const isSelected = selectedSkillId === chip.skillId;
            const showTooltip =
              hoveredSkillId === chip.skillId && !isSelected;
            const entry = catalog.get(chip.skillId);
            const detailsId = `chip-details-${chip.skillId}`;

            return (
              <div
                key={chip.skillId}
                className="ca-atlas__chip-wrap"
                data-skill-wrap={chip.skillId}
                data-expanded={isSelected ? "true" : undefined}
                style={{
                  left: `${(chip.x / VIEW) * 100}%`,
                  top: `${(chip.y / VIEW) * 100}%`,
                }}
                role="listitem"
              >
                <button
                  type="button"
                  className="ca-atlas__chip"
                  data-substrate={chip.substrate}
                  data-status={chip.status}
                  data-active={isActive ? "true" : undefined}
                  data-dimmed={isDimmedChip(chip) ? "true" : undefined}
                  data-expanded={isSelected ? "true" : undefined}
                  aria-expanded={isSelected}
                  aria-controls={detailsId}
                  aria-label={`${chip.title}, ${chip.team}, ${chip.statusLabel}. ${isSelected ? "Collapse" : "Expand"} details.`}
                  onMouseEnter={() => setHoveredSkillId(chip.skillId)}
                  onMouseLeave={() => setHoveredSkillId(null)}
                  onFocus={() => setFocusedSkillId(chip.skillId)}
                  onBlur={() =>
                    setFocusedSkillId((id) =>
                      id === chip.skillId ? null : id,
                    )
                  }
                  onClick={() => toggleSelected(chip.skillId)}
                  onKeyDown={(e) => onChipKeyDown(e, chip.skillId)}
                >
                  <span className="ca-atlas__chip-head">
                    <span className="ca-atlas__chip-dot" aria-hidden="true" />
                    <span className="ca-atlas__chip-title">{chip.title}</span>
                  </span>

                  <span
                    className="ca-atlas__chip-details"
                    id={detailsId}
                    aria-hidden={!isSelected}
                  >
                    <span className="ca-atlas__chip-detail-row">
                      <span
                        className="ca-atlas__chip-substrate"
                        data-substrate={chip.substrate}
                      >
                        {entry?.engineLabel ?? chip.substrate}
                      </span>
                      <span
                        className="ca-atlas__chip-detail-status"
                        data-status={chip.status}
                      >
                        {chip.statusLabel}
                      </span>
                    </span>
                    <span className="ca-atlas__chip-team">
                      {chip.team}
                      {entry?.workshopDate ? ` · ${entry.workshopDate}` : ""}
                    </span>
                    <span className="ca-atlas__chip-owner">
                      {entry?.card.owner}
                    </span>
                    <span className="ca-atlas__chip-body">
                      {entry?.card.body}
                    </span>
                    <span className="ca-atlas__chip-footnote">
                      {entry?.card.footnote}
                    </span>
                  </span>
                </button>

                {isSelected ? (
                  <a
                    className="ca-atlas__chip-cta"
                    href={`#skill-${chip.skillId}`}
                  >
                    See team block
                    <span aria-hidden="true">→</span>
                  </a>
                ) : null}

                {showTooltip ? (
                  <div className="ca-atlas__tooltip" role="tooltip">
                    <span className="ca-atlas__tooltip-team">{chip.team}</span>
                    <span className="ca-atlas__tooltip-status">
                      {chip.statusLabel}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

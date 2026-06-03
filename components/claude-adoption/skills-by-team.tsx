"use client";

import { useMemo, useRef, useState } from "react";

import {
  caEnginesIntro,
  caSkillsByTeamSection,
  caSubstrateEngines,
  caSubstrateOrder,
  type CaAxis,
  type CaSkillCard,
  type CaSubstrate,
  type CaTeamBlock,
} from "@/content/claude-adoption";

import { SkillCardItem } from "./skill-card-item";
import { SkillTeamBlock } from "./skill-team-block";
import { SubstrateAtlas } from "./substrate-atlas";

/*
 * SkillsByTeam — axis-driven engines section.
 *
 * Owns the active axis (engine / team / phase). The same axis
 * value drives the atlas donut sectors and the breakdown below
 * so the page stays in lock-step.
 */

type CardWithTeam = {
  card: CaSkillCard;
  teamName: string;
};

const AXIS_TABS: readonly { id: CaAxis; label: string }[] = [
  { id: "engine", label: "By substrate" },
  { id: "team", label: "By team" },
];

function cardsBySubstrate(
  teams: readonly CaTeamBlock[],
): Map<CaSubstrate, CardWithTeam[]> {
  const out = new Map<CaSubstrate, CardWithTeam[]>(
    caSubstrateOrder.map((s) => [s, []]),
  );
  for (const team of teams) {
    for (const card of team.cards) {
      if (!card.substrate) continue;
      out.get(card.substrate)!.push({ card, teamName: team.team });
    }
  }
  return out;
}

export function SkillsByTeam() {
  const {
    id,
    ariaLabel,
    title,
    titleEm,
    titleAfter,
    sub,
    teams,
  } = caSkillsByTeamSection;

  const [axis, setAxis] = useState<CaAxis>("team");
  const tabsRef = useRef<HTMLDivElement>(null);

  const engineCards = useMemo(() => cardsBySubstrate(teams), [teams]);

  const onTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const nextIdx = (idx + dir + AXIS_TABS.length) % AXIS_TABS.length;
    const nextAxis = AXIS_TABS[nextIdx]!.id;
    setAxis(nextAxis);
    const root = tabsRef.current;
    if (!root) return;
    const btn = root.querySelector<HTMLButtonElement>(
      `[data-axis-tab="${nextAxis}"]`,
    );
    btn?.focus();
  };

  return (
    <section
      className="aiop-section ca-skills"
      id={id}
      aria-label={ariaLabel}
    >
      <div className="aiop-wrap">
        <header className="aiop-section-head ca-skills__head aiop-reveal">
          <h2 className="aiop-section-title">
            {title} <em>{titleEm}</em>
            {titleAfter ?? ""}
          </h2>
          <p className="aiop-section-head__sub">{sub}</p>
        </header>

        <div className="ca-engines aiop-reveal">
          <p className="ca-engines__stat-strip">{caEnginesIntro.statLine}</p>

          {/* View tabs — centered horizontally as the section's primary
              control. Driving both the atlas axis and the substrate
              legend visibility below, so it makes sense as the lead
              affordance. */}
          <div
            className="ca-axis-tabs ca-axis-tabs--centered"
            role="tablist"
            aria-label="Group skills by"
            ref={tabsRef}
          >
            <span className="ca-axis-tabs__label" aria-hidden="true">
              View
            </span>
            <div className="ca-axis-tabs__group">
              {AXIS_TABS.map((tab, idx) => {
                const active = axis === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    data-axis-tab={tab.id}
                    data-active={active ? "true" : undefined}
                    className="ca-axis-tabs__btn"
                    aria-selected={active}
                    aria-controls={`ca-skills-breakdown-${tab.id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setAxis(tab.id)}
                    onKeyDown={(e) => onTabKeyDown(e, idx)}
                  >
                    <span className="ca-axis-tabs__btn-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiet definition line under the tabs in the substrate
              view. Names what a "substrate" is so the rest of the
              section reads on its own terms. */}
          {axis === "engine" ? (
            <p className="ca-axis-tabs__hint" aria-hidden="true">
              Substrates are the recurring shapes of work Skills
              cluster into
            </p>
          ) : null}

          <SubstrateAtlas axis={axis} />

          {/* Governance sign-off — sits directly under the donut so
              the visitor reads "here's the surface, here's where it
              lives" in one beat, before the per-team / per-substrate
              breakdown below. No frame: a quiet muted line plus the
              GitHub CTA. */}
          <aside
            className="ca-skills-repo aiop-reveal"
            aria-label="Skills governance"
          >
            <p className="ca-skills-repo__body">
              All production-ready Skills are versioned, reviewed, and
              owned by the team in one GitHub monorepo &mdash; not by
              the person who wrote them.
            </p>
            <a
              className="ca-skills-repo__cta"
              href="https://github.com/tensalir/loop-skills"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Loop Skills repository on GitHub"
            >
              <svg
                className="ca-skills-repo__cta-icon"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                />
              </svg>
              <span className="ca-skills-repo__cta-text">
                <span className="ca-skills-repo__cta-label">View the repo</span>
                <span className="ca-skills-repo__cta-path">
                  tensalir/loop-skills
                </span>
              </span>
              <span className="ca-skills-repo__cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </aside>
        </div>

        {axis === "team" ? (
          <ol
            id="ca-skills-breakdown-team"
            className="ca-skills__teams ca-skills__teams--deep-dive aiop-reveal"
            role="list"
          >
            {teams.map((team) => (
              <li key={team.id}>
                <SkillTeamBlock team={team} />
              </li>
            ))}
          </ol>
        ) : null}

        {axis === "engine" ? (
          <ol
            id="ca-skills-breakdown-engine"
            className="ca-skills__clusters aiop-reveal"
            role="list"
          >
            {caSubstrateEngines.map((engine) => {
              const items = engineCards.get(engine.id) ?? [];
              if (items.length === 0) return null;
              return (
                <li key={engine.id}>
                  <section
                    className="ca-cluster"
                    data-axis="engine"
                    data-cluster-id={engine.id}
                    data-substrate={engine.id}
                    aria-label={`${engine.label} engine, ${engine.skillCount} skills`}
                  >
                    <header className="ca-cluster__head">
                      <span className="ca-cluster__bar" aria-hidden="true" />
                      <div className="ca-cluster__head-text">
                        <h3 className="ca-cluster__name">{engine.label}</h3>
                        <p className="ca-cluster__verb">{engine.verb}</p>
                      </div>
                      <span className="ca-cluster__count">
                        {engine.skillCount} skills · {engine.teamCount} teams
                      </span>
                    </header>

                    <ul
                      className="ca-team__cards ca-cluster__cards"
                      role="list"
                    >
                      {items.map(({ card, teamName }) => (
                        <SkillCardItem
                          key={card.id}
                          card={card}
                          teamName={teamName}
                        />
                      ))}
                    </ul>
                  </section>
                </li>
              );
            })}
          </ol>
        ) : null}

      </div>
    </section>
  );
}

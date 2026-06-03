import type { CaSkillCard, CaTeamBlock } from "@/content/claude-adoption";

import { SkillCardItem } from "./skill-card-item";

/*
 * SkillTeamBlock — single team's header + card grid.
 */

function countChip(cards: readonly CaSkillCard[]): string {
  const shipped = cards.filter(
    (c) => c.status === "in-use" || c.status === "shipped",
  ).length;
  const build = cards.filter(
    (c) => c.status === "in-build" || c.status === "scoped",
  ).length;
  const parts: string[] = [];
  if (shipped > 0) parts.push(`${shipped} SHIPPED`);
  if (build > 0) parts.push(`${build} IN BUILD`);
  return parts.join(" \u00b7 ");
}

export function SkillTeamBlock({ team }: { team: CaTeamBlock }) {
  const chip = countChip(team.cards);
  const ariaLabel = team.workshopDate
    ? `${team.team}. Workshop ${team.workshopDate}.`
    : team.team;

  return (
    <section
      className="ca-team"
      id={`team-${team.id}`}
      aria-label={ariaLabel}
      aria-labelledby={`team-${team.id}-head`}
    >
      <header className="ca-team__head">
        <h3 className="ca-team__name" id={`team-${team.id}-head`}>
          {team.team}
        </h3>
        <span className="ca-team__count-chip">{chip}</span>
      </header>

      <ul className="ca-team__cards" role="list">
        {team.cards.map((card) => (
          <SkillCardItem key={card.id} card={card} />
        ))}
      </ul>

      {team.moreTail ? (
        <p className="ca-team__more-tail">{team.moreTail}</p>
      ) : null}
    </section>
  );
}

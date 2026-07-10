import { SkillCardItem } from "@/components/claude-adoption/skill-card-item";
import type { CaSkillCard } from "@/content/claude-adoption";

/*
 * ExalateScopedSkills — the "For Exalate" turn of the Skills beat.
 *
 * Sits directly after SkillsByTeam (the Loop 42-skill donut, kept as
 * proof) and answers it: six Skills scoped live in the 10 July 2026
 * workshop, one per workflow, each owned by the person who raised it.
 *
 * Reuses the claude-adoption card system as-is: SkillCardItem renders
 * owner + SCOPED pill + body + footnote + substrate tag, and
 * `.ca-team__cards` carries the responsive 1/2/3-column grid on its
 * own (claude-adoption.css §skills). SkillTeamBlock is deliberately
 * NOT reused — its count chip would read "6 IN BUILD" for a block of
 * scoped-only cards, which overstates where these are.
 */

export type ExalateSkillsSection = {
  id: string;
  ariaLabel: string;
  title: string;
  titleEm: string;
  accentLine?: string;
  sub: string;
  cards: readonly CaSkillCard[];
  moreTail?: string;
};

export function ExalateScopedSkills({
  section,
}: {
  section: ExalateSkillsSection;
}) {
  return (
    <section
      className="aiop-section ca-skills exalate-skills"
      id={section.id}
      aria-label={section.ariaLabel}
    >
      <div className="aiop-wrap">
        <header className="aiop-section-head ca-skills__head aiop-reveal">
          <h2 className="aiop-section-title">
            {section.title} <em>{section.titleEm}</em>
            {section.accentLine ? (
              <>
                <br />
                <span className="ca-skills__title-accent">
                  {section.accentLine}
                </span>
              </>
            ) : null}
          </h2>
          <p className="aiop-section-head__sub">{section.sub}</p>
        </header>

        <ul
          className="ca-team__cards exalate-skills__cards aiop-reveal"
          role="list"
        >
          {section.cards.map((card) => (
            <SkillCardItem key={card.id} card={card} />
          ))}
        </ul>

        {section.moreTail ? (
          <p className="ca-team__more-tail exalate-skills__more-tail aiop-reveal">
            {section.moreTail}
          </p>
        ) : null}
      </div>
    </section>
  );
}

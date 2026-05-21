import { claudeSkillAnatomySection } from "@/content/claude-workshop";

/*
 * ClaudeSkillAnatomy — sits OUTSIDE the Anthropic chapter, in the
 * encode deep-dive area, on the Aether palette.
 *
 * The point of this section is to land "what a Skill is" right
 * after EncodingInterstitial ("Encode it once, inside the work.")
 * and right before TheShift (rules engineered to context
 * encoded). It closes the gap between the editorial pivot above
 * and the close-up below: the team just heard "encode it once,"
 * and now learns what the encoded unit looks like in Claude.
 *
 * Visual posture deliberately stays Aether. Only one Clay-tinted
 * badge in the top-left signals the Claude origin. The rest of
 * the surface, type, and rule colours come from the surrounding
 * `--aiop-*` tokens, so the section reads as a sibling of
 * TheShift / DegreesOfFreedom rather than as a foreign brand
 * block.
 */

export function ClaudeSkillAnatomy() {
  const section = claudeSkillAnatomySection;

  return (
    <section
      className="aiop-section aiop-claude-skill-anatomy"
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      aria-label={section.ariaLabel}
    >
      <div className="aiop-wrap aiop-claude-skill-anatomy__inner aiop-reveal">
        <header className="aiop-section-head aiop-claude-skill-anatomy__head">
          <span className="aiop-claude-skill-anatomy__badge">
            <span
              className="aiop-claude-skill-anatomy__badge-dot"
              aria-hidden="true"
            />
            {section.badge}
          </span>
          <h2
            className="aiop-section-title aiop-claude-skill-anatomy__title"
            id={`${section.id}-title`}
          >
            {section.title} <em>{section.titleEm}</em>
            {section.titleAfter ?? ""}
          </h2>
          <p className="aiop-section-head__sub aiop-claude-skill-anatomy__body">
            {section.body}
          </p>
        </header>

        <dl className="aiop-claude-skill-anatomy__rows">
          {section.rows.map((row) => (
            <div key={row.id} className="aiop-claude-skill-anatomy__row">
              <dt className="aiop-claude-skill-anatomy__row-label">
                {row.label}
              </dt>
              <dd className="aiop-claude-skill-anatomy__row-body">
                {row.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

import { claudeSkillsAtLoopSection } from "@/content/claude-workshop";

/*
 * ClaudeSkillsAtLoop — second of the two Skills sections folded
 * into the encode deep-dive. Sits AFTER DegreesOfFreedom and
 * BEFORE SoftwareForFew, on the Aether palette.
 *
 * The deep-dive sequence reads as:
 *
 *   EncodingInterstitial   "Encode it once."
 *   ClaudeSkillAnatomy     What a Skill is.
 *   TheShift               Rules engineered to context encoded.
 *   DegreesOfFreedom       One Skill, three degrees of freedom.
 *   ClaudeSkillsAtLoop     What's already running.
 *   SoftwareForFew         Tools the team builds for itself.
 *
 * This section lands the receipts: five Skills already in use at
 * Loop, each with the owner credit where it applies. The footnote
 * stitches back to the 15-skill carousel earlier on the page so
 * the visitor reads these five as the same shape as the fifteen,
 * just on a different team.
 *
 * Posture matches Aether: ivory card surfaces, Bodoni titles,
 * mono-caps owners. No Anthropic re-tint — the page has already
 * carried the Anthropic chapter higher up, and folding more brand
 * accent in here would muddy the encode lane the deep-dive owns.
 */

export function ClaudeSkillsAtLoop() {
  const section = claudeSkillsAtLoopSection;

  return (
    <section
      className="aiop-section aiop-claude-skills-at-loop"
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      aria-label={section.ariaLabel}
    >
      <div className="aiop-wrap aiop-claude-skills-at-loop__inner">
        <header className="aiop-section-head aiop-claude-skills-at-loop__head aiop-reveal">
          <h2
            className="aiop-section-title aiop-claude-skills-at-loop__title"
            id={`${section.id}-title`}
          >
            {section.title} <em>{section.titleEm}</em>
            {section.titleAfter ?? ""}
          </h2>
          <p className="aiop-section-head__sub aiop-claude-skills-at-loop__sub">
            {section.sub}
          </p>
        </header>

        <ul
          className="aiop-claude-skills-at-loop__grid aiop-reveal"
          role="list"
        >
          {section.skills.map((skill) => (
            <li
              key={skill.id}
              className="aiop-claude-skills-at-loop__card"
            >
              <h3 className="aiop-claude-skills-at-loop__card-title">
                {skill.title}
              </h3>
              {skill.owner ? (
                <p className="aiop-claude-skills-at-loop__card-owner">
                  {skill.owner}
                </p>
              ) : null}
              <p className="aiop-claude-skills-at-loop__card-body">
                {skill.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="aiop-claude-skills-at-loop__footnote aiop-reveal">
          {section.footnote}
        </p>
      </div>
    </section>
  );
}

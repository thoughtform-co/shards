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
 *   ClaudeSkillsAtLoop     Four Skills to take home (downloadable).
 *   SoftwareForFew         Tools the team builds for itself.
 *
 * This section lands the take-home: four `.skill` bundles
 * attendees can drop into Claude.ai or `~/.claude/skills/`
 * straight from the page. Two are public (Anthropic's
 * frontend-design plugin and b1rdmania's plain-english audit
 * pass); two are Loop-grown (presentations builder + the adoption
 * playbook itself).
 *
 * Each card renders a download affordance under the body. The
 * `href` lands on the gated `/api/skills/[name]` route handler,
 * which streams the matching `.skill` archive from
 * `data/skills/`. Auth comes from the site-wide proxy gate; no
 * per-route check needed.
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

              {skill.download ? (
                <div className="aiop-claude-skills-at-loop__card-download">
                  <a
                    className="aiop-claude-skills-at-loop__download-btn"
                    href={skill.download.href}
                    download={skill.download.filename}
                    aria-label={`Download ${skill.title} as a .skill bundle (${skill.download.size})`}
                  >
                    <span
                      className="aiop-claude-skills-at-loop__download-icon"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                    <span className="aiop-claude-skills-at-loop__download-label">
                      Download
                      <span className="aiop-claude-skills-at-loop__download-filename">
                        {skill.download.filename}
                      </span>
                    </span>
                    <span className="aiop-claude-skills-at-loop__download-size">
                      {skill.download.size}
                    </span>
                  </a>
                  <p className="aiop-claude-skills-at-loop__download-source">
                    Source:{" "}
                    {skill.download.sourceHref ? (
                      <a
                        href={skill.download.sourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {skill.download.source}
                      </a>
                    ) : (
                      <span>{skill.download.source}</span>
                    )}
                  </p>
                </div>
              ) : null}
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

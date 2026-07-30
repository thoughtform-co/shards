/*
 * /plopsa-ai-workshop — the three Skills built for Plopsa, as
 * downloads.
 *
 * Route-local rather than an extension of the shared
 * `ClaudeSkillsAtLoop`: that component takes no props and reads
 * `claudeSkillsAtLoopSection` at module scope, so adding cards there
 * would change /claude-workshop-v1 and /creative-ai-workshop too, and
 * would break its own "Four Skills to take home" copy. Same approach
 * `design-md-bridge.tsx` takes — hold the data inline, reuse the
 * `aiop-claude-skills-at-loop__*` classes so the card, download button
 * and source line come with zero new CSS.
 *
 * One override is needed: that grid is `repeat(4, …)` hardcoded, so
 * three cards would leave a ragged row. `--trio` in
 * plopsa-workshop.css §7 makes it 3-up.
 *
 * Downloads land on `/api/skills/[name]`, which streams the archive
 * from data/skills/. That URL has no extension, so the site proxy
 * gates it exactly like the page — which matters here, because these
 * bundles carry Plopsa's brand guidelines, logo set and pricing
 * workflow. A `public/` asset would have been world-readable.
 *
 * Two kinds of download per the route allowlist: the `.skill` itself
 * (upload straight into Claude) and, where the source folder had
 * supporting material, a `-pack.zip` beside it. Sizes are bytes/1000,
 * matching how the shared section writes them.
 */

type SkillDownload = {
  href: string;
  filename: string;
  size: string;
  label?: string;
};

type TakeHomeSkill = {
  id: string;
  title: string;
  owner: string;
  body: string;
  downloads: readonly SkillDownload[];
};

const TAKE_HOME_SKILLS: readonly TakeHomeSkill[] = [
  {
    id: "plopsa-brand",
    title: "Plopsa Brand",
    owner: "For everyone",
    body: "The eight house colours with their hex, RGB and CMYK values, Semplicita and Proxima Nova, and the logos for all seventeen brands. Anyone building a page, a deck or a mail starts on-brand instead of hunting for the right file.",
    downloads: [
      {
        href: "/api/skills/plopsa-brand",
        filename: "plopsa-brand.skill",
        size: "6.3 MB",
      },
      {
        href: "/api/skills/plopsa-brand-pack",
        filename: "plopsa-brand-pack.zip",
        size: "357 KB",
        label: "Logo sheet + sample page",
      },
    ],
  },
  {
    id: "genai-prompting-plopsaland-de",
    title: "Gen-AI Prompting · Plopsaland Deutschland",
    owner: "For the crea team",
    body: "A fork of the general prompting skill, loaded with what the park actually looks like. It exists because prompts kept returning attractions with the wrong shape — so it carries evals that check shape and composition before a prompt is used, and one park at a time, because the attractions differ.",
    downloads: [
      {
        href: "/api/skills/genai-prompting-plopsaland-de",
        filename: "genai-prompting-plopsaland-de.skill",
        size: "14 KB",
      },
      {
        href: "/api/skills/genai-prompting-plopsaland-de-pack",
        filename: "genai-prompting-plopsaland-de-pack.zip",
        size: "2.8 MB",
        label: "Prompt pack + test renders",
      },
    ],
  },
  {
    id: "plopsa-menuprijzen",
    title: "Plopsa Menuprijzen",
    owner: "For F&B",
    body: "Reads the price table and the InDesign files, reports what changes per menu board, and produces the updated boards at scale. The manual pass that used to run outlet by outlet.",
    downloads: [
      {
        href: "/api/skills/plopsa-menuprijzen",
        filename: "plopsa-menuprijzen.skill",
        size: "19 KB",
      },
    ],
  },
];

/* The nuances from the workshop that the rest of the page doesn't
   make. Kept to four — the point is that a Skill is written, not
   configured. */
const HOW_THESE_WERE_BUILT: readonly string[] = [
  "Brief a Skill the way you would brief a colleague in their first week — context, principles, worked examples.",
  "Record yourself talking through the process and transcribe it. Writing it down silently drops the nuances you know but never say.",
  "Put the evals inside the Skill so Claude checks its own output. The shape check in the prompting Skill is exactly that.",
  "Keep every version, and let the changelog live inside the Skill. A Skill is a document, so it drifts like one.",
];

export function TakeHomeSkills() {
  return (
    <section
      className="aiop-section aiop-claude-skills-at-loop plopsa-take-home"
      id="take-home-skills"
      aria-labelledby="take-home-skills-title"
      aria-label="The three Skills built for Plopsa"
    >
      <div className="aiop-wrap aiop-claude-skills-at-loop__inner">
        <header className="aiop-section-head aiop-claude-skills-at-loop__head aiop-reveal">
          <h2
            className="aiop-section-title aiop-claude-skills-at-loop__title"
            id="take-home-skills-title"
          >
            Three Skills, <em>already built</em>.
          </h2>
          <p className="aiop-section-head__sub aiop-claude-skills-at-loop__sub">
            Not examples — these came out of the sessions and are running.
            Download a bundle and drop it into Claude, or into{" "}
            <code>~/.claude/skills/</code> if you work in the desktop app.
            Activate it by typing <code>/</code> and the skill name, and check
            it loads the whole package rather than the SKILL.md alone.
          </p>
        </header>

        <ul
          className="aiop-claude-skills-at-loop__grid aiop-claude-skills-at-loop__grid--trio aiop-reveal"
          role="list"
        >
          {TAKE_HOME_SKILLS.map((skill) => (
            <li key={skill.id} className="aiop-claude-skills-at-loop__card">
              <h3 className="aiop-claude-skills-at-loop__card-title">
                {skill.title}
              </h3>
              <p className="aiop-claude-skills-at-loop__card-owner">
                {skill.owner}
              </p>
              <p className="aiop-claude-skills-at-loop__card-body">
                {skill.body}
              </p>

              <div className="aiop-claude-skills-at-loop__card-download">
                {skill.downloads.map((download) => (
                  <a
                    key={download.href}
                    className="aiop-claude-skills-at-loop__download-btn"
                    href={download.href}
                    download={download.filename}
                    aria-label={`Download ${download.label ?? skill.title} (${download.filename}, ${download.size})`}
                  >
                    <span
                      className="aiop-claude-skills-at-loop__download-icon"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                    <span className="aiop-claude-skills-at-loop__download-label">
                      {download.label ?? "Download"}
                      <span className="aiop-claude-skills-at-loop__download-filename">
                        {download.filename}
                      </span>
                    </span>
                    <span className="aiop-claude-skills-at-loop__download-size">
                      {download.size}
                    </span>
                  </a>
                ))}
                <p className="aiop-claude-skills-at-loop__download-source">
                  Source: <span>Built in the Plopsa sessions · 30 July 2026</span>
                </p>
              </div>
            </li>
          ))}
        </ul>

        <ul className="plopsa-take-home__notes aiop-reveal" role="list">
          {HOW_THESE_WERE_BUILT.map((note) => (
            <li key={note} className="plopsa-take-home__note">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import Link from "next/link";

/*
 * Creative AI Workshop · design.md bridge.
 *
 * Calm editorial beat between DegreesOfFreedom and the four
 * downloadable Skills. Names design.md as the brand substrate the
 * AI reads from — the same encode -> build motion as a Claude
 * Skill, just pointed at brand and asset production instead of
 * workflow logic. Once the design.md exists, Claude and the
 * HyperFrames / Remotion Video Studio build on-brand decks,
 * one-pagers, and the testimonial cut without re-briefing every
 * time.
 *
 * Take-home artifact: a real Centrale des Marchés design.md,
 * downloadable from `/api/design/centrale-des-marches`. Sits as a
 * sibling of the four `.skill` cards directly below so the visitor
 * sees the same encode -> download motion twice in a row: a Skill
 * is an encoded workflow, a design.md is an encoded brand.
 *
 * Reuses the existing `.aiop-claude-skills-at-loop__download-btn`
 * styles so the download affordance matches the cards below with
 * zero new CSS. Section frame uses local `.cw-designmd*` classes
 * scoped in `creative-ai-workshop.css`.
 *
 * Server component.
 */

const DESIGN_MD = {
  phase: "Encode",
  eyebrow: "Take it home",
  title: "design.md is the",
  titleEm: "brand encoded",
  titleAfter: ".",
  body: "A Skill encodes how a team works. A design.md encodes how a brand looks, sounds, and moves. Once it exists, Claude and the Video Studio brief themselves: decks, one-pagers, social cards, and the testimonial cut all come back on-brand without re-explaining the rules.",
  whatItPowers: {
    label: "What it powers",
    items: [
      "Slide decks (.pptx, HTML)",
      "One-pagers (PDF, print-safe)",
      "Social cards + lower thirds",
      "Testimonial video via frame.md, HyperFrames + Remotion",
    ],
  },
  download: {
    title: "Centrale des Marchés",
    owner: "Built for the Monizze × Centrale des marchés testimonial.",
    body: "A working design.md grounded in the live site: positioning, voice, colour, typography, layout, motion, plus a frame.md block that directs the 16:9 testimonial cut and three asset-recipe briefs ready to paste into Claude or the Video Studio.",
    href: "/api/design/centrale-des-marches",
    filename: "centrale-des-marches.design.md",
    size: "14 KB",
    source: "centraledesmarches.be · live site",
    sourceHref: "https://www.centraledesmarches.be/accueil",
  },
  cta: {
    label: "Open the Video Studio",
    href: "/experiments/video-studio",
  },
  footnote:
    "Pair the design.md with a per-project frame.md (pacing, dwell, motion). The Video Studio reads both, renders MP4 from templates, and keeps the editor in the curating seat.",
} as const;

export function DesignMdBridge() {
  return (
    <section
      className="aiop-section cw-designmd"
      id="design-md"
      aria-labelledby="cw-designmd-title"
      aria-label="design.md — brand encoded as substrate the AI reads from"
    >
      <div className="aiop-wrap cw-designmd__inner">
        <header className="cw-designmd__head aiop-reveal">
          <span className="cw-designmd__eyebrow">
            {DESIGN_MD.eyebrow}
          </span>
          <h2 className="cw-designmd__title" id="cw-designmd-title">
            {DESIGN_MD.title}{" "}
            <em className="cw-designmd__title-em">{DESIGN_MD.titleEm}</em>
            {DESIGN_MD.titleAfter}
          </h2>
          <p className="cw-designmd__body">{DESIGN_MD.body}</p>
        </header>

        <div className="cw-designmd__grid aiop-reveal">
          <aside
            className="cw-designmd__powers"
            aria-label={DESIGN_MD.whatItPowers.label}
          >
            <span className="cw-designmd__powers-label">
              {DESIGN_MD.whatItPowers.label}
            </span>
            <ul className="cw-designmd__powers-list" role="list">
              {DESIGN_MD.whatItPowers.items.map((item) => (
                <li key={item} className="cw-designmd__powers-item">
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className="cw-designmd__cta"
              href={DESIGN_MD.cta.href}
              prefetch={false}
            >
              <span className="cw-designmd__cta-label">
                {DESIGN_MD.cta.label}
              </span>
              <span className="cw-designmd__cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </aside>

          <article className="cw-designmd__card">
            <h3 className="cw-designmd__card-title">
              {DESIGN_MD.download.title}
            </h3>
            <p className="cw-designmd__card-owner">{DESIGN_MD.download.owner}</p>
            <p className="cw-designmd__card-body">{DESIGN_MD.download.body}</p>

            <div className="cw-designmd__card-download aiop-claude-skills-at-loop__card-download">
              <a
                className="aiop-claude-skills-at-loop__download-btn"
                href={DESIGN_MD.download.href}
                download={DESIGN_MD.download.filename}
                aria-label={`Download ${DESIGN_MD.download.title} as a design.md (${DESIGN_MD.download.size})`}
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
                    {DESIGN_MD.download.filename}
                  </span>
                </span>
                <span className="aiop-claude-skills-at-loop__download-size">
                  {DESIGN_MD.download.size}
                </span>
              </a>
              <p className="aiop-claude-skills-at-loop__download-source">
                Source:{" "}
                {DESIGN_MD.download.sourceHref ? (
                  <a
                    href={DESIGN_MD.download.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {DESIGN_MD.download.source}
                  </a>
                ) : (
                  <span>{DESIGN_MD.download.source}</span>
                )}
              </p>
            </div>
          </article>
        </div>

        <p className="cw-designmd__footnote aiop-reveal">
          {DESIGN_MD.footnote}
        </p>
      </div>
    </section>
  );
}

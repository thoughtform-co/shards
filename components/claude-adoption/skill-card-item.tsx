import type { CaSkillCard } from "@/content/claude-adoption";

/*
 * SkillCardItem — single skill card (the inner <li> of a team or
 * cluster block). Extracted so the engine and phase breakdown
 * views can render the same card markup as the team view without
 * duplicating styles.
 *
 * The optional `teamName` prop surfaces the originating team in
 * cluster views where the parent header is no longer the team
 * (engine / phase axes). When omitted the card stays in the
 * legacy team-view layout.
 *
 * Two layouts in one component, keyed off `card.feedsBuildPhase`:
 *
 *   Default (every other Skill): owner + status pill in a top
 *   header, then title / body, then a footer with footnote +
 *   substrate tag.
 *
 *   feedsBuildPhase: true (CMF File Generator, Packaging Review,
 *   Loop Paid Social — the three Skills that compose the Build-
 *   phase tools below): an edge-clipped "03 · BUILD" pill replaces
 *   the top header; owner moves to the bottom-left of the footer;
 *   status pill joins the substrate tag in a right-side cluster;
 *   the footnote is dropped (the pill carries the framing). The
 *   pill matches `.ca-tools__phase` on the Mímir / Vesper tool
 *   blocks below, so the same "03 · BUILD" chrome carries across
 *   the section break.
 */

export function SkillCardItem({
  card,
  teamName,
}: {
  card: CaSkillCard;
  teamName?: string;
}) {
  /* `--feeds-build` paints the card with a subtle sage-green wash
     and unlocks the rest of the build-phase chrome (top pill,
     repositioned owner + status). All driven by one CSS modifier
     class so reverting is a single flag flip on the card data. */
  const className = `ca-skill${
    card.feedsBuildPhase ? " ca-skill--feeds-build" : ""
  }`;

  return (
    <li className={className} id={`skill-${card.id}`}>
      {card.feedsBuildPhase ? (
        /* Decorative chrome — the BUILD phase framing is structural,
           not semantic content for this card. The substrate tag +
           status pill below still carry the meaningful labels. */
        <span className="ca-skill__phase-pill" aria-hidden="true">
          03 {"\u00b7"} BUILD
        </span>
      ) : (
        <header className="ca-skill__top">
          <span className="ca-skill__owner">{card.owner}</span>
          <span
            className={`ca-skill__status ca-skill__status--${card.status}`}
          >
            {card.statusLabel}
          </span>
        </header>
      )}

      <h4 className="ca-skill__title">{card.title}</h4>
      {teamName ? (
        <p className="ca-skill__team-caption">{teamName}</p>
      ) : null}
      <p className="ca-skill__body">{card.body}</p>

      <footer className="ca-skill__foot">
        {card.feedsBuildPhase ? (
          <>
            <span className="ca-skill__owner">{card.owner}</span>
            <div className="ca-skill__foot-tags">
              <span
                className={`ca-skill__status ca-skill__status--${card.status}`}
              >
                {card.statusLabel}
              </span>
              {card.substrate ? (
                <span
                  className={`ca-skill__substrate-tag ca-skill__substrate-tag--${card.substrate}`}
                >
                  {card.substrate}
                </span>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <p className="ca-skill__footnote">{card.footnote}</p>
            {card.substrate ? (
              <span
                className={`ca-skill__substrate-tag ca-skill__substrate-tag--${card.substrate}`}
              >
                {card.substrate}
              </span>
            ) : null}
          </>
        )}
      </footer>
    </li>
  );
}

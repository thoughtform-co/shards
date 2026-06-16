/*
 * Figure annotation — the engineering-document kicker used at the
 * corners of every section. Renders as e.g.:
 *
 *   [FIG. 01-04]  Frontier ledger
 *
 * The mark sits in a thin-bordered chip and the caption trails it,
 * both in the substrate monospace. Tone-aware via the parent section
 * (--soil zones flip the colors via the .subs-section--soil rules in
 * substrate.css).
 */

export function SubstrateFigure({
  label,
  caption,
  className,
}: {
  label: string;
  caption?: string;
  className?: string;
}) {
  return (
    <span className={`subs-fig ${className ?? ""}`.trim()}>
      <span className="subs-fig__mark">{label}</span>
      {caption ? (
        <span className="subs-fig__caption">{caption}</span>
      ) : null}
    </span>
  );
}

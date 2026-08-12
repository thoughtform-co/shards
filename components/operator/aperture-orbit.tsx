import {
  figureLabel,
  workflowFigure,
  type HeroFigureSection,
} from "./hero-figure";

/*
 * ApertureOrbit — candidate A. One boundary, four faces of the same
 * thing.
 *
 * The claim: a configuration is not four parts bolted together, it is
 * ONE object you can look at from four sides. So the figure is a single
 * circle that irises apart into four arcs of the same radius. The shared
 * radius says "one object"; the gaps say "four faces".
 *
 * The morph is the whole trick, and it is free. At the cycle boundary
 * all four arcs sit at r=6.6 with a heavy stroke and `stroke-dasharray:
 * 100 0` — four COINCIDENT COMPLETE circles, which is exactly the Loop
 * mark: a torus around a transparent hole. Opening the aperture is one
 * animation of r, stroke-width and the dash pattern on the same four
 * elements. Nothing fades into anything.
 *
 * Two mechanics make that work:
 *
 *   `pathLength="100"` normalises every arc's perimeter to 100 units, so
 *   the dash pattern is a PERCENTAGE of the circumference and the gaps
 *   stay the same angular size while `r` animates from 6.6 to 32.
 *   Without it the dash lengths are absolute and the four arcs would
 *   splay open as the circle grew.
 *
 *   Every arc is authored identically — one arc centred on 12 o'clock —
 *   and rotated into position with a static `transform`. That is what
 *   lets all four share ONE keyframe: the alternative is per-facet
 *   `stroke-dashoffset` values, which means four near-identical
 *   keyframes and a `calc()` on a custom property inside each. The
 *   rotation lives in an inline style rather than CSS because it is
 *   computed from the facet's angle, and the whole point of the data
 *   shape is that a facet moves by editing one number.
 *
 * Server component. See `hero-figure.ts` for the data shape and why
 * nothing but the centre word is written on the page.
 */

/* The arc radius is also the Loop mark's destination — this circle IS
   the mark at the ends of the cycle. The halo is the faint dotted ring
   that holds the composition; it exists only in the open phase. */
const ARC_RADIUS = 32;
const HALO_RADIUS = 44;

/* Arc length in pathLength units (i.e. percent of the circumference).
   Four arcs at 22 leaves four 3-unit gaps, which land on the diagonals
   because the arcs are centred on the clock quarters. Shorter arcs read
   as dashes rather than as a broken ring; longer ones close the gaps to
   a hairline and the aperture stops reading as an aperture. */
const ARC_LENGTH = 22;

/* Dash offset that centres a `ARC_LENGTH` dash on 12 o'clock.
 *
 * An SVG circle's path starts at 3 o'clock and runs clockwise, so 12
 * o'clock sits at 75 pathLength units. A dash pattern begins at `-offset`
 * from the path start, so a dash centred on p needs `offset = length/2 -
 * p`, normalised into [0,100).
 *
 * The open and closed states share this formula: at the cycle boundary
 * the dash is the full 100 units, so its offset is 50 - 75 = 75 — and
 * because the two offsets are both derived from the same centre, the
 * dash shrinks SYMMETRICALLY about 12 o'clock as it animates. Offset it
 * asymmetrically and the ring erodes from one side instead of opening
 * like an iris. */
const TWELVE_OCLOCK = 75;
const dashOffsetFor = (length: number) =>
  (length / 2 - TWELVE_OCLOCK + 100) % 100;

export const APERTURE_GEOMETRY = {
  arcRadius: ARC_RADIUS,
  haloRadius: HALO_RADIUS,
  arcLength: ARC_LENGTH,
  /* Exported so the keyframes in `aperture-orbit.css` can be checked
     against the numbers the markup ships with — the animation restates
     them and the two have to agree. */
  arcOffset: dashOffsetFor(ARC_LENGTH),
  closedOffset: dashOffsetFor(100),
} as const;

export function ApertureOrbit({
  section = workflowFigure,
  loop = false,
}: {
  section?: HeroFigureSection;
  /** Opt into the 16s Loop-mark → aperture → Loop-mark cycle. */
  loop?: boolean;
}) {
  return (
    <div
      className="tf-fig tf-ap"
      role="img"
      aria-label={figureLabel(section)}
      data-tf-loop={loop ? "on" : undefined}
    >
      <svg className="tf-fig__svg" viewBox="0 0 100 100" aria-hidden="true">
        {/* Emerges out of the mark at zero weight rather than fading in
            over it, so the halo never reads as a second object arriving. */}
        <circle
          className="tf-ap__halo"
          cx="50"
          cy="50"
          r={HALO_RADIUS}
        />

        {section.facets.map((facet) => (
          <circle
            key={facet.id}
            className="tf-ap__arc"
            data-tf-facet={facet.id}
            cx="50"
            cy="50"
            r={ARC_RADIUS}
            pathLength="100"
            strokeDasharray={`${ARC_LENGTH} ${100 - ARC_LENGTH}`}
            strokeDashoffset={APERTURE_GEOMETRY.arcOffset}
            style={{ transform: `rotate(${facet.angle}deg)` }}
          />
        ))}
      </svg>

      <span className="tf-fig__core">{section.center}</span>
    </div>
  );
}

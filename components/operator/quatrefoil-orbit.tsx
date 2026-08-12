import {
  figureLabel,
  workflowFigure,
  type HeroFigureSection,
} from "./hero-figure";

/*
 * QuatrefoilOrbit — candidate B. Four things composed on one piece of
 * work; where they overlap IS the work.
 *
 * The claim is compositional rather than structural. A configuration is
 * not a hub with four attachments — it is four circles of concern laid
 * over each other, and the piece of work is the clearing they all cover
 * at once. So the figure is a rosette: four hairline circles budded out
 * of the centre far enough to separate, close enough to keep crossing.
 *
 * Same morph as its siblings, and again for free. At the cycle boundary
 * all four lobes are translated back to the centre at r=6.6 with a heavy
 * stroke — four coincident circles, which is the Loop mark. Budding
 * outward is one animation of the translate and the radius.
 *
 * GEOMETRY. Every lobe is authored identically — one circle pushed
 * straight up — and rotated into position by a static `transform` on a
 * wrapper group. The rotation composes with the animated translate
 * underneath it, so all four lobes share ONE keyframe. The alternative
 * is four sets of per-facet cx/cy keyframes.
 *
 * `transform` on a group, NOT `cx`/`cy`. The CSS geometry properties
 * only reached Firefox in 129, and this is the one figure that has
 * nothing left to look at without them — the aperture and the
 * constellation degrade to a static ring, this degrades to four circles
 * stacked on the centre. A group transform animates everywhere.
 *
 * THE CLEARING. A paper disc sits over the middle and carries the centre
 * word. It is deliberately wider than the true four-way overlap (about
 * 8 units across, which could not hold a word), and that is fine: the
 * pairwise crossings between adjacent lobes sit out on the diagonals,
 * well outside it, so the rosette still reads as circles that overlap.
 *
 * The disc is a RADIAL GRADIENT from opaque paper to transparent, not a
 * flat fill. A flat fill was the first cut and it read as damage: every
 * lobe's arc stopped dead on the disc's edge, leaving eight stubs
 * pointing at a circle that was not itself drawn. Fading the paper out
 * instead lets the arcs dissolve into the space around the word, so the
 * clearing reads as a clearing rather than as an erasure. No edge on it
 * either way — the work is a clearing in the figure, not another ring in
 * it.
 *
 * Server component.
 */

/* Lobe radius and how far each is pushed off centre. The pair is what
   sets the rosette's character: at offset 11 the lobes cross well inside
   each other and read as one flower, and their four-way common region
   stays centred under the clearing. Push them further and the figure
   opens into four separate circles; pull them in and it closes back
   into a blot. */
const LOBE_RADIUS = 19;
const LOBE_OFFSET = 11;

/* Wide enough for the centre word, narrow enough to leave the diagonal
   crossings outside it. The gradient holds full paper out to
   CLEARING_SOLID of this radius and fades over the rest, so the word
   needs to fit inside roughly 17 × 0.68 ≈ 11.6 units of half-width. A
   longer fade than this leaves the arcs half-lit across a wide band and
   the middle of the figure goes muddy; a shorter one is a hard edge
   again. */
const CLEARING_RADIUS = 17;
const CLEARING_SOLID = "68%";

/* One fixed id, not a generated one. Two instances of this figure on the
   same page (which is exactly what /hero-lab renders) then declare the
   same gradient twice under one id — harmless, because the two are
   identical and the first simply wins. A `useId` would buy uniqueness at
   the cost of making this a client component. */
const CLEARING_GRADIENT = "tf-qf-clearing";

export const QUATREFOIL_GEOMETRY = {
  lobeRadius: LOBE_RADIUS,
  lobeOffset: LOBE_OFFSET,
  clearingRadius: CLEARING_RADIUS,
} as const;

export function QuatrefoilOrbit({
  section = workflowFigure,
  loop = false,
}: {
  section?: HeroFigureSection;
  /** Opt into the 16s Loop-mark → rosette → Loop-mark cycle. */
  loop?: boolean;
}) {
  return (
    <div
      className="tf-fig tf-qf"
      role="img"
      aria-label={figureLabel(section)}
      data-tf-loop={loop ? "on" : undefined}
    >
      <svg className="tf-fig__svg" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          {/* Paper to nothing. The stops read the shell's own token, so
              the clearing follows a palette swap without this component
              knowing which palette it is on. */}
          <radialGradient id={CLEARING_GRADIENT}>
            <stop
              offset="0%"
              stopColor="var(--aiop-paper)"
              stopOpacity="1"
            />
            <stop
              offset={CLEARING_SOLID}
              stopColor="var(--aiop-paper)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--aiop-paper)"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {section.facets.map((facet) => (
          /* Outer group: static rotation into the facet's clock
             position. Inner group: the animated bud outward, authored
             once as "straight up" and carried into place by the
             rotation above it. */
          <g key={facet.id} style={{ transform: `rotate(${facet.angle}deg)` }}>
            <g className="tf-qf__bud">
              <circle
                className="tf-qf__lobe"
                data-tf-facet={facet.id}
                cx="50"
                cy="50"
                r={LOBE_RADIUS}
              />
            </g>
          </g>
        ))}

        {/* Last in document order so it knocks the lobes out rather
            than sitting under them. */}
        <circle
          className="tf-qf__clearing"
          cx="50"
          cy="50"
          r={CLEARING_RADIUS}
        />
      </svg>

      <span className="tf-fig__core">{section.center}</span>
    </div>
  );
}

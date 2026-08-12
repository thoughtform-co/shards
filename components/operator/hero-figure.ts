/*
 * hero-figure — the data shape and the geometry shared by the three
 * candidate hero figures (`aperture-orbit`, `quatrefoil-orbit`,
 * `constellation-orbit`).
 *
 * All three draw the same subject: ONE intelligence configuration —
 * one piece of work and the four faces attached to it. They differ only
 * in how that claim is made geometrically, which is the point of
 * `/hero-lab`.
 *
 * Nothing here is written on the page. The figures carry a centre word
 * and unlabelled marks; the four facet labels exist so `role="img"` can
 * announce what the marks mean. That is deliberate — the figure is a
 * mark, not a diagram, and a mark that needs four captions is not one.
 */

export type HeroFigureFacet = {
  id: string;
  /**
   * ONE WORD. Feeds the figure's `aria-label` always, and is drawn by
   * figures that carry labels.
   *
   * The one-word rule is not style, it is what makes the labels legible.
   * A label anchored beside a body on the horizontal axis has only the
   * band between the figure and its own edge to sit in — about an eighth
   * of the figure's width — so every character costs type size. An
   * earlier cut ran the four questions ("What it can reach") and had to
   * break them over two lines at 6.5px to fit, which is smaller than
   * anyone reads at hero distance.
   */
  label: string;
  /** Degrees clockwise from 12 o'clock. */
  angle: number;
};

export type HeroFigureSection = {
  /** One word at the centre. Kept to one word on purpose. */
  center: string;
  /**
   * Who is accountable for the work at the centre. A second, quieter
   * line under `center` — the figure otherwise draws a workflow and the
   * machinery that performs it and leaves out the only part of it that
   * is a person. Figures that draw a single centre word ignore this.
   */
  centerSub?: string;
  /**
   * Names the outer ring: what the whole figure adds up to. Present only
   * on figures that draw a boundary around themselves.
   */
  boundary?: string;
  facets: readonly HeroFigureFacet[];
};

/* A workflow, and the four things that perform it.
 *
 * Named as INGREDIENTS rather than as questions. The earlier cut asked
 * "who owns it / what runs it / where it runs / what it can reach",
 * which is the operating model's own vocabulary and right in a document
 * — but a hero figure is read in about two seconds from across a room,
 * and four questions is four sentences to parse before anything means
 * anything. Skill, model, data, interface is the same claim as one
 * glance: here is a piece of work and here is what makes it run.
 *
 * CLOCK POSITIONS are set by the label lengths, not by taxonomy. The
 * horizontal pair sits in the narrow band between the figure and its own
 * edge, so the two shortest words go there (MODEL, DATA) and the longest
 * goes on the vertical (INTERFACE), where a centred label has the whole
 * width of the figure to sit in. Swapping any of them means resizing the
 * type for all four.
 *
 * SKILL takes 12 o'clock and, in the constellation, the one accent —
 * it is the field the practice actually produces. */
export const workflowFigure: HeroFigureSection = {
  center: "Workflow",
  /* The people whose judgment the work is measured against. Without
     them the figure draws a piece of work and four pieces of machinery
     and quietly implies nobody is accountable for any of it. */
  centerSub: "Domain experts",
  /* What the whole thing adds up to, and the only place the phrase
     belongs: on the ring around everything, not at the centre. A
     configuration is the workflow plus its people plus what performs
     it — so naming the centre that would be naming the part after the
     whole. */
  boundary: "Intelligence configuration",
  facets: [
    { id: "skill", label: "Skill", angle: 0 },
    { id: "model", label: "Model", angle: 270 },
    { id: "data", label: "Data", angle: 90 },
    { id: "interface", label: "Interface", angle: 180 },
  ],
};

/* One sentence for the whole figure. Every candidate uses this, so they
   read identically to a screen reader and differ only visually — which
   is exactly the comparison /hero-lab is for. */
export function figureLabel(section: HeroFigureSection): string {
  const subject = section.centerSub
    ? `${section.center.toLowerCase()} owned by ${section.centerSub.toLowerCase()}`
    : `${section.center.toLowerCase()}`;
  const performers = section.facets
    .map((facet) => facet.label.toLowerCase())
    .join(", ");
  /* The boundary names the whole, so it opens the sentence rather than
     trailing it — a screen reader gets the same reading order a sighted
     viewer settles on. */
  return section.boundary
    ? `One ${section.boundary.toLowerCase()}: a ${subject}, performed by ${performers}`
    : `One ${subject}, and what performs it: ${performers}`;
}

/* Clock angle (0° = 12 o'clock, clockwise) at a given radius, in the
   0-100 viewBox units every figure here is drawn in:
     x = 50 + r · sin θ
     y = 50 − r · cos θ
   The same transform is spelled out per-component in `flywheel-orbit`
   and `configuration-orbit`; new figures take it from here rather than
   adding a third copy. */
export function polar(radius: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + radius * Math.sin(rad),
    y: 50 - radius * Math.cos(rad),
  };
}

/* Same point as CSS percentages, for HTML overlays positioned on top of
   the SVG (the centre word, mostly). */
export function polarPercent(radius: number, angle: number) {
  const { x, y } = polar(radius, angle);
  return { left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` };
}

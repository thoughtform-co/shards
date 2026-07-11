import type { AnimatableProp, MotionElement } from "./schema";

const PROPS: AnimatableProp[] = ["x", "y", "scale", "rotation", "opacity"];

/** Pure frame-zero hold semantics, safe in Next server routes. */
export function initialElementValues(element: MotionElement) {
  return Object.fromEntries(
    PROPS.map((property) => {
      const first = element.tracks.find(
        (track) => track.property === property,
      )?.keyframes[0];
      return [property, first?.value ?? element[property]];
    }),
  ) as Record<AnimatableProp, number>;
}

import { Easing } from "remotion";

import type { EasePreset } from "./schema";

/*
 * The AE-named preset vocabulary, mapped to Remotion easing
 * functions. "spring" is deliberately absent — it is physics, not a
 * curve, and is special-cased in `sample.ts` via remotion's spring().
 *
 * The HyperFrames exporter mirrors this table with GSAP eases in
 * `lib/export/easeMap.ts`; change one, change both.
 */
export const EASE_PRESETS: Record<
  Exclude<EasePreset, "spring">,
  (t: number) => number
> = {
  linear: Easing.linear,
  "ease-in": Easing.in(Easing.cubic),
  "ease-out": Easing.out(Easing.cubic),
  "ease-in-out": Easing.inOut(Easing.cubic),
  overshoot: Easing.out(Easing.back(1.7)),
};

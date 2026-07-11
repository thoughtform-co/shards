import { interpolate, spring } from "remotion";

import { EASE_PRESETS } from "./easing";
import { DEFAULT_SPRING } from "./presets";
import type { AnimatableProp, MotionElement, Track } from "./schema";

/*
 * The one keyframe sampler. Preview, render, the timeline's
 * "add keyframe at current value", and the exporter's base-state
 * computation all flow through here, so a value can never differ
 * between surfaces.
 */

export function sampleTrack(opts: {
  track: Track | undefined;
  /** Scene-relative frame. */
  frame: number;
  fps: number;
  /** The element's static base value, used when no track exists. */
  fallback: number;
}): number {
  const kfs = opts.track?.keyframes;
  if (!kfs || kfs.length === 0) return opts.fallback;

  /* Hold before the first and after the last keyframe. */
  if (opts.frame <= kfs[0].frame) return kfs[0].value;
  const last = kfs[kfs.length - 1];
  if (opts.frame >= last.frame) return last.value;

  /* Find the segment [k0, k1] containing the frame. Tracks are small
     (budget ≤ 6 keyframes), linear scan wins over cleverness. */
  let i = 0;
  while (i < kfs.length - 2 && kfs[i + 1].frame <= opts.frame) i++;
  const k0 = kfs[i];
  const k1 = kfs[i + 1];
  if (k1.frame === k0.frame) return k1.value;

  if (k1.ease === "spring") {
    /* Time-stretch the spring to exactly fill the segment. It may
       overshoot past 1 before settling — that is the point. */
    const t = spring({
      frame: opts.frame - k0.frame,
      fps: opts.fps,
      durationInFrames: k1.frame - k0.frame,
      config: k1.spring ?? DEFAULT_SPRING,
    });
    return k0.value + (k1.value - k0.value) * t;
  }

  return interpolate(
    opts.frame,
    [k0.frame, k1.frame],
    [k0.value, k1.value],
    {
      easing: EASE_PRESETS[k1.ease],
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
}

export type SampledValues = Record<AnimatableProp, number>;

/** All five animated values of an element at a scene-relative frame. */
export function sampleElementValues(
  element: MotionElement,
  frame: number,
  fps: number,
): SampledValues {
  const trackFor = (property: AnimatableProp) =>
    element.tracks.find((t) => t.property === property);
  return {
    x: sampleTrack({ track: trackFor("x"), frame, fps, fallback: element.x }),
    y: sampleTrack({ track: trackFor("y"), frame, fps, fallback: element.y }),
    scale: sampleTrack({
      track: trackFor("scale"),
      frame,
      fps,
      fallback: element.scale,
    }),
    rotation: sampleTrack({
      track: trackFor("rotation"),
      frame,
      fps,
      fallback: element.rotation,
    }),
    opacity: sampleTrack({
      track: trackFor("opacity"),
      frame,
      fps,
      fallback: element.opacity,
    }),
  };
}

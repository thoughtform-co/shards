import type { EasePreset, SpringConfig } from "../motiondoc/schema";

/*
 * MotionDoc ease presets → GSAP ease strings. This table mirrors
 * lib/motiondoc/easing.ts — change one, change both.
 *
 * GSAP's powerN uses exponent N+1 (power2 = cubic, power3 = quart),
 * so Remotion's Easing.cubic maps to power2.* for an EXACT analytic
 * match — verified numerically against a seeked export. The vendored
 * remotion-to-hyperframes reference maps cubic→power3; that passed
 * its SSIM gate but is one exponent steeper.
 */
export const GSAP_EASE: Record<Exclude<EasePreset, "spring">, string> = {
  linear: "none",
  "ease-in": "power2.in",
  "ease-out": "power2.out",
  "ease-in-out": "power2.inOut",
  overshoot: "back.out(1.7)",
};

/*
 * Springs are the lossy translation (≈0.95 SSIM in the validated
 * corpus). Anchor to the three validated recipe pairs by the
 * stiffness/damping² ratio rather than trusting the rough formula:
 *   12/100 (snappy) → back.out(1.4)
 *   14/90  (calm)   → back.out(1.2)
 *   8/200  (bouncy) → back.out(2.0)
 */
export function springToGsapEase(config: SpringConfig): string {
  const ratio = config.stiffness / (config.damping * config.damping);
  const n = ratio < 0.55 ? 1.2 : ratio < 1.2 ? 1.4 : 2.0;
  return `back.out(${n})`;
}

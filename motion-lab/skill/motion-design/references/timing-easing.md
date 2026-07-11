# Timing & easing vocabulary

All values at **30fps** — double frames for 60fps, scale linearly otherwise. Durations are per-move, not per-scene.

## Duration bands

| Move | 30fps | Feel | Default ease |
|---|---|---|---|
| Micro emphasis (pulse, blink) | 6–10f | instant | overshoot / linear |
| Exit | 8–14f | decisive | ease-in |
| Standard entrance | 12–20f | crisp | ease-out |
| Hero entrance | 18–30f | weighted | spring (snappy) |
| Movement A→B | 20–40f | deliberate | ease-in-out |
| Draw-on (line/underline) | 18–30f | deliberate | ease-in-out |
| Scene crossfade | 8–15f | soft | (linear ramps) |
| Ambient drift | 60f+ | alive, not seen | linear / ease-in-out |
| Reading hold (per line) | 20–45f | still | — |
| End-card hold | ≥45f | still | — |

**Distance couples with duration**: a 40px rise takes 12–16f; a full-canvas slide takes 24–40f. Same duration for wildly different distances reads wrong.

## Ease presets → engine equivalents

| Preset | Semantics | Remotion | GSAP | CSS |
|---|---|---|---|---|
| `linear` | mechanical, ambient, opacity ramps | `Easing.linear` | `none` | `linear` |
| `ease-in` | accelerate away (exits) | `Easing.in(Easing.cubic)` | `power2.in` | `cubic-bezier(.32,0,.67,0)` |
| `ease-out` | decelerate into place (entrances) | `Easing.out(Easing.cubic)` | `power2.out` | `cubic-bezier(.33,1,.68,1)` |
| `ease-in-out` | travel between two rests | `Easing.inOut(Easing.cubic)` | `power2.inOut` | `cubic-bezier(.65,0,.35,1)` |
| `overshoot` | pop past target and settle | `Easing.out(Easing.back(1.7))` | `back.out(1.7)` | `cubic-bezier(.34,1.56,.64,1)` |
| `spring` | physical settle, may oscillate | `spring({damping, stiffness, mass})` | approx `back.out(n)` | — |

Gotcha: GSAP's `powerN` uses exponent N+1 — `power2` IS cubic, `power3` is quart. When matching Remotion/CSS cubic curves in GSAP, use `power2.*`.

The ease describes the approach INTO a keyframe (AE's "ease into"). First keyframe of a track has no incoming segment — its ease is ignored.

## Spring recipes

| Name | damping / stiffness / mass | Feel | Use |
|---|---|---|---|
| **snappy** | 12 / 100 / 1 | lands fast, one tiny settle | default hero entrance |
| **calm** | 14 / 90 / 1 | no visible bounce, weighted | premium/serious brands |
| **bouncy** | 8 / 200 / 1 | visible overshoot + wobble | playful moments, ≤1 per video |

Springs in a motion doc are **time-stretched to their keyframe segment** — the segment length controls how fast the physics plays out. Give a spring 18–30f of segment or it looks truncated.

## Stagger patterns

- Siblings (list items, cards): **3–5f** apart in reading order (left→right, top→bottom).
- Label follows its container by **2–4f**.
- Two paired heroes (this-and-that): **6–10f** apart so both register individually.
- Never stagger more than 5 items — group the rest into one move.

## Opacity discipline

- Fades in: 6–12f, `linear` or `ease-out`. Fades pair with a transform (pure fades feel cheap).
- Fades out: 8–14f, `ease-in`.
- Flash/blink emphasis: square wave via `linear` keyframes (1 → 0.25 → 1), 6f per step, 2 pulses max.

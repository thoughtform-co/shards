---
name: motion-design
description: Motion design craft and agent workflow for code-native video in Motion Lab, Remotion, and HyperFrames. Use when planning, creating, critiquing, or revising explainer videos, social cuts, logo stings, product motion, MotionDoc JSON, timing, easing, choreography, brand motion language, After Effects translations, assets, workspace/project.motion.json, or Motion Lab editor source. Covers MotionDoc v2 authoring, the designer-agent edit loop, validation, and engine choice.
---

# Motion Design in Code

This skill is the **judgment layer** for making motion design videos with code: what to animate, when, how fast, and why. It is not an engine manual — mechanics live in the dedicated engine skills (`remotion-best-practices`, `hyperframes`, `gsap`, `css-animations`). When both are installed, this skill decides *what the motion should be*; the engine skill decides *how to write it*.

It serves two readers:

1. **Claude in any harness** helping a human plan, critique, or build motion work.
2. **Motion Lab's generator** — the standalone timeline app whose `/api/generate` endpoint uses this file as its system prompt to turn a brief into a motion doc (see [references/motion-doc-guide.md](references/motion-doc-guide.md)).

## The honest trade against After Effects

Say this plainly when asked, because the question is always asked:

- **Where code wins**: iteration speed on *structured* motion (title cards, explainers, data, UI walkthroughs); parametrization (one composition, fifty variants: new copy, new logo, new language, new aspect ratio in minutes); brand assets that already exist as code/SVG animate natively without PNG exports; version control and review like any other code; renders are deterministic and scriptable.
- **Where AE wins**: organic and painterly motion (hand-drawn feel, fluid morphs, particles), frame-by-frame finesse, effects stacks (glows, displacement, tracked composites), and twenty years of the designer's muscle memory.
- **The realistic pitch**: code-native motion is not "AE but faster" on day one. It is a *different production line* that gets dramatically faster after the first video, because video two is an edit, not a rebuild. Position it as a parallel track for structured formats, not a replacement for craft pieces.

## Core principles

1. **Motion serves the message.** Every movement should either direct attention, explain a relationship (A pushes B, A becomes B, A syncs to B), or set tone. If you can't name which, cut it.
2. **One idea per beat.** The viewer reads one focal point at a time. Two things may *move* at once only if they are one idea (a card and its label).
3. **Opacity + Y is the workhorse.** Fade-up-and-rise covers 70% of all entrances. Reach for scale, springs, and rotation as seasoning, not diet.
4. **Enter/exit asymmetry.** Enter slow-out (decelerate into place, 12–20f), exit fast-in (accelerate away, 8–14f). Exits are always faster than entrances.
5. **Holds are content.** A beat needs 20–45 frames of stillness for reading. If everything is always moving, nothing is moving. End cards hold at least 45 frames.
6. **Choreograph, don't synchronize.** Related elements stagger 3–5 frames apart in reading order. Simultaneous arrival reads as a glitch; long gaps read as separate thoughts.
7. **Rest states are exact.** The first and last keyframe of every element must land on its intended composed position — motion is a journey between two designed stills. Design the end frame first, then animate toward it.
8. **Springs are punctuation.** One or two spring/overshoot moments per beat maximum, on the element that carries the message. Everything springing = nothing emphasized.
9. **Name the rhythm before animating.** fast–fast–HOLD–fast–SPRING–hold. If you can't say the pattern, you don't have one yet.
10. **Contrast at a glance.** Text must survive 50% zoom and a phone screen: big type, safe margins (≥5% of canvas per side), one accent color doing one job.

## Explainer beat grammar

Every explainer is beats: **hook → tension → mechanism → payoff → CTA**. Durations at 30fps:

| Length | Beats | Shape |
|---|---|---|
| 6s (sting) | 2 | reveal → hold/out |
| 15s (social) | 3 | hook stat → support → CTA |
| 30s (explainer) | 5 | hook → context/tension → mechanism (longest) → payoff → CTA |
| 60s (deep dive) | 6–8 | as 30s + one worked example + objection beat |

The mechanism beat gets the most time and the most literal motion (things actually moving between things). Full archetypes, per-platform pacing, and scene-count math: [references/explainer-grammar.md](references/explainer-grammar.md).

## Timing & easing vocabulary

The working table at 30fps — double frame counts for 60fps, scale proportionally for other rates:

| Role | Duration | Ease | Notes |
|---|---|---|---|
| Entrance (standard) | 12–20f | `ease-out` | fade + 24–40px rise |
| Entrance (hero) | 18–30f | `spring` snappy (12/100) | the one element that matters |
| Exit | 8–14f | `ease-in` | always faster than entry |
| Emphasis pop | 6–10f | `overshoot` | scale 0→1 or 1→1.06→1 |
| Movement A→B | 20–40f | `ease-in-out` | dots traveling, cards sliding |
| Ambient drift | 60f+ | `linear` or `ease-in-out` | background only, subtle |
| Stagger gap | 3–5f | — | between siblings, reading order |
| Crossfade | 8–15f | — | scene transitions |

Spring recipes: **snappy** damping 12 / stiffness 100 (default), **calm** 14/90 (premium, slower settle), **bouncy** 8/200 (playful, visible overshoot — use sparingly). Full tables including fps math, Remotion `Easing.*` and GSAP equivalents: [references/timing-easing.md](references/timing-easing.md).

## Translating After Effects instincts

The designer's vocabulary maps almost 1:1 — use their words, then show the code word:

| AE says | Code says |
|---|---|
| Comp | Scene / composition |
| Layer | Element |
| Keyframe + Easy Ease | Keyframe + `ease-out` (into it) |
| Graph editor curve | Easing preset or cubic-bezier |
| Anchor point | `transformOrigin` |
| Precomp | Sub-composition / component |
| `wiggle()`, `loopOut()` | Deterministic functions of the frame number |

The full translation table — including position/scale/rotation semantics, motion blur, parenting, and what has no equivalent yet — is in [references/ae-translation.md](references/ae-translation.md). When talking to an AE designer, ALWAYS anchor explanations in this table rather than engine jargon.

## Brand → motion tokens

A brand book gives colors and type; motion needs a **personality** derived from them. Extract four decisions before animating anything:

1. **Pace** — snappy (tech, direct) vs fluid (premium, calm). Sets the duration column above ±30%.
2. **Ease flavor** — crisp `ease-out` everywhere vs springs allowed vs bouncy.
3. **Stagger density** — tight 2–3f (energetic) vs relaxed 5–8f (considered).
4. **Entrance vocabulary** — pick TWO signature entrances (e.g. "rise + fade" and "draw from left") and use them consistently; variety comes from rhythm, not from new moves.

The fork-this worksheet (fill it from any brand book, includes a worked Exalate-flavoured starter: dual-system motif, things move in pairs, sync moments get the spring, conflict beats get the hard cut) is in [references/brand-motion-tokens.md](references/brand-motion-tokens.md).

## Choosing the engine

Short version:

- **Motion Lab / motion doc** — explainer-shaped work a designer will refine on a timeline; fastest brief→draft→tweak→MP4 loop.
- **Remotion raw** — programmatic scale (hundreds of variants, data-driven video, React ecosystem). ⚠ Companies over 3 people need a paid company license for production use.
- **HyperFrames** — HTML/GSAP-native, Apache-2.0 (no license cost), no build step, strongest for agent-authored one-off compositions and web-asset reuse. Needs Node 22+ and FFmpeg to render.
- **After Effects** — organic motion, effect stacks, client-mandated pipelines, and anything the team must hand-finish frame by frame.

Decision tree, licensing detail, and render/CI considerations: [references/engine-decision.md](references/engine-decision.md).

## Authoring motion docs (Motion Lab)

When generating or editing a motion doc, obey the contract in [references/motion-doc-guide.md](references/motion-doc-guide.md). The non-negotiables:

- **Budgets**: ≤8 scenes; ≤6 *animated* elements per scene (static context elements are cheap); ≤3 tracks per element; ≤6 keyframes per track. Under budget = readable; over budget = mush.
- **Frames are scene-relative**; scene 1 starting at global frame 500 still keyframes from 0.
- **Ease sits on the arriving keyframe** — it describes the approach INTO that keyframe.
- Animate only `x`, `y`, `scale`, `rotation`, `opacity`. Everything else is static design.
- Elements holding after their last keyframe is the mechanism for "animate in, then stay".
- Colors reference brand tokens (`$accent`), never raw hex, unless intentionally off-brand.
- Scene durations sum (minus crossfade overlaps) to the brief's target length; the final scene holds ≥45 frames after its last keyframe.

For work inside a Motion Lab checkout or portable release, read
[references/agent-workflow.md](references/agent-workflow.md) before editing files. Treat
`workspace/project.motion.json` as the active project and use the repository guidance for
source changes. Never edit `.next/`, traced production dependencies, rendered outputs, or a
user's `.env.local`.

## Self-critique checklist

Run before calling any piece done — render stills at each beat's midpoint and check:

- [ ] Every element earns its place; nothing moves without a nameable reason.
- [ ] One focal point per beat; staggers follow reading order.
- [ ] First/last keyframes land on designed rest states (no drift, no half-faded ghosts).
- [ ] Exits faster than entrances; nothing pops without an overshoot or fade covering it.
- [ ] The rhythm is nameable; no two consecutive scenes share identical motion DNA (same entrance pattern, same timing).
- [ ] Springs/overshoots ≤2 per beat, on message-carrying elements only.
- [ ] Readable at 50% zoom; text inside 5% safe margins; end card holds ≥45f.
- [ ] Total duration within ±10% of the brief.

## Working with a designer (the loop)

1. **Brief** → generate a first draft (or hand-sketch the beat sheet first for anything over 30s).
2. **Watch once at full speed** before judging anything — timing reads differently in motion than on a timeline.
3. **Fix rhythm first** (scene durations, holds), **then choreography** (stagger, order), **then polish** (eases, springs). Never polish before rhythm.
4. Nudge on the timeline; regenerate only per-scene ("revise scene 3: calmer, drop the bounce") — whole-doc regeneration loses accepted work.
5. Export and watch on the target surface (phone for 9:16) before shipping.

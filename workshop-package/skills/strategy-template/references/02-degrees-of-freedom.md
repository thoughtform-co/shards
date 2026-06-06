# Degrees of freedom

Loaded when designing a Skill, calibrating risk, or deciding how much
freedom the model gets on a particular step. The four bands below map
onto how confident you are about what good looks like, and how
recoverable the cost of being wrong is.

## The four bands

| Band | When to use | How the prompt reads |
|------|-------------|----------------------|
| **LOCK** | Output must match a fixed format. Wrong is expensive and not recoverable. | "Produce exactly this shape, in this order, with these fields." |
| **GUIDE** | Format is fixed; content has room. Most production work lives here. | "Use this structure. Within it, decide based on the inputs and the rules below." |
| **EXPLORE** | Multiple good answers exist; the team picks one. Shaping work, drafts, options. | "Give me three meaningfully different versions, then explain the trade-off." |
| **DREAM** | Pattern-break needed. The default answer is too safe. | "Push past the obvious answer. Make the case for a position the team would not naturally take." |

## How to choose

1. Name the cost of wrong. If wrong is cheap and recoverable, open the band up. If wrong damages a relationship, costs money, or cannot be undone, lock it down.
2. Name what good looks like. If you can describe the output before you see it, prefer LOCK or GUIDE. If you cannot, prefer EXPLORE or DREAM.
3. Re-pick the band per step, not per Skill. A single workflow can use all four.
4. Switch from EXPLORE or DREAM to LOCK or GUIDE before the work goes external. Anything published is GUIDE at minimum.

## How this shows up in a SKILL.md

Either:
- An explicit instruction at the top of the relevant section ("Run this step in GUIDE mode"), or
- Implicit, through the rules and examples you provide. Tight rules + many examples produce LOCK behavior; few rules + open prompts produce EXPLORE behavior.

When in doubt, write the band into the prompt. It is easier to explain
the choice if you named it.

## Failure modes

- **Locking too early.** The team has not yet figured out what good looks like, but the Skill enforces a format. The output is consistent and wrong.
- **Exploring too long.** The team knows what good looks like, but the Skill keeps offering options. The work loops without converging.
- **Mixing bands inside a step.** The prompt asks for "exactly this format, but feel free to be creative." The model picks one and ignores the other.

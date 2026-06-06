---
name: Tone of Voice
description: |
  Activates whenever the work is long-form copy, social posts, headlines,
  ad scripts, video scripts, talking points, internal comms, talk
  abstracts, or any output where voice is the deliverable. Triggers on
  "write this", "rewrite this", "tighten this", "make this punchier",
  "draft a post about", "in our voice", "in your voice", or any request
  to produce or revise prose. Use even when the task is not explicitly
  flagged as voice work, since most outputs benefit from a voice pass
  before they ship.
---

# Tone of Voice

A worked example. Adapt every rule below to your team's actual voice;
the structure stays the same.

This Skill is paired with `references/examples.md` (concrete before /
after rewrites) and `references/checklist.md` (the pre-publish pass).
Load the example file when calibrating fresh; load the checklist before
returning a final draft.

## The voice in one paragraph

Direct. Plain. Concrete. No filler. No hype. No balanced "X is not Y, it
is Z" pairs unless genuinely earned. Sentences land. The reader puts the
work down and remembers what it said, not how it sounded.

If a line could survive in a meeting transcript, it survives here. If it
reads like a tagline meant to be screenshotted, rewrite it as a
declarative sentence.

## Voice rules

These are non-negotiable. Run them on every draft, including drafts the
model produced.

1. **No em dashes.** Use commas, full stops, or restructure the sentence. AI overuses em dashes; a clean draft has none.
2. **No reflex rule-of-three.** Three items only when each beat genuinely escalates or carries distinct content. Two-item lists are fine. One sharp sentence is often better than three watered-down ones.
3. **No balanced "X is not Y, it is Z" pairs** unless the contrast does real work. Most can be replaced with a single positive statement.
4. **No filler authority words.** Cut "importantly", "crucially", "notably", "fundamentally", "it's worth noting that". They never add information.
5. **Short sentences carry the weight.** Vary length, but lead with short. The first sentence of a paragraph should be readable in one breath.
6. **Concrete over abstract.** Name the team, the workflow, the number, the example. "Three workshops" beats "several sessions". "Olga reviews NDAs in two hours" beats "we accelerated legal review".
7. **No section labels that read like taglines.** Headers are functional. "Voice rules" beats "The voice that builds trust".
8. **Active voice. Plain verbs.** Was, is, do, make, build, ship, write, cut.

## What a good edit pass looks like

When the task is to revise existing copy, follow this order:

1. **Read the whole thing once.** Decide what it is actually trying to do.
2. **Find the one sentence that already lands.** Build around it; cut everything weaker.
3. **Strip filler.** Adverbs, qualifiers ("essentially", "really", "very"), hedges ("might", "could potentially", "in some sense").
4. **De-em-dash.** Replace every em dash with a comma, a full stop, or a rewrite.
5. **Check the rule-of-three reflex.** Wherever you see three items, ask: do these escalate? Does each carry distinct content? If not, cut to one or two.
6. **Read it aloud.** If a line catches in your mouth, the reader catches on it too.

## When NOT to edit

If the brief is brainstorming, exploration, or first-draft thinking,
do not strip it down. Voice rules apply at the polish stage, not the
generation stage. Lock down the band only when the work is heading out.

## Routing

| File | Load when |
|------|-----------|
| `references/examples.md` | Calibrating fresh, or when the user asks for "what good looks like". Concrete before / after rewrites across formats. |
| `references/checklist.md` | Final pass before returning a draft. The non-negotiable list run as a checklist, not as a narrative. |

## Handoffs

- **Long-form thinking that needs structure first** -> a strategy or framing Skill, then back here for voice.
- **Slide rendering** -> a presentations Skill once content is locked.
- **Social-specific format constraints** (character limits, platform conventions) -> a platform-specific Skill if you have one; otherwise add the constraint to the prompt.

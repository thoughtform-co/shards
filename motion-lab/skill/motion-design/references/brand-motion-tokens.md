# Brand → motion tokens

A brand book specifies how the brand looks at rest. Motion needs four more decisions — extract them once, then every video agrees.

## The worksheet (fork this)

Copy this block, fill it from the brand book + one conversation with the brand owner, and append it to your fork of the skill:

```markdown
## [BRAND] motion tokens

- **Pace**: [snappy | balanced | fluid]
  (Snappy = tech/direct: durations at the LOW end of the bands.
   Fluid = premium/calm: HIGH end, springs → calm recipe.)
- **Ease flavor**: [crisp ease-out only | springs allowed | bouncy allowed]
- **Stagger density**: [tight 2–3f | standard 3–5f | relaxed 5–8f]
- **Signature entrances** (pick exactly TWO):
  [rise+fade | slide from edge | scale-pop | draw-on | mask reveal]
- **Signature moment**: the ONE move that appears in every piece
  (e.g. "the sync spring", "the underline draw")
- **Palette mapping**: background=[...] surface=[...] primary=[...]
  accent=[...] text=[...] muted=[...]
  Accent does ONE job: [CTAs | data | connective motion]
- **Type mapping**: heading=[...] body=[...] mono=[...]
  Video minimums: body ≥ 32px @1080p, headings ≥ 56px.
- **Never**: [e.g. no bounce, no rotation, no full-canvas flashes]
```

Extraction hints: "dynamic/bold" positioning → snappy + springs; "trusted/premium" → fluid + calm; heavy geometric sans → crisp mechanics; humanist/rounded type → softer, springier. When the book says nothing, watch the brand's best-performing existing video and reverse-engineer these eight lines.

## Worked starter — Exalate-flavoured (replace with real brand book values)

```markdown
## Exalate motion tokens (STARTER — validate against the actual brand book)

- Pace: snappy (integration tech; motion should feel like automation)
- Ease flavor: springs allowed (snappy recipe); bounce only on sync moments
- Stagger density: standard 3–5f; PAIRED elements (the two systems) 6–10f
- Signature entrances: slide from edge (systems enter from their own side),
  rise+fade (copy)
- Signature moment: THE SYNC SPRING — whenever data lands on the other side,
  it arrives with spring (8/200). Conflict beats get a HARD CUT, never a fade.
- Dual-system motif: elements exist in PAIRS; what happens left echoes right
  a beat later. Connectors draw left→right; return trips right→left.
- Palette mapping (starter): background=#0B1220 surface=#141F33
  primary=#F4F7FB accent=#4DA3FF text=#F4F7FB muted=#8CA0BC
  Accent's one job: connective motion (lines, dots, chips that travel).
- Type mapping: heading/body = IBM Plex Sans (stand-in), mono = IBM Plex Mono
  for system labels and field values (reads as "software").
- Never: rotation on text; more than one bouncy spring per video.
```

## Using tokens in a motion doc

Brand tokens live in `doc.brand`; elements reference them (`"color": "$accent"`). Generate with tokens, not hex — retinting a video for a sub-brand is then a six-line edit.

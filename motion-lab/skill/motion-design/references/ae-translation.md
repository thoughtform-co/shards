# After Effects → code translation

Anchor every explanation to the designer's existing vocabulary. The mental model transfers almost entirely — only the words change.

## Concept table

| After Effects | Code / motion doc | Notes |
|---|---|---|
| Composition | Scene (motion doc) / `<Composition>` (Remotion) / composition div (HyperFrames) | same idea: a timed canvas |
| Layer | Element | array order = stacking order, exactly like the layer stack (last = top in a motion doc) |
| Keyframe | Keyframe `{frame, value, ease}` | identical concept |
| Easy Ease (F9) | `ease-out` on the arriving keyframe | AE eases both sides; code eases the incoming segment — set the NEXT keyframe's ease for the outgoing feel |
| Graph editor curve | ease preset, or `Easing.bezier(x1,y1,x2,y2)` / `cubic-bezier` | presets cover 95%; beziers are the escape hatch |
| Anchor point | `transformOrigin` | pan-behind tool ≈ choosing origin before scaling/rotating |
| Position | `x`, `y` (element center) | AE position is anchor-relative; motion doc position is the element's center on canvas |
| Scale (%) | `scale` (1 = 100%) | uniform only in motion docs v1 |
| Rotation | `rotation` (degrees) | same |
| Opacity (%) | `opacity` (0–1) | same |
| Precomp | Sub-composition / component | motion doc v1: duplicate the scene instead |
| Parenting / null objects | group transforms | not in motion doc v1 — animate children with matched keyframes |
| `wiggle(freq, amp)` | deterministic noise of the frame: `Math.sin(frame * a) * amp` | code motion must be a pure function of frame — no randomness at render time |
| `loopOut("cycle")` | modulo the frame: `frame % period` | same determinism rule |
| Motion blur switch | per-engine feature | Remotion supports trail-style blur via extra renders; motion doc v1: design without it |
| Time remap / speed ramp | retime keyframes | no curve-based remap in v1 |
| Adjustment layer + effects | not available | effects stacks are AE's home turf — see engine-decision.md |
| Render queue / AME | `Render MP4` button / `npx remotion render` / `npx hyperframes render` | deterministic, scriptable, CI-able |

## Workflow translation

| AE habit | Code habit |
|---|---|
| Rough layout in a still comp first | Design the END FRAME of each scene first (rest states), then animate toward it |
| Duplicate comp per variant | Same doc, swap brand tokens / copy — variants are data |
| Scrub + nudge keyframes | Same — timeline UI, arrow keys, drag diamonds |
| Save incremental project files | Export JSON / git — diffs are readable |
| RAM preview | Player preview is instant; full-quality check = render (fast at these lengths) |

## What genuinely has no equivalent yet

Be honest about these when asked: painterly/organic motion, particle systems, frame-by-frame drawing, third-party plugin ecosystems (Trapcode etc.), and finely art-directed effect stacks. If the piece leans on those, After Effects is the right tool — say so.

## Worked example — lower third

AE: create text layer → position off-left → keyframe position at 0 and +15f → Easy Ease → add opacity 0→100 over 10f.

Motion doc:

```json
{
  "kind": "text", "name": "Lower third", "text": "Radan · Motion",
  "fontSize": 40, "x": 320, "y": 960,
  "tracks": [
    { "property": "x", "keyframes": [
      { "frame": 0, "value": 120, "ease": "linear" },
      { "frame": 15, "value": 320, "ease": "ease-out" } ] },
    { "property": "opacity", "keyframes": [
      { "frame": 0, "value": 0, "ease": "linear" },
      { "frame": 10, "value": 1, "ease": "linear" } ] }
  ]
}
```

Same five decisions, different notation.

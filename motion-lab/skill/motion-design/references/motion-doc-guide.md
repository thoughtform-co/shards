# Motion doc authoring guide

The stored contract is MotionDoc v2: `{ version: 2, meta, brand, assets, scenes }`. The
in-app generator may return `{ title, brand, scenes }` because the app supplies `meta`, assets,
layer bounds, visibility, locks, and IDs. When editing a stored document, preserve IDs of
everything you keep.

## Canvas & coordinates

- The brief tells you the canvas (e.g. 1920×1080 @30fps). **You are told the exact width/height — position for THAT canvas.**
- `x`/`y` is the element's **CENTER**, in px, from the top-left. Canvas center = (width/2, height/2).
- Safe margins: keep content centers such that content BOXES stay ≥5% of the canvas from every edge (≥96px at 1920, ≥54px at 1080-wide vertical).
- 9:16 verticals: bottom ~15% is caption territory on social — keep CTAs above it.
- `scale` is uniform, 1 = designed size. `rotation` in degrees. `opacity` 0–1.
- Stacking: element array order, later = on top.
- Every element has `inFrame`, `outFrame`, `visible`, and `locked`. Bounds are scene-relative;
  rendering clamps them without deleting keyframes beyond the current scene duration.

## Text sizing (1080p reference)

- Hero headline 72–110px · headline 56–84 · subline 36–48 · body/caption 32–44 · eyebrow/mono labels 26–40 with `letterSpacing` 0.08–0.2.
- Single line unless `maxWidth` is set; set `maxWidth` whenever copy exceeds ~28 characters. Estimate line width ≈ fontSize × 0.55 × characters — it must fit inside the safe margins.
- `font` is a ROLE: `heading` | `body` | `mono` (resolved through brand.fonts). Mono = system labels, data, technical eyebrows.
- A text layer may set `fontAssetId` to an uploaded font. Keep the brand role as its fallback.

## Scenes & time

- Frames are **scene-relative** (every scene starts at its own frame 0).
- Ease sits on the **arriving** keyframe: `{frame: 20, value: 1, ease: "ease-out"}` describes the approach from the previous keyframe into frame 20. The first keyframe's ease is ignored.
- After its last keyframe a track **holds** its final value — that's how "animate in and stay" works. Before its first keyframe it holds the first value.
- `spring` ease requires a `spring` config; the physics is time-stretched across the segment — give springs 18–30f segments.
- `transitionIn` on a scene: `cut` (default) or `crossfade` (8–15f). Crossfades OVERLAP the previous scene: total video length = sum of durations − sum of overlaps. The video's LAST scene must end with ≥45f of rest after its final keyframe.
- Scene durations ≥45f except intentional accent cuts (≥10f minimum).
- Scenes are independent: an element that persists across scenes is REDECLARED in each (usually static in the later one — restaging at a new position is fine and often better).

## Brand

- `brand.colors` needs all six tokens: `background, surface, primary, accent, text, muted`. If given brand tokens, echo them EXACTLY; otherwise design a palette fitting the brief's mood (dark canvases flatter motion; ensure text/background contrast ≥ 7:1).
- Elements reference tokens (`"$accent"`), never hex, unless intentionally off-palette.
- `brand.fonts` are CSS stacks. Default stacks (always render-safe): `'IBM Plex Sans', 'Segoe UI', 'Helvetica Neue', sans-serif` and `'IBM Plex Mono', Consolas, monospace`.
- Accent color does ONE job per video (CTAs, or data, or connective motion).

## Assets

- Keep the mandatory top-level `assets` array, even when it is empty.
- Local images use `assetId` and retain `src`; remote images may use `src` alone.
- Uploaded fonts use `fontAssetId` while retaining the text layer's brand font role.
- Local sources live under `/assets/uploads/<sha256>.<ext>` and the asset record's `sha256` must
  match the file. Import through Motion Lab rather than inventing records by hand.
- Do not delete an asset that a layer references.

## Budgets (hard)

- ≤8 scenes · ≤6 **animated** elements per scene (statics for continuity are cheap, don't count) · ≤3 tracks per element · ≤6 keyframes per track.
- Every animated element: usually 2 tracks (opacity + one transform). Three tracks = hero moments only.

## Element recipes

- **Card/panel**: shape rect, `$surface` fill, radius 16–24.
- **Chip/pill**: shape rect, `$accent` fill, radius = height/2 for pills; put its label as a separate text element 2–4f behind.
- **Line/connector/underline**: thin rect (height 4–10) + `transformOrigin: "left"` (or right) + scale 0→1 = draw-on.
- **Dot that travels**: small ellipse with an `x` (or `y`) track, `ease-in-out`, fade in before departure and out on arrival.
- **Full-canvas veil/flash**: canvas-sized rect animating opacity (flash: 0→0.9→0 in ~20f; fade-to-black: 0→1 over the last ~25f).

## Common failure modes (check before returning)

1. Keyframe `frame` beyond `durationInFrames`, or unsorted keyframes.
2. First/last keyframes not on rest states (element drifts or ends mid-fade).
3. Everything entering simultaneously — stagger 3–5f in reading order.
4. Text wider than the safe area (long line, no `maxWidth`).
5. Low-contrast text (muted-on-surface below 4.5:1) or accent doing three jobs.
6. Exit slower than entrance; end card without its ≥45f hold.
7. Scene 1 with a `crossfade` transitionIn (there is nothing to fade from — use cut).
8. Springs on tiny 6f segments (looks broken); bouncy springs on more than one element.

## Mini example (one scene of a valid generation)

```json
{
  "name": "Hook",
  "durationInFrames": 150,
  "transitionIn": { "type": "cut", "durationInFrames": 12 },
  "elements": [
    {
      "kind": "text", "name": "Title", "text": "Ship the update.",
      "fontSize": 92, "font": "heading", "fontWeight": 700,
      "color": "$text", "x": 960, "y": 520,
      "tracks": [
        { "property": "opacity", "keyframes": [
          { "frame": 0, "value": 0, "ease": "linear" },
          { "frame": 16, "value": 1, "ease": "ease-out" } ] },
        { "property": "y", "keyframes": [
          { "frame": 0, "value": 556, "ease": "linear" },
          { "frame": 16, "value": 520, "ease": "ease-out" } ] }
      ]
    },
    {
      "kind": "shape", "name": "Accent rule", "shape": "rect",
      "width": 72, "height": 6, "fill": "$accent", "radius": 3,
      "x": 960, "y": 590, "transformOrigin": "center",
      "tracks": [
        { "property": "scale", "keyframes": [
          { "frame": 10, "value": 0, "ease": "linear" },
          { "frame": 26, "value": 1, "ease": "overshoot" } ] }
      ]
    }
  ]
}
```

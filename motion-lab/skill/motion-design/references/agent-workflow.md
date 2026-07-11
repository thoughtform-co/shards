# Motion Lab agent workflow

Use this workflow when a designer points an agent at a Motion Lab folder.

## Choose the task surface

- To change the current video, edit `workspace/project.motion.json` and files already referenced
  from `public/assets/uploads`.
- To add an asset, use the running app's `/api/assets` endpoint or the Assets tab so hashing,
  metadata, validation, and deduplication remain intact.
- To extend the editor, edit source under `app/`, `components/`, `lib/`, or `remotion/`, then run
  the checks listed in `AGENTS.md`.
- Never put credentials in project JSON, source, prompts, screenshots, or commits.

## Edit loop

1. Read `AGENTS.md`, this skill, and `references/motion-doc-guide.md`.
2. Inspect the active MotionDoc and preserve IDs for every retained scene, layer, track, and
   keyframe.
3. Make the smallest coherent change. Keep scene-relative frames and layer bounds valid.
4. Save valid JSON. Motion Lab detects the revision within two seconds and imports it as one
   undo step.
5. If the UI reports a conflict, stop writing. Use the Agent tab after inspecting both versions.
6. Run `npm run check:workspace`, then the checks appropriate to the change.
7. Render or preview the affected frames before calling motion work complete.

## MotionDoc v2 editing rules

- Keep top-level `version: 2` and an `assets` array, even when it is empty.
- Every element needs `inFrame`, `outFrame`, `visible`, and `locked`.
- Keep keyframes scene-relative. Moving a layer bar shifts its bounds and keyframes; trimming a
  layer changes bounds only.
- Preserve remote image `src` values. Local images additionally use `assetId`; uploaded fonts use
  `fontAssetId` while retaining the text layer's brand font role as fallback.
- Later elements in the document array render visually in front.
- If a transform property has a track, edit or insert its keyframe at the intended frame. Change
  the base value only when that property is untracked.

## Source-change safety

- MotionDoc remains the source of truth. Remotion and HyperFrames must interpret the same timing.
- Editor-only selection and transform overlays must never enter rendered output.
- Keep filesystem endpoints restricted to the fixed workspace and asset directories.
- Run typecheck, MotionDoc checks, exporter checks, production build, and a representative render
  after changing schemas, timing, assets, packaging, or renderer code.

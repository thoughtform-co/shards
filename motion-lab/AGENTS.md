# Motion Lab agent instructions

Motion Lab is a local-first motion editor. MotionDoc v2 is the source of truth, Remotion powers
preview and MP4 rendering, and HyperFrames is the portable HTML export. Read
`skill/motion-design/SKILL.md` and its `references/agent-workflow.md` before motion work.

## Active project

- Edit `workspace/project.motion.json` to change the video currently open in the editor.
- Preserve IDs for retained scenes, layers, tracks, keyframes, and assets.
- Keep top-level `version: 2` and `assets`; keep `inFrame`, `outFrame`, `visible`, and `locked` on
  every element.
- Frames and layer bounds are scene-relative. Later elements in a scene array render in front.
- Do not fabricate local asset records. Import assets through the UI or `/api/assets` so hashes,
  dimensions, and font metadata are valid.
- Motion Lab polls the file and imports external edits as one undo step. Stop if the Agent tab
  reports a conflict; do not overwrite it from another process.

## Source architecture

- `lib/motiondoc/`: schema, migration, timing, sampling, and immutable mutations.
- `components/`: editor workspace, preview overlay, inspector, and timeline.
- `remotion/`: deterministic interpreter used by Player and MP4 rendering.
- `lib/export/`: MotionDoc to HyperFrames translation.
- `app/api/`: fixed local filesystem, generation, rendering, and export endpoints.
- `skill/motion-design/`: canonical craft and authoring guidance used by agents and generation.

Keep editor-only controls outside the Remotion composition. Keep Remotion and HyperFrames timing,
assets, fonts, and visibility behavior equivalent. Filesystem APIs may address only fixed workspace,
render, export, and content-addressed asset directories; never add arbitrary shell execution.

## Working modes

- Use `Start Motion Lab` for the packaged production server. Source edits do not hot reload there.
- Use `Agent Dev` for source changes. Its first run installs the locked dependencies with the
  embedded Node/npm runtime, then starts the development server on port 3210.
- Never edit `.next/`, traced `node_modules/`, `.renders/`, generated exports, release staging,
  or `.env.local`. Never print, commit, or copy secrets into project files.

## Checks

Run the smallest relevant set while iterating, then the full set before handoff:

```text
npm run typecheck
npm run validate:examples
npm run check:exporter
npm run check:v2
npm run check:workspace
npm run check:project-api
npm run build
```

For renderer, asset, font, timing, or packaging changes, also render a representative MP4 and
start the extracted standalone package before declaring success.

# Motion Lab

**Brief in, MP4 out.** A standalone studio for making explainer videos from code: describe the video, Claude drafts it as a *motion doc* (structured JSON — scenes, elements, keyframes), you refine it on a timeline with real keyframe editing, then render an MP4 locally. Built on [Remotion](https://www.remotion.dev/) for preview + render, with a one-click export to [HyperFrames](https://github.com/heygen-com/hyperframes) HTML as a second engine path.

This exists to answer one question honestly: **is code-based motion design quicker than After Effects?** For structured formats — explainers, social cuts, stings, anything with variants — the bet is yes, especially from the second video onwards. You be the judge; that's the point of the tool.

## Standalone releases

The agent-ready release ships as separate Windows x64, macOS Apple Silicon, and macOS Intel ZIPs.
Extract the complete archive, then run `Start Motion Lab` for normal editing. The production server
uses the embedded Node runtime; no system Node installation or `npm install` is required.

The macOS package is unsigned. If Gatekeeper blocks it, right-click `Start Motion Lab.command`,
choose **Open**, and confirm once. If macOS retains the quarantine flag, run
`xattr -dr com.apple.quarantine <extracted-folder>` in Terminal.

The first MP4 render may download Remotion's browser runtime. AI generation remains optional and
requires a user-created `.env.local`; no API key is embedded in a release.

## Work alongside Codex, Claude Code, or Cursor

Motion Lab is designed to run next to an external coding agent, not to embed one. Open the extracted
Motion Lab folder in your agent and ask it to read `AGENTS.md`. Codex, Claude Code, and Cursor also
receive tool-specific guidance from the files included in the folder.

The active video is `workspace/project.motion.json`. Motion Lab writes UI edits there, detects agent
edits within two seconds, validates them, and imports each external revision as one undo step. The
Agent tab shows the exact path, synchronization state, a starter prompt, and conflict controls.

Example prompts:

- “Read AGENTS.md, then make scene three calmer and give the payoff another half-second hold.”
- “Use the motion-design skill to add a restrained logo sting without changing accepted scenes.”
- “Extend the editor with a reusable line layer, keep both render paths equivalent, and run checks.”

Use `Agent Dev` when the agent changes application source. Its first run installs locked dependencies
with the embedded Node/npm toolchain and then starts hot reload. Normal project JSON edits work while
the production launcher is running and need no rebuild.

## AE-lite editor workspace

Motion Lab now uses a desktop editing layout instead of a prompt-first dashboard:

- **Assets** imports PNG, JPEG, WebP, SVG, WOFF/WOFF2, TTF, and OTF files into a content-addressed local library.
- **Create** adds text, shapes, images, and blank scenes without regenerating the document.
- **AI** contains Brief → Draft and the example documents; generation supports the edit loop instead of occupying the workspace.
- The **canvas** selects, moves, scales, rotates, and snaps layers. Animated properties write a keyframe at the playhead; static properties update their base value.
- The **timeline** keeps the scene strip and adds reorderable layer clips, non-destructive in/out trims, visibility/lock controls, and expandable property lanes.
- **File → Save project bundle** creates a portable `.motion.zip` with the v2 MotionDoc and all local image/font assets.

The left tools, right inspector, and bottom timeline are resizable and collapsible. Panel layout is saved separately from the motion document.

## Requirements

- **Node.js 22+** — check with `node --version` (download: https://nodejs.org)
- ~500 MB free disk. The **first render** downloads a headless Chrome (~120 MB, one time); everything else is npm packages.
- No FFmpeg, no Adobe, no accounts needed for the core loop. (FFmpeg is only needed for the optional HyperFrames *render* path — see below.)

Works on Windows and macOS the same way.

## Quickstart

```bash
npm install
npm run dev
```

Open **http://localhost:3210**. That's it — load an example, press Space, drag some keyframe diamonds, hit **Render MP4**.

### Optional: enable AI generation

Copy `.env.example` to `.env.local`, paste an Anthropic API key ([console.anthropic.com](https://console.anthropic.com/)), restart `npm run dev`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without a key, everything still works except the "Brief → draft" and "Revise" buttons: examples, full timeline editing, rendering, and HyperFrames export are all local.

Optional pre-fetch of the render browser (instead of waiting on first render): `npm run setup:browser`.

## The workflow

1. **Brief** (left panel) — describe the video, pick format + duration + brand preset, hit *Generate draft*. Claude designs it using the bundled `motion-design` skill: beat structure, timing, easing, brand tokens.
2. **Watch it once** at full speed (Space) before judging anything.
3. **Refine on the timeline** — the part that should feel like home:
   - Scene blocks: click to select, drag the right edge to retime.
   - Element lanes: every animated property is a row; **diamonds are keyframes**. Drag to retime (snaps to frames, magnetically to neighbors/playhead — hold Alt to disable), double-click a lane to add one, Delete to remove.
   - Inspector (right): exact values, AE-named easing per keyframe ("ease into this keyframe"), spring physics with snappy/calm/bouncy recipes, and ◇ buttons to pin a keyframe at the playhead.
   - Everything is undoable (Ctrl+Z), and the doc autosaves to your browser.
4. **Revise with a note** — select a scene, type "calmer, drop the bounce" → only that scene regenerates. Your accepted work stays untouched.
5. **Render MP4** — local render via Remotion; the file lands in `.renders/` and downloads.
6. **Export HyperFrames** (optional) — writes a self-contained `index.html` (HTML + GSAP timeline) to `exports/hyperframes/`, preview with `npx hyperframes preview <dir>`.

Prefer working raw? **Import/Export JSON** round-trips the motion doc — hand-edit it, ask Claude to edit it, or commit it to git like any other source file.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Play / pause |
| `←` / `→` | Step 1 frame (`Shift` = 10) |
| `Home` / `End` | Jump to start / end |
| `K` | Pin keyframe at playhead (on the selected keyframe's track) |
| `Delete` | Delete selected keyframe / element |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / redo |
| `Ctrl+D` | Duplicate selected scene / layer |
| `Shift+M` | Toggle timeline and canvas snapping |
| `Esc` | Clear selection |
| `Ctrl+scroll` on timeline | Zoom (anchored at cursor) |

## Coming from After Effects

The vocabulary maps almost 1:1 — comp→scene, layer→element, Easy Ease→ease-out, anchor point→transform origin. The full translation table (including what has *no* equivalent yet — this tool won't pretend to replace organic motion or effect stacks) lives in [`skill/motion-design/references/ae-translation.md`](skill/motion-design/references/ae-translation.md).

## The skill

[`skill/motion-design/`](skill/motion-design/SKILL.md) is the craft layer that guides generation: explainer beat grammar, timing/easing vocabulary, brand→motion tokens, and an engine decision guide. It's simultaneously:

- the **system prompt** of this app's generator (edit it, and generation changes on the next request);
- a **Claude Skill** you can upload to claude.ai (Settings → Capabilities → Skills) and use in any chat — ask for a `.skill` bundle or zip this folder;
- a worksheet: fork it with your own brand book via `references/brand-motion-tokens.md`.

## HyperFrames export & render

The export produces plain HTML + a GSAP timeline — no build step, Apache-2.0 tooling:

```bash
npx hyperframes preview exports/hyperframes/<your-export>   # browser preview (Node 22+)
npx hyperframes render  exports/hyperframes/<your-export>   # MP4 (needs FFmpeg + Chrome)
```

FFmpeg install: `winget install ffmpeg` (Windows) / `brew install ffmpeg` (macOS). Springs translate approximately (documented per-export in `TRANSLATION_NOTES.md`); cubic eases translate exactly.

## Licensing — read before production use

- **Remotion** (powers preview + the MP4 button): free for individuals and companies of ≤3 people. **Larger companies need a paid company license for production work** — see [remotion.pro](https://www.remotion.pro/). Evaluating with this tool is fine; shipping client videos at an agency/company scale needs the license.
- **HyperFrames**: Apache-2.0, free for any use — which is exactly why the export path exists.
- The motion doc format itself is just JSON — yours.

## Project structure (for the curious)

```
lib/motiondoc/   the format: schema, timing math, keyframe sampler, mutations
lib/examples/    three teaching docs (also the test corpus)
remotion/        the interpreter: one composition renders ANY motion doc
lib/render/      local MP4 pipeline (bundle-once + headless Chrome)
lib/generate/    Claude generation (reads skill/ as its system prompt)
lib/export/      motion doc → HyperFrames HTML translator
components/      studio UI: timeline, inspector, preview, brief panel
skill/           the motion-design skill (craft layer + generation contract)
scripts/         validate-examples · check-exporter · render-stills
```

Handy scripts: `npm run validate:examples` · `npm run check:exporter` · `npx tsx scripts/render-stills.ts` (renders verification PNGs of the examples without the UI).

## Sending this folder to someone

From a git checkout: `git archive -o motion-lab.zip HEAD:motion-lab` (excludes node_modules and local files automatically). Or zip the folder minus `node_modules/`, `.next/`, `.renders/`, `exports/`, `.env.local`. The recipient runs `npm install && npm run dev`.

## Troubleshooting

- **Port 3210 busy** — edit the `-p 3210` in `package.json` scripts.
- **First render seems stuck** — it's downloading Chrome Headless Shell (~120 MB, one time); the progress message says so. Corporate AV/proxies can block it: `npm run setup:browser` shows the download URL.
- **Renders fail with a path error (Windows)** — avoid deeply nested/OneDrive-synced folders; if paths exceed 260 chars, enable long paths (`git config core.longpaths true`, and Windows' `LongPathsEnabled` registry switch).
- **Generation 401** — key missing/typoed in `.env.local`, or the file wasn't reloaded: restart `npm run dev`.
- **Stale build weirdness after upgrading** — delete `.next/` and restart.
- **Preview plays but fonts look different in the MP4** — you named a font that isn't installed for headless Chrome; stick to the bundled IBM Plex stacks or system fonts.

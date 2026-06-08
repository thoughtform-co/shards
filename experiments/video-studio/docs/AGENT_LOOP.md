# Agent authoring loop

Video Studio templates are designed to be extended by coding agents, not rebuilt by hand each time.

## Install both skills

```bash
npx skills add heygen-com/hyperframes
npx skills add remotion-dev/skills
```

## Add a HyperFrames template

1. Create `experiments/video-studio/templates/hyperframes/<slug>/index.html`.
2. Use `class="clip"` plus `data-start`, `data-duration`, and `data-track-index` on timed elements.
3. Register the template in `experiments/video-studio/templates/index.ts`.
4. Preview instantly via `/api/experiments/video-studio/composition/<slug>`.

## Add a Remotion template

1. Create a composition under `experiments/video-studio/templates/remotion/`.
2. Register it in `Root.tsx` with constants-first `defaultProps`.
3. Add a resolver in `deck-explainer-props.ts` style if props need normalization.
4. Register metadata in `templates/index.ts`.

## Prompting discipline

- Structure first, visuals second.
- Declare timing, resolution, and fps up front.
- HyperFrames: edit incrementally; templatize variables at render time.
- Remotion: keep strings, colors, and timings as top-of-file constants.

## Lint before render

```bash
npx hyperframes lint path/to/project
npx hyperframes validate path/to/project
```

Remotion compositions can be validated with `npx remotion compositions` against the bundled entry point.

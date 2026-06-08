# Cloud rendering upgrade path

Video Studio renders locally by default via the Node APIs exposed in:

- `experiments/video-studio/server/renderRemotion.ts`
- `experiments/video-studio/server/renderHyperframes.ts`

This keeps preview free and avoids Vercel serverless limits for Chrome + FFmpeg workloads.

## When to upgrade

Use cloud rendering when the video producer needs a **Render** button on the deployed site, or when batch jobs should run outside a developer laptop.

## Remotion options

1. **Vercel Sandbox** — Remotion ships a Next.js App Router template with Sandbox rendering. Mirror that pattern in `app/api/experiments/video-studio/render/route.ts` when `VERCEL=1`.
2. **Remotion Lambda** — mature distributed renderer for high-volume variant sets.
3. **GitHub Actions** — acceptable for scheduled or manual batch renders with artifact upload.

Licensing reminder: for-profit brands with more than three employees need a Remotion company license when shipping Remotion output commercially.

## HyperFrames options

1. **HyperFrames AWS Lambda** — documented at hyperframes.heygen.com/deploy/aws-lambda.
2. **Self-hosted producer** — `@hyperframes/producer` already powers local renders; deploy the producer service beside your app and call it from the render API.

## Suggested routing

```text
if VERCEL:
  enqueue cloud render job
else:
  render locally (current behavior)
```

Return job IDs in both paths so the UI can poll status and expose a download URL when complete.

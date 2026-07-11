import { createRequire } from "node:module";
import path from "node:path";

import type { MotionDoc } from "../motiondoc/schema";

/*
 * Local rendering via the Remotion Node APIs. The webpack bundle is
 * built once per process and cached as a PROMISE on globalThis, so
 * concurrent renders and HMR reloads share one build instead of
 * racing. Everything under remotion/ and lib/ uses relative imports,
 * so no webpack alias is needed.
 */

declare global {
  var __motionLabBundle: Promise<string> | undefined;
}

const COMPOSITION_ID = "MotionDoc";

function remotionRuntime() {
  const runtimeRequire = createRequire(path.join(process.cwd(), "package.json"));
  return {
    bundler: runtimeRequire("@remotion/bundler") as typeof import("@remotion/bundler"),
    renderer: runtimeRequire("@remotion/renderer") as typeof import("@remotion/renderer"),
  };
}

function getServeUrl(): Promise<string> {
  if (!globalThis.__motionLabBundle) {
    globalThis.__motionLabBundle = remotionRuntime().bundler.bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
      publicDir: path.join(process.cwd(), "public"),
    }).catch((error) => {
      /* Don't cache a failed build. */
      globalThis.__motionLabBundle = undefined;
      throw error;
    });
  }
  return globalThis.__motionLabBundle;
}

export type ProgressFn = (progress: number, message: string) => void;

async function prepare(doc: MotionDoc, onProgress: ProgressFn) {
  const { renderer } = remotionRuntime();
  onProgress(
    0.01,
    "Preparing headless browser (first run downloads ~120 MB — one time only)…",
  );
  await renderer.ensureBrowser();
  onProgress(0.04, "Bundling composition…");
  const serveUrl = await getServeUrl();
  onProgress(0.08, "Resolving composition metadata…");
  const inputProps = { doc };
  const composition = await renderer.selectComposition({
    serveUrl,
    id: COMPOSITION_ID,
    inputProps,
  });
  return { serveUrl, composition, inputProps, renderer };
}

export async function renderMotionDocToFile(opts: {
  doc: MotionDoc;
  outputPath: string;
  onProgress: ProgressFn;
}): Promise<void> {
  const { serveUrl, composition, inputProps, renderer } = await prepare(
    opts.doc,
    opts.onProgress,
  );
  await renderer.renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    outputLocation: opts.outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      opts.onProgress(
        0.1 + progress * 0.9,
        `Rendering ${Math.round(progress * 100)}%`,
      );
    },
  });
  opts.onProgress(1, "Render complete");
}

/** Render a single frame to PNG — used by the verification script. */
export async function renderMotionDocStill(opts: {
  doc: MotionDoc;
  frame: number;
  outputPath: string;
  onProgress?: ProgressFn;
}): Promise<void> {
  const onProgress = opts.onProgress ?? (() => {});
  const { serveUrl, composition, inputProps, renderer } = await prepare(
    opts.doc,
    onProgress,
  );
  await renderer.renderStill({
    serveUrl,
    composition,
    frame: opts.frame,
    output: opts.outputPath,
    inputProps,
  });
}

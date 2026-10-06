#!/usr/bin/env node
/**
 * Render the Folio launch film.
 *
 *   node video/folio/render.mjs stills [frames]   key stills + one contact sheet
 *   node video/folio/render.mjs film              the silent master, 1080 x 1350
 *
 * The composition is laid out at 540 x 675 CSS pixels, as the page's social
 * frames are, and rendered at 2x. Bundled here rather than through the
 * Remotion CLI so the `@/` alias the page's components use resolves to this
 * repo without a root config file. Output goes to video/folio/out/, which
 * is not committed: the recipe is, the pixels are not.
 */

import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const outDir = join(here, "out");

/* One frame from every scene, and the frames either side of each tap. */
const KEY = [0, 30, 36, 62, 80, 112, 140, 158, 172, 200, 230, 248, 262, 300, 333, 345, 380, 430, 470, 486, 530, 599];

const [mode = "stills", list] = process.argv.slice(2);

await mkdir(outDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint: join(here, "index.ts"),
  webpackOverride: (config) => ({
    ...config,
    resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": root } },
  }),
});

const composition = await selectComposition({ serveUrl, id: "FolioLaunch" });

if (mode === "stills") {
  const frames = list ? list.split(",").map(Number) : KEY;
  const dir = join(outDir, "stills");
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  let n = 0;
  for (const frame of frames) {
    n += 1;
    const output = join(dir, `s${String(n).padStart(2, "0")}.png`);
    await renderStill({ serveUrl, composition, frame, output, scale: 1 });
    console.log(`still f${frame} -> ${output}`);
  }
  const cols = 6;
  const rows = Math.ceil(frames.length / cols);
  const sheet = join(outDir, "sheet.jpg");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", "1", "-i", join(dir, "s%02d.png"),
    "-vf", `scale=270:-1,tile=${cols}x${rows}:padding=6:margin=6:color=0xd0d5dc`,
    "-frames:v", "1", "-q:v", "3", sheet,
  ]);
  console.log(`sheet -> ${sheet}`);
} else if (mode === "film") {
  const output = join(outDir, "folio-launch-silent.mp4");
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    crf: 14,
    scale: 2,
    outputLocation: output,
    onProgress: ({ progress }) => process.stdout.write(`\r${Math.round(progress * 100)}%`),
  });
  console.log(`\nfilm -> ${output}`);
} else {
  console.error(`Unknown mode ${mode}: use "stills" or "film".`);
  process.exit(1);
}

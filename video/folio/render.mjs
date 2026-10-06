#!/usr/bin/env node
/**
 * Render the Folio launch film.
 *
 *   node video/folio/render.mjs stills [frames] [--wide]   key stills + one contact sheet
 *   node video/folio/render.mjs film [--wide]              the master, with sound if made
 *
 * Two formats from one composition: 4:5 (540 x 675, the default) and, with
 * --wide, 16:9 (960 x 540). Both are laid out in CSS pixels, as the page's
 * social frames are, and rendered at 2x: 1080 x 1350 and 1920 x 1080.
 *
 * `film` writes the silent picture, then, if out/sound.wav exists (see
 * sound.py), muxes it with a two-pass loudnorm to -16 LUFS integrated and a
 * -1.5 dBTP ceiling over the film's own length.
 *
 * Bundled here rather than through the Remotion CLI so the `@/` alias the
 * page's components use resolves to this repo without a root config file.
 * Output goes to video/folio/out/, which is not committed: the recipe is,
 * the pixels are not.
 */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const outDir = join(here, "out");

/* One frame from every scene, and the frames either side of each tap. */
const KEY = [0, 30, 36, 90, 110, 150, 180, 200, 225, 260, 300, 330, 360, 400, 450, 456, 520, 570, 630, 636, 700, 779];

const args = process.argv.slice(2);
const wide = args.includes("--wide");
const [mode = "stills", list] = args.filter((a) => !a.startsWith("--"));
const id = wide ? "FolioLaunchWide" : "FolioLaunch";
const tag = wide ? "16x9" : "4x5";

await mkdir(outDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint: join(here, "index.ts"),
  webpackOverride: (config) => ({
    ...config,
    resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": root } },
  }),
});

const composition = await selectComposition({ serveUrl, id });

if (mode === "stills") {
  const frames = list ? list.split(",").map(Number) : KEY;
  const dir = join(outDir, `stills-${tag}`);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  let n = 0;
  for (const frame of frames) {
    n += 1;
    const output = join(dir, `s${String(n).padStart(2, "0")}.png`);
    await renderStill({ serveUrl, composition, frame, output, scale: 1 });
  }
  const cols = wide ? 4 : 6;
  const rows = Math.ceil(frames.length / cols);
  const sheet = join(outDir, `sheet-${tag}.jpg`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", "1", "-i", join(dir, "s%02d.png"),
    "-vf", `scale=${wide ? 400 : 270}:-1,tile=${cols}x${rows}:padding=6:margin=6:color=0xd0d5dc`,
    "-frames:v", "1", "-q:v", "3", sheet,
  ]);
  console.log(`${frames.length} stills -> ${sheet}`);
} else if (mode === "film") {
  const silent = join(outDir, `folio-launch-${tag}-silent.mp4`);
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    crf: 14,
    scale: 2,
    outputLocation: silent,
    onProgress: ({ progress }) => process.stdout.write(`\r${Math.round(progress * 100)}%`),
  });
  console.log(`\npicture -> ${silent}`);

  const sound = join(outDir, "sound.wav");
  if (!existsSync(sound)) {
    console.log("no out/sound.wav; run sound.py to mux sound");
  } else {
    const dur = String(composition.durationInFrames / composition.fps);
    const target = "I=-16:TP=-1.5:LRA=11";
    const probe = spawnSync("ffmpeg", [
      "-nostats", "-i", sound, "-af", `atrim=0:${dur},loudnorm=${target}:print_format=json`, "-f", "null", "-",
    ], { encoding: "utf8" }).stderr;
    const m = JSON.parse(probe.slice(probe.lastIndexOf("{"), probe.lastIndexOf("}") + 1));
    const measured = `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
    const final = join(outDir, `folio-launch-${tag}.mp4`);
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", silent, "-i", sound,
      "-filter_complex", `[1:a]atrim=0:${dur},loudnorm=${target}:${measured}:linear=true,aresample=48000[a]`,
      "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
      "-t", dur, "-movflags", "+faststart", final,
    ]);
    console.log(`film -> ${final}`);
  }
} else {
  console.error(`Unknown mode ${mode}: use "stills" or "film".`);
  process.exit(1);
}

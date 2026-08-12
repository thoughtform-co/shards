/*
 * Render /hero-lab/render to a seamless 30s MP4 at 1080x1450.
 *
 * ── why frame-by-frame and not a screen recording ───────────────────
 * Playwright can record video, and it records what the compositor
 * happens to produce — variable frame timing, dropped frames under load,
 * and a WebM that has to be transcoded anyway. This walks the animation
 * instead: every CSS animation on the page is paused, and each frame is
 * seeked to an exact `currentTime` before it is captured. The output is
 * deterministic, has no dropped frames, and lands on the loop point to
 * the millisecond — which is the whole game for a looping figure.
 *
 * The seek uses `currentTime`, NOT a negative `animation-delay`. Delay
 * only positions an animation when it starts; on a running one it adds
 * to the elapsed time instead of replacing it.
 *
 * ── why one cycle and not thirty seconds of frames ──────────────────
 * The figure's cycle already starts and ends on the identical Loop mark,
 * so it is a closed loop: repeating it is seamless with no cross-fade,
 * no reverse and no trickery. Only ONE 15s cycle is rendered, then ffmpeg
 * concatenates the encoded clip with itself. Half the frames, half the
 * time, and the two halves are bit-identical rather than merely similar.
 *
 * A ping-pong — forward then reversed — would also join cleanly, but it
 * would play the fold as an unfold: labels un-fading, beads un-slotting,
 * the mark blooming backwards out of the figure. A closed loop does not
 * need it.
 *
 * ── resolution ──────────────────────────────────────────────────────
 * Captured at a 540x725 viewport with `deviceScaleFactor: 2`, giving
 * 1080x1450 device pixels. See the note in `render/page.tsx` for why the
 * figure must be laid out at its design size rather than at full output
 * size.
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const port = process.env.PORT ?? "3001";
const origin = `http://localhost:${port}`;

/* Must match `--tf-fig-dur` in `render.css`. Two of these is the 30s. */
const CYCLE_SECONDS = 15;
const FPS = 30;
const FRAMES = CYCLE_SECONDS * FPS;

/* CSS pixels; the 2x device scale factor doubles both into the output. */
const VIEWPORT = { width: 540, height: 725 };

const frameDir = resolve(root, ".tmp", "hero-frames");
const outDir = resolve(root, "exports");
const cyclePath = resolve(frameDir, "cycle.mp4");
const outPath = resolve(outDir, "hero-figure-workflow-1080x1450.mp4");

await rm(frameDir, { recursive: true, force: true });
await mkdir(frameDir, { recursive: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
});

const unlock = await context.request.post(`${origin}/api/unlock`, {
  data: { password: "arrakis" },
});
if (!unlock.ok()) {
  throw new Error(`unlock failed: ${unlock.status()} ${await unlock.text()}`);
}

const page = await context.newPage();
page.on("pageerror", (err) => console.error("PAGE ERROR:", err.message));

await page.goto(`${origin}/hero-lab/render`, {
  waitUntil: "networkidle",
  timeout: 90000,
});
await page.waitForSelector(".tf-cn", { timeout: 30000 });

/* Belt and braces on the dev overlay. `render.css` hides it too, but the
   portal is injected by the dev server rather than the page and has
   changed name across Next versions — a stray dev badge composited into
   900 frames is not something to find out about after the encode. */
await page.addStyleTag({
  content:
    "nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none !important}",
});
/* Web fonts have to be in before the first frame or the type reflows
   partway through the render. */
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const animationCount = await page.evaluate(() => {
  const fig = document.querySelector(".tf-fig");
  const animations = fig.getAnimations({ subtree: true });
  animations.forEach((animation) => animation.pause());
  return animations.length;
});
console.log(`paused ${animationCount} animations`);
if (animationCount === 0) {
  throw new Error(
    "no animations found — the figure is not looping, check data-tf-loop",
  );
}

console.log(`rendering ${FRAMES} frames at ${FPS}fps…`);
for (let frame = 0; frame < FRAMES; frame += 1) {
  await page.evaluate((ms) => {
    const fig = document.querySelector(".tf-fig");
    fig.getAnimations({ subtree: true }).forEach((animation) => {
      animation.currentTime = ms;
    });
    /* Two frames: one for the style change to be committed, one for it
       to be painted. A fixed timeout would be both slower and less
       certain. */
    return new Promise((done) =>
      requestAnimationFrame(() => requestAnimationFrame(done)),
    );
  }, (frame / FPS) * 1000);

  const path = resolve(frameDir, `f${String(frame).padStart(4, "0")}.png`);
  /* NOT `animations: "disabled"`. That option is for still screenshots
     of pages that happen to move: Playwright cancels every infinite
     animation to its base style before capturing, which here is the
     settled figure — so it silently overrode all 450 seeks and rendered
     thirty seconds of the same frame. The animations are already paused
     by hand above; Playwright must not touch them. */
  await page.screenshot({ path });

  if (frame % 60 === 0) console.log(`  ${frame}/${FRAMES}`);
}

await browser.close();
console.log("frames done");

function ffmpeg(args, label) {
  const result = spawnSync("ffmpeg", args, {
    stdio: ["ignore", "ignore", "pipe"],
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed:\n${result.stderr?.slice(-3000)}`);
  }
}

/* One cycle, encoded once. `-crf 16` is visually lossless on flat paper
   and thin strokes; the default 23 puts mosquito noise around the type. */
ffmpeg(
  [
    "-y",
    "-framerate", String(FPS),
    "-i", resolve(frameDir, "f%04d.png"),
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "16",
    /* yuv420p, not the higher-fidelity 444: it is the only chroma format
       every player and every social upload pipeline accepts. */
    "-pix_fmt", "yuv420p",
    cyclePath,
  ],
  "encode cycle",
);

/* Concatenated with itself by stream copy — no re-encode, so the second
   cycle is bit-identical to the first and the join is exact. */
const listPath = resolve(frameDir, "concat.txt");
await writeFile(
  listPath,
  `file '${cyclePath.replace(/\\/g, "/")}'\nfile '${cyclePath.replace(/\\/g, "/")}'\n`,
  "utf8",
);

ffmpeg(
  [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", listPath,
    "-c", "copy",
    "-movflags", "+faststart",
    outPath,
  ],
  "concat",
);

const probe = spawnSync(
  "ffprobe",
  [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,nb_frames,r_frame_rate:format=duration,size",
    "-of", "default=noprint_wrappers=1",
    outPath,
  ],
  { encoding: "utf8" },
);
console.log(`wrote ${outPath}`);
console.log(probe.stdout?.trim());

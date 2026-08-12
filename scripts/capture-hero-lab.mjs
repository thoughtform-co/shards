/*
 * Capture the three /hero-lab candidates at fixed points in their 16s
 * cycle, so the morph can be judged from stills.
 *
 * Emits .tmp/hero-lab-<candidate>-<t>.png plus a full-page sheet per
 * palette. `preview_screenshot` stalls on the aiop routes; this is the
 * fallback that works.
 *
 * Runs against a dev server on PORT (default 3001) — port 3000 on this
 * machine is usually a different project.
 *
 * `channel: "chrome"` because the bundled Playwright chromium is not
 * downloaded here.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(root, ".tmp");
await mkdir(outDir, { recursive: true });

const port = process.env.PORT ?? "3001";
const origin = `http://localhost:${port}`;

/* The beats of the shared phase map worth stopping on. The four between
   0.09 and 0.31 walk the constellation's emergence — bud, separate,
   ride, slot — which is too fast to judge at speed and is the whole
   reason this script scrubs rather than screenshotting a live page. */
const FRAMES = [
  { t: 0.04, id: "01-mark" },
  { t: 0.11, id: "02-bud" },
  { t: 0.15, id: "03-separating" },
  { t: 0.21, id: "04-ridden" },
  { t: 0.26, id: "05-slotting" },
  { t: 0.33, id: "06-wiring" },
  { t: 0.45, id: "07-hold" },
  { t: 0.8, id: "08-folding" },
];

/* nth-of-kind rather than a bare class: the three constellation cuts
   share `.tf-cn` and differ only by `data-tf-labels`. Each selector is
   taken `.first()`, which is the 420px stage in that panel. */
const CANDIDATES = [
  { id: "d-nested", selector: ".tf-nest" },
  { id: "c1-named", selector: '.tf-cn[data-tf-labels="named"]' },
  { id: "c2-bare", selector: '.tf-cn[data-tf-labels="none"]' },
  { id: "a-aperture", selector: ".tf-ap" },
  { id: "b-quatrefoil", selector: ".tf-qf" },
];

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  deviceScaleFactor: 2,
  viewport: { width: 1600, height: 1100 },
});

const unlock = await context.request.post(`${origin}/api/unlock`, {
  data: { password: "arrakis" },
});
if (!unlock.ok()) {
  throw new Error(`unlock failed: ${unlock.status()} ${await unlock.text()}`);
}

const page = await context.newPage();
page.on("pageerror", (err) => console.error("PAGE ERROR:", err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") console.error("CONSOLE ERROR:", msg.text());
});

await page.goto(`${origin}/hero-lab`, {
  waitUntil: "networkidle",
  timeout: 90000,
});
await page.waitForSelector(".tf-lab__panel", { timeout: 30000 });

/* Seek every animation in the page to the same point in the 16s cycle.
   Same mechanism the lab's own scrubber uses, driven directly here so
   the capture does not depend on the button labels.

   `currentTime`, NOT a negative `animation-delay`. The delay only
   positions an animation when it starts; on a running one it adds to the
   elapsed time instead of replacing it, so a delay-based scrub returns
   frames offset by however long the page has been open. */
async function scrubTo(t) {
  await page.evaluate((value) => {
    document.querySelectorAll(".tf-fig").forEach((fig) => {
      fig.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause();
        animation.currentTime = value * 16000;
      });
    });
  }, t);
  await page.waitForTimeout(220);
}

for (const palette of ["gold", "plopsa"]) {
  if (palette === "plopsa") {
    await page.evaluate(() => {
      document.querySelector(".tf-lab").classList.add("aiop-shell--plopsa");
    });
    await page.waitForTimeout(200);
  }

  for (const frame of FRAMES) {
    await scrubTo(frame.t);
    for (const candidate of CANDIDATES) {
      const el = page.locator(`${candidate.selector}`).first();
      await el.scrollIntoViewIfNeeded();
      const out = resolve(
        outDir,
        `hero-lab-${palette}-${candidate.id}-${frame.id}.png`,
      );
      await el.screenshot({ path: out });
      console.log(`wrote ${out}`);
    }
  }

  await scrubTo(0.45);
  const sheet = resolve(outDir, `hero-lab-${palette}-sheet.png`);
  await page.screenshot({ path: sheet, fullPage: true });
  console.log(`wrote ${sheet}`);
}

/* Reduced motion: the base CSS has to BE the settled figure, not a
   stripped one. This is the check `.aiop-orbit` failed for months. */
const reduced = await browser.newContext({
  deviceScaleFactor: 2,
  viewport: { width: 1600, height: 1100 },
  reducedMotion: "reduce",
});
await reduced.request.post(`${origin}/api/unlock`, {
  data: { password: "arrakis" },
});
const reducedPage = await reduced.newPage();
await reducedPage.goto(`${origin}/hero-lab`, {
  waitUntil: "networkidle",
  timeout: 90000,
});
await reducedPage.waitForSelector(".tf-lab__panel", { timeout: 30000 });
await reducedPage.waitForTimeout(600);
const reducedSheet = resolve(outDir, "hero-lab-reduced-motion.png");
await reducedPage.screenshot({ path: reducedSheet, fullPage: true });
console.log(`wrote ${reducedSheet}`);

await browser.close();
await reduced.close();

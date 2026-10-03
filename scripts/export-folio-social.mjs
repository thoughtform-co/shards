#!/usr/bin/env node
/**
 * Export Folio's social images from the running dev or prod server.
 *
 *   FOLIO_BASE_URL=http://localhost:3000 node scripts/export-folio-social.mjs
 *
 * Reads the artboards from content/folio-frames.json, opens each one at
 * /folio/frames/<slug> at its CSS size with deviceScaleFactor 2, and writes
 * the PNG to the path the manifest names (four portraits to exports/folio/,
 * the Open Graph card to public/folio/og.png). Each file is then measured
 * and the run fails if any is not exactly twice its artboard.
 *
 * /folio is public, so no unlock is needed. Uses the installed Chrome
 * because the Chromium revision Playwright pins is not always cached here.
 */

import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.env.FOLIO_BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, "");
const SCALE = 2;

const specs = JSON.parse(await readFile(resolve(root, "content/folio-frames.json"), "utf8"));

/* Fail early, and plainly, if the server on that port is not this app. */
const probe = await fetch(`${base}/folio`).catch(() => null);
if (!probe || !probe.ok || !(await probe.text()).includes("data-folio-shell")) {
  console.error(`No Folio page at ${base}/folio. Start the shards dev server and set FOLIO_BASE_URL.`);
  process.exit(1);
}

const browser = await chromium.launch({ channel: "chrome", args: ["--disable-lcd-text"] });
const context = await browser.newContext({
  deviceScaleFactor: SCALE,
  reducedMotion: "reduce",
  colorScheme: "light",
});

let failed = 0;
try {
  for (const spec of specs) {
    const page = await context.newPage();
    await page.setViewportSize({ width: spec.w, height: spec.h });
    await page.goto(`${base}/folio/frames/${spec.slug}`, { waitUntil: "networkidle" });
    const frame = page.locator(`[data-folio-frame="${spec.slug}"]`);
    await frame.waitFor({ state: "visible", timeout: 20_000 });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await page.evaluate(() => document.fonts.ready);

    const out = resolve(root, spec.out);
    await mkdir(dirname(out), { recursive: true });
    await frame.screenshot({ path: out, animations: "disabled" });

    const { width, height } = await sharp(out).metadata();
    const ok = width === spec.w * SCALE && height === spec.h * SCALE;
    if (!ok) failed += 1;
    console.log(`${ok ? "ok  " : "FAIL"} ${spec.out}  ${width}x${height}`);
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) {
  console.error(`${failed} image(s) came out at the wrong size.`);
  process.exit(1);
}

// One-off (re-runnable) image compressor for the Stripe access page key visual.
//
// Usage:
//   node scripts/compress-stripe-image.mjs
//
// Reads:  public/stripe-office.png         (source — large; place here before re-running)
// Writes: public/images/stripe-office-landing.webp  (2400px, ~retina-friendly)
//
// Tuned for a softened backdrop — Lanczos3 downscale, gentle WebP quality.
// `next/image` further down-samples for smaller viewports automatically.
// The source PNG is intentionally not committed; the compressed WebP is the
// asset we ship.

import { mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const source = resolve(root, "public", "stripe-office.png");
const outputDir = resolve(root, "public", "images");

const target = {
  name: "stripe-office-landing.webp",
  width: 2400,
  quality: 80,
};

await mkdir(outputDir, { recursive: true });

const sourceMeta = await sharp(source).metadata();
console.log(
  `source: ${sourceMeta.width}×${sourceMeta.height} (${sourceMeta.format})`,
);

const targetPath = resolve(outputDir, target.name);
await sharp(source)
  .resize({
    width: target.width,
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3,
  })
  .webp({ quality: target.quality, effort: 5 })
  .toFile(targetPath);

const { size } = await stat(targetPath);
console.log(
  `wrote: ${target.name} (${target.width}px wide, ${(size / 1024).toFixed(
    1,
  )} KB)`,
);

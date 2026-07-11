/*
 * Render verification stills straight through the real pipeline
 * (bundle → headless Chrome → PNG), no dev server needed.
 *
 *   npx tsx scripts/render-stills.ts two-systems-sync 30,200,430,660,800
 *   npx tsx scripts/render-stills.ts            # sensible defaults per example
 *
 * Output: .renders/stills/<example>-f<frame>.png
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";

import { EXAMPLES, getExample } from "../lib/examples";
import { totalDurationInFrames } from "../lib/motiondoc/timing";
import { renderMotionDocStill } from "../lib/render/renderer";

const DEFAULT_FRAMES: Record<string, number[]> = {
  "two-systems-sync": [40, 200, 430, 660, 800],
  "stat-punch": [60, 220, 400],
  "logo-sting": [40, 90, 150],
};

async function main() {
  const [exampleArg, framesArg] = process.argv.slice(2);
  const targets = exampleArg
    ? [exampleArg]
    : EXAMPLES.map((e) => e.id);

  const outDir = path.join(process.cwd(), ".renders", "stills");
  await mkdir(outDir, { recursive: true });

  for (const id of targets) {
    const example = getExample(id);
    if (!example) {
      console.error(`Unknown example: ${id}`);
      process.exit(1);
    }
    const total = totalDurationInFrames(example.doc);
    const frames = framesArg
      ? framesArg.split(",").map((f) => parseInt(f.trim(), 10))
      : (DEFAULT_FRAMES[id] ?? [Math.floor(total / 2)]);

    for (const frame of frames) {
      if (frame < 0 || frame >= total) {
        console.warn(`  skip f${frame} (out of range 0..${total - 1})`);
        continue;
      }
      const outputPath = path.join(outDir, `${id}-f${frame}.png`);
      process.stdout.write(`  ${id} f${frame} → ${outputPath}\n`);
      await renderMotionDocStill({
        doc: example.doc,
        frame,
        outputPath,
        onProgress: (_p, message) => process.stdout.write(`    ${message}\n`),
      });
    }
  }
  console.log("Stills done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

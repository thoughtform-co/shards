/*
 * Structural assertions on the HyperFrames exporter, across all three
 * bundled examples — run via `npm run check:exporter`. Writes the
 * two-systems export to exports/hyperframes/check/ for a manual
 * `npx hyperframes preview` pass.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { EXAMPLES } from "../lib/examples";
import { motionDocToHyperframes } from "../lib/export/motionDocToHyperframes";
import { computeSceneStarts, totalDurationInFrames } from "../lib/motiondoc/timing";

let failures = 0;

function check(cond: boolean, message: string) {
  if (!cond) {
    failures++;
    console.error(`  FAIL ${message}`);
  }
}

for (const example of EXAMPLES) {
  const { doc } = example;
  console.log(`\n${example.id}`);
  const result = motionDocToHyperframes(doc);
  const { html, stats } = result;

  /* Stage attributes match meta. */
  check(
    html.includes(`data-width="${doc.meta.width}"`) &&
      html.includes(`data-height="${doc.meta.height}"`) &&
      html.includes(`data-fps="${doc.meta.fps}"`),
    "stage data attributes match meta",
  );

  /* Total duration attribute. */
  const totalSec = (totalDurationInFrames(doc) / doc.meta.fps)
    .toFixed(4)
    .replace(/\.?0+$/, "");
  check(
    html.includes(`data-duration="${totalSec}"`),
    `stage data-duration is ${totalSec}`,
  );

  /* One scene div per scene, at the derived global starts. */
  const starts = computeSceneStarts(doc);
  doc.scenes.forEach((scene, i) => {
    const startSec = (starts[i] / doc.meta.fps).toFixed(4).replace(/\.?0+$/, "") || "0";
    check(
      html.includes(`id="scene-${i}" data-start="${startSec}"`),
      `scene ${i} (${scene.name}) starts at ${startSec}s`,
    );
  });

  /* Keyframe tween count = total segments (kfs - 1 per track). */
  const expectedSegments = doc.scenes.reduce(
    (n, s) =>
      n +
      s.elements.reduce(
        (m, e) =>
          m + e.tracks.reduce((k, t) => k + (t.keyframes.length - 1), 0),
        0,
      ),
    0,
  );
  check(
    stats.keyframeTweens === expectedSegments,
    `keyframe tweens ${stats.keyframeTweens} == expected segments ${expectedSegments}`,
  );

  /* Every element got a base gsap.set. */
  const elementCount = doc.scenes.reduce((n, s) => n + s.elements.length, 0);
  const setCount = (html.match(/gsap\.set\("#s\d+-e\d+"/g) ?? []).length;
  check(
    setCount === elementCount,
    `base gsap.set count ${setCount} == elements ${elementCount}`,
  );

  /* Timeline registration present. */
  check(
    html.includes("window.__timelines["),
    "paused timeline registered on window.__timelines",
  );

  console.log(
    `  ok · ${stats.keyframeTweens} keyframe tweens · ${stats.sceneTweens} scene transitions · ${result.notes.length} notes`,
  );
}

/* Materialize one export for manual hyperframes preview/lint. */
const outDir = path.join(process.cwd(), "exports", "hyperframes", "check");
mkdirSync(outDir, { recursive: true });
const twoSystems = motionDocToHyperframes(EXAMPLES[0].doc);
writeFileSync(path.join(outDir, "index.html"), twoSystems.html, "utf8");
console.log(`\nWrote ${path.join(outDir, "index.html")} for manual preview.`);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("Exporter checks green.");

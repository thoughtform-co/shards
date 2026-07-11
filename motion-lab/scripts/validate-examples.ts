/*
 * Structural validation of the bundled example docs — run via
 * `npm run validate:examples`. Schema parsing already happens in
 * lib/examples/index.ts at import time; this script layers the
 * invariants the schema alone can't express and prints a summary.
 */

import { EXAMPLES } from "../lib/examples";
import {
  computeSceneStarts,
  overlapIn,
  totalDurationInFrames,
  totalDurationInSeconds,
} from "../lib/motiondoc/timing";
import type { MotionDoc } from "../lib/motiondoc/schema";

let failures = 0;

function check(cond: boolean, message: string) {
  if (!cond) {
    failures++;
    console.error(`  FAIL ${message}`);
  }
}

function validateDoc(doc: MotionDoc) {
  const ids = new Set<string>();
  const registerId = (id: string, where: string) => {
    check(!ids.has(id), `duplicate id "${id}" (${where})`);
    ids.add(id);
  };

  doc.scenes.forEach((scene, si) => {
    registerId(scene.id, `scene ${si}`);
    const prev = doc.scenes[si - 1];
    if (si > 0 && scene.transitionIn.type === "crossfade") {
      check(
        overlapIn(scene, prev) > 0,
        `scene "${scene.name}" crossfade collapsed to zero overlap`,
      );
    }

    scene.elements.forEach((el) => {
      registerId(el.id, `element "${el.name}"`);
      const seenProps = new Set<string>();
      el.tracks.forEach((track) => {
        check(
          !seenProps.has(track.property),
          `element "${el.name}" has duplicate track for "${track.property}"`,
        );
        seenProps.add(track.property);

        let lastFrame = -1;
        track.keyframes.forEach((kf) => {
          registerId(kf.id, `keyframe on ${el.name}.${track.property}`);
          check(
            kf.frame > lastFrame,
            `keyframes on "${el.name}".${track.property} not strictly sorted at frame ${kf.frame}`,
          );
          lastFrame = kf.frame;
          check(
            kf.frame >= 0 && kf.frame <= scene.durationInFrames,
            `keyframe at ${kf.frame} outside scene "${scene.name}" (0..${scene.durationInFrames})`,
          );
          if (kf.ease === "spring") {
            check(
              kf.spring !== undefined,
              `spring keyframe on "${el.name}".${track.property} missing spring config (defaults would apply, but examples should be explicit)`,
            );
          }
        });
      });
    });
  });
}

for (const example of EXAMPLES) {
  const { doc } = example;
  console.log(`\n${example.id} — "${doc.meta.title}"`);
  validateDoc(doc);

  const starts = computeSceneStarts(doc);
  const frames = totalDurationInFrames(doc);
  const seconds = totalDurationInSeconds(doc);
  const elementCount = doc.scenes.reduce((n, s) => n + s.elements.length, 0);
  const keyframeCount = doc.scenes.reduce(
    (n, s) =>
      n +
      s.elements.reduce(
        (m, e) => m + e.tracks.reduce((k, t) => k + t.keyframes.length, 0),
        0,
      ),
    0,
  );

  console.log(
    `  ${doc.meta.width}x${doc.meta.height} @ ${doc.meta.fps}fps · ${doc.scenes.length} scenes · ${elementCount} elements · ${keyframeCount} keyframes`,
  );
  console.log(
    `  scene starts [${starts.join(", ")}] · total ${frames}f = ${seconds.toFixed(2)}s`,
  );
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll examples valid.");

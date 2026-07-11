import assert from "node:assert/strict";

import { EXAMPLES } from "../lib/examples";
import { motionDocToHyperframes } from "../lib/export/motionDocToHyperframes";
import { parseMotionDoc } from "../lib/motiondoc/migrate";
import { shiftElementInTime, trimElement } from "../lib/motiondoc/mutate";

const legacy = structuredClone(EXAMPLES[0].doc) as unknown as Record<string, unknown>;
legacy.version = 1;
delete legacy.assets;
for (const scene of legacy.scenes as Record<string, unknown>[]) {
  for (const element of scene.elements as Record<string, unknown>[]) {
    delete element.inFrame;
    delete element.outFrame;
    delete element.visible;
    delete element.locked;
  }
}

const migrated = parseMotionDoc(legacy);
assert.equal(migrated.version, 2);
assert.deepEqual(migrated.assets, []);
migrated.scenes.forEach((scene) =>
  scene.elements.forEach((element) => {
    assert.equal(element.inFrame, 0);
    assert.equal(element.outFrame, scene.durationInFrames);
    assert.equal(element.visible, true);
    assert.equal(element.locked, false);
  }),
);

const scene = migrated.scenes[0];
const element = scene.elements[0];
const originalFrames = element.tracks.flatMap((track) =>
  track.keyframes.map((keyframe) => keyframe.frame),
);
const trimmed = trimElement(
  migrated,
  scene.id,
  element.id,
  "out",
  scene.durationInFrames - 10,
);
const shifted = shiftElementInTime(trimmed, scene.id, element.id, 5);
const shiftedElement = shifted.scenes[0].elements[0];
assert.equal(shiftedElement.inFrame, 5);
assert.equal(shiftedElement.outFrame, scene.durationInFrames - 5);
assert.deepEqual(
  shiftedElement.tracks.flatMap((track) =>
    track.keyframes.map((keyframe) => keyframe.frame),
  ),
  originalFrames.map((frame) => frame + 5),
);

const hf = motionDocToHyperframes(shifted);
assert.match(hf.html, /data-start="0\.1667"/);
assert.match(hf.html, /data-duration=/);
assert.equal(hf.stats.keyframeTweens > 0, true);

console.log("MotionDoc v2 migration, layer timing, and HyperFrames translation checks passed.");

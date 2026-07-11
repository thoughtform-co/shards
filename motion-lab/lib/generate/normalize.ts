import type { GenScene } from "../motiondoc/schema";

/*
 * Silent, harmless repairs on generated scenes before validation:
 * sort keyframes, clamp frames into the scene, collapse same-frame
 * duplicates (last wins). Anything beyond this is a real error and
 * surfaces to the caller.
 */
export function normalizeGenScene(scene: GenScene): GenScene {
  return {
    ...scene,
    elements: scene.elements.map((el) => ({
      ...el,
      tracks: el.tracks
        .map((track) => {
          const clamped = track.keyframes.map((kf) => ({
            ...kf,
            frame: Math.max(
              0,
              Math.min(Math.round(kf.frame), scene.durationInFrames),
            ),
          }));
          clamped.sort((a, b) => a.frame - b.frame);
          const byFrame = new Map<number, (typeof clamped)[number]>();
          for (const kf of clamped) byFrame.set(kf.frame, kf);
          return { ...track, keyframes: [...byFrame.values()] };
        })
        .filter((t) => t.keyframes.length > 0),
    })),
  };
}

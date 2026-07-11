import type { MotionDoc, Scene } from "./schema";

/*
 * All global-frame math lives here. The document itself only knows
 * scene-relative frames; every consumer (interpreter, timeline,
 * exporter) derives global positions through these functions so they
 * can never disagree.
 */

/** Crossfade overlap a scene claims against its predecessor. */
export function overlapIn(scene: Scene, prev: Scene | undefined): number {
  if (!prev || scene.transitionIn.type !== "crossfade") return 0;
  /* Clamp so a long fade can't swallow either scene entirely. */
  return Math.min(
    scene.transitionIn.durationInFrames,
    prev.durationInFrames - 1,
    scene.durationInFrames - 1,
  );
}

/** Global start frame of every scene, in order. */
export function computeSceneStarts(doc: MotionDoc): number[] {
  const starts: number[] = [];
  let cursor = 0;
  doc.scenes.forEach((scene, i) => {
    if (i === 0) {
      starts.push(0);
      cursor = scene.durationInFrames;
      return;
    }
    const start = Math.max(0, cursor - overlapIn(scene, doc.scenes[i - 1]));
    starts.push(start);
    cursor = start + scene.durationInFrames;
  });
  return starts;
}

export function totalDurationInFrames(doc: MotionDoc): number {
  const starts = computeSceneStarts(doc);
  const last = doc.scenes[doc.scenes.length - 1];
  return Math.max(1, starts[starts.length - 1] + last.durationInFrames);
}

export function totalDurationInSeconds(doc: MotionDoc): number {
  return totalDurationInFrames(doc) / doc.meta.fps;
}

/**
 * Index of the scene "in focus" at a global frame — during a
 * crossfade overlap the incoming (later) scene wins, matching what
 * the viewer perceives as current.
 */
export function sceneIndexAtFrame(doc: MotionDoc, globalFrame: number): number {
  const starts = computeSceneStarts(doc);
  let index = 0;
  for (let i = 0; i < doc.scenes.length; i++) {
    if (globalFrame >= starts[i]) index = i;
  }
  return index;
}

/** Convert a global frame to a frame local to the given scene. */
export function globalToSceneFrame(
  doc: MotionDoc,
  sceneIndex: number,
  globalFrame: number,
): number {
  const starts = computeSceneStarts(doc);
  return globalFrame - starts[sceneIndex];
}

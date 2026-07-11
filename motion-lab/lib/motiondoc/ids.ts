import type {
  GenMotionDoc,
  GenScene,
  MotionDoc,
  Scene,
  VideoFormat,
} from "./schema";

/*
 * Ids are assigned server-side after generation (the gen schemas
 * omit them — see schema.ts). Short, prefixed, random; readable in
 * exported JSON without pretending to be UUIDs.
 */
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Deep-copy a generated scene, assigning ids all the way down. */
export function withIdsScene(gen: GenScene): Scene {
  return {
    ...gen,
    id: newId("sc"),
    elements: gen.elements.map((el) => ({
      ...el,
      id: newId("el"),
      inFrame: 0,
      outFrame: gen.durationInFrames,
      visible: true,
      locked: false,
      tracks: el.tracks.map((track) => ({
        ...track,
        keyframes: track.keyframes.map((kf) => ({ ...kf, id: newId("kf") })),
      })),
    })),
  };
}

/** Assemble a full MotionDoc from Claude's output + request params. */
export function assembleDoc(
  gen: GenMotionDoc,
  opts: { format: VideoFormat; width: number; height: number; fps: number },
): MotionDoc {
  return {
    version: 2,
    meta: {
      title: gen.title,
      format: opts.format,
      width: opts.width,
      height: opts.height,
      fps: opts.fps,
      background: "$background",
    },
    brand: gen.brand,
    assets: [],
    scenes: gen.scenes.map(withIdsScene),
  };
}

import { newId } from "./ids";
import type {
  Brand,
  AnimatableProp,
  EasePreset,
  Keyframe,
  MotionDoc,
  MotionAsset,
  MotionElement,
  Scene,
  SpringConfig,
  Transition,
} from "./schema";

/*
 * Pure document mutations. Every function returns a NEW MotionDoc
 * (structuredClone + edit); the zustand store decides whether a
 * result is a transient preview or a committed history entry.
 *
 * Docs are small (budgets: ≤8 scenes, ≤6 elements, ≤6 keyframes per
 * track), so cloning per edit is far below any perf threshold.
 */

/** Address of a track inside a doc. */
export type TrackAddress = {
  sceneId: string;
  elementId: string;
  property: AnimatableProp;
};

function mustFindScene(doc: MotionDoc, sceneId: string): Scene {
  const scene = doc.scenes.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Scene not found: ${sceneId}`);
  return scene;
}

function mustFindElement(scene: Scene, elementId: string): MotionElement {
  const el = scene.elements.find((e) => e.id === elementId);
  if (!el) throw new Error(`Element not found: ${elementId}`);
  return el;
}

function sortKeyframes(kfs: Keyframe[]): void {
  kfs.sort((a, b) => a.frame - b.frame);
}

/* ------------------------------------------------------------------ *
 * Scenes
 * ------------------------------------------------------------------ */

export function patchScene(
  doc: MotionDoc,
  sceneId: string,
  patch: Partial<Pick<Scene, "name" | "background" | "durationInFrames">> & {
    transitionIn?: Transition;
  },
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, sceneId);
  Object.assign(scene, patch);
  if (patch.durationInFrames !== undefined) {
    scene.durationInFrames = Math.max(10, Math.round(patch.durationInFrames));
  }
  return next;
}

export function retimeScene(
  doc: MotionDoc,
  sceneId: string,
  durationInFrames: number,
): MotionDoc {
  /* Non-destructive: keyframes past the new duration are kept — the
     sampler simply never reaches them (hold-at-last semantics). */
  return patchScene(doc, sceneId, { durationInFrames });
}

export function moveScene(
  doc: MotionDoc,
  sceneId: string,
  direction: -1 | 1,
): MotionDoc {
  const next = structuredClone(doc);
  const i = next.scenes.findIndex((s) => s.id === sceneId);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= next.scenes.length) return doc;
  [next.scenes[i], next.scenes[j]] = [next.scenes[j], next.scenes[i]];
  return next;
}

export function patchMeta(
  doc: MotionDoc,
  patch: Partial<MotionDoc["meta"]>,
): MotionDoc {
  const next = structuredClone(doc);
  Object.assign(next.meta, patch);
  return next;
}

export function patchBrand(
  doc: MotionDoc,
  patch: { colors?: Partial<Brand["colors"]>; fonts?: Partial<Brand["fonts"]> },
): MotionDoc {
  const next = structuredClone(doc);
  if (patch.colors) Object.assign(next.brand.colors, patch.colors);
  if (patch.fonts) Object.assign(next.brand.fonts, patch.fonts);
  return next;
}

export function moveSceneToIndex(
  doc: MotionDoc,
  sceneId: string,
  targetIndex: number,
): MotionDoc {
  const next = structuredClone(doc);
  const index = next.scenes.findIndex((scene) => scene.id === sceneId);
  if (index < 0) return doc;
  const [scene] = next.scenes.splice(index, 1);
  next.scenes.splice(
    Math.max(0, Math.min(Math.round(targetIndex), next.scenes.length)),
    0,
    scene,
  );
  return next;
}

export function addBlankScene(doc: MotionDoc, afterSceneId?: string): MotionDoc {
  const next = structuredClone(doc);
  const afterIndex = afterSceneId
    ? next.scenes.findIndex((scene) => scene.id === afterSceneId)
    : next.scenes.length - 1;
  const scene: Scene = {
    id: newId("sc"),
    name: "New scene",
    durationInFrames: Math.max(45, next.meta.fps * 3),
    background: undefined,
    transitionIn: {
      type: next.scenes.length === 0 ? "cut" : "crossfade",
      durationInFrames: 12,
    },
    elements: [],
  };
  next.scenes.splice(Math.max(0, afterIndex + 1), 0, scene);
  return next;
}

export function duplicateScene(doc: MotionDoc, sceneId: string): MotionDoc {
  const next = structuredClone(doc);
  const i = next.scenes.findIndex((s) => s.id === sceneId);
  if (i < 0) return doc;
  const copy = structuredClone(next.scenes[i]);
  copy.id = newId("sc");
  copy.name = `${copy.name} copy`;
  copy.elements.forEach((el) => {
    el.id = newId("el");
    el.tracks.forEach((t) => t.keyframes.forEach((k) => (k.id = newId("kf"))));
  });
  next.scenes.splice(i + 1, 0, copy);
  return next;
}

export function deleteScene(doc: MotionDoc, sceneId: string): MotionDoc {
  if (doc.scenes.length <= 1) return doc; // never delete the last scene
  const next = structuredClone(doc);
  next.scenes = next.scenes.filter((s) => s.id !== sceneId);
  return next;
}

export function replaceScene(
  doc: MotionDoc,
  sceneId: string,
  scene: Scene,
): MotionDoc {
  const next = structuredClone(doc);
  const i = next.scenes.findIndex((s) => s.id === sceneId);
  if (i < 0) return doc;
  next.scenes[i] = scene;
  return next;
}

/* ------------------------------------------------------------------ *
 * Elements
 * ------------------------------------------------------------------ */

/** Loose patch across the element union; callers stay type-honest. */
export type ElementPatch = Partial<
  Omit<MotionElement, "id" | "kind" | "tracks">
> &
  Record<string, unknown>;

export function patchElement(
  doc: MotionDoc,
  sceneId: string,
  elementId: string,
  patch: ElementPatch,
): MotionDoc {
  const next = structuredClone(doc);
  const el = mustFindElement(mustFindScene(next, sceneId), elementId);
  Object.assign(el, patch);
  return next;
}

export function addElement(
  doc: MotionDoc,
  sceneId: string,
  element: MotionElement,
): MotionDoc {
  const next = structuredClone(doc);
  mustFindScene(next, sceneId).elements.push(element);
  return next;
}

export function moveElementToIndex(
  doc: MotionDoc,
  sceneId: string,
  elementId: string,
  targetIndex: number,
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, sceneId);
  const index = scene.elements.findIndex((element) => element.id === elementId);
  if (index < 0) return doc;
  const [element] = scene.elements.splice(index, 1);
  scene.elements.splice(
    Math.max(0, Math.min(Math.round(targetIndex), scene.elements.length)),
    0,
    element,
  );
  return next;
}

/** Move a complete layer bar and every keyframe by the same delta. */
export function shiftElementInTime(
  doc: MotionDoc,
  sceneId: string,
  elementId: string,
  requestedDelta: number,
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, sceneId);
  const element = mustFindElement(scene, elementId);
  const minDelta = -element.inFrame;
  const maxDelta = scene.durationInFrames - element.outFrame;
  const delta = Math.round(
    maxDelta >= minDelta
      ? Math.max(minDelta, Math.min(requestedDelta, maxDelta))
      : 0,
  );
  element.inFrame += delta;
  element.outFrame += delta;
  element.tracks.forEach((track) => {
    track.keyframes.forEach((keyframe) => {
      keyframe.frame += delta;
    });
  });
  return next;
}

export function trimElement(
  doc: MotionDoc,
  sceneId: string,
  elementId: string,
  edge: "in" | "out",
  frame: number,
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, sceneId);
  const element = mustFindElement(scene, elementId);
  if (edge === "in") {
    element.inFrame = Math.max(
      0,
      Math.min(Math.round(frame), element.outFrame - 1),
    );
  } else {
    element.outFrame = Math.max(
      element.inFrame + 1,
      Math.min(Math.round(frame), scene.durationInFrames),
    );
  }
  return next;
}

export function deleteElement(
  doc: MotionDoc,
  sceneId: string,
  elementId: string,
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, sceneId);
  scene.elements = scene.elements.filter((e) => e.id !== elementId);
  return next;
}

export function duplicateElement(
  doc: MotionDoc,
  sceneId: string,
  elementId: string,
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, sceneId);
  const i = scene.elements.findIndex((e) => e.id === elementId);
  if (i < 0) return doc;
  const copy = structuredClone(scene.elements[i]);
  copy.id = newId("el");
  copy.name = `${copy.name} copy`;
  copy.x += 40;
  copy.y += 40;
  copy.tracks.forEach((t) => t.keyframes.forEach((k) => (k.id = newId("kf"))));
  scene.elements.splice(i + 1, 0, copy);
  return next;
}

/* ------------------------------------------------------------------ *
 * Keyframes
 * ------------------------------------------------------------------ */

export function addKeyframe(
  doc: MotionDoc,
  addr: TrackAddress,
  kf: { frame: number; value: number; ease?: EasePreset; spring?: SpringConfig },
): { doc: MotionDoc; keyframeId: string } {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, addr.sceneId);
  const el = mustFindElement(scene, addr.elementId);
  let track = el.tracks.find((t) => t.property === addr.property);
  if (!track) {
    track = { property: addr.property, keyframes: [] };
    el.tracks.push(track);
  }
  const frame = Math.max(
    0,
    Math.min(Math.round(kf.frame), scene.durationInFrames),
  );
  /* AE semantics: adding on top of an existing keyframe overwrites it. */
  track.keyframes = track.keyframes.filter((k) => k.frame !== frame);
  const keyframe: Keyframe = {
    id: newId("kf"),
    frame,
    value: kf.value,
    ease: kf.ease ?? "ease-out",
    ...(kf.spring ? { spring: kf.spring } : {}),
  };
  track.keyframes.push(keyframe);
  sortKeyframes(track.keyframes);
  return { doc: next, keyframeId: keyframe.id };
}

export function moveKeyframe(
  doc: MotionDoc,
  addr: TrackAddress,
  keyframeId: string,
  newFrame: number,
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, addr.sceneId);
  const el = mustFindElement(scene, addr.elementId);
  const track = el.tracks.find((t) => t.property === addr.property);
  if (!track) return doc;
  const kf = track.keyframes.find((k) => k.id === keyframeId);
  if (!kf) return doc;
  const frame = Math.max(
    0,
    Math.min(Math.round(newFrame), scene.durationInFrames),
  );
  /* Landing exactly on a sibling overwrites it (AE semantics). Safe
     with the gesture model: transients recompute from the gesture
     snapshot, so drag-through never destroys anything until commit. */
  track.keyframes = track.keyframes.filter(
    (k) => k.id === keyframeId || k.frame !== frame,
  );
  kf.frame = frame;
  sortKeyframes(track.keyframes);
  return next;
}

export function patchKeyframe(
  doc: MotionDoc,
  addr: TrackAddress,
  keyframeId: string,
  patch: Partial<Pick<Keyframe, "value" | "ease" | "frame">> & {
    spring?: SpringConfig;
  },
): MotionDoc {
  const next = structuredClone(doc);
  const scene = mustFindScene(next, addr.sceneId);
  const el = mustFindElement(scene, addr.elementId);
  const track = el.tracks.find((t) => t.property === addr.property);
  if (!track) return doc;
  const kf = track.keyframes.find((k) => k.id === keyframeId);
  if (!kf) return doc;
  Object.assign(kf, patch);
  if (patch.frame !== undefined) {
    kf.frame = Math.max(
      0,
      Math.min(Math.round(patch.frame), scene.durationInFrames),
    );
    track.keyframes = track.keyframes.filter(
      (k) => k.id === keyframeId || k.frame !== kf.frame,
    );
    sortKeyframes(track.keyframes);
  }
  return next;
}

export function deleteKeyframe(
  doc: MotionDoc,
  addr: TrackAddress,
  keyframeId: string,
): MotionDoc {
  const next = structuredClone(doc);
  const el = mustFindElement(
    mustFindScene(next, addr.sceneId),
    addr.elementId,
  );
  const track = el.tracks.find((t) => t.property === addr.property);
  if (!track) return doc;
  track.keyframes = track.keyframes.filter((k) => k.id !== keyframeId);
  /* An empty track is meaningless — drop it so the base value rules. */
  if (track.keyframes.length === 0) {
    el.tracks = el.tracks.filter((t) => t !== track);
  }
  return next;
}

export function removeTrack(doc: MotionDoc, addr: TrackAddress): MotionDoc {
  const next = structuredClone(doc);
  const el = mustFindElement(
    mustFindScene(next, addr.sceneId),
    addr.elementId,
  );
  el.tracks = el.tracks.filter((t) => t.property !== addr.property);
  return next;
}

/**
 * Editor transform rule: tracked properties edit the value at the current
 * frame; untracked properties edit the static base value.
 */
export function setElementPropertyAtFrame(
  doc: MotionDoc,
  addr: TrackAddress,
  frame: number,
  value: number,
): MotionDoc {
  const scene = doc.scenes.find((item) => item.id === addr.sceneId);
  const element = scene?.elements.find((item) => item.id === addr.elementId);
  const hasTrack = element?.tracks.some(
    (track) => track.property === addr.property,
  );
  if (hasTrack) {
    return addKeyframe(doc, addr, { frame, value }).doc;
  }
  return patchElement(doc, addr.sceneId, addr.elementId, {
    [addr.property]: value,
  });
}

/* ------------------------------------------------------------------ *
 * Assets
 * ------------------------------------------------------------------ */

export function upsertAssets(doc: MotionDoc, assets: MotionAsset[]): MotionDoc {
  const next = structuredClone(doc);
  const byHash = new Map(next.assets.map((asset) => [asset.sha256, asset]));
  assets.forEach((asset) => byHash.set(asset.sha256, asset));
  next.assets = [...byHash.values()];
  return next;
}

export function isAssetReferenced(doc: MotionDoc, assetId: string): boolean {
  return doc.scenes.some((scene) =>
    scene.elements.some(
      (element) =>
        (element.kind === "image" && element.assetId === assetId) ||
        (element.kind === "text" && element.fontAssetId === assetId),
    ),
  );
}

export function removeAsset(doc: MotionDoc, assetId: string): MotionDoc {
  if (isAssetReferenced(doc, assetId)) return doc;
  const next = structuredClone(doc);
  next.assets = next.assets.filter((asset) => asset.id !== assetId);
  return next;
}

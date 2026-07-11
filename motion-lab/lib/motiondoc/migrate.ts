import { motionDocSchema, type MotionDoc } from "./schema";

/**
 * Upgrade JSON-authored v1 documents to the asset-aware, layer-timed v2
 * shape. The migration is intentionally additive: ids, ordering, keyframes,
 * image URLs, and brand font roles are preserved verbatim.
 */
export function migrateMotionDoc(input: unknown): unknown {
  if (!input || typeof input !== "object") return input;
  const raw = structuredClone(input) as Record<string, unknown>;
  if (raw.version !== 1 && raw.version !== 2) return raw;

  const scenes = Array.isArray(raw.scenes) ? raw.scenes : [];
  raw.version = 2;
  raw.assets = Array.isArray(raw.assets) ? raw.assets : [];
  raw.scenes = scenes.map((sceneValue) => {
    if (!sceneValue || typeof sceneValue !== "object") return sceneValue;
    const scene = sceneValue as Record<string, unknown>;
    const duration =
      typeof scene.durationInFrames === "number"
        ? Math.max(1, Math.round(scene.durationInFrames))
        : 1;
    const elements = Array.isArray(scene.elements) ? scene.elements : [];
    scene.elements = elements.map((elementValue) => {
      if (!elementValue || typeof elementValue !== "object") return elementValue;
      const element = elementValue as Record<string, unknown>;
      element.inFrame =
        typeof element.inFrame === "number" ? Math.max(0, Math.round(element.inFrame)) : 0;
      element.outFrame =
        typeof element.outFrame === "number"
          ? Math.max(Number(element.inFrame) + 1, Math.round(element.outFrame))
          : duration;
      element.visible = typeof element.visible === "boolean" ? element.visible : true;
      element.locked = typeof element.locked === "boolean" ? element.locked : false;
      return element;
    });
    return scene;
  });
  return raw;
}

export function parseMotionDoc(input: unknown): MotionDoc {
  return motionDocSchema.parse(migrateMotionDoc(input));
}

export function safeParseMotionDoc(input: unknown) {
  return motionDocSchema.safeParse(migrateMotionDoc(input));
}

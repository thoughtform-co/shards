import { z } from "zod";

/*
 * MotionDoc — the engine-neutral source of truth for a video.
 *
 * One JSON document describes scenes, elements, and keyframed
 * animation. Everything else in Motion Lab is a projection of it:
 * the Remotion interpreter renders it, the timeline edits it, the
 * HyperFrames exporter translates it, and Claude generates it.
 *
 * Two schema families live here:
 *   - App schemas (`motionDocSchema`, ...) — every entity carries an
 *     `id`, which the timeline uses for selection and mutation.
 *   - Gen schemas (`genMotionDocSchema`, ...) — the same shapes with
 *     ids omitted. Claude's structured output validates against
 *     these; the server assigns ids afterwards (`ids.ts`). Keeping
 *     ids out of generation saves tokens and removes a whole class
 *     of "model invented colliding ids" bugs.
 *
 * Structured-output constraints shaped this schema: no open records
 * (`z.record`) and no recursion — hence the fixed brand token keys.
 *
 * Frames are SCENE-RELATIVE. Global positions are derived in
 * `timing.ts`; nothing in the document stores a global frame.
 * The `ease` on a keyframe describes the approach INTO it from the
 * previous keyframe (After Effects' "ease into this keyframe"
 * mental model). The first keyframe's ease is ignored.
 */

export const easePresetSchema = z.enum([
  "linear",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "overshoot",
  "spring",
]);
export type EasePreset = z.infer<typeof easePresetSchema>;

export const springConfigSchema = z.object({
  damping: z.number().min(1).max(50).default(12),
  stiffness: z.number().min(10).max(400).default(100),
  mass: z.number().min(0.1).max(10).default(1),
});
export type SpringConfig = z.infer<typeof springConfigSchema>;

export const animatablePropSchema = z.enum([
  "x",
  "y",
  "scale",
  "rotation",
  "opacity",
]);
export type AnimatableProp = z.infer<typeof animatablePropSchema>;

export const ANIMATABLE_PROPS = animatablePropSchema.options;

/* ------------------------------------------------------------------ *
 * Keyframes & tracks
 * ------------------------------------------------------------------ */

const keyframeFields = {
  /** Scene-relative frame. */
  frame: z.number().int().min(0),
  value: z.number(),
  /** How the value approaches THIS keyframe from the previous one. */
  ease: easePresetSchema.default("ease-out"),
  /** Only read when ease === "spring". */
  spring: springConfigSchema.optional(),
} as const;

export const keyframeSchema = z.object({ id: z.string(), ...keyframeFields });
export type Keyframe = z.infer<typeof keyframeSchema>;

const genKeyframeSchema = z.object(keyframeFields);
export type GenKeyframe = z.infer<typeof genKeyframeSchema>;

export const trackSchema = z.object({
  property: animatablePropSchema,
  /** Kept sorted by frame; mutations re-sort. */
  keyframes: z.array(keyframeSchema).min(1),
});
export type Track = z.infer<typeof trackSchema>;

const genTrackSchema = z.object({
  property: animatablePropSchema,
  keyframes: z.array(genKeyframeSchema).min(1),
});

/* ------------------------------------------------------------------ *
 * Elements
 * ------------------------------------------------------------------ */

export const transformOriginSchema = z.enum([
  "center",
  "left",
  "right",
  "top",
  "bottom",
]);
export type TransformOrigin = z.infer<typeof transformOriginSchema>;

/*
 * Colors are either raw CSS ("#1A1612", "rgba(...)") or a brand token
 * reference ("$accent") resolved through `colors.ts`.
 */
const colorValue = z.string();

const elementBaseFields = {
  name: z.string(),
  /** Center position on the canvas, in px. */
  x: z.number(),
  y: z.number(),
  scale: z.number().default(1),
  /** Degrees. */
  rotation: z.number().default(0),
  opacity: z.number().min(0).max(1).default(1),
  transformOrigin: transformOriginSchema.default("center"),
} as const;

const textFields = {
  kind: z.literal("text"),
  text: z.string(),
  fontSize: z.number().min(8),
  /** Resolved through brand.fonts. */
  font: z.enum(["heading", "body", "mono"]).default("heading"),
  fontWeight: z.number().default(600),
  color: colorValue.default("$text"),
  align: z.enum(["left", "center", "right"]).default("center"),
  /** Wrapping width in px; omit for a single line. */
  maxWidth: z.number().optional(),
  /** Em units, e.g. 0.08 for spaced-out eyebrows. */
  letterSpacing: z.number().optional(),
} as const;

const shapeFields = {
  kind: z.literal("shape"),
  /** A line is a thin rect (+ rotation). */
  shape: z.enum(["rect", "ellipse"]),
  width: z.number().min(1),
  height: z.number().min(1),
  fill: colorValue.default("$accent"),
  /** Corner radius in px (rect only). */
  radius: z.number().default(0),
} as const;

const imageFields = {
  kind: z.literal("image"),
  /** Absolute URL or "/assets/…" (motion-lab/public/assets). */
  src: z.string(),
  width: z.number().min(1),
  height: z.number().min(1),
  fit: z.enum(["contain", "cover"]).default("contain"),
  radius: z.number().default(0),
} as const;

export const textElementSchema = z.object({
  id: z.string(),
  ...elementBaseFields,
  ...textFields,
  tracks: z.array(trackSchema).default([]),
});
export const shapeElementSchema = z.object({
  id: z.string(),
  ...elementBaseFields,
  ...shapeFields,
  tracks: z.array(trackSchema).default([]),
});
export const imageElementSchema = z.object({
  id: z.string(),
  ...elementBaseFields,
  ...imageFields,
  tracks: z.array(trackSchema).default([]),
});

export const elementSchema = z.discriminatedUnion("kind", [
  textElementSchema,
  shapeElementSchema,
  imageElementSchema,
]);
export type TextElement = z.infer<typeof textElementSchema>;
export type ShapeElement = z.infer<typeof shapeElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type MotionElement = z.infer<typeof elementSchema>;

const genTextElementSchema = z.object({
  ...elementBaseFields,
  ...textFields,
  tracks: z.array(genTrackSchema).default([]),
});
const genShapeElementSchema = z.object({
  ...elementBaseFields,
  ...shapeFields,
  tracks: z.array(genTrackSchema).default([]),
});
const genImageElementSchema = z.object({
  ...elementBaseFields,
  ...imageFields,
  tracks: z.array(genTrackSchema).default([]),
});
const genElementSchema = z.discriminatedUnion("kind", [
  genTextElementSchema,
  genShapeElementSchema,
  genImageElementSchema,
]);

/* ------------------------------------------------------------------ *
 * Scenes
 * ------------------------------------------------------------------ */

export const transitionSchema = z.object({
  type: z.enum(["cut", "crossfade"]).default("cut"),
  /** Overlap length in frames; ignored for cut. */
  durationInFrames: z.number().int().min(1).default(12),
});
export type Transition = z.infer<typeof transitionSchema>;

const sceneFields = {
  name: z.string(),
  durationInFrames: z.number().int().min(10),
  /** Scene background fill; falls back to doc meta.background. */
  background: colorValue.optional(),
  /** How this scene enters relative to the previous one. */
  transitionIn: transitionSchema.default({ type: "cut", durationInFrames: 12 }),
} as const;

export const sceneSchema = z.object({
  id: z.string(),
  ...sceneFields,
  /** Array order = paint order (last on top). */
  elements: z.array(elementSchema).default([]),
});
export type Scene = z.infer<typeof sceneSchema>;

export const genSceneSchema = z.object({
  ...sceneFields,
  elements: z.array(genElementSchema).default([]),
});
export type GenScene = z.infer<typeof genSceneSchema>;

/* ------------------------------------------------------------------ *
 * Brand & document
 * ------------------------------------------------------------------ */

export const brandSchema = z.object({
  /* Fixed keys — structured outputs reject open records. */
  colors: z.object({
    background: z.string(),
    surface: z.string(),
    primary: z.string(),
    accent: z.string(),
    text: z.string(),
    muted: z.string(),
  }),
  /** CSS font stacks. */
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string(),
  }),
});
export type Brand = z.infer<typeof brandSchema>;
export type BrandColorToken = keyof Brand["colors"];

export const formatSchema = z.enum(["16:9", "9:16", "1:1", "custom"]);
export type VideoFormat = z.infer<typeof formatSchema>;

export const metaSchema = z.object({
  title: z.string(),
  format: formatSchema,
  width: z.number().int().min(16),
  height: z.number().int().min(16),
  fps: z.number().int().min(1).max(60).default(30),
  background: colorValue.default("$background"),
});
export type MotionMeta = z.infer<typeof metaSchema>;

export const motionDocSchema = z.object({
  version: z.literal(1),
  meta: metaSchema,
  brand: brandSchema,
  scenes: z.array(sceneSchema).min(1),
});
export type MotionDoc = z.infer<typeof motionDocSchema>;

/*
 * What Claude returns: title + brand + scenes. The server owns meta
 * (format/size/fps come from the request) and id assignment.
 */
export const genMotionDocSchema = z.object({
  title: z.string(),
  brand: brandSchema,
  scenes: z.array(genSceneSchema).min(1),
});
export type GenMotionDoc = z.infer<typeof genMotionDocSchema>;

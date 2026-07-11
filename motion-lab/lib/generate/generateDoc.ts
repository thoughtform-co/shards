import { assembleDoc } from "../motiondoc/ids";
import { DEFAULT_FPS, FORMAT_PRESETS } from "../motiondoc/presets";
import {
  genMotionDocSchema,
  motionDocSchema,
  type Brand,
  type MotionDoc,
  type VideoFormat,
} from "../motiondoc/schema";

import { normalizeGenScene } from "./normalize";

export type GenerateInput = {
  brief: string;
  format: Exclude<VideoFormat, "custom">;
  durationSeconds: number;
  brand?: Brand;
};

export class GenerationError extends Error {
  constructor(
    message: string,
    readonly status: number = 422,
  ) {
    super(message);
  }
}

function buildUserPrompt(input: GenerateInput): string {
  const { width, height } = FORMAT_PRESETS[input.format];
  const targetFrames = Math.round(input.durationSeconds * DEFAULT_FPS);
  const brandBlock = input.brand
    ? `Brand tokens (echo EXACTLY into brand):\n${JSON.stringify(input.brand, null, 2)}`
    : "No brand tokens provided — design a palette and font stacks that fit the brief.";

  return [
    `Canvas: ${width}×${height} px (${input.format}) at ${DEFAULT_FPS}fps.`,
    `Target duration: ~${input.durationSeconds}s ≈ ${targetFrames} frames (scene durations minus crossfade overlaps should sum to this ±10%).`,
    brandBlock,
    `Brief:\n${input.brief.trim()}`,
  ].join("\n\n");
}

export async function generateMotionDoc(
  input: GenerateInput,
): Promise<MotionDoc> {
  /* Deferred import avoids a circular module edge (structured.ts
     imports GenerationError from this file). */
  const { callWithSchema } = await import("./structured");

  const { width, height } = FORMAT_PRESETS[input.format];

  const gen = await callWithSchema({
    schema: genMotionDocSchema,
    toolName: "emit_motion_doc",
    toolDescription:
      "Return the complete motion doc for the brief: title, brand tokens, and every scene with elements, tracks, and keyframes.",
    userPrompt: buildUserPrompt(input),
    maxTokens: 16000,
  });

  const normalized = {
    ...gen,
    scenes: gen.scenes.map(normalizeGenScene),
  };

  const doc = assembleDoc(normalized, {
    format: input.format,
    width,
    height,
    fps: DEFAULT_FPS,
  });

  /* Belt-and-braces validation of the assembled document. */
  const parsed = motionDocSchema.safeParse(doc);
  if (!parsed.success) {
    throw new GenerationError(
      `Generated doc failed validation: ${parsed.error.issues
        .slice(0, 5)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
      502,
    );
  }
  return parsed.data;
}

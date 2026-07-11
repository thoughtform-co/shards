import { withIdsScene } from "../motiondoc/ids";
import {
  genSceneSchema,
  type MotionDoc,
  type Scene,
} from "../motiondoc/schema";

import { GenerationError } from "./generateDoc";
import { normalizeGenScene } from "./normalize";
import { callWithSchema } from "./structured";

/*
 * Per-scene revision: the whole-doc context rides along as summaries,
 * only the target scene is regenerated. Iteration never destroys
 * accepted work in other scenes.
 */
export async function reviseScene(opts: {
  doc: MotionDoc;
  sceneId: string;
  note: string;
}): Promise<Scene> {
  const { doc, sceneId, note } = opts;
  const index = doc.scenes.findIndex((s) => s.id === sceneId);
  if (index < 0) throw new GenerationError("Unknown scene", 404);
  const scene = doc.scenes[index];

  /* Strip ids — the gen schema has none and they'd only be noise. */
  const stripped = {
    ...scene,
    id: undefined,
    elements: scene.elements.map((el) => ({
      ...el,
      id: undefined,
      tracks: el.tracks.map((t) => ({
        ...t,
        keyframes: t.keyframes.map(({ id: _id, ...kf }) => kf),
      })),
    })),
  };

  const neighbors = doc.scenes
    .map((s, i) =>
      i === index
        ? `${i + 1}. [THIS ONE] ${s.name}`
        : `${i + 1}. ${s.name} (${s.durationInFrames}f, ${s.elements.length} elements)`,
    )
    .join("\n");

  const userPrompt = [
    `Video: "${doc.meta.title}" — ${doc.meta.width}×${doc.meta.height} @ ${doc.meta.fps}fps.`,
    `Brand tokens (keep):\n${JSON.stringify(doc.brand)}`,
    `Scene sequence:\n${neighbors}`,
    `Current scene ${index + 1} JSON:\n${JSON.stringify(stripped, null, 2)}`,
    `Revision note from the designer:\n${note.trim()}`,
    `Return ONLY the revised scene via the tool. Keep everything that works; change only what the note asks. Same duration unless the note asks otherwise.`,
  ].join("\n\n");

  const gen = await callWithSchema({
    schema: genSceneSchema,
    toolName: "emit_scene",
    toolDescription:
      "Return the single revised scene: name, duration, transition, and all elements with tracks and keyframes.",
    userPrompt,
    maxTokens: 8000,
  });

  return withIdsScene(normalizeGenScene(gen));
}

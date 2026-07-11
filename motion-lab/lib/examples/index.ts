import { z } from "zod";

import {
  brandSchema,
  genSceneSchema,
  metaSchema,
  motionDocSchema,
  type GenScene,
  type MotionDoc,
  type Scene,
} from "../motiondoc/schema";

import logoSting from "./logo-sting.json";
import statPunch from "./stat-punch.json";
import twoSystemsSync from "./two-systems-sync.json";

/*
 * Example files are authored WITHOUT ids (the gen-scene shape plus a
 * meta/brand wrapper) to stay readable as teaching material. Ids are
 * assigned here deterministically from the path (sc0, sc0-el2,
 * sc0-el2-x-k1) so reloads and localStorage autosaves stay stable.
 */

const exampleFileSchema = z.object({
  version: z.literal(1),
  meta: metaSchema,
  brand: brandSchema,
  scenes: z.array(genSceneSchema).min(1),
});

function withStableIds(scene: GenScene, si: number): Scene {
  return {
    ...scene,
    id: `sc${si}`,
    elements: scene.elements.map((el, ei) => ({
      ...el,
      id: `sc${si}-el${ei}`,
      tracks: el.tracks.map((track) => ({
        ...track,
        keyframes: track.keyframes.map((kf, ki) => ({
          ...kf,
          id: `sc${si}-el${ei}-${track.property}-k${ki}`,
        })),
      })),
    })),
  };
}

function loadExample(raw: unknown): MotionDoc {
  const file = exampleFileSchema.parse(raw);
  return motionDocSchema.parse({
    version: 1,
    meta: file.meta,
    brand: file.brand,
    scenes: file.scenes.map(withStableIds),
  });
}

export type ExampleEntry = {
  id: string;
  label: string;
  blurb: string;
  doc: MotionDoc;
};

/* Parsing happens at module load — a broken example fails fast in dev
   and in `npm run validate:examples`. */
export const EXAMPLES: ExampleEntry[] = [
  {
    id: "two-systems-sync",
    label: "Two Systems Sync — 30s explainer",
    blurb:
      "Five-beat 16:9 explainer in the Exalate domain: hook, systems, sync, conflict, payoff.",
    doc: loadExample(twoSystemsSync),
  },
  {
    id: "stat-punch",
    label: "Stat Punch — 15s vertical",
    blurb: "9:16 social cut: one number, one underline, one CTA.",
    doc: loadExample(statPunch),
  },
  {
    id: "logo-sting",
    label: "Logo Sting — 6s square",
    blurb: "1:1 sting: flash, spring-in dot, wordmark, hold, fade.",
    doc: loadExample(logoSting),
  },
];

export function getExample(id: string): ExampleEntry | undefined {
  return EXAMPLES.find((e) => e.id === id);
}

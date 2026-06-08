import { scenePlanSchema } from "@/experiments/video-studio/deck-scene-plan";
import type { DeckExplainerSeriesProps } from "@/experiments/video-studio/templates/remotion/deck-series-props";

export function parseDeckSeriesInput(raw: unknown): DeckExplainerSeriesProps {
  return scenePlanSchema.parse(raw);
}

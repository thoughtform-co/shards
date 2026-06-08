"use client";

import { Series, useVideoConfig } from "remotion";
import { DeckExplainerScene } from "@/experiments/video-studio/templates/remotion/DeckExplainerScene";
import type { DeckExplainerSeriesProps } from "@/experiments/video-studio/templates/remotion/deck-series-props";

export function DeckExplainerSeries({
  title,
  brandName,
  accentColor,
  backgroundColor,
  scenes,
}: DeckExplainerSeriesProps) {
  const { fps } = useVideoConfig();

  return (
    <Series>
      {scenes.map((scene, index) => (
        <Series.Sequence
          key={`${title}-${index}-${scene.headline}`}
          durationInFrames={Math.max(30, Math.round(scene.durationSeconds * fps))}
        >
          <DeckExplainerScene
            {...scene}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
            brandName={brandName}
            sceneIndex={index}
            sceneCount={scenes.length}
          />
        </Series.Sequence>
      ))}
    </Series>
  );
}

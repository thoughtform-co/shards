import type { TemplateInputProps } from "@/experiments/video-studio/types";

export type DeckExplainerProps = {
  headline: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  accentColor: string;
  backgroundColor: string;
};

export const defaultDeckExplainerProps: DeckExplainerProps = {
  headline: "Speed layer on existing work",
  bullet1: "Turn one-pagers into animated explainers",
  bullet2: "Ship branded intros without opening an NLE",
  bullet3: "Swap constants, not conversations",
  accentColor: "#C5A059",
  backgroundColor: "#050403",
};

export function resolveDeckExplainerProps(
  input: TemplateInputProps,
): DeckExplainerProps {
  return {
    headline: String(input.headline ?? defaultDeckExplainerProps.headline),
    bullet1: String(input.bullet1 ?? defaultDeckExplainerProps.bullet1),
    bullet2: String(input.bullet2 ?? defaultDeckExplainerProps.bullet2),
    bullet3: String(input.bullet3 ?? defaultDeckExplainerProps.bullet3),
    accentColor: String(
      input.accentColor ?? defaultDeckExplainerProps.accentColor,
    ),
    backgroundColor: String(
      input.backgroundColor ?? defaultDeckExplainerProps.backgroundColor,
    ),
  };
}

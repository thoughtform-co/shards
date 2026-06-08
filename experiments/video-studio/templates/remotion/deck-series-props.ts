import type { TemplateInputProps } from "@/experiments/video-studio/types";

export type ExplainerScene = {
  headline: string;
  bullets: string[];
  durationSeconds: number;
};

export type DeckExplainerSeriesProps = {
  title: string;
  brandName: string;
  accentColor: string;
  backgroundColor: string;
  scenes: ExplainerScene[];
};

export const defaultDeckExplainerSeriesProps: DeckExplainerSeriesProps = {
  title: "Monizze × Centrale des Marchés",
  brandName: "Monizze",
  accentColor: "#E8521F",
  backgroundColor: "#110F09",
  scenes: [
    {
      headline: "Employee benefits, simplified",
      bullets: [
        "Meal vouchers, eco-vouchers, and flexible compensation on one platform",
        "95,000+ Belgian companies already trust Monizze",
        "Digital ordering in minutes — zero paperwork",
      ],
      durationSeconds: 5,
    },
    {
      headline: "The brief: a promo that missed",
      bullets: [
        "Centrale des Marchés needed a clear employer-facing video",
        "The first cut was flat — too much talking, not enough structure",
        "We rebuild from the deck, not from scratch",
      ],
      durationSeconds: 5,
    },
    {
      headline: "Deck → explainer in one pass",
      bullets: [
        "Upload the PowerPoint — Claude reads slide structure",
        "Each slide becomes a timed scene with headline + bullets",
        "Preview live, render to MP4 locally",
      ],
      durationSeconds: 5,
    },
  ],
};

export function totalSeriesDurationSeconds(scenes: ExplainerScene[]) {
  return scenes.reduce((total, scene) => total + scene.durationSeconds, 0);
}

export function totalSeriesDurationFrames(
  scenes: ExplainerScene[],
  fps: number,
) {
  return Math.max(1, Math.round(totalSeriesDurationSeconds(scenes) * fps));
}

function normalizeScene(raw: unknown): ExplainerScene {
  if (!raw || typeof raw !== "object") {
    return {
      headline: "Scene",
      bullets: ["Key point"],
      durationSeconds: 4,
    };
  }

  const record = raw as Record<string, unknown>;
  const bullets = Array.isArray(record.bullets)
    ? record.bullets.map((bullet) => String(bullet)).filter(Boolean).slice(0, 4)
    : [];

  return {
    headline: String(record.headline ?? "Scene"),
    bullets: bullets.length > 0 ? bullets : ["Key point"],
    durationSeconds: Math.min(
      12,
      Math.max(2, Number(record.durationSeconds ?? 4)),
    ),
  };
}

export function resolveDeckSeriesProps(
  input: TemplateInputProps | Record<string, unknown>,
): DeckExplainerSeriesProps {
  const record = input as Record<string, unknown>;

  if (Array.isArray(record.scenes)) {
    const scenes = record.scenes.map(normalizeScene);

    return {
      title: String(record.title ?? defaultDeckExplainerSeriesProps.title),
      brandName: String(
        record.brandName ?? defaultDeckExplainerSeriesProps.brandName,
      ),
      accentColor: String(
        record.accentColor ?? defaultDeckExplainerSeriesProps.accentColor,
      ),
      backgroundColor: String(
        record.backgroundColor ?? defaultDeckExplainerSeriesProps.backgroundColor,
      ),
      scenes:
        scenes.length > 0
          ? scenes
          : defaultDeckExplainerSeriesProps.scenes,
    };
  }

  return defaultDeckExplainerSeriesProps;
}

export function deckSeriesPropsToInput(
  props: DeckExplainerSeriesProps,
): Record<string, unknown> {
  return {
    title: props.title,
    brandName: props.brandName,
    accentColor: props.accentColor,
    backgroundColor: props.backgroundColor,
    scenes: props.scenes,
  };
}

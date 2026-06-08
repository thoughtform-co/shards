import { z } from "zod";

export const sceneSchema = z.object({
  headline: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1).max(4),
  durationSeconds: z.number().min(2).max(12),
});

export const scenePlanSchema = z.object({
  title: z.string().min(1),
  brandName: z.string().min(1),
  accentColor: z.string().min(1),
  backgroundColor: z.string().min(1),
  scenes: z.array(sceneSchema).min(1).max(12),
});

export type ExplainerScene = z.infer<typeof sceneSchema>;
export type DeckScenePlan = z.infer<typeof scenePlanSchema>;

export type DeckAnalysisResult = {
  scenePlan: DeckScenePlan;
  source: "live" | "mock";
  slideCount: number;
};

export const monizzeDefaultScenePlan: DeckScenePlan = {
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
    {
      headline: "Ship the next version by lunch",
      bullets: [
        "Swap copy and colors per client without reopening the timeline",
        "Same template, different employer — batch-ready",
        "AI as speed layer on work you already have",
      ],
      durationSeconds: 5,
    },
  ],
};

import Anthropic from "@anthropic-ai/sdk";
import {
  monizzeDefaultScenePlan,
  scenePlanSchema,
  type DeckAnalysisResult,
  type DeckScenePlan,
} from "@/experiments/video-studio/deck-scene-plan";
import type { ParsedPptx } from "@/experiments/video-studio/server/parsePptx";
import { env } from "@/lib/env";

export type { DeckAnalysisResult, DeckScenePlan, ExplainerScene } from "@/experiments/video-studio/deck-scene-plan";
export { monizzeDefaultScenePlan, scenePlanSchema };

function extractJsonPayload(text: string) {
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return text;
  }

  return text.slice(startIndex, endIndex + 1);
}

function buildDeterministicScenePlan(parsed: ParsedPptx): DeckScenePlan {
  const scenes = parsed.slides.slice(0, 10).map((slide) => ({
    headline: slide.title,
    bullets:
      slide.lines.length > 0
        ? slide.lines.slice(0, 4)
        : ["Key point from this slide"],
    durationSeconds: 4,
  }));

  return {
    title: parsed.slides[0]?.title ?? "Deck explainer",
    brandName: "Monizze",
    accentColor: "#E8521F",
    backgroundColor: "#110F09",
    scenes:
      scenes.length > 0 ? scenes : monizzeDefaultScenePlan.scenes,
  };
}

function formatSlidesForPrompt(parsed: ParsedPptx) {
  return parsed.slides
    .map((slide, index) => {
      const lines =
        slide.lines.length > 0
          ? slide.lines.map((line) => `  - ${line}`).join("\n")
          : "  - (no body text)";

      return `Slide ${index + 1}: ${slide.title}\n${lines}`;
    })
    .join("\n\n");
}

export async function analyzeDeck(
  parsed: ParsedPptx,
  options: { clientHint?: string } = {},
): Promise<DeckAnalysisResult> {
  const apiKey = env().ANTHROPIC_API_KEY;

  if (!apiKey || parsed.slides.length === 0) {
    return {
      scenePlan:
        parsed.slides.length > 0
          ? buildDeterministicScenePlan(parsed)
          : monizzeDefaultScenePlan,
      source: "mock",
      slideCount: parsed.slideCount,
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const clientHint = options.clientHint ?? "Monizze employer benefits";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1800,
      temperature: 0.4,
      system: [
        "You turn PowerPoint slide text into a multi-scene explainer video plan.",
        "Return JSON only with keys: title, brandName, accentColor, backgroundColor, scenes.",
        "Each scene needs headline, bullets (2-4 short strings), durationSeconds (3-6).",
        "Write punchy marketing copy suitable for a 16:9 animated explainer.",
        "Keep headlines short. Bullets should read well on screen.",
        "Use accentColor #E8521F and backgroundColor #110F09 when the deck is Monizze-related.",
      ].join(" "),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: [
                `Client context: ${clientHint}`,
                "Convert these slides into an explainer scene plan. Return JSON only.",
                "",
                formatSlidesForPrompt(parsed),
              ].join("\n"),
            },
          ],
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const parsedPlan = scenePlanSchema.parse(
      JSON.parse(extractJsonPayload(textBlock?.text ?? "")),
    );

    return {
      scenePlan: parsedPlan,
      source: "live",
      slideCount: parsed.slideCount,
    };
  } catch {
    return {
      scenePlan: buildDeterministicScenePlan(parsed),
      source: "mock",
      slideCount: parsed.slideCount,
    };
  }
}

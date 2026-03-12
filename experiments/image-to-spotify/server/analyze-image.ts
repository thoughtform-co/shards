import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { env } from "@/lib/env";

const analysisSchema = z.object({
  playlistTitle: z.string().min(1),
  objectiveDescription: z.string().min(1),
  vibeDescription: z.string().min(1),
  artistSeeds: z.array(z.string().min(1)).min(3).max(6),
});

export type ImageSeedAnalysis = z.infer<typeof analysisSchema> & {
  source: "live" | "mock";
};

export type SupportedMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

type AnalyzeImageInput = {
  base64: string;
  mimeType: SupportedMimeType;
};

const mockPresets = [
  {
    playlistTitle: "Chrome After Midnight",
    objectiveDescription:
      "The image reads as high-contrast and composed, with a strong focal subject and deliberate styling cues.",
    vibeDescription:
      "It feels like someone arriving late to the party with exactly the right jacket and a better playlist than everyone else. Sleek, a little nocturnal, and fully aware of its own silhouette.",
    artistSeeds: ["Romy", "KAYTRANADA", "Roosevelt", "Sault", "The Internet"],
  },
  {
    playlistTitle: "Neon Film Strip",
    objectiveDescription:
      "The frame suggests saturated color, direct visual attitude, and a clear emphasis on mood over realism.",
    vibeDescription:
      "This one lands somewhere between campus TV glamour and jukebox daydream. It has a performative energy: bright lights, quick cuts, and a wink right into the lens.",
    artistSeeds: ["Magdalena Bay", "SG Lewis", "Charli xcx", "L'Impératrice", "Rina Sawayama"],
  },
  {
    playlistTitle: "Soft Flash, Loud Heart",
    objectiveDescription:
      "The photo presents softer visual cues with a human-centered composition and a readable emotional tone.",
    vibeDescription:
      "The mood feels warm, intimate, and slightly sentimental, like the song you queue when everybody else has left and the room suddenly sounds bigger.",
    artistSeeds: ["Clairo", "Blood Orange", "Men I Trust", "Ravyn Lenae", "Steve Lacy"],
  },
];

export async function analyzeImageToPlaylistSeeds({
  base64,
  mimeType,
}: AnalyzeImageInput): Promise<ImageSeedAnalysis> {
  const apiKey = env().ANTHROPIC_API_KEY;

  if (!apiKey) {
    return buildMockAnalysis(base64);
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      temperature: 0.8,
      system: [
        "You are a playful music curator inside a retro jukebox.",
        "Analyze an uploaded photo and imagine what playlist it deserves.",
        "Treat the task as creative interpretation, not identity inference.",
        "Base your response on visible cues like colors, styling, framing, lighting, posture, environment, and overall mood.",
        "Return JSON only with keys: playlistTitle, objectiveDescription, vibeDescription, artistSeeds.",
        "objectiveDescription should be concise and visual, without naming sensitive traits.",
        "vibeDescription should be vivid, funny, and musically suggestive.",
        "artistSeeds should contain 4 to 6 globally searchable artist names.",
      ].join(" "),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Read this image like a jukebox operator and return the JSON payload only.",
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const parsed = analysisSchema.parse(
      JSON.parse(extractJsonPayload(textBlock?.text ?? "")),
    );

    return {
      ...parsed,
      artistSeeds: uniqueArtistSeeds(parsed.artistSeeds),
      source: "live",
    };
  } catch {
    return buildMockAnalysis(base64);
  }
}

function buildMockAnalysis(seed: string): ImageSeedAnalysis {
  const preset = mockPresets[seed.length % mockPresets.length];

  return {
    ...preset,
    artistSeeds: uniqueArtistSeeds(preset.artistSeeds),
    source: "mock",
  };
}

function uniqueArtistSeeds(seeds: string[]) {
  return Array.from(new Set(seeds.map((seed) => seed.trim()).filter(Boolean))).slice(
    0,
    5,
  );
}

function extractJsonPayload(text: string) {
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return text;
  }

  return text.slice(startIndex, endIndex + 1);
}

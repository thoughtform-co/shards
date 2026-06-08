import { readFile } from "node:fs/promises";
import { analyzeDeck } from "@/experiments/video-studio/server/analyzeDeck";
import { parsePptx } from "@/experiments/video-studio/server/parsePptx";

const pptxPath =
  "C:/Users/buyss/Dropbox/03_Thoughtform/03_Canon/09_Loop Earplugs/02_Strategies/_Claude/Getting Started With Claude.pptx";

async function main() {
  const buffer = await readFile(pptxPath);
  const parsed = await parsePptx(buffer);
  const analysis = await analyzeDeck(parsed);

  console.log(
    JSON.stringify(
      {
        slideCount: parsed.slideCount,
        firstSlides: parsed.slides.slice(0, 3),
        sceneCount: analysis.scenePlan.scenes.length,
        source: analysis.source,
        firstScene: analysis.scenePlan.scenes[0],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

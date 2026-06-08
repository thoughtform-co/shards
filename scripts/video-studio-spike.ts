import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderHyperframesTemplate } from "../experiments/video-studio/server/renderHyperframes";
import { renderRemotionTemplate } from "../experiments/video-studio/server/renderRemotion";
import { ensureWorkspace } from "../experiments/video-studio/server/workspace";

async function main() {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
  process.chdir(root);

  const outDir = path.join(root, ".video-studio", "spike");

  await ensureWorkspace();
  await mkdir(outDir, { recursive: true });

  console.log("Rendering Remotion deck-explainer spike…");
  await renderRemotionTemplate({
    templateId: "deck-explainer",
    input: {
      headline: "Spike render OK",
      bullet1: "Remotion preview path verified",
      bullet2: "Constants-first props",
      bullet3: "Local MP4 output",
      accentColor: "#C5A059",
      backgroundColor: "#050403",
    },
    outputPath: path.join(outDir, "remotion-spike.mp4"),
    onProgress: (progress, message) => {
      console.log(`  remotion ${Math.round(progress * 100)}% · ${message}`);
    },
  });

  console.log("Rendering HyperFrames interview-captioner spike…");
  await renderHyperframesTemplate({
    templateId: "interview-captioner",
    sessionId: "spike",
    input: {
      brandName: "Video Studio",
      presenterName: "Spike Test",
      presenterTitle: "Local Render",
      accentColor: "#C5A059",
      captions:
        "0:00|HyperFrames spike render\n0:03|Preview and MP4 path verified",
      durationSeconds: 8,
    },
    outputPath: path.join(outDir, "hyperframes-spike.mp4"),
    onProgress: (progress, message) => {
      console.log(`  hyperframes ${Math.round(progress * 100)}% · ${message}`);
    },
  });

  console.log("Spike complete:");
  console.log(`  ${path.join(outDir, "remotion-spike.mp4")}`);
  console.log(`  ${path.join(outDir, "hyperframes-spike.mp4")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

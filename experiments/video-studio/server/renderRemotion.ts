import { writeFile } from "node:fs/promises";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { remotionProjectDir } from "@/experiments/video-studio/server/compileRemotionComposition";
import type { DeckScenePlan } from "@/experiments/video-studio/deck-scene-plan";
import { getTemplateById } from "@/experiments/video-studio/templates";
import { resolveDeckExplainerProps } from "@/experiments/video-studio/templates/remotion/deck-explainer-props";
import {
  resolveDeckSeriesProps,
} from "@/experiments/video-studio/templates/remotion/deck-series-props";
import { resolveSocialVariantProps } from "@/experiments/video-studio/templates/remotion/social-variant-props";
import type { TemplateInputProps } from "@/experiments/video-studio/types";
import type { DeckExplainerSeriesProps } from "@/experiments/video-studio/templates/remotion/deck-series-props";

const entryPoint = path.join(
  process.cwd(),
  "experiments",
  "video-studio",
  "templates",
  "remotion",
  "Root.tsx",
);

declare global {
  var __videoStudioRemotionBundle: string | undefined;
}

async function getServeUrl() {
  if (globalThis.__videoStudioRemotionBundle) {
    return globalThis.__videoStudioRemotionBundle;
  }

  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => {
      config.resolve = config.resolve ?? {};
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "@": path.resolve(process.cwd()),
      };
      return config;
    },
  });

  globalThis.__videoStudioRemotionBundle = serveUrl;
  return serveUrl;
}

function resolveInputProps(
  templateId: string,
  input: TemplateInputProps | DeckExplainerSeriesProps | Record<string, unknown>,
) {
  if (templateId === "deck-explainer") {
    return resolveDeckExplainerProps(input as TemplateInputProps);
  }

  if (templateId === "deck-explainer-series") {
    return resolveDeckSeriesProps(input);
  }

  if (templateId === "social-variant-set") {
    return resolveSocialVariantProps(input as TemplateInputProps);
  }

  return input;
}

export async function renderRemotionTemplate(options: {
  templateId: string;
  input: TemplateInputProps | DeckExplainerSeriesProps | Record<string, unknown>;
  outputPath: string;
  onProgress?: (progress: number, message: string) => void;
}) {
  const template = getTemplateById(options.templateId);

  if (!template?.compositionId) {
    throw new Error(`Unknown Remotion template: ${options.templateId}`);
  }

  const serveUrl = await getServeUrl();
  const inputProps = resolveInputProps(options.templateId, options.input);

  const composition = await selectComposition({
    serveUrl,
    id: template.compositionId,
    inputProps,
  });

  options.onProgress?.(0.08, "Bundled Remotion composition");

  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    outputLocation: options.outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      options.onProgress?.(
        0.1 + progress * 0.9,
        `Rendering Remotion frame ${Math.round(progress * 100)}%`,
      );
    },
  });
}

export async function materializeRemotionBundleForDev() {
  await getServeUrl();
}

const AGENT_COMPOSITION_ID = "agent-deck";

/* Renders a Claude-authored Remotion composition from the session's
   compiled draft. The session dir already contains Composition.tsx;
   we drop a Root.tsx next to it that imports + registers a single
   Composition, then bundle + renderMedia just like the template path. */
export async function renderAgentRemotionDraft(options: {
  sessionId: string;
  scenePlan: DeckScenePlan;
  outputPath: string;
  width?: number;
  height?: number;
  fps?: number;
  onProgress?: (progress: number, message: string) => void;
}) {
  const width = options.width ?? 1920;
  const height = options.height ?? 1080;
  const fps = options.fps ?? 30;

  const totalSeconds = options.scenePlan.scenes.reduce(
    (sum, s) => sum + s.durationSeconds,
    0,
  );
  const durationInFrames = Math.max(1, Math.round(totalSeconds * fps));

  const projectDir = remotionProjectDir(options.sessionId);
  const rootPath = path.join(projectDir, "Root.tsx");

  // The default props must be the SAME plan the live preview used so
  // selectComposition picks the right duration when calculateMetadata
  // doesn't fire. We inline them as JSON.
  const defaultProps = {
    title: options.scenePlan.title,
    brandName: options.scenePlan.brandName,
    accentColor: options.scenePlan.accentColor,
    backgroundColor: options.scenePlan.backgroundColor,
    scenes: options.scenePlan.scenes,
  };

  const rootSource = `import { Composition, registerRoot } from "remotion";
import AgentComposition from "./Composition";

const defaultProps = ${JSON.stringify(defaultProps, null, 2)};

export const RemotionRoot = () => (
  <Composition
    id=${JSON.stringify(AGENT_COMPOSITION_ID)}
    component={AgentComposition}
    durationInFrames={${durationInFrames}}
    fps={${fps}}
    width={${width}}
    height={${height}}
    defaultProps={defaultProps}
  />
);

registerRoot(RemotionRoot);
`;

  await writeFile(rootPath, rootSource, "utf8");

  options.onProgress?.(0.08, "Bundling agent Remotion composition");

  const serveUrl = await bundle({
    entryPoint: rootPath,
    webpackOverride: (config) => {
      config.resolve = config.resolve ?? {};
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "@": path.resolve(process.cwd()),
      };
      return config;
    },
  });

  const composition = await selectComposition({
    serveUrl,
    id: AGENT_COMPOSITION_ID,
    inputProps: defaultProps,
  });

  options.onProgress?.(0.18, "Rendering Remotion composition");

  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    outputLocation: options.outputPath,
    inputProps: defaultProps,
    onProgress: ({ progress }) => {
      options.onProgress?.(
        0.2 + progress * 0.8,
        `Rendering frame ${Math.round(progress * 100)}%`,
      );
    },
  });

  options.onProgress?.(1, "Remotion render complete");
}

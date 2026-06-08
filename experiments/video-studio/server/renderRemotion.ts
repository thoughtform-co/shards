import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { getTemplateById } from "@/experiments/video-studio/templates";
import { resolveDeckExplainerProps } from "@/experiments/video-studio/templates/remotion/deck-explainer-props";
import { resolveSocialVariantProps } from "@/experiments/video-studio/templates/remotion/social-variant-props";
import type { TemplateInputProps } from "@/experiments/video-studio/types";

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

function resolveInputProps(templateId: string, input: TemplateInputProps) {
  if (templateId === "deck-explainer") {
    return resolveDeckExplainerProps(input);
  }

  if (templateId === "social-variant-set") {
    return resolveSocialVariantProps(input);
  }

  return input;
}

export async function renderRemotionTemplate(options: {
  templateId: string;
  input: TemplateInputProps;
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

import { cp, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { getTemplateById } from "@/experiments/video-studio/templates";
import {
  composeHyperframesProjectHtml,
  getHyperframesTemplateDir,
} from "@/experiments/video-studio/server/composeHtml";
import {
  compiledProjectDir,
  ensureWorkspace,
} from "@/experiments/video-studio/server/workspace";
import type { TemplateInputProps } from "@/experiments/video-studio/types";

function runCommand(args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, {
      cwd,
      stdio: "inherit",
      shell: true,
      windowsHide: true,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`npx ${args.join(" ")} exited with code ${code}`));
    });
  });
}

export async function prepareHyperframesProject(options: {
  templateId: string;
  sessionId: string;
  input: TemplateInputProps;
  assetPaths?: Record<string, string>;
  assetPublicUrls?: Record<string, string>;
}) {
  await ensureWorkspace();

  const projectDir = compiledProjectDir(options.templateId, options.sessionId);
  await mkdir(projectDir, { recursive: true });

  const assetUrls: Record<string, string> = {};

  if (options.assetPaths?.videoAsset) {
    const assetsDir = path.join(projectDir, "assets");
    await mkdir(assetsDir, { recursive: true });
    const target = path.join(assetsDir, "footage.mp4");
    await cp(options.assetPaths.videoAsset, target);
    assetUrls.videoAssetUrl = "./assets/footage.mp4";
  } else if (options.assetPublicUrls?.videoAssetUrl) {
    assetUrls.videoAssetUrl = options.assetPublicUrls.videoAssetUrl;
  } else {
    assetUrls.videoAssetUrl = "";
  }

  const html = await composeHyperframesProjectHtml(
    options.templateId,
    options.input,
    assetUrls,
  );

  await writeFile(path.join(projectDir, "index.html"), html, "utf8");
  await writeFile(
    path.join(projectDir, "meta.json"),
    JSON.stringify(
      {
        name: options.templateId,
        id: options.sessionId,
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    "utf8",
  );

  const templateDir = getHyperframesTemplateDir(options.templateId);
  const assetsSource = path.join(templateDir, "assets");

  try {
    await cp(assetsSource, path.join(projectDir, "assets"), {
      recursive: true,
      force: true,
    });
  } catch {
    // Optional static assets directory.
  }

  return projectDir;
}

export async function renderHyperframesTemplate(options: {
  templateId: string;
  sessionId: string;
  input: TemplateInputProps;
  outputPath: string;
  assetPaths?: Record<string, string>;
  onProgress?: (progress: number, message: string) => void;
}) {
  const template = getTemplateById(options.templateId);

  if (!template) {
    throw new Error(`Unknown HyperFrames template: ${options.templateId}`);
  }

  const projectDir = await prepareHyperframesProject({
    templateId: options.templateId,
    sessionId: options.sessionId,
    input: options.input,
    assetPaths: options.assetPaths,
  });

  options.onProgress?.(0.08, "Prepared HyperFrames project");

  const npx = process.platform === "win32" ? "npx.cmd" : "npx";

  options.onProgress?.(0.12, "Linting composition");
  await runCommand(["hyperframes", "lint", "--non-interactive"], projectDir).catch(
    () => {
      // Lint warnings should not block draft renders in the studio tool.
    },
  );

  options.onProgress?.(0.18, "Rendering with HyperFrames CLI");

  const localOutput = path.join(projectDir, "output.mp4");
  await runCommand(
    ["hyperframes", "render", "--output", "output.mp4", "--non-interactive"],
    projectDir,
  );

  await cp(localOutput, options.outputPath);

  options.onProgress?.(1, "HyperFrames render complete");
}

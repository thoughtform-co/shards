import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
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

const DECK_TEMPLATE_ID = "deck-explainer-series";

type CommandResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

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

/** Captures stdout/stderr instead of streaming them. Used by the agent's
    fix loop so we can hand lint/validate output back to Claude as text. */
function captureCommand(args: string[], cwd: string): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ exitCode: code ?? 0, stdout, stderr });
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

/** Sets up a HyperFrames project directory from a raw HTML string instead
    of a template file. Used by the deck animator (Phase 3) — the agent or
    the deterministic generator hands us full HTML and we write it as-is. */
export async function prepareHyperframesProjectFromHtml(options: {
  templateId: string;
  sessionId: string;
  html: string;
  /** Optional human-readable label written to meta.json for debugging. */
  projectName?: string;
}) {
  await ensureWorkspace();

  const projectDir = compiledProjectDir(options.templateId, options.sessionId);
  await mkdir(projectDir, { recursive: true });

  await writeFile(path.join(projectDir, "index.html"), options.html, "utf8");
  await writeFile(
    path.join(projectDir, "meta.json"),
    JSON.stringify(
      {
        name: options.projectName ?? options.templateId,
        id: options.sessionId,
        createdAt: new Date().toISOString(),
        source: "agent",
      },
      null,
      2,
    ),
    "utf8",
  );

  return projectDir;
}

/** Convenience wrapper for the deck animator. Always uses the
    `deck-explainer-series` template id so the resulting project dir is
    findable by the composition-draft preview route. */
export function deckProjectDir(sessionId: string) {
  return compiledProjectDir(DECK_TEMPLATE_ID, sessionId);
}

export async function writeDeckDraft(sessionId: string, html: string) {
  return prepareHyperframesProjectFromHtml({
    templateId: DECK_TEMPLATE_ID,
    sessionId,
    html,
    projectName: `Deck explainer · ${sessionId}`,
  });
}

export async function readDeckDraft(sessionId: string): Promise<string | null> {
  const projectDir = deckProjectDir(sessionId);
  try {
    return await readFile(path.join(projectDir, "index.html"), "utf8");
  } catch {
    return null;
  }
}

export async function lintHyperframesProject(projectDir: string) {
  return captureCommand(
    ["hyperframes", "lint", "--non-interactive", "--json"],
    projectDir,
  );
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

/** Renders an already-prepared agent draft to MP4. The project must have
    been written by `writeDeckDraft` (or `prepareHyperframesProjectFromHtml`)
    before this is called — the draft store IS the source of truth. */
export async function renderDeckDraft(options: {
  sessionId: string;
  outputPath: string;
  onProgress?: (progress: number, message: string) => void;
}) {
  const projectDir = deckProjectDir(options.sessionId);

  options.onProgress?.(0.1, "Linting agent composition");
  await runCommand(["hyperframes", "lint", "--non-interactive"], projectDir).catch(
    () => {
      // Already validated at animate-time; treat lint warnings as non-fatal here.
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

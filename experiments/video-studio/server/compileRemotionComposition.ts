import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as esbuild from "esbuild";
import {
  compiledProjectDir,
  ensureWorkspace,
} from "@/experiments/video-studio/server/workspace";

const REMOTION_TEMPLATE_ID = "remotion";

export type CompileSuccess = {
  ok: true;
  sessionId: string;
  projectDir: string;
  sourcePath: string;
  modulePath: string;
  bytes: number;
};

export type CompileFailure = {
  ok: false;
  sessionId: string;
  sourcePath: string;
  /** Multi-line summary suitable for showing to the user / re-prompting the agent. */
  error: string;
};

export type CompileResult = CompileSuccess | CompileFailure;

export function remotionProjectDir(sessionId: string) {
  return compiledProjectDir(REMOTION_TEMPLATE_ID, sessionId);
}

/** Writes the agent's TSX to disk and compiles it to ESM that the studio
    can dynamically import. React + Remotion stay external so the loaded
    module shares identity with the parent page's React (hooks/context). */
export async function compileRemotionComposition(options: {
  tsxSource: string;
  sessionId: string;
}): Promise<CompileResult> {
  await ensureWorkspace();

  const projectDir = remotionProjectDir(options.sessionId);
  await mkdir(projectDir, { recursive: true });

  const sourcePath = path.join(projectDir, "Composition.tsx");
  const modulePath = path.join(projectDir, "Composition.mjs");

  await writeFile(sourcePath, options.tsxSource, "utf8");

  try {
    const result = await esbuild.build({
      entryPoints: [sourcePath],
      outfile: modulePath,
      bundle: true,
      format: "esm",
      target: "es2022",
      platform: "browser",
      jsx: "automatic",
      jsxImportSource: "react",
      // React and Remotion stay external — at runtime the import map
      // resolves them to shim routes that re-export the parent page's
      // instances. This is what preserves hook + context identity.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "remotion",
      ],
      logLevel: "silent",
      sourcemap: false,
      legalComments: "none",
      // Plain string literal — no env-var inlining since the agent's
      // composition is sandboxed and shouldn't touch process.env.
      define: { "process.env.NODE_ENV": '"production"' },
    });

    const warnings = result.warnings.map(formatMessage).join("\n");

    let bytes = 0;
    try {
      const { stat } = await import("node:fs/promises");
      const info = await stat(modulePath);
      bytes = info.size;
    } catch {
      // Ignore — bytes is only used for logging.
    }

    return {
      ok: true,
      sessionId: options.sessionId,
      projectDir,
      sourcePath,
      modulePath,
      bytes,
      // Warnings are surfaced via console only; they don't fail compile.
      ...(warnings ? { warnings } : {}),
    } as CompileSuccess;
  } catch (error) {
    return {
      ok: false,
      sessionId: options.sessionId,
      sourcePath,
      error: formatEsbuildError(error),
    };
  }
}

function formatMessage(msg: esbuild.Message): string {
  const loc = msg.location
    ? ` (${path.basename(msg.location.file)}:${msg.location.line}:${msg.location.column})`
    : "";
  return `${msg.text}${loc}`;
}

function formatEsbuildError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return String(error);
  }
  const errs = (error as { errors?: esbuild.Message[] }).errors;
  if (Array.isArray(errs) && errs.length > 0) {
    return errs.map(formatMessage).join("\n");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { safeParseMotionDoc } from "../motiondoc/migrate";
import type { MotionDoc } from "../motiondoc/schema";

import type {
  WorkspacePaths,
  WorkspaceProjectResponse,
  WorkspaceValidationResponse,
} from "./types";

export type WorkspaceReadResult =
  | { state: "missing"; paths: WorkspacePaths }
  | { state: "valid"; project: WorkspaceProjectResponse }
  | { state: "invalid"; validation: WorkspaceValidationResponse };

export type WorkspaceWriteResult =
  | { state: "written"; project: WorkspaceProjectResponse }
  | { state: "conflict"; current: WorkspaceReadResult };

function revisionOf(content: string | Uint8Array): string {
  return createHash("sha256").update(content).digest("hex");
}

export function workspacePaths(root = process.cwd()): WorkspacePaths {
  const workspace = path.join(root, "workspace");
  return {
    root,
    workspace,
    project: path.join(workspace, "project.motion.json"),
    assets: path.join(root, "public", "assets", "uploads"),
  };
}

export async function readWorkspaceProject(root = process.cwd()): Promise<WorkspaceReadResult> {
  const paths = workspacePaths(root);
  let bytes: Buffer;
  try {
    bytes = await readFile(paths.project);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { state: "missing", paths };
    }
    throw error;
  }

  const revision = revisionOf(bytes);
  let raw: unknown;
  try {
    raw = JSON.parse(bytes.toString("utf8"));
  } catch {
    return {
      state: "invalid",
      validation: {
        error: "Workspace project is not valid JSON",
        revision,
        paths,
      },
    };
  }

  const parsed = safeParseMotionDoc(raw);
  if (!parsed.success) {
    return {
      state: "invalid",
      validation: {
        error: "Workspace project does not match MotionDoc v2",
        revision,
        paths,
        issues: parsed.error.issues.slice(0, 12).map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    };
  }

  const fileStat = await stat(paths.project);
  return {
    state: "valid",
    project: {
      doc: parsed.data,
      revision,
      updatedAt: fileStat.mtimeMs,
      paths,
    },
  };
}

export async function writeWorkspaceProject({
  doc,
  expectedRevision,
  force = false,
  root = process.cwd(),
}: {
  doc: MotionDoc;
  expectedRevision?: string;
  force?: boolean;
  root?: string;
}): Promise<WorkspaceWriteResult> {
  const parsed = safeParseMotionDoc(doc);
  if (!parsed.success) {
    throw new Error(`Refusing to write invalid MotionDoc: ${parsed.error.issues[0]?.message}`);
  }

  const current = await readWorkspaceProject(root);
  const currentRevision =
    current.state === "valid"
      ? current.project.revision
      : current.state === "invalid"
        ? current.validation.revision
        : undefined;
  if (!force && expectedRevision !== undefined && expectedRevision !== currentRevision) {
    return { state: "conflict", current };
  }

  const paths = workspacePaths(root);
  const content = `${JSON.stringify(parsed.data, null, 2)}\n`;
  const revision = revisionOf(content);
  if (current.state === "valid" && current.project.revision === revision) {
    return { state: "written", project: current.project };
  }

  await mkdir(paths.workspace, { recursive: true });
  const temporary = path.join(paths.workspace, `.project.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, content, { encoding: "utf8", flag: "wx" });
    await rename(temporary, paths.project);
  } catch (error) {
    await unlink(temporary).catch(() => undefined);
    throw error;
  }
  const fileStat = await stat(paths.project);
  return {
    state: "written",
    project: {
      doc: parsed.data,
      revision,
      updatedAt: fileStat.mtimeMs,
      paths,
    },
  };
}

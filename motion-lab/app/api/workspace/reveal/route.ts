import { spawn } from "node:child_process";

import { workspacePaths } from "../../../../lib/workspace/server";

export const runtime = "nodejs";

export async function POST() {
  const target = workspacePaths().root;
  const command =
    process.platform === "win32"
      ? { executable: "explorer.exe", args: [target] }
      : process.platform === "darwin"
        ? { executable: "open", args: [target] }
        : { executable: "xdg-open", args: [target] };
  try {
    const child = spawn(command.executable, command.args, {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return Response.json({ ok: true, path: target });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not reveal workspace" },
      { status: 500 },
    );
  }
}

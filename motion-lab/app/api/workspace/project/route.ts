import type { MotionDoc } from "../../../../lib/motiondoc/schema";
import {
  readWorkspaceProject,
  writeWorkspaceProject,
} from "../../../../lib/workspace/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function etag(revision: string) {
  return `"${revision}"`;
}

export async function GET(request: Request) {
  const result = await readWorkspaceProject();
  if (result.state === "missing") {
    return Response.json(
      { error: "Workspace project does not exist", paths: result.paths },
      { status: 404 },
    );
  }
  if (result.state === "invalid") {
    return Response.json(result.validation, { status: 422 });
  }

  const tag = etag(result.project.revision);
  if (request.headers.get("if-none-match") === tag) {
    return new Response(null, { status: 304, headers: { etag: tag } });
  }
  return Response.json(result.project, {
    headers: { etag: tag, "cache-control": "no-store" },
  });
}

export async function PUT(request: Request) {
  let body: { doc?: MotionDoc; expectedRevision?: string; force?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.doc) {
    return Response.json({ error: "Missing MotionDoc" }, { status: 400 });
  }

  try {
    const result = await writeWorkspaceProject({
      doc: body.doc,
      expectedRevision: body.expectedRevision,
      force: body.force,
    });
    if (result.state === "conflict") {
      return Response.json(
        {
          error: "Workspace changed on disk",
          current: result.current.state === "valid" ? result.current.project : undefined,
        },
        { status: 409 },
      );
    }
    return Response.json(result.project, {
      headers: { etag: etag(result.project.revision), "cache-control": "no-store" },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not save workspace" },
      { status: 422 },
    );
  }
}

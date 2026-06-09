import { promises as fs } from "node:fs";
import { join } from "node:path";

import { NextResponse } from "next/server";

/*
 * /api/design/[name] · download a packaged design.md brand spec.
 *
 * Specs live in `data/design/{stem}.design.md`. The route reads them
 * off the deployed filesystem and streams them back as markdown
 * downloads. Mirrors the shape of `/api/skills/[name]` (allowlist +
 * filesystem read + content-disposition attachment) so the workshop
 * page can sit a design.md card next to the four .skill cards and
 * inherit identical posture.
 *
 * Auth posture:
 *   The proxy in `/proxy.ts` rewrites any path it matches without a
 *   valid `shards_unlock` cookie to `/login`. The proxy matcher
 *   (`/((?!_next/|favicon.ico|.*\..*).*)`) explicitly excludes paths
 *   that contain a dot, so this route — which has no extension in
 *   its URL (`/api/design/centrale-des-marches`) — falls inside the
 *   matcher and inherits the site-wide gate. No extra work needed.
 *
 * The design name is validated against a hardcoded allowlist so a
 * caller can't traverse the filesystem with `..` or fetch arbitrary
 * files from `data/`. New design specs get added by extending DESIGNS
 * below and dropping a matching `.design.md` file in `data/design/`.
 */

interface DesignBundle {
  /* Stem of the file in data/design/ — `{stem}.design.md`. */
  stem: string;
  /* Human-friendly filename the browser uses on save. */
  filename: string;
}

const DESIGNS: Record<string, DesignBundle> = {
  "centrale-des-marches": {
    stem: "centrale-des-marches",
    filename: "centrale-des-marches.design.md",
  },
};

export const runtime = "nodejs";
/* The specs are committed text files; nothing dynamic per request.
   Letting the deployment cache them keeps the workshop page snappy. */
export const dynamic = "force-static";

interface RouteContext {
  params: Promise<{ name: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { name } = await params;
  const bundle = DESIGNS[name];

  if (!bundle) {
    return NextResponse.json({ ok: false, reason: "unknown" }, { status: 404 });
  }

  const filePath = join(
    process.cwd(),
    "data",
    "design",
    `${bundle.stem}.design.md`,
  );

  let data: Buffer;
  try {
    data = await fs.readFile(filePath);
  } catch {
    return NextResponse.json(
      { ok: false, reason: "missing" },
      { status: 500 },
    );
  }

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Length": String(data.length),
      "Content-Disposition": `attachment; filename="${bundle.filename}"`,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}

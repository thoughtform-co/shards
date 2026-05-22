import { promises as fs } from "node:fs";
import { join } from "node:path";

import { NextResponse } from "next/server";

/*
 * /api/skills/[name] · download a packaged Claude Skill bundle.
 *
 * Bundles live in `data/skills/{name}.skill` (zip archives renamed
 * to `.skill`, the extension Claude.ai accepts on upload). The
 * route reads them off the deployed filesystem and streams them
 * back as binary downloads.
 *
 * Auth posture:
 *   The proxy in `/proxy.ts` rewrites any path it matches without a
 *   valid `shards_unlock` cookie to `/login`. The proxy matcher
 *   (`/((?!_next/|favicon.ico|.*\..*).*)`) explicitly excludes
 *   paths that contain a dot, so this route — which has no
 *   extension in its URL (`/api/skills/frontend-design`) — falls
 *   inside the matcher and inherits the site-wide gate. No extra
 *   work needed here: an unauthenticated visitor receives the
 *   /login page instead of the bundle.
 *
 * The skill name is validated against a hardcoded allowlist so a
 * caller can't traverse the filesystem with `..` or fetch
 * arbitrary files from `data/`. New skills get added by extending
 * SKILLS below and dropping a matching `.skill` file in
 * `data/skills/`.
 */

interface SkillBundle {
  /* Stem of the file in data/skills/ — `{stem}.skill`. */
  stem: string;
  /* Human-friendly filename the browser uses on save. */
  filename: string;
}

const SKILLS: Record<string, SkillBundle> = {
  "frontend-design": {
    stem: "frontend-design",
    filename: "frontend-design.skill",
  },
  "creating-presentations": {
    stem: "creating-presentations",
    filename: "creating-presentations.skill",
  },
  "ai-adoption-loop": {
    stem: "ai-adoption-loop",
    filename: "ai-adoption-loop.skill",
  },
  "plain-english": {
    stem: "plain-english",
    filename: "plain-english.skill",
  },
};

export const runtime = "nodejs";
/* The bundles are committed binary files; nothing dynamic per
   request. Letting the deployment cache them keeps the workshop
   page snappy. */
export const dynamic = "force-static";

interface RouteContext {
  params: Promise<{ name: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { name } = await params;
  const bundle = SKILLS[name];

  if (!bundle) {
    return NextResponse.json({ ok: false, reason: "unknown" }, { status: 404 });
  }

  const filePath = join(process.cwd(), "data", "skills", `${bundle.stem}.skill`);

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
      "Content-Type": "application/zip",
      "Content-Length": String(data.length),
      "Content-Disposition": `attachment; filename="${bundle.filename}"`,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}

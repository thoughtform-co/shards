import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { remotionProjectDir } from "@/experiments/video-studio/server/compileRemotionComposition";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{6,64}$/;

/* Composition.mjs is a plain ESM module imported by @remotion/player's
   lazyComponent. The browser also resolves `import 'remotion'` / `import
   'react'` from inside this module via the page's import map, which
   points at the module-shim routes. CSP needs to allow same-origin
   script execution (the global `frame-ancestors 'none'` would block the
   page if not relaxed elsewhere — see next.config.ts). */
const MODULE_HEADERS: Record<string, string> = {
  "Content-Type": "text/javascript; charset=utf-8",
  "Cache-Control": "no-store",
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { sessionId } = await params;

  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return NextResponse.json(
      { error: "Invalid session id." },
      { status: 400 },
    );
  }

  const projectDir = remotionProjectDir(sessionId);
  const modulePath = path.join(projectDir, "Composition.mjs");

  let source: string;
  try {
    source = await readFile(modulePath, "utf8");
  } catch {
    return NextResponse.json(
      { error: "Composition module not found." },
      { status: 404 },
    );
  }

  return new NextResponse(source, { headers: MODULE_HEADERS });
}

import { NextResponse } from "next/server";
import { readDeckDraft } from "@/experiments/video-studio/server/renderHyperframes";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{6,64}$/;

export async function GET(_request: Request, { params }: RouteContext) {
  const { sessionId } = await params;

  // Reject anything that doesn't look like the uuids we generate so a stray
  // path like `../../whatever` can't escape the compiled draft store.
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return NextResponse.json(
      { error: "Invalid session id." },
      { status: 400 },
    );
  }

  const html = await readDeckDraft(sessionId);

  if (!html) {
    return NextResponse.json(
      { error: "Composition draft not found." },
      { status: 404 },
    );
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

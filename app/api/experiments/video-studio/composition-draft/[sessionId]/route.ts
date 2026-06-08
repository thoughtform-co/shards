import { NextResponse } from "next/server";
import { readDeckDraft } from "@/experiments/video-studio/server/renderHyperframes";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{6,64}$/;

/* The site-wide security headers (see next.config.ts) set
   X-Frame-Options: DENY and CSP frame-ancestors 'none' — both refuse
   ALL iframe embedding for safety. The composition preview must be
   embedded in the hyperframes-player iframe on the same origin, so
   these two headers are overridden here to allow same-origin framing
   only. The composition's own CSP also has to allow inline scripts
   plus the gsap CDN so the agent-authored timeline can run. */
const IFRAME_HEADERS: Record<string, string> = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Frame-Options": "SAMEORIGIN",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "media-src 'self' blob: https:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
  ].join("; "),
};

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

  return new NextResponse(html, { headers: IFRAME_HEADERS });
}

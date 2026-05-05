import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

/*
 * POST /api/unlock — site-wide access gate.
 *
 * Reads `password` from the request body and compares it against the
 * `SITE_PASSWORD` env var with constant-time equality. On match, sets
 * the `shards_unlock` cookie (httpOnly, sameSite=lax, secure in
 * production) for 30 days and the proxy stops redirecting to /login.
 *
 * Independent of the Stripe collection gate, which uses its own
 * `stripe_unlock` cookie + `STRIPE_SITE_PASSWORD` env var.
 */

const COOKIE = "shards_unlock";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const runtime = "nodejs";

function safeCompare(provided: string, expected: string): boolean {
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  if (providedBuf.length !== expectedBuf.length) {
    /* Burn an equivalent comparison so timing reflects the longer path,
       then return false. Length is treated as non-secret. */
    timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }

  return timingSafeEqual(providedBuf, expectedBuf);
}

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as {
    password?: unknown;
  };

  const expected = process.env.SITE_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { ok: false, reason: "server-misconfigured" },
      { status: 500 },
    );
  }

  if (typeof password !== "string" || !safeCompare(password, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  (await cookies()).set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

const COOKIE = "stripe_unlock";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const runtime = "nodejs";

function safeCompare(provided: string, expected: string): boolean {
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  if (providedBuf.length !== expectedBuf.length) {
    // Burn an equivalent comparison so timing reflects the longer path,
    // then return false. Length is assumed non-secret here.
    timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }

  return timingSafeEqual(providedBuf, expectedBuf);
}

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as {
    password?: unknown;
  };

  const expected = process.env.STRIPE_SITE_PASSWORD;

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

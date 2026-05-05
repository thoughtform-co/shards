import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * POST /api/lock — clear the site access cookie.
 *
 * Mirrors the Stripe lock route. Clears `shards_unlock` so the next
 * navigation gets rewritten back to /login.
 */

const COOKIE = "shards_unlock";

export const runtime = "nodejs";

export async function POST() {
  (await cookies()).set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}

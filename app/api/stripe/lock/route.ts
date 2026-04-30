import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "stripe_unlock";

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

import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "stripe_unlock";

export function proxy(req: NextRequest) {
  const isUnlocked = req.cookies.get(COOKIE)?.value === "1";
  if (isUnlocked) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/stripe";
  url.search = "";
  url.searchParams.set(
    "next",
    req.nextUrl.pathname + (req.nextUrl.search || ""),
  );

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/link-to-collect", "/link-to-collect/:path*"],
};

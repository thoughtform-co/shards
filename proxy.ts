import { NextResponse, type NextRequest } from "next/server";

/*
 * Shards proxy (Next.js 16 middleware).
 *
 * Two gates layered on the same surface:
 *
 *  1. Stripe collection gate — `/link-to-collect/*` requires the
 *     `stripe_unlock` cookie. Locked visitors get redirected to
 *     `/stripe?next=...`, which renders its own form. Independent of
 *     the site gate below.
 *
 *  2. Site-wide gate — anything that is not in the public allowlist
 *     requires the `shards_unlock` cookie. Locked visitors get
 *     `rewrite`-d to `/login` (URL stays put, the form renders) and
 *     POST `/api/unlock` to set the cookie.
 *
 * The matcher excludes Next.js internals plus any path with a file
 * extension (covers everything in `public/`: SVGs, screenshots,
 * static HTML exports, etc.) so static assets are served without an
 * unlock check.
 */

const SITE_COOKIE = "shards_unlock";
const STRIPE_COOKIE = "stripe_unlock";

const PUBLIC_PATHS = [
  "/login",
  "/api/unlock",
  "/api/lock",
  /* The Stripe gate hosts its own form at /stripe and unlock/lock APIs
     under /api/stripe/*. They have to stay reachable without the site
     cookie so the redirect from the Stripe gate handler can land. */
  "/stripe",
  "/api/stripe/unlock",
  "/api/stripe/lock",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* 1. Stripe collection gate (kept verbatim from the previous proxy). */
  if (
    pathname === "/link-to-collect" ||
    pathname.startsWith("/link-to-collect/")
  ) {
    const isStripeUnlocked = req.cookies.get(STRIPE_COOKIE)?.value === "1";
    if (!isStripeUnlocked) {
      const url = req.nextUrl.clone();
      url.pathname = "/stripe";
      url.search = "";
      url.searchParams.set(
        "next",
        req.nextUrl.pathname + (req.nextUrl.search || ""),
      );
      return NextResponse.redirect(url);
    }
    /* If stripe-unlocked, fall through to the site gate below: the
       visitor still needs the site cookie to reach any page. */
  }

  /* 2. Site-wide gate. */
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  if (req.cookies.get(SITE_COOKIE)?.value === "1") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /* Match everything except:
       - `_next/` (build chunks, image optimisation, etc.)
       - `favicon.ico`
       - any path containing a `.` (extension-bearing files in
         `public/`: cases/*.png, *.svg, *.html, robots.txt, etc.) */
    "/((?!_next/|favicon.ico|.*\\..*).*)",
  ],
};

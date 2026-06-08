import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://cdn.jsdelivr.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.anthropic.com https://accounts.spotify.com https://api.spotify.com",
  "media-src 'self' blob: https:",
  "frame-src 'self' blob: https://open.spotify.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/* The Video Studio composition routes serve HTML that the
   hyperframes-player web component embeds in a same-origin iframe.
   The site-wide CSP `frame-ancestors 'none'` + `X-Frame-Options: DENY`
   would block that, so these two routes get a narrowly relaxed CSP
   that allows same-origin framing only. The compositions themselves
   load gsap from cdn.jsdelivr.net and run inline timelines, so the
   inline script CSP stays permissive within the iframe. */
const compositionFrameCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "media-src 'self' blob: https:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
].join("; ");

const compositionFrameHeaders = [
  { key: "Content-Security-Policy", value: compositionFrameCsp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    // esbuild ships a native binary per platform under @esbuild/<os>; we
    // don't want Turbopack/webpack to crawl into those. The animate-remotion
    // route uses it server-side only.
    "esbuild",
  ],
  turbopack: {
    root: __dirname,
  },
  /*
   * The /api/skills/[name] route reads `.skill` bundles from
   * `data/skills/` via `fs.readFile`. Because the path is
   * constructed dynamically from `process.cwd()`, Next.js's
   * automatic output file tracer can't follow it, so on Vercel
   * those files would be missing from the serverless bundle and
   * every download would 500.
   *
   * Explicitly include the bundles in the route's traced files so
   * the deployment carries them.
   *
   * Route keys are matched against the route path; the brackets in
   * `[name]` must be escaped with double-backslashes per the
   * Next.js 16 output config docs.
   */
  outputFileTracingIncludes: {
    "/api/skills/\\[name\\]": ["./data/skills/**/*"],
    "/api/experiments/video-studio/render": [
      "./experiments/video-studio/templates/**/*",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Composition routes override the global DENY so the
      // hyperframes-player can embed them in a same-origin iframe.
      // Listed AFTER the catch-all so the overrides win on duplicate
      // header keys.
      {
        source: "/api/experiments/video-studio/composition/:id",
        headers: compositionFrameHeaders,
      },
      {
        source: "/api/experiments/video-studio/composition-draft/:sessionId",
        headers: compositionFrameHeaders,
      },
      // Remotion-agent path: the compiled Composition.mjs is fetched
      // by @remotion/player's lazyComponent and the shim re-exports
      // are imported via the page's import map. Same relaxation so
      // the page can fetch + execute them on the same origin.
      {
        source:
          "/api/experiments/video-studio/composition-remotion/:sessionId/Composition.mjs",
        headers: compositionFrameHeaders,
      },
      {
        source: "/api/experiments/video-studio/module-shim/:moduleName",
        headers: compositionFrameHeaders,
      },
    ];
  },
};

export default nextConfig;

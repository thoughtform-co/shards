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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
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
    ];
  },
};

export default nextConfig;

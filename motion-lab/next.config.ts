import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  /* @remotion/bundler wraps webpack and @remotion/renderer ships a
     native compositor binary — neither survives being crawled by the
     app bundler. Same posture as the parent shards app. */
  serverExternalPackages: ["@remotion/bundler", "@remotion/renderer"],
  /* motion-lab is nested inside the shards repo, which has its own
     package.json and lockfile above this one. Pin the workspace root
     so Turbopack doesn't infer the parent as the project root. */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

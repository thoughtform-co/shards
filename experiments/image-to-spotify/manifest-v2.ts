import type { ExperimentManifest } from "@/experiments/types";

export const imageToSpotifyV2Manifest: ExperimentManifest = {
  slug: "image-to-spotify-v2",
  title: "3D Jukebox",
  strap: "Photo in. Music out. In 3D.",
  summary:
    "The next-gen jukebox: a Three.js 3D cabinet with real-time particle effects, Claude-powered vibe analysis, and Spotify preview playback.",
  status: "scaffolded",
  href: "/experiments/image-to-spotify-v2",
  tags: ["three.js", "webgl", "vision", "spotify"],
  tech: ["Next.js", "Three.js", "Anthropic", "Spotify API"],
  accentMode: "custom",
  cardAccent: {
    from: "#1a0e3d",
    via: "#6a53a0",
    to: "#ff79b5",
    glow: "rgba(122, 99, 179, 0.45)",
  },
};

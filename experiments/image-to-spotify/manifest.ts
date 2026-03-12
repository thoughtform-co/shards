import type { ExperimentManifest } from "@/experiments/types";

export const imageToSpotifyManifest: ExperimentManifest = {
  slug: "image-to-spotify",
  title: "Image to Spotify",
  strap: "Photo in. Playlist out.",
  summary:
    "A retro jukebox prototype that reads the vibe of an uploaded image and spins up a playful Spotify playlist preview.",
  status: "scaffolded",
  href: "/experiments/image-to-spotify",
  tags: ["vision", "spotify", "playlist", "prototype"],
  tech: ["Next.js", "Anthropic", "Spotify API"],
  accentMode: "custom",
  cardAccent: {
    from: "#21144f",
    via: "#114aa0",
    to: "#ef4ca8",
    glow: "rgba(98, 117, 255, 0.42)",
  },
};

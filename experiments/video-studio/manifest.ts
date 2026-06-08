import type { ExperimentManifest } from "@/experiments/types";

export const videoStudioManifest: ExperimentManifest = {
  slug: "video-studio",
  title: "Video Studio",
  strap: "Templates in. MP4 out.",
  summary:
    "A per-job router over Remotion and HyperFrames: pick a template, fill variables or upload footage, preview live, and render locally to MP4.",
  status: "live",
  href: "/experiments/video-studio",
  tags: ["remotion", "hyperframes", "video", "production"],
  tech: ["Remotion", "HyperFrames", "FFmpeg", "Next.js"],
  accentMode: "thoughtform",
  cardAccent: {
    from: "#1A1208",
    via: "#C5A059",
    to: "#7A63B3",
    glow: "rgba(197, 160, 89, 0.42)",
  },
};

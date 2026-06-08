"use client";

import dynamic from "next/dynamic";

const VideoStudio = dynamic(
  () =>
    import("@/experiments/video-studio/ui/VideoStudio").then(
      (module) => module.VideoStudio,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#f5f0e8",
          background: "#050403",
          fontFamily: "ui-monospace, monospace",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontSize: 12,
        }}
      >
        Loading Video Studio…
      </div>
    ),
  },
);

export function VideoStudioClient() {
  return <VideoStudio />;
}

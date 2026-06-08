import type { Metadata } from "next";
import { VideoStudioClient } from "@/app/experiments/video-studio/VideoStudioClient";

export const metadata: Metadata = {
  title: "Video Studio",
  description:
    "Per-job Remotion and HyperFrames interface for templated video production.",
};

export default function VideoStudioRoute() {
  return <VideoStudioClient />;
}

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
      <section className="aiop-section cw-vs cw-vs--hero">
        <div className="aiop-wrap cw-vs__inner">
          <p className="cw-vs__status">
            <span className="cw-vs__status-dot" aria-hidden="true" />
            Loading Video Studio
          </p>
        </div>
      </section>
    ),
  },
);

export function VideoStudioClient() {
  return <VideoStudio />;
}

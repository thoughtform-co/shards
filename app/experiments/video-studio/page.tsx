import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";
import Link from "next/link";

import { CreativeHud } from "@/components/creative-workshop/creative-hud";
import { VideoStudioClient } from "@/app/experiments/video-studio/VideoStudioClient";

import "@/components/landing/landing.css";
import "@/components/operator/operator.css";
import "@/app/creative-ai-workshop/creative-ai-workshop.css";
import "@/experiments/video-studio/ui/video-studio.css";

const aiopDisplay = IBM_Plex_Sans({
  variable: "--aiop-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const aiopBody = IBM_Plex_Sans({
  variable: "--aiop-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const aiopMono = PT_Mono({
  variable: "--aiop-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thoughtform · Video Studio",
  description:
    "Per-job Remotion and HyperFrames interface for templated video production.",
  robots: { index: false, follow: false },
};

export default function VideoStudioRoute() {
  return (
    <div
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-shell--tf-light aiop-stage aiop-workshop-v1`}
    >
      <CreativeHud />

      <header className="aiop-header">
        <div className="aiop-wrap aiop-header__inner">
          <Link className="aiop-brand" href="/dashboard">
            <span className="aiop-brand__mark">
              <span className="aiop-brand__diamond" aria-hidden="true" />
              <span className="aiop-brand__name">Thoughtform</span>
            </span>
            <span className="aiop-brand__sub">Video Studio</span>
          </Link>

          <Link className="aiop-button aiop-button--ghost" href="/dashboard">
            Back to dashboard
            <span className="aiop-button__arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>
      </header>

      <main>
        <VideoStudioClient />
      </main>
    </div>
  );
}

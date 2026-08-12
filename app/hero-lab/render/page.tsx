import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";

import { ConstellationOrbit } from "@/components/operator/constellation-orbit";

import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "../../creative-ai-workshop/creative-ai-workshop.css";
import "@/components/operator/hero-figure.css";
import "@/components/operator/constellation-orbit.css";
import "./render.css";

/*
 * /hero-lab/render — the C1 figure alone, on paper, framed for video.
 *
 * A capture surface, not a page: no chrome, no controls, no copy. Its
 * only job is to give `scripts/render-hero-figure.mjs` something to
 * screenshot frame by frame.
 *
 * SIZED IN CSS PIXELS AT HALF THE OUTPUT, and captured at
 * `deviceScaleFactor: 2`. A 1080x1450 viewport would put the figure at
 * roughly 940px, where every `clamp()` in the family has long since hit
 * its ceiling — the rings would scale and the type would not, and the
 * labels would render as slivers against a huge circle. At 540x725 the
 * figure sits at 470px, inside the range every number in these
 * stylesheets was tuned against, and the 2x raster does the enlarging.
 * The video is pixel-identical to the web figure, twice the size.
 *
 * The cycle runs at 15s here rather than 16s, so two of them come to
 * exactly 30 seconds. See the note in the render script.
 */

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
  title: "Thoughtform · Hero figure render",
  robots: { index: false, follow: false },
};

export default function HeroRenderPage() {
  return (
    <div
      className={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable} aiop-shell aiop-shell--tf-light aiop-stage aiop-workshop-v1 tf-render`}
    >
      <div className="tf-render__stage">
        <ConstellationOrbit loop labels="named" />
      </div>
    </div>
  );
}

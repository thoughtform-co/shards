import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Mono } from "next/font/google";

import { HeroLab } from "./hero-lab";

import "@/components/operator/operator.css";
import "@/components/intelligence-layer/intelligence-layer.css";
import "../creative-ai-workshop/creative-ai-workshop.css";
/* Only for the palette toggle. Its rules are scoped to
   `.aiop-shell--tf-light.aiop-shell--plopsa`, so importing the whole
   Plopsa remap here is inert until the toggle puts that class on the
   root — and it means the toggle shows the REAL client palette rather
   than an approximation of it. */
import "../plopsa-ai-workshop/plopsa-workshop.css";
import "@/components/operator/hero-figure.css";
import "@/components/operator/aperture-orbit.css";
import "@/components/operator/quatrefoil-orbit.css";
import "@/components/operator/constellation-orbit.css";
import "@/components/operator/nested-orbits.css";
import "./hero-lab.css";

/*
 * /hero-lab — three candidate hero figures, judged side by side.
 *
 * SETTLED: `<ConstellationOrbit loop labels="named" />` — the "C1"
 * panel — now runs in the hero on both `/ai-keynote` and
 * `/plopsa-ai-workshop`. This route stays as the record of what it was
 * chosen over and as the place to judge any change to it, since nothing
 * else on the site lets you scrub a 16s morph frame by frame.
 *
 * WHY IT EXISTED. The hero figure had been drifting between two
 * subjects. `/ai-keynote` ran `<FlywheelOrbit bloom />`, the most
 * elegant thing on the site but a drawing of the METHOD (Navigate,
 * Encode, Build). `/plopsa-ai-workshop` ran `<ConfigurationOrbit loop />`,
 * which drew the right subject — one intelligence configuration — but
 * resolved into four long captions floating on two rings, and four
 * captions is a framework checklist rather than a mark.
 *
 * The three candidates here all draw the configuration, all keep the
 * morph that makes the family recognisable (the black Loop brandmark
 * opens into a figure of other circles and folds back on a 16s cycle),
 * and all carry one centre word and no captions. They differ only in
 * the argument they make about what a configuration is. See
 * `components/operator/hero-figure.ts`.
 *
 * Gated: `proxy.ts` allowlists only `/login` and the unlock APIs, so
 * this sits behind the `shards_unlock` cookie like every other route.
 * The `robots` block is belt and braces.
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
  title: "Thoughtform · Hero figure lab",
  description: "Three candidate hero figures for the intelligence configuration.",
  robots: { index: false, follow: false },
};

export default function HeroLabPage() {
  return (
    <HeroLab
      fontClassName={`${aiopDisplay.variable} ${aiopBody.variable} ${aiopMono.variable}`}
    />
  );
}

import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./ai-operator.css";

/*
 * Route-local layout for the AI Operator landing.
 *
 * The Shards root layout sets `color-scheme: dark` on `:root` and a dark
 * radial gradient on `body`. This route is light, retrofuturist, and
 * Aether-adjacent, so it owns its own type pairing and lifts a "paper"
 * stage over the body's dark background using `.aiop-stage`.
 *
 * Type pairing follows Hyperstudio + Prime Intellect references:
 *   Bodoni Moda       → display, hero, section titles. Editorial weight.
 *   IBM Plex Sans     → body, labels, CTAs. Neutral, technical.
 *   IBM Plex Mono     → instrumentation, version stamps, tag labels.
 */
const display = Bodoni_Moda({
  variable: "--aiop-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = IBM_Plex_Sans({
  variable: "--aiop-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--aiop-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vincent Buyssens · Forward-Deployed AI Operator",
  description:
    "Embedded with marketing and creative teams while AI rewires how they work. Building the tool inside the work, coaching cohorts to self-sufficiency, scaling patterns across teams.",
  robots: { index: true, follow: true },
};

export default function AiOperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} aiop-shell`}>
      {children}
    </div>
  );
}

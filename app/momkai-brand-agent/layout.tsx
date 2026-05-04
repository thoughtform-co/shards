import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./momkai-brand-agent.css";

/*
 * Route-local layout for the Momkai Brand Agent landing.
 *
 * The Shards root layout sets `color-scheme: dark` on `:root` and a dark
 * radial gradient on `body`. This route is editorial / cream / Momkai-
 * adjacent, so it owns its own type pairing and lifts a "paper" stage
 * over the body's dark background using `.momkai-stage`.
 *
 * Typography pairing chosen to echo Momkai's own Minion-Pro + Georgia
 * stack without claiming either one:
 *   - EB Garamond  → display + body. Old-style serif with the same
 *                    warmth as Garamond/Minion. Readable at any size.
 *   - Inter        → small UI labels and the substrate panel chrome.
 *                    Quiet, neutral, never competes with the serif.
 */
const garamond = EB_Garamond({
  variable: "--mk-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--mk-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brand Agent · Momkai",
  description:
    "A direction sketch for the brainstorm: a digital colleague that ships with every Momkai brand, trained on the strategy, ready for the rollout.",
  robots: { index: false, follow: false },
};

export default function MomkaiBrandAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${garamond.variable} ${sans.variable} momkai-shell`}>
      {children}
    </div>
  );
}

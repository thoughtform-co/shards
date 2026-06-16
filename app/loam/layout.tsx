import type { Metadata } from "next";
import type { ReactNode } from "react";

/*
 * /loam — segment layout.
 *
 * Sets the default noindex / nofollow for everything under /loam (the
 * compare-index, the three prototype routes, and the eventual full
 * single-page site). The proxy at proxy.ts already gates the route
 * behind the shards_unlock cookie; this metadata covers the case where
 * an indexer somehow follows a shared link.
 *
 * No font wiring lives here on purpose. Each prototype loads its own
 * Google fonts via next/font in its own page module so the variants
 * don't pay for fonts they don't use.
 */

export const metadata: Metadata = {
  title: {
    default: "Loam",
    template: "%s / Loam",
  },
  description:
    "Loam is a forward-deployed AI consultancy embedded inside creative agencies and marketing departments. Two operators sit inside one team for a quarter, ship the work, encode how the team decides, and leave behind the intelligence layer.",
  robots: { index: false, follow: false },
};

export default function LoamLayout({ children }: { children: ReactNode }) {
  return children;
}

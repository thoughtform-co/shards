import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import "./globals.css";
import "./studio.css";
import "./studio-v2.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Motion Lab",
  description:
    "Brief in, motion doc out. Timeline-refined, code-rendered explainer videos on Remotion + HyperFrames.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

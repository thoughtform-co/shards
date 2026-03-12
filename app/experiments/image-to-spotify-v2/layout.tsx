import type { PropsWithChildren } from "react";
import { DM_Sans, Fredoka } from "next/font/google";

const campusDisplay = Fredoka({
  variable: "--campus-font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const campusBody = DM_Sans({
  variable: "--campus-font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function JukeboxV2Layout({ children }: PropsWithChildren) {
  return (
    <div
      className={`${campusDisplay.variable} ${campusBody.variable}`}
      style={{ minHeight: "100vh", background: "#000" }}
    >
      {children}
    </div>
  );
}

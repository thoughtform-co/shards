import type { Metadata } from "next";
import { FrameArtboard, frameSpecs } from "@/components/folio/frames";
import "./frames.css";

/* Contact sheet: every social artboard at its real CSS size. */

export const metadata: Metadata = {
  title: { absolute: "Folio · social frames" },
  robots: { index: false, follow: false },
};

export default function FolioFramesSheet() {
  return (
    <div className="fo-frames-sheet">
      {frameSpecs.map((spec) => (
        <figure key={spec.slug}>
          <FrameArtboard spec={spec} />
          <figcaption>
            /folio/frames/{spec.slug} · {spec.w * 2}×{spec.h * 2}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

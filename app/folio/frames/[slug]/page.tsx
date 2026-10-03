import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FrameArtboard, frameSpecs } from "@/components/folio/frames";
import "../frames.css";

/* One social artboard per route, at its fixed size, for capture. */

export const dynamicParams = false;

export function generateStaticParams() {
  return frameSpecs.map((f) => ({ slug: f.slug }));
}

export const metadata: Metadata = {
  title: { absolute: "Folio · frame" },
  robots: { index: false, follow: false },
};

export default async function FolioFramePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spec = frameSpecs.find((f) => f.slug === slug);
  if (!spec) notFound();

  return (
    <div className="fo-frames-solo">
      <FrameArtboard spec={spec} />
    </div>
  );
}

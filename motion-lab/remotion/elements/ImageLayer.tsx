import { Img, staticFile } from "remotion";

import type { ImageElement } from "../../lib/motiondoc/schema";

export function ImageLayer({ element }: { element: ImageElement }) {
  /* Absolute URLs pass through; "/assets/…" resolves via staticFile so
     the same doc works in the Player (Next serves public/) and in the
     render bundle (bundler copies publicDir). */
  const src = /^https?:\/\//.test(element.src)
    ? element.src
    : staticFile(element.src.replace(/^\/+/, ""));

  return (
    <div
      style={{
        width: element.width,
        height: element.height,
        borderRadius: element.radius,
        overflow: "hidden",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: element.fit,
        }}
      />
    </div>
  );
}

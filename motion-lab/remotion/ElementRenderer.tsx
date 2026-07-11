import type { CSSProperties } from "react";

import { sampleElementValues } from "../lib/motiondoc/sample";
import type { Brand, MotionElement, TransformOrigin } from "../lib/motiondoc/schema";

import { ImageLayer } from "./elements/ImageLayer";
import { ShapeLayer } from "./elements/ShapeLayer";
import { TextLayer } from "./elements/TextLayer";

const ORIGIN_CSS: Record<TransformOrigin, string> = {
  center: "50% 50%",
  left: "0% 50%",
  right: "100% 50%",
  top: "50% 0%",
  bottom: "50% 100%",
};

/*
 * (x, y) is the element's CENTER on the canvas: the box is placed at
 * the origin, translated to (x, y), then pulled back by half its own
 * size. transform-origin re-anchors rotation/scale — e.g. a line
 * "drawing in" is origin:left + scale 0→1.
 */
export function ElementRenderer({
  element,
  brand,
  frame,
  fps,
}: {
  element: MotionElement;
  brand: Brand;
  frame: number;
  fps: number;
}) {
  const v = sampleElementValues(element, frame, fps);
  if (v.opacity <= 0) return null;

  const style: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    transform: `translate(${v.x}px, ${v.y}px) translate(-50%, -50%) rotate(${v.rotation}deg) scale(${v.scale})`,
    transformOrigin: ORIGIN_CSS[element.transformOrigin],
    opacity: v.opacity,
  };

  return (
    <div style={style}>
      {element.kind === "text" ? (
        <TextLayer element={element} brand={brand} />
      ) : element.kind === "shape" ? (
        <ShapeLayer element={element} brand={brand} />
      ) : (
        <ImageLayer element={element} />
      )}
    </div>
  );
}

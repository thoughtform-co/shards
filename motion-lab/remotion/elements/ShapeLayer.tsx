import type { CSSProperties } from "react";

import { resolveColor } from "../../lib/motiondoc/colors";
import type { Brand, ShapeElement } from "../../lib/motiondoc/schema";

export function ShapeLayer({
  element,
  brand,
}: {
  element: ShapeElement;
  brand: Brand;
}) {
  const style: CSSProperties = {
    width: element.width,
    height: element.height,
    backgroundColor: resolveColor(element.fill, brand),
    borderRadius: element.shape === "ellipse" ? "50%" : element.radius,
  };
  return <div style={style} />;
}

import type { CSSProperties } from "react";

import { resolveColor } from "../../lib/motiondoc/colors";
import type { Brand, TextElement } from "../../lib/motiondoc/schema";

export function TextLayer({
  element,
  brand,
}: {
  element: TextElement;
  brand: Brand;
}) {
  const style: CSSProperties = {
    fontFamily: brand.fonts[element.font],
    fontSize: element.fontSize,
    fontWeight: element.fontWeight,
    color: resolveColor(element.color, brand),
    textAlign: element.align,
    lineHeight: 1.15,
    whiteSpace: element.maxWidth ? "normal" : "nowrap",
    ...(element.maxWidth ? { width: element.maxWidth } : {}),
    ...(element.letterSpacing !== undefined
      ? { letterSpacing: `${element.letterSpacing}em` }
      : {}),
  };
  return <div style={style}>{element.text}</div>;
}

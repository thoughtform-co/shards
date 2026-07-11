import type { CSSProperties } from "react";

import { resolveColor } from "../../lib/motiondoc/colors";
import { assetFontFamily, findAsset } from "../../lib/motiondoc/assets";
import type { Brand, MotionAsset, TextElement } from "../../lib/motiondoc/schema";

export function TextLayer({
  element,
  brand,
  assets,
}: {
  element: TextElement;
  brand: Brand;
  assets: MotionAsset[];
}) {
  const fontAsset = findAsset(assets, element.fontAssetId);
  const style: CSSProperties = {
    fontFamily:
      fontAsset?.kind === "font"
        ? assetFontFamily(fontAsset)
        : brand.fonts[element.font],
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

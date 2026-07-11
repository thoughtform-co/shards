import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

import { assetFontFamily, publicAssetPath } from "../lib/motiondoc/assets";
import type { MotionAsset } from "../lib/motiondoc/schema";

const loaded = new Set<string>();

/** @remotion/fonts blocks rendering until each local face is ready. */
export function loadAssetFonts(assets: MotionAsset[]): void {
  assets
    .filter((asset) => asset.kind === "font")
    .forEach((asset) => {
      if (loaded.has(asset.id)) return;
      loaded.add(asset.id);
      void loadFont({
        family: assetFontFamily(asset),
        url: staticFile(publicAssetPath(asset.src)),
        weight: String(asset.fontWeight ?? 400) as `${number}`,
        style: asset.fontStyle ?? "normal",
      });
    });
}

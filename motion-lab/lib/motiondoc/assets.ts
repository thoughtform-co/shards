import type { MotionAsset } from "./schema";

export function assetFontFamily(asset: MotionAsset): string {
  return `MotionLab_${asset.id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export function publicAssetPath(src: string): string {
  return src.replace(/^\/+/, "");
}

export function findAsset(
  assets: MotionAsset[],
  assetId: string | undefined,
): MotionAsset | undefined {
  return assetId ? assets.find((asset) => asset.id === assetId) : undefined;
}

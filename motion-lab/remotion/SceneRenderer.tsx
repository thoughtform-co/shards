import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import { resolveColor } from "../lib/motiondoc/colors";
import type { Brand, MotionAsset, Scene } from "../lib/motiondoc/schema";

import { ElementRenderer } from "./ElementRenderer";

/*
 * Renders one scene inside its <Sequence>, so useCurrentFrame() is
 * already scene-local. Crossfades are soft dissolves: the incoming
 * scene ramps 0→1 over its overlap window while the outgoing ramps
 * 1→0 over the same global window — scenes here rarely carry opaque
 * backgrounds, so both-fade avoids the unmount pop a one-sided fade
 * shows on transparent scenes.
 */
export function SceneRenderer({
  scene,
  brand,
  assets,
  incomingOverlap,
  outgoingOverlap,
}: {
  scene: Scene;
  brand: Brand;
  assets: MotionAsset[];
  /** Frames this scene fades in over (its own crossfade overlap). */
  incomingOverlap: number;
  /** Frames it fades out over (the NEXT scene's crossfade overlap). */
  outgoingOverlap: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let opacity = 1;
  if (incomingOverlap > 0) {
    opacity *= interpolate(frame, [0, incomingOverlap], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (outgoingOverlap > 0) {
    opacity *= interpolate(
      frame,
      [scene.durationInFrames - outgoingOverlap, scene.durationInFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  }

  return (
    <AbsoluteFill
      style={{
        opacity,
        ...(scene.background
          ? { backgroundColor: resolveColor(scene.background, brand) }
          : {}),
      }}
    >
      {scene.elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          brand={brand}
          assets={assets}
          frame={frame}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
}

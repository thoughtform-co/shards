"use client";

import { useMemo } from "react";
import { Player } from "@remotion/player";
import type { ComponentType } from "react";
import type { DeckScenePlan } from "@/experiments/video-studio/deck-scene-plan";

type RemotionLivePreviewProps = {
  sessionId: string;
  scenePlan: DeckScenePlan;
  width?: number;
  height?: number;
  fps?: number;
  isStale?: boolean;
};

/* Mounts @remotion/player with `lazyComponent` pointing at the
   per-session Composition.mjs served by the composition-remotion
   route. Module identity (React + Remotion) is preserved via the
   page-level <RemotionGlobals /> + import-map shim — without those
   mounted, the dynamic import will throw on first hook call. */
export function RemotionLivePreview({
  sessionId,
  scenePlan,
  width = 1920,
  height = 1080,
  fps = 30,
  isStale = false,
}: RemotionLivePreviewProps) {
  const totalSeconds = useMemo(
    () => scenePlan.scenes.reduce((sum, s) => sum + s.durationSeconds, 0),
    [scenePlan.scenes],
  );
  const durationInFrames = Math.max(1, Math.round(totalSeconds * fps));

  // lazyComponent identity must NOT change across renders or the
  // Player will reload on every scene-plan tweak. Key by sessionId
  // so the player remounts only when a new composition is generated.
  // Use a Function-constructed import to bypass Next.js's static
  // bundler analysis (the module URL only exists at runtime).
  const lazyComponent = useMemo<() => Promise<{ default: ComponentType<unknown> }>>(() => {
    const moduleUrl = `/api/experiments/video-studio/composition-remotion/${sessionId}/Composition.mjs`;
    const dynamicImport = new Function("url", "return import(url);") as (
      url: string,
    ) => Promise<{ default: ComponentType<unknown> }>;
    return async () => {
      const mod = await dynamicImport(moduleUrl);
      return { default: mod.default };
    };
  }, [sessionId]);

  const inputProps = useMemo(
    () => ({
      title: scenePlan.title,
      brandName: scenePlan.brandName,
      accentColor: scenePlan.accentColor,
      backgroundColor: scenePlan.backgroundColor,
      scenes: scenePlan.scenes,
    }),
    [scenePlan],
  );

  return (
    <>
      <Player
        lazyComponent={lazyComponent}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        style={{ width: "100%", height: "100%" }}
        controls
        loop
        autoPlay
      />
      {isStale ? (
        <span className="cw-vs__viewer-stale" aria-live="polite">
          Edits since last animation
        </span>
      ) : null}
    </>
  );
}

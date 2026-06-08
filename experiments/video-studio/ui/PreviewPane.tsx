"use client";

import { createElement, useEffect, useMemo, useRef } from "react";
import { Player } from "@remotion/player";
import { DeckExplainer } from "@/experiments/video-studio/templates/remotion/DeckExplainer";
import { SocialVariantSet } from "@/experiments/video-studio/templates/remotion/SocialVariantSet";
import { resolveDeckExplainerProps } from "@/experiments/video-studio/templates/remotion/deck-explainer-props";
import { resolveSocialVariantProps } from "@/experiments/video-studio/templates/remotion/social-variant-props";
import type { TemplateInputProps, VideoTemplate } from "@/experiments/video-studio/types";
import styles from "@/experiments/video-studio/ui/video-studio.module.css";

type PreviewPaneProps = {
  template: VideoTemplate;
  input: TemplateInputProps;
  videoAssetUrl?: string;
};

export function PreviewPane({ template, input, videoAssetUrl }: PreviewPaneProps) {
  const playerRef = useRef<HTMLElement>(null);
  const isVertical = template.dimensions.height > template.dimensions.width;

  const hyperframesSrc = useMemo(() => {
    if (template.engine !== "hyperframes") {
      return "";
    }

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(input)) {
      params.set(key, String(value));
    }

    if (videoAssetUrl) {
      params.set("videoAssetUrl", videoAssetUrl);
    }

    return `/api/experiments/video-studio/composition/${template.id}?${params.toString()}`;
  }, [input, template.engine, template.id, videoAssetUrl]);

  useEffect(() => {
    if (template.engine !== "hyperframes") {
      return;
    }

    void import("@hyperframes/player");
  }, [template.engine]);

  useEffect(() => {
    if (template.engine !== "hyperframes" || !playerRef.current) {
      return;
    }

    playerRef.current.setAttribute("src", hyperframesSrc);
  }, [hyperframesSrc, template.engine]);

  const frameClassName = `${styles.vsPreviewFrame} ${
    isVertical ? styles.vsPreviewFrameVertical : ""
  }`;

  if (template.engine === "remotion") {
    if (template.id === "deck-explainer") {
      const props = resolveDeckExplainerProps(input);

      return (
        <div className={frameClassName}>
          <Player
            component={DeckExplainer}
            inputProps={props}
            durationInFrames={template.durationSeconds * template.fps}
            fps={template.fps}
            compositionWidth={template.dimensions.width}
            compositionHeight={template.dimensions.height}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
          />
        </div>
      );
    }

    if (template.id === "social-variant-set") {
      const props = resolveSocialVariantProps(input);

      return (
        <div className={frameClassName}>
          <Player
            component={SocialVariantSet}
            inputProps={props}
            durationInFrames={template.durationSeconds * template.fps}
            fps={template.fps}
            compositionWidth={template.dimensions.width}
            compositionHeight={template.dimensions.height}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
          />
        </div>
      );
    }
  }

  return (
    <div className={frameClassName}>
      {hyperframesSrc ? (
        createElement("hyperframes-player", {
          ref: playerRef,
          src: hyperframesSrc,
          controls: true,
          muted: true,
          loop: true,
          width: template.dimensions.width,
          height: template.dimensions.height,
          style: { width: "100%", height: "100%" },
        })
      ) : (
        <div className={styles.vsPreviewPlaceholder}>
          Select a HyperFrames template to preview.
        </div>
      )}
    </div>
  );
}

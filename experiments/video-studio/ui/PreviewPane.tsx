"use client";

import { createElement, useEffect, useMemo, useRef } from "react";
import { Player } from "@remotion/player";
import { DeckExplainer } from "@/experiments/video-studio/templates/remotion/DeckExplainer";
import { DeckExplainerSeries } from "@/experiments/video-studio/templates/remotion/DeckExplainerSeries";
import { resolveDeckExplainerProps } from "@/experiments/video-studio/templates/remotion/deck-explainer-props";
import {
  resolveDeckSeriesProps,
  totalSeriesDurationFrames,
} from "@/experiments/video-studio/templates/remotion/deck-series-props";
import { resolveSocialVariantProps } from "@/experiments/video-studio/templates/remotion/social-variant-props";
import { SocialVariantSet } from "@/experiments/video-studio/templates/remotion/SocialVariantSet";
import type { TemplateInputProps, VideoTemplate } from "@/experiments/video-studio/types";

type PreviewPaneProps = {
  template: VideoTemplate;
  input: TemplateInputProps | Record<string, unknown>;
  videoAssetUrl?: string;
};

function ViewerFrame({
  isVertical,
  children,
}: {
  isVertical: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`cw-vs__viewer ${isVertical ? "cw-vs__viewer--vertical" : ""}`}
    >
      <span
        className="cw-vs__viewer-corner cw-vs__viewer-corner--tl"
        aria-hidden="true"
      />
      <span
        className="cw-vs__viewer-corner cw-vs__viewer-corner--tr"
        aria-hidden="true"
      />
      <span
        className="cw-vs__viewer-corner cw-vs__viewer-corner--bl"
        aria-hidden="true"
      />
      <span
        className="cw-vs__viewer-corner cw-vs__viewer-corner--br"
        aria-hidden="true"
      />
      <div className="cw-vs__viewer-inner">{children}</div>
    </div>
  );
}

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

  if (template.engine === "remotion") {
    if (template.id === "deck-explainer-series") {
      const props = resolveDeckSeriesProps(input);
      const durationInFrames = totalSeriesDurationFrames(
        props.scenes,
        template.fps,
      );

      return (
        <ViewerFrame isVertical={isVertical}>
          <Player
            component={DeckExplainerSeries}
            inputProps={props}
            durationInFrames={durationInFrames}
            fps={template.fps}
            compositionWidth={template.dimensions.width}
            compositionHeight={template.dimensions.height}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
          />
        </ViewerFrame>
      );
    }

    if (template.id === "deck-explainer") {
      const props = resolveDeckExplainerProps(input as TemplateInputProps);

      return (
        <ViewerFrame isVertical={isVertical}>
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
        </ViewerFrame>
      );
    }

    if (template.id === "social-variant-set") {
      const props = resolveSocialVariantProps(input as TemplateInputProps);

      return (
        <ViewerFrame isVertical={isVertical}>
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
        </ViewerFrame>
      );
    }
  }

  return (
    <ViewerFrame isVertical={isVertical}>
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
        <div className="cw-vs__viewer-placeholder">
          Select a HyperFrames template to preview.
        </div>
      )}
    </ViewerFrame>
  );
}

"use client";

import { createElement, useEffect, useMemo, useRef } from "react";
import { Player } from "@remotion/player";
import { DeckExplainer } from "@/experiments/video-studio/templates/remotion/DeckExplainer";
import { resolveDeckExplainerProps } from "@/experiments/video-studio/templates/remotion/deck-explainer-props";
import { resolveSocialVariantProps } from "@/experiments/video-studio/templates/remotion/social-variant-props";
import { SocialVariantSet } from "@/experiments/video-studio/templates/remotion/SocialVariantSet";
import type { TemplateInputProps, VideoTemplate } from "@/experiments/video-studio/types";
import type { AnimationState } from "@/experiments/video-studio/ui/VideoStudio";

type PreviewPaneProps = {
  template: VideoTemplate;
  input: TemplateInputProps | Record<string, unknown>;
  videoAssetUrl?: string;
  /** Pptx mode: drives the placeholder / progress / ready states. */
  animationState?: AnimationState;
  animationProgress?: number;
  animationMessage?: string;
  animationSessionId?: string;
  isAnimationStale?: boolean;
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
      <div className="cw-vs__viewer-inner">{children}</div>
    </div>
  );
}

function AnimationPlaceholder({
  state,
  progress,
  message,
  isStale,
}: {
  state: AnimationState;
  progress: number;
  message: string;
  isStale: boolean;
}) {
  if (state === "animating") {
    const pct = Math.round(progress * 100);
    return (
      <div className="cw-vs__animate-placeholder cw-vs__animate-placeholder--working">
        <span className="cw-vs__animate-placeholder-eyebrow">
          Authoring composition
        </span>
        <p className="cw-vs__animate-placeholder-title">
          {message || "Working…"}
        </p>
        <div
          className="cw-vs__animate-placeholder-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="cw-vs__animate-placeholder-hint">
          Claude is writing the HTML/CSS/GSAP composition, then linting it.
        </p>
      </div>
    );
  }

  return (
    <div className="cw-vs__animate-placeholder">
      <span className="cw-vs__animate-placeholder-eyebrow">No composition yet</span>
      <p className="cw-vs__animate-placeholder-title">
        Animate the deck to generate the video.
      </p>
      <p className="cw-vs__animate-placeholder-hint">
        {isStale
          ? "Re-animate to regenerate the composition with your latest edits."
          : "Use the Animate button in the left rail. Style intent and motion energy shape the result."}
      </p>
      {message ? (
        <p className="cw-vs__animate-placeholder-error">{message}</p>
      ) : null}
    </div>
  );
}

export function PreviewPane({
  template,
  input,
  videoAssetUrl,
  animationState = "idle",
  animationProgress = 0,
  animationMessage = "",
  animationSessionId,
  isAnimationStale = false,
}: PreviewPaneProps) {
  const playerRef = useRef<HTMLElement>(null);
  const isVertical = template.dimensions.height > template.dimensions.width;
  const isPptx = template.id === "deck-explainer-series";

  // Pptx mode now plays an agent-authored HyperFrames composition served from
  // /api/.../composition-draft/[sessionId]. The other HyperFrames templates
  // still render via /composition/[id] (template-driven).
  const hyperframesSrc = useMemo(() => {
    if (isPptx) {
      if (animationState !== "ready" || !animationSessionId) {
        return "";
      }
      return `/api/experiments/video-studio/composition-draft/${animationSessionId}`;
    }

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
  }, [
    animationSessionId,
    animationState,
    input,
    isPptx,
    template.engine,
    template.id,
    videoAssetUrl,
  ]);

  useEffect(() => {
    if (!hyperframesSrc) {
      return;
    }

    void import("@hyperframes/player");
  }, [hyperframesSrc]);

  useEffect(() => {
    if (!playerRef.current || !hyperframesSrc) {
      return;
    }

    playerRef.current.setAttribute("src", hyperframesSrc);
  }, [hyperframesSrc]);

  if (isPptx) {
    if (animationState !== "ready" || !hyperframesSrc) {
      return (
        <ViewerFrame isVertical={isVertical}>
          <AnimationPlaceholder
            state={animationState}
            progress={animationProgress}
            message={animationMessage}
            isStale={isAnimationStale}
          />
        </ViewerFrame>
      );
    }

    return (
      <ViewerFrame isVertical={isVertical}>
        {createElement("hyperframes-player", {
          ref: playerRef,
          src: hyperframesSrc,
          controls: true,
          muted: true,
          loop: true,
          autoplay: true,
          width: template.dimensions.width,
          height: template.dimensions.height,
          style: { width: "100%", height: "100%" },
        })}
        {isAnimationStale ? (
          <span className="cw-vs__viewer-stale" aria-live="polite">
            Edits since last animation
          </span>
        ) : null}
      </ViewerFrame>
    );
  }

  if (template.engine === "remotion") {
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

"use client";

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SocialVariantProps } from "@/experiments/video-studio/templates/remotion/social-variant-props";

export function SocialVariantSet({
  headline,
  subheadline,
  variantLabel,
  accentColor,
  backgroundColor,
}: SocialVariantProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const holdFade = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 4],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 20%, ${accentColor}33, transparent 42%), ${backgroundColor}`,
        color: "#F5F0E8",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 80,
      }}
    >
      <div
        style={{
          opacity: holdFade,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            border: `1px solid ${accentColor}`,
            padding: "10px 16px",
            fontSize: 16,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            transform: `scale(${0.92 + intro * 0.08})`,
            opacity: intro,
          }}
        >
          {variantLabel}
        </div>

        <div style={{ maxWidth: 920 }}>
          <h1
            style={{
              fontSize: 92,
              lineHeight: 0.95,
              margin: 0,
              transform: `translateY(${(1 - intro) * 36}px)`,
              opacity: intro,
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              marginTop: 28,
              fontSize: 34,
              lineHeight: 1.35,
              color: "#D8D0C4",
              opacity: interpolate(frame, [18, 36], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {subheadline}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-monospace, monospace",
            fontSize: 18,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: accentColor,
          }}
        >
          <span>Remotion template</span>
          <span>Swap headline · accent · label</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

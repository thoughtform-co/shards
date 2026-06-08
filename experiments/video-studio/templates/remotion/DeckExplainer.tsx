"use client";

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { DeckExplainerProps } from "@/experiments/video-studio/templates/remotion/deck-explainer-props";

export function DeckExplainer({
  headline,
  bullet1,
  bullet2,
  bullet3,
  accentColor,
  backgroundColor,
}: DeckExplainerProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const bullets = [bullet1, bullet2, bullet3];

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        color: "#F5F0E8",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: 96,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 48,
          border: `1px solid ${accentColor}55`,
        }}
      />

      <div style={{ maxWidth: 1200 }}>
        <p
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 18,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: accentColor,
            marginBottom: 28,
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          One-pager → video
        </p>

        <h1
          style={{
            fontSize: 88,
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            margin: 0,
            transform: `translateY(${(1 - headlineProgress) * 40}px)`,
            opacity: headlineProgress,
          }}
        >
          {headline}
        </h1>

        <div style={{ marginTop: 72, display: "grid", gap: 28 }}>
          {bullets.map((bullet, index) => {
            const start = 24 + index * 18;
            const progress = spring({
              frame: frame - start,
              fps,
              config: { damping: 20, stiffness: 140 },
            });

            return (
              <div
                key={bullet}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  transform: `translateX(${(1 - progress) * 48}px)`,
                  opacity: progress,
                }}
              >
                <span
                  style={{
                    color: accentColor,
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 20,
                    marginTop: 8,
                  }}
                >
                  0{index + 1}
                </span>
                <p
                  style={{
                    fontSize: 34,
                    lineHeight: 1.35,
                    margin: 0,
                    maxWidth: 900,
                  }}
                >
                  {bullet}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* Hand-coded Remotion deck composition used when the Claude agent
   fails to produce a bundle-safe TSX (twice). Rotates between three
   motion DNAs per scene so even the safety net doesn't feel like the
   same fade-in repeated four times.

   This file is read as a raw string and fed to esbuild — it is NOT
   imported by any other module. Keep imports limited to `remotion`
   so the externals list stays minimal. */

import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Scene = {
  headline: string;
  bullets: string[];
  durationSeconds: number;
};

type CompositionProps = {
  title: string;
  brandName: string;
  accentColor: string;
  backgroundColor: string;
  scenes: Scene[];
};

const FONT_FAMILY = "Inter, system-ui, -apple-system, sans-serif";
const MONO_FAMILY = "ui-monospace, 'JetBrains Mono', monospace";

function pickTextColor(bg: string): string {
  const hex = bg.replace(/^#/, "").trim();
  const expanded =
    hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return "#F5F0E8";
  const r = parseInt(expanded.slice(0, 2), 16) / 255;
  const g = parseInt(expanded.slice(2, 4), 16) / 255;
  const b = parseInt(expanded.slice(4, 6), 16) / 255;
  const gamma = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lum = 0.2126 * gamma(r) + 0.7152 * gamma(g) + 0.0722 * gamma(b);
  return lum > 0.45 ? "#0F0E0C" : "#F5F0E8";
}

type SceneViewProps = {
  scene: Scene;
  index: number;
  totalScenes: number;
  brandName: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

/* DNA 0 — Editorial.
   Hairline accent rule draws from left, eyebrow fades in, headline
   rises from below with a spring, bullets stagger with horizontal
   slide. Tasteful, restrained, designed-deck feel. */
function EditorialScene(props: SceneViewProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scene, index, totalScenes, brandName, accentColor, textColor } = props;

  const eyebrowOpacity = interpolate(frame, [3, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ruleProgress = interpolate(frame, [6, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headlineSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        padding: "120px 160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 36,
      }}
    >
      <div
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 22,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: accentColor,
          opacity: eyebrowOpacity,
        }}
      >
        {brandName} · {String(index + 1).padStart(2, "0")} /{" "}
        {String(totalScenes).padStart(2, "0")}
      </div>
      <div
        style={{
          width: 220,
          height: 4,
          background: accentColor,
          transformOrigin: "left center",
          transform: `scaleX(${ruleProgress})`,
        }}
      />
      <h1
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 112,
          fontWeight: 700,
          lineHeight: 0.98,
          letterSpacing: "-0.01em",
          color: textColor,
          margin: 0,
          maxWidth: 1500,
          opacity: headlineSpring,
          transform: `translateY(${(1 - headlineSpring) * 56}px)`,
        }}
      >
        {scene.headline}
      </h1>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {scene.bullets.map((bullet, i) => {
          const start = 28 + i * 7;
          const p = interpolate(frame, [start, start + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                transform: `translateX(${(1 - p) * 36}px)`,
                opacity: p,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  background: accentColor,
                  marginTop: 22,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 34,
                  lineHeight: 1.4,
                  color: textColor,
                  maxWidth: 1200,
                }}
              >
                {bullet}
              </span>
            </li>
          );
        })}
      </ul>
    </AbsoluteFill>
  );
}

/* DNA 1 — Kinetic.
   Eyebrow slides in from right with an overshoot, headline reveals
   word-by-word with stagger + slight scale, a thick diagonal accent
   sweeps behind the headline (clip-path wipe). Bullets slam in from
   below with a brief overshoot. Energetic, on-beat. */
function KineticScene(props: SceneViewProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scene, index, totalScenes, brandName, accentColor, textColor } = props;

  const eyebrowSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 11, stiffness: 110, overshootClamping: false },
  });
  const sweepProgress = interpolate(frame, [8, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const words = scene.headline.split(/\s+/).filter(Boolean);

  return (
    <AbsoluteFill
      style={{
        padding: "120px 160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <div
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 22,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: accentColor,
          transform: `translateX(${(1 - eyebrowSpring) * 80}px)`,
          opacity: eyebrowSpring,
        }}
      >
        {brandName} · {String(index + 1).padStart(2, "0")} /{" "}
        {String(totalScenes).padStart(2, "0")}
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: "-32px -40px -32px -40px",
            background: accentColor,
            opacity: 0.18,
            clipPath: `polygon(0 0, ${sweepProgress}% 0, ${Math.max(0, sweepProgress - 18)}% 100%, 0% 100%)`,
          }}
        />
        <h1
          style={{
            position: "relative",
            fontFamily: FONT_FAMILY,
            fontSize: 124,
            fontWeight: 800,
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            color: textColor,
            margin: 0,
            maxWidth: 1500,
            display: "flex",
            flexWrap: "wrap",
            gap: "0 24px",
          }}
        >
          {words.map((word, i) => {
            const start = 6 + i * 2.5;
            const wordSpring = spring({
              frame: frame - start,
              fps,
              config: { damping: 14, stiffness: 220, mass: 0.6 },
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - wordSpring) * 56}px) scale(${0.92 + 0.08 * wordSpring})`,
                  opacity: wordSpring,
                }}
              >
                {word}
              </span>
            );
          })}
        </h1>
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {scene.bullets.map((bullet, i) => {
          const start = 30 + i * 5;
          const bulletSpring = spring({
            frame: frame - start,
            fps,
            config: { damping: 12, stiffness: 180, mass: 0.7 },
          });
          return (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                transform: `translateY(${(1 - bulletSpring) * 42}px)`,
                opacity: bulletSpring,
              }}
            >
              <span
                style={{
                  fontFamily: MONO_FAMILY,
                  fontSize: 28,
                  fontWeight: 600,
                  color: accentColor,
                  marginTop: 6,
                  flexShrink: 0,
                  width: 36,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 34,
                  lineHeight: 1.35,
                  color: textColor,
                  maxWidth: 1200,
                }}
              >
                {bullet}
              </span>
            </li>
          );
        })}
      </ul>
    </AbsoluteFill>
  );
}

/* DNA 2 — Layered.
   Radial accent gradient pulses behind the content, a large diamond
   outline drifts across in the background, headline blur-fades in,
   bullets pop from below with a small rotation. Atmospheric. */
function LayeredScene(props: SceneViewProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scene, index, totalScenes, brandName, accentColor, textColor, backgroundColor } = props;

  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * 1.2);
  const diamondX = interpolate(frame, [0, 120], [-400, 1800], {
    extrapolateRight: "clamp",
  });
  const headlineBlur = interpolate(frame, [4, 26], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headlineOpacity = interpolate(frame, [4, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eyebrowOpacity = interpolate(frame, [2, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Atmospheric background — radial pulse behind the content */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% 40%, ${accentColor}${pulseHex(pulse)} 0%, ${backgroundColor} 60%)`,
        }}
      />
      {/* Drifting diamond outline */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: diamondX,
          width: 320,
          height: 320,
          transform: "rotate(45deg)",
          border: `2px solid ${accentColor}`,
          opacity: 0.22,
        }}
      />
      <AbsoluteFill
        style={{
          padding: "120px 160px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            fontFamily: MONO_FAMILY,
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accentColor,
            opacity: eyebrowOpacity,
          }}
        >
          {brandName} · {String(index + 1).padStart(2, "0")} /{" "}
          {String(totalScenes).padStart(2, "0")}
        </div>
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 118,
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.015em",
            color: textColor,
            margin: 0,
            maxWidth: 1500,
            filter: `blur(${headlineBlur}px)`,
            opacity: headlineOpacity,
          }}
        >
          {scene.headline}
        </h1>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {scene.bullets.map((bullet, i) => {
            const start = 22 + i * 6;
            const popSpring = spring({
              frame: frame - start,
              fps,
              config: { damping: 13, stiffness: 150, mass: 0.7 },
            });
            return (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start",
                  transform: `translateY(${(1 - popSpring) * 32}px) rotate(${(1 - popSpring) * -1.2}deg)`,
                  opacity: popSpring,
                  transformOrigin: "left center",
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    background: accentColor,
                    transform: "rotate(45deg)",
                    marginTop: 18,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 34,
                    lineHeight: 1.4,
                    color: textColor,
                    maxWidth: 1200,
                  }}
                >
                  {bullet}
                </span>
              </li>
            );
          })}
        </ul>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function pulseHex(t: number): string {
  // Map 0..1 → "00".."33" for an accent alpha that breathes.
  const v = Math.round(0x33 * Math.max(0, Math.min(1, t)));
  return v.toString(16).padStart(2, "0");
}

export default function AgentDeckFallbackComposition(props: CompositionProps) {
  const { fps } = useVideoConfig();
  const { backgroundColor, scenes } = props;
  const textColor = pickTextColor(backgroundColor);
  const totalScenes = scenes.length;

  let cursor = 0;

  return (
    <AbsoluteFill style={{ background: backgroundColor }}>
      {scenes.map((scene, index) => {
        const durationFrames = Math.max(30, Math.round(scene.durationSeconds * fps));
        const from = cursor;
        cursor += durationFrames;
        const dna = index % 3;
        const SceneComp =
          dna === 0
            ? EditorialScene
            : dna === 1
              ? KineticScene
              : LayeredScene;
        return (
          <Sequence key={index} from={from} durationInFrames={durationFrames}>
            <SceneComp
              scene={scene}
              index={index}
              totalScenes={totalScenes}
              brandName={props.brandName}
              accentColor={props.accentColor}
              backgroundColor={backgroundColor}
              textColor={textColor}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

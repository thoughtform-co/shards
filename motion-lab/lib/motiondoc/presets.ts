import type { Brand, SpringConfig, VideoFormat } from "./schema";

export const FORMAT_PRESETS: Record<
  Exclude<VideoFormat, "custom">,
  { width: number; height: number }
> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

export const DEFAULT_FPS = 30;

export const DEFAULT_SPRING: SpringConfig = {
  damping: 12,
  stiffness: 100,
  mass: 1,
};

/*
 * Spring recipes referenced by the motion-design skill. The generator
 * and the inspector both speak these names.
 */
export const SPRING_RECIPES = {
  snappy: { damping: 12, stiffness: 100, mass: 1 },
  calm: { damping: 14, stiffness: 90, mass: 1 },
  bouncy: { damping: 8, stiffness: 200, mass: 1 },
} satisfies Record<string, SpringConfig>;

/*
 * IBM Plex ships with the app (loaded via @remotion/google-fonts in
 * the interpreter), so these stacks are safe in BOTH the preview
 * player and the headless render browser. Other system fonts work on
 * local renders; arbitrary webfonts are a v2 concern.
 */
export const DEFAULT_BRAND: Brand = {
  colors: {
    background: "#0E0D0B",
    surface: "#1C1915",
    primary: "#ECE7DD",
    accent: "#C5A059",
    text: "#ECE7DD",
    muted: "#A29A87",
  },
  fonts: {
    heading: "'IBM Plex Sans', 'Segoe UI', 'Helvetica Neue', sans-serif",
    body: "'IBM Plex Sans', 'Segoe UI', 'Helvetica Neue', sans-serif",
    mono: "'IBM Plex Mono', Consolas, monospace",
  },
};

/*
 * Starter tokens for Exalate-flavoured work — a stand-in until the
 * real brand book values are dropped in (see the motion-design
 * skill's "fork this with your brand book" worksheet).
 */
export const EXALATE_STARTER_BRAND: Brand = {
  colors: {
    background: "#0B1220",
    surface: "#141F33",
    primary: "#F4F7FB",
    accent: "#4DA3FF",
    text: "#F4F7FB",
    muted: "#8CA0BC",
  },
  fonts: {
    heading: "'IBM Plex Sans', 'Segoe UI', 'Helvetica Neue', sans-serif",
    body: "'IBM Plex Sans', 'Segoe UI', 'Helvetica Neue', sans-serif",
    mono: "'IBM Plex Mono', Consolas, monospace",
  },
};

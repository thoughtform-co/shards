import type { JobType, VideoEngine } from "@/experiments/video-studio/types";

const hyperframesJobs = new Set<JobType>([
  "interview-captions",
  "social-cut-down",
  "product-intro",
]);

const remotionJobs = new Set<JobType>([
  "deck-to-video",
  "variant-set",
]);

/**
 * Community heuristic from the briefing: HyperFrames for one-off reels,
 * captioned clips, and footage polish; Remotion for templated variant sets
 * and code-reviewed compositions.
 */
export function recommendEngine(jobType: JobType): VideoEngine {
  if (remotionJobs.has(jobType)) {
    return "remotion";
  }

  if (hyperframesJobs.has(jobType)) {
    return "hyperframes";
  }

  return "hyperframes";
}

export function engineLabel(engine: VideoEngine) {
  return engine === "remotion" ? "Remotion" : "HyperFrames";
}

export function engineRationale(jobType: JobType, engine: VideoEngine) {
  if (engine === "hyperframes") {
    if (jobType === "interview-captions") {
      return "HTML-native captions and footage overlays — agent-friendly, Apache-2.0.";
    }
    if (jobType === "social-cut-down") {
      return "Fast 9:16 social cuts with kinetic captions from existing footage.";
    }
    return "One-off compositions agents write as HTML — no React toolchain.";
  }

  if (jobType === "variant-set") {
    return "React compositions with constants-first props — built for batch variants.";
  }

  return "Typed React compositions the team can maintain in code review.";
}

import type { VideoTemplate } from "@/experiments/video-studio/types";

export const videoTemplates: VideoTemplate[] = [
  {
    id: "interview-captioner",
    name: "Interview captioner",
    description:
      "Upload interview footage, paste a transcript, and ship a branded clip with lower-third and kinetic captions.",
    engine: "hyperframes",
    jobType: "interview-captions",
    fields: [
      {
        key: "brandName",
        label: "Brand name",
        type: "text",
        defaultValue: "Gather Round",
      },
      {
        key: "presenterName",
        label: "Presenter name",
        type: "text",
        defaultValue: "Alex Rivera",
      },
      {
        key: "presenterTitle",
        label: "Presenter title",
        type: "text",
        defaultValue: "Head of Production",
      },
      {
        key: "accentColor",
        label: "Accent color",
        type: "color",
        defaultValue: "#C5A059",
      },
      {
        key: "captions",
        label: "Captions",
        type: "textarea",
        defaultValue:
          "0:00|We already have the footage.\n0:03|AI should make polish faster, not replace the shoot.\n0:07|Templates keep the brand frame consistent.",
        placeholder: "One line per caption, or timestamp|text",
        helpText:
          "Paste transcript lines. Use 0:03|Caption text for timed beats, or plain lines to distribute evenly.",
      },
      {
        key: "durationSeconds",
        label: "Duration (seconds)",
        type: "number",
        defaultValue: 12,
      },
      {
        key: "videoAsset",
        label: "Interview footage",
        type: "file-video",
        defaultValue: "",
        required: false,
        helpText: "Optional for preview. Required for final render with footage.",
      },
    ],
    dimensions: { width: 1920, height: 1080 },
    durationSeconds: 12,
    fps: 30,
    tags: ["captions", "interview", "footage"],
  },
  {
    id: "deck-explainer",
    name: "Deck → animated video",
    description:
      "Turn a one-pager or slide headline plus three bullets into a polished 16:9 explainer.",
    engine: "remotion",
    jobType: "deck-to-video",
    compositionId: "deck-explainer",
    fields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        defaultValue: "Speed layer on existing work",
      },
      {
        key: "bullet1",
        label: "Bullet 1",
        type: "text",
        defaultValue: "Turn one-pagers into animated explainers",
      },
      {
        key: "bullet2",
        label: "Bullet 2",
        type: "text",
        defaultValue: "Ship branded intros without opening an NLE",
      },
      {
        key: "bullet3",
        label: "Bullet 3",
        type: "text",
        defaultValue: "Swap constants, not conversations",
      },
      {
        key: "accentColor",
        label: "Accent color",
        type: "color",
        defaultValue: "#C5A059",
      },
      {
        key: "backgroundColor",
        label: "Background color",
        type: "color",
        defaultValue: "#050403",
      },
    ],
    dimensions: { width: 1920, height: 1080 },
    durationSeconds: 5,
    fps: 30,
    tags: ["deck", "one-pager", "motion"],
  },
  {
    id: "social-cutdown",
    name: "Social cut-down",
    description:
      "Reframe horizontal footage into a 9:16 hook plus kinetic captions for social.",
    engine: "hyperframes",
    jobType: "social-cut-down",
    fields: [
      {
        key: "hookText",
        label: "Hook text",
        type: "text",
        defaultValue: "Three edits. One template. Ship by lunch.",
      },
      {
        key: "accentColor",
        label: "Accent color",
        type: "color",
        defaultValue: "#7A63B3",
      },
      {
        key: "captions",
        label: "Captions",
        type: "textarea",
        defaultValue:
          "0:01|Start with the existing clip\n0:04|Add the hook and captions\n0:07|Export vertical without reopening the timeline",
      },
      {
        key: "durationSeconds",
        label: "Duration (seconds)",
        type: "number",
        defaultValue: 10,
      },
      {
        key: "videoAsset",
        label: "Source footage",
        type: "file-video",
        defaultValue: "",
        required: false,
      },
    ],
    dimensions: { width: 1080, height: 1920 },
    durationSeconds: 10,
    fps: 30,
    tags: ["9:16", "social", "captions"],
  },
  {
    id: "social-variant-set",
    name: "Variant set",
    description:
      "Remotion template built for batch variants — swap headline, subhead, and label per render.",
    engine: "remotion",
    jobType: "variant-set",
    compositionId: "social-variant-set",
    fields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        defaultValue: "New drop this week",
      },
      {
        key: "subheadline",
        label: "Subheadline",
        type: "text",
        defaultValue: "Same template. Different headline. Batch-ready.",
      },
      {
        key: "variantLabel",
        label: "Variant label",
        type: "text",
        defaultValue: "Variant A",
      },
      {
        key: "accentColor",
        label: "Accent color",
        type: "color",
        defaultValue: "#7A63B3",
      },
      {
        key: "backgroundColor",
        label: "Background color",
        type: "color",
        defaultValue: "#0A0810",
      },
    ],
    dimensions: { width: 1080, height: 1920 },
    durationSeconds: 4,
    fps: 30,
    tags: ["variants", "batch", "social"],
  },
];

export function getTemplateById(id: string) {
  return videoTemplates.find((template) => template.id === id);
}

export function defaultInputForTemplate(template: VideoTemplate) {
  return Object.fromEntries(
    template.fields.map((field) => [field.key, field.defaultValue]),
  );
}

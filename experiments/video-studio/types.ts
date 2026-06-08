export type VideoEngine = "remotion" | "hyperframes";

export type JobType =
  | "interview-captions"
  | "deck-to-video"
  | "social-cut-down"
  | "variant-set"
  | "product-intro";

export type TemplateFieldType =
  | "text"
  | "textarea"
  | "color"
  | "number"
  | "select"
  | "file-video"
  | "file-image";

export type TemplateField = {
  key: string;
  label: string;
  type: TemplateFieldType;
  defaultValue: string | number;
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
};

export type VideoTemplate = {
  id: string;
  name: string;
  description: string;
  engine: VideoEngine;
  jobType: JobType;
  /** Remotion composition id when engine is remotion */
  compositionId?: string;
  fields: TemplateField[];
  dimensions: { width: number; height: number };
  durationSeconds: number;
  fps: number;
  tags: string[];
};

export type TemplateInputProps = Record<string, string | number>;

export type RenderJobStatus =
  | "queued"
  | "rendering"
  | "complete"
  | "failed";

export type RenderJobRecord = {
  id: string;
  templateId: string;
  engine: VideoEngine;
  status: RenderJobStatus;
  progress: number;
  message: string;
  outputPath?: string;
  error?: string;
  createdAt: number;
  completedAt?: number;
};

export type UploadRecord = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  kind: "video" | "image";
  storedPath: string;
  publicUrl: string;
};

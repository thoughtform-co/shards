"use client";

import { useState } from "react";
import type { TemplateField, UploadRecord } from "@/experiments/video-studio/types";

type FootageUploaderProps = {
  field: TemplateField;
  templateId: string;
  onUploaded: (record: UploadRecord) => void;
};

export function FootageUploader({
  field,
  templateId,
  onUploaded,
}: FootageUploaderProps) {
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    setStatus(`Uploading ${file.name}…`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("templateId", templateId);
      formData.append("fieldKey", field.key);

      const response = await fetch("/api/experiments/video-studio/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as UploadRecord & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Upload failed.");
      }

      onUploaded(payload);
      setStatus(`Stored ${payload.filename}`);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Upload failed unexpectedly.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="cw-vs__upload">
      <span className="cw-vs__field-label">{field.label}</span>
      <input
        type="file"
        accept={field.type === "file-video" ? "video/*" : "image/*"}
        disabled={isUploading}
        onChange={handleChange}
      />
      {field.helpText ? <p className="cw-vs__field-help">{field.helpText}</p> : null}
      {status ? <p className="cw-vs__upload-meta">{status}</p> : null}
    </div>
  );
}

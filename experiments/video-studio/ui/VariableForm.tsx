"use client";

import type { TemplateField, TemplateInputProps } from "@/experiments/video-studio/types";
import styles from "@/experiments/video-studio/ui/video-studio.module.css";
import { FootageUploader } from "@/experiments/video-studio/ui/FootageUploader";

type VariableFormProps = {
  fields: TemplateField[];
  values: TemplateInputProps;
  templateId: string;
  onChange: (key: string, value: string | number) => void;
  onUploadComplete: (fieldKey: string, uploadId: string, publicUrl: string) => void;
};

export function VariableForm({
  fields,
  values,
  templateId,
  onChange,
  onUploadComplete,
}: VariableFormProps) {
  return (
    <div className={styles.vsFieldGrid}>
      {fields.map((field) => {
        if (field.type === "file-video" || field.type === "file-image") {
          return (
            <FootageUploader
              key={field.key}
              field={field}
              templateId={templateId}
              onUploaded={(upload) => onUploadComplete(field.key, upload.id, upload.publicUrl)}
            />
          );
        }

        const value = values[field.key] ?? field.defaultValue;

        return (
          <div key={field.key} className={styles.vsField}>
            <label>
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  value={String(value)}
                  placeholder={field.placeholder}
                  onChange={(event) => onChange(field.key, event.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  value={String(value)}
                  onChange={(event) => onChange(field.key, event.target.value)}
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "color" ? "color" : field.type === "number" ? "number" : "text"}
                  value={String(value)}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    onChange(
                      field.key,
                      field.type === "number"
                        ? Number(event.target.value)
                        : event.target.value,
                    )
                  }
                />
              )}
            </label>
            {field.helpText ? <p className={styles.vsHelp}>{field.helpText}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

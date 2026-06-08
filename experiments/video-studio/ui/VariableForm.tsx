"use client";

import type { TemplateField, TemplateInputProps } from "@/experiments/video-studio/types";
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
    <div className="cw-vs__fields">
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

        if (field.type === "color") {
          return (
            <div key={field.key} className="cw-vs__field">
              <label>
                <span className="cw-vs__field-label">{field.label}</span>
                <div className="cw-vs__color">
                  <span className="cw-vs__color-swatch">
                    <span
                      className="cw-vs__color-fill"
                      style={{ backgroundColor: String(value) }}
                      aria-hidden="true"
                    />
                    <input
                      type="color"
                      value={String(value)}
                      onChange={(event) => onChange(field.key, event.target.value)}
                    />
                  </span>
                  <input
                    type="text"
                    value={String(value)}
                    placeholder={field.placeholder}
                    onChange={(event) => onChange(field.key, event.target.value)}
                  />
                </div>
              </label>
              {field.helpText ? (
                <p className="cw-vs__field-help">{field.helpText}</p>
              ) : null}
            </div>
          );
        }

        return (
          <div key={field.key} className="cw-vs__field">
            <label>
              <span className="cw-vs__field-label">{field.label}</span>
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
                  type={field.type === "number" ? "number" : "text"}
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
            {field.helpText ? (
              <p className="cw-vs__field-help">{field.helpText}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

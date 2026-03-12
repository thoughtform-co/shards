"use client";
/* eslint-disable @next/next/no-img-element */

import type { ChangeEvent, FormEvent } from "react";
import { ImagePlus, LoaderCircle, Sparkles, Upload } from "lucide-react";
import styles from "./JukeboxPageV2.module.css";

type JukeboxUploadDockProps = {
  previewUrl: string | null;
  loading: boolean;
  error: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  style?: React.CSSProperties;
};

export function JukeboxUploadDock({
  previewUrl,
  loading,
  error,
  onFileChange,
  onSubmit,
  style,
}: JukeboxUploadDockProps) {
  return (
    <form className={styles.uploadOverlay} onSubmit={onSubmit} style={style}>
      <div className={styles.uploadPreview}>
        {previewUrl ? (
          <img src={previewUrl} alt="Upload preview" className={styles.uploadImg} />
        ) : (
          <div className={styles.uploadPlaceholder}>
            <ImagePlus className={styles.uploadPlaceholderIcon} />
            <span>Drop a photo</span>
          </div>
        )}
      </div>

      <div className={styles.uploadActions}>
        <label className={styles.uploadBtn}>
          <Upload style={{ width: 13, height: 13 }} />
          Choose
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
        </label>
        <button type="submit" className={styles.spinBtn} disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle
                style={{ width: 13, height: 13, animation: "spin 900ms linear infinite" }}
              />
              Spinning
            </>
          ) : (
            <>
              <Sparkles style={{ width: 13, height: 13 }} />
              Spin
            </>
          )}
        </button>
      </div>

      {error && <p className={styles.uploadError}>{error}</p>}
    </form>
  );
}

"use client";

import styles from "@/experiments/video-studio/ui/video-studio.module.css";

type RenderPanelProps = {
  isRendering: boolean;
  status: string;
  downloadUrl?: string;
  onRender: () => void;
};

export function RenderPanel({
  isRendering,
  status,
  downloadUrl,
  onRender,
}: RenderPanelProps) {
  return (
    <div>
      <div className={styles.vsActions}>
        <button
          type="button"
          className={styles.vsButton}
          disabled={isRendering}
          onClick={onRender}
        >
          {isRendering ? "Rendering…" : "Render MP4 locally"}
        </button>
        {downloadUrl ? (
          <a className={`${styles.vsButton} ${styles.vsButtonSecondary}`} href={downloadUrl}>
            Download MP4
          </a>
        ) : null}
      </div>
      {status ? <p className={styles.vsStatus}>{status}</p> : null}
    </div>
  );
}

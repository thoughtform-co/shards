"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent } from "react";
import { JukeboxScene } from "./JukeboxScene";
import type { OverlayRect } from "./JukeboxScene";
import { JukeboxUploadDock } from "./JukeboxUploadDock";
import { JukeboxPlaylistDisplay } from "./JukeboxPlaylistDisplay";
import styles from "./JukeboxPageV2.module.css";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

type PlaylistTrack = {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  image: string | null;
  url: string;
  previewUrl: string | null;
};

type AnalyzeResponse = {
  mode: "live" | "hybrid" | "mock";
  analysisSource: "live" | "mock";
  playlistSource: "live" | "mock";
  playableCount: number;
  playlistTitle: string;
  objectiveDescription: string;
  vibeDescription: string;
  artistSeeds: string[];
  tracks: PlaylistTrack[];
};

export function JukeboxPageV2() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  const [displayStyle, setDisplayStyle] = useState<CSSProperties>({});
  const [uploadStyle, setUploadStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const sceneMode = useMemo(() => {
    if (loading) return "generating" as const;
    if (activeTrackId) return "playing" as const;
    return "idle" as const;
  }, [loading, activeTrackId]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Image too large. Keep uploads under 20 MB.");
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setActiveTrackId(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) {
      setError("Drop a photo first.");
      return;
    }
    setLoading(true);
    setError(null);
    setActiveTrackId(null);

    try {
      const fd = new FormData();
      fd.append("image", selectedFile);
      const res = await fetch("/api/experiments/image-to-spotify/analyze", {
        method: "POST",
        body: fd,
      });
      const payload = (await res.json()) as AnalyzeResponse & {
        error?: string;
      };
      if (!res.ok) throw new Error(payload.error || "Lost signal.");
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lost signal.");
    } finally {
      setLoading(false);
    }
  }

  const selectTrack = useCallback(
    (track: PlaylistTrack) => {
      setActiveTrackId((prev) => (prev === track.id ? null : track.id));
    },
    [],
  );

  const handleOverlayRects = useCallback(
    (rects: { display: OverlayRect; upload: OverlayRect }) => {
      const displayPad = 4;
      setDisplayStyle({
        position: "absolute",
        top: rects.display.top + displayPad,
        left: rects.display.left + displayPad,
        width: rects.display.width - displayPad * 2,
        height: rects.display.height - displayPad * 2,
      });
      setUploadStyle({
        position: "absolute",
        top: rects.upload.top,
        left: rects.upload.left,
        width: rects.upload.width,
        height: rects.upload.height,
      });
    },
    [],
  );

  return (
    <section className={styles.page}>
      <div className={styles.stage}>
        <JukeboxScene
          mode={sceneMode}
          analyserNode={null}
          className={styles.sceneLayer}
          onOverlayRectsReady={handleOverlayRects}
        />

        <JukeboxPlaylistDisplay
          title={result?.playlistTitle ?? "Ready To Spin"}
          vibeDescription={result?.vibeDescription}
          playlistSource={result?.playlistSource}
          tracks={result?.tracks ?? []}
          idleCopy={
            result
              ? "Choose a track to preview."
              : "Upload a photo and the playlist will appear here."
          }
          activeTrackId={activeTrackId}
          onSelectTrack={selectTrack}
          style={displayStyle}
        />

        <JukeboxUploadDock
          previewUrl={previewUrl}
          loading={loading}
          error={error}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          style={uploadStyle}
        />
      </div>
    </section>
  );
}

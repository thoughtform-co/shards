"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Disc3,
  ExternalLink,
  ImagePlus,
  LoaderCircle,
  Music2,
  Play,
  Radio,
  Sparkles,
  Upload,
} from "lucide-react";
import styles from "./JukeboxPage.module.css";
import { JukeboxVisualizer } from "./JukeboxVisualizer";

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

export function JukeboxPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const visualizerMode = useMemo(() => {
    if (loading) return "generating" as const;
    if (activeTrackId) return "playing" as const;
    return "idle" as const;
  }, [loading, activeTrackId]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setActiveTrackId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      setError("Drop a photo into the window first.");
      return;
    }
    setLoading(true);
    setError(null);
    setActiveTrackId(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await fetch("/api/experiments/image-to-spotify/analyze", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as AnalyzeResponse & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || "The jukebox lost the signal.");
      }
      setResult(payload);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The jukebox lost the signal.",
      );
    } finally {
      setLoading(false);
    }
  }

  const playTrack = useCallback(
    (track: PlaylistTrack) => {
      setActiveTrackId((prev) => (prev === track.id ? null : track.id));
    },
    [],
  );

  const isMock = result?.playlistSource !== "live";

  return (
    <section className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.topBarTitle}>Image to Spotify</h1>
        <p className={styles.topBarSub}>
          Drop a photo, spin a playlist.
        </p>
      </div>

      <div className={styles.grid}>
        {/* ── Left: Upload ── */}
        <form className={styles.uploadPanel} onSubmit={handleSubmit}>
          <p className={styles.panelLabelBlue}>
            <ImagePlus
              style={{ width: 14, height: 14, display: "inline", verticalAlign: -2, marginRight: 6 }}
            />
            Upload
          </p>

          <div className={styles.window}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected upload preview"
                className={styles.preview}
              />
            ) : (
              <div className={styles.placeholder}>
                <ImagePlus className={styles.placeholderIcon} />
                <p>Drop in a photo or pick one below.</p>
                <span>Portraits, posters, event photos, stills.</span>
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <label className={styles.secondaryButton}>
              <Upload className={styles.buttonIcon} />
              Choose image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className={styles.hiddenInput}
                onChange={handleFileChange}
              />
            </label>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className={`${styles.buttonIcon} ${styles.spin}`}
                  />
                  Spinning
                </>
              ) : (
                <>
                  <Sparkles className={styles.buttonIcon} />
                  Spin playlist
                </>
              )}
            </button>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}
        </form>

        {/* ── Right: Output / Player ── */}
        <div className={styles.outputPanel}>
          <div className={styles.visualizerWrap}>
            <JukeboxVisualizer
              mode={visualizerMode}
              analyserNode={null}
              className={styles.visualizerWrap}
            />
          </div>

          <p className={styles.panelLabelPink}>
            <Radio
              style={{ width: 14, height: 14, display: "inline", verticalAlign: -2, marginRight: 6 }}
            />
            Playlist
          </p>

          {result ? (
            <>
              <h2 className={styles.playlistTitle}>
                {result.playlistTitle}
              </h2>
              <p className={styles.vibeDescription}>
                {result.vibeDescription}
              </p>

              {isMock && (
                <div className={styles.playerNotice}>
                  <p>
                    This spin returned a fallback mix. Tracks link to Spotify
                    search instead of an in-app preview.
                  </p>
                </div>
              )}

              {!isMock && activeTrackId && (
                <iframe
                  key={activeTrackId}
                  className={styles.spotifyEmbed}
                  src={`https://open.spotify.com/embed/track/${activeTrackId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify player"
                />
              )}

              <div className={styles.trackList}>
                {result.tracks.map((track) => {
                  const isActive = activeTrackId === track.id;

                  return (
                    <div
                      key={track.id}
                      className={`${styles.track} ${isActive ? styles.trackActive : ""}`}
                      onClick={() => isMock ? undefined : playTrack(track)}
                      role={isMock ? undefined : "button"}
                      tabIndex={isMock ? undefined : 0}
                    >
                      {track.image ? (
                        <img
                          src={track.image}
                          alt=""
                          className={styles.trackArtwork}
                        />
                      ) : (
                        <div className={styles.trackArtworkFallback}>
                          <Disc3 className={styles.trackFallbackIcon} />
                        </div>
                      )}

                      <div className={styles.trackMeta}>
                        <strong>{track.name}</strong>
                        <span>{track.artists.join(", ")}</span>
                      </div>

                      <div className={styles.trackActions}>
                        {!isMock && (
                          <button
                            type="button"
                            className={styles.trackPlayBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              playTrack(track);
                            }}
                            aria-label={isActive ? "Playing" : "Play"}
                          >
                            <Play className={styles.trackPlayBtnIcon} />
                          </button>
                        )}
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Open in Spotify"
                        >
                          <ExternalLink className={styles.trackLinkIcon} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Music2 className={styles.emptyIcon} />
              <p>
                Upload a photo and spin the jukebox to generate a playlist here.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

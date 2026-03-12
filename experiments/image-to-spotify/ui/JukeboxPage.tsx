"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Disc3,
  ImagePlus,
  LoaderCircle,
  Music2,
  Radio,
  Sparkles,
  Upload,
} from "lucide-react";
import { imageToSpotifyManifest } from "@/experiments/image-to-spotify/manifest";
import styles from "./JukeboxPage.module.css";

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

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const statusCopy = useMemo(() => {
    if (loading) {
      return "Spinning image cues into a playlist.";
    }

    if (result?.mode === "live") {
      return "Live analysis and Spotify recommendations are online.";
    }

    if (result?.mode === "hybrid") {
      return "Claude or Spotify answered, and the rest fell back to preview mode.";
    }

    if (result?.mode === "mock") {
      return "Preview mode is active until API keys are added.";
    }

    return "Upload a photo to wake the jukebox.";
  }, [loading, result]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Load a photo into the jukebox window first.");
      return;
    }

    setLoading(true);
    setError(null);

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

  return (
    <section className={styles.page}>
      <div className={styles.marquee}>
        <div>
          <span>{imageToSpotifyManifest.title}</span>
          <span>Claude vision + Spotify preview</span>
          <span>Retro jukebox route</span>
          <span>{imageToSpotifyManifest.strap}</span>
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Radio className={styles.eyebrowIcon} />
            route / {imageToSpotifyManifest.slug}
          </p>
          <h1 className={styles.title}>Image to Spotify</h1>
          <p className={styles.lead}>
            A campus-media jukebox: drop in a portrait, poster, outfit shot, or
            whatever visual clue you have. Claude makes a creative read, then the
            route spins a playlist preview to match the mood.
          </p>
        </div>

        <div className={styles.heroTelemetry}>
          <div className={styles.telemetryCard}>
            <span>mode</span>
            <strong>{result?.mode ?? "ready"}</strong>
          </div>
          <div className={styles.telemetryCard}>
            <span>status</span>
            <strong>{statusCopy}</strong>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <form className={styles.machine} onSubmit={handleSubmit}>
          <div className={styles.machineHeader}>
            <div>
              <p className={styles.panelLabel}>jukebox window</p>
              <p className={styles.panelValue}>Photo input stage</p>
            </div>
            <Disc3 className={styles.machineIcon} />
          </div>

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
                <span>
                  Portraits, style shots, event photos, posters, or stills all work.
                </span>
              </div>
            )}
            <div className={styles.windowOverlay} />
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
                  <LoaderCircle className={`${styles.buttonIcon} ${styles.spin}`} />
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

          <div className={styles.metadataStrip}>
            <div>
              <span>loaded file</span>
              <strong>{selectedFile?.name ?? "none loaded"}</strong>
            </div>
            <div>
              <span>input size</span>
              <strong>
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "--"}
              </strong>
            </div>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}
        </form>

        <div className={styles.resultsColumn}>
          <article className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <div>
                <p className={styles.panelLabel}>visual readout</p>
                <h2 className={styles.resultTitle}>
                  {result?.playlistTitle ?? "No playlist spun yet"}
                </h2>
              </div>
              <div className={styles.modePill}>{result?.mode ?? "ready"}</div>
            </div>

            {result ? (
              <div className={styles.analysisStack}>
                <section>
                  <p className={styles.analysisLabel}>Objective read</p>
                  <p className={styles.analysisCopy}>{result.objectiveDescription}</p>
                </section>
                <section>
                  <p className={styles.analysisLabel}>Creative vibe</p>
                  <p className={styles.analysisCopy}>{result.vibeDescription}</p>
                </section>
                <section>
                  <p className={styles.analysisLabel}>Artist seeds</p>
                  <div className={styles.chipRow}>
                    {result.artistSeeds.map((seed) => (
                      <span key={seed} className={styles.chip}>
                        {seed}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Music2 className={styles.emptyIcon} />
                <p>
                  The readout panel will show the visual analysis, a playful title,
                  and the artist seeds used to build the playlist preview.
                </p>
              </div>
            )}
          </article>

          <article className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <div>
                <p className={styles.panelLabel}>playlist preview</p>
                <h2 className={styles.resultTitle}>Queue</h2>
              </div>
              <div className={styles.modePill}>
                {result?.tracks.length ?? 0}
                <span>tracks</span>
              </div>
            </div>

            {result?.tracks.length ? (
              <div className={styles.trackList}>
                {result.tracks.map((track) => (
                  <a
                    key={track.id}
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.track}
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
                      <small>{track.albumName}</small>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Radio className={styles.emptyIcon} />
                <p>
                  Once a photo is loaded, this queue fills with Spotify-ready links.
                  If keys are missing, the route still produces a preview set so the
                  workflow remains demoable.
                </p>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

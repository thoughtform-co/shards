"use client";
/* eslint-disable @next/next/no-img-element */

import { Disc3, ExternalLink, Play } from "lucide-react";
import styles from "./JukeboxPageV2.module.css";

type Track = {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  image: string | null;
  url: string;
  previewUrl: string | null;
};

type JukeboxPlaylistDisplayProps = {
  title: string;
  vibeDescription?: string;
  playlistSource?: "live" | "mock";
  tracks: Track[];
  idleCopy?: string;
  activeTrackId: string | null;
  onSelectTrack: (track: Track) => void;
  style?: React.CSSProperties;
};

export function JukeboxPlaylistDisplay({
  title,
  vibeDescription,
  playlistSource,
  tracks,
  idleCopy,
  activeTrackId,
  onSelectTrack,
  style,
}: JukeboxPlaylistDisplayProps) {
  const isMock = playlistSource !== "live";

  return (
    <div className={styles.displayOverlay} style={style}>
      <h2 className={styles.displayTitle}>{title}</h2>
      {vibeDescription && (
        <p className={styles.vibeDescription}>{vibeDescription}</p>
      )}

      {isMock && tracks.length > 0 && (
        <div className={styles.playerNotice}>
          <p>Fallback mix. Tracks link to Spotify search.</p>
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

      {tracks.length > 0 ? (
        <div className={styles.trackList}>
          {tracks.map((track) => {
            const active = track.id === activeTrackId;

            return (
              <div
                key={track.id}
                className={`${styles.track} ${active ? styles.trackActive : ""}`}
                onClick={() => !isMock && onSelectTrack(track)}
                role={isMock ? undefined : "button"}
                tabIndex={isMock ? undefined : 0}
              >
                {track.image ? (
                  <img src={track.image} alt="" className={styles.trackArt} />
                ) : (
                  <div className={styles.trackArtFallback}>
                    <Disc3 style={{ width: 14, height: 14 }} />
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
                        onSelectTrack(track);
                      }}
                      aria-label={active ? "Playing" : "Play"}
                    >
                      <Play style={{ width: 11, height: 11 }} />
                    </button>
                  )}
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={styles.trackLink}
                  >
                    <ExternalLink style={{ width: 12, height: 12 }} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.displayIdle}>
          <span className={styles.displayIdleLabel}>ZooMedia Playlist Screen</span>
          <p>{idleCopy ?? "Drop a photo to wake the jukebox."}</p>
        </div>
      )}
    </div>
  );
}

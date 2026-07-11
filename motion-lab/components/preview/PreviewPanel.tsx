"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  Player,
  type CallbackListener,
  type PlayerRef,
} from "@remotion/player";

import { useRafThrottled } from "../../lib/hooks/useRafThrottled";
import { totalDurationInFrames } from "../../lib/motiondoc/timing";
import { useStudioStore } from "../../lib/store/useStudioStore";
import { MotionComposition } from "../../remotion/MotionComposition";

function formatTimecode(frame: number, fps: number): string {
  const seconds = frame / fps;
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  const ff = Math.floor(frame % fps)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}:${ff}`;
}

export function PreviewPanel() {
  const doc = useStudioStore((s) => s.doc);
  const playhead = useStudioStore((s) => s.playhead);
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const togglePlay = useStudioStore((s) => s.togglePlay);
  const registerPlayer = useStudioStore((s) => s.registerPlayer);
  const setPlayheadFromPlayer = useStudioStore((s) => s.setPlayheadFromPlayer);
  const setIsPlaying = useStudioStore((s) => s.setIsPlaying);

  /* At most one new inputProps identity per animation frame while
     dragging keyframes. */
  const throttledDoc = useRafThrottled(doc);
  const inputProps = useMemo(() => ({ doc: throttledDoc }), [throttledDoc]);
  const durationInFrames = useMemo(
    () => totalDurationInFrames(throttledDoc),
    [throttledDoc],
  );

  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    registerPlayer({
      seekTo: (frame) => player.seekTo(frame),
      play: () => player.play(),
      pause: () => player.pause(),
    });

    const onFrame: CallbackListener<"frameupdate"> = (e) => {
      setPlayheadFromPlayer(e.detail.frame);
    };
    const onPlay: CallbackListener<"play"> = () => setIsPlaying(true);
    const onPause: CallbackListener<"pause"> = () => setIsPlaying(false);
    const onEnded: CallbackListener<"ended"> = () => setIsPlaying(false);

    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
      registerPlayer(null);
    };
  }, [registerPlayer, setPlayheadFromPlayer, setIsPlaying]);

  return (
    <div className="ml-preview">
      <div className="ml-preview__stage">
        <Player
          ref={playerRef}
          component={MotionComposition}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          fps={throttledDoc.meta.fps}
          compositionWidth={throttledDoc.meta.width}
          compositionHeight={throttledDoc.meta.height}
          style={{ width: "100%", height: "100%" }}
          loop
          acknowledgeRemotionLicense
        />
      </div>
      <div className="ml-preview__transport">
        <button
          type="button"
          className="ml-btn ml-btn--primary ml-preview__play"
          onClick={togglePlay}
          title="Play/Pause (Space)"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <span className="ml-preview__timecode">
          {formatTimecode(playhead, doc.meta.fps)}
          <span className="ml-preview__timecode-total">
            {" "}
            / {formatTimecode(durationInFrames, doc.meta.fps)}
          </span>
        </span>
        <span className="ml-preview__meta">
          f{Math.round(playhead)} · {doc.meta.width}×{doc.meta.height} ·{" "}
          {doc.meta.fps}fps · {doc.meta.format}
        </span>
      </div>
    </div>
  );
}

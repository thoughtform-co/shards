"use client";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import { addKeyframe, type TrackAddress } from "../../lib/motiondoc/mutate";
import { sampleTrack } from "../../lib/motiondoc/sample";
import type { MotionElement, MotionDoc, Track } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

import { KeyframeDiamond } from "./KeyframeDiamond";

/*
 * One animated property of one element. Double-click adds a keyframe
 * at the clicked frame with the CURRENT sampled value (so adding a
 * keyframe never visibly changes the animation — it pins it).
 */
export function PropertyLane({
  doc,
  element,
  track,
  sceneId,
  sceneStart,
  sceneDuration,
  fps,
  geometry,
}: {
  doc: MotionDoc;
  element: MotionElement;
  track: Track;
  sceneId: string;
  sceneStart: number;
  sceneDuration: number;
  fps: number;
  geometry: TimelineGeometry;
}) {
  const commitDoc = useStudioStore((s) => s.commitDoc);
  const select = useStudioStore((s) => s.select);

  const addr: TrackAddress = {
    sceneId,
    elementId: element.id,
    property: track.property,
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const laneRect = e.currentTarget.getBoundingClientRect();
    const contentX = e.clientX - laneRect.left;
    const globalFrame = geometry.pxToFrame(contentX);
    const frame = Math.max(
      0,
      Math.min(Math.round(globalFrame - sceneStart), sceneDuration),
    );
    const fallback = { x: element.x, y: element.y, scale: element.scale, rotation: element.rotation, opacity: element.opacity }[track.property];
    const value = sampleTrack({ track, frame, fps, fallback });
    const result = addKeyframe(doc, addr, { frame, value });
    commitDoc(result.doc);
    select({
      type: "keyframe",
      sceneId,
      elementId: element.id,
      property: track.property,
      keyframeId: result.keyframeId,
    });
  };

  return (
    <div className="ml-lane">
      <span className="ml-lane__label">{track.property}</span>
      <div className="ml-lane__area" onDoubleClick={onDoubleClick}>
        {/* segment bar from first to last keyframe */}
        <div
          className="ml-lane__span"
          style={{
            left: geometry.frameToPx(sceneStart + track.keyframes[0].frame),
            width: Math.max(
              2,
              geometry.framesToPx(
                track.keyframes[track.keyframes.length - 1].frame -
                  track.keyframes[0].frame,
              ),
            ),
          }}
        />
        {track.keyframes.map((kf) => (
          <KeyframeDiamond
            key={kf.id}
            addr={addr}
            keyframe={kf}
            sceneStart={sceneStart}
            sceneDuration={sceneDuration}
            siblingFrames={track.keyframes
              .filter((k) => k.id !== kf.id)
              .map((k) => k.frame)}
            geometry={geometry}
          />
        ))}
      </div>
    </div>
  );
}

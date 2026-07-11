import { Composition } from "remotion";

import { EXAMPLES } from "../lib/examples";
import { totalDurationInFrames } from "../lib/motiondoc/timing";

import { MotionComposition, type MotionCompositionProps } from "./MotionComposition";

/*
 * One composition, everything driven by inputProps. The static
 * duration/size values below are placeholders — calculateMetadata
 * derives the real ones from the doc on every render/preview.
 */
export function RemotionRoot() {
  return (
    <Composition
      id="MotionDoc"
      component={MotionComposition}
      defaultProps={{ doc: EXAMPLES[0].doc } satisfies MotionCompositionProps}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={({ props }) => ({
        durationInFrames: totalDurationInFrames(props.doc),
        fps: props.doc.meta.fps,
        width: props.doc.meta.width,
        height: props.doc.meta.height,
      })}
    />
  );
}

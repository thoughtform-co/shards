import { Composition, registerRoot } from "remotion";
import { DeckExplainer } from "@/experiments/video-studio/templates/remotion/DeckExplainer";
import { DeckExplainerSeries } from "@/experiments/video-studio/templates/remotion/DeckExplainerSeries";
import {
  defaultDeckExplainerProps,
} from "@/experiments/video-studio/templates/remotion/deck-explainer-props";
import {
  defaultDeckExplainerSeriesProps,
  totalSeriesDurationFrames,
} from "@/experiments/video-studio/templates/remotion/deck-series-props";
import { SocialVariantSet } from "@/experiments/video-studio/templates/remotion/SocialVariantSet";
import {
  defaultSocialVariantProps,
} from "@/experiments/video-studio/templates/remotion/social-variant-props";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="deck-explainer"
        component={DeckExplainer}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultDeckExplainerProps}
      />
      <Composition
        id="deck-explainer-series"
        component={DeckExplainerSeries}
        durationInFrames={totalSeriesDurationFrames(
          defaultDeckExplainerSeriesProps.scenes,
          30,
        )}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultDeckExplainerSeriesProps}
        calculateMetadata={({ props }) => {
          const seriesProps = props as typeof defaultDeckExplainerSeriesProps;

          return {
            durationInFrames: totalSeriesDurationFrames(seriesProps.scenes, 30),
          };
        }}
      />
      <Composition
        id="social-variant-set"
        component={SocialVariantSet}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultSocialVariantProps}
      />
    </>
  );
};

registerRoot(RemotionRoot);

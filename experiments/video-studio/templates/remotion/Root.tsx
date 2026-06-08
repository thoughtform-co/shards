import { Composition, registerRoot } from "remotion";
import { DeckExplainer } from "@/experiments/video-studio/templates/remotion/DeckExplainer";
import {
  defaultDeckExplainerProps,
} from "@/experiments/video-studio/templates/remotion/deck-explainer-props";
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

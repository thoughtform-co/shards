import type { TemplateInputProps } from "@/experiments/video-studio/types";

export type SocialVariantProps = {
  headline: string;
  subheadline: string;
  variantLabel: string;
  accentColor: string;
  backgroundColor: string;
};

export const defaultSocialVariantProps: SocialVariantProps = {
  headline: "New drop this week",
  subheadline: "Same template. Different headline. Batch-ready.",
  variantLabel: "Variant A",
  accentColor: "#7A63B3",
  backgroundColor: "#0A0810",
};

export function resolveSocialVariantProps(
  input: TemplateInputProps,
): SocialVariantProps {
  return {
    headline: String(input.headline ?? defaultSocialVariantProps.headline),
    subheadline: String(
      input.subheadline ?? defaultSocialVariantProps.subheadline,
    ),
    variantLabel: String(
      input.variantLabel ?? defaultSocialVariantProps.variantLabel,
    ),
    accentColor: String(
      input.accentColor ?? defaultSocialVariantProps.accentColor,
    ),
    backgroundColor: String(
      input.backgroundColor ?? defaultSocialVariantProps.backgroundColor,
    ),
  };
}

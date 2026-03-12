export type ExperimentStatus = "scaffolded" | "live" | "planned";

export type ExperimentAccentMode = "thoughtform" | "custom";

export type ExperimentManifest = {
  slug: string;
  title: string;
  strap: string;
  summary: string;
  status: ExperimentStatus;
  href: `/experiments/${string}`;
  tags: string[];
  tech: string[];
  accentMode: ExperimentAccentMode;
  cardAccent: {
    from: string;
    via: string;
    to: string;
    glow: string;
  };
};

export type StudioTabId =
  | "pptx"
  | "interview-captioner"
  | "social-cutdown"
  | "deck-explainer"
  | "social-variant-set";

export type StudioTab = {
  id: StudioTabId;
  label: string;
  templateId: string;
  engine: "remotion" | "hyperframes";
};

export const studioTabs: StudioTab[] = [
  {
    id: "pptx",
    label: "From PowerPoint",
    templateId: "deck-explainer-series",
    engine: "remotion",
  },
  {
    id: "interview-captioner",
    label: "Interview captioner",
    templateId: "interview-captioner",
    engine: "hyperframes",
  },
  {
    id: "social-cutdown",
    label: "Social cut-down",
    templateId: "social-cutdown",
    engine: "hyperframes",
  },
  {
    id: "deck-explainer",
    label: "Deck explainer",
    templateId: "deck-explainer",
    engine: "remotion",
  },
  {
    id: "social-variant-set",
    label: "Variant set",
    templateId: "social-variant-set",
    engine: "remotion",
  },
];

export function getStudioTab(id: StudioTabId) {
  return studioTabs.find((tab) => tab.id === id) ?? studioTabs[0]!;
}

"use client";

import type { StudioTab, StudioTabId } from "@/experiments/video-studio/studio-tabs";

type StudioTabsProps = {
  tabs: StudioTab[];
  activeTab: StudioTabId;
  onChange: (tabId: StudioTabId) => void;
};

export function StudioTabs({ tabs, activeTab, onChange }: StudioTabsProps) {
  return (
    <div className="cw-vs__tabs" role="tablist" aria-label="Video input modes">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`cw-vs__tab ${activeTab === tab.id ? "cw-vs__tab--active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

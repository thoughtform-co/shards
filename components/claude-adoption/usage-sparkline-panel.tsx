"use client";

import { useCallback, useState } from "react";

import type { CaSparklineViewId, CaSparklineViews } from "@/content/claude-adoption";

import { UsageSparkline } from "./usage-sparkline";

const SPARKLINE_TABS: readonly {
  id: CaSparklineViewId;
  label: string;
}[] = [
  { id: "onboarded", label: "Onboarded" },
  { id: "wau", label: "WAU" },
] as const;

export function UsageSparklinePanel({ views }: { views: CaSparklineViews }) {
  const [active, setActive] = useState<CaSparklineViewId>(views.defaultView);
  const data = views.views[active];

  const onTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const next =
        e.key === "ArrowRight"
          ? (index + 1) % SPARKLINE_TABS.length
          : (index - 1 + SPARKLINE_TABS.length) % SPARKLINE_TABS.length;
      setActive(SPARKLINE_TABS[next]!.id);
    },
    [],
  );

  return (
    <UsageSparkline
      data={data}
      headerSlot={
        <div
          className="ca-sparkline-tabs"
          role="tablist"
          aria-label="Active users metric"
        >
          <div className="ca-sparkline-tabs__group">
            {SPARKLINE_TABS.map((tab, idx) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  className="ca-sparkline-tabs__btn"
                  data-active={isActive ? "true" : undefined}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  onKeyDown={(e) => onTabKeyDown(e, idx)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

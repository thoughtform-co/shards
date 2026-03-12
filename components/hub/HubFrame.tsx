import type { PropsWithChildren, ReactNode } from "react";

type HubFrameProps = PropsWithChildren<{
  masthead?: ReactNode;
  aside?: ReactNode;
}>;

const TICK_COUNT = 24;
const MAJOR_INDICES = new Set([6, 12, 18]);
const TICK_LABELS: Record<number, string> = { 6: "2", 12: "5", 18: "7" };
const RAIL_WIDTH = 48;

function Rail({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <aside
      className="hud-rail-tick"
      aria-hidden="true"
      style={{
        top: "calc(var(--hud-padding) + 24px)",
        bottom: "calc(var(--hud-padding) + 24px)",
        [side]: "var(--hud-padding)",
        width: RAIL_WIDTH,
      }}
    >
      <div
        className={`absolute ${isLeft ? "left-0" : "right-0"} top-0 bottom-0 w-[1px]`}
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--dawn-30) 10%, var(--dawn-30) 90%, transparent 100%)",
        }}
      />
      <div
        className={`absolute ${isLeft ? "left-0" : "right-0"} top-0 bottom-0 flex flex-col justify-between ${!isLeft ? "items-end" : ""}`}
      >
        {Array.from({ length: TICK_COUNT + 1 }).map((_, i) => {
          const isMajor = MAJOR_INDICES.has(i);
          return (
            <div key={i} className="relative">
              <div
                style={{
                  height: 1,
                  width: isMajor ? 20 : 10,
                  background: isMajor ? "var(--gold)" : "var(--gold-30)",
                }}
              />
              {isLeft && TICK_LABELS[i] && (
                <span
                  className="absolute"
                  style={{
                    top: -4,
                    left: 28,
                    color: "var(--dawn-30)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                  }}
                >
                  {TICK_LABELS[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function HubFrame({ children, masthead, aside }: HubFrameProps) {
  return (
    <div className="relative min-h-screen">
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--tr" />
      <div className="hud-corner hud-corner--bl" />
      <div className="hud-corner hud-corner--br" />

      <Rail side="left" />
      <Rail side="right" />

      <div className="shards-shell shards-shell--railed">
        {(masthead || aside) && (
          <div className="mb-8 shards-grid shards-grid--hub items-start">
            <div>{masthead}</div>
            <div>{aside}</div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

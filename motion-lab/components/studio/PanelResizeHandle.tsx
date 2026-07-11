"use client";

import { useRef } from "react";

export function PanelResizeHandle({
  axis,
  onDelta,
  invert = false,
}: {
  axis: "x" | "y";
  onDelta: (delta: number) => void;
  invert?: boolean;
}) {
  const drag = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      className={`ml-resizer ml-resizer--${axis}`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        const delta =
          axis === "x"
            ? event.clientX - drag.current.x
            : event.clientY - drag.current.y;
        drag.current = { x: event.clientX, y: event.clientY };
        onDelta(delta * (invert ? -1 : 1));
      }}
      onPointerUp={(event) => {
        drag.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
    />
  );
}

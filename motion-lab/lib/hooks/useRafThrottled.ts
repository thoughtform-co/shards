"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Coalesces a fast-changing value to at most one update per animation
 * frame. The <Player> subscribes to the doc through this so a 60Hz
 * keyframe drag doesn't force 60 inputProps identities per second.
 */
export function useRafThrottled<T>(value: T): T {
  const [throttled, setThrottled] = useState(value);
  const latestRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    latestRef.current = value;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setThrottled(latestRef.current);
    });
  }, [value]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return throttled;
}

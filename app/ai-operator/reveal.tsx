"use client";

import { useEffect } from "react";

/*
 * ScrollReveal — adds `is-in` to any `.aiop-reveal` element when it
 * enters the viewport. One IntersectionObserver per page, no per-element
 * JSX wrapper. The CSS owns the actual transition. Reduced-motion users
 * skip the entrance entirely (handled in `ai-operator.css`).
 *
 * Scoping: we only observe reveal elements that live under an
 * `.aiop-stage` container. That keeps the route-local class from
 * accidentally affecting unrelated parts of the app if the convention
 * is ever reused, and gives us a single, predictable root.
 *
 * Safety net: `IntersectionObserver` may be missing on some old
 * environments. The CSS already starts reveal elements hidden, so if
 * the observer can't be constructed we fall back to revealing every
 * element immediately rather than leaving the page blank.
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".aiop-stage .aiop-reveal"),
    );
    if (targets.length === 0) return;

    const reveal = (el: HTMLElement) => el.classList.add("is-in");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      targets.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

/*
 * ScrollReveal — adds `is-in` to any `.mk-reveal` element when it enters
 * the viewport. One IntersectionObserver per page, no per-element JSX
 * wrapper. The CSS owns the actual transition. Reduced-motion users
 * skip the entrance entirely (handled in `momkai-brand-agent.css`).
 */
export function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document
        .querySelectorAll<HTMLElement>(".mk-reveal")
        .forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    document
      .querySelectorAll<HTMLElement>(".mk-reveal")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}

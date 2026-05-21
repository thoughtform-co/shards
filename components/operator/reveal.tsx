"use client";

import { useEffect } from "react";

/*
 * ScrollReveal — adds `is-in` to any `.aiop-reveal` element when it
 * enters the viewport.
 *
 * The component does three things on mount:
 *
 *   1. Adds `body.aiop-reveals`. This is the JS-opt-in latch the
 *      operator CSS reads to switch `.aiop-reveal` from its default
 *      "visible" state into the "hidden until is-in" animated state.
 *      Without this latch, server-rendered HTML / no-JS fallbacks /
 *      first paint all stay visible — matching the homepage `.reveal`
 *      pattern in `globals.css`.
 *
 *   2. Sets up a single IntersectionObserver scoped to
 *      `.aiop-stage .aiop-reveal`. The first element to intersect
 *      gets `.is-in` and is unobserved.
 *
 *   3. Sets up a MutationObserver on the `.aiop-stage` subtree so
 *      `.aiop-reveal` elements added AFTER the initial scan (e.g.
 *      sections inside a `<Suspense>` that resolves on the client)
 *      also get picked up. Without this, anything below the
 *      Suspense boundary stayed invisible forever in production.
 *
 * Reduced-motion + missing-IntersectionObserver paths reveal every
 * element immediately instead of leaving the page blank.
 */
export function ScrollReveal() {
  useEffect(() => {
    const stage =
      document.querySelector<HTMLElement>(".aiop-stage") ?? document.body;

    /* Flip the body into opt-in animated mode. Once `.aiop-reveals`
       is on the body, the operator CSS will hide every
       `.aiop-reveal:not(.is-in)` until the observer flips it. */
    document.body.classList.add("aiop-reveals");

    const reveal = (el: HTMLElement) => el.classList.add("is-in");

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      stage
        .querySelectorAll<HTMLElement>(".aiop-reveal")
        .forEach(reveal);
      return () => {
        document.body.classList.remove("aiop-reveals");
      };
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

    const observeIfReveal = (el: Element) => {
      if (
        el instanceof HTMLElement &&
        el.classList.contains("aiop-reveal") &&
        !el.classList.contains("is-in")
      ) {
        io.observe(el);
      }
    };

    /* Initial scan — picks up everything already in the DOM. */
    stage
      .querySelectorAll<HTMLElement>(".aiop-reveal")
      .forEach((el) => io.observe(el));

    /* MutationObserver — catches anything added later (Suspense-
       deferred children, modal contents, etc.). We walk the subtree
       of each added node so a single React commit that adds a
       deeply nested `.aiop-reveal` is still observed. */
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLElement) {
            observeIfReveal(node);
            node
              .querySelectorAll?.<HTMLElement>(".aiop-reveal")
              .forEach(observeIfReveal);
          }
        }
      }
    });
    mo.observe(stage, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.body.classList.remove("aiop-reveals");
    };
  }, []);

  return null;
}

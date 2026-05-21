"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that adds `.is-in` to `.reveal`
 * nodes the first time they enter the viewport. Cheap; one observer per
 * page.
 *
 * Reveal-state contract (see globals.css):
 * - `.reveal` is visible by default. SSR-only renders, static-export
 *   captures and screenshot tools that bypass scroll all see the
 *   content fully painted.
 * - On client mount we opt the page into the animated state by adding
 *   `body.js-reveals`. From that point on the CSS hides any `.reveal`
 *   that is not yet `.is-in` and the IntersectionObserver fades them
 *   in as they scroll into view.
 *
 * Stagger: any element with `data-reveal-stack` has its direct `.reveal`
 * children indexed via the `--stagger-i` custom property so the CSS can
 * apply a per-item transition-delay. The whole stack is observed as one
 * unit (the parent itself), so when the parent enters the viewport every
 * child plays its delayed reveal in sequence. This means a single
 * IntersectionObserver still drives the whole page; the stagger is pure
 * CSS once the parent is `.is-in`.
 *
 * Late-mount fix: a MutationObserver on `<body>` catches any `.reveal`
 * element that gets committed AFTER the initial scan. Without this,
 * sections inside a `<Suspense>` boundary that resolves on the client
 * (e.g. `/`'s `<RoleProvider>` subtree wrapping `<TheShift />` and
 * `<DegreesOfFreedom />`) stayed at opacity:0 forever in production
 * because the observer was set up before those nodes were in the
 * document. Mirrors the same pattern in
 * `components/operator/reveal.tsx`.
 *
 * Respects `prefers-reduced-motion` via the CSS layer.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    document.body.classList.add("js-reveals");

    const applyStaggerIndices = (root: ParentNode) => {
      const stacks = root.querySelectorAll<HTMLElement>("[data-reveal-stack]");
      stacks.forEach((stack) => {
        const children = stack.querySelectorAll<HTMLElement>(
          ":scope > .reveal",
        );
        children.forEach((child, idx) => {
          child.style.setProperty("--stagger-i", String(idx));
        });
      });
    };

    applyStaggerIndices(document);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* Reduced-motion or no IntersectionObserver: reveal everything
       immediately. We still wire the MutationObserver so late-mounted
       sections also get the `.is-in` treatment (which keeps the
       transition timing consistent if motion preferences flip
       mid-session). */
    if (reduce || typeof IntersectionObserver === "undefined") {
      const revealAll = (root: ParentNode) => {
        root
          .querySelectorAll<HTMLElement>(".reveal")
          .forEach((el) => el.classList.add("is-in"));
      };
      revealAll(document);
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node instanceof HTMLElement) {
              applyStaggerIndices(node);
              if (node.classList.contains("reveal")) node.classList.add("is-in");
              revealAll(node);
            }
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      return () => {
        mo.disconnect();
        document.body.classList.remove("js-reveals");
      };
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    const observeIfReveal = (el: Element) => {
      if (
        el instanceof HTMLElement &&
        el.classList.contains("reveal") &&
        !el.classList.contains("is-in")
      ) {
        io.observe(el);
      }
    };

    /* Initial scan — picks up everything already in the DOM. */
    document
      .querySelectorAll<HTMLElement>(".reveal")
      .forEach((el) => io.observe(el));

    /* MutationObserver — catches anything added later (Suspense-
       deferred children, modal contents, etc.). We walk the subtree
       of each added node so a single React commit that adds a
       deeply nested `.reveal` is still observed. */
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLElement) {
            applyStaggerIndices(node);
            observeIfReveal(node);
            node
              .querySelectorAll<HTMLElement>(".reveal")
              .forEach(observeIfReveal);
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.body.classList.remove("js-reveals");
    };
  }, []);

  return null;
}

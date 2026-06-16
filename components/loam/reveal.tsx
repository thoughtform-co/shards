"use client";

import { useEffect } from "react";

/*
 * Loam-local scroll reveal. Same contract as components/shared/reveal.tsx
 * (`.reveal` is visible by default; on client mount we add `body.js-reveals`
 * so the CSS can hide non-visible reveals and fade them in via
 * IntersectionObserver) but namespaced so the Loam route does not depend on
 * the wider `aiop-*` chassis.
 *
 * Stagger: any `[data-loam-stack]` parent has its direct `.reveal` children
 * indexed via `--loam-stagger-i`, consumed by `loam.css` for per-item
 * transition-delay.
 *
 * Respects `prefers-reduced-motion`: with reduce, every reveal is marked
 * `.is-in` immediately and a MutationObserver keeps late-mounted nodes
 * consistent.
 */
export function LoamReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    document.body.classList.add("js-reveals");
    document.body.classList.add("loam-reveals");

    const applyStagger = (root: ParentNode) => {
      const stacks = root.querySelectorAll<HTMLElement>("[data-loam-stack]");
      stacks.forEach((stack) => {
        const children = stack.querySelectorAll<HTMLElement>(
          ":scope > .reveal",
        );
        children.forEach((child, idx) => {
          child.style.setProperty("--loam-stagger-i", String(idx));
        });
      });
    };

    applyStagger(document);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
              applyStagger(node);
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
        document.body.classList.remove("loam-reveals");
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

    document
      .querySelectorAll<HTMLElement>(".reveal")
      .forEach((el) => io.observe(el));

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLElement) {
            applyStagger(node);
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
      document.body.classList.remove("loam-reveals");
    };
  }, []);

  return null;
}

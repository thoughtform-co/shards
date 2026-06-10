"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Creative AI Workshop · Agent expectations / context.
 *
 * A full-viewport quote slide on the engine-pattern gradient family.
 * Wrapped with AboutVince inside `.aiop-about-and-context` so, on
 * desktop, the quote card rises over the bio while About stays
 * visually pinned underneath.
 */

export function AgentContext() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(min-width: 960px)");

    const update = () => {
      setAnimated(!motionMq.matches && widthMq.matches);
    };

    update();

    motionMq.addEventListener("change", update);
    widthMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      widthMq.removeEventListener("change", update);
    };
  }, []);

  const resetParallax = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(".aiop-about-and-context");
    const about = wrapper?.querySelector<HTMLElement>(".cw-about");

    node.style.removeProperty("--aiop-engine-progress");
    node.style.transform = "";
    if (about) about.style.transform = "";
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (!animated) {
      resetParallax();
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrapper = node.closest<HTMLElement>(".aiop-about-and-context");
        const about = wrapper?.querySelector<HTMLElement>(".cw-about");
        if (!wrapper || !about) {
          resetParallax();
          return;
        }

        const wrapperRect = wrapper.getBoundingClientRect();
        const vh = window.innerHeight;
        const aboutBottomInVH = wrapperRect.top + about.offsetHeight;

        const total = node.offsetHeight + vh;
        const traveled = vh - aboutBottomInVH;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-engine-progress", p.toFixed(4));

        const freezeNeeded = vh - aboutBottomInVH;
        const maxFreeze = wrapper.offsetHeight - about.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        about.style.transform =
          freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

        const entryBuffer = Math.min(140, vh * 0.13);
        const cap = Math.min(entryBuffer, maxFreeze * 0.6);
        let hold = 0;
        if (freeze > 0 && cap > 0) {
          if (freeze <= cap) {
            hold = freeze;
          } else if (maxFreeze > cap) {
            const phase2Span = maxFreeze - cap;
            const phase2Progress = (freeze - cap) / phase2Span;
            hold = cap * (1 - phase2Progress);
          }
        }
        node.style.transform =
          hold > 0 ? `translate3d(0, ${hold}px, 0)` : "";
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      resetParallax();
    };
  }, [animated, resetParallax]);

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-engine-pattern cw-context aiop-engine-question${
        animated ? " is-animated" : ""
      }`}
      id="agent-context"
      aria-labelledby="cw-context-quote"
      aria-label="Everyone wants an agent. Yet most fail."
    >
      <div className="aiop-engine-pattern__bleed" aria-hidden="true">
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--a" />
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--b" />
        <span className="aiop-engine-pattern__grid" />
      </div>

      <div className="aiop-wrap aiop-engine-question__inner">
        <p id="cw-context-quote" className="aiop-engine-question__q aiop-reveal">
          Everyone wants an agent.
          <br />
          <em>Yet most fail.</em>
        </p>
      </div>
    </section>
  );
}

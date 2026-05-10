"use client";

import { useEffect, useRef, useState } from "react";

import { stripeReflectSection } from "./content";

/*
 * StripeReflect — first beat of the closer.
 *
 * A single tranquil interstitial that opens the closer with the
 * candidate's own voice. Three-paragraph self-quote on a cream
 * gradient with three soft lane washes (violet / amber / sage)
 * loosely placed in a triangle and a faint dot grid behind it.
 *
 * No external attribution — this is self-reflection, so the
 * figcaption row that briefly carried `Vincent Buyssens / Where the
 * conviction comes from` was retired. The optional parenthetical
 * `note` is preserved for future iterations; renders only when truthy.
 *
 * Parallax-pair choreography (mirrors `software-for-few.tsx` and
 * `headless-shift.tsx`): the slide-over happens at the page level
 * inside `.aiop-surface-and-reflect`. The `surface-pick` section
 * directly above this one would otherwise scroll out the top while
 * the reflect quote enters from below; instead we read the wrapper's
 * geometry on scroll and apply a `translateY` to surface-pick that
 * compensates for scroll exactly during the slide-over phase, so
 * surface-pick reads as visually frozen until the reflect quote has
 * fully covered it.
 *
 * Also exposes `--aiop-reflect-progress` (0..1, the section's transit
 * through the viewport) so the inner atmospheric washes can drift for
 * extra depth on top of the natural scroll-over.
 *
 * Choreography is opt-in: skipped on narrow viewports and under
 * `prefers-reduced-motion: reduce`. JS only adds `is-animated` and
 * writes the variables when the choreography is appropriate; markup
 * and CSS fall back to a static stack otherwise.
 */
export function StripeReflect() {
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

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(".aiop-surface-and-reflect");
    const previous = wrapper?.querySelector<HTMLElement>(".aiop-surface-pick");

    const reset = () => {
      node.style.removeProperty("--aiop-reflect-progress");
      if (previous) previous.style.transform = "";
    };

    if (!animated) {
      reset();
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;

        const total = rect.height + vh;
        const traveled = vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-reflect-progress", p.toFixed(4));

        if (!wrapper || !previous) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const previousBottomInVH = wrapperRect.top + previous.offsetHeight;

        const freezeNeeded = vh - previousBottomInVH;
        const maxFreeze = wrapper.offsetHeight - previous.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        previous.style.transform =
          freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      reset();
    };
  }, [animated]);

  const { quote, note } = stripeReflectSection;

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-stripe-reflect${animated ? " is-animated" : ""}`}
      id="stripe-reflect"
      aria-labelledby="aiop-stripe-reflect-quote"
    >
      {/* Three-lane atmosphere mirroring the Evans bridge — violet,
          amber, sage softly placed in a loose triangle so the page's
          lane palette is on the page even though no chips name it
          here. */}
      <div className="aiop-stripe-reflect__bleed" aria-hidden="true">
        <span className="aiop-stripe-reflect__wash aiop-stripe-reflect__wash--a" />
        <span className="aiop-stripe-reflect__wash aiop-stripe-reflect__wash--b" />
        <span className="aiop-stripe-reflect__wash aiop-stripe-reflect__wash--c" />
      </div>
      <div className="aiop-stripe-reflect__grid" aria-hidden="true" />

      <div className="aiop-wrap aiop-stripe-reflect__inner aiop-reveal">
        <figure className="aiop-stripe-reflect__quote">
          <blockquote
            id="aiop-stripe-reflect-quote"
            className="aiop-stripe-reflect__pull"
          >
            <span
              className="aiop-stripe-reflect__pull-mark"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            {quote}
          </blockquote>

          {note ? (
            <p className="aiop-stripe-reflect__note">
              <span
                className="aiop-stripe-reflect__note-bracket"
                aria-hidden="true"
              >
                (
              </span>
              {note}
              <span
                className="aiop-stripe-reflect__note-bracket"
                aria-hidden="true"
              >
                )
              </span>
            </p>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

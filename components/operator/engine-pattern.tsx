"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import {
  type EnginePatternBreadthCard,
  type EnginePatternCard,
  type EnginePatternSkillCard,
  type EnginePatternTeamCard,
  enginePatternSection,
} from "@/content/operator";
import { useScrollFrame, type ScrollFrame } from "./use-scroll-frame";

/*
 * EnginePattern — landscape momentum carousel that rises over the
 * frozen Signal news cards.
 *
 * Composition:
 *
 *   1. Section header (Signal-style left-title + right-paragraph).
 *      Source: `enginePatternSection.header` in
 *      `content/operator.ts`. The header lands the punchline:
 *      "Loop already has the layer running." Sub names the proof:
 *      six teams converged on the same architecture without
 *      coordinating.
 *
 *   2. Landscape carousel of one card per team workshop. Cards are
 *      uniform width and read in one scan: counter + team on the
 *      header row, one short sentence as the body, owners +
 *      receipt pill on the foot row.
 *
 *   3. Floating arrow buttons + dot pagination + drag + keyboard.
 *      Native scroll-snap does the heavy lifting; the JS just
 *      drives programmatic scroll on input and reads back which
 *      card is most centred for the active-dot state.
 *
 *   4. Parallax pair (mirrors `headless-shift.tsx`). The wrapper
 *      `.aiop-signal-and-engine` holds `<Signal />` + this section
 *      as siblings. While Signal is in the freeze window this
 *      component writes a `translateY` to the sibling so the FOMO
 *      news cards read as held in place; the engine-pattern
 *      section then rises up over them — visually says "the
 *      receipts land directly on top of the worry." Below 960px
 *      or under `prefers-reduced-motion: reduce`, both sections
 *      render as a normal stack.
 */

/* `section` prop lets route variants override the copy without
   touching the live home content.
 *
 * `cardsPerView` controls slot width on the rail:
 *   - `1` (default) — homepage behavior. One landscape card centred at
 *     a time, the next/previous cards peek through the edge fade.
 *   - `3` — `/intelligence-layer` behavior. Three skill cards visible
 *     side-by-side at desktop widths; arrows still advance one card
 *     at a time so the new card reveals on the right edge. Mobile
 *     gracefully degrades to a single-card view via the existing
 *     <960px breakpoint in operator.css.
 *
 * `footerActions` lets a route replace the legacy single bridge link
 * with two paired buttons. The Aether landing on `/` uses this to
 * split the page into "the program running it" (the flywheel section
 * below) and "the engine" (the new composer section). When the prop
 * is omitted the carousel falls back to the existing `__bridge` link
 * so other routes (`/legacy`, `/pitch`) keep their behaviour.
 */
export type EnginePatternFooterAction = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
  ariaLabel?: string;
};

/* Render the italic title text with a single inner word painted
   violet. When `highlight` is missing or absent from `text`, the
   whole em renders as plain text and inherits the title's ink
   colour via the `.aiop-engine-pattern__title em` rule. */
function renderTitleEm(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.indexOf(highlight);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="aiop-engine-pattern__title-highlight">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

export function EnginePattern({
  section = enginePatternSection,
  cardsPerView = 1,
  footerActions,
}: {
  section?: {
    id: string;
    ariaLabel: string;
    header: {
      title: string;
      titleEm: string;
      /* Optional substring inside `titleEm` that should render as
         a violet highlight while the rest of the em stays in the
         title's ink colour. Used by the homepage to pick out the
         section's subject word ("Skills") without colouring the
         entire italic phrase. The match is case-sensitive and
         splits on the first occurrence only — there is exactly
         one highlighted word per title. */
      titleEmHighlight?: string;
      titleAfter?: string;
      sub: string;
    };
    cards: readonly EnginePatternCard[];
  };
  cardsPerView?: 1 | 3;
  footerActions?: readonly EnginePatternFooterAction[];
} = {}) {
  const { id, ariaLabel, header, cards } = section;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);

  const [animated, setAnimated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ─── Parallax pair: detect viewport + motion preference ─── */
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

  /* Cleanup helper held in a ref so the setup effect's cleanup
     path can call it when `animated` flips off or the component
     unmounts. Same shape as headless-shift.tsx. */
  const resetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    /* Two mutually-exclusive parallax roles depending on which
       wrapper this carousel sits inside on the host route:
       - `.aiop-signal-and-engine` (legacy `/pitch`): the carousel
         is the RISING section. Signal freezes; the carousel
         scrolls up over it. Existing behaviour.
       - `.aiop-engine-and-ideate` (homepage `/`): the carousel
         is the FROZEN section. The CsIdeationEngine demo below
         scrolls up over it through natural flow, so the engine
         reveal lands as the answer to the carousel's question.
       In practice a given page only mounts one of the two; the
       handler picks whichever it finds. */
    const wrapper = node.closest<HTMLElement>(".aiop-signal-and-engine");
    const signal = wrapper?.querySelector<HTMLElement>(".aiop-signal");
    const ideateWrapper = node.closest<HTMLElement>(
      ".aiop-engine-and-ideate",
    );

    resetRef.current = () => {
      node.style.removeProperty("--aiop-engine-progress");
      node.style.transform = "";
      if (signal) signal.style.transform = "";
      if (ideateWrapper) {
        ideateWrapper.style.removeProperty("--aiop-ideate-hold");
      }
    };

    if (!animated) {
      resetRef.current();
    }

    return () => {
      resetRef.current?.();
      resetRef.current = null;
    };
  }, [animated]);

  /* ─── Parallax pair: per-frame measurement + writes ─── */
  const measure = useCallback(
    (frame: ScrollFrame) => {
      if (!animated) return;
      const node = sectionRef.current;
      if (!node) return;

      /* Branch 1 · Carousel is the RISING section over Signal.
         Lives on `/pitch` inside `.aiop-signal-and-engine`. */
      const signalWrapper = node.closest<HTMLElement>(
        ".aiop-signal-and-engine",
      );
      const signal = signalWrapper?.querySelector<HTMLElement>(
        ".aiop-signal",
      );

      if (signalWrapper && signal) {
        const wrapperRect = signalWrapper.getBoundingClientRect();
        const signalBottomInVH = wrapperRect.top + signal.offsetHeight;

        const total = node.offsetHeight + frame.vh;
        const traveled = frame.vh - signalBottomInVH;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-engine-progress", p.toFixed(4));

        const freezeNeeded = frame.vh - signalBottomInVH;
        const maxFreeze = signalWrapper.offsetHeight - signal.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        signal.style.transform =
          freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

        /* Entry buffer: hold the carousel section in place for a
           brief beat after Signal fully freezes so Signal's last
           news card stays readable before the engine pattern begins
           rising. Mirrors the buffer in headless-shift.tsx. */
        const entryBuffer = Math.min(140, frame.vh * 0.13);
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
        return;
      }

      /* Branch 2 · Carousel is the FROZEN section under
         CsIdeationEngine. Lives on `/` inside
         `.aiop-engine-and-ideate`. The carousel freezes with a
         compensating `translateY` while the engine demo slides up
         over it through natural flow; a two-phase hold on the
         demo's transform mirrors the carousel's translation for a
         brief beat (so the carousel's last receipt is readable
         before the engine demo arrives) then linearly releases
         back to 0 so the demo returns to its natural document
         position by the time the freeze caps. Same shape as the
         `.aiop-question-and-vision` pair below it. */
      const ideateWrapper = node.closest<HTMLElement>(
        ".aiop-engine-and-ideate",
      );
      const ideate = ideateWrapper?.querySelector<HTMLElement>(".cs-ideation");

      if (ideateWrapper && ideate) {
        const wrapperRect = ideateWrapper.getBoundingClientRect();
        const engineBottomInVH = wrapperRect.top + node.offsetHeight;

        const freezeNeeded = frame.vh - engineBottomInVH;
        const maxFreeze = ideateWrapper.offsetHeight - node.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        node.style.transform =
          freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

        /* Carousel-progress here is the freeze ratio so the
           section's existing progress-driven CSS (wash drift,
           grid fade in section 34 of operator.css) still resolves
           to a stable 0..1 reading even when the carousel is in
           the frozen role. */
        const p = maxFreeze > 0 ? freeze / maxFreeze : 0;
        node.style.setProperty("--aiop-engine-progress", p.toFixed(4));

        /* Two-phase hold on the engine demo. Slightly longer
           buffer than the signal pair above (180 vs 140) because
           the carousel underneath carries more visual weight and
           benefits from a moment of stillness before the demo
           rises. Capped at 60% of maxFreeze to guarantee a Phase
           2 release distance even on short wrappers. */
        const ideateBuffer = Math.min(180, frame.vh * 0.18);
        const ideateHoldMax = Math.min(ideateBuffer, maxFreeze * 0.6);
        let ideateHold = 0;
        if (freeze > 0 && ideateHoldMax > 0) {
          if (freeze <= ideateHoldMax) {
            ideateHold = freeze;
          } else if (maxFreeze > ideateHoldMax) {
            const phase2Span = maxFreeze - ideateHoldMax;
            const phase2Progress = (freeze - ideateHoldMax) / phase2Span;
            ideateHold = ideateHoldMax * (1 - phase2Progress);
          }
        }
        ideateWrapper.style.setProperty(
          "--aiop-ideate-hold",
          `${ideateHold.toFixed(2)}px`,
        );
        return;
      }

      /* Fallback · neither wrapper. Plain viewport-based progress
         for hosts that mount the carousel as a standalone section
         (no parallax partner). Drives the wash drift / grid fade
         smoothly across the section's own scroll length. */
      const rect = node.getBoundingClientRect();
      const total = rect.height + frame.vh;
      const traveled = frame.vh - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      node.style.setProperty("--aiop-engine-progress", p.toFixed(4));
    },
    [animated],
  );

  useScrollFrame(measure);

  /* ─── Carousel: track scroll → derive active index + arrows ─── */
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);

    const trackCenter = scrollLeft + clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });
    setActiveIndex(bestIdx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();

    const onScroll = () => updateScrollState();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateScrollState]);

  /* ─── Carousel: programmatic scroll helpers ─── */
  const scrollToCard = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;

    const targetLeft =
      card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, []);

  const scrollByCards = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(cards.length - 1, activeIndex + delta));
      scrollToCard(next);
    },
    [activeIndex, scrollToCard, cards.length],
  );

  /* ─── Carousel: pointer-drag ─── */
  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    };
    track.setPointerCapture(event.pointerId);
    track.classList.add("is-dragging");
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragStateRef.current;
    if (!track || !drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 4) drag.moved = true;
    track.scrollLeft = drag.startScrollLeft - dx;
  }, []);

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragStateRef.current;
    if (!track || !drag || drag.pointerId !== event.pointerId) return;

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    track.classList.remove("is-dragging");
    dragStateRef.current = null;
  }, []);

  /* Suppress the click that fires at the end of a drag so a drag
     never triggers a card link / button. */
  const onClickCapture = useCallback((event: globalThis.MouseEvent) => {
    if (dragStateRef.current?.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("click", onClickCapture, { capture: true });
    return () =>
      track.removeEventListener("click", onClickCapture, { capture: true });
  }, [onClickCapture]);

  /* ─── Carousel: keyboard ─── */
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollByCards(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollByCards(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        scrollToCard(0);
      } else if (event.key === "End") {
        event.preventDefault();
        scrollToCard(cards.length - 1);
      }
    },
    [scrollByCards, scrollToCard, cards.length],
  );

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-engine-pattern${
        animated ? " is-animated" : ""
      }${cardsPerView === 3 ? " is-3up" : ""}`}
      id={id}
      aria-label={ariaLabel}
    >
      <div className="aiop-engine-pattern__bleed" aria-hidden="true">
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--a" />
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--b" />
        <span className="aiop-engine-pattern__grid" />
      </div>

      <div className="aiop-wrap aiop-engine-pattern__shell">
        <header className="aiop-section-head aiop-engine-pattern__head aiop-reveal">
          <h2 className="aiop-section-title aiop-engine-pattern__title">
            {header.title} <em>{renderTitleEm(header.titleEm, header.titleEmHighlight)}</em>
            {header.titleAfter ? ` ${header.titleAfter}` : ""}
          </h2>
          <p className="aiop-section-head__sub aiop-engine-pattern__sub">
            {header.sub}
          </p>
        </header>

        <div className="aiop-engine-pattern__inner">
          <button
            type="button"
            className="aiop-engine-pattern__arrow aiop-engine-pattern__arrow--prev"
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous card"
          >
            <Chevron direction="left" />
          </button>

          <div
            ref={trackRef}
            className="aiop-engine-pattern__track"
            role="region"
            aria-roledescription="carousel"
            aria-label="Workshop momentum: ten teams shipping or committed"
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
          >
            <ol className="aiop-engine-pattern__rail" role="list">
              {cards.map((card, idx) => (
                <li
                  key={cardKey(card, idx)}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`aiop-engine-pattern__slot aiop-engine-pattern__slot--${card.kind}${
                    card.kind === "team"
                      ? ` aiop-engine-pattern__slot--${card.status}`
                      : ""
                  }${
                    card.kind === "skill"
                      ? ` aiop-engine-pattern__slot--${card.receiptTone}`
                      : ""
                  }`}
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${cards.length}`}
                >
                  <CardRenderer card={card} index={idx} total={cards.length} />
                </li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            className="aiop-engine-pattern__arrow aiop-engine-pattern__arrow--next"
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight}
            aria-label="Next card"
          >
            <Chevron direction="right" />
          </button>
        </div>

        <ol
          className="aiop-engine-pattern__dots"
          role="list"
          aria-label="Carousel position"
        >
          {cards.map((card, idx) => (
            <li key={`dot-${cardKey(card, idx)}`}>
              <button
                type="button"
                className={`aiop-engine-pattern__dot${
                  idx === activeIndex ? " is-active" : ""
                }`}
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to card ${idx + 1} of ${cards.length}`}
                aria-current={idx === activeIndex ? "true" : undefined}
              />
            </li>
          ))}
        </ol>

        {/* Footer row — two readings of the receipts.
            When `footerActions` is supplied (Aether landing on `/`)
            we render the paired buttons: "The program running it"
            → flywheel section, "The engine" → new composer section.
            Otherwise we keep the legacy single-bridge link the
            other routes (`/legacy`, `/pitch`) rely on. Both paths
            sit on top of the same paper bleed and use native
            anchor scroll, so they pick up `.aiop-section`'s
            scroll-margin-top from the sticky header. */}
        {footerActions && footerActions.length > 0 ? (
          <nav
            className="aiop-engine-pattern__actions"
            aria-label="Continue reading the receipts"
          >
            {footerActions.map((action) => (
              <a
                key={action.id}
                href={action.href}
                className={`aiop-engine-pattern__action${
                  action.primary ? " aiop-engine-pattern__action--primary" : ""
                }`}
                aria-label={action.ariaLabel ?? action.label}
              >
                <span className="aiop-engine-pattern__action-label">
                  {action.label}
                </span>
                <span
                  className="aiop-engine-pattern__action-arrow"
                  aria-hidden="true"
                >
                  <Chevron direction="down" size={14} />
                </span>
              </a>
            ))}
          </nav>
        ) : (
          <a
            href="#vision"
            className="aiop-engine-pattern__bridge"
            aria-label="Continue to the program running the layer"
          >
            <span className="aiop-engine-pattern__bridge-label">
              And this is the program running it
            </span>
            <span
              className="aiop-engine-pattern__bridge-arrow"
              aria-hidden="true"
            >
              <Chevron direction="down" size={16} />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}

/* ─── Card renderers ─────────────────────────────────────────────── */

function CardRenderer({
  card,
  index,
  total,
}: {
  card: EnginePatternCard;
  index: number;
  total: number;
}) {
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  switch (card.kind) {
    case "team":
      return <TeamCard card={card} counter={counter} />;
    case "breadth":
      return <BreadthCard card={card} counter={counter} />;
    case "skill":
      return <SkillCard card={card} counter={counter} />;
  }
}

/* TeamCard — landscape minimalist row.
 *
 * Reading order:
 *   row 1: counter + team name (left)            · date (right)
 *   row 2: one-sentence body — the visual hero
 *   row 3: owner names (thin) + receipt pill (right)
 *
 * The body is the dominant element; the team name recedes to a
 * small mono-caps label so the reader's eye lands on what's
 * actually happening, not on the department label. The Shipped /
 * Kickoff status pill from v2 is gone — the amber/sage accent
 * rail on the card's left edge already carries that signal. */
function TeamCard({
  card,
  counter,
}: {
  card: EnginePatternTeamCard;
  counter: string;
}) {
  const team = card.team;
  return (
    <article
      className={`aiop-engine-card aiop-engine-card--team aiop-engine-card--${card.status}`}
    >
      <header className="aiop-engine-card__head">
        <span className="aiop-engine-card__head-left">
          <span className="aiop-engine-card__counter">{counter}</span>
          <span
            className="aiop-engine-card__team"
            aria-label={`Team: ${team}`}
          >
            {team}
          </span>
        </span>
        <span className="aiop-engine-card__date">{card.date}</span>
      </header>

      <p className="aiop-engine-card__body">{card.body}</p>

      <footer className="aiop-engine-card__foot">
        {card.owners && card.owners.length > 0 ? (
          <p className="aiop-engine-card__owners">
            {card.owners.join(" \u00b7 ")}
          </p>
        ) : (
          <span aria-hidden="true" />
        )}
        <span
          className={`aiop-engine-card__receipt aiop-engine-card__receipt--${card.receiptTone}`}
        >
          <span
            className="aiop-engine-card__receipt-dot"
            aria-hidden="true"
          />
          {card.receipt}
        </span>
      </footer>
    </article>
  );
}

/* BreadthCard — closing card. Same landscape footprint as TeamCard
 * but with dashed-chip queued list as the body and a slate-toned
 * receipt pill so the eye reads "and there's more" without the
 * pulsing live dot. */
function BreadthCard({
  card,
  counter,
}: {
  card: EnginePatternBreadthCard;
  counter: string;
}) {
  return (
    <article className="aiop-engine-card aiop-engine-card--breadth">
      <header className="aiop-engine-card__head">
        <span className="aiop-engine-card__head-left">
          <span className="aiop-engine-card__eyebrow">
            <span className="aiop-engine-card__eyebrow-dot" aria-hidden="true" />
            {card.eyebrow}
          </span>
          <span className="aiop-engine-card__counter">{counter}</span>
        </span>
      </header>

      <h3 className="aiop-engine-card__title">{card.title}</h3>

      <ul
        className="aiop-engine-card__queued"
        role="list"
        aria-label="Workshops confirmed through June"
      >
        {card.queued.map((team) => (
          <li key={team} className="aiop-engine-card__queued-item">
            {team}
          </li>
        ))}
      </ul>

      <footer className="aiop-engine-card__foot aiop-engine-card__foot--breadth">
        <span aria-hidden="true" />
        <span className="aiop-engine-card__receipt aiop-engine-card__receipt--breadth">
          <span
            className="aiop-engine-card__receipt-dot"
            aria-hidden="true"
          />
          {card.receipt}
        </span>
      </footer>
    </article>
  );
}

/* SkillCard — the /intelligence-layer variant.
 *
 * Renders one Skill per card (CMF, Packaging, UX Foundations, etc.)
 * instead of one team per card. Visual rhythm:
 *
 *   row 1: mono-caps team tag (left)              · counter (right)
 *   row 2: Bodoni-leaning concise title           — the scan target
 *   row 3: one-sentence body                       — what it does
 *   row 4 (optional): external reference link      — Monday / EFRAG
 *   row 5: owners (thin) + status pill (right)     — IN USE / BUILT / etc.
 *
 * The accent rail on the left edge inherits from the parent slot's
 * tone modifier (`--live` / `--committed` / `--scoping`) so the
 * status reads at a glance even before the pill enters peripheral
 * vision. Style tokens live alongside the existing engine-card
 * tokens in operator.css under the `aiop-engine-card--skill` block. */
function SkillCard({
  card,
  counter,
}: {
  card: EnginePatternSkillCard;
  counter: string;
}) {
  return (
    <article
      className={`aiop-engine-card aiop-engine-card--skill aiop-engine-card--${card.receiptTone}`}
    >
      <header className="aiop-engine-card__head">
        <span className="aiop-engine-card__head-left">
          <span
            className="aiop-engine-card__team"
            aria-label={`Team: ${card.team}`}
          >
            {card.team}
          </span>
        </span>
        <span className="aiop-engine-card__counter">{counter}</span>
      </header>

      <h3 className="aiop-engine-card__title">{card.title}</h3>

      <p className="aiop-engine-card__body">{card.body}</p>

      {card.link ? (
        <a
          className="aiop-engine-card__link"
          href={card.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="aiop-engine-card__link-arrow" aria-hidden="true">
            &rarr;
          </span>
          {card.link.label}
        </a>
      ) : null}

      <footer className="aiop-engine-card__foot">
        {card.owners && card.owners.length > 0 ? (
          <p className="aiop-engine-card__owners">
            {card.owners.join(" \u00b7 ")}
          </p>
        ) : (
          <span aria-hidden="true" />
        )}
        <span
          className={`aiop-engine-card__receipt aiop-engine-card__receipt--${card.receiptTone}`}
        >
          <span className="aiop-engine-card__receipt-dot" aria-hidden="true" />
          {card.receipt}
        </span>
      </footer>
    </article>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function cardKey(card: EnginePatternCard, idx: number): string {
  switch (card.kind) {
    case "team":
      return `team-${card.team}-${idx}`;
    case "breadth":
      return `breadth-${idx}`;
    case "skill":
      return `skill-${card.id}-${idx}`;
  }
}

function Chevron({
  direction,
  size = 20,
}: {
  direction: "left" | "right" | "down";
  size?: number;
}) {
  let d = "M7 4l6 6-6 6";
  if (direction === "left") d = "M11 4 5 10l6 6";
  if (direction === "down") d = "M4 7l6 6 6-6";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

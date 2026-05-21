"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  proofCases,
  proofSection,
  type ProofCase,
  type ProofMockGen,
  type ProofMockLoc,
  type ProofMockTime,
} from "@/content/aether";

/**
 * Proof — three programs that ran. Substrate that stayed.
 *
 * Carousel of three case slides. Each slide pairs the case copy with
 * a mock that mirrors the work shape: a generation queue, a
 * localization pipeline, or a delivery timeline. State is local; the
 * track translates by `slide-index * -100%`. Keyboard arrows, dot
 * jumps, prev/next buttons and basic touch swipe are all supported.
 */
export function Impact() {
  const [index, setIndex] = useState(0);
  const total = proofCases.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setIndex(clamped);
    },
    [total],
  );

  useEffect(() => {
    const node = trackRef.current?.parentElement;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    if (start === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(dx) > 50) {
      goTo(dx > 0 ? index - 1 : index + 1);
    }
    touchStartRef.current = null;
  };

  return (
    <section className="section" id="proof">
      <div className="wrap">
        <header className="section-head reveal">
          <p className="eyebrow">{proofSection.eyebrow}</p>
          <h2 className="section-title">
            {proofSection.title} <em>{proofSection.titleEm}</em>
          </h2>
          <p className="section-intro">{proofSection.lede}</p>
        </header>

        <div
          className="proof reveal"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Programs that ran"
        >
          <div className="proof__viewport">
            <div
              ref={trackRef}
              className="proof__track"
              style={{ transform: `translateX(${-index * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {proofCases.map((proofCase, i) => (
                <article
                  key={proofCase.id}
                  className={`proof-slide proof-slide--${proofCase.tone}`}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}: ${proofCase.headline}`}
                  aria-hidden={i !== index}
                >
                  <div className="proof-slide__copy">
                    <p className={`proof-slide__eyebrow proof-slide__eyebrow--${proofCase.tone}`}>
                      <span className="proof-slide__eyebrow-dot" aria-hidden="true" />
                      {proofCase.eyebrow}
                    </p>
                    <h3 className="proof-slide__title">{proofCase.headline}</h3>
                    <p className="proof-slide__body">{proofCase.body}</p>
                    <dl className="proof-slide__metrics">
                      {proofCase.metrics.map((metric) => (
                        <div key={metric.label} className="proof-metric">
                          <dt>{metric.label}</dt>
                          <dd>{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="proof-slide__visual">
                    <ProofMockView proofCase={proofCase} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="proof__nav">
            <div className="proof__dots" role="tablist" aria-label="Cases">
              {proofCases.map((proofCase, i) => (
                <button
                  key={proofCase.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Case ${i + 1}: ${proofCase.headline}`}
                  className={`proof__dot${i === index ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <p className="proof__counter">
              <strong>{String(index + 1).padStart(2, "0")}</strong> /{" "}
              {String(total).padStart(2, "0")}
            </p>
            <div className="proof__arrows">
              <button
                type="button"
                className="proof__arrow"
                aria-label="Previous case"
                disabled={index === 0}
                onClick={() => goTo(index - 1)}
              >
                ←
              </button>
              <button
                type="button"
                className="proof__arrow"
                aria-label="Next case"
                disabled={index === total - 1}
                onClick={() => goTo(index + 1)}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofMockView({ proofCase }: { proofCase: ProofCase }) {
  const { mock } = proofCase;
  if (mock.kind === "gen") return <GenMock mock={mock} />;
  if (mock.kind === "loc") return <LocMock mock={mock} />;
  return <TimeMock mock={mock} />;
}

function GenMock({ mock }: { mock: ProofMockGen }) {
  return (
    <div className="proof-gen">
      <header className="proof-gen__head">
        <span>{mock.header}</span>
        <span>{mock.status}</span>
      </header>
      <ul className="proof-gen__body" role="list">
        {mock.cards.map((card) => (
          <li key={card.id} className="proof-gen__card">
            <header className="proof-gen__card-head">
              <span>{card.label}</span>
              <span className={`proof-gen__status proof-gen__status--${card.status}`}>
                {card.statusLabel}
              </span>
            </header>
            <p className="proof-gen__card-text">{card.text}</p>
            <ul className="proof-gen__check" role="list">
              {card.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LocMock({ mock }: { mock: ProofMockLoc }) {
  return (
    <div className="proof-loc">
      <header className="proof-loc__head">
        <span>
          <strong>{mock.header.title}</strong> · {mock.header.subtitle}
        </span>
        <span>{mock.header.status}</span>
      </header>
      <ul className="proof-loc__rows" role="list">
        {mock.rows.map((row) => (
          <li key={row.id} className="proof-loc__row">
            <span
              className={`proof-loc__flag proof-loc__flag--${row.flag}`}
              aria-hidden="true"
            />
            <span className="proof-loc__market">
              <span>{row.code}</span>
              <span>{row.market}</span>
            </span>
            <span className={`proof-loc__status proof-loc__status--${row.status}`}>
              {row.statusLabel}
            </span>
          </li>
        ))}
      </ul>
      <p className="proof-loc__more">{mock.more}</p>
    </div>
  );
}

function TimeMock({ mock }: { mock: ProofMockTime }) {
  return (
    <div className="proof-time">
      <header className="proof-time__head">
        <span>{mock.header}</span>
        <span>{mock.meta}</span>
      </header>
      <ol className="proof-time__rail" role="list">
        {mock.steps.map((step) => (
          <li
            key={step.id}
            className={`proof-time__step proof-time__step--${step.state}`}
          >
            <p className="proof-time__week">{step.week}</p>
            <p className="proof-time__title">
              {step.title}
              <span>{step.detail}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useState } from "react";

/*
 * Field direction: an interactive principles index, modelled on the
 * Microsoft AI "Our Values" pattern. A vertical list of short labels on
 * the left; hovering or focusing one reveals its detail on the right.
 * The active label is inked and underlined, the rest are quiet.
 *
 * Pure editorial interaction, no HUD. Keyboard accessible (each label is
 * a button; arrow-free, focus drives selection).
 */

export type Principle = {
  id: string;
  label: string;
  title: string;
  body: string;
};

export function PrincipleIndex({ items }: { items: readonly Principle[] }) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <div className="field-index">
      <ul className="field-index__list" role="list">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className={`field-index__label ${
                i === active ? "is-active" : ""
              }`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="field-index__detail" aria-live="polite">
        <h3 className="field-index__detail-title">{current.title}</h3>
        <p className="field-index__detail-body">{current.body}</p>
      </div>
    </div>
  );
}

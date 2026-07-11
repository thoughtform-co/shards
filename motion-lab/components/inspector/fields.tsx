"use client";

import { useEffect, useRef, useState } from "react";

import { resolveColor } from "../../lib/motiondoc/colors";
import type { Brand } from "../../lib/motiondoc/schema";

export type ChangePhase = "transient" | "commit";

/*
 * Numeric field with AE-style label scrubbing: drag the label to
 * scrub (Shift = ×10, Alt = ×0.1), type + Enter/blur to set, arrow
 * keys to step. Transient changes stream during the drag; a single
 * commit lands on release — the container maps those onto the
 * gesture/history system.
 */
export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  precision = 0,
  title,
}: {
  label: string;
  value: number;
  onChange: (value: number, phase: ChangePhase) => void;
  step?: number;
  min?: number;
  max?: number;
  precision?: number;
  title?: string;
}) {
  const [text, setText] = useState(() => value.toFixed(precision));
  const [focused, setFocused] = useState(false);
  const drag = useRef<{ startX: number; startValue: number } | null>(null);

  useEffect(() => {
    if (!focused) setText(value.toFixed(precision));
  }, [value, precision, focused]);

  const clamp = (v: number) => {
    let out = v;
    if (min !== undefined) out = Math.max(min, out);
    if (max !== undefined) out = Math.min(max, out);
    return parseFloat(out.toFixed(Math.max(precision, 4)));
  };

  const commitText = () => {
    const parsed = parseFloat(text.replace(",", "."));
    if (Number.isFinite(parsed)) onChange(clamp(parsed), "commit");
    else setText(value.toFixed(precision));
  };

  const onLabelPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startValue: value };
  };

  const onLabelPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const multiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const delta = (e.clientX - drag.current.startX) * 0.5 * step * multiplier;
    onChange(clamp(drag.current.startValue + delta), "transient");
  };

  const onLabelPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const multiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const delta = (e.clientX - drag.current.startX) * 0.5 * step * multiplier;
    onChange(clamp(drag.current.startValue + delta), "commit");
    drag.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <label className="ml-field" title={title}>
      <span
        className="ml-field__label ml-field__label--scrub"
        onPointerDown={onLabelPointerDown}
        onPointerMove={onLabelPointerMove}
        onPointerUp={onLabelPointerUp}
      >
        {label}
      </span>
      <input
        className="ml-field__input"
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commitText();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commitText();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const dir = e.key === "ArrowUp" ? 1 : -1;
            const multiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
            onChange(clamp(value + dir * step * multiplier), "commit");
          }
        }}
      />
    </label>
  );
}

/** Free-text field committing on blur/Enter (names, copy, srcs). */
export function TextField({
  label,
  value,
  onCommit,
  multiline = false,
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  multiline?: boolean;
}) {
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(value);
  }, [value, focused]);

  const commit = () => {
    if (text !== value) onCommit(text);
  };

  const shared = {
    value: text,
    onFocus: () => setFocused(true),
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setText(e.target.value),
    onBlur: () => {
      setFocused(false);
      commit();
    },
  };

  return (
    <label className="ml-field">
      <span className="ml-field__label">{label}</span>
      {multiline ? (
        <textarea
          className="ml-field__input ml-field__input--area"
          rows={2}
          {...shared}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              commit();
              (e.target as HTMLTextAreaElement).blur();
            }
          }}
        />
      ) : (
        <input
          className="ml-field__input"
          type="text"
          {...shared}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit();
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      )}
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onCommit,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onCommit: (value: T) => void;
}) {
  return (
    <label className="ml-field">
      <span className="ml-field__label">{label}</span>
      <select
        className="ml-field__input"
        value={value}
        onChange={(e) => onCommit(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const TOKEN_OPTIONS = [
  "$background",
  "$surface",
  "$primary",
  "$accent",
  "$text",
  "$muted",
] as const;

/*
 * Color values are brand-token refs ("$accent") or raw CSS. The
 * select carries the tokens plus "custom…"; custom shows a text
 * input. The swatch previews the resolved color either way.
 */
export function ColorField({
  label,
  value,
  brand,
  onCommit,
  allowEmpty = false,
  emptyLabel = "(none)",
}: {
  label: string;
  value: string | undefined;
  brand: Brand;
  onCommit: (value: string | undefined) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const isToken = value !== undefined && (TOKEN_OPTIONS as readonly string[]).includes(value);
  const isEmpty = value === undefined;
  const selectValue = isEmpty ? "__empty" : isToken ? value : "__custom";
  const [customText, setCustomText] = useState(isToken || isEmpty ? "" : (value ?? ""));

  useEffect(() => {
    if (!isToken && !isEmpty) setCustomText(value ?? "");
  }, [value, isToken, isEmpty]);

  return (
    <div className="ml-field">
      <span className="ml-field__label">{label}</span>
      <div className="ml-field__color">
        <span
          className="ml-field__swatch"
          style={{
            background: isEmpty ? "transparent" : resolveColor(value ?? "", brand),
          }}
        />
        <select
          className="ml-field__input"
          value={selectValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "__empty") onCommit(undefined);
            else if (v === "__custom") onCommit(customText || "#ffffff");
            else onCommit(v);
          }}
        >
          {allowEmpty ? <option value="__empty">{emptyLabel}</option> : null}
          {TOKEN_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value="__custom">custom…</option>
        </select>
        {selectValue === "__custom" ? (
          <input
            className="ml-field__input ml-field__input--hex"
            type="text"
            value={customText}
            placeholder="#4DA3FF"
            onChange={(e) => setCustomText(e.target.value)}
            onBlur={() => onCommit(customText)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCommit(customText);
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

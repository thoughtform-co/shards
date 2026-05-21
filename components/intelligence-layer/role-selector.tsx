"use client";

import { useEffect, useId, useRef, useState } from "react";
import { roles } from "@/content/intelligence-layer";
import { useRole } from "./role-context";

/**
 * Role selector — accessible button + listbox dropdown.
 *
 * Used at the top of the Judgment Engine hero. Picks one of the entries
 * in the `roles` array; switching swaps every section's content via the
 * `RoleProvider`. We hand-build the listbox (rather than using a native
 * `<select>`) so the trigger and options match the editorial type
 * system — Fraunces label, JetBrains Mono kicker, violet accent.
 *
 * Behaviour:
 *   - Click trigger to open / close.
 *   - Esc closes; click outside closes.
 *   - Up/Down arrows move focus between options when open.
 *   - Enter / Space on an option commits the selection and closes.
 *
 * The visual styles live at the bottom of `judgment.css`
 * (`.je-role-selector` and friends).
 */
export function RoleSelector() {
  const { role, setSelectedRoleId } = useRole();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Close on outside click / Escape, return focus to the trigger when
  // dismissed via Escape so keyboard users don't get stranded.
  useEffect(() => {
    if (!open) return;

    function onDocPointer(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // When the menu opens, move focus to the active option so arrow keys
  // navigate from a sensible starting point.
  useEffect(() => {
    if (!open) return;
    const active = menuRef.current?.querySelector<HTMLButtonElement>(
      "[data-active=\"true\"]",
    );
    active?.focus();
  }, [open]);

  function moveFocus(direction: 1 | -1) {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>(
      "[role=\"option\"]",
    );
    if (!items || items.length === 0) return;
    const list = Array.from(items);
    const currentIndex = list.findIndex((el) => el === document.activeElement);
    const next =
      currentIndex < 0
        ? direction === 1
          ? 0
          : list.length - 1
        : (currentIndex + direction + list.length) % list.length;
    list[next]?.focus();
  }

  return (
    <div className="je-role-selector">
      <span className="je-role-selector__label" id={`${listboxId}-label`}>
        Viewing as
      </span>
      <button
        ref={triggerRef}
        type="button"
        className="je-role-selector__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={`${listboxId}-label ${listboxId}-value`}
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="je-role-selector__value" id={`${listboxId}-value`}>
          {role.label}
        </span>
        <span className="je-role-selector__caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={`${listboxId}-label`}
          className="je-role-selector__menu"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              moveFocus(1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              moveFocus(-1);
            }
          }}
        >
          {roles.map((r) => {
            const active = r.id === role.id;
            return (
              <button
                key={r.id}
                type="button"
                role="option"
                aria-selected={active}
                data-active={active}
                className="je-role-selector__option"
                onClick={() => {
                  setSelectedRoleId(r.id);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <span className="je-role-selector__option-name">{r.label}</span>
                <span className="je-role-selector__option-kicker">
                  {r.selectorKicker}
                </span>
                {active && (
                  <span
                    className="je-role-selector__option-mark"
                    aria-hidden="true"
                  >
                    ●
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

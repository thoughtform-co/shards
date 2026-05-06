"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/*
 * Shared modal shell for the AI Operator landing.
 *
 * Inspired by the Heimdall ProjectModal: a click-to-close overlay with
 * a fixed-width inset card, escape-key close, body scroll lock while
 * open, and an accent color hook (`--aiop-modal-accent`) that lets the
 * caller tint the close button + accent stripe per item.
 *
 * Callers typically pass an inline `onClose` (e.g. `() => setOpen(null)`),
 * so we route the latest handler through a ref. The lifecycle effect then
 * only depends on `open`, keeping the keydown listener and body scroll
 * lock from being torn down and reattached on every parent render.
 */
export function OperatorModal({
  open,
  onClose,
  accent,
  ariaLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  accent?: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const style: CSSProperties | undefined = accent
    ? ({
        ["--aiop-modal-accent"]: accent,
        ["--aiop-case-accent"]: accent,
      } as CSSProperties)
    : undefined;

  return (
    <div
      className="aiop-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className="aiop-modal"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="aiop-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2.5 2.5l9 9M11.5 2.5l-9 9"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
        </button>
        <div className="aiop-modal__scroll">{children}</div>
      </div>
    </div>
  );
}

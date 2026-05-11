"use client";

import { useState } from "react";

import { walkthroughSection } from "./content";
import { OperatorModal } from "./operator-modal";

/*
 * WalkthroughLauncher — button that opens a fullscreen video walkthrough
 * of the AI Operator landing page in a wide OperatorModal.
 *
 * Renders in two visual variants:
 *   - "header"     (default) — slots into the nav bar. Uses the
 *                  .aiop-header__cta chassis (cream card on a strong
 *                  rule border, polygon-clipped corner, dark hover
 *                  invert) and replaces the gold pulse dot with a
 *                  small play triangle.
 *   - "hero-ghost" — slots into the hero CTA row alongside the
 *                  primary "Explore vision" anchor. Uses the
 *                  .aiop-button + .aiop-button--ghost chassis (1px
 *                  ink outline, transparent fill, polygon-clipped
 *                  corner, dark fill on hover) and prepends the same
 *                  play triangle so the affordance still reads as
 *                  video. No right-side arrow on this variant — the
 *                  play glyph is the action cue, the arrow would
 *                  imply navigation.
 *
 * Both variants share the same modal body, open state, and a11y
 * plumbing; only the trigger element changes.
 *
 * Body content gates on `walkthroughSection.src`:
 *   - When a real video file is wired (drop the .mp4 into
 *     /public/ai-operator/ and set `src` in content.ts), renders the
 *     same <video> element pattern the case walkthroughs in cases.tsx
 *     use.
 *   - Until then, renders the .aiop-modal__video-placeholder card so
 *     visitors who open the modal today see a quiet "coming soon"
 *     message instead of an empty frame.
 *
 * A11y:
 *   - aria-haspopup="dialog" + aria-expanded reflect the modal state.
 *   - Modal carries its own dialog/aria-modal/escape-close plumbing
 *     in OperatorModal.
 */

type LauncherVariant = "header" | "hero-ghost";

const VARIANT_BUTTON_CLASS: Record<LauncherVariant, string> = {
  header: "aiop-header__cta aiop-header__cta--video",
  "hero-ghost": "aiop-button aiop-button--ghost aiop-button--video",
};

const VARIANT_GLYPH_CLASS: Record<LauncherVariant, string> = {
  header: "aiop-header__cta-play",
  "hero-ghost": "aiop-button-play",
};

export function WalkthroughLauncher({
  variant = "header",
}: {
  variant?: LauncherVariant;
}) {
  const [open, setOpen] = useState(false);
  const hasVideo = Boolean(walkthroughSection.src);

  return (
    <>
      <button
        type="button"
        className={VARIANT_BUTTON_CLASS[variant]}
        onClick={() => setOpen(true)}
        aria-label={walkthroughSection.buttonAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <PlayGlyph className={VARIANT_GLYPH_CLASS[variant]} />
        {walkthroughSection.buttonLabel}
      </button>

      <OperatorModal
        open={open}
        onClose={() => setOpen(false)}
        variant="wide"
        ariaLabel={`${walkthroughSection.modalTitle} ${walkthroughSection.modalTitleEm}`}
      >
        <div className="aiop-modal__body aiop-modal__body--walkthrough">
          <header className="aiop-modal__hero--walkthrough">
            <p className="aiop-eyebrow aiop-eyebrow--ink aiop-eyebrow--gold">
              {walkthroughSection.modalTitle}
              <span
                className="aiop-modal__hero-divider aiop-modal__hero-divider--walkthrough"
                aria-hidden="true"
              >
                ·
              </span>
              {walkthroughSection.modalTitleEm}
            </p>
            <p className="aiop-modal__hero-subline aiop-modal__hero-subline--walkthrough">
              {walkthroughSection.modalSubline}
            </p>
          </header>

          <div className="aiop-modal__video">
            {hasVideo && walkthroughSection.src ? (
              <video
                src={walkthroughSection.src}
                poster={walkthroughSection.poster ?? undefined}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                aria-label={`${walkthroughSection.modalTitle} ${walkthroughSection.modalTitleEm}`}
              />
            ) : (
              <div
                className="aiop-modal__video-placeholder"
                role="status"
                aria-label="Video walkthrough coming soon"
              >
                <PlayGlyph className="aiop-modal__video-placeholder-glyph" />
                <p className="aiop-modal__video-placeholder-eyebrow">
                  {walkthroughSection.placeholder.eyebrow}
                </p>
                <p className="aiop-modal__video-placeholder-line">
                  {walkthroughSection.placeholder.line}
                </p>
              </div>
            )}
          </div>
        </div>
      </OperatorModal>
    </>
  );
}

/*
 * Filled play triangle. Sizing and color come from CSS via currentColor
 * + width/height on the host class so the same SVG can serve as the
 * 9px header glyph, the 11px hero-ghost glyph, and the 28px placeholder
 * glyph without duplication.
 */
function PlayGlyph({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 1.5L11 6L3 10.5Z" fill="currentColor" />
    </svg>
  );
}

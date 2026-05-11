"use client";

import { useState } from "react";

import { walkthroughSection } from "./content";
import { OperatorModal } from "./operator-modal";

/*
 * WalkthroughLauncher — header-mounted button that opens a fullscreen
 * video walkthrough of the AI Operator landing page.
 *
 * Replaces the older "Get in touch" anchor in the nav. Owns its own
 * open state and renders the existing OperatorModal in `wide` variant
 * so the 16:9 video frame gets enough horizontal room without
 * touching any of the page's other sections.
 *
 * Body content is gated on `walkthroughSection.src`:
 *   - When a real video file is wired (drop the .mp4 into
 *     /public/ai-operator/ and set `src` in content.ts), the body
 *     renders the same <video> element pattern the case walkthroughs
 *     in cases.tsx use, so the chrome stays uniform across the page.
 *   - Until then, the body renders a quiet "coming soon" placeholder
 *     card sized to the same 16:9 frame so the empty state feels
 *     editorial rather than broken.
 *
 * Visual: the button reuses the existing .aiop-header__cta chassis
 * (cream card on a strong rule border, polygon-clipped corner, dark
 * hover invert) and swaps the gold pulse dot for a small play
 * triangle so the affordance reads as video at a glance.
 *
 * A11y:
 *   - aria-haspopup="dialog" + aria-expanded reflect the modal state.
 *   - Modal carries its own dialog/aria-modal/escape-close plumbing
 *     in OperatorModal.
 */
export function WalkthroughLauncher() {
  const [open, setOpen] = useState(false);
  const hasVideo = Boolean(walkthroughSection.src);

  return (
    <>
      <button
        type="button"
        className="aiop-header__cta aiop-header__cta--video"
        onClick={() => setOpen(true)}
        aria-label={walkthroughSection.buttonAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <PlayGlyph className="aiop-header__cta-play" />
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
 * 9px header glyph and the 28px placeholder glyph without duplication.
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

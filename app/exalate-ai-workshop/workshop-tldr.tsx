"use client";

import { useState } from "react";

import { OperatorModal } from "@/components/operator/operator-modal";

/*
 * WorkshopTldr — third hero action on /exalate-ai-workshop: a ghost
 * button that opens the workshop TLDR (what we covered + next steps)
 * in the shared OperatorModal.
 *
 * Two portal caveats handled here (the modal mounts under <body>,
 * outside the shell):
 *   - Fonts: the next/font CSS variables live on the shell div, so
 *     the page passes its `.variable` classes down as `fontClassName`
 *     and we re-declare them on the content wrapper.
 *   - Palette: content classes (`.exalate-tldr__*`) are styled as
 *     top-level selectors in exalate-workshop.css against the base
 *     `.aiop-modal-overlay` tokens, never nested under the shell
 *     modifier. The Exalate purple arrives via the `accent` prop
 *     (close button + top stripe) and hardcoded accents in those
 *     classes.
 */

export type WorkshopTldrContent = {
  buttonLabel: string;
  ariaLabel: string;
  eyebrow: string;
  title: string;
  groups: readonly { heading: string; bullets: readonly string[] }[];
  nextSteps: readonly { owner: string; items: readonly string[] }[];
  footnote?: string;
};

const EXALATE_PURPLE = "#8f64f9";

export function WorkshopTldr({
  content,
  fontClassName,
}: {
  content: WorkshopTldrContent;
  fontClassName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="aiop-button aiop-button--ghost"
        onClick={() => setOpen(true)}
      >
        {content.buttonLabel}
        <span className="aiop-button__arrow" aria-hidden="true">
          &rarr;
        </span>
      </button>

      <OperatorModal
        open={open}
        onClose={() => setOpen(false)}
        accent={EXALATE_PURPLE}
        ariaLabel={content.ariaLabel}
      >
        <div className={`${fontClassName} exalate-tldr`}>
          <header className="exalate-tldr__head">
            <p className="exalate-tldr__eyebrow">{content.eyebrow}</p>
            <h3 className="exalate-tldr__title">{content.title}</h3>
          </header>

          {content.groups.map((group) => (
            <section className="exalate-tldr__group" key={group.heading}>
              <h4 className="exalate-tldr__heading">{group.heading}</h4>
              <ul className="exalate-tldr__list" role="list">
                {group.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          ))}

          <div className="exalate-tldr__next">
            {content.nextSteps.map((steps) => (
              <section
                className="exalate-tldr__group exalate-tldr__group--next"
                key={steps.owner}
              >
                <h4 className="exalate-tldr__heading">
                  Next steps &middot; {steps.owner}
                </h4>
                <ul
                  className="exalate-tldr__list exalate-tldr__list--next"
                  role="list"
                >
                  {steps.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {content.footnote ? (
            <p className="exalate-tldr__footnote">{content.footnote}</p>
          ) : null}
        </div>
      </OperatorModal>
    </>
  );
}

"use client";

import { useState } from "react";

import { OperatorModal } from "@/components/operator/operator-modal";

/*
 * WorkshopTldr — second hero action on /plopsa-ai-workshop: a ghost
 * button that opens the workshop recap (what we covered + next steps)
 * in the shared OperatorModal, with Copy / Download-as-Markdown export
 * so attendees can take the recap into their own Claude.
 *
 * Two portal caveats handled here (the modal mounts under <body>,
 * outside the shell):
 *   - Fonts: the next/font CSS variables live on the shell div, so
 *     the page passes its `.variable` classes down as `fontClassName`
 *     and we re-declare them on the content wrapper.
 *   - Palette: content classes (`.plopsa-tldr__*`) are styled as
 *     top-level selectors in plopsa-workshop.css against the base
 *     `.aiop-modal-overlay` tokens, never nested under the shell.
 *     The overlay's own `--aiop-gold*` resolve to the base operator
 *     violet, so the Plopsa accent is passed explicitly via the
 *     `accent` prop (close button + top stripe) and hardcoded in
 *     those classes.
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

/* Plopsa orange-200 (--color-primary-orange-200), matching the page's
   filled buttons the way tf-light's gold-bright did. */
const MODAL_ACCENT = "#ec6726";

const DOWNLOAD_FILENAME = "plopsa-ai-workshop-recap.md";

/* Single source of truth for the export: the same content object that
   renders the modal serializes straight to Markdown, so the copied /
   downloaded file never drifts from what's on screen. */
function tldrToMarkdown(content: WorkshopTldrContent): string {
  const out: string[] = [];
  out.push("# AI Capability Workshop — TLDR");
  out.push(content.eyebrow);
  out.push("");
  for (const group of content.groups) {
    out.push(`## ${group.heading}`);
    for (const bullet of group.bullets) out.push(`- ${bullet}`);
    out.push("");
  }
  for (const steps of content.nextSteps) {
    out.push(`## Next steps · ${steps.owner}`);
    for (const item of steps.items) out.push(`- ${item}`);
    out.push("");
  }
  if (content.footnote) {
    out.push("---");
    out.push(`_${content.footnote}_`);
  }
  return out.join("\n").trimEnd() + "\n";
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path (insecure context / denied) */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

function downloadMarkdown(text: string): void {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = DOWNLOAD_FILENAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function WorkshopTldr({
  content,
  fontClassName,
}: {
  content: WorkshopTldrContent;
  fontClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const ok = await copyText(tldrToMarkdown(content));
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

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
        accent={MODAL_ACCENT}
        ariaLabel={content.ariaLabel}
      >
        <div className={`${fontClassName} plopsa-tldr`}>
          <div className="plopsa-tldr__actions">
            <button
              type="button"
              className="plopsa-tldr__action"
              onClick={onCopy}
              aria-live="polite"
            >
              {copied ? "Copied ✓" : "Copy as Markdown"}
            </button>
            <button
              type="button"
              className="plopsa-tldr__action"
              onClick={() => downloadMarkdown(tldrToMarkdown(content))}
            >
              Download .md
            </button>
          </div>

          <header className="plopsa-tldr__head">
            <p className="plopsa-tldr__eyebrow">{content.eyebrow}</p>
            <h3 className="plopsa-tldr__title">{content.title}</h3>
          </header>

          {content.groups.map((group) => (
            <section className="plopsa-tldr__group" key={group.heading}>
              <h4 className="plopsa-tldr__heading">{group.heading}</h4>
              <ul className="plopsa-tldr__list" role="list">
                {group.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          ))}

          <div className="plopsa-tldr__next">
            {content.nextSteps.map((steps) => (
              <section
                className="plopsa-tldr__group plopsa-tldr__group--next"
                key={steps.owner}
              >
                <h4 className="plopsa-tldr__heading">
                  Next steps &middot; {steps.owner}
                </h4>
                <ul
                  className="plopsa-tldr__list plopsa-tldr__list--next"
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
            <p className="plopsa-tldr__footnote">{content.footnote}</p>
          ) : null}
        </div>
      </OperatorModal>
    </>
  );
}

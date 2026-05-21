import Link from "next/link";
import { ctaSection } from "@/content/aether";

/**
 * CTA — final close.
 *
 * Centered ink-on-paper section. Eyebrow, title, lede, two CTAs, and
 * a fine-print line beneath. The primary action is the working
 * session; the secondary points back to the field-notes section
 * earlier on the page so visitors can re-read the method before
 * reaching out.
 */
export function Close() {
  return (
    <section className="section section--ink section--cta" id="cta">
      <div className="wrap cta" data-reveal-stack>
        <p className="eyebrow eyebrow--paper reveal">{ctaSection.eyebrow}</p>
        <h2 className="cta__title reveal">{ctaSection.title}</h2>
        <p className="cta__lede reveal">{ctaSection.lede}</p>
        <div className="cta__actions reveal">
          <Link href={ctaSection.primary.href} className="btn btn--paper">
            {ctaSection.primary.label}
            <span className="btn-arrow">→</span>
          </Link>
          <Link href={ctaSection.secondary.href} className="btn btn--ghost-on-ink">
            {ctaSection.secondary.label}
          </Link>
        </div>
        <p className="cta__fine reveal">{ctaSection.fine}</p>
      </div>
    </section>
  );
}

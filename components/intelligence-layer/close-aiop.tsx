import Link from "next/link";
import { pageClose } from "@/content/intelligence-layer";

/**
 * Close — homepage `aiop-section` chrome. Short, declarative wrap with
 * two actions. No three-decision card row, no fine print: this is the
 * intelligence-layer route's close, not the homepage's CTA.
 */
export function CloseAiop() {
  return (
    <section className="aiop-section aiop-section--tight ail-close" id="close">
      <div className="aiop-wrap">
        <header className="aiop-section-head ail-close__head aiop-reveal">
          <h2 className="aiop-section-title ail-close__title">
            {pageClose.title} <em>{pageClose.titleEm}</em>
          </h2>
          <p className="aiop-section-head__sub ail-close__body">
            {pageClose.body}
          </p>
        </header>

        <div className="ail-close__actions aiop-reveal">
          {pageClose.actions.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className={`aiop-button${
                "primary" in action && action.primary
                  ? ""
                  : " aiop-button--ghost"
              }`}
            >
              {action.label}
              <span className="aiop-button__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

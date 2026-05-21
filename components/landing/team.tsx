import Link from "next/link";
import { operatorEngagements, operatorSection } from "@/content/aether";

/**
 * Operator — clarion CTA into Workshop / Strategy / Program.
 *
 * One short framing paragraph at the top; the three engagement tiers
 * underneath as a card row. The Program card is the headline action
 * (paper-on-ink button, accent rail), Workshop and Strategy are
 * lower-commitment entry points (ghost-on-ink buttons). Each card
 * names duration, what the work involves, and the concrete outcome.
 *
 * The operator's posture is "install the frame, start the flywheel,
 * leave"; the section's job is to make picking the right entry feel
 * obvious for a leader, marketer, or department head.
 */
export function Team() {
  return (
    <section className="section section--ink section--operator" id="role">
      <div className="wrap">
        <p className="bridge-quote bridge-quote--top reveal">
          {operatorSection.bridge.pre} <em>{operatorSection.bridge.em}</em>
        </p>

        <header className="operator-head reveal">
          <p className="eyebrow eyebrow--paper">{operatorSection.eyebrow}</p>
          <h2 className="operator-head__title">{operatorSection.title}</h2>
          <p className="operator-head__framing">{operatorSection.framing}</p>
        </header>

        <ol className="engagements" role="list" data-reveal-stack>
          {operatorEngagements.map((engagement) => (
            <li
              key={engagement.id}
              className={[
                "engagement",
                `engagement--${engagement.id}`,
                engagement.primary ? "engagement--primary" : null,
                "reveal",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <header className="engagement__head">
                <span className="engagement__tag">{engagement.tag}</span>
                <span className="engagement__duration">{engagement.duration}</span>
              </header>
              <h3 className="engagement__title">{engagement.title}</h3>
              <p className="engagement__body">{engagement.body}</p>
              <p className="engagement__outcome">{engagement.outcome}</p>
              <Link
                href={engagement.cta.href}
                className={`btn ${engagement.primary ? "btn--paper" : "btn--ghost-on-ink"}`}
              >
                {engagement.cta.label}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

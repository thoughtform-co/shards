import { fill, workflows } from "@/content/folio-copy";
import { FolioMark, Pill, type PillTone } from "./primitives";

/*
 * Workflows: the check-ins an agent posts wherever it lives. Each card is
 * one message with its own one-tap answers.
 */

type Key = keyof typeof workflows.cards;

const TONE: Record<Key, PillTone> = {
  close: "accent",
  price: "warn",
  vendor: "muted",
  missing: "red",
};

export function WorkflowCards({ only }: { only?: Key[] }) {
  const keys = (only ?? (Object.keys(workflows.cards) as Key[])) as Key[];
  return (
    <div className="fo-mock" data-mock="workflows">
      <div className="fo-flows">
        {keys.map((k) => {
          const c = workflows.cards[k];
          return (
            <article className="fo-flow" key={k}>
              <div className="fo-flow__meta">
                <b>{c.channel}</b>
                <span>{c.when}</span>
                <Pill tone={TONE[k]}>{c.title}</Pill>
              </div>
              <div className="fo-flow__msg">
                <span className="fo-flow__avatar" aria-hidden="true">
                  <FolioMark size={14} />
                </span>
                <span>
                  <strong>Folio</strong>
                  <p>{fill(c.text)}</p>
                </span>
              </div>
              <div className="fo-flow__actions">
                <span className="fo-btn fo-btn--primary fo-btn--sm">{c.actions[0]}</span>
                <span className="fo-btn fo-btn--secondary fo-btn--sm">{c.actions[1]}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

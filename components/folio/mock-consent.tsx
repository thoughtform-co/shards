import { cards, charges, persona } from "@/content/folio";
import { AppIcon, Check, PasskeyGlyph } from "./primitives";

/*
 * Mockup B: the one approval. Shown by the payment wallet, not by Folio,
 * because the grant lives at the payment layer: per card, read-only,
 * revocable, approved with a passkey.
 */


export function MockConsent() {
  const counts = new Map<string, number>();
  for (const c of charges) counts.set(c.card, (counts.get(c.card) ?? 0) + 1);

  return (
    <div className="fo-consent fo-mock" data-mock="consent">
      <header className="fo-consent__top">
        <span className="fo-wallet__brand">
          <span className="fo-wallet__dot" aria-hidden="true" />
          link
        </span>
        <span>Access request</span>
      </header>

      <div className="fo-consent__who">
        <span className="fo-consent__app">
          <AppIcon size={44} />
        </span>
        <p>
          <strong>Folio</strong> wants to read the invoices and receipts behind payments you make with these
          cards.
        </p>
      </div>

      <div className="fo-consent__cards" role="group" aria-label="Cards to share">
        {cards.map((card) => {
          const on = card.id === "biz";
          return (
            <div className={`fo-consent__card${on ? " is-on" : ""}`} key={card.id}>
              <span className="fo-consent__box" aria-hidden="true">
                {on && <Check />}
              </span>
              <span className="fo-consent__cardname">
                <strong>
                  {card.brand} •••• {card.last4}
                </strong>
                <small>{on ? `${card.label} · ${persona.company}` : `${card.label} · not shared`}</small>
              </span>
              <span className="fo-consent__count fo-num">
                {on ? `${counts.get(card.id) ?? 0} in Sep` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <dl className="fo-consent__terms">
        <div>
          <dt>Can</dt>
          <dd>Read invoices, receipts and credit notes for the cards above</dd>
        </div>
        <div>
          <dt>Cannot</dt>
          <dd>Pay, change a subscription, or see any other card</dd>
        </div>
        <div>
          <dt>Lasts</dt>
          <dd>From 1 Jan 2026 until you revoke it</dd>
        </div>
      </dl>

      <div className="fo-consent__actions">
        <span className="fo-consent__passkey">
          <PasskeyGlyph /> Approve with passkey
        </span>
        <span className="fo-consent__cancel">Not now</span>
      </div>
    </div>
  );
}

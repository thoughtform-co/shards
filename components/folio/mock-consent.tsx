import { cards, charges, persona } from "@/content/folio";
import { Check, FolioMark } from "./primitives";

/*
 * Mockup B: the one approval. Shown by the payment wallet, not by Folio,
 * because the grant lives at the payment layer: per card, read-only,
 * revocable, approved with a passkey.
 */

function PasskeyGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="7" cy="5.5" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 15.5c.4-3 2.6-5 5.5-5 1.2 0 2.3.3 3.2.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13.5" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 13v3.5m0-1.5h1.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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
          <FolioMark size={22} />
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

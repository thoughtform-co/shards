import { cardById, charges, latest, money, month, shortDate, vendorById, type Charge } from "@/content/folio";
import { DocGlyph, Monogram } from "./primitives";

/*
 * Mockup A: a payment wallet's Activity page, drawn after the one the owner
 * pays every subscription through. "before" is that page as it is: every
 * charge, no document. "after" is the same page with one column and one
 * button added, which is the whole ask. "split" stacks the two.
 */

type State = "before" | "after";

function WalletPanel({ state, list, caption }: { state: State; list: Charge[]; caption?: string }) {
  return (
    <div className="fo-wallet" data-state={state}>
      <header className="fo-wallet__bar">
        <span className="fo-wallet__brand">
          <span className="fo-wallet__dot" aria-hidden="true" />
          link
        </span>
        <span className="fo-wallet__title">Activity</span>
        {caption && <span className="fo-wallet__caption">{caption}</span>}
        {state === "after" && (
          <span className="fo-wallet__dl">
            <DocGlyph /> Download September · {month.invoices + month.receipts} PDFs
          </span>
        )}
      </header>
      <div className="fo-wallet__group">Sep 2026</div>
      <div className="fo-wallet__rows">
        {list.map((c) => {
          const vendor = vendorById(c.vendorId);
          const card = cardById(c.card);
          return (
            <div className="fo-wallet__row" key={c.id}>
              <Monogram vendor={vendor} size={22} />
              <strong>{vendor.name}</strong>
              <span className="fo-wallet__card">
                {card.label} {card.last4}
              </span>
              <span className="fo-wallet__date">{shortDate(c.date)}</span>
              <span className="fo-wallet__amt fo-num">{money(c.cents, c.currency)}</span>
              {state === "after" && (
                <span className="fo-wallet__doc" title={`${c.doc.kind} ${c.doc.number}`}>
                  <DocGlyph />
                  <span>{c.doc.kind === "invoice" ? "Invoice" : "Receipt"}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MockActivity({
  state = "before",
  rows = 8,
  split = false,
}: {
  state?: State;
  rows?: number;
  split?: boolean;
}) {
  const list = latest(rows, charges);

  if (split) {
    return (
      <div className="fo-mock fo-wallet-split" data-mock="activity-split">
        <div className="fo-wallet-split__label">Today</div>
        <WalletPanel state="before" list={list} />
        <div className="fo-wallet-split__label fo-wallet-split__label--after">With one read-only endpoint</div>
        <WalletPanel state="after" list={list} />
      </div>
    );
  }

  return (
    <div className="fo-mock" data-mock={`activity-${state}`}>
      <WalletPanel state={state} list={list} />
    </div>
  );
}

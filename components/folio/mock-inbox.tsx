import { byVendor, cardById, dayMonth, money, month, persona } from "@/content/folio";
import { Check, Monogram, Pill, Wordmark } from "./primitives";

/*
 * Mockup C: the Folio inbox. One month, grouped by vendor, every charge
 * with the document behind it. The numbers are computed from the dataset.
 */
export function MockInbox({ maxRows }: { maxRows?: number }) {
  const rows = byVendor();
  const shown = maxRows ? rows.slice(0, maxRows) : rows;
  const card = cardById("biz");

  return (
    <div className="fo-app fo-mock" data-mock="inbox">
      <header className="fo-app__bar">
        <Wordmark size={17} />
        <nav className="fo-app__tabs" aria-label="Folio sections">
          <span className="is-active">Documents</span>
          <span>Missing</span>
          <span>Deliveries</span>
          <span>Grants</span>
        </nav>
        <span className="fo-app__period">{persona.period}</span>
      </header>

      <div className="fo-app__body">
        <div className="fo-app__title">
          <div>
            <div className="fo-app__h">{persona.company}</div>
            <div className="fo-app__sub">
              {card.brand} •••• {card.last4} · read-only grant since 2 Jun
            </div>
          </div>
          <div className="fo-app__figures">
            <div><span>Charges</span><strong>{month.charges}</strong></div>
            <div><span>Documents</span><strong>{month.invoices + month.receipts}</strong></div>
            <div><span>Spend</span><strong className="fo-num">{month.totals}</strong></div>
          </div>
        </div>

        <div className="fo-table" role="table" aria-label={`Documents for ${persona.period}`}>
          <div className="fo-table__row fo-table__row--head" role="row">
            <span role="columnheader">Vendor</span>
            <span role="columnheader" className="fo-col-charges">Charges</span>
            <span role="columnheader" className="fo-col-amount">Amount</span>
            <span role="columnheader" className="fo-col-docs">Documents</span>
            <span role="columnheader" className="fo-col-status">Status</span>
          </div>
          {shown.map((r) => (
            <div className="fo-table__row" role="row" key={r.vendor.id}>
              <span className="fo-vendor" role="cell">
                <Monogram vendor={r.vendor} size={26} />
                <span>
                  <strong>{r.vendor.name}</strong>
                  <small>{r.charges.length > 1 ? `${r.charges.length} charges, last ${dayMonth(r.lastDate)}` : `${r.charges[0].item} · ${dayMonth(r.lastDate)}`}</small>
                </span>
              </span>
              <span role="cell" className="fo-col-charges fo-num">{r.charges.length}</span>
              <span role="cell" className="fo-col-amount fo-num">{money(r.cents, r.currency)}</span>
              <span role="cell" className="fo-col-docs">
                {r.invoices > 0 && `${r.invoices} ${r.invoices === 1 ? "invoice" : "invoices"}`}
                {r.receipts > 0 && `${r.receipts} ${r.receipts === 1 ? "receipt" : "receipts"}`}
              </span>
              <span role="cell" className="fo-col-status">
                {r.receipts > 0 ? (
                  <Pill tone="warn">Receipt only</Pill>
                ) : (
                  <Pill tone="ok"><Check /> Collected</Pill>
                )}
              </span>
            </div>
          ))}
        </div>

        <footer className="fo-app__foot">
          <span>
            Delivered to {persona.accountant} · <span className="fo-nowrap">1 Oct, 06:00</span>
          </span>
          <span className="fo-btn fo-btn--ink fo-btn--sm">Send September</span>
        </footer>
      </div>
    </div>
  );
}

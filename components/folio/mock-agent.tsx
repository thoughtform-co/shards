import { cardById, charges, dayMonth, money, month, persona, vendorById } from "@/content/folio";

/*
 * Mockup D: an agent working the month through Folio's MCP tools. The
 * agent window is deliberately generic (no assistant's brand): Folio is
 * the connector, whichever agent the person uses. Every number is read
 * from the dataset.
 */
export function MockAgent() {
  const card = cardById("biz");
  const receiptOnly = charges.filter((c) => c.doc.kind === "receipt");
  const first = receiptOnly[0];
  const firstVendor = first ? vendorById(first.vendorId) : null;
  const docs = month.invoices + month.receipts;

  return (
    <div className="fo-agent fo-mock" data-mock="agent">
      <header className="fo-agent__bar">
        <span className="fo-agent__name">Agent</span>
        <span className="fo-agent__conn">
          <span className="fo-agent__dot" aria-hidden="true" /> Folio connected
        </span>
      </header>

      <div className="fo-agent__thread">
        <div className="fo-agent__msg fo-agent__msg--you">
          Send September&apos;s software invoices to {persona.accountant}.
        </div>

        <div className="fo-agent__tool">
          <div className="fo-agent__call">
            <code>folio.list_documents</code>
            <span>period 2026-09 · card {card.last4}</span>
          </div>
          <div className="fo-agent__result fo-num">
            {month.charges} charges · {month.invoices} invoices · {month.receipts} receipt
          </div>
        </div>

        <div className="fo-agent__tool">
          <div className="fo-agent__call">
            <code>folio.missing</code>
            <span>period 2026-09</span>
          </div>
          <div className="fo-agent__result">
            {first && firstVendor
              ? `${firstVendor.name} · ${dayMonth(first.date)} · ${money(first.cents, first.currency)} · receipt only, no invoice issued`
              : "Nothing missing"}
          </div>
        </div>

        <div className="fo-agent__msg">
          All {month.charges} charges have a document.{" "}
          {firstVendor && first
            ? `${firstVendor.name} issued only a receipt for the ${first.item.toLowerCase()} on ${dayMonth(first.date)}, so I'll send it with a note for your accountant.`
            : ""}
        </div>

        <div className="fo-agent__approve">
          <div className="fo-agent__call">
            <code>folio.deliver</code>
            <span>
              {docs} documents to {persona.accountant}
            </span>
          </div>
          <div className="fo-agent__buttons">
            <span className="fo-btn fo-btn--ink fo-btn--sm">Approve</span>
            <span className="fo-btn fo-btn--line fo-btn--sm">Not now</span>
            <small>Sending documents needs your approval.</small>
          </div>
        </div>
      </div>
    </div>
  );
}

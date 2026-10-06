import { cardById, heroDocument, money, persona, shortDate, vendorById, type Charge } from "@/content/folio";

/*
 * The vendor's own document, drawn as the PDF a person would download from
 * the vendor's billing portal. Note what is absent: the card that paid.
 * Invoices rarely carry it; Folio's record attaches it beside the PDF.
 */
export function InvoiceSheet({ charge = heroDocument }: { charge?: Charge }) {
  const vendor = vendorById(charge.vendorId);
  const card = cardById(charge.card);
  const amount = money(charge.cents, charge.currency);

  return (
    <div className="fo-invoice" aria-label={`${vendor.name} invoice ${charge.doc.number}`}>
      <div className="fo-invoice__head">
        <div>
          <div className="fo-invoice__vendor">{vendor.legalName}</div>
          <div className="fo-invoice__muted">{vendor.hq}</div>
        </div>
        <div className="fo-invoice__title">Invoice</div>
      </div>

      <dl className="fo-invoice__meta">
        <div><dt>Invoice number</dt><dd>{charge.doc.number}</dd></div>
        <div><dt>Date of issue</dt><dd>{shortDate(charge.date)}</dd></div>
        <div><dt>Bill to</dt><dd>{persona.company}<br />{persona.city ? `${persona.city}, ${persona.country}` : persona.country}<br />VAT {persona.vat}</dd></div>
      </dl>

      <div className="fo-invoice__lines">
        <div className="fo-invoice__row fo-invoice__row--head"><span>Description</span><span>Qty</span><span>Amount</span></div>
        <div className="fo-invoice__row"><span>{charge.item}</span><span>1</span><span>{amount}</span></div>
      </div>

      <div className="fo-invoice__sum">
        <div><span>Subtotal</span><span>{amount}</span></div>
        <div><span>VAT, reverse charge</span><span>{money(0, charge.currency)}</span></div>
        <div className="fo-invoice__total"><span>Amount paid</span><span>{amount}</span></div>
      </div>

      <div className="fo-invoice__attach">
        <span className="fo-invoice__attach-dot" />
        Attached by Folio · paid with {card.brand} •••• {card.last4}
      </div>
    </div>
  );
}

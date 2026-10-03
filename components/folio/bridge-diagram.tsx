import { cardById, heroDocument, money, persona, shortDate, vendorById } from "@/content/folio";
import { FolioMark } from "./primitives";

/*
 * The bridge, drawn as the record rather than as a metaphor: what already
 * exists at the payment provider on the left, the one record Folio keeps
 * per charge in the middle, and where it goes on the right.
 */
export function BridgeDiagram() {
  const c = heroDocument;
  const vendor = vendorById(c.vendorId);
  const card = cardById(c.card);
  const amount = money(c.cents, c.currency);

  const fields: Array<[string, string]> = [
    ["Vendor", vendor.legalName],
    ["Kind", c.doc.kind === "invoice" ? "Invoice" : "Receipt"],
    ["Number", c.doc.number],
    ["Issued", shortDate(c.date)],
    ["Amount", `${amount}, VAT reverse charge`],
    ["Billed to", `${persona.company}, ${persona.vat}`],
    ["Paid with", `${card.brand} •••• ${card.last4}`],
    ["File", `${c.doc.number}.pdf, the vendor's own`],
  ];

  return (
    <figure className="fo-bridge" aria-label="How one charge becomes one record">
      <div className="fo-bridge__col">
        <div className="fo-bridge__head">At the payment provider</div>
        <div className="fo-bridge__node">
          <small>In your wallet</small>
          <strong>Charge · {shortDate(c.date)}</strong>
          <span className="fo-num">
            {amount} · {card.brand} {card.last4}
          </span>
        </div>
        <div className="fo-bridge__join">already joined</div>
        <div className="fo-bridge__node">
          <small>In {vendor.name}&apos;s account</small>
          <strong>Invoice {c.doc.number}</strong>
          <span>PDF, line items, tax</span>
        </div>
      </div>

      <div className="fo-bridge__link fo-bridge__link--grant">
        <span>one read-only grant</span>
      </div>

      <div className="fo-bridge__col fo-bridge__col--record">
        <div className="fo-bridge__head">
          <FolioMark size={14} /> One record per charge
        </div>
        <dl className="fo-bridge__record">
          {fields.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="fo-bridge__link">
        <span>delivered</span>
      </div>

      <div className="fo-bridge__col">
        <div className="fo-bridge__head">Where it goes</div>
        <div className="fo-bridge__node">
          <small>Your agent, through MCP</small>
          <strong>list_documents · get_document</strong>
          <span>missing · deliver, after you approve</span>
        </div>
        <div className="fo-bridge__node">
          <small>Your accountant</small>
          <strong>Purchase inbox</strong>
          <span>matched to the bank line, to the cent</span>
        </div>
      </div>
    </figure>
  );
}

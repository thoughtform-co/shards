import { cardById, charges, money, vendorById } from "@/content/folio";
import { Check, Monogram, PasskeyGlyph } from "./primitives";

/*
 * The other side of the contrast: paying for a tool in a wallet, which
 * already takes one approval. Drawn from the month's newest vendor.
 */
export function PayCard() {
  const charge = charges.find((c) => c.vendorId === "halftone")!;
  const vendor = vendorById(charge.vendorId);
  const card = cardById(charge.card);

  return (
    <div className="fo-pay fo-mock" data-mock="pay">
      <div className="fo-pay__top">
        <span className="fo-wallet__brand">
          <span className="fo-wallet__dot" aria-hidden="true" />
          link
        </span>
        <span>Requested by your agent</span>
      </div>
      <div className="fo-pay__who">
        <Monogram vendor={vendor} size={36} />
        <span>
          <strong>{vendor.name}</strong>
          <small>{charge.item}</small>
        </span>
      </div>
      <div className="fo-pay__amount">{money(charge.cents, charge.currency)}</div>
      <div className="fo-pay__card">
        <span>
          {card.brand} •••• {card.last4}
        </span>
        <span>{card.label}</span>
      </div>
      <div className="fo-pay__btn">
        <PasskeyGlyph /> Approve with passkey
      </div>
      <div className="fo-pay__done">
        <Check /> Paid in one tap
      </div>
    </div>
  );
}

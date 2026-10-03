import {
  bankCents,
  cardById,
  charges,
  dayMonth,
  money,
  month,
  onePerVendor,
  persona,
  USD_PER_EUR,
  vendorById,
} from "@/content/folio";
import { Check, Pill } from "./primitives";

/*
 * Mockup E: the accountant's purchase inbox. Generic accounting software,
 * not any real product. Each document sits beside the one bank line it
 * settles, to the cent; dollar charges show the rate they cleared at; the
 * card decides the company.
 */
export function MockAccountant({ maxRows = 6 }: { maxRows?: number }) {
  const rows = onePerVendor(charges).slice(0, maxRows);
  const card = cardById("biz");

  return (
    <div className="fo-acct fo-mock" data-mock="accountant">
      <header className="fo-acct__bar">
        <span className="fo-acct__app">{persona.accountant}</span>
        <span className="fo-acct__crumb">Purchase inbox</span>
        <span className="fo-acct__client">
          {persona.company} · {persona.periodShort}
        </span>
      </header>

      <div className="fo-acct__summary">
        <span>
          <strong className="fo-num">
            {month.charges} of {month.charges}
          </strong>{" "}
          bank lines matched
        </span>
        <span className="fo-acct__entity">
          Card {card.last4} → {persona.company}
        </span>
      </div>

      <div className="fo-acct__table" role="table" aria-label="Bank lines and documents">
        <div className="fo-acct__row fo-acct__row--head" role="row">
          <span role="columnheader">Bank line</span>
          <span role="columnheader">Document</span>
          <span role="columnheader" className="fo-acct__status">Match</span>
        </div>
        {rows.map((c) => {
          const vendor = vendorById(c.vendorId);
          const eur = bankCents(c);
          return (
            <div className="fo-acct__row" role="row" key={c.id}>
              <span role="cell" className="fo-acct__bank">
                <span className="fo-acct__date fo-num">{dayMonth(c.date)}</span>
                <span className="fo-acct__desc">{vendor.statement}</span>
                <span className="fo-acct__amt fo-num">−{money(eur, "EUR")}</span>
              </span>
              <span role="cell" className="fo-acct__doc">
                <strong>{vendor.name}</strong>
                <small className="fo-num">
                  {c.doc.kind === "invoice" ? "Invoice" : "Receipt"} {c.doc.number}
                </small>
                {c.currency === "USD" && (
                  <small className="fo-num">
                    {money(c.cents, "USD")} at {USD_PER_EUR} $/€
                  </small>
                )}
              </span>
              <span role="cell" className="fo-acct__status">
                {c.doc.kind === "receipt" ? (
                  <Pill tone="warn">Receipt</Pill>
                ) : c.currency === "USD" ? (
                  <Pill tone="ok">
                    <Check /> At the rate
                  </Pill>
                ) : (
                  <Pill tone="ok">
                    <Check /> To the cent
                  </Pill>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

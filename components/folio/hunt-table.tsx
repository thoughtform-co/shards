import { byVendor, GET_LABEL, type GetKind } from "@/content/folio";
import { Monogram, Pill, type PillTone } from "./primitives";

/*
 * The scavenger hunt: for one month, where each vendor keeps its invoice,
 * what you actually get there, and how you have to sign in first. The
 * point is the inconsistency, so every column is allowed to disagree.
 */

const TONE: Record<GetKind, PillTone> = {
  pdf: "muted",
  "pdf-each": "warn",
  hosted: "warn",
  popup: "red",
  email: "warn",
  receipt: "red",
  owner: "warn",
  "per-project": "muted",
  image: "red",
  statement: "warn",
  zip: "muted",
};

export function HuntTable({ maxRows }: { maxRows?: number }) {
  const rows = byVendor();
  const shown = maxRows ? rows.slice(0, maxRows) : rows;

  return (
    <div className="fo-hunt fo-mock" data-mock="hunt" role="table" aria-label="Where each vendor keeps its invoice">
      <div className="fo-hunt__row fo-hunt__row--head" role="row">
        <span role="columnheader">Vendor</span>
        <span role="columnheader">Where the invoice is</span>
        <span role="columnheader">What you get</span>
        <span role="columnheader">Sign-in</span>
      </div>
      {shown.map(({ vendor }) => (
        <div className="fo-hunt__row" role="row" key={vendor.id}>
          <span className="fo-hunt__vendor" role="cell">
            <Monogram vendor={vendor} size={22} />
            <span>{vendor.name}</span>
          </span>
          <span className="fo-hunt__path" role="cell">
            {vendor.portal.path}
          </span>
          <span className="fo-hunt__get" role="cell">
            <Pill tone={TONE[vendor.portal.get]}>{GET_LABEL[vendor.portal.get]}</Pill>
          </span>
          <span className="fo-hunt__sign" role="cell">
            {vendor.portal.signIn}
          </span>
        </div>
      ))}
    </div>
  );
}

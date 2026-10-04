/*
 * Folio: the one dataset behind every screen on /folio and every social
 * frame. Totals are computed here, never typed into a component, so no
 * two mockups can disagree about the month.
 *
 * Everything below is invented. The persona, the company, the cards, the
 * vendors and every amount are fictional; the VAT number is built to fail
 * the Belgian mod-97 check so it cannot belong to a real company. The
 * month's shape (one AI vendor billing small auto-recharge top-ups, a
 * handful of flat subscriptions) is the only thing taken from life.
 */

export type Currency = "EUR" | "USD";
export type DocKind = "invoice" | "receipt";

export interface Card {
  id: "biz" | "personal";
  brand: string;
  last4: string;
  label: string;
}

export interface Vendor {
  id: string;
  name: string;
  legalName: string;
  /* How the charge reads on the bank statement. */
  statement: string;
  monogram: string;
  tile: { bg: string; fg: string };
  docPrefix: string;
  /* Where this vendor keeps its invoice, what you actually get there,
     and how you have to sign in first. Invented, but every mechanism is
     one a real billing page uses. */
  portal: { path: string; get: GetKind; signIn: string };
}

export type GetKind = "pdf" | "pdf-each" | "hosted" | "popup" | "email" | "receipt" | "owner" | "per-project" | "image" | "statement" | "zip";

export const GET_LABEL: Record<GetKind, string> = {
  pdf: "PDF download",
  "pdf-each": "One PDF per top-up",
  hosted: "Hosted page, link expires",
  popup: "Pop-up, no download",
  email: "Emailed link, expires",
  receipt: "Receipt only",
  owner: "PDF, account owner only",
  "per-project": "One PDF per project",
  image: "Invoice as an image",
  statement: "Statement, VAT on request",
  zip: "ZIP of every invoice",
};

export interface Charge {
  id: string;
  vendorId: string;
  date: string; // ISO, September 2026
  cents: number;
  currency: Currency;
  item: string;
  card: Card["id"];
  doc: { kind: DocKind; number: string };
}

export const persona = {
  person: "Merel Claes",
  initials: "MC",
  company: "Studio Merel BV",
  city: "Ghent",
  country: "Belgium",
  vat: "BE 0745.218.360",
  accountant: "Janssens Accountancy",
  period: "September 2026",
  periodShort: "Sep 2026",
};

export const cards: Card[] = [
  { id: "biz", brand: "Mastercard", last4: "4417", label: "Business debit" },
  { id: "personal", brand: "Visa", last4: "9021", label: "Personal credit" },
];

export const vendors: Vendor[] = [
  { id: "kestrel", name: "Kestrel AI", legalName: "Kestrel AI Ireland Ltd", statement: "KESTREL AI IRELAND DUBLIN", monogram: "K", tile: { bg: "#0a2540", fg: "#ffffff" }, docPrefix: "4C1E07B2", portal: { path: "/settings/billing", get: "pdf-each", signIn: "Password + 2FA" } },
  { id: "cobalt", name: "Cobalt Code", legalName: "Cobalt Code, Inc.", statement: "COBALT CODE INC", monogram: "C", tile: { bg: "#2e5bff", fg: "#ffffff" }, docPrefix: "C0B7A11D", portal: { path: "/dashboard/account/billing", get: "hosted", signIn: "GitHub sign-in" } },
  { id: "pagecraft", name: "Pagecraft", legalName: "Pagecraft B.V.", statement: "PAGECRAFT BV AMSTERDAM", monogram: "P", tile: { bg: "#ece7dc", fg: "#0a2540" }, docPrefix: "9A0F33E1", portal: { path: "/sites/studio-merel/settings/plan", get: "pdf", signIn: "Password" } },
  { id: "ferry", name: "Ferry Mail", legalName: "Ferry Mail, Inc.", statement: "FERRY MAIL INC", monogram: "F", tile: { bg: "#0f766e", fg: "#ffffff" }, docPrefix: "FE77D204", portal: { path: "/settings/subscription", get: "popup", signIn: "Google sign-in" } },
  { id: "tally", name: "Tally Tasks", legalName: "Tally Tasks Ltd", statement: "TALLY TASKS LTD LONDON", monogram: "T", tile: { bg: "#e5484d", fg: "#ffffff" }, docPrefix: "7A11E5C9", portal: { path: "/account?tab=billing", get: "email", signIn: "Magic link" } },
  { id: "meshwork", name: "Meshwork 3D", legalName: "Meshwork Labs Pte. Ltd.", statement: "MESHWORK LABS SG", monogram: "M", tile: { bg: "#3c3a35", fg: "#ffffff" }, docPrefix: "2207-1184", portal: { path: "/credits/history", get: "receipt", signIn: "Password" } },
  { id: "halftone", name: "Halftone Image", legalName: "Halftone Labs, Inc.", statement: "HALFTONE LABS INC", monogram: "H", tile: { bg: "#f59e0b", fg: "#0a2540" }, docPrefix: "HT0921", portal: { path: "/billing/history", get: "owner", signIn: "Google sign-in" } },
  { id: "relay", name: "Relay Agents", legalName: "Relay Agents, Inc.", statement: "RELAY AGENTS INC", monogram: "R", tile: { bg: "#7c3aed", fg: "#ffffff" }, docPrefix: "RLY", portal: { path: "/org/studio-merel/usage/invoices", get: "per-project", signIn: "SSO" } },
  { id: "sable", name: "Sable Video", legalName: "Sable Video SAS", statement: "SABLE VIDEO PARIS", monogram: "S", tile: { bg: "#111827", fg: "#ffffff" }, docPrefix: "SBL-26", portal: { path: "/me/plan", get: "image", signIn: "Password + 2FA" } },
  { id: "quarry", name: "Quarry Search", legalName: "Quarry Search, Inc.", statement: "QUARRY SEARCH INC", monogram: "Q", tile: { bg: "#0ea5e9", fg: "#ffffff" }, docPrefix: "QS", portal: { path: "/console/billing/statements", get: "statement", signIn: "API console login" } },
  { id: "lumen", name: "Lumen Voice", legalName: "Lumen Voice Ltd", statement: "LUMEN VOICE LTD", monogram: "L", tile: { bg: "#db2777", fg: "#ffffff" }, docPrefix: "LV", portal: { path: "/subscription", get: "email", signIn: "Magic link" } },
  { id: "orbit", name: "Orbit Notes", legalName: "Orbit Notes GmbH", statement: "ORBIT NOTES GMBH BERLIN", monogram: "O", tile: { bg: "#16a34a", fg: "#ffffff" }, docPrefix: "ON", portal: { path: "/workspace/admin/billing", get: "zip", signIn: "SSO" } },
];

/* Kestrel bills a monthly plan plus small automatic top-ups whenever the
   credit balance runs low, several on a busy day. */
const kestrelTopUps: Array<[day: number, cents: number]> = [
  [1, 1036], [2, 1058], [2, 1013], [3, 1127], [4, 1049],
  [5, 1008], [5, 1086], [5, 1272], [8, 1031], [9, 1156],
  [10, 1094], [10, 1018], [10, 1309], [10, 1065],
  [11, 1003], [11, 1588], [11, 1047], [11, 1531], [11, 1069], [11, 1102],
  [12, 1026], [14, 1015], [14, 1546], [15, 1072], [17, 1059],
  [22, 1091], [23, 1176], [23, 1084], [23, 1139], [23, 1006],
  [25, 1028], [26, 1055],
];

const iso = (day: number) => `2026-09-${String(day).padStart(2, "0")}`;

function buildCharges(): Charge[] {
  const out: Charge[] = [];
  let seq = 418;

  const kestrel: Array<{ day: number; cents: number; item: string }> = [
    ...kestrelTopUps.map(([day, cents]) => ({ day, cents, item: "Usage credits, auto-recharge" })),
    { day: 21, cents: 9000, item: "Kestrel Max, monthly" },
  ].sort((a, b) => a.day - b.day);

  for (const k of kestrel) {
    seq += 1;
    out.push({
      id: `kestrel-${seq}`,
      vendorId: "kestrel",
      date: iso(k.day),
      cents: k.cents,
      currency: "EUR",
      item: k.item,
      card: "biz",
      doc: { kind: "invoice", number: `4C1E07B2-${String(seq).padStart(4, "0")}` },
    });
  }

  out.push(
    {
      id: "cobalt-1", vendorId: "cobalt", date: iso(5), cents: 20000, currency: "USD",
      item: "Pro, monthly", card: "biz", doc: { kind: "invoice", number: "C0B7A11D-0091" },
    },
    {
      id: "pagecraft-1", vendorId: "pagecraft", date: iso(7), cents: 3600, currency: "EUR",
      item: "Site Pro, monthly", card: "biz", doc: { kind: "invoice", number: "9A0F33E1-0012" },
    },
    {
      id: "ferry-1", vendorId: "ferry", date: iso(9), cents: 3000, currency: "USD",
      item: "Business, monthly", card: "biz", doc: { kind: "invoice", number: "FE77D204-0007" },
    },
    {
      id: "tally-1", vendorId: "tally", date: iso(14), cents: 600, currency: "EUR",
      item: "Pro, monthly", card: "biz", doc: { kind: "invoice", number: "7A11E5C9-0031" },
    },
    {
      /* A one-off checkout: the vendor never enabled invoices for it, so
         the only document that exists is the receipt. */
      id: "meshwork-1", vendorId: "meshwork", date: iso(27), cents: 1999, currency: "EUR",
      item: "Credit pack", card: "biz", doc: { kind: "receipt", number: "2207-1184" },
    },
    {
      id: "halftone-1", vendorId: "halftone", date: iso(3), cents: 2400, currency: "EUR",
      item: "Studio, monthly", card: "biz", doc: { kind: "invoice", number: "HT0921-3307" },
    },
    {
      id: "sable-1", vendorId: "sable", date: iso(12), cents: 3500, currency: "EUR",
      item: "Creator, monthly", card: "biz", doc: { kind: "invoice", number: "SBL-26-09-1142" },
    },
    {
      id: "quarry-1", vendorId: "quarry", date: iso(16), cents: 1900, currency: "USD",
      item: "API, usage", card: "biz", doc: { kind: "invoice", number: "QS-2026-09-0088" },
    },
    {
      id: "lumen-1", vendorId: "lumen", date: iso(18), cents: 1100, currency: "EUR",
      item: "Starter, monthly", card: "biz", doc: { kind: "invoice", number: "LV-55120" },
    },
    {
      id: "orbit-1", vendorId: "orbit", date: iso(20), cents: 1000, currency: "EUR",
      item: "Plus, monthly", card: "biz", doc: { kind: "invoice", number: "ON-2026-0920" },
    },
    {
      id: "relay-1", vendorId: "relay", date: iso(30), cents: 4860, currency: "USD",
      item: "Agent hosting, usage", card: "biz", doc: { kind: "invoice", number: "RLY-000914" },
    },
  );

  return out.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
}

export const charges: Charge[] = buildCharges();

/* ── Helpers ─────────────────────────────────────────────────────────── */

const SYMBOL: Record<Currency, string> = { EUR: "€", USD: "$" };

export function money(cents: number, currency: Currency): string {
  const whole = Math.floor(cents / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${SYMBOL[currency]}${whole}.${String(cents % 100).padStart(2, "0")}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function shortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function dayMonth(isoDate: string): string {
  const [, m, d] = isoDate.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

export const vendorById = (id: string): Vendor => {
  const v = vendors.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown vendor ${id}`);
  return v;
};

export const cardById = (id: Card["id"]): Card => cards.find((c) => c.id === id)!;

export function totals(list: Charge[]): Array<{ currency: Currency; cents: number }> {
  const by = new Map<Currency, number>();
  for (const c of list) by.set(c.currency, (by.get(c.currency) ?? 0) + c.cents);
  return (["EUR", "USD"] as Currency[])
    .filter((cur) => by.has(cur))
    .map((currency) => ({ currency, cents: by.get(currency)! }));
}

export function totalsLabel(list: Charge[]): string {
  return totals(list)
    .map((t) => money(t.cents, t.currency))
    .join(" + ");
}

export interface VendorMonth {
  vendor: Vendor;
  charges: Charge[];
  invoices: number;
  receipts: number;
  currency: Currency;
  cents: number;
  lastDate: string;
}

export function byVendor(list: Charge[] = charges): VendorMonth[] {
  return vendors
    .map((vendor) => {
      const own = list.filter((c) => c.vendorId === vendor.id);
      return {
        vendor,
        charges: own,
        invoices: own.filter((c) => c.doc.kind === "invoice").length,
        receipts: own.filter((c) => c.doc.kind === "receipt").length,
        currency: own[0]?.currency ?? "EUR",
        cents: own.reduce((s, c) => s + c.cents, 0),
        lastDate: own.map((c) => c.date).sort().at(-1) ?? "",
      };
    })
    .filter((v) => v.charges.length > 0)
    .sort((a, b) => b.charges.length - a.charges.length || b.cents - a.cents);
}

export const month = {
  addresses: new Set(vendors.filter((v) => charges.some((c) => c.vendorId === v.id)).map((v) => v.portal.path)).size,
  formats: new Set(vendors.filter((v) => charges.some((c) => c.vendorId === v.id)).map((v) => v.portal.get)).size,
  signIns: new Set(vendors.filter((v) => charges.some((c) => c.vendorId === v.id)).map((v) => v.portal.signIn)).size,
  charges: charges.length,
  vendors: new Set(charges.map((c) => c.vendorId)).size,
  invoices: charges.filter((c) => c.doc.kind === "invoice").length,
  receipts: charges.filter((c) => c.doc.kind === "receipt").length,
  totals: totalsLabel(charges),
};

/* Dollar charges reach a euro account converted at the card network's
   rate of the day. One illustrative rate for the month keeps the
   accountant's screen and every other screen in agreement. */
export const USD_PER_EUR = 1.1667;

export function bankCents(c: Charge): number {
  return c.currency === "EUR" ? c.cents : Math.round(c.cents / USD_PER_EUR);
}

export const latest = (n: number, list: Charge[] = charges): Charge[] => list.slice(0, n);

/* One charge per vendor, newest first: the rows a mockup shows when it
   wants every vendor on screen rather than Kestrel's 33 top-ups. */
export function onePerVendor(list: Charge[] = charges): Charge[] {
  const seen = new Set<string>();
  return list.filter((c) => (seen.has(c.vendorId) ? false : (seen.add(c.vendorId), true)));
}

/* The single document the hero puts on the table: the latest Kestrel
   top-up, as the vendor's own PDF would render it. */
export const heroDocument = charges.find((c) => c.vendorId === "kestrel" && c.date === iso(26))!;

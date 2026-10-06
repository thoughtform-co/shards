/*
 * Folio: the one dataset behind every screen on /folio and every social
 * frame. Totals are computed here, never typed into a component, so no
 * two mockups can disagree about the month.
 *
 * The tools are real: twelve that Vince pays for. Where each keeps its
 * invoice comes from the portal notes of Ledger, his invoice pipeline,
 * written in his own sessions. Everything else is illustration: every
 * amount (a public list price where one is well known, otherwise invented),
 * the accountant, both cards, every document number, and the VAT number,
 * which is masked. The month's shape (one AI vendor billing small top-ups
 * several times a day, a handful of flat subscriptions) is taken from life.
 */

import { LOGOS, type Logo } from "./folio-logos";

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
  /* Where the vendor is based, as its invoices say. */
  hq: string;
  /* How the charge reads on the bank statement. */
  statement: string;
  monogram: string;
  /* The tile behind the mark; `ring` draws a hairline round a light tile. */
  tile: { bg: string; fg: string; ring?: boolean };
  logo?: Logo;
  docPrefix: string;
  /* Where this vendor keeps its invoice, what you meet there, and how the
     account is signed in to. From Ledger's portal notes. */
  portal: { path: string; get: GetKind; signIn: string };
}

export type GetKind =
  | "console-rows"
  | "zip"
  | "per-account"
  | "side-panel"
  | "modal"
  | "stripe-view"
  | "workspaces"
  | "stripe-receipt"
  | "email";

export const GET_LABEL: Record<GetKind, string> = {
  "console-rows": "PDF per row, in the console",
  zip: "Downloads a ZIP",
  "per-account": "One console per account",
  "side-panel": "Side panel, then PDF",
  modal: "Billing is a modal, no URL",
  "stripe-view": "Opens a Stripe receipt page",
  workspaces: "One bill per workspace",
  "stripe-receipt": "Stripe page, receipt download",
  email: "Emailed by the vendor",
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
  person: "Vince Buyssens",
  initials: "VB",
  company: "Thoughtform",
  city: "",
  country: "Belgium",
  vat: "BE 0•••.•••.•••",
  accountant: "Janssens Accountancy",
  period: "September 2026",
  periodShort: "Sep 2026",
};

export const cards: Card[] = [
  { id: "biz", brand: "Mastercard", last4: "4417", label: "Business debit" },
  { id: "personal", brand: "Visa", last4: "9021", label: "Personal credit" },
];

const DARK = { bg: "#000000", fg: "#ffffff" };
const LIGHT = { bg: "#ffffff", fg: "#000000", ring: true };

/* The eight whose invoice sits behind a sign-in come first, in the order
   the film's hunt shows them; the four that email theirs follow. */
export const vendors: Vendor[] = [
  { id: "claude", name: "Claude", legalName: "Anthropic, PBC", hq: "San Francisco, United States", statement: "ANTHROPIC", monogram: "C", tile: { bg: "#f0eee6", fg: "#191919" }, logo: LOGOS.claude, docPrefix: "ANT", portal: { path: "console.anthropic.com/settings/bills", get: "console-rows", signIn: "Google sign-in" } },
  { id: "slack", name: "Slack", legalName: "Slack Technologies Limited", hq: "Dublin, Ireland", statement: "SLACK", monogram: "S", tile: LIGHT, logo: LOGOS.slack, docPrefix: "SLK", portal: { path: "thoughtform-co.slack.com/admin/billing/history", get: "zip", signIn: "Workspace sign-in" } },
  { id: "google", name: "Google Workspace", legalName: "Google Cloud EMEA Limited", hq: "Dublin, Ireland", statement: "GOOGLE*WORKSPACE", monogram: "G", tile: LIGHT, logo: LOGOS.google, docPrefix: "GWS", portal: { path: "admin.google.com/ac/billing/subscriptions", get: "per-account", signIn: "Per Google account" } },
  { id: "figma", name: "Figma", legalName: "Figma, Inc.", hq: "San Francisco, United States", statement: "FIGMA", monogram: "F", tile: LIGHT, logo: LOGOS.figma, docPrefix: "FIG", portal: { path: "figma.com/files/team/…/billing/invoices", get: "side-panel", signIn: "Google sign-in" } },
  { id: "notion", name: "Notion", legalName: "Notion Labs, Inc.", hq: "San Francisco, United States", statement: "NOTION LABS", monogram: "N", tile: LIGHT, logo: LOGOS.notion, docPrefix: "NOT", portal: { path: "notion.so · Settings → Billing", get: "modal", signIn: "Google sign-in" } },
  { id: "cursor", name: "Cursor", legalName: "Anysphere, Inc.", hq: "San Francisco, United States", statement: "CURSOR AI", monogram: "C", tile: DARK, logo: LOGOS.cursor, docPrefix: "CUR", portal: { path: "cursor.com/dashboard/billing", get: "stripe-view", signIn: "GitHub sign-in" } },
  { id: "webflow", name: "Webflow", legalName: "Webflow, Inc.", hq: "San Francisco, United States", statement: "WEBFLOW.COM", monogram: "W", tile: { bg: "#146ef5", fg: "#ffffff" }, logo: LOGOS.webflow, docPrefix: "WF", portal: { path: "webflow.com/dashboard → Billing", get: "workspaces", signIn: "Google + 2FA" } },
  { id: "midjourney", name: "Midjourney", legalName: "Midjourney, Inc.", hq: "San Francisco, United States", statement: "MIDJOURNEY INC.", monogram: "M", tile: LIGHT, logo: LOGOS.midjourney, docPrefix: "MJ", portal: { path: "midjourney.com/account → Billing", get: "stripe-receipt", signIn: "Midjourney account" } },
  { id: "superhuman", name: "Superhuman", legalName: "Superhuman Labs, Inc.", hq: "San Francisco, United States", statement: "SUPERHUMAN MAIL", monogram: "S", tile: { bg: "#1d1340", fg: "#ffffff" }, docPrefix: "SH", portal: { path: "Inbox · billing@superhuman.com", get: "email", signIn: "Google sign-in" } },
  { id: "openai", name: "OpenAI", legalName: "OpenAI Ireland Ltd", hq: "Dublin, Ireland", statement: "OPENAI *CHATGPT SUBSCR", monogram: "O", tile: DARK, logo: LOGOS.openai, docPrefix: "OAI", portal: { path: "Inbox · receipts@openai.com", get: "email", signIn: "Google sign-in" } },
  { id: "supabase", name: "Supabase", legalName: "Supabase Pte. Ltd.", hq: "Singapore", statement: "SUPABASE", monogram: "S", tile: { bg: "#1c1c1c", fg: "#3ecf8e" }, logo: LOGOS.supabase, docPrefix: "SUP", portal: { path: "Inbox · billing@supabase.io", get: "email", signIn: "GitHub sign-in" } },
  { id: "vercel", name: "Vercel", legalName: "Vercel Inc.", hq: "San Francisco, United States", statement: "VERCEL INC.", monogram: "V", tile: DARK, logo: LOGOS.vercel, docPrefix: "VRC", portal: { path: "Inbox · billing@vercel.com", get: "email", signIn: "GitHub sign-in" } },
];

/* Claude's API credits top up whenever the balance runs low, several times
   on a busy day. Invented amounts, a real shape. */
const claudeTopUps: Array<[day: number, cents: number]> = [
  [1, 1036], [2, 1058], [2, 1013], [3, 1127], [4, 1049],
  [5, 1008], [5, 1086], [5, 1272], [8, 1031], [9, 1156],
  [10, 1094], [10, 1018], [10, 1309], [10, 1065],
  [11, 1003], [11, 1588], [11, 1047], [11, 1531], [11, 1069], [11, 1102],
  [12, 1026], [14, 1015], [14, 1546], [15, 1072], [17, 1059],
  [22, 1091], [23, 1176], [23, 1084], [23, 1139], [23, 1006],
  [25, 1028], [26, 1055],
];

/* One charge each for the rest: [day, vendor, cents, currency, item]. */
const subscriptions: Array<[number, string, number, Currency, string]> = [
  [21, "claude", 9000, "EUR", "Subscription, monthly"],
  [1, "google", 1680, "EUR", "Subscription, monthly"],
  [3, "notion", 1200, "USD", "Subscription, monthly"],
  [3, "supabase", 2500, "USD", "Subscription, monthly"],
  [4, "superhuman", 3000, "USD", "Subscription, monthly"],
  [5, "cursor", 4000, "USD", "Subscription, monthly, two seats"],
  [5, "vercel", 2000, "USD", "Subscription, monthly"],
  [8, "slack", 875, "EUR", "Subscription, monthly"],
  [9, "openai", 2000, "USD", "Subscription, monthly"],
  [12, "webflow", 2900, "USD", "Subscription, monthly"],
  [17, "webflow", 1800, "USD", "Subscription, monthly"],
  [19, "midjourney", 3000, "USD", "Subscription, monthly"],
  [24, "figma", 1500, "EUR", "Subscription, monthly"],
];

const iso = (day: number) => `2026-09-${String(day).padStart(2, "0")}`;

/* Midjourney's billing page hands over a Stripe receipt (Ledger's portal
   notes); every other vendor here issues an invoice. */
const RECEIPT_ONLY = new Set(["midjourney"]);

function buildCharges(): Charge[] {
  const rows: Array<[number, string, number, Currency, string]> = [
    ...claudeTopUps.map(([day, cents]): [number, string, number, Currency, string] => [day, "claude", cents, "EUR", "API credits"]),
    ...subscriptions,
  ];
  const seq = new Map<string, number>();
  const out = rows
    .sort((a, b) => a[0] - b[0])
    .map(([day, vendorId, cents, currency, item], i): Charge => {
      const n = (seq.get(vendorId) ?? 0) + 1;
      seq.set(vendorId, n);
      const prefix = vendors.find((v) => v.id === vendorId)!.docPrefix;
      return {
        id: `${vendorId}-${i}`,
        vendorId,
        date: iso(day),
        cents,
        currency,
        item,
        card: "biz",
        doc: {
          kind: RECEIPT_ONLY.has(vendorId) ? "receipt" : "invoice",
          number: `${prefix}-2609-${String(n).padStart(4, "0")}`,
        },
      };
    });
  return out.reverse();
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
  /* The vendors whose invoice sits behind a sign-in, not in the inbox. */
  portals: vendors.filter((v) => v.portal.get !== "email").length,
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
   wants every vendor on screen rather than Claude's 32 top-ups. */
export function onePerVendor(list: Charge[] = charges): Charge[] {
  const seen = new Set<string>();
  return list.filter((c) => (seen.has(c.vendorId) ? false : (seen.add(c.vendorId), true)));
}

/* The single document the hero puts on the table: Figma's September
   invoice, as the vendor's own PDF would render it. */
export const heroDocument = charges.find((c) => c.vendorId === "figma")!;

/*
 * Folio copy. Every sentence on /folio lives here, so the page never holds
 * raw prose in JSX and the copy can be graded as one file. Rules: no em
 * dashes, no italics, no replacement contrast in headings, every factual
 * claim carries a source id from `sources` below. Persona figures come
 * from content/folio.ts and are labelled illustrative.
 */

import { month as dataMonth } from "./folio";

export type SourceId =
  | "sessions"
  | "agent-wallet"
  | "hosted-invoice"
  | "receipts"
  | "be-mandate"
  | "vida"
  | "link"
  | "oauth"
  | "webauthn"
  | "mcp-auth";

export interface Source {
  id: SourceId;
  publisher: string;
  title: string;
  url: string;
}

export const sources: Source[] = [
  {
    id: "agent-wallet",
    publisher: "Stripe on X, 29 April 2026",
    title: "Launch of the Link wallet for agents",
    url: "https://x.com/stripe/status/2049529444092838116",
  },
  {
    id: "sessions",
    publisher: "Stripe blog",
    title: "Everything we announced at Sessions 2026",
    url: "https://stripe.com/blog/everything-we-announced-at-sessions-2026",
  },
  {
    id: "hosted-invoice",
    publisher: "Stripe Docs",
    title: "Hosted invoice page: invoice URLs",
    url: "https://docs.stripe.com/invoicing/hosted-invoice-page",
  },
  {
    id: "receipts",
    publisher: "Stripe Docs",
    title: "Receipts and paid invoices",
    url: "https://docs.stripe.com/receipts",
  },
  {
    id: "be-mandate",
    publisher: "Vertex",
    title: "Belgium's 2026 e-invoicing regulations explained",
    url: "https://www.vertexinc.com/resources/resource-library/belgiums-2026-e-invoicing-regulations-explained-scope-deadlines-and-penalties",
  },
  {
    id: "vida",
    publisher: "Fonoa",
    title: "Peppol adoption in Europe 2026: mandates and ViDA",
    url: "https://www.fonoa.com/resources/blog/peppol-adoption-europe-2026-mandates-vida",
  },
  {
    id: "link",
    publisher: "Stripe",
    title: "Link",
    url: "https://stripe.com/payments/link",
  },
  {
    id: "oauth",
    publisher: "IETF",
    title: "The OAuth 2.1 Authorization Framework (draft)",
    url: "https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/",
  },
  {
    id: "webauthn",
    publisher: "W3C",
    title: "Web Authentication, Level 3 (passkeys)",
    url: "https://www.w3.org/TR/webauthn-3/",
  },
  {
    id: "mcp-auth",
    publisher: "Model Context Protocol",
    title: "Specification: authorization",
    url: "https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization",
  },
];

export const sourceNumber = (id: SourceId): number => sources.findIndex((s) => s.id === id) + 1;

/* Counts in the copy come from the dataset, never from a typed number. */
const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
export function fill(text: string): string {
  return text
    .replace(/\{charges\}/g, String(dataMonth.charges))
    .replace(/\{vendors\}/g, COUNT_WORDS[dataMonth.vendors] ?? String(dataMonth.vendors));
}

export const nav = {
  links: [
    { href: "#how", label: "How it works" },
    { href: "#agent", label: "For your agent" },
    { href: "#accountant", label: "For your accountant" },
    { href: "#stripe", label: "For Stripe" },
  ],
  cta: "The pitch to Stripe",
};

export const hero = {
  eyebrow: "Invoices and receipts for the software you pay by card",
  titleLines: ["The paper behind", "every payment."],
  lede:
    "Approve one read-only grant at your payment provider. Folio then collects the invoice or receipt behind every software charge and hands it to your agent and your accountant, without a login at a single vendor.",
  primary: "See how it works",
  secondary: "The pitch to Stripe",
  illustrative: "Illustrative account. Every name and number on this page is invented.",
};

export const theMonth = {
  label: "The month",
  title: "The wallet keeps none of the paper",
  body: [
    "In September, Studio Merel paid {vendors} software vendors with the same business card, through the same wallet. The wallet lists all {charges} charges with the vendor, the date, the amount and the card, and offers a document for none of them.",
    "The invoices sit in {vendors} billing portals, each behind its own login and sometimes a second factor, and the accountant wants every one of them before the quarter closes. So someone signs in {vendors} times to download, rename and forward PDFs the payment provider already holds.",
  ],
  facts: [
    {
      text: "The link in an invoice email stops working 30 days after the due date and never lasts longer than 120 days; a receipt link expires after 30.",
      sources: ["hosted-invoice", "receipts"] as SourceId[],
    },
    {
      text: "Belgium's Peppol mandate covers invoices between Belgian businesses. Cross-border invoices inside the EU follow by July 2030.",
      sources: ["be-mandate", "vida"] as SourceId[],
    },
    {
      text: "The e-invoicing integration Stripe announced with Billit at Sessions 2026 is built for the business that issues the invoice.",
      sources: ["sessions"] as SourceId[],
    },
  ],
};

export const how = {
  label: "How it works",
  title: "One approval at the payment layer",
  body:
    "Folio asks for one grant at your payment provider, approved with a passkey, read-only and limited to the cards you pick. From then on every charge on those cards arrives in Folio with the vendor's own invoice or receipt attached.",
  steps: [
    {
      n: "01",
      title: "Approve",
      text: "Pick the cards and approve with a passkey. The grant reads documents and can't pay, cancel or see anything else.",
    },
    {
      n: "02",
      title: "Collect",
      text: "Each new charge arrives with the vendor's PDF, the fields read from it, and the card that paid, which most invoices leave out.",
    },
    {
      n: "03",
      title: "Deliver",
      text: "Your agent reads the month through MCP and your accountant's software receives it on the first of the month. You revoke the grant in one tap.",
    },
  ],
};

export const bridge = {
  label: "The record",
  title: "Nothing for the vendor to build",
  body:
    "The vendor already issues the invoice inside its payment provider, and the provider already knows which invoice belongs to which of your payments. What's missing is a consent that crosses from the vendor's account to yours. Folio holds that consent and keeps one record per charge.",
};

export const agent = {
  label: "For your agent",
  title: "Your agent files the paperwork",
  body:
    "Since April an agent can pay through Link, with an approval for every purchase. Folio gives the same agent the paperwork: three tools to read the month, and a fourth that sends it out, which asks you first.",
  tools: [
    { name: "list_documents", args: "period, card", text: "Every charge in a period, with its document." },
    { name: "get_document", args: "id", text: "The vendor's PDF and the fields read from it." },
    { name: "missing", args: "period", text: "Charges without an invoice, and the reason for each." },
    { name: "deliver", args: "period, to", text: "Sends the month to your accountant, after you approve." },
  ],
  sources: ["agent-wallet", "mcp-auth"] as SourceId[],
};

export const accountant = {
  label: "For your accountant",
  title: "Your accountant gets matched documents",
  body: [
    "Each document lands in the accountant's purchase inbox beside the one bank line it settles, to the cent, and a dollar charge shows the rate it cleared at.",
    "The card that paid decides which company books it, so a charge on the personal card never ends up in the company's ledger.",
  ],
  note: "Exchange rate illustrative.",
};

export const grant = {
  label: "The grant",
  title: "What the grant can and cannot do",
  can: [
    "Read invoices, receipts and credit notes for charges on the cards you chose",
    "Read the vendor's legal name and VAT details as printed on the document",
    "See the amount, the date and the card of each of those charges",
  ],
  cannot: [
    "Make a payment, of any size",
    "Change, pause or cancel a subscription",
    "See a card you left out, or keep access after you revoke it",
  ],
  built:
    "Every part of it exists as a standard today: OAuth 2.1 for the grant, passkeys for the approval, and the MCP authorization spec for the agent.",
  builtSources: ["oauth", "webauthn", "mcp-auth"] as SourceId[],
};

export const limits = {
  label: "The limits",
  title: "What Folio cannot do",
  items: [
    {
      title: "Make a vendor issue an invoice",
      text: "Subscriptions get an invoice automatically, but a one-off checkout gets one only if the vendor turned that on. Otherwise Folio collects the receipt and says so.",
      sources: ["receipts"] as SourceId[],
    },
    {
      title: "Reach every processor",
      text: "A vendor that bills through another payment provider, or by bank transfer, stays outside the grant until that provider offers the same consent.",
      sources: [] as SourceId[],
    },
    {
      title: "Replace the legal invoice",
      text: "The invoice stays the vendor's. Folio keeps the vendor's own PDF and the fields read from it, and reissues nothing; where an e-invoice is required, the vendor still sends one.",
      sources: [] as SourceId[],
    },
    {
      title: "Exist without one endpoint",
      text: "Everything above depends on a consented, read-only endpoint at the payment provider. Nobody offers it yet, so for now this page is a drawing.",
      sources: [] as SourceId[],
    },
  ],
};

export const stripe = {
  label: "For Stripe",
  title: "For Stripe, it is one endpoint",
  body: [
    "Link already shows each charge with its line item, subtotal and tax, and for every invoiced payment Stripe already knows which invoice it settled. Since 29 April an agent can pay through Link, with an approval for every purchase.",
    "The document behind that purchase is one join away: a consented, read-only endpoint on the payer's side, scoped to the cards they choose. Folio is that endpoint drawn out in full, from the passkey to the accountant's inbox.",
  ],
  sources: ["agent-wallet", "link"] as SourceId[],
  closer: "Ship it, or buy us.",
  cta: { label: "Talk to the person behind Folio", href: "https://thoughtform.co" },
};

export const footer = {
  disclaimer:
    "Folio is a concept by Vince Buyssens. It is not a company and it is not affiliated with Stripe or Link. The screens are illustrations, and every person, company, card, vendor and amount on this page is invented.",
  trademarks: "Link and Stripe are trademarks of Stripe, Inc.",
  sourcesTitle: "Sources",
};

export const frames = {
  month: "The wallet lists {charges} charges and none of the invoices.",
  endpoint: "The smallest feature Stripe hasn't shipped yet.",
  approval: "One approval instead of {vendors} billing portals.",
  agent: "An agent that can pay should be able to file the invoice too.",
  footnote: "Folio is a concept. Every name and number is invented.",
};

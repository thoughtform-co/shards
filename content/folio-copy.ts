/*
 * Folio copy. Every sentence on /folio lives here, so the page never holds
 * raw prose in JSX and the copy can be graded as one file. Headings follow
 * Stripe's two-tone pattern: a claim (`strong`) that runs on into a grey
 * explanation (`soft`). Rules: no em dashes, no italics, every factual
 * claim carries a source id from `sources`. Counts come from the dataset
 * through `fill()`, never from a typed number.
 */

import { month as dataMonth, persona } from "./folio";

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

const COUNT_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
const word = (n: number) => COUNT_WORDS[n] ?? String(n);

/* {charges} and {docs} stay numerals; {vendors}, {addresses}, {formats}
   and {signIns} read as words. */
export function fill(text: string): string {
  const out = text
    .replace(/\{charges\}/g, String(dataMonth.charges))
    .replace(/\{docs\}/g, String(dataMonth.invoices + dataMonth.receipts))
    .replace(/\{vendors\}/g, word(dataMonth.vendors))
    .replace(/\{addresses\}/g, word(dataMonth.addresses))
    .replace(/\{formats\}/g, word(dataMonth.formats))
    .replace(/\{signIns\}/g, word(dataMonth.signIns))
    .replace(/\{accountant\}/g, persona.accountant)
    .replace(/\{company\}/g, persona.company);
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export const nav = {
  links: [
    { href: "#problem", label: "Why" },
    { href: "#how", label: "How it works" },
    { href: "#workflows", label: "Workflows" },
    { href: "#agents", label: "For agents" },
    { href: "#stripe", label: "For Stripe" },
  ],
  cta: "Read the pitch",
};

export const hero = {
  statLabel: "Billing pages visited this month",
  statValue: "0",
  strong: "Your agent can pay for your software. Now it can fetch the invoices.",
  soft: "Folio collects the invoice behind every tool you pay for with Link, through one read-only permission, for your agent and your accountant.",
  primary: "See how it works",
  secondary: "Read the pitch to Stripe",
  note: "Built for MCP clients such as Claude and ChatGPT. Every name and number on this page is invented.",
  agentLine: "Sent September to {accountant}: {docs} documents, one receipt flagged.",
};

export const problem = {
  label: "The problem",
  strong: "While paying takes one tap, collecting the invoices is the job that keeps moving to next week.",
  soft: "They're scattered across a dozen billing pages, and phishing means fewer vendors email the PDF.",
  payTitle: "Paying for a tool",
  payCaption: "One approval, any vendor.",
  collectTitle: "Collecting the invoices",
  collectCaption: "Three weeks of next week.",
  /* Newest first, the way a lock screen shows them. The accountant's three
     emails form one stack, as a phone groups mail from one sender; the
     first, polite request sits at the bottom of it. */
  notifications: [
    {
      app: "phone",
      when: "now",
      title: "Missed call",
      subject: "",
      body: "{accountant}",
      stack: [] as string[],
    },
    {
      app: "mail",
      when: "12m ago",
      title: "{accountant}",
      subject: "Re: Re: Re: September invoices",
      body: "Merel, we really need them today to file your VAT return on time.",
      stack: ["Re: Re: September invoices", "September invoices"],
    },
    {
      app: "calendar",
      when: "1h ago",
      title: "Do the invoices",
      subject: "",
      body: "16:00 to 16:30, moved for the fourth time",
      stack: [] as string[],
    },
    {
      app: "mail",
      when: "2d ago",
      title: "Lumen Voice",
      subject: "Your invoice link has expired",
      body: "Sign in to view your billing history.",
      stack: [] as string[],
    },
    {
      app: "reminders",
      when: "2w ago",
      title: "Download invoices",
      subject: "",
      body: "{vendors} billing pages, overdue",
      stack: [] as string[],
    },
  ],
  facts: [
    {
      text: "Emailed invoice links expire 30 days after the due date, 120 at most. Receipt links expire after 30.",
      sources: ["hosted-invoice", "receipts"] as SourceId[],
    },
    {
      text: "Belgium's Peppol mandate covers invoices between Belgian companies. Cross-border EU invoices follow by July 2030.",
      sources: ["be-mandate", "vida"] as SourceId[],
    },
    {
      text: "Stripe's e-invoicing integration with Billit, announced at Sessions 2026, is built for the business issuing the invoice.",
      sources: ["sessions"] as SourceId[],
    },
  ],
};

export const permission = {
  label: "The missing permission",
  strong: "If an agent can pay, it can fetch the invoice.",
  soft: "Link already lets an agent spend with your approval. Fetching the invoice needs the same consent, only narrower: read-only, per card, unable to move money.",
  sources: ["agent-wallet"] as SourceId[],
  columns: ["What your agent does", "Today", "With Folio"],
  rows: [
    { task: "Pay for a tool", today: "Link's agent wallet, one approval per purchase", todayOk: true, folio: "Unchanged" },
    { task: "Get the invoice", today: "Sign in at each vendor and find the billing page", todayOk: false, folio: "Collected through one read-only grant" },
    { task: "Send it to the accountant", today: "Download, rename, forward, repeat", todayOk: false, folio: "Delivered on the first, after you approve" },
    { task: "Notice a price change", today: "Only if someone reads every invoice", todayOk: false, folio: "Flagged the day the charge posts" },
  ],
};

export const how = {
  label: "How it works",
  strong: "One approval, then nothing to chase.",
  soft: "Approve a read-only grant once, with a passkey. Every charge then arrives with the vendor's own document attached.",
  steps: [
    { n: "1", title: "Approve once", text: "Pick the cards, approve with a passkey. That's the whole setup." },
    { n: "2", title: "Collect every charge", text: "Each charge arrives with the vendor's PDF and the card that paid, which most invoices leave out." },
    { n: "3", title: "Deliver anywhere", text: "To your agent over MCP, to your accountant on the first, or both. Revoke in one tap." },
  ],
};

export const workflows = {
  label: "Workflows",
  strong: "Your agent checks in when something needs you.",
  soft: "In Slack, Claude, ChatGPT or plain email. Most months it asks one question, and you stay in flow.",
  cards: {
    close: {
      channel: "#finance",
      when: "1 Oct, 09:00",
      title: "September is ready",
      text: "{docs} documents from {vendors} vendors, one receipt without an invoice. Send them to {accountant}?",
      actions: ["Send", "Review first"],
    },
    price: {
      channel: "Your agent",
      when: "14 Sep",
      title: "Price change",
      text: "Tally Tasks charged €6.00, up from €5.00 in August. The invoice lists a new price from 1 September.",
      actions: ["Looks right", "Ask Tally"],
    },
    vendor: {
      channel: "#finance",
      when: "3 Sep",
      title: "New vendor",
      text: "First charge from Halftone Image: €24.00 on the business card, so it's filed under {company}.",
      actions: ["Keep", "It's personal"],
    },
    missing: {
      channel: "Your agent",
      when: "27 Sep",
      title: "No invoice issued",
      text: "Meshwork 3D sent a receipt but no invoice for the credit pack. Want me to ask for one?",
      actions: ["Ask Meshwork", "Receipt is fine"],
    },
  },
};

export const agents = {
  label: "For agents",
  strong: "Four tools over MCP.",
  soft: "List the month, open a document, ask what's missing, deliver. The last one always waits for you.",
  tools: [
    { name: "list_documents", args: "period, card", text: "Every charge in a period, with its document." },
    { name: "get_document", args: "id", text: "The vendor's PDF and the fields read from it." },
    { name: "missing", args: "period", text: "Charges without an invoice, and why." },
    { name: "deliver", args: "period, to", text: "Sends the month to your accountant, after you approve." },
  ],
  sources: ["mcp-auth"] as SourceId[],
};

export const accountants = {
  label: "For accountants",
  strong: "Documents arrive matched to the bank line.",
  soft: "Each document sits beside the bank line it settles, to the cent, with the rate for dollar charges. The card that paid decides which company books it.",
  note: "Exchange rate illustrative.",
};

export const grant = {
  label: "Security",
  strong: "What the grant can and cannot do.",
  soft: "Built only from standards that exist today: OAuth 2.1, passkeys and MCP authorization.",
  softSources: ["oauth", "webauthn", "mcp-auth"] as SourceId[],
  can: [
    "Read invoices, receipts and credit notes for the cards you chose",
    "Read the vendor's name and VAT details on each document",
    "See each charge's amount, date and card",
  ],
  cannot: [
    "Pay for anything",
    "Change or cancel a subscription",
    "See other cards, or keep access after you revoke it",
  ],
};

export const limits = {
  label: "Limits",
  strong: "What Folio cannot do.",
  soft: "The edges, so nobody is surprised later.",
  items: [
    {
      title: "Make a vendor issue an invoice",
      text: "A one-off checkout only gets an invoice if the vendor turned that on. Otherwise Folio collects the receipt and says so.",
      sources: ["receipts"] as SourceId[],
    },
    {
      title: "Reach every processor",
      text: "Vendors billing through another provider, or by bank transfer, stay out of reach until that provider offers the same consent.",
      sources: [] as SourceId[],
    },
    {
      title: "Replace the legal invoice",
      text: "The vendor still issues it. Folio keeps their PDF and reissues nothing.",
      sources: [] as SourceId[],
    },
    {
      title: "Exist without one endpoint",
      text: "It needs a read-only endpoint at the payment provider. Nobody offers one yet, so for now this page is a drawing.",
      sources: [] as SourceId[],
    },
  ],
};

export const stripe = {
  label: "For Stripe",
  strong: "It is one endpoint.",
  soft: "Link already shows every charge with its line item and tax, and Stripe already knows which invoice each payment settled.",
  softSources: ["link"] as SourceId[],
  body: [
    "Since 29 April an agent can pay through Link. The invoice behind that purchase is one consented, read-only endpoint away.",
    "You took the friction out of paying. Folio takes it out of the paperwork that follows.",
  ],
  bodySources: ["agent-wallet"] as SourceId[],
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
  hunt: "Every vendor hides the invoice somewhere else.",
  endpoint: "The smallest feature Stripe hasn't shipped yet.",
  approval: "One approval instead of {vendors} billing portals.",
  agent: "If an agent can pay, it can fetch the invoice.",
  workflows: "Your agent checks in when something needs you.",
  flow: "On paper it takes a few minutes a month.",
  footnote: "Folio is a concept. Every name and number is invented.",
};

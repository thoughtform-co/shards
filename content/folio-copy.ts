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
  statLabel: "Documents collected for September",
  statValue: "{docs} of {charges}",
  strong: "Your agent can pay for your software. Now it can fetch the invoices.",
  soft: "Folio collects the invoice behind every tool you pay for with Link, through one read-only permission, and hands it to your agent and your accountant.",
  primary: "See how it works",
  secondary: "Read the pitch to Stripe",
  note: "Built for MCP clients such as Claude and ChatGPT. Illustrative account: every name and number on this page is invented.",
  agentLine: "Sent September to {accountant}: {docs} documents, one receipt flagged.",
};

export const problem = {
  label: "The problem",
  strong: "Every vendor hides the invoice somewhere else.",
  soft: "AI made it normal to try a new tool every week and keep the ones your agents can use. Paying for them takes one tap. The invoice still takes a login, a different address at every vendor, and sometimes a screenshot of a pop-up.",
  payTitle: "Paying for a tool",
  payCaption: "One approval in the wallet, for any vendor.",
  huntTitle: "Getting its invoice",
  huntCaption: "{vendors} vendors, {addresses} addresses, {formats} formats and {signIns} ways to sign in, for one card and one company.",
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

export const permission = {
  label: "The missing permission",
  strong: "If an agent can pay, it can fetch the invoice.",
  soft: "Link's wallet for agents already lets you hand an agent the right to spend, approved purchase by purchase. The paperwork behind those purchases needs the same kind of consent, only narrower: read-only, limited to the cards you choose, and unable to move money.",
  sources: ["agent-wallet"] as SourceId[],
  columns: ["What your agent does", "Today", "With Folio"],
  rows: [
    { task: "Pay for a tool", today: "Link's agent wallet, one approval per purchase", todayOk: true, folio: "Unchanged" },
    { task: "Get the invoice", today: "Sign in at each vendor and find its billing page", todayOk: false, folio: "Collected through one read-only grant" },
    { task: "Send it to the accountant", today: "Download, rename and forward each PDF", todayOk: false, folio: "Delivered on the first of the month, after you approve" },
    { task: "Notice a price change", today: "Only if someone reads every invoice", todayOk: false, folio: "Flagged the day the charge posts" },
  ],
};

export const how = {
  label: "How it works",
  strong: "One approval, then nothing to chase.",
  soft: "You approve a read-only grant at your payment provider once, with a passkey. Every charge on those cards then arrives in Folio with the vendor's own document attached.",
  steps: [
    {
      n: "1",
      title: "Approve once",
      text: "Pick the cards and approve with a passkey. The grant reads documents and can't pay, cancel or see anything else.",
    },
    {
      n: "2",
      title: "Collect every charge",
      text: "Each new charge arrives with the vendor's PDF, the fields read from it, and the card that paid, which most invoices leave out.",
    },
    {
      n: "3",
      title: "Deliver anywhere",
      text: "Your agent reads the month over MCP, your accountant's software receives it on the first, and you revoke the grant in one tap.",
    },
  ],
};

export const workflows = {
  label: "Workflows",
  strong: "Your agent checks in when something needs you.",
  soft: "Folio runs small workflows wherever your agent already lives, in Slack, Claude, ChatGPT or plain email, and most months it asks a single question.",
  cards: {
    close: {
      channel: "#finance",
      when: "1 Oct, 09:00",
      title: "September is ready",
      text: "{docs} documents from {vendors} vendors. One is a receipt without an invoice. Send them to {accountant}?",
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
      text: "Meshwork 3D sent a receipt but no invoice for the credit pack. Want me to ask them for one?",
      actions: ["Ask Meshwork", "Receipt is fine"],
    },
  },
};

export const agents = {
  label: "For agents",
  strong: "Four tools over MCP.",
  soft: "Folio is an MCP server. Your agent lists the month, opens any document, asks what's missing and delivers, and the last of those always waits for your approval.",
  tools: [
    { name: "list_documents", args: "period, card", text: "Every charge in a period, with its document." },
    { name: "get_document", args: "id", text: "The vendor's PDF and the fields read from it." },
    { name: "missing", args: "period", text: "Charges without an invoice, and the reason for each." },
    { name: "deliver", args: "period, to", text: "Sends the month to your accountant, after you approve." },
  ],
  sources: ["mcp-auth"] as SourceId[],
};

export const accountants = {
  label: "For accountants",
  strong: "Documents arrive matched to the bank line.",
  soft: "Each document lands in the purchase inbox beside the one bank line it settles, to the cent, and a dollar charge shows the rate it cleared at. The card that paid decides which company books it, so a charge on the personal card never ends up in the company's ledger.",
  note: "Exchange rate illustrative.",
};

export const grant = {
  label: "Security",
  strong: "What the grant can and cannot do.",
  soft: "Every part of it is a standard that exists today: OAuth 2.1 for the grant, passkeys for the approval and the MCP authorization spec for the agent.",
  softSources: ["oauth", "webauthn", "mcp-auth"] as SourceId[],
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
};

export const limits = {
  label: "Limits",
  strong: "What Folio cannot do.",
  soft: "Collecting paper is narrower than it sounds, and the edges are worth knowing before you rely on it.",
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
  strong: "It is one endpoint.",
  soft: "Link already shows every charge with its line item, subtotal and tax, and for every invoiced payment Stripe already knows which invoice it settled.",
  softSources: ["link"] as SourceId[],
  body: [
    "Since 29 April an agent can pay through Link, with an approval for every purchase. The document behind that purchase is one join away: a consented, read-only endpoint on the payer's side, scoped to the cards they choose.",
    "Folio is that endpoint drawn out in full, from the passkey to the accountant's inbox.",
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
  footnote: "Folio is a concept. Every name and number is invented.",
};

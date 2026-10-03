import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans, Newsreader } from "next/font/google";
import "./folio.css";
import "@/components/folio/mocks.css";

/*
 * Route-local layout for Folio, a concept landing page for a fictional
 * startup. Public (see proxy.ts), light, and deliberately unlike both
 * Stripe and Thoughtform. next/font self-hosts the faces, which is what
 * lets them load under the site's `font-src 'self'` CSP.
 *
 *   Newsreader       → headlines and the wordmark (optical sizes, upright only)
 *   Instrument Sans  → interface and body text
 *   Geist Mono       → figures, amounts, document numbers
 */
const serif = Newsreader({
  variable: "--fo-font-serif",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal"],
  display: "swap",
});

const sans = Instrument_Sans({
  variable: "--fo-font-sans",
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--fo-font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shards-cyan.vercel.app"),
  title: { absolute: "Folio · The paper behind every payment" },
  description:
    "A concept: one read-only grant at the payment layer collects the invoice or receipt behind every software charge and delivers it to your agent and your accountant.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    title: "Folio · The paper behind every payment",
    description:
      "A concept: one read-only grant at the payment layer collects the invoice behind every software charge, for your agent and your accountant.",
    url: "/folio",
    images: [{ url: "/folio/og.png", width: 1200, height: 630, alt: "Folio: the paper behind every payment" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Folio · The paper behind every payment",
    images: ["/folio/og.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f1e9",
};

export default function FolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} ${sans.variable} ${mono.variable} folio-shell`} data-folio-shell="">
      {children}
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter_Tight, Source_Code_Pro } from "next/font/google";
import "./folio.css";
import "@/components/folio/mocks.css";

/*
 * Route-local layout for Folio, a concept landing page for a fictional
 * startup, set in the register of a Stripe product page so it reads as
 * something that would slot into Link. Public (see proxy.ts) and light.
 * next/font self-hosts the faces, which is what lets them load under the
 * site's `font-src 'self'` CSP.
 *
 *   Inter Tight      → everything; the closest free cut to Stripe's Söhne,
 *                      used as a variable font so headlines can sit at 380
 *   Source Code Pro  → code, paths and figures, as in Stripe's docs
 */
const sans = Inter_Tight({
  variable: "--fo-font-sans",
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
});

const mono = Source_Code_Pro({
  variable: "--fo-font-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = "Folio · Invoices for everything your agent pays for";
const description =
  "A concept: one read-only permission at the payment layer collects the invoice behind every tool you pay for with Link, and delivers it to your agent and your accountant.";

export const metadata: Metadata = {
  metadataBase: new URL("https://shards-cyan.vercel.app"),
  title: { absolute: title },
  description,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/folio",
    images: [{ url: "/folio/og.png", width: 1200, height: 630, alt: "Folio: invoices for everything your agent pays for" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    images: ["/folio/og.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function FolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${sans.variable} ${mono.variable} folio-shell`} data-folio-shell="">
      {children}
    </div>
  );
}

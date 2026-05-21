import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { LoginForm } from "./login-form";
import { StripeLanding } from "./landing";
import styles from "./stripe.module.css";

const stripeFont = Inter({
  variable: "--font-stripe",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const COOKIE = "stripe_unlock";

export const metadata: Metadata = {
  title: "Stripe collection",
  description: "Access the Stripe collection — Link Collect and Link Skills.",
  robots: { index: false, follow: false },
};

interface StripePageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

function pickNext(value: string | string[] | undefined): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== "string") return undefined;
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return undefined;
  return candidate;
}

export default async function StripePage({ searchParams }: StripePageProps) {
  const [cookieStore, params] = await Promise.all([cookies(), searchParams]);
  const unlocked = cookieStore.get(COOKIE)?.value === "1";
  const next = pickNext(params.next);

  return (
    <div className={`${stripeFont.variable} ${styles.scene}`} role="main">
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          src="/images/stripe-office-landing.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.backdropImage}
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.markerTop} aria-hidden="true">
        <span className={styles.markerLeft}>
          <span className={styles.markerDot} />
          link · stripe
          <span className={styles.markerSep}>·</span>
          {unlocked ? "collection" : "executive review"}
        </span>
        <span className={styles.markerRight}>
          antwerp
          <span className={styles.markerSep}>·</span>
          cet
        </span>
      </div>

      {unlocked ? <StripeLanding /> : <LoginForm next={next} />}
    </div>
  );
}

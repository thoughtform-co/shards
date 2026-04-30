"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./stripe.module.css";

const surfaces = [
  {
    href: "/link-to-collect",
    label: "01 · Wallet",
    title: "Link / Collect",
    headline: "How you pay.",
    copy: "Link sees the payments. Link Collect organises the invoices.",
  },
  {
    href: "/link-to-collect/substrate",
    label: "02 · Agent",
    title: "Link / Skills",
    headline: "How you work.",
    copy: "An AI agent picks up the judgment behind the routines.",
  },
] as const;

export function StripeLanding() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLock() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/stripe/lock", { method: "POST" });
    } catch {
      // Silent fail — refresh below resets the UI either way.
    } finally {
      router.refresh();
      setPending(false);
    }
  }

  return (
    <div className={styles.landing}>
      <div className={styles.cards}>
        {surfaces.map((surface) => (
          <Link
            key={surface.href}
            href={surface.href}
            className={styles.cardLink}
            prefetch={false}
          >
            <span className={styles.cardLabel}>{surface.label}</span>
            <span className={styles.cardHeadline}>{surface.headline}</span>
            <span className={styles.cardTitle}>{surface.title}</span>
            <span className={styles.cardCopy}>{surface.copy}</span>
            <span className={styles.cardArrow} aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={handleLock}
        disabled={pending}
        className={styles.lockButton}
        aria-label="Lock the Stripe collection"
      >
        <span className={styles.lockDot} aria-hidden="true" />
        {pending ? "Locking" : "Lock collection"}
      </button>
    </div>
  );
}

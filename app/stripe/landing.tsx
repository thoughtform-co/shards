"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./stripe.module.css";

const surfaces = [
  {
    href: "/link-to-collect",
    label: "01 · Surface",
    title: "Link / Collect",
    copy: "Invoice collection for eligible Link payments — collect, request, and export to accounting.",
  },
  {
    href: "/link-to-collect/substrate",
    label: "02 · Substrate",
    title: "Link / Skills",
    copy: "Encode the routines behind your wallet activity into portable, callable skills.",
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
      <div className={styles.landingHead}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowBar} aria-hidden="true" />
          access granted · stripe collection
        </div>

        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span>Link</span>
          <span className={styles.brandSlash}>/</span>
          <span className={styles.brandAccent}>Stripe</span>
        </div>

        <h1 className={styles.landingHeadline}>
          The Stripe collection.
        </h1>

        <p className={styles.landingSub}>
          Two product surfaces encoding how Stripe handles invoice collection
          and the expertise behind it. Pick a surface to dive in.
        </p>
      </div>

      <div className={styles.cards}>
        {surfaces.map((surface) => (
          <Link
            key={surface.href}
            href={surface.href}
            className={styles.cardLink}
            prefetch={false}
          >
            <span className={styles.cardLabel}>{surface.label}</span>
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

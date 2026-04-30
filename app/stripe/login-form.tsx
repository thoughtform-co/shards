"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import styles from "./stripe.module.css";

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!shake) return;
    const t = window.setTimeout(() => setShake(false), 260);
    return () => window.clearTimeout(t);
  }, [shake]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const destination =
          next && next.startsWith("/") && !next.startsWith("//")
            ? next
            : "/stripe";
        router.replace(destination);
        router.refresh();
        return;
      }

      if (res.status === 500) {
        setError("Access is not configured on the server.");
      } else {
        setError("That key did not match. Try again.");
      }
      setShake(true);
      setPassword("");
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } catch {
      setError("Network hiccup. Try once more.");
      setShake(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.cardWrap}>
      <div className={`${styles.card} ${shake ? styles.shake : ""}`}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowBar} aria-hidden="true" />
          access · stripe collection
        </div>

        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span>Link</span>
          <span className={styles.brandSlash}>/</span>
          <span className={styles.brandAccent}>Collect</span>
        </div>

        <h1 className={styles.headline}>
          Enter the access key to view the Stripe collection.
        </h1>

        <p className={styles.support}>
          A small set of product surfaces encoding how Stripe collects invoices
          and the expertise behind it.
        </p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label
            className={`${styles.field} ${error ? styles.fieldError : ""}`}
            htmlFor="stripe-access-key"
          >
            <input
              ref={inputRef}
              id="stripe-access-key"
              name="password"
              type="password"
              autoComplete="current-password"
              spellCheck={false}
              placeholder="Access key"
              className={styles.input}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              aria-invalid={Boolean(error)}
              aria-describedby="stripe-access-error"
              disabled={pending}
            />
          </label>

          <button
            type="submit"
            className={styles.submit}
            disabled={pending || password.length === 0}
            aria-label="Unlock"
          >
            <span>{pending ? "Verifying" : "Unlock"}</span>
            <span className={styles.submitArrow} aria-hidden="true">
              →
            </span>
          </button>

          <div
            id="stripe-access-error"
            role="status"
            aria-live="polite"
            className={styles.errorMsg}
            data-visible={Boolean(error)}
          >
            {error ? (
              <>
                <span className={styles.errorDot} aria-hidden="true" />
                <span>{error}</span>
              </>
            ) : null}
          </div>
        </form>

        <div className={styles.foot}>
          <span>collect · request · export</span>
          <span className={styles.footMark}>v.2026.04</span>
        </div>
      </div>
    </div>
  );
}

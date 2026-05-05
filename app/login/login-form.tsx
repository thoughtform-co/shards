"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";

/*
 * Shards site gate.
 *
 * Posts the access key to /api/unlock; on 200 the proxy stops
 * rewriting to /login and the visitor lands on the previously
 * requested path (defaults to /). Keyboard-first UX: input is
 * autofocused, submit reveals an inline error and shakes the card on
 * 401.
 */
export function LoginForm() {
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
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace("/");
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
    <div className={styles.scope}>
      <div className={styles.scene} role="main" aria-label="Access required">
        <div className={styles.backdrop} aria-hidden="true" />
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.markerTop} aria-hidden="true">
          <span className={styles.markerLeft}>
            <span className={styles.markerDot} />
            shards
            <span className={styles.markerSep}>·</span>
            personal lab
          </span>
          <span className={styles.markerRight}>
            antwerp
            <span className={styles.markerSep}>·</span>
            cet
          </span>
        </div>

        <div className={styles.cardWrap}>
          <div className={`${styles.card} ${shake ? styles.shake : ""}`}>
            <div className={styles.eyebrow}>
              <span className={styles.bar} aria-hidden="true" />
              applied intelligence — private
            </div>

            <div className={styles.brand}>
              <span>Shards</span>
              <span className={styles.brandPeriod} aria-hidden="true">
                .
              </span>
            </div>

            <h1 className={styles.headline}>Enter the access key.</h1>

            <p className={styles.support}>
              A private dashboard of small experiments and prototypes — single-purpose
              tools, visual probes, and playful builds.
            </p>

            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <label
                className={`${styles.field} ${error ? styles.error : ""}`}
                htmlFor="shards-access-key"
              >
                <input
                  ref={inputRef}
                  id="shards-access-key"
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
                  aria-describedby="shards-access-error"
                  disabled={pending}
                />
              </label>

              <button
                type="submit"
                className={styles.submit}
                disabled={pending || password.length === 0}
                aria-label="Unlock"
              >
                <span className={styles.submitLabel}>
                  {pending ? "Verifying" : "Unlock"}
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </button>

              <div
                id="shards-access-error"
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
              <span>navigate · encode · build</span>
              <span className={styles.footMark}>v.2026.05</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

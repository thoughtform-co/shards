"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/*
 * Substrate top bar with industrial kicker + scroll-spy.
 *
 * Same IntersectionObserver pattern as weave-nav, repackaged with the
 * substrate look: brand + DWG/SCALE kicker on the left, monospaced
 * uppercase nav in the middle, dark ink CTA on the right.
 *
 * Smooth in-page scrolling is handled by CSS (scroll-behavior) on the
 * route; this component only tracks the active link.
 */

type NavLink = { id: string; label: string; href: string };

export function SubstrateNav({
  brand,
  kicker,
  links,
  cta,
}: {
  brand: string;
  kicker: readonly { label: string }[];
  links: readonly NavLink[];
  cta: { label: string; href: string };
}) {
  const [active, setActive] = useState<string>(links[0]?.id ?? "");

  useEffect(() => {
    const ids = links.map((l) => l.id);
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best && bestRatio > 0) setActive(best);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [links]);

  return (
    <header className="subs-bar" aria-label="Loam navigation">
      <Link className="subs-brand" href="/loam">
        <span className="subs-brand__mark" aria-hidden="true" />
        {brand}
        <span className="subs-brand__kicker">
          {kicker.map((k) => (
            <span key={k.label}>{k.label}</span>
          ))}
        </span>
      </Link>
      <nav className="subs-nav" aria-label="Sections">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={active === link.id ? "is-active" : ""}
            aria-current={active === link.id ? "true" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a className="subs-cta" href={cta.href}>
        {cta.label}
      </a>
    </header>
  );
}

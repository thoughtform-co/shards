"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/aether";

/**
 * Page-level navigation for Aether.
 *
 * The site is structured as three keynote pages — Vision (homepage),
 * Process and Demo — plus an in-page anchor for engagement (#offer).
 * Active state is computed from `usePathname()`. Links flagged with
 * `primary: true` (currently the Engage CTA) render as a pill so the
 * nav has one clear active-engagement moment.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link href="/" className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>{nav.brand}</span>
          <span className="brand-sub">{nav.brandSub}</span>
        </Link>

        <nav aria-label="Aether sections" className="nav-links">
          {nav.links.map((link) => {
            const hrefHasHash = link.href.includes("#");
            const isActive = !hrefHasHash && (
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href) ?? false
            );

            const className = [
              link.primary ? "nav-cta" : null,
              isActive ? "active" : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={className}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {link.primary ? <span className="nav-cta-arrow" aria-hidden="true">→</span> : null}
              </Link>
            );
          })}
          <span className="nav-meta">
            <span className="nav-meta-dot" aria-hidden="true" />
            <span>{nav.status}</span>
          </span>
        </nav>
      </div>
    </header>
  );
}

import type { CSSProperties, ReactNode } from "react";
import type { Vendor } from "@/content/folio";

/* Small shared pieces for every Folio mockup. Server components only. */

export function vars(map: Record<string, string | number>): CSSProperties {
  return map as CSSProperties;
}

/* The mark: a sheet with its corner folded down. White, for the icon. */
export function FolioMark({ size = 18, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg className="fo-mark" width={size * (14 / 18)} height={size} viewBox="0 0 14 18" aria-hidden="true">
      <path d="M0 0H9.5L14 4.5V18H0Z" fill={color} />
      <path d="M9.5 0V4.5H14Z" fill={color} opacity="0.55" />
    </svg>
  );
}

/* A Stripe-style product icon: the mark on the ribbon's gradient. */
export function AppIcon({ size = 28 }: { size?: number }) {
  return (
    <span className="fo-appicon" style={vars({ "--ai": `${size}px` })} aria-hidden="true">
      <FolioMark size={Math.round(size * 0.52)} />
    </span>
  );
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="fo-wordmark" style={vars({ "--wm": `${size}px` })}>
      <AppIcon size={Math.round(size * 1.18)} />
      <span>Folio</span>
    </span>
  );
}

/* Stripe's hover arrow: a chevron that grows a shaft on hover. */
export function Arrow() {
  return (
    <svg className="fo-arrow" viewBox="0 0 10 10" aria-hidden="true">
      <path className="fo-arrow__line" d="M0 5h7" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path className="fo-arrow__tip" d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function Monogram({ vendor, size = 28 }: { vendor: Vendor; size?: number }) {
  return (
    <span
      className="fo-tile"
      style={vars({ "--tile-bg": vendor.tile.bg, "--tile-fg": vendor.tile.fg, "--tile": `${size}px` })}
      aria-hidden="true"
    >
      {vendor.monogram}
    </span>
  );
}

export type PillTone = "ok" | "warn" | "muted" | "accent" | "ink" | "red";

export function Pill({ tone = "muted", children }: { tone?: PillTone; children: ReactNode }) {
  return <span className={`fo-pill fo-pill--${tone}`}>{children}</span>;
}

export function Check() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="fo-check">
      <path d="M1.5 5.2 4 7.6 8.6 2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocGlyph() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" className="fo-docglyph">
      <path d="M1 .75h6.4L11.25 4.6V13.25H1Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7.4.75V4.6h3.85M3.4 7.6h5.2M3.4 10h5.2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function PasskeyGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="7" cy="5.5" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 15.5c.4-3 2.6-5 5.5-5 1.2 0 2.3.3 3.2.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13.5" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 13v3.5m0-1.5h1.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

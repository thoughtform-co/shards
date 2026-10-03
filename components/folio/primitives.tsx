import type { CSSProperties, ReactNode } from "react";
import type { Vendor } from "@/content/folio";

/* Small shared pieces for every Folio mockup. Server components only. */

export function vars(map: Record<string, string | number>): CSSProperties {
  return map as CSSProperties;
}

/* The mark: a sheet with its corner folded down in the accent. */
export function FolioMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      className="fo-mark"
      width={size * (14 / 18)}
      height={size}
      viewBox="0 0 14 18"
      aria-hidden="true"
    >
      <path d="M0 0H9.5L14 4.5V18H0Z" fill="currentColor" />
      <path d="M9.5 0V4.5H14Z" fill="var(--fo-accent)" />
    </svg>
  );
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="fo-wordmark" style={vars({ "--wm": `${size}px` })}>
      <FolioMark size={Math.round(size * 0.86)} />
      <span>Folio</span>
    </span>
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

export type PillTone = "ok" | "warn" | "muted" | "accent" | "ink";

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

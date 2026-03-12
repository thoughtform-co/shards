import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ExperimentManifest } from "@/experiments/types";

type ExperimentCardProps = {
  experiment: ExperimentManifest;
};

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const accentStyles = {
    "--card-from": experiment.cardAccent.from,
    "--card-via": experiment.cardAccent.via,
    "--card-to": experiment.cardAccent.to,
    "--card-glow": experiment.cardAccent.glow,
  } as CSSProperties;

  return (
    <Link href={experiment.href} className="group block h-full">
      <article
        style={accentStyles}
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface-0)] transition-colors duration-150 group-hover:border-[var(--border-hover)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(135deg,var(--card-from),var(--card-via)_48%,var(--card-to))]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-[10%] top-[18%] h-24 bg-[radial-gradient(circle,var(--card-glow),transparent_70%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0)_0%,rgba(5,4,3,0.12)_30%,rgba(5,4,3,0.92)_62%,rgba(5,4,3,0.98)_100%)]"
        />

        <div className="relative flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="hud-readout">{experiment.status}</span>
            <span className="hud-readout text-[var(--gold)]">{experiment.slug}</span>
          </div>

          <div className="mt-14 max-w-[17rem]">
            <p className="hud-readout text-[var(--dawn-50)]">{experiment.strap}</p>
            <h2
              style={{ fontFamily: "var(--font-display), serif" }}
              className="mt-3 text-[clamp(28px,2rem+1vw,42px)] uppercase leading-[0.95] tracking-[0.04em] text-[var(--dawn)]"
            >
              {experiment.title}
            </h2>
          </div>

          <p className="mt-auto max-w-[38ch] text-sm leading-6 text-[var(--text)]">
            {experiment.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {experiment.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--border)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div className="hud-readout">
              {experiment.tech.slice(0, 3).join(" · ")}
            </div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-[var(--gold)]">
              <span>Open Route</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

import type { PropsWithChildren } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ExperimentsLayout({
  children,
}: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="shards-shell space-y-5">
        <header className="surface-panel flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="space-y-1">
            <p className="hud-readout">Experiments / Internal Routes</p>
            <p className="text-sm text-[var(--text)]">
              Shared shell, local branding per shard.
            </p>
          </div>
          <Link
            href="/"
            className="gold-link inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hub
          </Link>
        </header>

        {children}
      </div>
    </div>
  );
}

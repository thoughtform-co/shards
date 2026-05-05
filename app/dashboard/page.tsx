import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { ExperimentCard } from "@/components/hub/ExperimentCard";
import { HubFrame } from "@/components/hub/HubFrame";
import { experimentRegistry } from "@/experiments/registry";

/*
 * Shards experiment dashboard.
 *
 * Moved from `app/page.tsx` so that the front door (`/`) can carry a
 * simple gate-styled landing while the hub of curated micro-experiments
 * keeps its dedicated URL.
 */
export default function DashboardPage() {
  const featuredExperiments = experimentRegistry.filter(
    (experiment) => experiment.status !== "planned",
  );

  return (
    <main className="min-h-screen pb-8">
      <HubFrame
        masthead={
          <div className="space-y-5">
            <p className="sigil-section-label flex items-center gap-2">
              <Compass className="h-3.5 w-3.5" />
              <span className="text-[var(--dawn-50)]">00</span> / Curated
              Micro-Experiments
            </p>
            <div className="max-w-3xl space-y-4">
              <h1
                style={{ fontFamily: "var(--font-display), serif" }}
                className="text-[clamp(44px,5vw,92px)] uppercase leading-[0.88] tracking-[0.06em] text-[var(--dawn)]"
              >
                Shards
              </h1>
              <p className="max-w-[54ch] text-base leading-7 text-[var(--text)] sm:text-lg">
                A dashboard for small Thoughtform-adjacent experiments:
                single-purpose tools, visual probes, and playful prototypes that
                can break brand locally while still docking into one shared
                instrument panel.
              </p>
            </div>
          </div>
        }
        aside={
          <div className="surface-panel p-5">
            <div className="space-y-4">
              <p className="sigil-section-label">
                <span className="text-[var(--dawn-50)]">01</span> / System
                Notes
              </p>
              <div className="hud-divider" />
              <ul className="space-y-3 text-sm leading-6 text-[var(--text)]">
                <li>
                  Hub shell follows Thoughtform tokens, typography, and
                  navigation grammar.
                </li>
                <li>
                  Each experiment owns its own route-local visual language and
                  components.
                </li>
                <li>
                  Public experiment APIs are isolated under experiment-specific
                  namespaces.
                </li>
              </ul>
            </div>
          </div>
        }
      >
        <section className="space-y-6">
          <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="sigil-section-label">
                <span className="text-[var(--dawn-50)]">02</span> / Live
                Signals
              </p>
              <h2 className="text-2xl tracking-[0.04em] text-[var(--dawn)]">
                Featured experiments inside the hub
              </h2>
            </div>
            <p className="sigil-section-label flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              {featuredExperiments.length} route ready
            </p>
          </div>

          <div className="shards-grid shards-grid--hub">
            <div className="grid gap-[var(--space-lg)] md:grid-cols-2">
              {featuredExperiments.map((experiment) => (
                <ExperimentCard key={experiment.slug} experiment={experiment} />
              ))}
            </div>

            <aside className="surface-panel p-5">
              <div className="space-y-4">
                <p className="sigil-section-label">
                  <span className="text-[var(--dawn-50)]">03</span> / Current
                  Route
                </p>
                <div className="hud-divider" />
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-[var(--text)]">
                    Two jukebox surfaces: V1 is the flat two-panel layout;
                    V2 is the full Three.js 3D cabinet with particle effects,
                    Claude-powered vibe analysis, and Spotify preview playback.
                  </p>
                  <div className="grid gap-3 text-sm text-[var(--text)]">
                    <div className="flex items-center justify-between border border-[var(--border)] px-3 py-3">
                      <span className="hud-readout">V1 route</span>
                      <span>/experiments/image-to-spotify</span>
                    </div>
                    <div className="flex items-center justify-between border border-[var(--border)] px-3 py-3">
                      <span className="hud-readout">V2 route</span>
                      <span>/experiments/image-to-spotify-v2</span>
                    </div>
                    <div className="flex items-center justify-between border border-[var(--border)] px-3 py-3">
                      <span className="hud-readout">brand split</span>
                      <span>hub / local override</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/experiments/image-to-spotify"
                      className="gold-link inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em]"
                    >
                      V1 flat jukebox
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/experiments/image-to-spotify-v2"
                      className="gold-link inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em]"
                    >
                      V2 3D jukebox
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </HubFrame>
    </main>
  );
}

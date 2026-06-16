import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { LoamReveal } from "@/components/loam/reveal";
import {
  loamHero,
  loamLayerSection,
  loamMeta,
  loamTestimonial,
} from "@/content/loam";

import "../loam.css";
import "./living.css";

/*
 * /loam/living — Direction: cinematic organic.
 *
 * Full-bleed generated soil/root photography, wide-tracked minimal sans,
 * one quiet statement per scene. Scene 1 is the sprout hero; scene 2 is
 * the underground mycelium network carrying the "encoded layer" idea; a
 * bone interstitial holds the testimonial. No HUD, no orbital motifs.
 */

const sans = Manrope({
  variable: "--font-living-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loam / Living",
  robots: { index: false, follow: false },
};

const layerCaptions = [
  loamLayerSection.columns.sources,
  loamLayerSection.columns.substrate,
  loamLayerSection.columns.surfaces,
] as const;

export default function LoamLivingPage() {
  return (
    <div className={`${sans.variable} loam-stage loam-living`}>
      <LoamReveal />

      <header className="living-header" aria-label="Loam navigation">
        <Link className="living-brand" href="/loam">
          Loam
        </Link>
        <nav className="living-nav" aria-label="Sections">
          {loamMeta.links.slice(0, 4).map((link) => (
            <a key={link.id} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="living-cta" href={loamMeta.cta.href}>
          {loamMeta.cta.label}
        </a>
      </header>

      <main>
        {/* Scene 1 — sprout hero */}
        <section className="living-scene" id="top">
          <Image
            className="living-scene__img"
            src="/loam/living-hero.png"
            alt="A single green sprout emerging from rich dark soil threaded with pale mycelium"
            fill
            priority
            sizes="100vw"
          />
          <div className="living-scene__scrim" aria-hidden="true" />
          <div className="living-scene__content" data-loam-stack>
            <span className="living-eyebrow reveal">{loamHero.eyebrow}</span>
            <h1 className="living-statement reveal">
              The intelligence layer <em>your work grows from.</em>
            </h1>
            <p className="living-hero__sub reveal">{loamHero.lede[0]}</p>
            <div className="living-hero__actions reveal">
              <a className="living-btn living-btn--primary" href={loamMeta.cta.href}>
                {loamHero.actions[0].label}
              </a>
              <a className="living-btn living-btn--ghost" href="#layer">
                {loamHero.actions[1].label}
              </a>
            </div>
          </div>
          <span className="living-scrollcue" aria-hidden="true">
            Scroll
          </span>
        </section>

        {/* Scene 2 — underground network / the layer */}
        <section className="living-scene living-scene--network" id="layer">
          <Image
            className="living-scene__img"
            src="/loam/living-network.png"
            alt="An underground network of roots and mycelium with glowing amber junctions"
            fill
            sizes="100vw"
          />
          <div className="living-scene__scrim" aria-hidden="true" />
          <div className="living-scene__content" data-loam-stack>
            <span className="living-eyebrow reveal">{loamLayerSection.eyebrow}</span>
            <h2 className="living-statement reveal">
              How your team decides, <em>encoded underground.</em>
            </h2>
            <div className="living-caption-grid" data-loam-stack>
              {layerCaptions.map((col) => (
                <div key={col.n} className="living-caption reveal">
                  <div className="living-caption__k">{col.kicker}</div>
                  <p className="living-caption__v">{col.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interstitial — testimonial on bone */}
        <section className="living-interstitial">
          <div className="living-interstitial__inner" data-loam-stack>
            <p className="living-interstitial__text reveal">
              &ldquo;{loamTestimonial.quote}&rdquo;
            </p>
            <div className="living-interstitial__cite reveal">
              <strong>{loamTestimonial.name}</strong>
              <span>{loamTestimonial.role}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="living-foot">
        <span>Loam / Living direction / v0.2</span>
        <Link href="/loam">Back to directions</Link>
      </footer>
    </div>
  );
}

import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import Link from "next/link";

import { LoamReveal } from "@/components/loam/reveal";
import {
  loamHero,
  loamMeta,
  loamOfferSection,
  loamSpectrumBands,
} from "@/content/loam";

import "../loam.css";
import "./yield.css";

/*
 * /loam/yield — Direction: saturated color block.
 *
 * A deep-green hero with oversized friendly display type and playful
 * rounded shapes; a cream "how to engage" block with three rounded
 * format cards (the middle one inverted to green); a green stat band.
 * Jeton-style brand confidence. No serif, no HUD.
 */

const display = Bricolage_Grotesque({
  variable: "--font-yield-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--font-yield-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loam / Yield",
  robots: { index: false, follow: false },
};

/* One representative stat per spectrum band, for the green band. */
const bandStats = loamSpectrumBands.map((b) => b.stats[0]);

export default function LoamYieldPage() {
  return (
    <div className={`${display.variable} ${sans.variable} loam-stage loam-yield`}>
      <LoamReveal />

      <header className="yield-header" aria-label="Loam navigation">
        <Link className="yield-brand" href="/loam">
          Loam
        </Link>
        <nav className="yield-nav" aria-label="Sections">
          {loamMeta.links.slice(0, 5).map((link) => (
            <a key={link.id} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="yield-cta" href={loamMeta.cta.href}>
          {loamMeta.cta.label}
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="yield-hero" id="top">
          <span className="yield-hero__blob yield-hero__blob--lime" aria-hidden="true" />
          <span className="yield-hero__blob yield-hero__blob--clay" aria-hidden="true" />
          <div className="yield-hero__inner" data-loam-stack>
            <p className="yield-hero__eyebrow reveal">{loamHero.eyebrow}</p>
            <h1 className="yield-hero__title reveal">
              We grow the <span>layer</span> your work runs on.
            </h1>
            <div className="yield-hero__row reveal">
              <p className="yield-hero__standfirst">{loamHero.lede[0]}</p>
              <div className="yield-hero__actions">
                <a className="yield-btn yield-btn--primary" href={loamMeta.cta.href}>
                  {loamHero.actions[0].label}
                </a>
                <a className="yield-btn yield-btn--ghost" href="#engage">
                  {loamHero.actions[1].label}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Engage — three format cards */}
        <section className="yield-steps" id="engage">
          <div className="yield-steps__inner">
            <div className="yield-steps__head reveal">
              <h2 className="yield-steps__title">
                Three formats. <span>One motion.</span>
              </h2>
              <p className="yield-steps__sub">{loamOfferSection.sub}</p>
            </div>

            <div className="yield-cards" data-loam-stack>
              {loamOfferSection.cards.map((card) => (
                <article key={card.n} className="yield-card reveal">
                  <span className="yield-card__num">{card.n}</span>
                  <h3 className="yield-card__title">{card.title}</h3>
                  <p className="yield-card__body">{card.body}</p>
                  <ul className="yield-card__bullets" role="list">
                    {card.bullets.slice(0, 3).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="yield-card__meta">{card.meta}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stat band */}
        <section className="yield-stats">
          <div className="yield-stats__inner" data-loam-stack>
            {bandStats.map((stat) => (
              <div key={stat.label} className="yield-stat reveal">
                <div className="yield-stat__value">{stat.value}</div>
                <p className="yield-stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="yield-foot">
        <div className="yield-foot__inner">
          <span>Loam / Yield direction / v0.2</span>
          <Link href="/loam">Back to directions</Link>
        </div>
      </footer>
    </div>
  );
}

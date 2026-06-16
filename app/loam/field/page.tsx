import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import Link from "next/link";

import { PrincipleIndex } from "@/components/loam/field/principle-index";
import { LoamReveal } from "@/components/loam/reveal";
import {
  loamHero,
  loamMeta,
  loamMethodSection,
  loamTestimonial,
} from "@/content/loam";

import "../loam.css";
import "./field.css";

/*
 * /loam/field — Direction: editorial humanist.
 *
 * Type-led hero on a warm ivory field with soft dappled light, a deep
 * pine accent, and an interactive principles index (the method) in the
 * Microsoft AI "Our Values" pattern. Serif throughout. No HUD.
 */

const serif = Fraunces({
  variable: "--font-field-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--font-field-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loam / Field",
  robots: { index: false, follow: false },
};

const principles = loamMethodSection.steps.map((step) => ({
  id: step.id,
  label: step.label,
  title: step.title,
  body: step.body,
}));

export default function LoamFieldPage() {
  return (
    <div className={`${serif.variable} ${sans.variable} loam-stage loam-field`}>
      <LoamReveal />

      <header className="field-header" aria-label="Loam navigation">
        <div className="field-header__inner">
          <Link className="field-brand" href="/loam">
            Loam
          </Link>
          <nav className="field-nav" aria-label="Sections">
            {loamMeta.links.slice(0, 5).map((link) => (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="field-cta" href={loamMeta.cta.href}>
            {loamMeta.cta.label}
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="field-hero" id="top">
          <div className="field-hero__inner" data-loam-stack>
            <span className="field-hero__kicker reveal">{loamHero.eyebrow}</span>
            <h1 className="field-hero__title reveal">
              The intelligence layer <em>your work grows from.</em>
            </h1>
            <p className="field-hero__standfirst reveal">{loamHero.lede[0]}</p>
            <div className="field-hero__actions reveal">
              <a className="field-btn field-btn--primary" href={loamMeta.cta.href}>
                {loamHero.actions[0].label}
              </a>
              <a className="field-btn field-btn--text" href="#method">
                {loamHero.actions[1].label}
              </a>
            </div>
          </div>
        </section>

        {/* Principles index (the method) */}
        <section className="field-principles" id="method">
          <div className="field-principles__head reveal">
            <span className="field-principles__overline">
              {loamMethodSection.eyebrow}
            </span>
            <h2 className="field-principles__title">
              We work in one motion. Navigate, encode, build.
            </h2>
          </div>
          <div className="reveal">
            <PrincipleIndex items={principles} />
          </div>
        </section>

        {/* Pull quote */}
        <section className="field-quote">
          <blockquote className="field-quote__text reveal">
            &ldquo;{loamTestimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="field-quote__cite reveal">
            <strong>{loamTestimonial.name}</strong>
            <span>{loamTestimonial.role}</span>
          </figcaption>
        </section>
      </main>

      <footer className="field-foot">
        <span>Loam / Field direction / v0.2</span>
        <Link href="/loam">Back to directions</Link>
      </footer>
    </div>
  );
}

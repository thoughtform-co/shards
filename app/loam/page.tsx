import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import "./loam.css";

/*
 * /loam — comparator index (v2).
 *
 * Three NEW directions, deliberately distinct from each other and from
 * the Shards/Thoughtform house style:
 *
 *   field   editorial humanist serif (ivory + pine)
 *   yield   saturated color-block brand (olive + cream)
 *   living  cinematic organic photography (generated soil/root imagery)
 *
 * The page itself is a quiet neutral selector; the tiles carry each
 * direction's look. Living shows its real hero photograph.
 */

const serif = Fraunces({
  variable: "--font-index-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--font-index-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loam / directions",
  robots: { index: false, follow: false },
};

const cards = [
  {
    href: "/loam/weave",
    name: "Weave",
    kind: "Node-canvas product board",
    desc: "A Figma-Weave-style board: a split bold headline over a node graph that weaves brief and brand voice through the encoded Loam layer into every surface. Chartreuse accent.",
    preview: { type: "css" as const, cls: "loam-card__preview--weave" },
  },
  {
    href: "/loam/field",
    name: "Field",
    kind: "Editorial humanist",
    desc: "Ivory and pine, large serif, soft dappled light. A research-lab manifesto with an interactive principles index. Calm, literary, premium.",
    preview: { type: "css" as const, cls: "loam-card__preview--field" },
  },
  {
    href: "/loam/yield",
    name: "Yield",
    kind: "Saturated color block",
    desc: "A confident olive-green field, oversized friendly sans, rounded cards and a big numbered stepper. Brand-forward and modern.",
    preview: { type: "css" as const, cls: "loam-card__preview--yield" },
  },
  {
    href: "/loam/living",
    name: "Living",
    kind: "Cinematic organic",
    desc: "Full-bleed soil and root photography, wide-tracked minimal type, one statement per scene. Atmospheric and image-led.",
    preview: { type: "img" as const, src: "/loam/living-hero.png", alt: "Soil with a sprout and mycelium" },
  },
] as const;

export default function LoamIndexPage() {
  return (
    <div className={`${serif.variable} ${sans.variable} loam-index`}>
      <div className="loam-index__top">
        <span className="loam-index__wordmark">Loam</span>
        <span className="loam-index__meta">Direction studies / internal</span>
      </div>

      <h1 className="loam-index__lede">
        Three ways to <em>grow</em> it.
      </h1>
      <p className="loam-index__note">
        Each tile opens a live above-the-fold prototype plus one content
        section. The three directions diverge hard on color, type and
        information architecture. None of them use the keynote house style.
        Pick one and the full single-page site builds on it.
      </p>

      <div className="loam-index__grid">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="loam-card">
            <div className="loam-card__preview">
              {card.preview.type === "img" ? (
                <Image
                  src={card.preview.src}
                  alt={card.preview.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className={`loam-card__preview ${card.preview.cls}`} style={{ position: "absolute", inset: 0 }} />
              )}
            </div>
            <div className="loam-card__body">
              <span className="loam-card__kind">{card.kind}</span>
              <span className="loam-card__name">{card.name}</span>
              <p className="loam-card__desc">{card.desc}</p>
              <span className="loam-card__open">Open {card.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="loam-index__foot">
        <span>Loam / forward-deployed AI for creative work</span>
        <span>Vince Buyssens and Rob Weston</span>
      </div>
    </div>
  );
}

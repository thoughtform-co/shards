import Image from "next/image";

/*
 * Creative AI Keynote · proof and interstitial sections.
 *
 * Lives between AboutVince and AgentContext on /ai-keynote. The
 * keynote needs two proof beats up front — Loop's world-first AI
 * ATL film and Loop Studio's "95% of briefings done with AI"
 * receipts — followed by two short interstitials that bridge the
 * room from "look at the work" into "everyone wants an agent, yet
 * most fail." We translate the underlying PowerPoint into native
 * keynote sections (full-viewport, two-column heads, cream cards,
 * gold em accents) instead of pasting slides.
 *
 * All four are server components.
 */

/* ─── World-First AI ATL Video ────────────────────────────────── */

export function WorldFirstAiAtlProof() {
  return (
    <section
      className="aiop-section cw-keynote-proof cw-keynote-proof--atl"
      id="world-first-ai-atl"
      aria-labelledby="cw-keynote-atl-title"
      aria-label="Loop's world-first AI above-the-line video"
    >
      <div className="aiop-wrap cw-keynote-proof__inner">
        <header className="cw-keynote-proof__head aiop-reveal">
          <span className="cw-keynote-proof__eyebrow">
            Loop Earplugs &middot; September 2025
          </span>
          <div className="cw-keynote-proof__head-cols">
            <h2 className="cw-keynote-proof__title" id="cw-keynote-atl-title">
              World-first <em>AI ATL</em> video.
            </h2>
            <p className="cw-keynote-proof__body">
              Loop was the first brand to make a full AI above-the-line
              video. Concept, casting, shot list, comp, edit &mdash; the
              whole pipeline shaped through AI, finished by the team.
            </p>
          </div>
        </header>

        <figure className="cw-keynote-proof__figure aiop-reveal">
          <div className="cw-keynote-proof__player">
            {/* The broadcast cut has burned-in graphics; the
                figcaption below names the campaign for screen-reader
                users. */}
            <video
              className="cw-keynote-proof__video"
              controls
              preload="metadata"
              playsInline
              aria-label="Smug Owl — Loop AI ATL film"
            >
              <source
                src="/videos/loop-smug-owl-ai-atl.mp4"
                type="video/mp4"
              />
              Your browser does not support embedded video. Download
              the file:{" "}
              <a href="/videos/loop-smug-owl-ai-atl.mp4" download>
                loop-smug-owl-ai-atl.mp4
              </a>
              .
            </video>
          </div>
          <figcaption className="cw-keynote-proof__caption">
            <span className="cw-keynote-proof__caption-label">
              Smug Owl &middot; Loop ATL
            </span>
            <span className="cw-keynote-proof__caption-sep" aria-hidden="true">
              /
            </span>
            <span className="cw-keynote-proof__caption-meta">
              16:9 master &middot; 30 sec
            </span>
            <span className="cw-keynote-proof__caption-source">
              Source: Loop Earplugs creative archive
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ─── 95% of briefings done with AI ──────────────────────────── */

type StudioAd = {
  id: string;
  src: string;
  alt: string;
  sku: string;
  spend: string;
  orderValue: string;
  roas: string;
};

const studioAds: readonly StudioAd[] = [
  {
    id: "exp-sb93-filter",
    src: "/keynote/studio-ads/exp-sb93-filter.jpg",
    alt: "Loop Switch ad: It's parenting, but just the good bits — earplug case with hear/filter checklist.",
    sku: "EXP-SB93TOF · Filter · Engage · Mix",
    spend: "\u20AC 5.553,67",
    orderValue: "\u20AC 15.226,25",
    roas: "2,7",
  },
  {
    id: "exp-lm103-highlight",
    src: "/keynote/studio-ads/exp-lm103-highlight.jpg",
    alt: "Loop fashion ad: monochrome portrait of a man with a Loop earplug highlighted by a square reticle.",
    sku: "EXP-LM103 · Highlight · Mix · Fashion",
    spend: "\u20AC 1.328,79",
    orderValue: "\u20AC 7.082,45",
    roas: "5,33",
  },
  {
    id: "exp-sb92-ski",
    src: "/keynote/studio-ads/exp-sb92-ski.jpg",
    alt: "Loop Engage ad: stress-free ski trips — skier in helmet and goggles, three callout chips around the ear.",
    sku: "EXP-SB92BOF · Ski · Engage · Mix",
    spend: "\u20AC 1.200,60",
    orderValue: "\u20AC 7.371,58",
    roas: "6,14",
  },
];

export function AiStudioBriefingsProof() {
  return (
    <section
      className="aiop-section cw-keynote-proof cw-keynote-proof--studio"
      id="ai-studio-briefings"
      aria-labelledby="cw-keynote-studio-title"
      aria-label="Loop Studio — 95% of briefings done with AI"
    >
      <div className="aiop-wrap cw-keynote-proof__inner">
        <header className="cw-keynote-proof__head aiop-reveal">
          <span className="cw-keynote-proof__eyebrow">
            Loop Studio &middot; AI in production
          </span>
          <div className="cw-keynote-proof__head-cols">
            <h2
              className="cw-keynote-proof__title cw-keynote-proof__title--metric"
              id="cw-keynote-studio-title"
            >
              <span className="cw-keynote-proof__metric">95%</span>
              <span className="cw-keynote-proof__metric-line">
                of briefings done <em>with AI.</em>
              </span>
            </h2>
            <p className="cw-keynote-proof__body cw-keynote-proof__body--studio">
              Loop has spearheaded AI adoption in Studio, using AI
              everywhere we can where it makes sense &mdash; concepting,
              copy, post, performance. Three recent cuts, all paid out.
            </p>
          </div>
        </header>

        <ul className="cw-keynote-proof__grid aiop-reveal">
          {studioAds.map((ad) => (
            <li className="cw-keynote-proof__card" key={ad.id}>
              <div className="cw-keynote-proof__card-frame">
                <Image
                  className="cw-keynote-proof__card-img"
                  src={ad.src}
                  alt={ad.alt}
                  fill
                  sizes="(min-width: 980px) 320px, (min-width: 640px) 45vw, 90vw"
                />
              </div>
              <dl className="cw-keynote-proof__card-stats">
                <div className="cw-keynote-proof__card-row">
                  <dt>SKU</dt>
                  <dd>{ad.sku}</dd>
                </div>
                <div className="cw-keynote-proof__card-row">
                  <dt>Spend</dt>
                  <dd>{ad.spend}</dd>
                </div>
                <div className="cw-keynote-proof__card-row">
                  <dt>Order value</dt>
                  <dd>{ad.orderValue}</dd>
                </div>
                <div className="cw-keynote-proof__card-row cw-keynote-proof__card-row--accent">
                  <dt>ROAS</dt>
                  <dd>{ad.roas}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        <p className="cw-keynote-proof__footnote">
          AI-generated visuals, Claude-assisted copy, Studio design.
          ROAS measured against the Loop performance benchmark.
        </p>
      </div>
    </section>
  );
}

/* ─── Interstitials ───────────────────────────────────────────── */

type KeynoteInterstitialProps = {
  id: string;
  ariaLabel: string;
  eyebrow?: string;
  question: string;
  questionEm?: string;
  questionTrailing?: string;
  variant?: "question" | "callout";
};

function KeynoteInterstitial({
  id,
  ariaLabel,
  eyebrow,
  question,
  questionEm,
  questionTrailing,
  variant = "question",
}: KeynoteInterstitialProps) {
  const titleId = `${id}-title`;
  const hasLeading = question.trim().length > 0;
  return (
    <section
      className={`aiop-section aiop-engine-pattern cw-keynote-interstitial cw-keynote-interstitial--${variant} aiop-engine-question`}
      id={id}
      aria-labelledby={titleId}
      aria-label={ariaLabel}
    >
      <div className="aiop-engine-pattern__bleed" aria-hidden="true">
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--a" />
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--b" />
        <span className="aiop-engine-pattern__grid" />
      </div>

      <div className="aiop-wrap cw-keynote-interstitial__inner aiop-reveal">
        {eyebrow ? (
          <span className="cw-keynote-interstitial__eyebrow">{eyebrow}</span>
        ) : null}
        <p
          id={titleId}
          className="aiop-engine-question__q cw-keynote-interstitial__q"
        >
          {hasLeading ? question : null}
          {questionEm ? (
            <>
              {hasLeading ? " " : null}
              <em>{questionEm}</em>
            </>
          ) : null}
          {questionTrailing ?? ""}
        </p>
      </div>
    </section>
  );
}

export function WhereFromHereInterstitial() {
  return (
    <KeynoteInterstitial
      id="where-from-there"
      ariaLabel="Where do you go from there?"
      eyebrow={"So \u2014 the next move."}
      question="Where do you go"
      questionEm="from there?"
    />
  );
}

export function AgentsInterstitial() {
  return (
    <KeynoteInterstitial
      id="agents"
      ariaLabel="Agents."
      variant="callout"
      eyebrow="The answer everyone reaches for"
      question=""
      questionEm="Agents."
    />
  );
}

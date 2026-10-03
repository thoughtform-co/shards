import { BridgeDiagram } from "@/components/folio/bridge-diagram";
import { InvoiceSheet } from "@/components/folio/invoice-sheet";
import { MockAccountant } from "@/components/folio/mock-accountant";
import { MockActivity } from "@/components/folio/mock-activity";
import { MockAgent } from "@/components/folio/mock-agent";
import { MockConsent } from "@/components/folio/mock-consent";
import { MockInbox } from "@/components/folio/mock-inbox";
import { vars, Wordmark } from "@/components/folio/primitives";
import { dayMonth, heroDocument, money, month, persona } from "@/content/folio";
import {
  accountant,
  agent,
  bridge,
  fill,
  footer,
  grant,
  hero,
  how,
  limits,
  nav,
  sourceNumber,
  sources,
  stripe,
  theMonth,
  type SourceId,
} from "@/content/folio-copy";

function Src({ ids }: { ids: SourceId[] }) {
  if (ids.length === 0) return null;
  return (
    <sup className="fo-src">
      {ids.map((id, i) => {
        const n = sourceNumber(id);
        return (
          <span key={id}>
            {i > 0 && ","}
            <a href={`#src-${n}`} aria-label={`Source ${n}`}>
              {n}
            </a>
          </span>
        );
      })}
    </sup>
  );
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <span className="fo-label">
      <b>{n}</b>
      {children}
    </span>
  );
}

export default function FolioPage() {
  return (
    <>
      <header className="fo-nav">
        <div className="fo-nav__inner">
          <a href="#top" aria-label="Folio, back to top">
            <Wordmark size={24} />
          </a>
          <span className="fo-badge">Concept</span>
          <nav className="fo-nav__links" aria-label="Sections">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <a className="fo-btn fo-btn--ink fo-nav__cta" href="#stripe">
            {nav.cta}
          </a>
        </div>
      </header>

      <main id="top">
        {/* 01 Hero */}
        <section className="fo-hero" aria-labelledby="fo-hero-title">
          <div className="fo-hero__inner">
            <div className="fo-hero__title">
              <p className="fo-eyebrow fo-rise" style={vars({ "--i": 0 })}>
                {hero.eyebrow}
              </p>
              <h1 id="fo-hero-title" className="fo-h1 fo-rise" style={vars({ "--i": 1 })}>
                {hero.titleLines.map((line) => (
                  <span className="fo-h1__line" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div className="fo-hero__copy">
              <p className="fo-lede fo-rise" style={vars({ "--i": 2 })}>
                {hero.lede}
              </p>
              <div className="fo-hero__actions fo-rise" style={vars({ "--i": 3 })}>
                <a className="fo-btn fo-btn--ink" href="#how">
                  {hero.primary} <span className="fo-arrow" aria-hidden="true">→</span>
                </a>
                <a className="fo-btn fo-btn--line" href="#stripe">
                  {hero.secondary}
                </a>
              </div>
              <p className="fo-hero__note fo-rise" style={vars({ "--i": 4 })}>
                <span>
                  {persona.company}, {persona.period}: <strong>{month.charges}</strong> charges at{" "}
                  <strong>{month.vendors}</strong> vendors, collected after <strong>one</strong> approval
                  instead of {month.vendors} logins.
                </span>
                <span>{hero.illustrative}</span>
              </p>
            </div>

            <div className="fo-desk" aria-label="Folio inbox for one month, with one vendor invoice">
              <InvoiceSheet />
              <span className="fo-desk__tag">
                Matched to {dayMonth(heroDocument.date)} · {money(heroDocument.cents, heroDocument.currency)}
              </span>
              <MockInbox />
            </div>
          </div>
        </section>

        {/* 02 The month */}
        <section className="fo-section" id="month" aria-labelledby="fo-month-title">
          <div className="fo-wrap">
            <div className="fo-split">
              <div>
                <Label n="02">{theMonth.label}</Label>
                <h2 id="fo-month-title" className="fo-h2">
                  {theMonth.title}
                </h2>
                <div className="fo-prose">
                  {theMonth.body.map((p) => (
                    <p key={p}>{fill(p)}</p>
                  ))}
                </div>
              </div>
              <MockActivity state="before" rows={9} />
            </div>

            <div className="fo-facts">
              {theMonth.facts.map((f) => (
                <p className="fo-fact" key={f.text}>
                  {f.text}
                  <span className="fo-fact__src">
                    {f.sources.map((id, i) => {
                      const s = sources.find((x) => x.id === id)!;
                      return (
                        <span key={id}>
                          {i > 0 && " · "}
                          <a href={s.url} target="_blank" rel="noreferrer">
                            {s.title}
                          </a>
                        </span>
                      );
                    })}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 03 How it works */}
        <section className="fo-section fo-section--sheet" id="how" aria-labelledby="fo-how-title">
          <div className="fo-wrap">
            <div className="fo-split fo-split--flip">
              <div>
                <Label n="03">{how.label}</Label>
                <h2 id="fo-how-title" className="fo-h2">
                  {how.title}
                </h2>
                <div className="fo-prose">
                  <p>{how.body}</p>
                </div>
                <div className="fo-steps">
                  {how.steps.map((s) => (
                    <div className="fo-step" key={s.n}>
                      <span className="fo-step__n">{s.n}</span>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fo-stage">
                <MockConsent />
              </div>
            </div>
          </div>
        </section>

        {/* 04 The record */}
        <section className="fo-section" id="record" aria-labelledby="fo-record-title">
          <div className="fo-wrap">
            <div className="fo-head-row">
              <div>
                <Label n="04">{bridge.label}</Label>
                <h2 id="fo-record-title" className="fo-h2">
                  {bridge.title}
                </h2>
              </div>
              <div className="fo-prose">
                <p>{bridge.body}</p>
              </div>
            </div>
            <div className="fo-bridge-wrap">
              <BridgeDiagram />
            </div>
          </div>
        </section>

        {/* 05 For your agent */}
        <section className="fo-section fo-section--sheet" id="agent" aria-labelledby="fo-agent-title">
          <div className="fo-wrap">
            <div className="fo-split">
              <div>
                <Label n="05">{agent.label}</Label>
                <h2 id="fo-agent-title" className="fo-h2">
                  {agent.title}
                </h2>
                <div className="fo-prose">
                  <p>
                    {agent.body}
                    <Src ids={agent.sources} />
                  </p>
                </div>
                <ul className="fo-tools">
                  {agent.tools.map((t) => (
                    <li key={t.name}>
                      <code>
                        {t.name}
                        <span className="fo-tools__args">({t.args})</span>
                      </code>
                      <span>{t.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="fo-stage">
                <MockAgent />
              </div>
            </div>
          </div>
        </section>

        {/* 06 For your accountant */}
        <section className="fo-section" id="accountant" aria-labelledby="fo-accountant-title">
          <div className="fo-wrap">
            <div className="fo-split fo-split--flip">
              <div>
                <Label n="06">{accountant.label}</Label>
                <h2 id="fo-accountant-title" className="fo-h2">
                  {accountant.title}
                </h2>
                <div className="fo-prose">
                  {accountant.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
              <div>
                <MockAccountant maxRows={6} />
                <p className="fo-note">{accountant.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 07 The grant */}
        <section className="fo-section fo-section--sheet" id="grant" aria-labelledby="fo-grant-title">
          <div className="fo-wrap">
            <Label n="07">{grant.label}</Label>
            <h2 id="fo-grant-title" className="fo-h2">
              {grant.title}
            </h2>
            <div className="fo-grant">
              <div className="fo-grant__col">
                <h3>It can</h3>
                <ul>
                  {grant.can.map((t) => (
                    <li key={t}>
                      <span className="fo-grant__mark" aria-hidden="true">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="fo-grant__col">
                <h3>It cannot</h3>
                <ul>
                  {grant.cannot.map((t) => (
                    <li key={t}>
                      <span className="fo-grant__mark" aria-hidden="true">×</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="fo-built">
              {grant.built}
              <Src ids={grant.builtSources} />
            </p>
          </div>
        </section>

        {/* 08 The limits */}
        <section className="fo-section" id="limits" aria-labelledby="fo-limits-title">
          <div className="fo-wrap">
            <Label n="08">{limits.label}</Label>
            <h2 id="fo-limits-title" className="fo-h2">
              {limits.title}
            </h2>
            <div className="fo-limits">
              {limits.items.map((l) => (
                <div className="fo-limit" key={l.title}>
                  <h3>{l.title}</h3>
                  <p>
                    {l.text}
                    <Src ids={l.sources} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 09 For Stripe */}
        <section className="fo-section fo-section--ink" id="stripe" aria-labelledby="fo-stripe-title">
          <div className="fo-wrap">
            <div className="fo-split">
              <div>
                <Label n="09">{stripe.label}</Label>
                <h2 id="fo-stripe-title" className="fo-h2">
                  {stripe.title}
                </h2>
                <div className="fo-prose">
                  {stripe.body.map((p, i) => (
                    <p key={p}>
                      {p}
                      {i === 0 && <Src ids={stripe.sources} />}
                    </p>
                  ))}
                </div>
                <p className="fo-closer">{stripe.closer}</p>
                <a className="fo-btn fo-btn--paper" href={stripe.cta.href} target="_blank" rel="noreferrer">
                  {stripe.cta.label} <span className="fo-arrow" aria-hidden="true">→</span>
                </a>
              </div>
              <MockActivity split rows={4} />
            </div>
          </div>
        </section>
      </main>

      <footer className="fo-footer" id="sources">
        <div className="fo-wrap fo-footer__grid">
          <div className="fo-footer__about">
            <Wordmark size={20} />
            <p>{footer.disclaimer}</p>
            <p>{footer.trademarks}</p>
          </div>
          <div>
            <h2>{footer.sourcesTitle}</h2>
            <ol className="fo-sources">
              {sources.map((s, i) => (
                <li key={s.id} id={`src-${i + 1}`}>
                  <span>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title}
                    </a>
                    <small>{s.publisher}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </footer>
    </>
  );
}

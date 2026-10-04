import { CodeSample } from "@/components/folio/code-sample";
import { InvoiceSheet } from "@/components/folio/invoice-sheet";
import { MockAccountant } from "@/components/folio/mock-accountant";
import { MockActivity } from "@/components/folio/mock-activity";
import { MockAgent } from "@/components/folio/mock-agent";
import { MockConsent } from "@/components/folio/mock-consent";
import { MockInbox } from "@/components/folio/mock-inbox";
import { PayCard } from "@/components/folio/pay-card";
import { PermissionTable } from "@/components/folio/permission-table";
import { Arrow, FolioMark, vars, Wordmark } from "@/components/folio/primitives";
import { Ribbon } from "@/components/folio/ribbon";
import { NotificationStack } from "@/components/folio/notification-stack";
import { WorkflowCards } from "@/components/folio/workflow-cards";
import {
  accountants,
  agents,
  fill,
  footer,
  grant,
  hero,
  how,
  limits,
  nav,
  permission,
  problem,
  sourceNumber,
  sources,
  stripe,
  workflows,
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

/* Stripe's two-tone heading: the claim in ink, the explanation running on
   in slate, one element. */
function Heading({
  id,
  label,
  strong,
  soft,
  ids = [],
  stacked = false,
}: {
  id: string;
  label: string;
  strong: string;
  soft: string;
  ids?: SourceId[];
  /* In a two-column section the run-on heading gets too tall, so the
     explanation drops under the claim as a lead paragraph instead. */
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <>
        <span className="fo-label">{label}</span>
        <h2 id={id} className="fo-h2">
          {fill(strong)}
        </h2>
        <p className="fo-lead">
          {fill(soft)}
          <Src ids={ids} />
        </p>
      </>
    );
  }
  return (
    <>
      <span className="fo-label">{label}</span>
      <h2 id={id} className="fo-h2">
        {fill(strong)} <span className="fo-soft">{fill(soft)}</span>
        <Src ids={ids} />
      </h2>
    </>
  );
}

function Guides() {
  return (
    <div className="fo-guides" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function FolioPage() {
  return (
    <>
      <header className="fo-nav">
        <div className="fo-nav__inner">
          <a href="#top" aria-label="Folio, back to top">
            <Wordmark size={21} />
          </a>
          <span className="fo-badge">Concept</span>
          <nav className="fo-nav__links" aria-label="Sections">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <a className="fo-btn fo-btn--primary fo-nav__cta" href="#stripe">
            {nav.cta}
            <Arrow />
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="fo-hero" aria-labelledby="fo-hero-title">
          <Guides />
          <Ribbon id="fo-rb-hero" />
          <div className="fo-wrap">
            <div className="fo-hero__text">
              <p className="fo-stat fo-rise" style={vars({ "--i": 0 })}>
                {hero.statLabel}: <span>{fill(hero.statValue)}</span>
              </p>
              <h1 id="fo-hero-title" className="fo-h1 fo-rise" style={vars({ "--i": 1 })}>
                {hero.strong} <span className="fo-soft">{hero.soft}</span>
              </h1>
              <div className="fo-hero__actions fo-rise" style={vars({ "--i": 2 })}>
                <a className="fo-btn fo-btn--primary" href="#how">
                  {hero.primary}
                  <Arrow />
                </a>
                <a className="fo-btn fo-btn--secondary" href="#stripe">
                  {hero.secondary}
                  <Arrow />
                </a>
              </div>
              <p className="fo-hero__note fo-rise" style={vars({ "--i": 3 })}>
                {hero.note}
              </p>
            </div>

            <div className="fo-shot">
              <div className="fo-shot__stage" aria-label="Folio's inbox for one month, the vendor's invoice behind it, and the agent's note">
                <InvoiceSheet />
                <MockInbox maxRows={7} />
                <div className="fo-shot__agent fo-mock">
                  <div className="fo-note-card">
                    <span className="fo-note-card__avatar" aria-hidden="true">
                      <FolioMark size={14} />
                    </span>
                    <span>
                      <strong>
                        Your agent<small>1 Oct, 09:02</small>
                      </strong>
                      <p>{fill(hero.agentLine)}</p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="fo-section fo-section--soft" id="problem" aria-labelledby="fo-problem-title">
          <Guides />
          <div className="fo-wrap">
            <Heading id="fo-problem-title" label={problem.label} strong={problem.strong} soft={problem.soft} />
            <div className="fo-contrast fo-block">
              <div className="fo-contrast__col">
                <h3>
                  <span className="fo-dot" aria-hidden="true" />
                  {problem.payTitle}
                </h3>
                <PayCard />
                <p className="fo-caption">{problem.payCaption}</p>
              </div>
              <div className="fo-contrast__col">
                <h3>
                  <span className="fo-dot" aria-hidden="true" />
                  {problem.collectTitle}
                </h3>
                <NotificationStack />
                <p className="fo-caption">{fill(problem.collectCaption)}</p>
              </div>
            </div>

            <div className="fo-facts">
              {problem.facts.map((f) => (
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

        {/* The missing permission */}
        <section className="fo-section" id="permission" aria-labelledby="fo-permission-title">
          <Guides />
          <div className="fo-wrap">
            <Heading
              id="fo-permission-title"
              label={permission.label}
              strong={permission.strong}
              soft={permission.soft}
              ids={permission.sources}
            />
            <div className="fo-block">
              <PermissionTable />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="fo-section fo-section--soft" id="how" aria-labelledby="fo-how-title">
          <Guides />
          <div className="fo-wrap">
            <div className="fo-split">
              <div>
                <Heading id="fo-how-title" label={how.label} strong={how.strong} soft={how.soft} stacked />
                <div className="fo-steps fo-steps--stack">
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

        {/* Workflows */}
        <section className="fo-section" id="workflows" aria-labelledby="fo-workflows-title">
          <Guides />
          <div className="fo-wrap">
            <Heading id="fo-workflows-title" label={workflows.label} strong={workflows.strong} soft={workflows.soft} />
            <div className="fo-block">
              <WorkflowCards />
            </div>
          </div>
        </section>

        {/* For agents */}
        <section className="fo-section fo-section--soft" id="agents" aria-labelledby="fo-agents-title">
          <Guides />
          <div className="fo-wrap">
            <Heading id="fo-agents-title" label={agents.label} strong={agents.strong} soft={agents.soft} ids={agents.sources} />
            <div className="fo-agents fo-block">
              <MockAgent />
              <CodeSample />
            </div>
            <ul className="fo-tools fo-tools--row">
              {agents.tools.map((t) => (
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
        </section>

        {/* For accountants */}
        <section className="fo-section" id="accountants" aria-labelledby="fo-accountants-title">
          <Guides />
          <div className="fo-wrap">
            <div className="fo-split fo-split--flip">
              <div>
                <Heading
                  id="fo-accountants-title"
                  label={accountants.label}
                  strong={accountants.strong}
                  soft={accountants.soft}
                  stacked
                />
              </div>
              <div>
                <MockAccountant maxRows={6} />
                <p className="fo-note">{accountants.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="fo-section fo-section--soft" id="security" aria-labelledby="fo-security-title">
          <Guides />
          <div className="fo-wrap">
            <Heading id="fo-security-title" label={grant.label} strong={grant.strong} soft={grant.soft} ids={grant.softSources} />
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
          </div>
        </section>

        {/* Limits */}
        <section className="fo-section" id="limits" aria-labelledby="fo-limits-title">
          <Guides />
          <div className="fo-wrap">
            <Heading id="fo-limits-title" label={limits.label} strong={limits.strong} soft={limits.soft} />
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

        {/* For Stripe */}
        <section className="fo-section fo-section--ink" id="stripe" aria-labelledby="fo-stripe-title">
          <Ribbon id="fo-rb-stripe" />
          <div className="fo-wrap">
            <div className="fo-split">
              <div>
                <Heading id="fo-stripe-title" label={stripe.label} strong={stripe.strong} soft={stripe.soft} ids={stripe.softSources} stacked />
                <div className="fo-prose">
                  {stripe.body.map((p, i) => (
                    <p key={p}>
                      {p}
                      {i === 0 && <Src ids={stripe.bodySources} />}
                    </p>
                  ))}
                </div>
                <p className="fo-closer">{stripe.closer}</p>
                <a className="fo-btn fo-btn--paper" href={stripe.cta.href} target="_blank" rel="noreferrer">
                  {stripe.cta.label}
                  <Arrow />
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
            <Wordmark size={19} />
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

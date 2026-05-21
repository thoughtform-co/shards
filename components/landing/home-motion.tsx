import {
  methodSection,
  methodStages,
  type MethodMock,
  type MethodMockChat,
  type MethodMockFieldNotes,
  type MethodMockSubstrateFile,
} from "@/content/aether";

/**
 * Method — the loop that builds your substrate.
 *
 * Three alternating sections (Navigate, Encode, Build). Each one pairs
 * a copy column (number, verb, headline, body, bullet list) with a
 * representative mock: field notes (Navigate), a substrate file
 * fragment (Encode), and a running chat (Build). The middle row
 * reverses to keep the rhythm asymmetric and the eye moving.
 */
export function HomeMotion() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <header className="section-head reveal">
          <p className="eyebrow">{methodSection.eyebrow}</p>
          <h2 className="section-title">{methodSection.title}</h2>
          <p className="section-intro">{methodSection.lede}</p>
        </header>

        <ol className="method" role="list">
          {methodStages.map((stage) => (
            <li
              key={stage.id}
              className={[
                "method-row",
                `method-row--${stage.id}`,
                stage.reversed ? "method-row--reverse" : null,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="method-row__copy reveal">
                <p className="method-row__num">{stage.number}</p>
                <h3 className="method-row__title">
                  <span className="method-row__verb">{stage.verb}</span> {stage.headline}
                </h3>
                <p className="method-row__body">{stage.body}</p>
                <ul className="method-row__list" role="list">
                  {stage.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
              <div className="method-row__mock reveal">
                <Mock mock={stage.mock} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Mock({ mock }: { mock: MethodMock }) {
  if (mock.kind === "fieldNotes") return <FieldNotesMock mock={mock} />;
  if (mock.kind === "substrateFile") return <SubstrateFileMock mock={mock} />;
  return <ChatMock mock={mock} />;
}

function MockHead({
  variant,
  header,
  status,
}: {
  variant: "navigate" | "encode" | "build";
  header: string;
  status: string;
}) {
  return (
    <header className={`mock__head mock__head--${variant}`}>
      <span>{header}</span>
      <span className="mock__status">
        <span className={`mock__status-dot mock__status-dot--${variant}`} aria-hidden="true" />
        {status}
      </span>
    </header>
  );
}

function FieldNotesMock({ mock }: { mock: MethodMockFieldNotes }) {
  return (
    <article className="mock mock--navigate">
      <MockHead variant="navigate" header={mock.header} status={mock.status} />
      <div className="mock__body">
        {mock.entries.map((entry, idx) => (
          <div key={idx} className="field-entry">
            <p className="field-entry__date">{entry.date}</p>
            <p className="field-entry__body">{renderHighlight(entry.body, entry.highlights)}</p>
          </div>
        ))}
        <div className="field-pattern">
          <p className="field-pattern__head">
            <span className="field-pattern__bullet" aria-hidden="true">
              ✱
            </span>
            {mock.pattern.heading}
          </p>
          <p className="field-pattern__body">{mock.pattern.body}</p>
        </div>
      </div>
    </article>
  );
}

/**
 * Inline mark replacement helper for field-note entries. Each
 * highlight is keyed by a placeholder token (e.g. `__1__`) in the
 * source string; this splits the string and renders the marked
 * fragments inside <mark> elements while keeping React keys stable.
 */
function renderHighlight(
  body: string,
  highlights?: { text: string; mark: string }[],
) {
  if (!highlights || highlights.length === 0) {
    return body;
  }
  let nodes: (string | { type: "mark"; text: string; key: string })[] = [body];
  highlights.forEach((h, idx) => {
    const next: typeof nodes = [];
    nodes.forEach((node, nodeIdx) => {
      if (typeof node !== "string") {
        next.push(node);
        return;
      }
      const parts = node.split(h.text);
      parts.forEach((part, partIdx) => {
        if (part) next.push(part);
        if (partIdx < parts.length - 1) {
          next.push({ type: "mark", text: h.mark, key: `${idx}-${nodeIdx}-${partIdx}` });
        }
      });
    });
    nodes = next;
  });
  return nodes.map((node, idx) =>
    typeof node === "string" ? (
      <span key={`t-${idx}`}>{node}</span>
    ) : (
      <mark key={node.key}>{node.text}</mark>
    ),
  );
}

function SubstrateFileMock({ mock }: { mock: MethodMockSubstrateFile }) {
  return (
    <article className="mock mock--encode">
      <MockHead variant="encode" header={mock.fileName} status={mock.version} />
      <pre className="code-mock" aria-label={`${mock.fileName} preview`}>
        {mock.lines.map((line, idx) => {
          if (line.type === "sep") {
            return (
              <span key={idx} className="code-mock__line code-mock__line--sep">
                ---
              </span>
            );
          }
          if (line.type === "blank") {
            return (
              <span key={idx} className="code-mock__line">
                {"\u00a0"}
              </span>
            );
          }
          if (line.type === "comment") {
            return (
              <span key={idx} className="code-mock__line code-mock__line--comment">
                {line.text}
              </span>
            );
          }
          if (line.type === "kv") {
            return (
              <span key={idx} className="code-mock__line">
                <span className="code-mock__k">{line.k}</span>
                <span className="code-mock__sep">: </span>
                <span className="code-mock__v">{line.v}</span>
              </span>
            );
          }
          return (
            <span key={idx} className="code-mock__line">
              <span className={`code-mock__tag code-mock__tag--${line.tag}`}>{line.label}</span>
              <span> {line.text}</span>
            </span>
          );
        })}
      </pre>
    </article>
  );
}

function ChatMock({ mock }: { mock: MethodMockChat }) {
  return (
    <article className="mock mock--build">
      <MockHead variant="build" header={mock.header} status={mock.status} />
      <div className="chat-mock">
        <div className="chat-mock__msgs">
          {mock.messages.map((message, idx) => (
            <div
              key={idx}
              className={`chat-mock__msg chat-mock__msg--${message.from}`}
            >
              <span className={`chat-mock__avatar chat-mock__avatar--${message.from}`}>
                {message.avatar}
              </span>
              {message.from === "user" ? (
                <span className="chat-mock__bubble chat-mock__bubble--user">
                  {message.text}
                </span>
              ) : (
                <span className="chat-mock__bubble">
                  <ol className="chat-mock__list">
                    {message.lines.map((line, i) => (
                      <li key={i}>
                        <strong>{i + 1}.</strong> {line}
                      </li>
                    ))}
                  </ol>
                  <span className="chat-mock__check">{message.check}</span>
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="chat-mock__bar" aria-hidden="true">
          <span className="chat-mock__input">{mock.inputPlaceholder}</span>
          <span className="chat-mock__send">→</span>
        </div>
      </div>
    </article>
  );
}

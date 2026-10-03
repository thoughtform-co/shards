import { problem } from "@/content/folio-copy";

/*
 * The problem in four steps, read left to right: paying is solved, the
 * invoice is not, so it waits, and email won't rescue it. A dot, a line,
 * a sentence; no boxes.
 */

const TONE = ["ok", "red", "warn", "warn"] as const;

export function Beats({ stack = false }: { stack?: boolean }) {
  return (
    <div className="fo-mock" data-mock="beats">
      <ol className={`fo-beats${stack ? " fo-beats--stack" : ""}`}>
        {problem.beats.map((b, i) => (
          <li className={`fo-beat fo-beat--${TONE[i]}`} key={b.title}>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

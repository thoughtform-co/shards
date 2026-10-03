import { problem } from "@/content/folio-copy";

/*
 * The problem told in four beats: paying is solved, the invoice is not,
 * flow loses, and email won't rescue it. Each beat carries a status dot so
 * the row reads green, red, amber, amber at a glance.
 */

const TONE = ["ok", "red", "warn", "warn"] as const;

export function Beats() {
  return (
    <div className="fo-mock" data-mock="beats">
      <ol className="fo-beats">
        {problem.beats.map((b, i) => (
          <li className="fo-beat" key={b.kicker}>
            <span className={`fo-beat__kicker fo-beat__kicker--${TONE[i]}`}>{b.kicker}</span>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { EXAMPLES } from "../../lib/examples";
import { totalDurationInSeconds } from "../../lib/motiondoc/timing";
import { useStudioStore } from "../../lib/store/useStudioStore";

export function ExamplePicker() {
  const loadDoc = useStudioStore((s) => s.loadDoc);
  const hasEdits = useStudioStore((s) => s.past.length > 0);
  const currentTitle = useStudioStore((s) => s.doc.meta.title);

  return (
    <section className="ml-panel">
      <h2 className="ml-panel__title">Examples</h2>
      <p className="ml-panel__hint">
        Starting points — load one, scrub it, pull it apart.
      </p>
      <ul className="ml-examples">
        {EXAMPLES.map((example) => {
          const active = example.doc.meta.title === currentTitle;
          return (
            <li key={example.id}>
              <button
                type="button"
                className={`ml-example${active ? " ml-example--active" : ""}`}
                onClick={() => {
                  if (
                    hasEdits &&
                    !window.confirm(
                      "Loading an example discards your current edits (export JSON first if you want to keep them). Continue?",
                    )
                  ) {
                    return;
                  }
                  loadDoc(structuredClone(example.doc));
                }}
              >
                <span className="ml-example__label">{example.label}</span>
                <span className="ml-example__blurb">{example.blurb}</span>
                <span className="ml-example__meta">
                  {example.doc.meta.format} ·{" "}
                  {totalDurationInSeconds(example.doc).toFixed(0)}s ·{" "}
                  {example.doc.scenes.length} scenes
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import { bridgeSection } from "@/content/aether";

/**
 * Bridge — dark interstitial between The Layer and Method.
 *
 * Editorial pause. A short headline ("Built inside your work. Owned by
 * your team.") followed by a mono sub-line that names the cadence:
 * three motions, one operator, six weeks. The dark surface is the
 * narrative pivot from "what the layer is" to "how it gets built".
 */
export function Bridge() {
  return (
    <section className="section section--ink section--bridge" id="bridge" aria-label="Built inside your work">
      <div className="wrap">
        <div className="bridge reveal">
          <h2 className="bridge__title">
            {bridgeSection.titlePre} <em>{bridgeSection.titleEm}</em>
          </h2>
          <p className="bridge__sub">{bridgeSection.sub}</p>
        </div>
      </div>
    </section>
  );
}

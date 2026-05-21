import { spectrumSection } from "@/content/operator";

/*
 * Spectrum — own dedicated section between Diagnosis and Vision.
 *
 * Promoted out of the Vision section's nested continuum strip so it
 * gets its own beat in the cleaned-up arc. TwelveLabs / Stripe Link
 * register: one mono-caps label, one bicolour h2, one 1-line sub,
 * one 3-up functional visual, one closing foot line.
 *
 * The middle column ("AI lives here") is highlighted to land the
 * mental-model shift the visitor needs to internalise before the
 * Vision orbit reads as the answer.
 *
 * Server component — no client hooks.
 */
export function Spectrum() {
  const { id, label, title, titleEm, titleAfter, sub, columns, foot } =
    spectrumSection;

  /* Per-section mono-caps eyebrow retired across the opening
     sections; `label` stays on the content type for stability. */
  void label;

  return (
    <section
      className="aiop-section aiop-section--white aiop-spectrum"
      id={id}
      aria-label="AI lives between tool and collaborator"
    >
      <div className="aiop-wrap aiop-spectrum__inner">
        <header className="aiop-section-head aiop-spectrum__head aiop-reveal">
          <h2 className="aiop-section-title aiop-spectrum__title">
            {title} <em>{titleEm}</em>
            {titleAfter ? ` ${titleAfter}` : ""}
          </h2>
          <p className="aiop-section-head__sub aiop-spectrum__sub">{sub}</p>
        </header>

        <ol
          className="aiop-spectrum__grid aiop-reveal"
          role="list"
          aria-label="Tool, AI, Collaborator continuum"
        >
          {columns.map((column) => (
            <li
              key={column.id}
              className={`aiop-spectrum__col aiop-spectrum__col--${column.id}${
                column.highlight ? " aiop-spectrum__col--highlight" : ""
              }`}
            >
              <span className="aiop-spectrum__col-label">{column.label}</span>
              <h3 className="aiop-spectrum__col-title">{column.title}</h3>
              <p className="aiop-spectrum__col-sub">{column.sub}</p>
            </li>
          ))}
        </ol>

        <p className="aiop-spectrum__foot aiop-reveal">{foot}</p>
      </div>
    </section>
  );
}

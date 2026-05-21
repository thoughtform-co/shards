import { flywheelSection, flywheelSteps } from "@/content/process";

export function Flywheel() {
  return (
    <section className="section" id="flywheel">
      <div className="wrap">
        <header className="section-head reveal">
          <p className={`eyebrow eyebrow--${flywheelSection.eyebrowTone}`}>
            {flywheelSection.eyebrow}
          </p>
          <h2 className="section-title">
            {flywheelSection.title} <em>{flywheelSection.titleEm}</em>
          </h2>
          <p className="section-intro">{flywheelSection.lede}</p>
        </header>

        <div className="flywheel reveal">
          <div className="flywheel__rail">
            {flywheelSteps.map((step) => (
              <article key={step.id} className="flywheel__step">
                <div>
                  <div className="flywheel__num">{step.number} · {step.label}</div>
                  <h3 className="flywheel__label">{step.label}</h3>
                </div>
                <h4 className="flywheel__title">{step.title}</h4>
                <p className="flywheel__body">{step.body}</p>
                <div className="flywheel__signal">
                  <span className="flywheel__signal-label">→ {step.signal}</span>
                  <span className="flywheel__signal-note">{step.signalNote}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="flywheel__close reveal">{flywheelSection.close}</p>
      </div>
    </section>
  );
}

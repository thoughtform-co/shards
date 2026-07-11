"use client";

import { DEFAULT_SPRING, SPRING_RECIPES } from "../../lib/motiondoc/presets";
import type { EasePreset, SpringConfig } from "../../lib/motiondoc/schema";

import { NumberField, type ChangePhase } from "./fields";

const EASE_OPTIONS: { value: EasePreset; label: string }[] = [
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease In (accelerate)" },
  { value: "ease-out", label: "Ease Out (decelerate)" },
  { value: "ease-in-out", label: "Ease In-Out" },
  { value: "overshoot", label: "Overshoot" },
  { value: "spring", label: "Spring" },
];

/*
 * "Ease into this keyframe" — the AE mental model. Selecting spring
 * reveals the physics; the recipe chips are the skill's named
 * configurations.
 */
export function EasingSelect({
  ease,
  spring,
  onChange,
}: {
  ease: EasePreset;
  spring: SpringConfig | undefined;
  onChange: (
    patch: { ease?: EasePreset; spring?: SpringConfig },
    phase: ChangePhase,
  ) => void;
}) {
  const config = spring ?? DEFAULT_SPRING;

  return (
    <div className="ml-easing">
      <label className="ml-field">
        <span className="ml-field__label" title="How the value approaches this keyframe">
          ease in
        </span>
        <select
          className="ml-field__input"
          value={ease}
          onChange={(e) => {
            const next = e.target.value as EasePreset;
            onChange(
              next === "spring"
                ? { ease: next, spring: config }
                : { ease: next },
              "commit",
            );
          }}
        >
          {EASE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      {ease === "spring" ? (
        <div className="ml-easing__spring">
          <div className="ml-easing__recipes">
            {Object.entries(SPRING_RECIPES).map(([name, recipe]) => (
              <button
                key={name}
                type="button"
                className={`ml-chip${
                  config.damping === recipe.damping &&
                  config.stiffness === recipe.stiffness
                    ? " ml-chip--active"
                    : ""
                }`}
                onClick={() => onChange({ spring: { ...recipe } }, "commit")}
              >
                {name}
              </button>
            ))}
          </div>
          <NumberField
            label="damping"
            value={config.damping}
            min={1}
            max={50}
            onChange={(v, phase) =>
              onChange({ spring: { ...config, damping: v } }, phase)
            }
          />
          <NumberField
            label="stiffness"
            value={config.stiffness}
            min={10}
            max={400}
            onChange={(v, phase) =>
              onChange({ spring: { ...config, stiffness: v } }, phase)
            }
          />
          <NumberField
            label="mass"
            value={config.mass}
            step={0.1}
            precision={1}
            min={0.1}
            max={10}
            onChange={(v, phase) =>
              onChange({ spring: { ...config, mass: v } }, phase)
            }
          />
        </div>
      ) : null}
    </div>
  );
}

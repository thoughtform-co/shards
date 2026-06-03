"use client";

import { useState } from "react";

import { ClaudeSkillAnatomy } from "@/components/claude-workshop/claude-skill-anatomy";
import { DegreesOfFreedom } from "@/components/intelligence-layer/degrees-of-freedom";
import { OperatorModal } from "@/components/operator/operator-modal";

/**
 * LayerDeepDive — two "Learn more" pop-ups that sit just below the
 * intelligence-layer diagram on `/intelligence-layer`.
 *
 * The page deliberately keeps the layer chapter short: name what
 * the layer is, then offer two side doors for the reader who wants
 * the mechanics one click away.
 *
 *   1. "See the freedom bands" → opens `<DegreesOfFreedom />` in
 *      a modal. Names the three bands every Skill ships with
 *      (locked, guided, open) so the depth lives off the main
 *      scroll path.
 *
 *   2. "How a Skill is built" → opens `<ClaudeSkillAnatomy />` in
 *      a modal. Shows the rules/examples/voice/loops anatomy of a
 *      single Skill, which is the unit the layer is filled with.
 *
 * Both modals reuse the canonical `<OperatorModal />` shell (portal
 * to body, esc-to-close, body-scroll-lock). The trigger row uses the
 * shared `.aiop-button` / `.aiop-button--ghost` styles so it inherits
 * the page's gold accent and stays consistent with the hero CTAs.
 */
export function LayerDeepDive() {
  const [open, setOpen] = useState<null | "freedom" | "anatomy">(null);

  return (
    <section
      className="aiop-section aiop-section--tight"
      aria-label="Two ways to go deeper into the intelligence layer"
    >
      <div className="aiop-wrap">
        <div
          className="aiop-reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            className="aiop-button"
            onClick={() => setOpen("freedom")}
          >
            See the freedom bands
            <span className="aiop-button__arrow" aria-hidden="true">
              →
            </span>
          </button>

          <button
            type="button"
            className="aiop-button aiop-button--ghost"
            onClick={() => setOpen("anatomy")}
          >
            How a Skill is built
            <span className="aiop-button__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>

      <OperatorModal
        open={open === "freedom"}
        onClose={() => setOpen(null)}
        ariaLabel="Degrees of freedom inside a Skill"
      >
        <DegreesOfFreedom hideCaption />
      </OperatorModal>

      <OperatorModal
        open={open === "anatomy"}
        onClose={() => setOpen(null)}
        ariaLabel="Anatomy of a Claude Skill"
      >
        <ClaudeSkillAnatomy />
      </OperatorModal>
    </section>
  );
}

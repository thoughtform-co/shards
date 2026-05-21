"use client";

import { useRole } from "./role-context";
import { useUseCase } from "./use-cases-context";

/**
 * Shared tab strip used by both the Substrate Gallery (section 03)
 * and the Degrees of Freedom (section 05). Reads + writes the same
 * `selectedId` from `UseCasesContext`, and pulls the use-case list
 * from the active role so the tabs change with the role.
 *
 * Renders one mono pill per use case in the active role. Active state
 * uses violet fill + bottom underline; inactive uses a quiet outline.
 * Roles follow the WAI-ARIA tabs pattern with `role="tablist"` /
 * `role="tab"`.
 */
export function UseCaseTabs({
  ariaLabel,
  panelId,
}: {
  ariaLabel: string;
  /** id of the panel this tablist controls (substrate gallery / freedom) */
  panelId: string;
}) {
  const { role } = useRole();
  const { selectedId, setSelectedId } = useUseCase();

  return (
    <div
      className="je-tabs"
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
    >
      {role.useCases.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            id={`je-tab-${panelId}-${c.id}`}
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            data-state={active ? "active" : "idle"}
            className="je-tabs__tab"
            onClick={() => setSelectedId(c.id)}
          >
            <span className="je-tabs__tab-num">{c.badge}</span>
            <span className="je-tabs__tab-name">{c.shortName}</span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UseCaseId } from "@/content/intelligence-layer";
import { useRole } from "./role-context";

/**
 * Shared "selected use case" state for the two tab modules on
 * `/intelligence-layer` (Substrate Gallery in section 03 and Degrees of
 * Freedom in section 05). Both modules subscribe to the same value, so
 * picking a case once flips the whole page in lockstep.
 *
 * The selected id is scoped to the active role. When the role changes
 * we cannot reset state synchronously inside the role-context callback
 * (other components hold the previous render's id), and a `useEffect`
 * runs *after* render — so we'd briefly expose a stale id like
 * `"feasibility"` to `getUseCase(ecomPmRole, ...)` which would throw.
 *
 * Instead we derive the effective id at render time: if the stored id
 * isn't in the active role's `useCases`, fall back to that role's
 * `defaultUseCaseId`. The effect below then syncs the stored state so
 * subsequent renders don't repeat the derivation. Same shape from the
 * consumer's point of view; never out of range.
 */

type UseCasesContextValue = {
  selectedId: UseCaseId;
  setSelectedId: (id: UseCaseId) => void;
};

const UseCasesContext = createContext<UseCasesContextValue | null>(null);

export function UseCasesProvider({ children }: { children: ReactNode }) {
  const { role } = useRole();

  const [selectedId, setSelectedIdRaw] = useState<UseCaseId>(
    role.defaultUseCaseId,
  );

  const isValidForRole = role.useCases.some((c) => c.id === selectedId);
  const effectiveId: UseCaseId = isValidForRole
    ? selectedId
    : role.defaultUseCaseId;

  // After a role swap, snap the stored id back to the new role's
  // default so we don't keep rederiving on every render. Also recovers
  // from a hand-edited URL where a stale id somehow leaked in.
  useEffect(() => {
    if (!isValidForRole) {
      setSelectedIdRaw(role.defaultUseCaseId);
    }
  }, [isValidForRole, role.defaultUseCaseId]);

  const setSelectedId = useCallback((id: UseCaseId) => {
    setSelectedIdRaw(id);
  }, []);

  const value = useMemo<UseCasesContextValue>(
    () => ({ selectedId: effectiveId, setSelectedId }),
    [effectiveId, setSelectedId],
  );

  return (
    <UseCasesContext.Provider value={value}>
      {children}
    </UseCasesContext.Provider>
  );
}

export function useUseCase(): UseCasesContextValue {
  const ctx = useContext(UseCasesContext);
  if (!ctx) {
    throw new Error(
      "useUseCase must be used inside a <UseCasesProvider>. " +
        "Wrap the substrate gallery and degrees-of-freedom sections in the provider.",
    );
  }
  return ctx;
}

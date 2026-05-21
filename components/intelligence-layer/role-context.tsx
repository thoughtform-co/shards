"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultRoleId,
  getRole,
  resolveRoleId,
  type Role,
  type RoleId,
} from "@/content/intelligence-layer";

/**
 * Active-role state for the Judgment Engine sub-site.
 *
 * Sits one level above `UseCasesProvider` and decides which role bundle
 * (Product Design / Ecom Program Manager / future) drives the page. The
 * selector dropdown in the hero is the only writer; every section below
 * reads via `useRole()` and re-renders when the role changes.
 *
 * URL persistence: `?role=ecom-pm` hydrates state on mount, and every
 * `setSelectedRoleId` call writes the param back via `router.replace`
 * with `{ scroll: false }` so the page stays anchored. Unknown values
 * fall back to `defaultRoleId` (resolved by `resolveRoleId`), so an
 * out-of-date link cannot crash the page.
 */

type RoleContextValue = {
  /** Currently selected role id. Always one of the known `RoleId`s. */
  selectedRoleId: RoleId;
  /** The full role bundle for the active id. Convenience for consumers. */
  role: Role;
  /** Switch to a different role. Updates the URL and resets downstream state. */
  setSelectedRoleId: (id: RoleId) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

const ROLE_PARAM = "role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialFromUrl = resolveRoleId(searchParams.get(ROLE_PARAM));
  const [selectedRoleId, setSelectedRoleIdRaw] = useState<RoleId>(initialFromUrl);

  // Keep state in sync if the URL changes externally (e.g. browser back/
  // forward, link click). React renders before the effect runs, so the
  // first paint already uses `initialFromUrl` from above.
  useEffect(() => {
    const fromUrl = resolveRoleId(searchParams.get(ROLE_PARAM));
    if (fromUrl !== selectedRoleId) {
      setSelectedRoleIdRaw(fromUrl);
    }
    // We deliberately depend on `searchParams` rather than the params
    // string — Next.js gives us a stable enough handle and equality is
    // compared via `resolveRoleId` above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setSelectedRoleId = useCallback(
    (id: RoleId) => {
      setSelectedRoleIdRaw(id);
      const params = new URLSearchParams(searchParams.toString());
      if (id === defaultRoleId) {
        // Keep the URL clean for the default role — no `?role=...` noise.
        params.delete(ROLE_PARAM);
      } else {
        params.set(ROLE_PARAM, id);
      }
      const query = params.toString();
      const next = query ? `${pathname}?${query}` : pathname;
      router.replace(next, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const value = useMemo<RoleContextValue>(
    () => ({
      selectedRoleId,
      role: getRole(selectedRoleId),
      setSelectedRoleId,
    }),
    [selectedRoleId, setSelectedRoleId],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error(
      "useRole must be used inside a <RoleProvider>. " +
        "Wrap the intelligence-layer page in the provider before rendering its sections.",
    );
  }
  return ctx;
}

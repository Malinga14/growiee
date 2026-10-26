"use client";

import { createContext, useCallback, useContext } from "react";
import { useStoredState } from "@/hooks/useStoredState";
import { DEFAULTS, isScenario, type Scenario } from "@/lib/model";

const KEY = "growiee-admin:scenario";

// One-time move of saved edits from the key used before the folder was
// renamed from dashboard/ to admin/.
if (typeof window !== "undefined") {
  try {
    const old = localStorage.getItem("growiee-dashboard:scenario");
    if (old !== null && localStorage.getItem(KEY) === null)
      localStorage.setItem(KEY, old);
    localStorage.removeItem("growiee-dashboard:scenario");
  } catch {
    // Storage blocked: nothing to move.
  }
}

type Ctx = {
  scenario: Scenario;
  /** Change one or more assumptions. */
  update: (patch: Partial<Scenario>) => void;
  reset: () => void;
  /** True when anything differs from the brand/plan defaults. */
  edited: boolean;
};

const ScenarioContext = createContext<Ctx | null>(null);

/**
 * The business assumptions, shared by every page and remembered in this
 * browser. Editing a number on any page updates the whole dashboard.
 */
export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [scenario, setScenario] = useStoredState(KEY, DEFAULTS, isScenario);
  const update = useCallback(
    (patch: Partial<Scenario>) => setScenario({ ...scenario, ...patch }),
    [scenario, setScenario],
  );
  const reset = useCallback(() => setScenario(DEFAULTS), [setScenario]);
  const edited = JSON.stringify(scenario) !== JSON.stringify(DEFAULTS);
  return (
    <ScenarioContext.Provider value={{ scenario, update, reset, edited }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario(): Ctx {
  const ctx = useContext(ScenarioContext);
  if (!ctx)
    throw new Error("useScenario must be used inside <ScenarioProvider>");
  return ctx;
}

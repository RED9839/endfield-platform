import { useMemo, useState } from "react";
import {
  applyOwnedMaterials,
  buildProgressSummary,
  mergeMaterials,
  normalizeMaterialName,
  type DailyIncomeMap,
  type OwnedMaterialMap,
  type SimStep,
} from "../_lib/simulator-utils";

export function useSimulatorProgression(initialOwned: OwnedMaterialMap = {}) {
  const [ownedMaterials, setOwnedMaterials] = useState<OwnedMaterialMap>(initialOwned);
  const [dailyIncome, setDailyIncome] = useState<DailyIncomeMap>({});

  const updateOwnedMaterial = (name: string, value: number) => {
    const normalizedName = normalizeMaterialName(name);
    setOwnedMaterials((prev) => ({
      ...prev,
      [normalizedName]: Math.max(0, Number(value) || 0),
    }));
  };

  const updateDailyIncome = (name: string, value: number) => {
    const normalizedName = normalizeMaterialName(name);
    setDailyIncome((prev) => ({
      ...prev,
      [normalizedName]: Math.max(0, Number(value) || 0),
    }));
  };

  const getMergedMaterials = (steps: SimStep[]) => mergeMaterials(steps);

  const getOwnedAppliedItems = (steps: SimStep[]) => {
    const merged = getMergedMaterials(steps);
    return applyOwnedMaterials(merged, ownedMaterials);
  };

  const getProgressSummary = (steps: SimStep[]) => {
    const merged = getMergedMaterials(steps);
    return buildProgressSummary({ requiredItems: merged, ownedMaterials, dailyIncome });
  };

  const state = useMemo(
    () => ({ ownedMaterials, dailyIncome }),
    [ownedMaterials, dailyIncome]
  );

  return {
    ...state,
    setOwnedMaterials,
    setDailyIncome,
    updateOwnedMaterial,
    updateDailyIncome,
    getMergedMaterials,
    getOwnedAppliedItems,
    getProgressSummary,
  };
}

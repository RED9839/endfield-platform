import type { RawMaterialItem } from "./simulator-utils";

export const OPERATOR_LEVEL_CUMULATIVE_COSTS = {
  1: { exp: 0, currency: 0 },
  20: { exp: 23000, currency: 820 },
  40: { exp: 271600, currency: 13360 },
  60: { exp: 747400, currency: 37260 },
  80: { exp: 1213400, currency: 146440 },
  90: { exp: 1793400, currency: 385420 },
} as const;

export const WEAPON_LEVEL_CUMULATIVE_COSTS = {
  1: { exp: 0, currency: 0 },
  20: { exp: 8890, currency: 640 },
  40: { exp: 105540, currency: 10400 },
  60: { exp: 290540, currency: 29010 },
  80: { exp: 1203710, currency: 123850 },
  90: { exp: 2524080, currency: 341390 },
} as const;

function convertRecordExpToItems(totalExp: number): RawMaterialItem[] {
  let remain = Math.max(0, totalExp);
  const items: RawMaterialItem[] = [];

  const highRecord = Math.floor(remain / 10000);
  remain -= highRecord * 10000;
  const midRecord = Math.floor(remain / 1000);
  remain -= midRecord * 1000;
  const lowRecord = Math.ceil(remain / 200);

  if (lowRecord > 0) items.push({ name: "초급 작전 기록", count: lowRecord, icon: "/items/초급 작전 기록.webp" });
  if (midRecord > 0) items.push({ name: "중급 작전 기록", count: midRecord, icon: "/items/중급 작전 기록.webp" });
  if (highRecord > 0) items.push({ name: "고급 작전 기록", count: highRecord, icon: "/items/고급 작전 기록.webp" });

  return items;
}

function convertCarrierExpToItems(totalExp: number): RawMaterialItem[] {
  let remain = Math.max(0, totalExp);
  const items: RawMaterialItem[] = [];

  const highCarrier = Math.floor(remain / 10000);
  remain -= highCarrier * 10000;
  const lowCarrier = Math.floor(remain / 1000);

  if (lowCarrier > 0) items.push({ name: "초급 인지 매개체", count: lowCarrier, icon: "/items/초급 인지 매개체.webp" });
  if (highCarrier > 0) items.push({ name: "고급 인지 매개체", count: highCarrier, icon: "/items/고급 인지 매개체.webp" });

  return items;
}

export function getWeaponLevelExpDelta(
  currentLevel: 1 | 20 | 40 | 60 | 80,
  targetLevel: 20 | 40 | 60 | 80 | 90
) {
  const currentExp = WEAPON_LEVEL_CUMULATIVE_COSTS[currentLevel]?.exp ?? 0;
  const targetExp = WEAPON_LEVEL_CUMULATIVE_COSTS[targetLevel]?.exp ?? 0;
  return Math.max(0, targetExp - currentExp);
}

export function getWeaponLevelCurrencyDelta(
  currentLevel: 1 | 20 | 40 | 60 | 80,
  targetLevel: 20 | 40 | 60 | 80 | 90
) {
  const currentCurrency = WEAPON_LEVEL_CUMULATIVE_COSTS[currentLevel]?.currency ?? 0;
  const targetCurrency = WEAPON_LEVEL_CUMULATIVE_COSTS[targetLevel]?.currency ?? 0;
  return Math.max(0, targetCurrency - currentCurrency);
}

export function convertWeaponExpToItems(totalExp: number): RawMaterialItem[] {
  let remain = Math.max(0, totalExp);
  const items: RawMaterialItem[] = [];

  const setCount = Math.floor(remain / 10000);
  remain -= setCount * 10000;
  const kitCount = Math.floor(remain / 1000);
  remain -= kitCount * 1000;
  const unitCount = Math.ceil(remain / 200);

  if (unitCount > 0) items.push({ name: "무기 점검 유닛", count: unitCount, icon: "/items/무기 점검 유닛.webp" });
  if (kitCount > 0) items.push({ name: "무기 점검 장치", count: kitCount, icon: "/items/무기 점검 장치.webp" });
  if (setCount > 0) items.push({ name: "무기 점검 세트", count: setCount, icon: "/items/무기 점검 세트.webp" });

  return items;
}

export function getOperatorLevelExpDelta(
  currentLevel: 1 | 20 | 40 | 60 | 80,
  targetLevel: 20 | 40 | 60 | 80 | 90
) {
  const currentExp = OPERATOR_LEVEL_CUMULATIVE_COSTS[currentLevel]?.exp ?? 0;
  const targetExp = OPERATOR_LEVEL_CUMULATIVE_COSTS[targetLevel]?.exp ?? 0;
  return Math.max(0, targetExp - currentExp);
}

export function getOperatorLevelCurrencyDelta(
  currentLevel: 1 | 20 | 40 | 60 | 80,
  targetLevel: 20 | 40 | 60 | 80 | 90
) {
  const currentCurrency = OPERATOR_LEVEL_CUMULATIVE_COSTS[currentLevel]?.currency ?? 0;
  const targetCurrency = OPERATOR_LEVEL_CUMULATIVE_COSTS[targetLevel]?.currency ?? 0;
  return Math.max(0, targetCurrency - currentCurrency);
}

export function convertOperatorExpToItemsByRange(
  currentLevel: 1 | 20 | 40 | 60 | 80,
  targetLevel: 20 | 40 | 60 | 80 | 90
): RawMaterialItem[] {
  if (targetLevel <= currentLevel) return [];

  const items: RawMaterialItem[] = [];

  if (currentLevel < 60) {
    const recordTarget = Math.min(targetLevel, 60) as 20 | 40 | 60;
    const recordExp =
      (OPERATOR_LEVEL_CUMULATIVE_COSTS[recordTarget]?.exp ?? 0) -
      (OPERATOR_LEVEL_CUMULATIVE_COSTS[currentLevel]?.exp ?? 0);

    items.push(...convertRecordExpToItems(recordExp));
  }

  if (targetLevel > 60) {
    const carrierStart = Math.max(currentLevel, 60) as 60 | 80;
    const carrierExp =
      (OPERATOR_LEVEL_CUMULATIVE_COSTS[targetLevel]?.exp ?? 0) -
      (OPERATOR_LEVEL_CUMULATIVE_COSTS[carrierStart]?.exp ?? 0);

    items.push(...convertCarrierExpToItems(carrierExp));
  }

  return items;
}

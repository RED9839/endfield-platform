export type RawMaterialItem = {
  name: string;
  count: string | number;
  icon?: string;
};

export type SimMaterial = {
  name: string;
  count: number;
  icon?: string;
};

export type SimStep = {
  label: string;
  materials: SimMaterial[];
};

export type OwnedMaterialMap = Record<string, number>;
export type DailyIncomeMap = Record<string, number>;

export type MaterialProgressItem = SimMaterial & {
  owned: number;
  lacking: number;
  dailyIncome: number;
  days: number | null;
};

export type ProgressSummary = {
  items: MaterialProgressItem[];
  maxDays: number;
  cappedDays: number | null;
  impossibleItems: string[];
};

export const OPERATOR_CURRENT_LEVEL_OPTIONS = [1, 20, 40, 60, 80] as const;
export const OPERATOR_TARGET_LEVEL_OPTIONS = [20, 40, 60, 80, 90] as const;

function getDefaultMaterialIcon(name: string) {
  return `/materials/${name}.webp`;
}

export function normalizeMaterialName(name: string): string {
  const raw = String(name ?? "").trim();
  const compact = raw.replace(/\s+/g, "");

  const aliasMap: Record<string, string> = {
    "바위아겔로스잎": "바위아겔로스 잎",
    "침식된옥잎": "침식된 옥 잎",
    "3상나노플레이크칩": "3상 나노 플레이크 칩",
    "프로토콜디스크": "프로토콜 디스크",
    "프로토콜디스크세트": "프로토콜 디스크 세트",
    "프로토콜프리즘": "프로토콜 프리즘",
    "프로토콜프리즘세트": "프로토콜 프리즘 세트",
    "무기점검유닛": "무기 점검 유닛",
    "무기점검장치": "무기 점검 장치",
    "무기점검세트": "무기 점검 세트",
    "초급작전기록": "초급 작전 기록",
    "중급작전기록": "중급 작전 기록",
    "고급작전기록": "고급 작전 기록",
    "초급인지매개체": "초급 인지 매개체",
    "고급인지매개체": "고급 인지 매개체",
  };

  return aliasMap[compact] ?? raw;
}

function parseMaterialCount(value: string | number | undefined | null): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value ?? "").trim();
  if (!raw) return 0;

  const lower = raw.toLowerCase().replace(/,/g, "").trim();

  if (/^-?\d+(\.\d+)?k$/.test(lower)) {
    return Math.round(parseFloat(lower.replace("k", "")) * 1000);
  }

  if (/^-?\d+(\.\d+)?m$/.test(lower)) {
    return Math.round(parseFloat(lower.replace("m", "")) * 1000000);
  }

  const numeric = Number(lower.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function normalizeMaterials(items: RawMaterialItem[] = []): SimMaterial[] {
  return items
    .map((item) => {
      const name = normalizeMaterialName(item.name);
      return {
        name,
        count: parseMaterialCount(item.count),
        icon: item.icon || getDefaultMaterialIcon(name),
      };
    })
    .filter((item) => item.name && item.count > 0);
}

export function mergeMaterials(steps: SimStep[]): SimMaterial[] {
  const map = new Map<string, SimMaterial>();

  for (const step of steps) {
    for (const mat of step.materials) {
      const name = normalizeMaterialName(mat.name);

      if (!map.has(name)) {
        map.set(name, {
          name,
          count: 0,
          icon: mat.icon || getDefaultMaterialIcon(name),
        });
      }

      const current = map.get(name)!;
      current.count += parseMaterialCount(mat.count);
      if (!current.icon && mat.icon) current.icon = mat.icon;
      if (!current.icon) current.icon = getDefaultMaterialIcon(name);
    }
  }

  return Array.from(map.values());
}

const EXP_MATERIAL_GROUPS = [
  {
    names: ["초급 작전 기록", "중급 작전 기록", "고급 작전 기록"],
    values: {
      "초급 작전 기록": 200,
      "중급 작전 기록": 1000,
      "고급 작전 기록": 10000,
    } as Record<string, number>,
  },
  {
    names: ["초급 인지 매개체", "고급 인지 매개체"],
    values: {
      "초급 인지 매개체": 1000,
      "고급 인지 매개체": 10000,
    } as Record<string, number>,
  },
  {
    names: ["무기 점검 유닛", "무기 점검 장치", "무기 점검 세트"],
    values: {
      "무기 점검 유닛": 200,
      "무기 점검 장치": 1000,
      "무기 점검 세트": 10000,
    } as Record<string, number>,
  },
] as const;

function getExpMaterialGroup(name: string) {
  const normalized = normalizeMaterialName(name);

  return EXP_MATERIAL_GROUPS.find((group) =>
    (group.names as readonly string[]).includes(normalized),
  );
}

function getGroupOwnedExp(
  group: (typeof EXP_MATERIAL_GROUPS)[number],
  ownedMaterials: OwnedMaterialMap,
) {
  return group.names.reduce((sum, name) => {
    const owned = Math.max(0, Number(ownedMaterials[name] ?? 0));
    const value = group.values[name] ?? 0;
    return sum + owned * value;
  }, 0);
}

export function applyOwnedMaterials(
  items: SimMaterial[],
  ownedMaterials: OwnedMaterialMap = {},
) {
  const groupedRequiredExp = new Map<string, number>();
  const groupedOwnedExp = new Map<string, number>();

  for (const item of items) {
    const normalizedName = normalizeMaterialName(item.name);
    const group = getExpMaterialGroup(normalizedName);

    if (!group) continue;

    const groupKey = group.names.join("|");
    const value = group.values[normalizedName] ?? 1;

    groupedRequiredExp.set(
      groupKey,
      (groupedRequiredExp.get(groupKey) ?? 0) + item.count * value,
    );

    if (!groupedOwnedExp.has(groupKey)) {
      groupedOwnedExp.set(groupKey, getGroupOwnedExp(group, ownedMaterials));
    }
  }

  return items.map((item) => {
    const normalizedName = normalizeMaterialName(item.name);
    const group = getExpMaterialGroup(normalizedName);

    if (!group) {
      const owned = Math.max(0, Number(ownedMaterials[normalizedName] ?? 0));
      const lacking = Math.max(0, item.count - owned);

      return {
        ...item,
        name: normalizedName,
        owned,
        lacking,
      };
    }

    const groupKey = group.names.join("|");
    const itemValue = group.values[normalizedName] ?? 1;
    const totalRequiredExp = groupedRequiredExp.get(groupKey) ?? 0;
    const totalOwnedExp = groupedOwnedExp.get(groupKey) ?? 0;
    const itemRequiredExp = item.count * itemValue;
    const remainingExp = Math.max(0, totalRequiredExp - totalOwnedExp);

    const lacking =
      remainingExp <= 0
        ? 0
        : Math.ceil(Math.min(itemRequiredExp, remainingExp) / itemValue);

    const owned = Math.max(0, item.count - lacking);

    return {
      ...item,
      name: normalizedName,
      owned,
      lacking,
    };
  });
}

export function buildProgressSummary(args: {
  requiredItems: SimMaterial[];
  ownedMaterials?: OwnedMaterialMap;
  dailyIncome?: DailyIncomeMap;
  excludedNames?: string[];
}): ProgressSummary {
  const {
    requiredItems,
    ownedMaterials = {},
    dailyIncome = {},
    excludedNames = ["탈로시안 화폐"],
  } = args;

  const normalizedExcluded = new Set(excludedNames.map(normalizeMaterialName));
  const items: MaterialProgressItem[] = applyOwnedMaterials(
    requiredItems,
    ownedMaterials,
  ).map((item) => {
    const normalizedName = normalizeMaterialName(item.name);
    const daily = Math.max(0, Number(dailyIncome[normalizedName] ?? 0));
    const lacking = Math.max(0, item.lacking);

    let days: number | null = 0;
    if (lacking > 0) {
      if (normalizedExcluded.has(normalizedName)) {
        days = 0;
      } else if (daily > 0) {
        days = Math.ceil(lacking / daily);
      } else {
        days = null;
      }
    }

    return {
      ...item,
      name: normalizedName,
      dailyIncome: daily,
      days,
    };
  });

  const calculableDays = items
    .map((item) => item.days)
    .filter((value): value is number => value !== null);

  const impossibleItems = items
    .filter((item) => item.lacking > 0 && item.days === null)
    .map((item) => item.name);

  const maxDays = calculableDays.length ? Math.max(...calculableDays) : 0;

  return {
    items,
    maxDays,
    cappedDays: impossibleItems.length ? null : maxDays,
    impossibleItems,
  };
}

export function clampLevel(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getNearestOperatorCurrentLevel(level: number) {
  const levels = [...OPERATOR_CURRENT_LEVEL_OPTIONS];
  return levels.reduce((prev, curr) =>
    Math.abs(curr - level) < Math.abs(prev - level) ? curr : prev,
  );
}

export function getNearestOperatorTargetLevel(level: number) {
  const levels = [...OPERATOR_TARGET_LEVEL_OPTIONS];
  return levels.reduce((prev, curr) =>
    Math.abs(curr - level) < Math.abs(prev - level) ? curr : prev,
  );
}

function pickArray<T = any>(...sources: unknown[]): T[] {
  for (const source of sources) {
    if (Array.isArray(source) && source.length > 0) {
      return source as T[];
    }
  }
  return [];
}

function pickMaterials(source: any): RawMaterialItem[] {
  return (
    source?.materials ??
    source?.costs ??
    source?.items ??
    source?.consume ??
    source?.required ??
    []
  ) as RawMaterialItem[];
}

function pickTargetLevel(source: any): number {
  return Number(
    source?.level ??
      source?.to ??
      source?.targetLevel ??
      source?.target ??
      source?.lv ??
      source?.rank ??
      0,
  );
}

export function getOperatorLevelMaterials(
  operator: any,
  current: number,
  target: number,
): SimStep[] {
  const costs = pickArray(
    operator?.requiredMaterials?.levelUp,
    operator?.levelUp,
    operator?.levelMaterials,
  );

  return costs
    .filter((c: any) => {
      const toLevel = pickTargetLevel(c);
      return toLevel > current && toLevel <= target;
    })
    .map((c: any) => ({
      label: `Lv.${pickTargetLevel(c)}`,
      materials: normalizeMaterials(pickMaterials(c)),
    }))
    .filter((step: SimStep) => step.materials.length > 0);
}

export function getWeaponLevelMaterials(
  weapon: any,
  current: number,
  target: number,
): SimStep[] {
  const costs = pickArray(
    weapon?.levelMaterials,
    weapon?.requiredMaterials?.levelUp,
    weapon?.requiredMaterials?.weaponLevelUp,
    weapon?.requiredMaterials?.weaponExp,
    weapon?.weaponLevelMaterials,
    weapon?.upgradeCosts,
    weapon?.upgradeMaterials,
    weapon?.enhancement,
    weapon?.enhancementMaterials,
    weapon?.growthMaterials,
    weapon?.levelUp,
    weapon?.cultivation,
    weapon?.requiredMaterials?.upgrade,
    weapon?.requiredMaterials?.enhancement,
  );

  return costs
    .filter((c: any) => {
      const toLevel = pickTargetLevel(c);
      return toLevel > current && toLevel <= target;
    })
    .map((c: any) => ({
      label: `Lv.${pickTargetLevel(c)}`,
      materials: normalizeMaterials(pickMaterials(c)),
    }))
    .filter((step: SimStep) => step.materials.length > 0);
}

export function getTrustBonusMaterials(operator: any, stages: string[]) {
  const costs = pickArray(operator?.requiredMaterials?.trustBonus);

  return costs
    .filter((c: any) => stages.includes(`trust-${c.stage}`))
    .map((c: any) => ({
      label: `신뢰도 ${c.stage}`,
      materials: normalizeMaterials(pickMaterials(c)),
    }))
    .filter((step: SimStep) => step.materials.length > 0);
}

export function getInfrastructureMaterials(operator: any, stages: string[]) {
  const costs = pickArray(operator?.requiredMaterials?.infrastructure);

  return costs
    .filter((c: any) => stages.includes(`infra-${c.slot}-${c.stage}`))
    .map((c: any) => ({
      label: `인프라 ${c.slot}-${c.stage}`,
      materials: normalizeMaterials(pickMaterials(c)),
    }))
    .filter((step: SimStep) => step.materials.length > 0);
}

export function getOperatorFullImage(operator: any): string {
  if (operator?.fullImage) return operator.fullImage;
  if (operator?.image) return operator.image;
  if (operator?.slug) return `/operators/${operator.slug}/full.webp`;
  return "/images/placeholder.webp";
}

export function getWeaponDisplayImage(weapon: any): string {
  if (weapon?.fullImage) return weapon.fullImage;
  if (weapon?.image) return weapon.image;
  if (weapon?.slug) return `/weapons/${weapon.slug}/avatar.webp`;
  return "/images/placeholder.webp";
}

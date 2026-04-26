import {
  ADVANCED_BOX_NAME,
  ADVANCED_BOX_VALUE,
  ADVANCED_MATERIALS,
  DAILY_NATURAL_SANITY,
  DAILY_QUEST_RECOVERY_NAME,
  DAILY_QUEST_REWARDS,
  FARM_STAGES,
  FARMABLE_MATERIAL_NAMES,
  MONTHLY_CARD_SANITY,
  ORIGINIUM_COST_TABLE,
  ORIGINIUM_REFRESH_SANITY,
  RECOVERY_ITEMS,
  TOKEN_SHOP_ITEMS,
  type DiscountKey,
  type TokenShopItem,
} from "@/data/farming/farm-data";

export type MaterialAmount = {
  name: string;
  amount: number;
};

export type DiscountStock = {
  name: DiscountKey;
  enabled: boolean;
  stock: number;
};

export type RecoveryState = {
  "이성 회복제": number;
  "응급 이성 강화제": number;
  "응급 이성 농축액": number;
  "이성 정수 약제": number;
};

export type FarmingSettings = {
  useDailyQuest: boolean;
  hasMonthlyCard: boolean;
  dailyOriginiumRefreshCount: number;
  useToken: boolean;
  useAllToken: boolean;
  ownedToken: number;
  advancedBoxCount: number;
  recovery: RecoveryState;
  discounts: DiscountStock[];
};

export type StagePlan = {
  material: string;
  stageName: string;
  rewardPerRun: number;
  runs: number;
  sanity: number;
};

export type AdvancedBoxUse = {
  material: string;
  boxes: number;
  gained: number;
};

export type TokenUse = {
  itemName: string;
  material: string;
  amount: number;
  count: number;
  tokenCost: number;
  totalTokenCost: number;
  savedSanity: number;
  efficiency: number;
};

export type FarmingPlanResult = {
  initialTargets: MaterialAmount[];
  remainingAfterOwned: MaterialAmount[];
  advancedBoxUses: AdvancedBoxUse[];
  tokenUses: TokenUse[];
  stagePlans: StagePlan[];
  missing: MaterialAmount[];
  totalRequiredSanity: number;
  usedToken: number;
  remainingToken: number;
  dailyTotalSanity: number;
  recoverySanity: number;
  dailyQuestSanity: number;
  dailyOriginiumCost: number;
  estimatedDays: number;
  remainingAfterRecovery: number;
};

function toMap(items: MaterialAmount[]) {
  const map: Record<string, number> = {};

  items.forEach((item) => {
    const name = item.name.trim();
    const amount = Number(item.amount);
    if (!name || !Number.isFinite(amount) || amount <= 0) return;
    map[name] = (map[name] ?? 0) + amount;
  });

  return map;
}

function mapToList(map: Record<string, number>) {
  return Object.entries(map)
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }));
}

function cloneMap(map: Record<string, number>) {
  return Object.fromEntries(Object.entries(map));
}

function getBestStageForMaterial(name: string) {
  let best:
    | {
        stageName: string;
        sanityCost: number;
        rewardPerRun: number;
        efficiency: number;
      }
    | null = null;

  FARM_STAGES.forEach((stage) => {
    const rewardPerRun = stage.rewards[name];
    if (!rewardPerRun || rewardPerRun <= 0) return;

    const efficiency = rewardPerRun / stage.sanityCost;

    if (!best || efficiency > best.efficiency) {
      best = {
        stageName: stage.name,
        sanityCost: stage.sanityCost,
        rewardPerRun,
        efficiency,
      };
    }
  });

  return best;
}

function calculateSanityForMap(map: Record<string, number>) {
  let totalSanity = 0;
  const plans: StagePlan[] = [];
  const missing: MaterialAmount[] = [];

  Object.entries(map).forEach(([name, amount]) => {
    if (amount <= 0) return;

    const stage = getBestStageForMaterial(name);
    if (!stage) {
      missing.push({ name, amount });
      return;
    }

    const runs = Math.ceil(amount / stage.rewardPerRun);
    const sanity = runs * stage.sanityCost;

    totalSanity += sanity;
    plans.push({
      material: name,
      stageName: stage.stageName,
      rewardPerRun: stage.rewardPerRun,
      runs,
      sanity,
    });
  });

  return { totalSanity, plans, missing };
}

function applyDailyQuestRewards(remaining: Record<string, number>, days: number) {
  const next = cloneMap(remaining);

  Object.entries(DAILY_QUEST_REWARDS).forEach(([name, amount]) => {
    if (!next[name]) return;
    next[name] = Math.max(next[name] - amount * days, 0);
  });

  return next;
}

function applyOwnedMaterials(
  targets: MaterialAmount[],
  owned: Record<string, number>
) {
  const targetMap = toMap(targets);
  const remaining: Record<string, number> = {};

  Object.entries(targetMap).forEach(([name, amount]) => {
    remaining[name] = Math.max(amount - (owned[name] ?? 0), 0);
  });

  return remaining;
}

function applyAdvancedBoxes(
  remaining: Record<string, number>,
  boxCount: number
) {
  const next = cloneMap(remaining);
  let boxesLeft = Math.max(0, Math.floor(boxCount));
  const uses: AdvancedBoxUse[] = [];

  while (boxesLeft > 0) {
    const target = ADVANCED_MATERIALS.map((name) => ({
      name,
      need: next[name] ?? 0,
    }))
      .filter((item) => item.need > 0)
      .sort((a, b) => b.need - a.need)[0];

    if (!target) break;

    const boxes = Math.min(boxesLeft, Math.ceil(target.need / ADVANCED_BOX_VALUE));
    const gained = boxes * ADVANCED_BOX_VALUE;

    next[target.name] = Math.max(target.need - gained, 0);
    boxesLeft -= boxes;

    uses.push({
      material: target.name,
      boxes,
      gained,
    });
  }

  return {
    remaining: next,
    uses,
    boxesLeft,
  };
}

function buildTokenItems(discounts: DiscountStock[]) {
  const stockMap = new Map<string, number>();

  discounts.forEach((discount) => {
    stockMap.set(discount.name, discount.enabled ? Math.max(0, discount.stock) : 0);
  });

  return TOKEN_SHOP_ITEMS.map((item) => ({
    ...item,
    stock:
      item.discountKey !== undefined
        ? stockMap.get(item.discountKey) ?? 0
        : Number.POSITIVE_INFINITY,
  }));
}

function tokenItemAllowed(item: TokenShopItem, useToken: boolean, useAllToken: boolean) {
  if (!useToken) return false;
  if (useAllToken) return true;

  return ADVANCED_MATERIALS.includes(
    item.rewardName as (typeof ADVANCED_MATERIALS)[number]
  );
}

function applyTokenOptimization({
  remaining,
  ownedToken,
  useToken,
  useAllToken,
  discounts,
}: {
  remaining: Record<string, number>;
  ownedToken: number;
  useToken: boolean;
  useAllToken: boolean;
  discounts: DiscountStock[];
}) {
  const next = cloneMap(remaining);
  const uses: TokenUse[] = [];
  let tokenLeft = Math.max(0, Math.floor(ownedToken));
  const shopItems = buildTokenItems(discounts);

  while (tokenLeft > 0) {
    const beforeSanity = calculateSanityForMap(next).totalSanity;

    const candidates = shopItems
      .filter((item) => item.stock > 0)
      .filter((item) => tokenItemAllowed(item, useToken, useAllToken))
      .filter((item) => (next[item.rewardName] ?? 0) > 0)
      .filter((item) => item.tokenCost <= tokenLeft)
      .map((item) => {
        const after = cloneMap(next);
        after[item.rewardName] = Math.max(
          (after[item.rewardName] ?? 0) - item.rewardAmount,
          0
        );

        const afterSanity = calculateSanityForMap(after).totalSanity;
        const savedSanity = Math.max(beforeSanity - afterSanity, 0);
        const efficiency = savedSanity / item.tokenCost;

        return { item, savedSanity, efficiency };
      })
      .filter((candidate) => {
        if (useAllToken) return candidate.savedSanity > 0;
        return candidate.savedSanity > 0 && candidate.efficiency > 0;
      })
      .sort((a, b) => {
        if (b.efficiency !== a.efficiency) return b.efficiency - a.efficiency;
        return b.savedSanity - a.savedSanity;
      });

    const best = candidates[0];
    if (!best) break;

    const item = best.item;
    const stockIndex = shopItems.findIndex((shopItem) => shopItem.id === item.id);
    if (stockIndex < 0) break;

    next[item.rewardName] = Math.max(
      (next[item.rewardName] ?? 0) - item.rewardAmount,
      0
    );
    tokenLeft -= item.tokenCost;
    shopItems[stockIndex].stock -= 1;

    const existing = uses.find((use) => use.itemName === item.name);
    if (existing) {
      existing.count += 1;
      existing.amount += item.rewardAmount;
      existing.totalTokenCost += item.tokenCost;
      existing.savedSanity += best.savedSanity;
      existing.efficiency = existing.savedSanity / existing.totalTokenCost;
    } else {
      uses.push({
        itemName: item.name,
        material: item.rewardName,
        amount: item.rewardAmount,
        count: 1,
        tokenCost: item.tokenCost,
        totalTokenCost: item.tokenCost,
        savedSanity: best.savedSanity,
        efficiency: best.efficiency,
      });
    }
  }

  return {
    remaining: next,
    uses,
    usedToken: Math.max(0, Math.floor(ownedToken)) - tokenLeft,
    remainingToken: tokenLeft,
  };
}

export function getFarmableMaterialsOnly(items: MaterialAmount[]) {
  return items.filter((item) => FARMABLE_MATERIAL_NAMES.includes(item.name));
}

export function calculateDailySanity(settings: FarmingSettings) {
  const refreshCount = Math.min(
    Math.max(Math.floor(settings.dailyOriginiumRefreshCount), 0),
    ORIGINIUM_COST_TABLE.length
  );

  const dailyOriginiumCost = ORIGINIUM_COST_TABLE.slice(0, refreshCount).reduce(
    (sum, cost) => sum + cost,
    0
  );

  const dailyPaidSanity = refreshCount * ORIGINIUM_REFRESH_SANITY;
  const monthlySanity = settings.hasMonthlyCard ? MONTHLY_CARD_SANITY : 0;
  const dailyQuestSanity = settings.useDailyQuest ? 40 : 0;

  const dailyTotalSanity =
    DAILY_NATURAL_SANITY + monthlySanity + dailyPaidSanity + dailyQuestSanity;

  const recoverySanity = RECOVERY_ITEMS.reduce((sum, item) => {
    return sum + (settings.recovery[item.name] ?? 0) * item.sanity;
  }, 0);

  return {
    dailyTotalSanity,
    dailyOriginiumCost,
    dailyQuestSanity,
    recoverySanity,
  };
}

export function calculateFarmingPlan({
  targets,
  ownedMaterials,
  settings,
}: {
  targets: MaterialAmount[];
  ownedMaterials: MaterialAmount[];
  settings: FarmingSettings;
}): FarmingPlanResult {
  const ownedMap = toMap(ownedMaterials);
  const recoveryOwned = RECOVERY_ITEMS.reduce((acc, item) => {
    acc[item.name] = settings.recovery[item.name] ?? ownedMap[item.name] ?? 0;
    return acc;
  }, {} as RecoveryState);

  const normalizedSettings: FarmingSettings = {
    ...settings,
    recovery: recoveryOwned,
    advancedBoxCount:
      settings.advancedBoxCount || ownedMap[ADVANCED_BOX_NAME] || 0,
  };

  const farmableTargets = getFarmableMaterialsOnly(targets);
  const remainingAfterOwned = applyOwnedMaterials(farmableTargets, ownedMap);

  const boxResult = applyAdvancedBoxes(
    remainingAfterOwned,
    normalizedSettings.advancedBoxCount
  );

  const tokenResult = applyTokenOptimization({
    remaining: boxResult.remaining,
    ownedToken: normalizedSettings.useToken ? normalizedSettings.ownedToken : 0,
    useToken: normalizedSettings.useToken,
    useAllToken: normalizedSettings.useAllToken,
    discounts: normalizedSettings.discounts,
  });

  const sanityResult = calculateSanityForMap(tokenResult.remaining);
  const daily = calculateDailySanity(normalizedSettings);
  const remainingAfterRecovery = Math.max(
    sanityResult.totalSanity - daily.recoverySanity,
    0
  );

  const estimatedDays =
    remainingAfterRecovery <= 0
      ? 0
      : Math.ceil(remainingAfterRecovery / Math.max(daily.dailyTotalSanity, 1));

  return {
    initialTargets: farmableTargets,
    remainingAfterOwned: mapToList(remainingAfterOwned),
    advancedBoxUses: boxResult.uses,
    tokenUses: tokenResult.uses,
    stagePlans: sanityResult.plans,
    missing: sanityResult.missing,
    totalRequiredSanity: sanityResult.totalSanity,
    usedToken: tokenResult.usedToken,
    remainingToken: tokenResult.remainingToken,
    dailyTotalSanity: daily.dailyTotalSanity,
    recoverySanity: daily.recoverySanity,
    dailyQuestSanity: daily.dailyQuestSanity,
    dailyOriginiumCost: daily.dailyOriginiumCost,
    estimatedDays,
    remainingAfterRecovery,
  };
}

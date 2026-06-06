import {
  ADVANCED_MATERIALS,
  DAILY_NATURAL_SANITY,
  DAILY_QUEST_REWARDS,
  FARM_STAGES,
  MONTHLY_CARD_SANITY,
  ORIGINIUM_COST_TABLE,
  ORIGINIUM_REFRESH_SANITY,
  RECOVERY_ITEMS,
  TOKEN_SHOP_ITEMS,
  WEEKLY_QUEST_REWARDS,
  type DiscountKey,
} from "@/data/farming/farm-data";

export type MaterialAmount = {
  name: string;
  amount: number;
};

export type RecoveryState = Record<string, number>;

export type DiscountStock = {
  name: DiscountKey;
  enabled: boolean;
  stock: number;
};

export type FarmingSettings = {
  useDailyQuest: boolean;
  useWeeklyQuest?: boolean;
  hasMonthlyCard: boolean;
  dailyOriginiumRefreshCount: number;
  useToken: boolean;
  useAllToken: boolean;
  ownedToken: number;
  advancedBoxCount: number;
  recovery: RecoveryState;
  discounts: DiscountStock[];
};

export type FarmingTarget = MaterialAmount;

export type StagePlan = {
  material: string;
  stageId: string;
  stageName: string;
  rewardPerRun: number;
  sanityCost: number;
  runs: number;
  sanity: number;
  amount: number;
};

export type TokenUse = {
  material: string;
  itemName: string;
  count: number;
  amount: number;
  tokenCost: number;
  totalTokenCost: number;
};

export type AdvancedBoxUse = {
  material: string;
  boxes: number;
  gained: number;
};

export type FarmingCalculationResult = {
  totalRequiredSanity: number;
  recoverySanity: number;
  netRequiredSanity: number;
  totalSanity: number;
  usedToken: number;
  remainingToken: number;
  dailyTotalSanity: number;
  estimatedDays: number;
  stagePlans: StagePlan[];
  tokenUses: TokenUse[];
  advancedBoxUses: AdvancedBoxUse[];
  shortage: MaterialAmount[];
};

type CalculateInput = {
  targets: MaterialAmount[];
  ownedMaterials: MaterialAmount[];
  settings: FarmingSettings;
};

type UnknownRecord = Record<string, unknown>;

type PlanSnapshot = {
  shortage: MaterialAmount[];
  stagePlans: StagePlan[];
  tokenUses: TokenUse[];
  advancedBoxUses: AdvancedBoxUse[];
  usedToken: number;
  remainingToken: number;
  totalRequiredSanity: number;
};

type FlattenedTokenShopItem = {
  material: string;
  itemName: string;
  amount: number;
  tokenCost: number;
  stock: number;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (isRecord(value)) {
    return Object.entries(value).map(([key, item]) => {
      if (isRecord(item)) return { key, ...item };
      return { key, amount: item };
    });
  }
  return [];
}

function getString(record: UnknownRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

function getNumber(record: UnknownRecord, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value > 0) return value;
  }
  return fallback;
}

function addAmount(map: Map<string, number>, name: string, amount: number) {
  const safeAmount = toNumber(amount);
  if (!name || safeAmount <= 0) return;
  map.set(name, (map.get(name) ?? 0) + safeAmount);
}

function mergeMaterials(...groups: MaterialAmount[][]) {
  const map = new Map<string, number>();

  for (const group of groups) {
    for (const item of group) {
      addAmount(map, item.name, item.amount);
    }
  }

  return Array.from(map.entries()).map(([name, amount]) => ({ name, amount }));
}

function getAdvancedMaterialNames() {
  return toArray(ADVANCED_MATERIALS)
    .map((item) => {
      if (typeof item === "string") return item;
      if (!isRecord(item)) return "";
      return getString(item, ["name", "material", "materialName", "key"]);
    })
    .filter(Boolean);
}

function getRecoveryItemSanity(name: string) {
  for (const item of toArray(RECOVERY_ITEMS)) {
    if (!isRecord(item)) continue;

    const itemName = getString(item, ["name", "key"]);
    if (itemName !== name) continue;

    return getNumber(item, ["sanity", "amount", "value"]);
  }

  return 0;
}

function isRecoveryReward(name: string) {
  return getRecoveryItemSanity(name) > 0;
}

function getQuestRewards(rewards: unknown, enabled: boolean) {
  if (!enabled) return [];

  return toArray(rewards)
    .map((reward) => {
      if (!isRecord(reward)) return { name: "", amount: 0 };

      return {
        name: getString(reward, ["name", "material", "materialName", "key"]),
        amount: getNumber(reward, ["amount", "value", "count"]),
      };
    })
    .filter((reward) => reward.name && reward.amount > 0);
}

function getDailyQuestRewards(settings: FarmingSettings) {
  return getQuestRewards(DAILY_QUEST_REWARDS, settings.useDailyQuest);
}

function getWeeklyQuestRewards(settings: FarmingSettings, weeks: number) {
  const safeWeeks = Math.max(Math.floor(Number(weeks) || 0), 0);
  if (safeWeeks <= 0) return [];

  return getQuestRewards(WEEKLY_QUEST_REWARDS, settings.useWeeklyQuest === true).map(
    (reward) => ({
      name: reward.name,
      amount: reward.amount * safeWeeks,
    }),
  );
}

function getDailySanity(settings: FarmingSettings) {
  let sanity = DAILY_NATURAL_SANITY;

  for (const reward of getDailyQuestRewards(settings)) {
    const recoverySanity = getRecoveryItemSanity(reward.name);
    if (recoverySanity > 0) {
      sanity += recoverySanity * reward.amount;
    }
  }

  if (settings.hasMonthlyCard) {
    sanity += MONTHLY_CARD_SANITY;
  }

  const refreshCount = Math.min(
    Math.max(Math.floor(Number(settings.dailyOriginiumRefreshCount) || 0), 0),
    Array.isArray(ORIGINIUM_COST_TABLE) ? ORIGINIUM_COST_TABLE.length : 10,
  );

  sanity += refreshCount * ORIGINIUM_REFRESH_SANITY;

  return sanity;
}

function getRecoverySanity(settings: FarmingSettings): number {
  return toArray(RECOVERY_ITEMS).reduce<number>((sum, item) => {
    if (!isRecord(item)) return sum;

    const name = getString(item, ["name", "key"]);
    const sanity = getNumber(item, ["sanity", "amount", "value"]);

    return sum + toNumber(settings.recovery?.[name]) * sanity;
  }, 0);
}

function getDailyMaterialRewards(settings: FarmingSettings, days: number) {
  const rewardMap = new Map<string, number>();
  const safeDays = Math.max(Math.floor(Number(days) || 0), 0);

  if (safeDays <= 0) return [];

  for (const reward of getDailyQuestRewards(settings)) {
    if (isRecoveryReward(reward.name)) continue;
    addAmount(rewardMap, reward.name, reward.amount * safeDays);
  }

  return Array.from(rewardMap.entries()).map(([name, amount]) => ({
    name,
    amount,
  }));
}

function getWeeklyMaterialRewards(settings: FarmingSettings, days: number) {
  const safeDays = Math.max(Math.floor(Number(days) || 0), 0);
  const weeks = Math.floor(safeDays / 7);

  if (weeks <= 0) return [];

  return getWeeklyQuestRewards(settings, weeks).filter(
    (reward) => !isRecoveryReward(reward.name),
  );
}

function getQuestMaterialRewards(settings: FarmingSettings, days: number) {
  return mergeMaterials(
    getDailyMaterialRewards(settings, days),
    getWeeklyMaterialRewards(settings, days),
  );
}

function getMaterialRewardReferenceSettings(settings: FarmingSettings): FarmingSettings {
  return {
    ...settings,
    hasMonthlyCard: false,
    dailyOriginiumRefreshCount: 0,
    recovery: {},
  };
}

function extractStageRewards(stage: UnknownRecord): MaterialAmount[] {
  const rawRewards =
    stage.rewards ??
    stage.drops ??
    stage.materials ??
    stage.reward ??
    stage.dropItems;

  if (Array.isArray(rawRewards)) {
    return rawRewards
      .map((reward) => {
        if (typeof reward === "string") return { name: reward, amount: 1 };
        if (!isRecord(reward)) return { name: "", amount: 0 };
        return {
          name: getString(reward, ["name", "material", "materialName", "key"]),
          amount: getNumber(reward, ["amount", "count", "value", "quantity"], 1),
        };
      })
      .filter((reward) => reward.name && reward.amount > 0);
  }

  if (isRecord(rawRewards)) {
    return Object.entries(rawRewards)
      .map(([name, amount]) => ({ name, amount: toNumber(amount) || 1 }))
      .filter((reward) => reward.name && reward.amount > 0);
  }

  return [];
}

function getBestStage(material: string) {
  for (const stage of toArray(FARM_STAGES)) {
    if (!isRecord(stage)) continue;
    const rewards = extractStageRewards(stage);
    const reward = rewards.find((item) => item.name === material);
    if (!reward) continue;
    return {
      id: getString(stage, ["id", "key", "stageId"], material),
      name: getString(stage, ["name", "title", "stageName"], material),
      sanityCost: getNumber(stage, ["sanityCost", "sanity", "cost", "apCost"], 0),
      rewardPerRun: reward.amount,
    };
  }

  return null;
}

function getFarmSanityPerUnit(material: string) {
  const stage = getBestStage(material);
  if (!stage || stage.sanityCost <= 0 || stage.rewardPerRun <= 0) return 0;
  return stage.sanityCost / stage.rewardPerRun;
}

function getTokenEfficiency(shopItem: FlattenedTokenShopItem) {
  if (shopItem.tokenCost <= 0 || shopItem.amount <= 0) return 0;
  return (getFarmSanityPerUnit(shopItem.material) * shopItem.amount) / shopItem.tokenCost;
}

function getEnabledDiscountStock(settings: FarmingSettings, discountKey: string) {
  const discount = settings.discounts.find((item) => item.name === discountKey);
  if (!discount?.enabled) return 0;
  return Math.max(Math.floor(toNumber(discount.stock)), 0);
}

function pushTokenShopItem(
  result: FlattenedTokenShopItem[],
  rawItem: UnknownRecord,
  fallbackMaterialName: string,
  settings: FarmingSettings,
) {
  const discountKey = getString(rawItem, ["discountKey"]);
  const baseStock = getNumber(rawItem, ["stock", "limit", "max"], 9999);
  const stock = discountKey
    ? getEnabledDiscountStock(settings, discountKey)
    : baseStock;

  if (stock <= 0) return;

  result.push({
    material: getString(rawItem, ["material", "materialName", "rewardName", "name"], fallbackMaterialName),
    itemName: getString(rawItem, ["itemName", "label", "name"], fallbackMaterialName || "증표 교환"),
    amount: getNumber(rawItem, ["amount", "count", "quantity", "rewardAmount"], 1),
    tokenCost: getNumber(rawItem, ["tokenCost", "cost", "price"], 0),
    stock,
  });
}

function flattenTokenShopItems(settings: FarmingSettings) {
  const result: FlattenedTokenShopItem[] = [];

  if (Array.isArray(TOKEN_SHOP_ITEMS)) {
    for (const rawItem of TOKEN_SHOP_ITEMS) {
      if (!isRecord(rawItem)) continue;
      pushTokenShopItem(result, rawItem, "", settings);
    }

    return result;
  }

  if (isRecord(TOKEN_SHOP_ITEMS)) {
    for (const [materialName, rawValue] of Object.entries(TOKEN_SHOP_ITEMS)) {
      if (Array.isArray(rawValue)) {
        for (const rawItem of rawValue) {
          if (!isRecord(rawItem)) continue;
          pushTokenShopItem(result, rawItem, materialName, settings);
        }
      } else if (isRecord(rawValue)) {
        pushTokenShopItem(result, rawValue, materialName, settings);
      }
    }
  }

  return result;
}

function buildShortage(targets: MaterialAmount[], ownedMaterials: MaterialAmount[]) {
  const ownedMap = new Map<string, number>();
  for (const item of ownedMaterials) addAmount(ownedMap, item.name, item.amount);

  const shortageMap = new Map<string, number>();
  for (const target of targets) {
    const shortage = Math.max(toNumber(target.amount) - (ownedMap.get(target.name) ?? 0), 0);
    addAmount(shortageMap, target.name, shortage);
  }

  return Array.from(shortageMap.entries()).map(([name, amount]) => ({ name, amount }));
}

function applyAdvancedBoxes(shortage: MaterialAmount[], settings: FarmingSettings) {
  const advancedMaterialNames = getAdvancedMaterialNames();
  const advancedBoxUses: AdvancedBoxUse[] = [];
  let remainingPicks = toNumber(settings.advancedBoxCount) * 2;

  const nextShortage = shortage.map((item) => ({ ...item }));
  const sortedShortage = nextShortage
    .filter((item) => advancedMaterialNames.includes(item.name))
    .sort((a, b) => getFarmSanityPerUnit(b.name) - getFarmSanityPerUnit(a.name));

  for (const item of sortedShortage) {
    if (remainingPicks <= 0) break;
    const gained = Math.min(item.amount, remainingPicks);
    if (gained <= 0) continue;

    advancedBoxUses.push({
      material: item.name,
      boxes: Math.ceil(gained / 2),
      gained,
    });

    item.amount -= gained;
    remainingPicks -= gained;
  }

  return {
    shortage: nextShortage.filter((item) => item.amount > 0),
    advancedBoxUses,
  };
}

function applyTokens(shortage: MaterialAmount[], settings: FarmingSettings) {
  const tokenUses: TokenUse[] = [];
  let remainingToken = toNumber(settings.ownedToken);
  let usedToken = 0;

  if (!settings.useToken || remainingToken <= 0) {
    return { shortage, tokenUses, usedToken, remainingToken };
  }

  const advancedMaterialNames = getAdvancedMaterialNames();
  const nextShortage = shortage.map((item) => ({ ...item }));
  const shortageMap = new Map(nextShortage.map((item) => [item.name, item]));
  const hasAdvancedShortage = nextShortage.some(
    (item) => advancedMaterialNames.includes(item.name) && item.amount > 0,
  );

  const shopItems = flattenTokenShopItems(settings)
    .map((shopItem) => ({
      ...shopItem,
      efficiency: getTokenEfficiency(shopItem),
    }))
    .filter((shopItem) => {
      const target = shortageMap.get(shopItem.material);
      if (!target || target.amount <= 0) return false;
      if (shopItem.tokenCost <= 0 || shopItem.amount <= 0) return false;
      if (hasAdvancedShortage && !advancedMaterialNames.includes(shopItem.material)) return false;
      return settings.useAllToken || shopItem.efficiency > 0;
    })
    .sort((a, b) => {
      if (b.efficiency !== a.efficiency) return b.efficiency - a.efficiency;
      if (a.tokenCost !== b.tokenCost) return a.tokenCost - b.tokenCost;
      return a.itemName.localeCompare(b.itemName, "ko");
    });

  for (const shopItem of shopItems) {
    if (remainingToken <= 0) break;

    const target = shortageMap.get(shopItem.material);
    if (!target || target.amount <= 0) continue;

    const needCount = Math.ceil(target.amount / shopItem.amount);
    const affordableCount = Math.floor(remainingToken / shopItem.tokenCost);
    const count = Math.min(needCount, affordableCount, shopItem.stock);

    if (count <= 0) continue;

    const gained = count * shopItem.amount;
    const tokenCost = count * shopItem.tokenCost;

    tokenUses.push({
      material: shopItem.material,
      itemName: shopItem.itemName,
      count,
      amount: gained,
      tokenCost: shopItem.tokenCost,
      totalTokenCost: tokenCost,
    });

    target.amount = Math.max(target.amount - gained, 0);
    remainingToken -= tokenCost;
    usedToken += tokenCost;
  }

  return {
    shortage: nextShortage.filter((item) => item.amount > 0),
    tokenUses,
    usedToken,
    remainingToken,
  };
}

function buildStagePlans(shortage: MaterialAmount[]) {
  const plans: StagePlan[] = [];

  for (const item of shortage) {
    const stage = getBestStage(item.name);
    if (!stage) continue;
    if (stage.sanityCost <= 0 || stage.rewardPerRun <= 0) continue;

    const runs = Math.ceil(item.amount / stage.rewardPerRun);
    const sanity = runs * stage.sanityCost;

    plans.push({
      material: item.name,
      stageId: stage.id,
      stageName: stage.name,
      rewardPerRun: stage.rewardPerRun,
      sanityCost: stage.sanityCost,
      runs,
      sanity,
      amount: item.amount,
    });
  }

  return plans;
}

function buildPlan(
  targets: MaterialAmount[],
  ownedMaterials: MaterialAmount[],
  settings: FarmingSettings,
  questRewardDays: number,
): PlanSnapshot {
  const questOwnedMaterials = getQuestMaterialRewards(settings, questRewardDays);
  const baseShortage = buildShortage(
    targets,
    mergeMaterials(ownedMaterials, questOwnedMaterials),
  );
  const boxResult = applyAdvancedBoxes(baseShortage, settings);
  const tokenResult = applyTokens(boxResult.shortage, settings);
  const stagePlans = buildStagePlans(tokenResult.shortage);
  const totalRequiredSanity = stagePlans.reduce((sum, plan) => sum + plan.sanity, 0);

  return {
    shortage: tokenResult.shortage,
    stagePlans,
    tokenUses: tokenResult.tokenUses,
    advancedBoxUses: boxResult.advancedBoxUses,
    usedToken: tokenResult.usedToken,
    remainingToken: tokenResult.remainingToken,
    totalRequiredSanity,
  };
}

function getAvailableSanityForRewardReference(input: CalculateInput, days: number) {
  const safeDays = Math.max(Math.floor(Number(days) || 0), 0);
  const referenceSettings = getMaterialRewardReferenceSettings(input.settings);
  return getDailySanity(referenceSettings) * safeDays;
}

function canCompleteRewardReferenceWithinDays(input: CalculateInput, days: number) {
  const referenceSettings = getMaterialRewardReferenceSettings(input.settings);
  const plan = buildPlan(input.targets, input.ownedMaterials, referenceSettings, days);
  return plan.totalRequiredSanity <= getAvailableSanityForRewardReference(input, days);
}

function findEstimatedDays(input: CalculateInput, requiredSanity: number) {
  if (requiredSanity <= getRecoverySanity(input.settings)) return 0;

  const dailyTotalSanity = getDailySanity(input.settings);
  const recoverySanity = getRecoverySanity(input.settings);
  if (dailyTotalSanity + recoverySanity <= 0) return 0;

  return Math.ceil(Math.max(requiredSanity - recoverySanity, 0) / dailyTotalSanity);
}

function findQuestRewardDays(input: CalculateInput) {
  if (!input.settings.useDailyQuest && !input.settings.useWeeklyQuest) return 0;

  const referenceInput: CalculateInput = {
    ...input,
    settings: getMaterialRewardReferenceSettings(input.settings),
  };

  const zeroDayPlan = buildPlan(
    referenceInput.targets,
    referenceInput.ownedMaterials,
    referenceInput.settings,
    0,
  );

  if (zeroDayPlan.totalRequiredSanity <= 0) return 0;

  let low = 0;
  let high = Math.max(
    1,
    Math.ceil(zeroDayPlan.totalRequiredSanity / Math.max(getDailySanity(referenceInput.settings), 1)),
  );

  while (!canCompleteRewardReferenceWithinDays(referenceInput, high)) {
    high *= 2;
    if (high > 36500) break;
  }

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (canCompleteRewardReferenceWithinDays(referenceInput, mid)) high = mid;
    else low = mid + 1;
  }

  return low;
}

export function calculateFarmingPlan(input: CalculateInput): FarmingCalculationResult {
  const dailyTotalSanity = getDailySanity(input.settings);
  const recoverySanity = getRecoverySanity(input.settings);
  const questRewardDays = findQuestRewardDays(input);
  const finalPlan = buildPlan(
    input.targets,
    input.ownedMaterials,
    input.settings,
    questRewardDays,
  );
  const totalRequiredSanity = finalPlan.totalRequiredSanity;
  const netRequiredSanity = Math.max(totalRequiredSanity - recoverySanity, 0);
  const estimatedDays = findEstimatedDays(input, totalRequiredSanity);

  return {
    totalRequiredSanity,
    recoverySanity,
    netRequiredSanity,
    totalSanity: netRequiredSanity,
    usedToken: finalPlan.usedToken,
    remainingToken: finalPlan.remainingToken,
    dailyTotalSanity,
    estimatedDays,
    stagePlans: finalPlan.stagePlans,
    tokenUses: finalPlan.tokenUses,
    advancedBoxUses: finalPlan.advancedBoxUses,
    shortage: finalPlan.shortage,
  };
}

export function calculateFarming(input: CalculateInput): FarmingCalculationResult;
export function calculateFarming(targets: FarmingTarget[]): FarmingCalculationResult;
export function calculateFarming(
  inputOrTargets: CalculateInput | FarmingTarget[],
): FarmingCalculationResult {
  if (Array.isArray(inputOrTargets)) {
    return calculateFarmingPlan({
      targets: inputOrTargets,
      ownedMaterials: [],
      settings: {
        useDailyQuest: true,
        useWeeklyQuest: true,
        hasMonthlyCard: false,
        dailyOriginiumRefreshCount: 0,
        useToken: false,
        useAllToken: false,
        ownedToken: 0,
        advancedBoxCount: 0,
        recovery: {},
        discounts: [],
      },
    });
  }

  return calculateFarmingPlan(inputOrTargets);
}

import {
  ADVANCED_MATERIALS,
  DAILY_QUEST_REWARDS,
  FARM_STAGES,
  ORIGINIUM_COST_TABLE,
  RECOVERY_ITEMS,
  TOKEN_SHOP_ITEMS,
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

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (isRecord(value)) return Object.entries(value).map(([key, item]) => {
    if (isRecord(item)) return { key, ...item };
    return { key, amount: item };
  });
  return [];
}

function getString(record: UnknownRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
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

function getAdvancedMaterialNames() {
  return toArray(ADVANCED_MATERIALS)
    .map((item) => {
      if (typeof item === "string") return item;
      if (!isRecord(item)) return "";
      return getString(item, ["name", "material", "materialName", "key"]);
    })
    .filter(Boolean);
}

function getDailySanity(settings: FarmingSettings) {
  let sanity = 240;

  if (settings.useDailyQuest) {
    for (const reward of toArray(DAILY_QUEST_REWARDS)) {
      if (!isRecord(reward)) continue;

      const name = getString(reward, ["name", "material", "materialName", "key"]);
      const amount = getNumber(reward, ["amount", "value", "count"]);

      if (name.includes("이성")) {
        sanity += amount;
      }
    }
  }

  if (settings.hasMonthlyCard) {
    sanity += 40;
  }

  const refreshCount = Math.min(
    Math.max(settings.dailyOriginiumRefreshCount ?? 0, 0),
    Array.isArray(ORIGINIUM_COST_TABLE) ? ORIGINIUM_COST_TABLE.length : 10
  );

  sanity += refreshCount * 40;

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
        if (typeof reward === "string") {
          return { name: reward, amount: 1 };
        }

        if (!isRecord(reward)) {
          return { name: "", amount: 0 };
        }

        return {
          name: getString(reward, ["name", "material", "materialName", "key"]),
          amount: getNumber(reward, ["amount", "count", "value", "quantity"], 1),
        };
      })
      .filter((reward) => reward.name && reward.amount > 0);
  }

  if (isRecord(rawRewards)) {
    return Object.entries(rawRewards)
      .map(([name, amount]) => ({
        name,
        amount: toNumber(amount) || 1,
      }))
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

function flattenTokenShopItems() {
  const result: Array<{
    material: string;
    itemName: string;
    amount: number;
    tokenCost: number;
    stock: number;
  }> = [];

  if (Array.isArray(TOKEN_SHOP_ITEMS)) {
    for (const rawItem of TOKEN_SHOP_ITEMS) {
      if (!isRecord(rawItem)) continue;

      result.push({
        material: getString(rawItem, ["material", "materialName", "rewardName", "name"]),
        itemName: getString(rawItem, ["itemName", "label", "name"], "증표 교환"),
        amount: getNumber(rawItem, ["amount", "count", "quantity", "rewardAmount"], 1),
        tokenCost: getNumber(rawItem, ["tokenCost", "cost", "price"], 0),
        stock: getNumber(rawItem, ["stock", "limit", "max"], 9999),
      });
    }

    return result;
  }

  if (isRecord(TOKEN_SHOP_ITEMS)) {
    for (const [materialName, rawValue] of Object.entries(TOKEN_SHOP_ITEMS)) {
      if (Array.isArray(rawValue)) {
        for (const rawItem of rawValue) {
          if (!isRecord(rawItem)) continue;

          result.push({
            material: getString(rawItem, ["material", "materialName", "rewardName"], materialName),
            itemName: getString(rawItem, ["itemName", "label", "name"], materialName),
            amount: getNumber(rawItem, ["amount", "count", "quantity", "rewardAmount"], 1),
            tokenCost: getNumber(rawItem, ["tokenCost", "cost", "price"], 0),
            stock: getNumber(rawItem, ["stock", "limit", "max"], 9999),
          });
        }
      } else if (isRecord(rawValue)) {
        result.push({
          material: getString(rawValue, ["material", "materialName", "rewardName"], materialName),
          itemName: getString(rawValue, ["itemName", "label", "name"], materialName),
          amount: getNumber(rawValue, ["amount", "count", "quantity", "rewardAmount"], 1),
          tokenCost: getNumber(rawValue, ["tokenCost", "cost", "price"], 0),
          stock: getNumber(rawValue, ["stock", "limit", "max"], 9999),
        });
      }
    }
  }

  return result;
}

function buildShortage(targets: MaterialAmount[], ownedMaterials: MaterialAmount[]) {
  const ownedMap = new Map<string, number>();

  for (const item of ownedMaterials) {
    addAmount(ownedMap, item.name, item.amount);
  }

  const shortageMap = new Map<string, number>();

  for (const target of targets) {
    const targetAmount = toNumber(target.amount);
    const ownedAmount = ownedMap.get(target.name) ?? 0;
    const shortage = Math.max(targetAmount - ownedAmount, 0);

    addAmount(shortageMap, target.name, shortage);
  }

  return Array.from(shortageMap.entries()).map(([name, amount]) => ({
    name,
    amount,
  }));
}

function useAdvancedBoxes(shortage: MaterialAmount[], settings: FarmingSettings) {
  const advancedMaterialNames = getAdvancedMaterialNames();
  const advancedBoxUses: AdvancedBoxUse[] = [];
  let remainingPicks = toNumber(settings.advancedBoxCount) * 2;

  const nextShortage = shortage.map((item) => ({ ...item }));

  for (const item of nextShortage) {
    if (remainingPicks <= 0) break;
    if (!advancedMaterialNames.includes(item.name)) continue;

    const gained = Math.min(item.amount, remainingPicks);

    if (gained > 0) {
      advancedBoxUses.push({
        material: item.name,
        boxes: Math.ceil(gained / 2),
        gained,
      });

      item.amount -= gained;
      remainingPicks -= gained;
    }
  }

  return {
    shortage: nextShortage.filter((item) => item.amount > 0),
    advancedBoxUses,
  };
}

function useTokens(shortage: MaterialAmount[], settings: FarmingSettings) {
  const tokenUses: TokenUse[] = [];
  let remainingToken = toNumber(settings.ownedToken);
  let usedToken = 0;

  if (!settings.useToken || remainingToken <= 0) {
    return {
      shortage,
      tokenUses,
      usedToken,
      remainingToken,
    };
  }

  const shopItems = flattenTokenShopItems();
  const nextShortage = shortage.map((item) => ({ ...item }));

  for (const item of nextShortage) {
    if (remainingToken <= 0) break;

    const matchedItems = shopItems.filter((shopItem) => shopItem.material === item.name);

    for (const shopItem of matchedItems) {
      if (remainingToken <= 0 || item.amount <= 0) break;
      if (shopItem.tokenCost <= 0 || shopItem.amount <= 0) continue;

      const maxCount = settings.useAllToken ? 999999 : shopItem.stock;
      const needCount = Math.ceil(item.amount / shopItem.amount);
      const affordableCount = Math.floor(remainingToken / shopItem.tokenCost);
      const count = Math.min(needCount, affordableCount, maxCount);

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

      item.amount = Math.max(item.amount - gained, 0);
      remainingToken -= tokenCost;
      usedToken += tokenCost;
    }
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

export function calculateFarmingPlan(input: CalculateInput): FarmingCalculationResult {
  const baseShortage = buildShortage(input.targets, input.ownedMaterials);
  const boxResult = useAdvancedBoxes(baseShortage, input.settings);
  const tokenResult = useTokens(boxResult.shortage, input.settings);
  const stagePlans = buildStagePlans(tokenResult.shortage);

  const totalRequiredSanity = stagePlans.reduce(
    (sum, plan) => sum + plan.sanity,
    0
  );

  const dailyTotalSanity = getDailySanity(input.settings);
  const recoverySanity = getRecoverySanity(input.settings);
  const availableFirstDaySanity = dailyTotalSanity + recoverySanity;

  const estimatedDays =
    totalRequiredSanity <= 0
      ? 0
      : availableFirstDaySanity <= 0
        ? 0
        : Math.max(1, Math.ceil(totalRequiredSanity / availableFirstDaySanity));

  return {
    totalRequiredSanity,
    totalSanity: totalRequiredSanity,
    usedToken: tokenResult.usedToken,
    remainingToken: tokenResult.remainingToken,
    dailyTotalSanity,
    estimatedDays,
    stagePlans,
    tokenUses: tokenResult.tokenUses,
    advancedBoxUses: boxResult.advancedBoxUses,
    shortage: tokenResult.shortage,
  };
}

export function calculateFarming(input: CalculateInput): FarmingCalculationResult;
export function calculateFarming(targets: FarmingTarget[]): FarmingCalculationResult;
export function calculateFarming(
  inputOrTargets: CalculateInput | FarmingTarget[]
): FarmingCalculationResult {
  if (Array.isArray(inputOrTargets)) {
    return calculateFarmingPlan({
      targets: inputOrTargets,
      ownedMaterials: [],
      settings: {
        useDailyQuest: true,
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
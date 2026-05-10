import {
  farmStages,
  type FarmStage,
} from "@/data/farming/farm-stages";

export type FarmingTarget = {
  material: string;
  amount: number;
};

export type FarmingResultItem = {
  material: string;
  amount: number;
  stage: FarmStage | null;
  runs: number;
  sanity: number;
};

export type FarmingCalculationResult = {
  totalSanity: number;
  items: FarmingResultItem[];
};

function findBestStage(materialName: string) {
  return farmStages
    .filter(
      (stage) =>
        stage.material === materialName &&
        stage.costType === "sanity"
    )
    .sort((a, b) => {
      const aEfficiency = a.amount / a.cost;
      const bEfficiency = b.amount / b.cost;

      return bEfficiency - aEfficiency;
    })[0] ?? null;
}

export function calculateFarming(
  targets: FarmingTarget[]
): FarmingCalculationResult {
  let totalSanity = 0;

  const items: FarmingResultItem[] = targets.map((target) => {
    const material = String(target.material ?? "").trim();
    const amount = Math.max(0, Number(target.amount ?? 0));

    const stage = findBestStage(material);

    if (!stage || amount <= 0) {
      return {
        material,
        amount,
        stage: null,
        runs: 0,
        sanity: 0,
      };
    }

    const runs = Math.ceil(amount / stage.amount);
    const sanity = runs * stage.cost;

    totalSanity += sanity;

    return {
      material,
      amount,
      stage,
      runs,
      sanity,
    };
  });

  return {
    totalSanity,
    items,
  };
}
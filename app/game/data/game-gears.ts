import { gearSummaries } from "@/data/gear-summary-data";

import type { GearLoadout, GearSlot, RunGear, RunGearCategory, RunGearLevel } from "../types/game";

const GAME_GEAR_LEVELS = [10, 20, 28, 36, 50] as const;

const GAME_SET_EFFECTS: Record<string, string> = {
  개척: "3세트: 전투 시작 시 SP +1, 배틀스킬 피해가 증가합니다.",
  "응룡 50식": "3세트: 연계스킬 피해가 증가하고 방어 불능 대상에게 추가 피해를 줍니다.",
  "본 크러셔": "3세트: 강력한 일격과 방어 불능 대상 피해가 증가합니다.",
  "조류의 물결": "3세트: 전기/냉기 피해가 증가하고 감전 대상 피해가 증가합니다.",
  청파: "3세트: 궁극기 충전 효율과 궁극기 피해가 증가합니다.",
  "열 작업용": "3세트: 열기/자연 피해가 증가하고 상태 이상 대상 피해가 증가합니다.",
  "생체 보조": "3세트: 회복량과 최대 HP가 증가합니다.",
  검술사: "3세트: 기본공격과 물리 피해가 증가합니다.",
  펄스식: "3세트: 기본공격 후 궁극기 충전량이 증가합니다.",
};

function isGameGearLevel(level: number): level is RunGearLevel {
  return GAME_GEAR_LEVELS.includes(level as RunGearLevel);
}

export function hasGameSetEffect(setName: string) {
  return Boolean(GAME_SET_EFFECTS[setName]);
}

export function getGameSetEffectDescription(setName: string) {
  return GAME_SET_EFFECTS[setName] ?? "세트 효과 없음";
}

function toCombatDescription(attributeLabel: string, level: RunGearLevel, hasSetEffect: boolean) {
  const levelBonus = {
    10: hasSetEffect ? "소폭" : "높게",
    20: hasSetEffect ? "일정량" : "높게",
    28: hasSetEffect ? "중간" : "크게",
    36: hasSetEffect ? "높은" : "크게",
    50: hasSetEffect ? "큰" : "매우 크게",
  }[level];
  const suffix = hasSetEffect ? "" : " 세트 효과가 없는 대신 개별 성능이 더 높습니다.";

  if (attributeLabel.includes("연계")) return `연계 스킬 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("배틀")) return `배틀 스킬 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("궁극기 피해")) return `궁극기 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("궁극기 충전")) return `궁극기 충전 효율이 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("일반")) return `기본공격 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("물리")) return `물리 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("냉기") || attributeLabel.includes("전기")) return `냉기/전기 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("열기") || attributeLabel.includes("자연")) return `열기/자연 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("불균형")) return `방어 불능 대상에게 주는 피해가 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("치명")) return `강력한 일격 확률이 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("치유")) return `회복량이 ${levelBonus} 증가합니다.${suffix}`;
  if (attributeLabel.includes("피해 감소")) return `받는 피해가 ${levelBonus} 감소합니다.${suffix}`;
  if (attributeLabel.includes("모든 스킬")) return `모든 스킬 피해가 ${levelBonus} 증가합니다.${suffix}`;
  return `${attributeLabel} 효과가 ${levelBonus} 증가합니다.${suffix}`;
}

function toRunGear(gear: (typeof gearSummaries)[number]): RunGear | null {
  if (!isGameGearLevel(gear.level)) return null;
  if (gear.category !== "armor" && gear.category !== "gloves" && gear.category !== "kit") return null;

  const setEnabled = hasGameSetEffect(gear.setName);

  return {
    slug: gear.slug,
    name: gear.name,
    enName: gear.enName,
    category: gear.category as RunGearCategory,
    level: gear.level,
    quality: gear.quality,
    setName: gear.setName,
    image: gear.image,
    abilityTypes: gear.abilityTypes,
    attributeTypes: gear.attributeTypes,
    attributeLabel: gear.attributeLabel,
    combatDescription: toCombatDescription(gear.attributeLabel, gear.level, setEnabled),
  };
}

export const gameGears: RunGear[] = gearSummaries
  .map(toRunGear)
  .filter((gear): gear is RunGear => Boolean(gear));

export function getGameGear(slug: string) {
  const gear = gameGears.find((item) => item.slug === slug);
  if (!gear) throw new Error(`Unknown game gear: ${slug}`);
  return gear;
}

export function getGearSlot(gear: RunGear, currentKit1?: RunGear, currentKit2?: RunGear): GearSlot {
  if (gear.category === "armor") return "armor";
  if (gear.category === "gloves") return "gloves";
  if (!currentKit1) return "kit1";
  if (!currentKit2) return "kit2";
  return "kit1";
}

export function chooseGearRewards(battlesWon: number, count = 3) {
  const setPool = gameGears.filter((gear) => hasGameSetEffect(gear.setName));
  const noSetPool = gameGears.filter((gear) => !hasGameSetEffect(gear.setName));
  const pool = setPool.length >= count ? setPool : gameGears;

  if (pool.length <= count) return pool.map((gear) => gear.slug);

  const start = (battlesWon * 5) % pool.length;
  const rewards = Array.from({ length: count }, (_, index) => pool[(start + index * 7) % pool.length]);

  if (noSetPool.length > 0 && battlesWon % 3 === 0) {
    rewards[count - 1] = noSetPool[(battlesWon * 3) % noSetPool.length];
  }

  return rewards.map((gear) => gear.slug);
}

export function getEquippedGears(loadout: GearLoadout) {
  return [loadout.armor, loadout.gloves, loadout.kit1, loadout.kit2].filter(
    (gear): gear is RunGear => Boolean(gear),
  );
}

export function getActiveThreePieceSets(loadout: GearLoadout) {
  const counts = getEquippedGears(loadout).reduce<Record<string, number>>((acc, gear) => {
    acc[gear.setName] = (acc[gear.setName] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .filter(([setName, count]) => count >= 3 && hasGameSetEffect(setName))
    .map(([setName]) => setName);
}

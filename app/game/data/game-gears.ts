import { gearSummaries } from "@/data/gear-summary-data";

import type { GearSlot, RunGear, RunGearCategory, RunGearLevel } from "../types/game";

const GAME_GEAR_LEVELS = [10, 20, 28, 36, 50] as const;

function isGameGearLevel(level: number): level is RunGearLevel {
  return GAME_GEAR_LEVELS.includes(level as RunGearLevel);
}

function toCombatDescription(attributeLabel: string, level: RunGearLevel) {
  const levelBonus = {
    10: "소폭",
    20: "일정량",
    28: "중간",
    36: "높은",
    50: "큰",
  }[level];

  if (attributeLabel.includes("연계")) return `연계 스킬 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("배틀")) return `배틀 스킬 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("궁극기 피해")) return `궁극기 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("궁극기 충전")) return `궁극기 충전 효율이 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("일반")) return `기본공격 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("물리")) return `물리 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("냉기") || attributeLabel.includes("전기")) return `냉기/전기 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("열기") || attributeLabel.includes("자연")) return `열기/자연 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("불균형")) return `방어 불능 대상에게 주는 피해가 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("치명")) return `강력한 일격 확률이 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("치유")) return `회복량이 ${levelBonus} 증가합니다.`;
  if (attributeLabel.includes("피해 감소")) return `받는 피해가 ${levelBonus} 감소합니다.`;
  if (attributeLabel.includes("모든 스킬")) return `모든 스킬 피해가 ${levelBonus} 증가합니다.`;
  return `${attributeLabel} 효과가 ${levelBonus} 증가합니다.`;
}

function toRunGear(gear: (typeof gearSummaries)[number]): RunGear | null {
  if (!isGameGearLevel(gear.level)) return null;
  if (gear.category !== "armor" && gear.category !== "gloves" && gear.category !== "kit") return null;

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
    combatDescription: toCombatDescription(gear.attributeLabel, gear.level),
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
  const pool = gameGears;
  if (pool.length <= count) return pool.map((gear) => gear.slug);

  const start = (battlesWon * 5) % pool.length;
  return Array.from({ length: count }, (_, index) => pool[(start + index * 7) % pool.length].slug);
}

export function getEquippedGears(loadout: { armor?: RunGear; gloves?: RunGear; kit1?: RunGear; kit2?: RunGear }) {
  return [loadout.armor, loadout.gloves, loadout.kit1, loadout.kit2].filter(
    (gear): gear is RunGear => Boolean(gear),
  );
}

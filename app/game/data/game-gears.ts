import { gearSummaries } from "@/data/gear-summary-data";

import type { Element, GearLoadout, GearSlot, RewardTier, RunGear, RunGearCategory, RunGearLevel } from "../types/game";

const GAME_GEAR_LEVELS = [10, 20, 28, 36, 50] as const;

const GAME_SET_EFFECTS: Record<string, string> = {
  개척: "3세트: 전투 시작 시 SP +1, 배틀스킬 피해 증가",
  "응룡 50식": "3세트: 연계스킬 피해 증가, 방어 불능 대상 추가 피해",
  "본 크러셔": "3세트: 강력한 일격 확률 증가, 방어 불능 대상 피해 증가",
  "조류의 물결": "3세트: 전기/냉기 피해 증가, 감전 대상 피해 증가",
  청파: "3세트: 궁극기 충전 효율 증가, 궁극기 피해 증가",
  "열 작업용": "3세트: 열기/자연 피해 증가, 상태 이상 대상 피해 증가",
  "생체 보조": "3세트: 회복량 증가, 최대 체력 증가",
  검술사: "3세트: 기본공격 피해 증가, 물리 피해 증가",
  펄스식: "3세트: 기본공격 후 궁극기 충전량 증가",
  "아부레이의 메아리": "3세트: 모든 스킬 피해 증가, 궁극기 충전 효율 증가",
};

const REWARD_LEVEL_TABLE: Record<RewardTier, RunGearLevel[]> = {
  early: [10, 20],
  mid: [20, 28],
  late: [28, 36],
  elite: [28, 36],
  boss: [36, 50],
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

export function getGearPowerTier(gear: Pick<RunGear, "level" | "quality" | "setName">) {
  const levelTier = gear.level === 10 ? 1 : gear.level === 20 ? 2 : gear.level === 28 ? 3 : gear.level === 36 ? 4 : 5;
  const qualityTier = Math.max(1, Math.min(5, gear.quality));
  const sameLevelQualityNoSetBonus = hasGameSetEffect(gear.setName) ? 0 : 1;

  return levelTier + qualityTier - 1 + sameLevelQualityNoSetBonus;
}

export function getGearSellValue(gear: RunGear) {
  return getGearPowerTier(gear) * 12 + gear.quality * 8;
}

export type GearStatDeltas = {
  attack?: number;
  maxHp?: number;
  defense?: number;
  evasion?: number;
  speed?: number;
  battleSkillPower?: number;
  linkSkillPower?: number;
  ultimatePower?: number;
  ultimateCharge?: number;
};

function addDelta(target: GearStatDeltas, delta: GearStatDeltas) {
  Object.entries(delta).forEach(([key, value]) => {
    const stat = key as keyof GearStatDeltas;
    target[stat] = (target[stat] ?? 0) + (value ?? 0);
  });
}

function matchesElementalAttribute(types: string[], element?: Element) {
  if (types.includes("physicalDamage")) return element === "physical";
  if (types.includes("cryoElectricDamage")) return element === "cryo" || element === "electric";
  if (types.includes("heatNatureDamage")) return element === "heat" || element === "nature";
  return true;
}

export function getGearStatDeltas(gear: RunGear, element?: Element): GearStatDeltas {
  const value = getGearPowerTier(gear);
  const deltas: GearStatDeltas = {};

  if (gear.category === "armor") addDelta(deltas, { defense: value });
  if (gear.category === "gloves") addDelta(deltas, { attack: value });
  if (gear.category === "kit") addDelta(deltas, { speed: 1 });

  gear.attributeTypes.forEach((type) => {
    if (type === "attack") addDelta(deltas, { attack: value * 2, battleSkillPower: value, linkSkillPower: value, ultimatePower: value });
    if (type === "hp") addDelta(deltas, { maxHp: value * 7 });
    if (type === "critRate") addDelta(deltas, { attack: value, linkSkillPower: value, evasion: 1 });
    if (type === "originiumArts" || type === "artsDamage") {
      addDelta(deltas, { battleSkillPower: value * 2, linkSkillPower: value, ultimatePower: value * 2 });
    }
    if (type === "healEfficiency") addDelta(deltas, { maxHp: value * 4, defense: value });
    if (type === "ultimateEfficiency") addDelta(deltas, { ultimateCharge: value * 5, ultimatePower: value });
    if (type === "normalAttack") addDelta(deltas, { attack: value * 3 });
    if (type === "skillDamage") addDelta(deltas, { battleSkillPower: value * 3 });
    if (type === "comboSkillDamage") addDelta(deltas, { linkSkillPower: value * 3 });
    if (type === "ultimateDamage") addDelta(deltas, { ultimatePower: value * 4 });
    if (type === "unbalancedTargetDamage") addDelta(deltas, { attack: value, linkSkillPower: value * 2 });
    if (type === "mainStat") {
      if (gear.category === "armor") addDelta(deltas, { maxHp: value * 5, defense: value });
      if (gear.category === "gloves") addDelta(deltas, { attack: value * 2 });
      if (gear.category === "kit") addDelta(deltas, { battleSkillPower: value, linkSkillPower: value, ultimatePower: value });
    }
    if (type === "damageReduction") addDelta(deltas, { defense: value * 3, evasion: 1 });
    if (type === "subStat") addDelta(deltas, { attack: value, maxHp: value * 2, speed: 1 });
    if (type === "allSkillDamage") {
      addDelta(deltas, { battleSkillPower: value * 2, linkSkillPower: value * 2, ultimatePower: value * 2 });
    }
    if (
      (type === "physicalDamage" || type === "cryoElectricDamage" || type === "heatNatureDamage") &&
      matchesElementalAttribute([type], element)
    ) {
      addDelta(deltas, { attack: value, battleSkillPower: value * 2, linkSkillPower: value, ultimatePower: value });
    }
  });

  return deltas;
}

export function getGearPrimaryStatLine(gear: RunGear) {
  const value = getGearPowerTier(gear);
  const type = gear.attributeTypes[0];

  if (type === "attack") return `공격력 +${value * 2}`;
  if (type === "hp") return `생명력 +${value * 7}`;
  if (type === "critRate") return `치명 정밀 +${value}%`;
  if (type === "originiumArts" || type === "artsDamage") return `아츠 출력 +${value * 2}`;
  if (type === "healEfficiency") return `회복 효율 +${value * 2}%`;
  if (type === "physicalDamage") return `물리 피해 +${value * 2}`;
  if (type === "ultimateEfficiency") return `궁극기 충전 +${value * 5}%`;
  if (type === "normalAttack") return `기본공격 피해 +${value * 3}`;
  if (type === "skillDamage") return `배틀스킬 피해 +${value * 3}`;
  if (type === "comboSkillDamage") return `연계스킬 피해 +${value * 3}`;
  if (type === "ultimateDamage") return `궁극기 피해 +${value * 4}`;
  if (type === "unbalancedTargetDamage") return `방어 불능 피해 +${value * 3}`;
  if (type === "mainStat") return `주 능력치 +${value * 3}`;
  if (type === "cryoElectricDamage") return `냉기/전기 피해 +${value * 2}`;
  if (type === "damageReduction") return `피해 감소 +${value * 3}`;
  if (type === "subStat") return `보조 능력치 +${value * 2}`;
  if (type === "allSkillDamage") return `스킬 피해 +${value * 2}`;
  if (type === "heatNatureDamage") return `열기/자연 피해 +${value * 2}`;

  if (gear.category === "armor") return `방어력 +${value}`;
  if (gear.category === "gloves") return `공격력 +${value}`;
  return `속도 +1`;
}

function toCombatDescription(attributeLabel: string, level: RunGearLevel, quality: number, hasSetEffect: boolean) {
  const grade = `Lv.${level} / ${quality}등급`;
  const balanceNote = hasSetEffect
    ? "3세트 완성 시 추가 효과가 발동합니다."
    : "세트 효과는 없지만 같은 레벨·등급 기준 개별 성능이 더 높습니다.";

  return `${grade} · ${attributeLabel}. ${balanceNote}`;
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
    combatDescription: toCombatDescription(gear.attributeLabel, gear.level, gear.quality, setEnabled),
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

function getRewardPool(tier: RewardTier) {
  const allowedLevels = REWARD_LEVEL_TABLE[tier];
  const pool = gameGears.filter((gear) => allowedLevels.includes(gear.level));
  return pool.length > 0 ? pool : gameGears.filter((gear) => gear.level !== 50);
}

export function chooseGearRewards(battlesWon: number, count = 3, tier: RewardTier = "early") {
  const tierPool = getRewardPool(tier);
  const setPool = tierPool.filter((gear) => hasGameSetEffect(gear.setName));
  const noSetPool = tierPool.filter((gear) => !hasGameSetEffect(gear.setName));
  const pool = setPool.length >= count ? setPool : tierPool;

  if (pool.length <= count) return pool.map((gear) => gear.slug);

  const tierSeed = tier === "early" ? 1 : tier === "mid" ? 2 : tier === "late" ? 3 : tier === "elite" ? 4 : 5;
  const start = (battlesWon * 5 + tierSeed * 11) % pool.length;
  const rewards = Array.from({ length: count }, (_, index) => pool[(start + index * 7) % pool.length]);

  if (noSetPool.length > 0 && battlesWon % 3 === 0) {
    rewards[count - 1] = noSetPool[(battlesWon * 3 + tierSeed) % noSetPool.length];
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

import { gearSummaries } from "@/data/gear-summary-data";

import type { Element, GearLoadout, GearSlot, RewardTier, RunGear, RunGearCategory, RunGearLevel, SkillKind } from "../types/game";

const GAME_GEAR_LEVELS = [10, 20, 28, 36, 50] as const;

// ===== 세트 효과(2부위 발동, 데이터 기반, 전 세트 등록) =====
// 모든 효과는 useRunState 전투 로직이 이 테이블을 읽어 적용(아츠 부착·취약·불균형·처형·치명).
export type SetEffect =
  | { type: "dmgVs"; cond: "broken" | "vulnerable" | "arts"; pct: number } // 조건부 받피증
  | { type: "kindDmg"; kind: SkillKind | "all"; pct: number } // 카드 종류별 피해 증가
  | { type: "elementDmg"; element: Element | "all"; pct: number } // 원소 피해 증가
  | { type: "critRate"; v: number }
  | { type: "critDmg"; v: number }
  | { type: "startShield"; v: number } // 전투 시작 보호막(장착 오퍼)
  | { type: "startHeal"; v: number } // 전투 시작 회복(장착 오퍼)
  | { type: "startEnergy"; v: number } // 전투 시작 에너지(파티 공유)
  | { type: "breakEnergy" } // 불균형 돌파 시 에너지 +1
  | { type: "stagger"; pct: number }; // 불균형 누적 증가

// 밸런스 기준: 2부위 세트 1투자 = 강력한 조건부 1개(15~25%) 또는 중간 효과 2개. 시작 효과는 디펜더/서포터용.
const SET_EFFECTS: Record<string, SetEffect[]> = {
  // ===== Lv70 세트(위키 3.1 캐논 효과 반영) =====
  "고검의 잔향": [{ type: "dmgVs", cond: "broken", pct: 0.18 }, { type: "dmgVs", cond: "vulnerable", pct: 0.12 }], // 강타·갑옷파괴 물리 DPS
  "식양의 흐름": [{ type: "elementDmg", element: "electric", pct: 0.16 }, { type: "elementDmg", element: "nature", pct: 0.16 }], // 감전·부식 소모
  "청파": [{ type: "kindDmg", kind: "link-skill", pct: 0.2 }, { type: "kindDmg", kind: "all", pct: 0.05 }], // 연계 스킬 특화
  "식양의 숨결": [{ type: "startShield", v: 16 }, { type: "startHeal", v: 12 }], // 생명력·팀 지원
  "조류의 물결": [{ type: "dmgVs", cond: "arts", pct: 0.2 }, { type: "kindDmg", kind: "all", pct: 0.08 }], // 아츠 부착 2스택
  "응룡 50식": [{ type: "kindDmg", kind: "link-skill", pct: 0.2 }, { type: "kindDmg", kind: "battle-skill", pct: 0.1 }], // 팀 배틀→연계 보조
  "M. I. 경찰용": [{ type: "critRate", v: 0.06 }, { type: "critDmg", v: 0.2 }], // 치명타 스택
  "열 작업용": [{ type: "elementDmg", element: "heat", pct: 0.2 }, { type: "elementDmg", element: "nature", pct: 0.2 }], // 연소/부식
  "개척": [{ type: "kindDmg", kind: "all", pct: 0.1 }, { type: "startEnergy", v: 1 }], // 게이지 회복→팀 피해
  "펄스식": [{ type: "elementDmg", element: "electric", pct: 0.2 }, { type: "elementDmg", element: "cryo", pct: 0.2 }], // 감전/동결
  "본 크러셔": [{ type: "kindDmg", kind: "battle-skill", pct: 0.25 }, { type: "dmgVs", cond: "broken", pct: 0.1 }], // 연계→배틀 강화
  "경량 초자연": [{ type: "dmgVs", cond: "broken", pct: 0.16 }, { type: "dmgVs", cond: "vulnerable", pct: 0.08 }], // 방어불능 물리
  "생체 보조": [{ type: "startHeal", v: 18 }, { type: "startShield", v: 8 }], // 치유·받피감
  "검술사": [{ type: "stagger", pct: 0.2 }, { type: "dmgVs", cond: "vulnerable", pct: 0.15 }], // 불균형 효율·물리이상
  // ===== Lv50 세트 =====
  "재앙 방호": [{ type: "startEnergy", v: 1 }, { type: "breakEnergy" }], // 궁극 충전·게이지 반환
  "아부레이의 메아리": [{ type: "kindDmg", kind: "all", pct: 0.22 }], // 모든 스킬 피해
  // ===== Lv36~50 세트 =====
  "침식 방호": [{ type: "startHeal", v: 16 }, { type: "startShield", v: 10 }], // 저체력 시 치유 강화
  "침식 차단": [{ type: "dmgVs", cond: "arts", pct: 0.18 }], // 고체력 시 아츠 강화
  // ===== Lv28/기타(위키 미수록, 게임 자체 세트) =====
  "순행 전달자": [{ type: "startEnergy", v: 1 }, { type: "breakEnergy" }],
  "중장갑 전달자": [{ type: "startShield", v: 12 }, { type: "kindDmg", kind: "attack", pct: 0.18 }],
  "통합 경량형 모델": [{ type: "kindDmg", kind: "link-skill", pct: 0.25 }, { type: "dmgVs", cond: "arts", pct: 0.1 }],
  "통합 중량형 모델": [{ type: "kindDmg", kind: "battle-skill", pct: 0.25 }, { type: "dmgVs", cond: "vulnerable", pct: 0.12 }],
};

const ELEMENT_KO: Record<Element | "all", string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연", all: "전 속성" };
const KIND_KO: Record<SkillKind | "all", string> = { attack: "기본공격", "battle-skill": "배틀스킬", "link-skill": "연계스킬", ultimate: "궁극기", all: "모든 스킬" };
function effectText(e: SetEffect): string {
  switch (e.type) {
    case "dmgVs": return `${e.cond === "broken" ? "불균형" : e.cond === "vulnerable" ? "취약" : "아츠 부착"} 적 피해 +${Math.round(e.pct * 100)}%`;
    case "kindDmg": return `${KIND_KO[e.kind]} 피해 +${Math.round(e.pct * 100)}%`;
    case "elementDmg": return `${ELEMENT_KO[e.element]} 피해 +${Math.round(e.pct * 100)}%`;
    case "critRate": return `치명타 확률 +${Math.round(e.v * 100)}%`;
    case "critDmg": return `치명타 피해 +${Math.round(e.v * 100)}%`;
    case "startShield": return `전투 시작 보호막 +${e.v}`;
    case "startHeal": return `전투 시작 회복 +${e.v}`;
    case "startEnergy": return `전투 시작 에너지 +${e.v}`;
    case "breakEnergy": return "불균형 돌파 시 에너지 +1";
    case "stagger": return `불균형 누적 +${Math.round(e.pct * 100)}%`;
  }
}

export function getSetEffects(setName: string): SetEffect[] {
  return SET_EFFECTS[setName] ?? [];
}

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
  return Boolean(SET_EFFECTS[setName]);
}

export function getGameSetEffectDescription(setName: string) {
  const effects = SET_EFFECTS[setName];
  return effects ? `2세트: ${effects.map(effectText).join(" · ")}` : "세트 효과 없음";
}

export function getGearPowerTier(gear: Pick<RunGear, "level" | "quality" | "setName">) {
  const levelTier = gear.level === 10 ? 1 : gear.level === 20 ? 2 : gear.level === 28 ? 3 : gear.level === 36 ? 4 : 5;
  const qualityTier = Math.max(1, Math.min(5, gear.quality));
  const sameLevelQualityNoSetBonus = hasGameSetEffect(gear.setName) ? 0 : 1;

  return levelTier + qualityTier - 1 + sameLevelQualityNoSetBonus;
}

// 게임용 축약 수치(gv 1~5): 실제 장비의 레벨·등급을 한 자리 수 한 칸 단위로 압축.
// 오퍼레이터 기본 스탯(공격 8~12 / HP 56~90 / 스킬 15~45)에 비례하도록 조각당 보너스를 소형으로 유지.
function getGearValue(gear: Pick<RunGear, "level" | "quality" | "setName">) {
  const levelTier = gear.level === 10 ? 1 : gear.level === 20 ? 2 : gear.level === 28 ? 3 : gear.level === 36 ? 4 : 5;
  const qualityTier = Math.max(1, Math.min(5, gear.quality));
  return Math.max(1, Math.min(5, Math.round((levelTier + qualityTier) / 2)));
}

export function getGearSellValue(gear: RunGear) {
  return getGearPowerTier(gear) * 12 + gear.quality * 8;
}

// 상점 구매가: 판매가보다 높게(자원 경제 성립). 전투 2~3회분 크레딧으로 한 조각.
export function getGearBuyValue(gear: RunGear) {
  return getGearPowerTier(gear) * 20 + gear.quality * 14 + (hasGameSetEffect(gear.setName) ? 20 : 0);
}

// 카드 덱빌더 기준 스탯. ATB가 사라져 speed/ultimateCharge는 폐기, 카드 전투의 핵심 레버인
// 치명타(critRate/critDamage)를 장비 스탯으로 편입했다.
export type GearStatDeltas = {
  attack?: number; // 기본공격 카드 위력
  maxHp?: number;
  defense?: number;
  evasion?: number;
  battleSkillPower?: number; // 배틀 카드 위력
  linkSkillPower?: number; // 연계 카드 위력
  ultimatePower?: number; // 궁극 카드 위력
  critRate?: number; // 치명타 확률(0~1 가산)
  critDamage?: number; // 치명타 피해(가산 배율)
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
  // 축약된 gv(1~5) 기준. 카드 위력(공격/배틀/연계/궁극)·생존(HP/방어/회피)·치명타에 매핑한다.
  // 치명타는 0~1 단위라 소형(value*0.01~0.03)으로 환산한다.
  const value = getGearValue(gear);
  const deltas: GearStatDeltas = {};

  if (gear.category === "armor") addDelta(deltas, { defense: value }); // 방어구 = 전열
  if (gear.category === "gloves") addDelta(deltas, { attack: value }); // 장갑 = 화력
  if (gear.category === "kit") addDelta(deltas, { critRate: value * 0.01 }); // 키트 = 정밀 장치(치명)

  gear.attributeTypes.forEach((type) => {
    if (type === "attack") addDelta(deltas, { attack: value * 2, battleSkillPower: value, linkSkillPower: value, ultimatePower: value });
    if (type === "hp") addDelta(deltas, { maxHp: value * 4 });
    if (type === "critRate") addDelta(deltas, { critRate: value * 0.02, critDamage: value * 0.02 });
    if (type === "originiumArts" || type === "artsDamage") {
      addDelta(deltas, { battleSkillPower: value, linkSkillPower: value, ultimatePower: value });
    }
    if (type === "healEfficiency") addDelta(deltas, { maxHp: value * 3, defense: value });
    // 궁극 효율: 충전(에너지) 개념이 사라져 궁극 카드 위력 + 치명 피해로 환산.
    if (type === "ultimateEfficiency") addDelta(deltas, { ultimatePower: value * 2, critDamage: value * 0.02 });
    if (type === "normalAttack") addDelta(deltas, { attack: value * 2 });
    if (type === "skillDamage") addDelta(deltas, { battleSkillPower: value * 2 });
    if (type === "comboSkillDamage") addDelta(deltas, { linkSkillPower: value * 2 });
    if (type === "ultimateDamage") addDelta(deltas, { ultimatePower: value * 2 });
    // 방어 불능(불균형) 특화: 연계 콤보(불균형 강타) 강화 + 치명 피해.
    if (type === "unbalancedTargetDamage") addDelta(deltas, { linkSkillPower: value, critDamage: value * 0.03 });
    if (type === "mainStat") {
      if (gear.category === "armor") addDelta(deltas, { maxHp: value * 3, defense: value });
      if (gear.category === "gloves") addDelta(deltas, { attack: value * 2 });
      if (gear.category === "kit") addDelta(deltas, { battleSkillPower: value, linkSkillPower: value, ultimatePower: value });
    }
    if (type === "damageReduction") addDelta(deltas, { defense: value * 2, evasion: 1 });
    if (type === "subStat") addDelta(deltas, { attack: value, maxHp: value * 2, critRate: value * 0.01 });
    if (type === "allSkillDamage") {
      addDelta(deltas, { battleSkillPower: value, linkSkillPower: value, ultimatePower: value });
    }
    if (
      (type === "physicalDamage" || type === "cryoElectricDamage" || type === "heatNatureDamage") &&
      matchesElementalAttribute([type], element)
    ) {
      addDelta(deltas, { attack: value, battleSkillPower: value, linkSkillPower: value, ultimatePower: value });
    }
  });

  return deltas;
}

export function getGearPrimaryStatLine(gear: RunGear) {
  const value = getGearValue(gear);
  const type = gear.attributeTypes[0];

  if (type === "attack") return `공격력 +${value * 2}`;
  if (type === "hp") return `생명력 +${value * 4}`;
  if (type === "critRate") return `치명타 확률 +${value * 2}%`;
  if (type === "originiumArts" || type === "artsDamage") return `아츠 출력 +${value}`;
  if (type === "healEfficiency") return `회복/체력 +${value * 3}`;
  if (type === "physicalDamage") return `물리 피해 +${value}`;
  if (type === "ultimateEfficiency") return `궁극기 출력 +${value * 2}`;
  if (type === "normalAttack") return `기본공격 피해 +${value * 2}`;
  if (type === "skillDamage") return `배틀스킬 피해 +${value * 2}`;
  if (type === "comboSkillDamage") return `연계스킬 피해 +${value * 2}`;
  if (type === "ultimateDamage") return `궁극기 피해 +${value * 2}`;
  if (type === "unbalancedTargetDamage") return `연계 콤보·치명 피해 +${value}`;
  if (type === "mainStat") return `주 능력치 +${value * 2}`;
  if (type === "cryoElectricDamage") return `냉기/전기 피해 +${value}`;
  if (type === "damageReduction") return `피해 감소 +${value * 2}`;
  if (type === "subStat") return `보조 능력치 +${value * 2}`;
  if (type === "allSkillDamage") return `스킬 피해 +${value}`;
  if (type === "heatNatureDamage") return `열기/자연 피해 +${value}`;

  if (gear.category === "armor") return `방어력 +${value}`;
  if (gear.category === "gloves") return `공격력 +${value}`;
  return `치명타 확률 +${value}%`;
}

function toCombatDescription(attributeLabel: string, level: RunGearLevel, quality: number, hasSetEffect: boolean) {
  const grade = `Lv.${level} / ${quality}등급`;
  const balanceNote = hasSetEffect
    ? "같은 세트 2부위 장착 시 세트 효과가 발동합니다."
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

export function getGearSlot(gear: RunGear): GearSlot {
  if (gear.category === "armor") return "armor";
  if (gear.category === "gloves") return "gloves";
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
  return [loadout.armor, loadout.gloves, loadout.kit1].filter(
    (gear): gear is RunGear => Boolean(gear),
  );
}

// 세트 효과: 같은 세트 2부위 이상 장착 시 발동(3슬롯 = 방어구/장갑/부품1).
export function getActiveSets(loadout: GearLoadout) {
  const counts = getEquippedGears(loadout).reduce<Record<string, number>>((acc, gear) => {
    acc[gear.setName] = (acc[gear.setName] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .filter(([setName, count]) => count >= 2 && hasGameSetEffect(setName))
    .map(([setName]) => setName);
}

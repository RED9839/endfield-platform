"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";

import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import { gearDetails } from "@/data/gear-detail-data";
import type { GearDetail } from "@/data/gear-types";

import PickerShell from "@/app/components/select/PickerShell";
import SelectFilterButton from "@/app/components/select/FilterButton";
import SelectFilterGroup from "@/app/components/select/FilterGroup";
import OperatorSelectCard from "@/app/components/select/OperatorSelectCard";
import WeaponSelectCard from "@/app/components/select/WeaponSelectCard";
import GearSelectCard from "@/app/components/select/GearSelectCard";

type OperatorDetail = (typeof operatorDetails)[number];
type WeaponDetail = (typeof weaponDetails)[number];

type SkillLevel =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "M1"
  | "M2"
  | "M3";

type GearLevelKey = "base" | "level1" | "level2" | "level3";
type GearSlot = "armor" | "gloves" | "kit1" | "kit2";

type PickerState =
  | { kind: "operator"; title: string }
  | { kind: "weapon"; title: string }
  | { kind: "gear"; slot: GearSlot; title: string };

type GearSlotLevels = {
  ability1: GearLevelKey;
  ability2: GearLevelKey;
  attribute: GearLevelKey;
};

type FormState = {
  operatorSlug: string;
  operatorLevel: number;
  operatorBreakthroughRank: string;
  operatorTrustStage: string;

  normalLevel: SkillLevel;
  battleLevel: SkillLevel;
  comboLevel: SkillLevel;
  ultimateLevel: SkillLevel;

  weaponSlug: string;
  weaponLevel: number;
  weaponAbilityRank: string;
  weaponAttributeRank: string;
  weaponSeriesRank: string;

  armorSlug: string;
  armorLevels: GearSlotLevels;

  glovesSlug: string;
  glovesLevels: GearSlotLevels;

  kit1Slug: string;
  kit1Levels: GearSlotLevels;

  kit2Slug: string;
  kit2Levels: GearSlotLevels;
};

type SelectableItem = {
  slug: string;
  name: string;
  enName: string;
  image: string;
  fullImage?: string;
  rarity?: number;
  quality?: number;
  category?: string;
  setName?: string;
  raw: any;
};

const LEVEL_OPTIONS = [1, 20, 40, 60, 80, 90];

const OPERATOR_BREAKTHROUGH_OPTIONS = [
  { label: "0돌파", value: "0" },
  { label: "1돌파", value: "1" },
  { label: "2돌파", value: "2" },
  { label: "3돌파", value: "3" },
  { label: "4돌파", value: "4" },
  { label: "5돌파", value: "5" },
];

const OPERATOR_TRUST_STAGE_OPTIONS = ["0", "1", "2", "3", "4"];

const SKILL_LEVELS: SkillLevel[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "M1",
  "M2",
  "M3",
];

const RANK_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const DEFAULT_GEAR_LEVELS: GearSlotLevels = {
  ability1: "base",
  ability2: "base",
  attribute: "base",
};

const GEAR_LEVEL_OPTIONS: { label: string; value: GearLevelKey }[] = [
  { label: "기본", value: "base" },
  { label: "1강", value: "level1" },
  { label: "2강", value: "level2" },
  { label: "3강", value: "level3" },
];

const statIconMap: Record<string, string> = {
  체력: "/icons/stats/hp.webp",
  공격력: "/icons/stats/attack.webp",
  힘: "/icons/stats/strength.webp",
  민첩: "/icons/stats/agility.webp",
  지능: "/icons/stats/intelligence.webp",
  의지: "/icons/stats/will.webp",
  방어력: "/icons/stats/defense.webp",
  "치명타 확률": "/icons/stats/crit_rate.webp",
  "치명타 피해": "/icons/stats/crit_rate.webp",
  "궁극기 충전 효율": "/icons/stats/ultimate_charge.webp",
  "스킬 피해 보너스": "/icons/stats/skill_damage.webp",
  "일반 공격 피해 보너스": "/icons/stats/normal_attack_damage.webp",
  "배틀 스킬 피해 보너스": "/icons/stats/skill_damage.webp",
  "연계 스킬 피해 보너스": "/icons/stats/combo_skill_damage.webp",
  "궁극기 피해 보너스": "/icons/stats/ultimate_damage.webp",
  "물리 피해 보너스": "/icons/stats/physical_damage.webp",
  "불균형 목표에 주는 피해 보너스": "/icons/stats/unbalanced_damage.webp",
};

const elementLabelMap: Record<string, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};

const classLabelMap: Record<string, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
};
const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const elementIconMap: Record<string, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};

const classIconMap: Record<string, string> = {
  vanguard: "/icons/classes/vanguard.webp",
  guard: "/icons/classes/guard.webp",
  defender: "/icons/classes/defender.webp",
  supporter: "/icons/classes/supporter.webp",
  caster: "/icons/classes/caster.webp",
  striker: "/icons/classes/striker.webp",
};

const weaponIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  artsunit: "/icons/weapons/artsunit.webp",
  artsUnit: "/icons/weapons/artsunit.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
};

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  artsunit: "아츠 유닛",
  artsUnit: "아츠 유닛",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
};

const operatorClassOrder = [
  "vanguard",
  "guard",
  "defender",
  "supporter",
  "caster",
  "striker",
];

const weaponTypeOrder = [
  "sword",
  "artsunit",
  "artsUnit",
  "greatsword",
  "polearm",
  "handcannon",
];

const gearSetOrder = [
  "개척",
  "응룡 50식",
  "본 크러셔",
  "조류의 물결",
  "M. I. 경찰용",
  "열 작업용",
  "생체 보조",
  "검술사",
  "경량 초자연",
  "펄스식",
  "식양의 숨결",
  "순행 전달자",
  "아부레이의 메아리",
  "중장갑 전달자",
  "재앙 방호",
  "침식 방호",
  "침식 차단",
  "통합 중량형 모델",
  "통합 경량형 모델",
  "세트 없음",
];

function orderIndex(list: string[], value: unknown) {
  const text = String(value ?? "");
  const index = list.indexOf(text);
  return index >= 0 ? index : 999;
}

function compareKoName(a: SelectableItem, b: SelectableItem) {
  return (
    a.name.localeCompare(b.name, "ko-KR") ||
    a.enName.localeCompare(b.enName, "en-US")
  );
}

function getWeaponTypeKey(item: SelectableItem) {
  return String(item.raw?.weaponType ?? item.raw?.type ?? "");
}

function comparePickerItems(
  kind: PickerState["kind"],
  a: SelectableItem,
  b: SelectableItem,
) {
  if (kind === "operator") {
    const rarityCompare = Number(b.rarity ?? 0) - Number(a.rarity ?? 0);
    if (rarityCompare !== 0) return rarityCompare;

    const classCompare =
      orderIndex(operatorClassOrder, a.raw?.class) -
      orderIndex(operatorClassOrder, b.raw?.class);
    if (classCompare !== 0) return classCompare;

    return compareKoName(a, b);
  }

  if (kind === "weapon") {
    const rarityCompare = Number(b.rarity ?? 0) - Number(a.rarity ?? 0);
    if (rarityCompare !== 0) return rarityCompare;

    const typeCompare =
      orderIndex(weaponTypeOrder, getWeaponTypeKey(a)) -
      orderIndex(weaponTypeOrder, getWeaponTypeKey(b));
    if (typeCompare !== 0) return typeCompare;

    return compareKoName(a, b);
  }

  const qualityCompare = Number(b.quality ?? 0) - Number(a.quality ?? 0);
  if (qualityCompare !== 0) return qualityCompare;

  const setCompare =
    orderIndex(gearSetOrder, a.setName) - orderIndex(gearSetOrder, b.setName);
  if (setCompare !== 0) return setCompare;

  return compareKoName(a, b);
}

const qualityColorMap: Record<number, string> = {
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
  2: "#84cc16",
  1: "#9ca3af",
};

const statKeyByLabel: Record<string, "str" | "dex" | "int" | "will"> = {
  힘: "str",
  민첩: "dex",
  지능: "int",
  의지: "will",
};

const statLabelByKey: Record<"str" | "dex" | "int" | "will", string> = {
  str: "힘",
  dex: "민첩",
  int: "지능",
  will: "의지",
};

function getOperatorMainSubLabels(operator?: SelectableItem) {
  const raw = operator?.raw ?? {};

  const mainLabel = String(
    raw.mainStatLabel ??
      raw.mainStat ??
      raw.primaryStatLabel ??
      raw.primaryStat ??
      raw.mainAttributeLabel ??
      raw.mainAttribute ??
      "",
  );

  const subLabel = String(
    raw.subStatLabel ??
      raw.subStat ??
      raw.secondaryStatLabel ??
      raw.secondaryStat ??
      raw.subAttributeLabel ??
      raw.subAttribute ??
      "",
  );

  return {
    mainLabel,
    subLabel,
    mainKey: statKeyByLabel[mainLabel],
    subKey: statKeyByLabel[subLabel],
  };
}

const gearAbilityOptions = [
  { label: "전체", value: "all" },
  { label: "힘", value: "strength" },
  { label: "민첩", value: "agility" },
  { label: "지능", value: "intelligence" },
  { label: "의지", value: "will" },
];

const gearAttributeOptions = [
  { label: "전체", value: "all" },
  { label: "공격력", value: "attack" },
  { label: "생명력", value: "hp" },
  { label: "치명타 확률", value: "critRate" },
  { label: "오리지늄 아츠 강도", value: "originiumArts" },
  { label: "치유 효율 보너스", value: "healEfficiency" },
  { label: "물리 피해 보너스", value: "physicalDamage" },
  { label: "궁극기 충전 효율", value: "ultimateEfficiency" },
  { label: "일반 공격 피해 보너스", value: "normalAttack" },
  { label: "배틀 스킬 피해 보너스", value: "skillDamage" },
  { label: "연계 스킬 피해 보너스", value: "comboSkillDamage" },
  { label: "궁극기 피해 보너스", value: "ultimateDamage" },
  { label: "불균형 목표에 주는 피해 보너스", value: "unbalancedTargetDamage" },
  { label: "주요 능력치", value: "mainStat" },
  { label: "아츠 피해 보너스", value: "artsDamage" },
  { label: "냉기와 전기 피해 보너스", value: "cryoElectricDamage" },
  { label: "모든 피해 감소", value: "damageReduction" },
  { label: "보조 능력치", value: "subStat" },
  { label: "모든 스킬 피해 보너스", value: "allSkillDamage" },
  { label: "열기와 자연 피해 보너스", value: "heatNatureDamage" },
];

function toOperatorItem(operator: OperatorDetail): SelectableItem {
  const raw = operator as any;

  return {
    slug: raw.slug,
    name: raw.name,
    enName: raw.enName,
    image: raw.avatar ?? raw.image ?? `/operators/${raw.slug}/avatar.webp`,
    fullImage: raw.fullImage ?? `/operators/${raw.slug}/full.webp`,
    rarity: raw.rarity,
    raw,
  };
}

function toWeaponItem(weapon: WeaponDetail): SelectableItem {
  const raw = weapon as any;

  return {
    slug: raw.slug,
    name: raw.name,
    enName: raw.enName,
    image: raw.image ?? raw.avatar ?? `/weapons/${raw.slug}/avatar.webp`,
    fullImage: raw.fullImage ?? raw.image ?? `/weapons/${raw.slug}/full.webp`,
    rarity: raw.rarity,
    raw,
  };
}

function toGearItem(gear: GearDetail): SelectableItem {
  return {
    slug: gear.slug,
    name: gear.name,
    enName: gear.enName,
    image: gear.image,
    quality: gear.quality,
    category: gear.category,
    setName: gear.setName,
    raw: gear,
  };
}

const operatorItems = operatorDetails.map(toOperatorItem);
const weaponItems = weaponDetails.map(toWeaponItem);
const gearItems = gearDetails.map(toGearItem);

const armorItems = gearItems.filter((item) => item.category === "armor");
const glovesItems = gearItems.filter((item) => item.category === "gloves");
const kitItems = gearItems.filter((item) => item.category === "kit");

function createDefaultForm(): FormState {
  return {
    operatorSlug: "",
    operatorLevel: 1,
    operatorBreakthroughRank: "0",
    operatorTrustStage: "0",

    normalLevel: "1",
    battleLevel: "1",
    comboLevel: "1",
    ultimateLevel: "1",

    weaponSlug: "",
    weaponLevel: 1,
    weaponAbilityRank: "1",
    weaponAttributeRank: "1",
    weaponSeriesRank: "1",

    armorSlug: "",
    armorLevels: { ...DEFAULT_GEAR_LEVELS },

    glovesSlug: "",
    glovesLevels: { ...DEFAULT_GEAR_LEVELS },

    kit1Slug: "",
    kit1Levels: { ...DEFAULT_GEAR_LEVELS },

    kit2Slug: "",
    kit2Levels: { ...DEFAULT_GEAR_LEVELS },
  };
}

function levelIndex(level: number) {
  return Math.max(0, Math.min(89, level - 1));
}

function skillIndex(level: SkillLevel) {
  if (level === "M1") return 9;
  if (level === "M2") return 10;
  if (level === "M3") return 11;
  return Number(level) - 1;
}

function rankIndex(rank: string) {
  return Math.max(0, Math.min(8, Number(rank) - 1));
}

function parseNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;

  const parsed = Number(value.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value: number) {
  return `${Math.floor(value * 10) / 10}%`;
}

function readIcon(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const item = value as Record<string, unknown>;
    const candidates = [
      item.icon,
      item.image,
      item.avatar,
      item.src,
      item.iconSrc,
      item.iconPath,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return "";
}

function getOperatorBreakthroughItems(operator?: SelectableItem): any[] {
  const raw = operator?.raw;
  const candidates = [
    raw?.breakthroughs,
    raw?.breakthroughBonuses,
    raw?.potential,
    raw?.potentials,
    raw?.potentialBonuses,
    raw?.talents,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
    }
  }

  return [];
}

function getOperatorBreakthroughItem(
  operator: SelectableItem | undefined,
  rank: string,
) {
  const stage = Number(rank);
  if (!Number.isFinite(stage) || stage <= 0) return null;

  const items = getOperatorBreakthroughItems(operator);

  return (
    items.find((item) => {
      const itemStage = Number(
        item?.stage ?? item?.rank ?? item?.level ?? item?.step ?? item?.phase,
      );
      return itemStage === stage;
    }) ??
    items[stage - 1] ??
    null
  );
}

function getOperatorBreakthroughIcon(
  operator: SelectableItem | undefined,
  rank: string,
) {
  const stage = Number(rank);
  if (!Number.isFinite(stage) || stage <= 0) {
    return "";
  }

  const item = getOperatorBreakthroughItem(operator, rank);
  const icon = readIcon(item);
  if (icon) return icon;

  return stage >= 1 && stage <= 5 ? `/icons/potential/${stage}.webp` : "";
}

function getOperatorBreakthroughText(
  operator: SelectableItem | undefined,
  rank: string,
) {
  const stage = Number(rank);
  if (!Number.isFinite(stage) || stage <= 0) return "잠재능력 미적용";

  const item = getOperatorBreakthroughItem(operator, rank);
  const candidates = [
    item?.description,
    item?.desc,
    item?.summary,
    item?.effect,
    item?.name,
    item?.label,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return `${stage}단계 잠재능력`;
}

function getOperatorLevelStats(operator?: SelectableItem, level = 90) {
  const raw = operator?.raw;
  const index = levelIndex(level);

  const detail = raw?.levelStats?.detail;

  if (detail) {
    return {
      hp: Number(detail.hp?.[index] ?? 0),
      atk: Number(detail.atk?.[index] ?? 0),
      str: Number(detail.str?.[index] ?? 0),
      dex: Number(detail.dex?.[index] ?? 0),
      int: Number(detail.int?.[index] ?? 0),
      will: Number(detail.will?.[index] ?? 0),
    };
  }

  const rows = raw?.levelStats;

  if (Array.isArray(rows)) {
    const row =
      rows.find((item: any) => Number(item.level) === level) ??
      rows[index] ??
      rows[0];

    return {
      hp: Number(row?.hp ?? 0),
      atk: Number(row?.attack ?? row?.atk ?? 0),
      str: Number(row?.power ?? row?.str ?? 0),
      dex: Number(row?.agility ?? row?.dex ?? 0),
      int: Number(row?.intelligence ?? row?.int ?? 0),
      will: Number(row?.will ?? 0),
    };
  }

  return {
    hp: 0,
    atk: 0,
    str: 0,
    dex: 0,
    int: 0,
    will: 0,
  };
}

function getWeaponAttack(weapon?: SelectableItem, level = 90) {
  const index = levelIndex(level);

  return Number(
    weapon?.raw?.levelStats?.[index]?.attack ??
      weapon?.raw?.levelStats?.[index]?.atk ??
      weapon?.raw?.levelStats?.[index]?.baseAttack ??
      weapon?.raw?.levelStats?.detail?.attack?.[index] ??
      weapon?.raw?.levelStats?.detail?.atk?.[index] ??
      0,
  );
}

function getGearValue(
  gear: SelectableItem | undefined,
  key: "baseStat" | "ability1" | "ability2" | "attribute",
  level: GearLevelKey,
) {
  const data = gear?.raw?.[key];

  if (!data) {
    return { label: "-", value: "-" };
  }

  if (data.values) {
    return {
      label: String(data.label ?? "-"),
      value: String(data.values[level] ?? data.values.base ?? "-"),
    };
  }

  return {
    label: String(data.label ?? "-"),
    value: String(data.value ?? "-"),
  };
}

function createBonusStats() {
  return {
    hp: 0,
    hpPercent: 0,
    atkBonus: 0,
    str: 0,
    dex: 0,
    int: 0,
    will: 0,
    mainStat: 0,
    subStat: 0,
    mainFlat: 0,
    subFlat: 0,
    critRate: 0,
    critDamage: 0,
    ultimateEfficiency: 0,
    healEfficiency: 0,
    skillDamage: 0,
    allSkillDamage: 0,
    normalAttackDamage: 0,
    battleSkillDamage: 0,
    comboSkillDamage: 0,
    ultimateDamage: 0,
    physicalDamage: 0,
    artsDamage: 0,
    cryoElectricDamage: 0,
    heatNatureDamage: 0,
    unbalancedTargetDamage: 0,
    defense: 0,
    damageReduction: 0,
  };
}

function applyStatByLabel(
  target: ReturnType<typeof createBonusStats>,
  label: string,
  value: number,
  isPercent = false,
) {
  if (!label || !Number.isFinite(value)) return;

  if (label.includes("생명력") || label.includes("체력") || label.includes("최대 생명력")) {
    if (isPercent) target.hpPercent += value;
    else target.hp += value;
  }
  if (label.includes("공격력")) target.atkBonus += value;

  if (label.includes("주요 능력치")) target.mainStat += value;
  else if (label.includes("보조 능력치")) target.subStat += value;
  else {
    if (label.includes("힘")) target.str += value;
    if (label.includes("민첩")) target.dex += value;
    if (label.includes("지능")) target.int += value;
    if (label.includes("의지")) target.will += value;
  }

  if (label.includes("치명타 확률") || label.includes("치명률")) {
    target.critRate += value;
  }
  if (label.includes("치명타 피해")) target.critDamage += value;
  if (label.includes("궁극기 충전")) target.ultimateEfficiency += value;
  if (label.includes("치유 효율")) target.healEfficiency += value;

  if (label.includes("모든 스킬")) target.allSkillDamage += value;
  if (label.includes("스킬 피해") && !label.includes("모든 스킬")) {
    target.skillDamage += value;
  }
  if (label.includes("일반 공격")) target.normalAttackDamage += value;
  if (label.includes("배틀 스킬")) target.battleSkillDamage += value;
  if (label.includes("연계 스킬")) target.comboSkillDamage += value;
  if (label.includes("궁극기 피해")) target.ultimateDamage += value;

  if (label.includes("물리 피해")) target.physicalDamage += value;
  if (label.includes("아츠 피해")) target.artsDamage += value;
  if (label.includes("냉기") && label.includes("전기"))
    target.cryoElectricDamage += value;
  if (label.includes("열기") && label.includes("자연"))
    target.heatNatureDamage += value;
  if (label.includes("불균형")) target.unbalancedTargetDamage += value;
  if (label.includes("방어력")) target.defense += value;
  if (label.includes("피해 감소")) target.damageReduction += value;
}

function getGearNumericStats(gear?: SelectableItem, levels?: GearSlotLevels) {
  const result = createBonusStats();

  const baseStat = getGearValue(gear, "baseStat", "base");
  const ability1 = getGearValue(gear, "ability1", levels?.ability1 ?? "base");
  const ability2 = getGearValue(gear, "ability2", levels?.ability2 ?? "base");
  const attribute = getGearValue(
    gear,
    "attribute",
    levels?.attribute ?? "base",
  );

  for (const stat of [baseStat, ability1, ability2, attribute]) {
    applyStatByLabel(
      result,
      stat.label,
      parseNumber(stat.value),
      String(stat.value).includes("%"),
    );
  }

  return result;
}

function applyFlatStatByKey(
  target: ReturnType<typeof createBonusStats>,
  key: string,
  value: number,
) {
  if (!Number.isFinite(value)) return;

  const normalized = key.trim();

  if (["hp", "health", "life", "생명력", "체력"].includes(normalized))
    target.hp += value;
  if (["atk", "attack", "공격력"].includes(normalized))
    target.atkBonus += value;
  if (["str", "strength", "힘"].includes(normalized)) target.str += value;
  if (["dex", "agility", "agi", "민첩"].includes(normalized))
    target.dex += value;
  if (["int", "intelligence", "지능"].includes(normalized)) target.int += value;
  if (["will", "의지"].includes(normalized)) target.will += value;
}

function applyFlatStatsFromObject(
  target: ReturnType<typeof createBonusStats>,
  stats: unknown,
) {
  if (!stats || typeof stats !== "object") return;

  if (Array.isArray(stats)) {
    for (const item of stats) {
      const label = String(
        item?.label ??
          item?.name ??
          item?.stat ??
          item?.key ??
          item?.type ??
          "",
      );
      const value = parseNumber(item?.value ?? item?.amount ?? item?.bonus);
      applyOperatorBonusByText(target, `${label} ${value}`);
    }
    return;
  }

  for (const [key, value] of Object.entries(stats as Record<string, unknown>)) {
    applyFlatStatByKey(target, key, parseNumber(value));
  }
}

function applyOperatorBonusByText(
  target: ReturnType<typeof createBonusStats>,
  text: string,
) {
  if (!text) return;

  const patterns = [
    "주요 능력치",
    "보조 능력치",
    "생명력",
    "체력",
    "공격력",
    "힘",
    "민첩",
    "지능",
    "의지",
    "치명타 확률",
    "치명타 피해",
    "궁극기 충전 효율",
    "물리 피해",
    "아츠 피해",
    "냉기와 전기 피해",
    "열기와 자연 피해",
    "모든 스킬 피해",
    "일반 공격 피해",
    "배틀 스킬 피해",
    "연계 스킬 피해",
    "궁극기 피해",
    "불균형 목표",
    "모든 피해 감소",
  ];

  for (const label of patterns) {
    if (!text.includes(label)) continue;

    const match = text.match(
      new RegExp(`${label}[^+\-0-9]*([+\-]?\\d+(?:\\.\\d+)?)\\s*(%)?`),
    );
    if (!match) continue;

    const value = Number(match[1]);
    if (!Number.isFinite(value)) continue;

    const isPercent = Boolean(match[2]);

    if (label === "주요 능력치") {
      if (isPercent) target.mainStat += value;
      else target.mainFlat += value;
      continue;
    }

    if (label === "보조 능력치") {
      if (isPercent) target.subStat += value;
      else target.subFlat += value;
      continue;
    }

    if (
      ["생명력", "체력", "공격력", "힘", "민첩", "지능", "의지"].includes(
        label,
      ) &&
      !isPercent
    ) {
      applyFlatStatByKey(target, label, value);
      continue;
    }

    applyStatByLabel(target, label, value, isPercent);
  }
}

function collectBonusText(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(collectBonusText).filter(Boolean).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map(collectBonusText)
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

function getOperatorTrustBonusStats(
  operator?: SelectableItem,
  trustStage = "1",
) {
  const target = createBonusStats();
  const activeLevel = Math.max(0, Number(trustStage) || 0);
  const trustBonus = operator?.raw?.trustBonus ?? operator?.raw?.trustBonuses ?? [];

  if (!operator || activeLevel <= 0 || !Array.isArray(trustBonus)) {
    return target;
  }

  const statLabelToKey: Record<string, "str" | "dex" | "int" | "will"> = {
    힘: "str",
    민첩: "dex",
    지능: "int",
    의지: "will",
  };

  for (const item of trustBonus) {
    const level = Number(item?.level ?? item?.stage ?? 0);
    if (!level || level > activeLevel) continue;

    const label = String(item?.label ?? item?.name ?? item?.description ?? "").trim();

    for (const [statLabel, statKey] of Object.entries(statLabelToKey)) {
      if (!label.includes(statLabel)) continue;

      const match = label.match(/([+\-]?\d+(?:\.\d+)?)/);
      const amount = match ? Number(match[1]) : 0;
      if (!Number.isFinite(amount)) continue;

      target[statKey] += amount;
    }
  }

  return target;
}

function getOperatorBreakthroughBonusStats(
  operator?: SelectableItem,
  rank = "0",
) {
  const target = createBonusStats();
  const stageCount = Math.max(0, Number(rank) || 0);
  const items = getOperatorBreakthroughItems(operator);

  for (let index = 0; index < stageCount; index += 1) {
    const stage = items[index];
    if (!stage) continue;

    applyFlatStatsFromObject(
      target,
      stage?.stats ?? stage?.bonus ?? stage?.attributes,
    );

    applyOperatorBonusByText(target, collectBonusText(stage));
  }

  return target;
}

function mergeBonusStats(
  target: ReturnType<typeof createBonusStats>,
  stat: ReturnType<typeof createBonusStats>,
) {
  target.hp += stat.hp;
  target.hpPercent += stat.hpPercent;
  target.atkBonus += stat.atkBonus;
  target.str += stat.str;
  target.dex += stat.dex;
  target.int += stat.int;
  target.will += stat.will;
  target.mainStat += stat.mainStat;
  target.subStat += stat.subStat;
  target.mainFlat += stat.mainFlat;
  target.subFlat += stat.subFlat;
  target.critRate += stat.critRate;
  target.critDamage += stat.critDamage;
  target.ultimateEfficiency += stat.ultimateEfficiency;
  target.healEfficiency += stat.healEfficiency;
  target.skillDamage += stat.skillDamage;
  target.allSkillDamage += stat.allSkillDamage;
  target.normalAttackDamage += stat.normalAttackDamage;
  target.battleSkillDamage += stat.battleSkillDamage;
  target.comboSkillDamage += stat.comboSkillDamage;
  target.ultimateDamage += stat.ultimateDamage;
  target.physicalDamage += stat.physicalDamage;
  target.artsDamage += stat.artsDamage;
  target.cryoElectricDamage += stat.cryoElectricDamage;
  target.heatNatureDamage += stat.heatNatureDamage;
  target.unbalancedTargetDamage += stat.unbalancedTargetDamage;
  target.defense += stat.defense;
  target.damageReduction += stat.damageReduction;
}

function applyMainSubPercent(value: number, rate: number) {
  return value * (1 + rate / 100);
}

function getWeaponSkill(weapon: SelectableItem | undefined, index: number) {
  return weapon?.raw?.skills?.[index];
}

function getWeaponSkillRankValue(skill: any, rank: string) {
  return skill?.levelValues?.[rankIndex(rank)] ?? skill?.levelValues?.[0];
}

function collectWeaponRankStats(skill: any, rank: string) {
  const rankValue = getWeaponSkillRankValue(skill, rank);
  const stats = Array.isArray(rankValue?.stats) ? rankValue.stats : [];

  return { rankValue, stats };
}

function getWeaponSeriesSummaryText(skill: any, rank: string) {
  const rankValue = getWeaponSkillRankValue(skill, rank);
  const stats = Array.isArray(rankValue?.stats) ? rankValue.stats : [];
  const statText = stats
    .map((stat: any) => `${String(stat?.label ?? "").trim()} ${String(stat?.value ?? "").trim()}`.trim())
    .filter(Boolean)
    .join(" / ");

  return String(
    statText ||
      rankValue?.summary ||
      rankValue?.effectSummary ||
      rankValue?.statsSummary ||
      rankValue?.highlight ||
      rankValue?.title ||
      "",
  ).trim();
}

function getWeaponSeriesUnconditionalText(skill: any, rank: string) {
  const summary = getWeaponSeriesSummaryText(skill, rank);

  return summary
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const conditionalWords = [
        "스택",
        "중첩",
        "추가",
        "후",
        "동안",
        "최대",
        "조건",
        "획득",
        "발동",
      ];

      return !conditionalWords.some((word) => item.includes(word));
    })
    .join(" ");
}

function getFirstSentence(text: string) {
  return (
    text
      .split(/[.。]/)
      .map((item) => item.trim())
      .find(Boolean) ?? ""
  );
}

function getSkillDescriptionText(skill: any, rankValue: any) {
  return collectBonusText([
    rankValue?.description,
    rankValue?.desc,
    rankValue?.effect,
    skill?.description,
    skill?.desc,
    skill?.effect,
  ]);
}

function getUnconditionalBonusText(text: string) {
  const lines = text
    .split(/\n|。/)
    .map((line) => line.trim())
    .filter(Boolean);

  const stopPatterns = [
    "장착자",
    "후",
    "시 ",
    "하면",
    "동안",
    "중첩",
    "스택",
    "지속",
    "획득",
    "초기화",
  ];

  const picked: string[] = [];

  for (const line of lines) {
    if (stopPatterns.some((pattern) => line.includes(pattern))) {
      break;
    }

    if (/[+\-]?\d+(?:\.\d+)?\s*%?/.test(line)) {
      picked.push(line);
    }
  }

  return picked.join(" ");
}

function applyWeaponStats(
  target: ReturnType<typeof createBonusStats>,
  skill: any,
  rank: string,
  options: { parseUnconditionalText?: boolean } = {},
) {
  const { rankValue, stats } = collectWeaponRankStats(skill, rank);

  for (const stat of stats) {
    const valueText = String(stat?.value ?? "");
    applyStatByLabel(
      target,
      String(stat?.label ?? ""),
      parseNumber(valueText),
      valueText.includes("%"),
    );
  }

  if (options.parseUnconditionalText) {
    const unconditionalText = getUnconditionalBonusText(
      getSkillDescriptionText(skill, rankValue),
    );

    applyOperatorBonusByText(target, unconditionalText);
  }
}

function calculateFinalStats(params: {
  operator?: SelectableItem;
  weapon?: SelectableItem;
  armor?: SelectableItem;
  gloves?: SelectableItem;
  kit1?: SelectableItem;
  kit2?: SelectableItem;
  form: FormState;
}) {
  const operator = getOperatorLevelStats(
    params.operator,
    params.form.operatorLevel,
  );
  const weaponAttack = getWeaponAttack(params.weapon, params.form.weaponLevel);

  const bonus = createBonusStats();
  const gearBonus = createBonusStats();
  const trustBonus = getOperatorTrustBonusStats(
    params.operator,
    params.form.operatorTrustStage,
  );
  const breakthroughBonus = getOperatorBreakthroughBonusStats(
    params.operator,
    params.form.operatorBreakthroughRank,
  );
  const weaponBonus = createBonusStats();

  const gearStats = [
    getGearNumericStats(params.armor, params.form.armorLevels),
    getGearNumericStats(params.gloves, params.form.glovesLevels),
    getGearNumericStats(params.kit1, params.form.kit1Levels),
    getGearNumericStats(params.kit2, params.form.kit2Levels),
  ];

  for (const stat of gearStats) {
    mergeBonusStats(gearBonus, stat);
  }

  applyWeaponStats(
    weaponBonus,
    getWeaponSkill(params.weapon, 0),
    params.form.weaponAbilityRank,
  );
  applyWeaponStats(
    weaponBonus,
    getWeaponSkill(params.weapon, 1),
    params.form.weaponAttributeRank,
  );
  applyOperatorBonusByText(
    weaponBonus,
    getWeaponSeriesUnconditionalText(
      getWeaponSkill(params.weapon, 2),
      params.form.weaponSeriesRank,
    ),
  );

  const setEffectBonus = createBonusStats();
  const activeSetEffect = getActiveSetEffect([
    params.armor,
    params.gloves,
    params.kit1,
    params.kit2,
  ]);

  if (activeSetEffect?.description) {
    applyOperatorBonusByText(
      setEffectBonus,
      getFirstSentence(activeSetEffect.description),
    );
  }

  mergeBonusStats(bonus, gearBonus);
  mergeBonusStats(bonus, trustBonus);
  mergeBonusStats(bonus, breakthroughBonus);
  mergeBonusStats(bonus, weaponBonus);
  mergeBonusStats(bonus, setEffectBonus);

  const { mainLabel, subLabel, mainKey, subKey } = getOperatorMainSubLabels(
    params.operator,
  );

  const flatStatMap = {
    str: operator.str + bonus.str,
    dex: operator.dex + bonus.dex,
    int: operator.int + bonus.int,
    will: operator.will + bonus.will,
  };

  if (mainKey) flatStatMap[mainKey] += bonus.mainFlat;
  if (subKey) flatStatMap[subKey] += bonus.subFlat;

  const statMap = { ...flatStatMap };

  if (mainKey) {
    statMap[mainKey] = applyMainSubPercent(statMap[mainKey], bonus.mainStat);
  }

  if (subKey) {
    statMap[subKey] = applyMainSubPercent(statMap[subKey], bonus.subStat);
  }

  const { str, dex, int, will } = statMap;

  const statBonus =
    (mainKey ? statMap[mainKey] * 0.5 : 0) +
    (subKey ? statMap[subKey] * 0.2 : 0);

  const baseAttack = operator.atk + weaponAttack;
  const attack =
    baseAttack * (1 + bonus.atkBonus / 100) * (1 + statBonus / 100);

  const baseHp = operator.hp + bonus.hp + str * 5;
  const hp = baseHp * (1 + bonus.hpPercent / 100);

  return {
    hp: Math.floor(hp),
    baseHp: Math.floor(baseHp),
    hpPercent: Math.floor(bonus.hpPercent * 10) / 10,
    atk: Math.floor(attack),
    baseAttack: Math.floor(baseAttack),
    operatorAttack: Math.floor(operator.atk),
    weaponAttack: Math.floor(weaponAttack),

    str: Math.floor(str),
    dex: Math.floor(dex),
    int: Math.floor(int),
    will: Math.floor(will),

    attackBonus: Math.floor(bonus.atkBonus * 10) / 10,
    statBonus: Math.floor(statBonus * 10) / 10,
    critRate: Math.floor((5 + bonus.critRate) * 10) / 10,
    critDamage: Math.floor((50 + bonus.critDamage) * 10) / 10,
    ultimateEfficiency: Math.floor((100 + bonus.ultimateEfficiency) * 10) / 10,
    healEfficiency: Math.floor(bonus.healEfficiency * 10) / 10,
    skillDamage:
      Math.floor((bonus.skillDamage + bonus.allSkillDamage) * 10) / 10,
    allSkillDamage: Math.floor(bonus.allSkillDamage * 10) / 10,
    normalAttackDamage: Math.floor(bonus.normalAttackDamage * 10) / 10,
    battleSkillDamage: Math.floor(bonus.battleSkillDamage * 10) / 10,
    comboSkillDamage: Math.floor(bonus.comboSkillDamage * 10) / 10,
    ultimateDamage: Math.floor(bonus.ultimateDamage * 10) / 10,
    physicalDamage: Math.floor(bonus.physicalDamage * 10) / 10,
    artsDamage: Math.floor(bonus.artsDamage * 10) / 10,
    cryoElectricDamage: Math.floor(bonus.cryoElectricDamage * 10) / 10,
    heatNatureDamage: Math.floor(bonus.heatNatureDamage * 10) / 10,
    unbalancedTargetDamage: Math.floor(bonus.unbalancedTargetDamage * 10) / 10,
    defense: Math.floor(bonus.defense),
    damageReduction: Math.floor(bonus.damageReduction * 10) / 10,

    baseStats: {
      hp: Math.floor(operator.hp),
      atk: Math.floor(operator.atk),
      str: Math.floor(operator.str),
      dex: Math.floor(operator.dex),
      int: Math.floor(operator.int),
      will: Math.floor(operator.will),
    },
    bonusBreakdown: {
      gear: gearBonus,
      trust: trustBonus,
      breakthrough: breakthroughBonus,
      weapon: weaponBonus,
      setEffect: setEffectBonus,
      mainStatRate: Math.floor(bonus.mainStat * 10) / 10,
      subStatRate: Math.floor(bonus.subStat * 10) / 10,
      hpPercent: Math.floor(bonus.hpPercent * 10) / 10,
      mainFlat: Math.floor(bonus.mainFlat),
      subFlat: Math.floor(bonus.subFlat),
    },

    mainLabel,
    subLabel,
    mainKey,
    subKey,
  };
}

function getActiveSetEffect(gears: Array<SelectableItem | undefined>) {
  const counts = new Map<string, number>();

  for (const gear of gears) {
    if (!gear?.setName || gear.setName === "세트 없음") continue;
    counts.set(gear.setName, (counts.get(gear.setName) ?? 0) + 1);
  }

  const activeName = [...counts.entries()].find(([, count]) => count >= 3)?.[0];
  if (!activeName) return null;

  const gear = gears.find((item) => item?.setName === activeName);
  const effect = gear?.raw?.setEffects?.find(
    (item: any) => Number(item.pieces) === 3,
  );

  return {
    name: activeName,
    count: counts.get(activeName) ?? 0,
    description: String(effect?.description ?? ""),
  };
}

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>(createDefaultForm);
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [operatorWeaponFilter, setOperatorWeaponFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [elementFilter, setElementFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [weaponTypeFilter, setWeaponTypeFilter] = useState("all");
  const [seriesFilter, setSeriesFilter] = useState("all");
  const [gearSetFilter, setGearSetFilter] = useState("all");
  const [gearAbilityFilter, setGearAbilityFilter] = useState("all");
  const [gearAttributeFilter, setGearAttributeFilter] = useState("all");
  const [gearLevelFilter, setGearLevelFilter] = useState("all");

  const selectedOperator = operatorItems.find(
    (item) => item.slug === form.operatorSlug,
  );
  const selectedWeapon = weaponItems.find(
    (item) => item.slug === form.weaponSlug,
  );
  const selectedArmor = armorItems.find((item) => item.slug === form.armorSlug);
  const selectedGloves = glovesItems.find(
    (item) => item.slug === form.glovesSlug,
  );
  const selectedKit1 = kitItems.find((item) => item.slug === form.kit1Slug);
  const selectedKit2 = kitItems.find((item) => item.slug === form.kit2Slug);

  const finalStats = calculateFinalStats({
    operator: selectedOperator,
    weapon: selectedWeapon,
    armor: selectedArmor,
    gloves: selectedGloves,
    kit1: selectedKit1,
    kit2: selectedKit2,
    form,
  });

  const setEffect = getActiveSetEffect([
    selectedArmor,
    selectedGloves,
    selectedKit1,
    selectedKit2,
  ]);

  const pickerItems = useMemo(() => {
    if (!picker) return [];

    let source: SelectableItem[] = [];

    if (picker.kind === "operator") source = operatorItems;
    if (picker.kind === "weapon") source = weaponItems;

    if (picker.kind === "gear") {
      if (picker.slot === "armor") source = armorItems;
      if (picker.slot === "gloves") source = glovesItems;
      if (picker.slot === "kit1" || picker.slot === "kit2") source = kitItems;
    }

    const q = keyword.trim().toLowerCase();

    return source
      .filter((item) => {
        const raw = item.raw;

        const keywordOk =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.enName.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q) ||
          String(raw?.weaponType ?? "")
            .toLowerCase()
            .includes(q) ||
          String(raw?.series ?? "")
            .toLowerCase()
            .includes(q) ||
          String(raw?.setName ?? "")
            .toLowerCase()
            .includes(q);

        const raritySource =
          picker.kind === "gear" ? item.quality : item.rarity;
        const rarityOk =
          rarityFilter === "all" || String(raritySource) === rarityFilter;

        const elementOk =
          picker.kind !== "operator" ||
          elementFilter === "all" ||
          String(raw?.element) === elementFilter;

        const classOk =
          picker.kind !== "operator" ||
          classFilter === "all" ||
          String(raw?.class) === classFilter;

        const operatorWeaponOk =
          picker.kind !== "operator" ||
          operatorWeaponFilter === "all" ||
          String(raw?.weapon) === operatorWeaponFilter ||
          String(raw?.weaponType) === operatorWeaponFilter;

        const weaponTypeOk =
          picker.kind !== "weapon" ||
          weaponTypeFilter === "all" ||
          getWeaponTypeKey(item) === weaponTypeFilter;

        const seriesOk =
          picker.kind !== "weapon" ||
          seriesFilter === "all" ||
          String(raw?.series) === seriesFilter;

        const gearSetOk =
          picker.kind !== "gear" ||
          gearSetFilter === "all" ||
          item.setName === gearSetFilter;

        const gearAbilityOk =
          picker.kind !== "gear" ||
          gearAbilityFilter === "all" ||
          raw?.abilityTypes?.includes(gearAbilityFilter);

        const gearAttributeOk =
          picker.kind !== "gear" ||
          gearAttributeFilter === "all" ||
          raw?.attributeTypes?.includes(gearAttributeFilter);

        const gearLevelOk =
          picker.kind !== "gear" ||
          gearLevelFilter === "all" ||
          String(raw?.level) === gearLevelFilter;

        return (
          keywordOk &&
          rarityOk &&
          elementOk &&
          classOk &&
          operatorWeaponOk &&
          weaponTypeOk &&
          seriesOk &&
          gearSetOk &&
          gearAbilityOk &&
          gearAttributeOk &&
          gearLevelOk
        );
      })
      .sort((a, b) => comparePickerItems(picker.kind, a, b));
  }, [
    picker,
    keyword,
    rarityFilter,
    elementFilter,
    classFilter,
    operatorWeaponFilter,
    weaponTypeFilter,
    seriesFilter,
    gearSetFilter,
    gearAbilityFilter,
    gearAttributeFilter,
    gearLevelFilter,
  ]);

  function openPicker(next: PickerState) {
    setPicker(next);
    setKeyword("");
    setRarityFilter("all");
    setElementFilter("all");
    setClassFilter("all");
    setWeaponTypeFilter("all");
    setSeriesFilter("all");
    setGearSetFilter("all");
    setGearAbilityFilter("all");
    setGearAttributeFilter("all");
    setGearLevelFilter("all");
    setOperatorWeaponFilter("all");
  }

  function handlePick(item: SelectableItem) {
    if (!picker) return;

    if (picker.kind === "operator") {
      setForm((prev) => ({ ...prev, operatorSlug: item.slug }));
    }

    if (picker.kind === "weapon") {
      setForm((prev) => ({ ...prev, weaponSlug: item.slug }));
    }

    if (picker.kind === "gear") {
      if (picker.slot === "armor") {
        setForm((prev) => ({ ...prev, armorSlug: item.slug }));
      }
      if (picker.slot === "gloves") {
        setForm((prev) => ({ ...prev, glovesSlug: item.slug }));
      }
      if (picker.slot === "kit1") {
        setForm((prev) => ({ ...prev, kit1Slug: item.slug }));
      }
      if (picker.slot === "kit2") {
        setForm((prev) => ({ ...prev, kit2Slug: item.slug }));
      }
    }

    setPicker(null);
  }

  function updateGearLevel(
    slot: GearSlot,
    key: keyof GearSlotLevels,
    value: GearLevelKey,
  ) {
    const field =
      slot === "armor"
        ? "armorLevels"
        : slot === "gloves"
          ? "glovesLevels"
          : slot === "kit1"
            ? "kit1Levels"
            : "kit2Levels";

    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value,
      },
    }));
  }

  function resetSettings() {
    setForm(createDefaultForm());
    setPicker(null);
    setKeyword("");
    setRarityFilter("all");
    setElementFilter("all");
    setClassFilter("all");
    setWeaponTypeFilter("all");
    setSeriesFilter("all");
    setGearSetFilter("all");
    setGearAbilityFilter("all");
    setGearAttributeFilter("all");
    setGearLevelFilter("all");
    setOperatorWeaponFilter("all");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white">
      <div className="mx-auto max-w-[1800px]">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-end gap-4">
            <h1 className="text-3xl font-black tracking-[-0.04em] text-[#ffdc70]">
              오퍼레이터 세팅
            </h1>
            <p className="pb-1 text-sm text-zinc-400">
              오퍼레이터, 무기, 장비, 스킬을 선택하여 세팅을 구성합니다.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetSettings}
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-zinc-200"
            >
              세팅 초기화
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-zinc-200"
            >
              세팅 불러오기
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#ffd24a] px-6 py-2 text-sm font-black text-black"
            >
              세팅 저장
            </button>
            <Link
              href="/"
              onClick={resetSettings}
              className="rounded-lg border border-white/10 bg-black px-5 py-2 text-sm font-bold text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
            >
              홈으로
            </Link>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_0.85fr_1.55fr]">
          <OperatorPanel
            operator={selectedOperator}
            form={form}
            finalStats={finalStats}
            onOpen={() =>
              openPicker({ kind: "operator", title: "오퍼레이터 선택" })
            }
            onLevelChange={(value) =>
              setForm((prev) => ({ ...prev, operatorLevel: value }))
            }
            onBreakthroughChange={(value) =>
              setForm((prev) => ({ ...prev, operatorBreakthroughRank: value }))
            }
            onTrustStageChange={(value) =>
              setForm((prev) => ({ ...prev, operatorTrustStage: value }))
            }
            onSkillChange={(key, value) =>
              setForm((prev) => ({ ...prev, [key]: value }))
            }
          />

          <div className="grid gap-4">
            <WeaponPanel
              weapon={selectedWeapon}
              form={form}
              finalStats={finalStats}
              onOpen={() => openPicker({ kind: "weapon", title: "무기 선택" })}
              onLevelChange={(value) =>
                setForm((prev) => ({ ...prev, weaponLevel: value }))
              }
              onRankChange={(key, value) =>
                setForm((prev) => ({ ...prev, [key]: value }))
              }
            />

            <FinalStatPanel finalStats={finalStats} />
          </div>

          <div className="grid gap-4">
            <GearPanel
              armor={selectedArmor}
              gloves={selectedGloves}
              kit1={selectedKit1}
              kit2={selectedKit2}
              form={form}
              finalStats={finalStats}
              onOpen={openPicker}
              onGearLevelChange={updateGearLevel}
            />

            <SetEffectPanel setEffect={setEffect} />
          </div>
        </section>
      </div>

      {picker ? (
        <PickerModal
          picker={picker}
          items={pickerItems}
          keyword={keyword}
          rarityFilter={rarityFilter}
          elementFilter={elementFilter}
          classFilter={classFilter}
          operatorWeaponFilter={operatorWeaponFilter}
          weaponTypeFilter={weaponTypeFilter}
          seriesFilter={seriesFilter}
          gearSetFilter={gearSetFilter}
          gearAbilityFilter={gearAbilityFilter}
          gearAttributeFilter={gearAttributeFilter}
          gearLevelFilter={gearLevelFilter}
          onKeywordChange={setKeyword}
          onRarityChange={setRarityFilter}
          onElementChange={setElementFilter}
          onClassChange={setClassFilter}
          onOperatorWeaponChange={setOperatorWeaponFilter}
          onWeaponTypeChange={setWeaponTypeFilter}
          onSeriesChange={setSeriesFilter}
          onGearSetChange={setGearSetFilter}
          onGearAbilityChange={setGearAbilityFilter}
          onGearAttributeChange={setGearAttributeFilter}
          onGearLevelChange={setGearLevelFilter}
          onClose={() => setPicker(null)}
          onPick={handlePick}
        />
      ) : null}
    </main>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[14px] border border-yellow-500/15 bg-[#070a0f] p-4">
      <h2 className="mb-4 text-lg font-black text-[#ffdc70]">{title}</h2>
      {children}
    </section>
  );
}

function OperatorPanel({
  operator,
  form,
  finalStats,
  onOpen,
  onLevelChange,
  onBreakthroughChange,
  onTrustStageChange,
  onSkillChange,
}: {
  operator?: SelectableItem;
  form: FormState;
  finalStats: ReturnType<typeof calculateFinalStats>;
  onOpen: () => void;
  onLevelChange: (value: number) => void;
  onBreakthroughChange: (value: string) => void;
  onTrustStageChange: (value: string) => void;
  onSkillChange: (
    key: "normalLevel" | "battleLevel" | "comboLevel" | "ultimateLevel",
    value: SkillLevel,
  ) => void;
}) {
  const operatorBaseStats = getOperatorLevelStats(operator, form.operatorLevel);

  return (
    <Panel title="오퍼레이터">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <button
          type="button"
          onClick={onOpen}
          className="relative h-[430px] overflow-hidden rounded-xl border border-white/10 bg-black"
        >
          {operator ? (
            <Image
              src={operator.fullImage || operator.image}
              alt={operator.name}
              fill
              priority
              sizes="320px"
              className="object-contain"
            />
          ) : null}
        </button>

        <div>
          <button type="button" onClick={onOpen} className="text-left">
            <h2 className="text-3xl font-black text-white">
              {operator?.name ?? "오퍼레이터 선택"}
            </h2>
            <p className="text-sm text-zinc-400">{operator?.enName}</p>
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SelectBox
              label="레벨"
              value={String(form.operatorLevel)}
              options={LEVEL_OPTIONS.map(String)}
              onChange={(value) => onLevelChange(Number(value))}
            />

            <SelectBox
              label="신뢰도 보너스"
              value={form.operatorTrustStage}
              options={OPERATOR_TRUST_STAGE_OPTIONS}
              onChange={onTrustStageChange}
            />
          </div>

          <div className="mt-5 grid gap-2">
            <StatLine label="체력" value={operatorBaseStats.hp} />
            <StatLine label="공격력" value={operatorBaseStats.atk} />
            <StatLine label="힘" value={operatorBaseStats.str} />
            <StatLine label="민첩" value={operatorBaseStats.dex} />
            <StatLine label="지능" value={operatorBaseStats.int} />
            <StatLine label="의지" value={operatorBaseStats.will} />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-lg font-black text-[#ffdc70]">
          전투 스킬 <span className="text-xs text-zinc-500">(레벨 선택)</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <OperatorSkillCard
            skill={operator?.raw?.skills?.normalAttack}
            value={form.normalLevel}
            onChange={(value) => onSkillChange("normalLevel", value)}
          />
          <OperatorSkillCard
            skill={operator?.raw?.skills?.battleSkill}
            value={form.battleLevel}
            onChange={(value) => onSkillChange("battleLevel", value)}
          />
          <OperatorSkillCard
            skill={operator?.raw?.skills?.comboSkill}
            value={form.comboLevel}
            onChange={(value) => onSkillChange("comboLevel", value)}
          />
          <OperatorSkillCard
            skill={operator?.raw?.skills?.ultimate}
            value={form.ultimateLevel}
            onChange={(value) => onSkillChange("ultimateLevel", value)}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-yellow-500/15 bg-black/35 p-4">
        <h3 className="mb-3 text-lg font-black text-[#ffdc70]">잠재능력</h3>
        <OperatorBreakthroughSelect
          operator={operator}
          value={form.operatorBreakthroughRank}
          onChange={onBreakthroughChange}
        />
      </div>
    </Panel>
  );
}

function WeaponPanel({
  weapon,
  form,
  finalStats,
  onOpen,
  onLevelChange,
  onRankChange,
}: {
  weapon?: SelectableItem;
  form: FormState;
  finalStats: ReturnType<typeof calculateFinalStats>;
  onOpen: () => void;
  onLevelChange: (value: number) => void;
  onRankChange: (
    key: "weaponAbilityRank" | "weaponAttributeRank" | "weaponSeriesRank",
    value: string,
  ) => void;
}) {
  return (
    <Panel title="무기">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <button
          type="button"
          onClick={onOpen}
          className="relative h-40 overflow-hidden rounded-xl bg-black"
        >
          {weapon ? (
            <Image
              src={weapon.image}
              alt={weapon.name}
              fill
              sizes="360px"
              className="object-contain p-4"
            />
          ) : null}
        </button>

        <div>
          <button type="button" onClick={onOpen} className="text-left">
            <h2 className="text-2xl font-black text-white">
              {weapon?.name ?? "무기 선택"}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">{weapon?.enName}</p>
          </button>

          <div className="mt-3">
            <SelectBox
              label="무기 레벨"
              value={String(form.weaponLevel)}
              options={LEVEL_OPTIONS.map(String)}
              onChange={(value) => onLevelChange(Number(value))}
            />
          </div>

          <p className="mt-3 text-xs text-zinc-500">기초 공격력</p>
          <p className="text-3xl font-black text-[#ffdc70]">
            {finalStats.weaponAttack}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <WeaponSkillSelect
          title="능력치"
          skill={getWeaponSkill(weapon, 0)}
          value={form.weaponAbilityRank}
          onChange={(value) => onRankChange("weaponAbilityRank", value)}
        />
        <WeaponSkillSelect
          title="속성"
          skill={getWeaponSkill(weapon, 1)}
          value={form.weaponAttributeRank}
          onChange={(value) => onRankChange("weaponAttributeRank", value)}
        />
        <WeaponSkillSelect
          title="시리즈 스킬"
          skill={getWeaponSkill(weapon, 2)}
          value={form.weaponSeriesRank}
          onChange={(value) => onRankChange("weaponSeriesRank", value)}
        />
      </div>
    </Panel>
  );
}

function GearPanel({
  armor,
  gloves,
  kit1,
  kit2,
  form,
  finalStats,
  onOpen,
  onGearLevelChange,
}: {
  armor?: SelectableItem;
  gloves?: SelectableItem;
  kit1?: SelectableItem;
  kit2?: SelectableItem;
  form: FormState;
  finalStats: ReturnType<typeof calculateFinalStats>;
  onOpen: (picker: PickerState) => void;
  onGearLevelChange: (
    slot: GearSlot,
    key: keyof GearSlotLevels,
    value: GearLevelKey,
  ) => void;
}) {
  const gearTotalRows = [
    { label: "체력", value: finalStats.bonusBreakdown.gear.hp, percent: false },
    { label: "방어력", value: finalStats.bonusBreakdown.gear.defense, percent: false },
    { label: "힘", value: finalStats.bonusBreakdown.gear.str, percent: false },
    { label: "민첩", value: finalStats.bonusBreakdown.gear.dex, percent: false },
    { label: "지능", value: finalStats.bonusBreakdown.gear.int, percent: false },
    { label: "의지", value: finalStats.bonusBreakdown.gear.will, percent: false },
    { label: "최대 생명력 보너스", value: finalStats.bonusBreakdown.gear.hpPercent, percent: true },
    { label: "공격력 보너스", value: finalStats.bonusBreakdown.gear.atkBonus, percent: true },
    { label: "치명타 확률", value: finalStats.bonusBreakdown.gear.critRate, percent: true },
    { label: "치명타 피해", value: finalStats.bonusBreakdown.gear.critDamage, percent: true },
    { label: "궁극기 충전 효율", value: finalStats.bonusBreakdown.gear.ultimateEfficiency, percent: true },
    { label: "치유 효율 보너스", value: finalStats.bonusBreakdown.gear.healEfficiency, percent: true },
    { label: "일반 공격 피해 보너스", value: finalStats.bonusBreakdown.gear.normalAttackDamage, percent: true },
    { label: "배틀 스킬 피해 보너스", value: finalStats.bonusBreakdown.gear.battleSkillDamage, percent: true },
    { label: "연계 스킬 피해 보너스", value: finalStats.bonusBreakdown.gear.comboSkillDamage, percent: true },
    { label: "궁극기 피해 보너스", value: finalStats.bonusBreakdown.gear.ultimateDamage, percent: true },
    { label: "물리 피해 보너스", value: finalStats.bonusBreakdown.gear.physicalDamage, percent: true },
    { label: "아츠 피해 보너스", value: finalStats.bonusBreakdown.gear.artsDamage, percent: true },
    { label: "냉기와 전기 피해 보너스", value: finalStats.bonusBreakdown.gear.cryoElectricDamage, percent: true },
    { label: "열기와 자연 피해 보너스", value: finalStats.bonusBreakdown.gear.heatNatureDamage, percent: true },
    { label: "불균형 목표에 주는 피해 보너스", value: finalStats.bonusBreakdown.gear.unbalancedTargetDamage, percent: true },
    { label: "모든 피해 감소", value: finalStats.bonusBreakdown.gear.damageReduction, percent: true },
  ].filter((item) => Number(item.value) !== 0);

  return (
    <Panel title="장비">
      <div className="grid grid-cols-1 gap-3 min-[1500px]:grid-cols-2">
        <GearSlotCard
          title="방어구"
          item={armor}
          levels={form.armorLevels}
          onSelect={() =>
            onOpen({ kind: "gear", slot: "armor", title: "방어구 선택" })
          }
          onLevelChange={(key, value) => onGearLevelChange("armor", key, value)}
        />

        <GearSlotCard
          title="보호 장갑"
          item={gloves}
          levels={form.glovesLevels}
          onSelect={() =>
            onOpen({ kind: "gear", slot: "gloves", title: "보호 장갑 선택" })
          }
          onLevelChange={(key, value) =>
            onGearLevelChange("gloves", key, value)
          }
        />

        <GearSlotCard
          title="부품 1"
          item={kit1}
          levels={form.kit1Levels}
          onSelect={() =>
            onOpen({ kind: "gear", slot: "kit1", title: "부품 1 선택" })
          }
          onLevelChange={(key, value) => onGearLevelChange("kit1", key, value)}
        />

        <GearSlotCard
          title="부품 2"
          item={kit2}
          levels={form.kit2Levels}
          onSelect={() =>
            onOpen({ kind: "gear", slot: "kit2", title: "부품 2 선택" })
          }
          onLevelChange={(key, value) => onGearLevelChange("kit2", key, value)}
        />
      </div>

      {gearTotalRows.length > 0 ? (
        <div className="mt-4 border-t border-white/10 pt-4">
          <h3 className="mb-3 text-sm font-black text-[#ffdc70]">
            장비 능력치 합산
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {gearTotalRows.map((item) => (
              <StatLine
                key={item.label}
                label={item.label}
                value={
                  item.percent
                    ? `+${formatPercent(item.value)}`
                    : `+${Math.floor(Number(item.value)).toLocaleString()}`
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function FinalStatPanel({
  finalStats,
}: {
  finalStats: ReturnType<typeof calculateFinalStats>;
}) {
  const [openedStatKey, setOpenedStatKey] = useState<string | null>(null);

  type BonusStatKey = keyof ReturnType<typeof createBonusStats>;

  function toggle(key: string) {
    setOpenedStatKey((prev) => (prev === key ? null : key));
  }

  function getFlatDetailRows(statKey: "hp" | "atk" | "str" | "dex" | "int" | "will") {
    const breakdown = finalStats.bonusBreakdown;
    const rows: { label: string; value: string }[] = [];

    if (statKey === "atk") {
      rows.push({ label: "오퍼레이터 공격력", value: String(finalStats.operatorAttack) });
      rows.push({ label: "무기 기초 공격력", value: `+${finalStats.weaponAttack}` });
    } else {
      rows.push({ label: "기본 능력치", value: String(finalStats.baseStats[statKey]) });
    }

    const gearValue = statKey === "atk" ? 0 : breakdown.gear[statKey];
    const trustValue = statKey === "atk" ? 0 : breakdown.trust[statKey];
    const breakthroughValue = statKey === "atk" ? 0 : breakdown.breakthrough[statKey];
    const weaponValue = statKey === "atk" ? 0 : breakdown.weapon[statKey];
    const setEffectValue = statKey === "atk" ? 0 : breakdown.setEffect[statKey];

    if (gearValue) rows.push({ label: "장비 능력치", value: `+${Math.floor(gearValue)}` });
    if (trustValue) rows.push({ label: "신뢰도 보너스", value: `+${Math.floor(trustValue)}` });
    if (breakthroughValue) rows.push({ label: "잠재능력", value: `+${Math.floor(breakthroughValue)}` });
    if (weaponValue) rows.push({ label: "무기 옵션", value: `+${Math.floor(weaponValue)}` });
    if (setEffectValue) rows.push({ label: "세트 효과", value: `+${Math.floor(setEffectValue)}` });

    if (statKey === finalStats.mainKey) {
      if (breakdown.mainFlat) {
        rows.push({ label: `주요 능력치 고정 증가 (${finalStats.mainLabel})`, value: `+${breakdown.mainFlat}` });
      }
      if (breakdown.mainStatRate) {
        rows.push({ label: `주요 능력치 증가 (${finalStats.mainLabel})`, value: `+${formatPercent(breakdown.mainStatRate)}` });
      }
    }

    if (statKey === finalStats.subKey) {
      if (breakdown.subFlat) {
        rows.push({ label: `보조 능력치 고정 증가 (${finalStats.subLabel})`, value: `+${breakdown.subFlat}` });
      }
      if (breakdown.subStatRate) {
        rows.push({ label: `보조 능력치 증가 (${finalStats.subLabel})`, value: `+${formatPercent(breakdown.subStatRate)}` });
      }
    }

    if (statKey === "hp" && finalStats.str > 0) {
      rows.push({ label: "힘 기반 체력 보정", value: `+${Math.floor(finalStats.str * 5)}` });
    }

    if (statKey === "hp") {
      const hpPercentSources = [
        { label: "장비 최대 생명력", stat: breakdown.gear.hpPercent ?? 0 },
        { label: "신뢰도 최대 생명력", stat: breakdown.trust.hpPercent ?? 0 },
        { label: "잠재능력 최대 생명력", stat: breakdown.breakthrough.hpPercent ?? 0 },
        { label: "무기 최대 생명력", stat: breakdown.weapon.hpPercent ?? 0 },
        { label: "세트 효과 최대 생명력", stat: breakdown.setEffect.hpPercent ?? 0 },
      ];

      for (const source of hpPercentSources) {
        if (source.stat) {
          rows.push({ label: source.label, value: `+${formatPercent(source.stat)}` });
        }
      }
    }

    if (statKey === "atk") {
      if (finalStats.attackBonus) {
        rows.push({ label: "공격력 보너스", value: `+${formatPercent(finalStats.attackBonus)}` });
      }
      if (finalStats.statBonus) {
        rows.push({ label: "능력치 보너스", value: `+${formatPercent(finalStats.statBonus)}` });
      }
    }

    return rows;
  }

  function getPercentDetailRows(
    key: keyof ReturnType<typeof createBonusStats>,
    baseValue = 0,
  ) {
    const breakdown = finalStats.bonusBreakdown;
    const rows: { label: string; value: string }[] = [];
    const sources = [
      { label: "장비 속성", stat: breakdown.gear[key] ?? 0 },
      { label: "신뢰도 보너스", stat: breakdown.trust[key] ?? 0 },
      { label: "잠재능력", stat: breakdown.breakthrough[key] ?? 0 },
      { label: "무기 옵션", stat: breakdown.weapon[key] ?? 0 },
      { label: "세트 효과", stat: breakdown.setEffect[key] ?? 0 },
    ];

    if (baseValue) rows.push({ label: "기본값", value: formatPercent(baseValue) });

    for (const source of sources) {
      if (source.stat) {
        rows.push({ label: source.label, value: `+${formatPercent(source.stat)}` });
      }
    }

    return rows;
  }


  function getCoreStatValue(key?: "str" | "dex" | "int" | "will") {
    if (!key) return 0;
    if (key === "str") return finalStats.str;
    if (key === "dex") return finalStats.dex;
    if (key === "int") return finalStats.int;
    return finalStats.will;
  }

  return (
    <Panel title="최종 스탯">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <StatLine
          label="체력"
          value={finalStats.hp}
          details={getFlatDetailRows("hp")}
          opened={openedStatKey === "hp"}
          onClick={() => toggle("hp")}
        />
        <StatLine
          label="치명타 확률"
          value={formatPercent(finalStats.critRate)}
          details={getPercentDetailRows("critRate", 5)}
          opened={openedStatKey === "critRate"}
          onClick={() => toggle("critRate")}
        />
        <StatLine
          label="공격력"
          value={finalStats.atk}
          details={getFlatDetailRows("atk")}
          opened={openedStatKey === "atk"}
          onClick={() => toggle("atk")}
        />
        <StatLine
          label="치명타 피해"
          value={formatPercent(finalStats.critDamage)}
          details={getPercentDetailRows("critDamage", 50)}
          opened={openedStatKey === "critDamage"}
          onClick={() => toggle("critDamage")}
        />
        <StatLine
          label="힘"
          value={finalStats.str}
          role={finalStats.mainKey === "str" ? "main" : finalStats.subKey === "str" ? "sub" : undefined}
          details={getFlatDetailRows("str")}
          opened={openedStatKey === "str"}
          onClick={() => toggle("str")}
        />
        <StatLine
          label="궁극기 충전 효율"
          value={formatPercent(finalStats.ultimateEfficiency)}
          details={getPercentDetailRows("ultimateEfficiency", 100)}
          opened={openedStatKey === "ultimateEfficiency"}
          onClick={() => toggle("ultimateEfficiency")}
        />
        <StatLine
          label="민첩"
          value={finalStats.dex}
          role={finalStats.mainKey === "dex" ? "main" : finalStats.subKey === "dex" ? "sub" : undefined}
          details={getFlatDetailRows("dex")}
          opened={openedStatKey === "dex"}
          onClick={() => toggle("dex")}
        />
        <StatLine
          label="방어력"
          value={finalStats.defense}
          details={[
            { label: "장비 방어력", value: `+${Math.floor(finalStats.bonusBreakdown.gear.defense).toLocaleString()}` },
            { label: "신뢰도 보너스", value: `+${Math.floor(finalStats.bonusBreakdown.trust.defense).toLocaleString()}` },
            { label: "잠재능력", value: `+${Math.floor(finalStats.bonusBreakdown.breakthrough.defense).toLocaleString()}` },
            { label: "무기 옵션", value: `+${Math.floor(finalStats.bonusBreakdown.weapon.defense).toLocaleString()}` },
            { label: "세트 효과", value: `+${Math.floor(finalStats.bonusBreakdown.setEffect.defense).toLocaleString()}` },
          ]}
          opened={openedStatKey === "defense"}
          onClick={() => toggle("defense")}
        />
        <StatLine
          label="지능"
          value={finalStats.int}
          role={finalStats.mainKey === "int" ? "main" : finalStats.subKey === "int" ? "sub" : undefined}
          details={getFlatDetailRows("int")}
          opened={openedStatKey === "int"}
          onClick={() => toggle("int")}
        />
        <StatLine
          label="공격력 보너스"
          value={formatPercent(finalStats.attackBonus)}
          details={getPercentDetailRows("atkBonus")}
          opened={openedStatKey === "attackBonus"}
          onClick={() => toggle("attackBonus")}
        />
        <StatLine
          label="의지"
          value={finalStats.will}
          role={finalStats.mainKey === "will" ? "main" : finalStats.subKey === "will" ? "sub" : undefined}
          details={getFlatDetailRows("will")}
          opened={openedStatKey === "will"}
          onClick={() => toggle("will")}
        />
        <StatLine
          label="능력치 보너스"
          value={formatPercent(finalStats.statBonus)}
          details={[
            ...(finalStats.mainKey ? [{ label: `주요 능력치 ${finalStats.mainLabel}`, value: `${getCoreStatValue(finalStats.mainKey)} × 0.5%` }] : []),
            ...(finalStats.subKey ? [{ label: `보조 능력치 ${finalStats.subLabel}`, value: `${getCoreStatValue(finalStats.subKey)} × 0.2%` }] : []),
          ]}
          opened={openedStatKey === "statBonus"}
          onClick={() => toggle("statBonus")}
        />
      </div>

    </Panel>
  );
}

function SetEffectPanel({
  setEffect,
}: {
  setEffect: ReturnType<typeof getActiveSetEffect>;
}) {
  return (
    <Panel title="세트 효과">
      {setEffect ? (
        <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white">
              {setEffect.name} 세트 ({setEffect.count}개)
            </h3>
            <span className="rounded-md bg-green-500/20 px-3 py-1 text-xs font-black text-green-300">
              활성
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            {setEffect.description}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-500">
          같은 세트 장비 3개 이상 장착 시 세트 효과가 활성화됩니다.
        </div>
      )}
    </Panel>
  );
}

function OperatorSkillCard({
  skill,
  value,
  onChange,
}: {
  skill: any;
  value: SkillLevel;
  onChange: (value: SkillLevel) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/45 p-3">
      <div className="relative h-20 rounded-lg bg-zinc-950">
        {skill?.icon ? (
          <Image
            src={skill.icon}
            alt={skill.name}
            fill
            sizes="90px"
            className="object-contain p-2"
          />
        ) : null}
      </div>

      <p className="mt-2 text-xs text-zinc-500">{skill?.typeLabel ?? "-"}</p>
      <p className="truncate text-sm font-black text-white">
        {skill?.name ?? "-"}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SkillLevel)}
        className="mt-2 w-full rounded-md border border-white/10 bg-black px-2 py-1 text-sm font-bold outline-none"
      >
        {SKILL_LEVELS.map((option) => (
          <option key={option} value={option}>
            {option.startsWith("M") ? option : `Lv. ${option}`}
          </option>
        ))}
      </select>
    </div>
  );
}


function highlightSignedNumbers(text: string) {
  const parts = text.split(/([+\-]\d+(?:\.\d+)?%?)/g);

  return parts.map((part, index) => {
    if (/^[+\-]\d+(?:\.\d+)?%?$/.test(part)) {
      return (
        <span key={index} className="font-black text-yellow-300">
          {part}
        </span>
      );
    }

    return part;
  });
}

function WeaponSkillSelect({
  title,
  skill,
  value,
  onChange,
}: {
  title: string;
  skill: any;
  value: string;
  onChange: (value: string) => void;
}) {
  const rank = getWeaponSkillRankValue(skill, value);
  const isSeriesSkill = title === "시리즈 스킬";
  const summary = !isSeriesSkill
    ? rank?.stats?.map((s: any) => `${s.label} ${s.value}`).join(" / ") || "-"
    : "";
  const description = getSkillDescriptionText(skill, rank);

  return (
    <div className="rounded-xl border border-white/10 bg-black/45 p-3">
      <div className="grid grid-cols-[1fr_150px] items-center gap-3">
        <div>
          <p className="text-sm font-black text-white">{title}</p>
          <p className="text-xs text-zinc-500">{skill?.name ?? "-"}</p>
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-white/10 bg-black px-3 py-2 text-sm font-bold outline-none"
        >
          {RANK_OPTIONS.map((rank) => (
            <option key={rank} value={rank}>
              Rank {rank} / 9
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 rounded-lg bg-[#08111a] px-3 py-2 text-sm">
        {isSeriesSkill ? (
          <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-300">
            {highlightSignedNumbers(description || "-")}
          </p>
        ) : (
          <p className="font-black text-yellow-300">{summary || "-"}</p>
        )}
      </div>
    </div>
  );
}

function GearSlotCard({
  title,
  item,
  levels,
  onSelect,
  onLevelChange,
}: {
  title: string;
  item?: SelectableItem;
  levels: GearSlotLevels;
  onSelect: () => void;
  onLevelChange: (key: keyof GearSlotLevels, value: GearLevelKey) => void;
}) {
  const ability1 = getGearValue(item, "ability1", levels.ability1);
  const ability2 = getGearValue(item, "ability2", levels.ability2);
  const attribute = getGearValue(item, "attribute", levels.attribute);

  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/45 p-3">
      <button
        type="button"
        onClick={onSelect}
        className="grid w-full grid-cols-[64px_minmax(0,1fr)] items-center gap-3 text-left"
      >
        <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-zinc-950">
          {item ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="64px"
              className="object-contain p-2"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-zinc-500">{title}</p>

          <h3 className="truncate text-base font-black text-white">
            {item?.name ?? `${title} 선택`}
          </h3>

          <p className="mt-1 truncate text-xs font-bold text-yellow-300">
            Lv.{item?.raw?.level ?? "-"} · {item?.setName ?? "-"}
          </p>
        </div>
      </button>

      {item ? (
        <div className="mt-3 grid gap-2">
          <GearLevelLine
            label={ability1.label}
            value={ability1.value}
            level={levels.ability1}
            onChange={(value) => onLevelChange("ability1", value)}
          />

          <GearLevelLine
            label={ability2.label}
            value={ability2.value}
            level={levels.ability2}
            onChange={(value) => onLevelChange("ability2", value)}
          />

          <GearLevelLine
            label={attribute.label}
            value={attribute.value}
            level={levels.attribute}
            onChange={(value) => onLevelChange("attribute", value)}
          />
        </div>
      ) : null}
    </div>
  );
}

function GearLevelLine({
  label,
  value,
  level,
  onChange,
}: {
  label: string;
  value: string;
  level: GearLevelKey;
  onChange: (value: GearLevelKey) => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_96px] items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-2">
      <p className="min-w-0 truncate text-xs font-bold text-zinc-300">
        {label}: <span className="text-yellow-300">{value}</span>
      </p>

      <select
        value={level}
        onChange={(e) => onChange(e.target.value as GearLevelKey)}
        className="w-[96px] rounded-md border border-white/10 bg-black px-2 py-1 text-xs font-bold outline-none"
      >
        {GEAR_LEVEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatLine({
  label,
  value,
  role,
  details,
  opened = false,
  onClick,
}: {
  label: string;
  value: number | string;
  role?: "main" | "sub";
  details?: { label: string; value: string }[];
  opened?: boolean;
  onClick?: () => void;
}) {
  const icon = statIconMap[label];
  const hasDetails = Boolean(onClick);
  const roleClass =
    role === "main"
      ? "border-yellow-400/70 bg-yellow-400/5"
      : role === "sub"
        ? "border-zinc-500/70 bg-white/[0.03]"
        : "border-transparent";

  return (
    <div
      className={`relative overflow-visible rounded-md border ${roleClass}`}
      title={
        role === "main"
          ? "주요 능력치"
          : role === "sub"
            ? "보조 능력치"
            : undefined
      }
    >
      <button
        type="button"
        disabled={!hasDetails}
        onClick={onClick}
        className="flex w-full items-center justify-between gap-3 px-2 py-1.5 text-left transition enabled:hover:bg-white/[0.04] disabled:cursor-default"
      >
        <div className="flex min-w-0 items-center gap-2">
          {icon ? (
            <div className="relative h-5 w-5 shrink-0">
              <Image
                src={icon}
                alt={label}
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>
          ) : null}
          <span className="truncate text-sm text-zinc-400">{label}</span>
          {role ? (
            <span
              className={
                role === "main"
                  ? "rounded-full border border-yellow-400/40 px-1.5 py-[1px] text-[10px] font-black text-yellow-300"
                  : "rounded-full border border-zinc-500/50 px-1.5 py-[1px] text-[10px] font-black text-zinc-300"
              }
            >
              {role === "main" ? "주" : "보조"}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-black text-[#ffdc70]">{value}</span>
          {hasDetails ? (
            <span
              className={`text-[10px] text-zinc-500 transition ${
                opened ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          ) : null}
        </div>
      </button>

      {opened ? (
        <>
          <button
            type="button"
            aria-label="스탯 상세 닫기"
            className="fixed inset-0 z-30 cursor-default bg-transparent"
            onClick={onClick}
          />
          <div
            className="absolute left-full top-0 z-40 ml-2 w-[270px] rounded-xl border border-yellow-500/20 bg-[#05070b] px-3 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
          <div className="mb-2 flex items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-xs font-black text-yellow-300">{label} 증가 내역</span>
            <span className="text-xs font-black text-[#ffdc70]">{value}</span>
          </div>

          {details && details.length > 0 ? (
            <div className="grid gap-1.5">
              {details
                .filter((detail) => !["+0", "+0%", "+0.0%", "0"].includes(detail.value))
                .map((detail) => (
                  <div
                    key={`${label}-${detail.label}-${detail.value}`}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="min-w-0 truncate text-zinc-500">{detail.label}</span>
                    <span className="shrink-0 font-black text-yellow-200">{detail.value}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500">증가 내역이 없습니다.</p>
          )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/35 p-3">
      <p className="text-xs text-zinc-500">{title}</p>
      <p className="mt-1 text-sm font-black text-white">{value || "-"}</p>
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm font-black outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            Lv. {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function OperatorBreakthroughSelect({
  operator,
  value,
  onChange,
}: {
  operator?: SelectableItem;
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedStage = Math.max(0, Number(value) || 0);

  const activeDescriptions = Array.from({ length: selectedStage }, (_, index) => {
    const stage = index + 1;

    return {
      stage,
      icon: `/icons/potential/${stage}.webp`,
      text: getOperatorBreakthroughText(operator, String(stage)),
    };
  });

  return (
    <div className="grid gap-3">
      <span className="text-xs text-zinc-500">잠재능력</span>

      <div className="grid grid-cols-6 gap-2">
        <button
          type="button"
          onClick={() => onChange("0")}
          className={[
            "flex h-10 items-center justify-center rounded-lg border bg-black/70 text-xs font-black transition",
            value === "0"
              ? "border-yellow-400 text-yellow-300 shadow-[0_0_14px_rgba(255,210,74,0.25)]"
              : "border-white/10 text-zinc-400 hover:border-yellow-400/40",
          ].join(" ")}
          title="잠재능력 미적용"
        >
          0
        </button>

        {[1, 2, 3, 4, 5].map((stage) => {
          const active = selectedStage >= stage;
          const selected = value === String(stage);

          return (
            <button
              key={stage}
              type="button"
              onClick={() => onChange(String(stage))}
              className={[
                "relative h-10 rounded-lg border bg-black/70 transition",
                selected
                  ? "border-yellow-400 shadow-[0_0_14px_rgba(255,210,74,0.35)]"
                  : active
                    ? "border-yellow-400/45"
                    : "border-white/10 hover:border-yellow-400/40",
              ].join(" ")}
              title={getOperatorBreakthroughText(operator, String(stage))}
            >
              <Image
                src={`/icons/potential/${stage}.webp`}
                alt={`${stage}단계 잠재능력`}
                fill
                sizes="40px"
                className={[
                  "object-contain p-1.5 transition",
                  active ? "opacity-100" : "opacity-35",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>

      {activeDescriptions.length > 0 ? (
        <div className="grid gap-2">
          {activeDescriptions.map((item) => (
            <div
              key={item.stage}
              className="grid grid-cols-[34px_1fr] items-start gap-2 rounded-lg border border-white/10 bg-black/35 p-2"
            >
              <div className="relative h-7 w-7 shrink-0">
                <Image
                  src={item.icon}
                  alt={`${item.stage}단계 잠재능력`}
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>

              <p className="text-xs leading-relaxed text-zinc-300">
                <span className="mr-2 font-black text-yellow-300">
                  {item.stage}단계
                </span>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-white/10 bg-black/35 p-2 text-xs text-zinc-500">
          잠재능력 미적용
        </p>
      )}
    </div>
  );
}

function OptionSelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm font-black outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PickerModal({
  picker,
  items,
  keyword,
  rarityFilter,
  elementFilter,
  classFilter,
  operatorWeaponFilter,
  weaponTypeFilter,
  seriesFilter,
  gearSetFilter,
  gearAbilityFilter,
  gearAttributeFilter,
  gearLevelFilter,
  onKeywordChange,
  onRarityChange,
  onElementChange,
  onClassChange,
  onOperatorWeaponChange,
  onWeaponTypeChange,
  onSeriesChange,
  onGearSetChange,
  onGearAbilityChange,
  onGearAttributeChange,
  onGearLevelChange,
  onClose,
  onPick,
}: {
  picker: PickerState;
  items: SelectableItem[];
  keyword: string;
  rarityFilter: string;
  elementFilter: string;
  classFilter: string;
  operatorWeaponFilter: string;
  weaponTypeFilter: string;
  seriesFilter: string;
  gearSetFilter: string;
  gearAbilityFilter: string;
  gearAttributeFilter: string;
  gearLevelFilter: string;
  onKeywordChange: (value: string) => void;
  onRarityChange: (value: string) => void;
  onElementChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onOperatorWeaponChange: (value: string) => void;
  onWeaponTypeChange: (value: string) => void;
  onSeriesChange: (value: string) => void;
  onGearSetChange: (value: string) => void;
  onGearAbilityChange: (value: string) => void;
  onGearAttributeChange: (value: string) => void;
  onGearLevelChange: (value: string) => void;
  onClose: () => void;
  onPick: (item: SelectableItem) => void;
}) {
  const isOperator = picker.kind === "operator";
  const isWeapon = picker.kind === "weapon";
  const isGear = picker.kind === "gear";

  const operatorWeaponTypes: string[] = Array.from(
    new Set(
      operatorItems
        .map((item) => String(item.raw?.weapon ?? item.raw?.weaponType ?? ""))
        .filter(Boolean),
    ),
  ).sort(
    (a, b) => orderIndex(weaponTypeOrder, a) - orderIndex(weaponTypeOrder, b),
  );

  const weaponTypes: string[] = Array.from(
    new Set(weaponItems.map(getWeaponTypeKey).filter(Boolean)),
  ).sort(
    (a, b) => orderIndex(weaponTypeOrder, a) - orderIndex(weaponTypeOrder, b),
  );

  const weaponSeries: string[] = Array.from(
    new Set(
      weaponItems
        .map((item) => String(item.raw?.series ?? item.raw?.seriesName ?? ""))
        .filter(Boolean),
    ),
  );

  const gearSets: string[] = Array.from(
    new Set(
      gearItems
        .map((item) => item.setName)
        .filter((setName): setName is string => Boolean(setName)),
    ),
  ).sort((a, b) => orderIndex(gearSetOrder, a) - orderIndex(gearSetOrder, b));

  return (
    <PickerShell
      title={picker.title}
      count={items.length}
      searchValue={keyword}
      searchPlaceholder="이름 / 코드 검색"
      onSearch={onKeywordChange}
      onClose={onClose}
      aside={
        <>
          {!isGear ? (
            <SelectFilterGroup title="레어도">
              <SelectFilterButton
                active={rarityFilter === "all"}
                label="전체"
                onClick={() => onRarityChange("all")}
              />

              {[6, 5, 4, 3].map((value) => (
                <SelectFilterButton
                  key={value}
                  active={rarityFilter === String(value)}
                  label={`${value}성`}
                  iconSrc={rarityIconMap[value]}
                  onClick={() => onRarityChange(String(value))}
                />
              ))}
            </SelectFilterGroup>
          ) : null}

          {isOperator ? (
            <>
              <SelectFilterGroup title="속성">
                <SelectFilterButton
                  active={elementFilter === "all"}
                  label="전체"
                  onClick={() => onElementChange("all")}
                />

                {Object.entries(elementLabelMap).map(([key, label]) => (
                  <SelectFilterButton
                    key={key}
                    active={elementFilter === key}
                    label={label}
                    iconSrc={elementIconMap[key]}
                    onClick={() => onElementChange(key)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="클래스">
                <SelectFilterButton
                  active={classFilter === "all"}
                  label="전체"
                  onClick={() => onClassChange("all")}
                />

                {Object.entries(classLabelMap).map(([key, label]) => (
                  <SelectFilterButton
                    key={key}
                    active={classFilter === key}
                    label={label}
                    iconSrc={classIconMap[key]}
                    onClick={() => onClassChange(key)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="무기" last>
                <SelectFilterButton
                  active={operatorWeaponFilter === "all"}
                  label="전체"
                  onClick={() => onOperatorWeaponChange("all")}
                />

                {operatorWeaponTypes.map((type) => (
                  <SelectFilterButton
                    key={type}
                    active={operatorWeaponFilter === type}
                    label={weaponTypeLabelMap[type] ?? type}
                    iconSrc={weaponIconMap[type]}
                    onClick={() => onOperatorWeaponChange(type)}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}

          {isWeapon ? (
            <>
              <SelectFilterGroup title="무기 타입">
                <SelectFilterButton
                  active={weaponTypeFilter === "all"}
                  label="전체"
                  onClick={() => onWeaponTypeChange("all")}
                />

                {weaponTypes.map((type) => (
                  <SelectFilterButton
                    key={type}
                    active={weaponTypeFilter === type}
                    label={weaponTypeLabelMap[type] ?? type}
                    iconSrc={weaponIconMap[type]}
                    onClick={() => onWeaponTypeChange(type)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="시리즈" last>
                <SelectFilterButton
                  active={seriesFilter === "all"}
                  label="전체"
                  onClick={() => onSeriesChange("all")}
                />

                {weaponSeries.map((series) => (
                  <SelectFilterButton
                    key={series}
                    active={seriesFilter === series}
                    label={series}
                    onClick={() => onSeriesChange(series)}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}

          {isGear ? (
            <>
              <SelectFilterGroup title="세트 유형">
                <SelectFilterButton
                  active={gearSetFilter === "all"}
                  label="전체"
                  onClick={() => onGearSetChange("all")}
                />

                {gearSets.map((setName) => (
                  <SelectFilterButton
                    key={setName}
                    active={gearSetFilter === setName}
                    label={setName}
                    onClick={() => onGearSetChange(setName)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="속성">
                {gearAttributeOptions.map((option) => (
                  <SelectFilterButton
                    key={option.value}
                    active={gearAttributeFilter === option.value}
                    label={option.label}
                    onClick={() => onGearAttributeChange(option.value)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="능력치">
                {gearAbilityOptions.map((option) => (
                  <SelectFilterButton
                    key={option.value}
                    active={gearAbilityFilter === option.value}
                    label={option.label}
                    onClick={() => onGearAbilityChange(option.value)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="품질">
                <SelectFilterButton
                  active={rarityFilter === "all"}
                  label="전체"
                  onClick={() => onRarityChange("all")}
                />
                {[5, 4, 3, 2, 1].map((value) => (
                  <SelectFilterButton
                    key={value}
                    active={rarityFilter === String(value)}
                    label={`${value}품질`}
                    color={qualityColorMap[value]}
                    onClick={() => onRarityChange(String(value))}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="장비 레벨" last>
                <SelectFilterButton
                  active={gearLevelFilter === "all"}
                  label="전체"
                  onClick={() => onGearLevelChange("all")}
                />
                {[70, 50, 36, 28, 20, 10].map((level) => (
                  <SelectFilterButton
                    key={level}
                    active={gearLevelFilter === String(level)}
                    label={`Lv. ${level}`}
                    onClick={() => onGearLevelChange(String(level))}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}
        </>
      }
    >
      {items.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pr-1">
          {items.map((item) => {
            if (picker.kind === "operator") {
              return (
                <OperatorSelectCard
                  key={item.slug}
                  operator={item.raw}
                  active={false}
                  onClick={() => onPick(item)}
                />
              );
            }

            if (picker.kind === "weapon") {
              return (
                <WeaponSelectCard
                  key={item.slug}
                  weapon={item.raw}
                  active={false}
                  onClick={() => onPick(item)}
                />
              );
            }

            return (
              <GearSelectCard
                key={item.slug}
                gear={item.raw}
                active={false}
                onClick={() => onPick(item)}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[260px] items-center justify-center rounded-[20px] border border-yellow-500/10 bg-black p-6 text-center text-sm text-zinc-500">
          조건에 맞는 항목이 없습니다.
        </div>
      )}
    </PickerShell>
  );
}

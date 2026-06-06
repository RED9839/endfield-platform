"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { sortOperatorSelectList } from "@/data/operator-sort";
import { sortWeaponSelectList } from "@/data/weapons-sort";
import { gearSetOrder, sortGearSelectList } from "@/data/gear-sort";
import type { CommonGearSlot } from "@/app/components/select/CommonSelectPanel";


const CommonSelectPanel = dynamic(
  () => import("@/app/components/select/CommonSelectPanel"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 text-sm font-bold text-zinc-500 backdrop-blur-sm">
        선택 패널을 불러오는 중...
      </div>
    ),
  },
);

type EditorData = {
  operators: any[];
  weapons: any[];
  gears: any[];
};

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
  "치유 효율": "/icons/stats/heal_efficiency.webp",
  "치유 효율 보너스": "/icons/stats/heal_efficiency.webp",
  "오리지늄 아츠 강도": "/icons/stats/originium_arts.webp",
  "스킬 피해 보너스": "/icons/stats/skill_damage.webp",
  "일반 공격 피해 보너스": "/icons/stats/normal_attack_damage.webp",
  "배틀 스킬 피해 보너스": "/icons/stats/skill_damage.webp",
  "연계 스킬 피해 보너스": "/icons/stats/combo_skill_damage.webp",
  "궁극기 피해 보너스": "/icons/stats/ultimate_damage.webp",
  "물리 피해 보너스": "/icons/stats/physical_damage.webp",
  "냉기 피해 보너스": "/icons/elements/cryo.webp",
  "전기 피해 보너스": "/icons/elements/electric.webp",
  "열기 피해 보너스": "/icons/elements/heat.webp",
  "자연 피해 보너스": "/icons/elements/nature.webp",
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

const weaponTypeOrder = [
  "sword",
  "artsunit",
  "artsUnit",
  "greatsword",
  "polearm",
  "handcannon",
];

function orderIndex(list: string[], value: unknown) {
  const text = String(value ?? "");
  const index = list.indexOf(text);
  return index >= 0 ? index : 999;
}


function getWeaponTypeKey(item: SelectableItem) {
  return String(item.raw?.weaponType ?? item.raw?.type ?? "");
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

function toOperatorItem(operator: any): SelectableItem {
  const raw = operator as any;

  return {
    slug: raw.slug,
    name: raw.name,
    enName: raw.enName,
    image: raw.avatar ?? raw.image ?? `/operators/${raw.slug}/avatar.webp`,
    fullImage:
      raw.avatar ??
      raw.fullImage ??
      raw.image ??
      `/operators/${raw.slug}/avatar.webp`,
    rarity: raw.rarity,
    raw,
  };
}

function toWeaponItem(weapon: any): SelectableItem {
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

function toGearItem(gear: any): SelectableItem {
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


const SETTINGS_FORM_STORAGE_KEY = "endfield-operator-setting-form-v1";

function loadSavedForm(): FormState {
  if (typeof window === "undefined") return createDefaultForm();

  try {
    const saved = window.localStorage.getItem(SETTINGS_FORM_STORAGE_KEY);
    if (!saved) return createDefaultForm();

    return {
      ...createDefaultForm(),
      ...JSON.parse(saved),
    };
  } catch {
    return createDefaultForm();
  }
}

function saveFormToStorage(form: FormState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_FORM_STORAGE_KEY, JSON.stringify(form));
}

function clearSavedForm() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SETTINGS_FORM_STORAGE_KEY);
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

type GearDisplayStatRow = {
  label: string;
  value: number;
  percent: boolean;
  keys: string[];
};

const BONUS_STAT_KEYS = [
  "hp",
  "hpPercent",
  "atkBonus",
  "str",
  "dex",
  "int",
  "will",
  "mainStat",
  "subStat",
  "mainFlat",
  "subFlat",
  "critRate",
  "critDamage",
  "ultimateEfficiency",
  "healEfficiency",
  "originiumArts",
  "skillDamage",
  "allSkillDamage",
  "normalAttackDamage",
  "battleSkillDamage",
  "comboSkillDamage",
  "ultimateDamage",
  "physicalDamage",
  "artsDamage",
  "cryoDamage",
  "electricDamage",
  "heatDamage",
  "natureDamage",
  "unbalancedTargetDamage",
  "defense",
  "damageReduction",
] as const;

function getGearDisplayStatKeys(label: string, value: number, percent: boolean) {
  const testStats = createBonusStats();
  applyStatByLabel(testStats, label, value, percent, {
    allowDynamicStats: true,
  });

  const keys = BONUS_STAT_KEYS.filter((key) => Number(testStats[key] ?? 0) !== 0).map(String);

  for (const dynamicLabel of Object.keys(testStats.dynamicStats)) {
    keys.push(`dynamic:${dynamicLabel}`);
  }

  return keys.length > 0 ? keys : [`dynamic:${label}`];
}

function collectGearDisplayStats(
  gears: {
    item?: SelectableItem;
    levels: GearSlotLevels;
  }[],
): GearDisplayStatRow[] {
  const map = new Map<string, GearDisplayStatRow>();

  for (const gear of gears) {
    const rows = [
      getGearValue(gear.item, "ability1", gear.levels.ability1),
      getGearValue(gear.item, "ability2", gear.levels.ability2),
      getGearValue(gear.item, "attribute", gear.levels.attribute),
    ];

    for (const row of rows) {
      const label = String(row.label ?? "").trim();
      const valueText = String(row.value ?? "").trim();

      if (!label || label === "-" || !valueText || valueText === "-") continue;

      const value = parseNumber(valueText);
      if (!Number.isFinite(value) || value === 0) continue;

      const percent = valueText.includes("%");
      const keys = getGearDisplayStatKeys(label, value, percent);
      const mapKey = `${label}__${percent ? "percent" : "flat"}`;
      const prev = map.get(mapKey);

      if (prev) {
        map.set(mapKey, {
          ...prev,
          value: prev.value + value,
          keys: Array.from(new Set([...prev.keys, ...keys])),
        });
      } else {
        map.set(mapKey, {
          label,
          value,
          percent,
          keys,
        });
      }
    }
  }

  return [...map.values()];
}

function formatSignedStatValue(value: number, percent: boolean) {
  const sign = value > 0 ? "+" : "";
  if (percent) return `${sign}${formatPercent(value)}`;
  return `${sign}${Math.floor(value).toLocaleString()}`;
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
    originiumArts: 0,
    skillDamage: 0,
    allSkillDamage: 0,
    normalAttackDamage: 0,
    battleSkillDamage: 0,
    comboSkillDamage: 0,
    ultimateDamage: 0,
    physicalDamage: 0,
    artsDamage: 0,
    cryoDamage: 0,
    electricDamage: 0,
    heatDamage: 0,
    natureDamage: 0,
    unbalancedTargetDamage: 0,
    defense: 0,
    damageReduction: 0,
    dynamicStats: {} as Record<string, { value: number; isPercent: boolean }>,
  };
}

function addDynamicStat(
  target: ReturnType<typeof createBonusStats>,
  label: string,
  value: number,
  isPercent = false,
) {
  const normalizedLabel = cleanPotentialTextPart(String(label ?? ""))
    .replace(/[：:]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedLabel || !Number.isFinite(value) || value === 0) return;

  const current = target.dynamicStats[normalizedLabel];
  target.dynamicStats[normalizedLabel] = {
    value: (current?.value ?? 0) + value,
    isPercent,
  };
}

function applyStatByLabel(
  target: ReturnType<typeof createBonusStats>,
  label: string,
  value: number,
  isPercent = false,
  options: { allowDynamicStats?: boolean } = {},
) {
  const normalizedLabel = cleanPotentialTextPart(String(label ?? ""))
    .replace(/[：:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const allowDynamicStats = options.allowDynamicStats ?? true;

  if (!normalizedLabel || !Number.isFinite(value) || value === 0) return;

  let handled = false;

  if (
    normalizedLabel.includes("모든 능력치") ||
    normalizedLabel.includes("모든 스탯")
  ) {
    target.str += value;
    target.dex += value;
    target.int += value;
    target.will += value;
    return;
  }

  if (
    normalizedLabel.includes("최대 생명력") ||
    normalizedLabel.includes("생명력") ||
    normalizedLabel.includes("체력")
  ) {
    if (isPercent) target.hpPercent += value;
    else target.hp += value;
    handled = true;
  }

  if (normalizedLabel.includes("공격력")) {
    target.atkBonus += value;
    handled = true;
  }

  if (normalizedLabel.includes("주요 능력치")) {
    if (isPercent) target.mainStat += value;
    else target.mainFlat += value;
    handled = true;
  } else if (normalizedLabel.includes("보조 능력치")) {
    if (isPercent) target.subStat += value;
    else target.subFlat += value;
    handled = true;
  } else {
    if (normalizedLabel.includes("힘")) {
      target.str += value;
      handled = true;
    }
    if (normalizedLabel.includes("민첩")) {
      target.dex += value;
      handled = true;
    }
    if (normalizedLabel.includes("지능")) {
      target.int += value;
      handled = true;
    }
    if (normalizedLabel.includes("의지")) {
      target.will += value;
      handled = true;
    }
  }

  if (normalizedLabel.includes("치명타 확률") || normalizedLabel.includes("치명률")) {
    target.critRate += value;
    handled = true;
  }
  if (normalizedLabel.includes("치명타 피해")) {
    target.critDamage += value;
    handled = true;
  }
  if (normalizedLabel.includes("궁극기 충전")) {
    target.ultimateEfficiency += value;
    handled = true;
  }
  if (normalizedLabel.includes("치유 효율")) {
    target.healEfficiency += value;
    handled = true;
  }

  if (normalizedLabel.includes("연계 스킬")) {
    target.comboSkillDamage += value;
    handled = true;
  } else if (normalizedLabel.includes("배틀 스킬")) {
    target.battleSkillDamage += value;
    handled = true;
  } else if (normalizedLabel.includes("일반 공격")) {
    target.normalAttackDamage += value;
    handled = true;
  } else if (normalizedLabel.includes("궁극기 피해")) {
    target.ultimateDamage += value;
    handled = true;
  } else if (normalizedLabel.includes("모든 스킬")) {
    target.allSkillDamage += value;
    handled = true;
  } else if (normalizedLabel.includes("스킬 피해")) {
    target.skillDamage += value;
    handled = true;
  }

  if (normalizedLabel.includes("주는 물리 피해")) {
    if (allowDynamicStats) addDynamicStat(target, normalizedLabel, value, isPercent);
    handled = true;
  } else if (normalizedLabel.includes("물리 피해")) {
    target.physicalDamage += value;
    handled = true;
  }

  if (normalizedLabel.includes("오리지늄 아츠 강도")) {
    target.originiumArts += value;
    handled = true;
  }

  if (normalizedLabel.includes("아츠 피해")) {
    target.artsDamage += value;
    handled = true;
  }

  if (normalizedLabel.includes("냉기") && normalizedLabel.includes("전기")) {
    target.cryoDamage += value;
    target.electricDamage += value;
    handled = true;
  } else if (normalizedLabel.includes("열기") && normalizedLabel.includes("자연")) {
    target.heatDamage += value;
    target.natureDamage += value;
    handled = true;
  } else {
    if (normalizedLabel.includes("냉기 피해")) {
      target.cryoDamage += value;
      handled = true;
    }
    if (normalizedLabel.includes("전기 피해")) {
      target.electricDamage += value;
      handled = true;
    }
    if (normalizedLabel.includes("열기 피해")) {
      target.heatDamage += value;
      handled = true;
    }
    if (normalizedLabel.includes("자연 피해")) {
      target.natureDamage += value;
      handled = true;
    }
  }

  if (normalizedLabel.includes("불균형")) {
    target.unbalancedTargetDamage += value;
    handled = true;
  }
  if (normalizedLabel.includes("방어력")) {
    target.defense += value;
    handled = true;
  }
  if (normalizedLabel.includes("피해 감소")) {
    target.damageReduction += value;
    handled = true;
  }

  if (!handled && allowDynamicStats) {
    addDynamicStat(target, normalizedLabel, value, isPercent);
  }
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
    const labelText = String(stat.label ?? "").trim();
    const valueText = String(stat.value ?? "").trim();
    const value = parseNumber(valueText);

    if (labelText && labelText !== "-" && Number.isFinite(value) && value !== 0) {
      applyStatByLabel(result, labelText, value, valueText.includes("%"), {
        allowDynamicStats: true,
      });
    }
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
  options: { allowDynamicStats?: boolean } = {},
) {
  if (!stats) return;

  if (typeof stats === "string" || typeof stats === "number") {
    applyBreakthroughTextStats(target, String(stats), options);
    return;
  }

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

      const rawValue = item?.value ?? item?.amount ?? item?.bonus ?? "";
      const valueText = String(rawValue);
      const value = parseNumber(valueText);

      if (label && Number.isFinite(value) && value !== 0) {
        applyStatByLabel(
          target,
          label,
          value,
          valueText.includes("%"),
          options,
        );
      } else {
        applyBreakthroughTextStats(target, collectBonusText(item), options);
      }
    }

    return;
  }

  if (typeof stats === "object") {
    const normalizedKeyMap: Record<string, string> = {
      hp: "체력",
      health: "체력",
      life: "체력",
      생명력: "체력",
      체력: "체력",

      atk: "공격력",
      attack: "공격력",
      공격력: "공격력",

      str: "힘",
      strength: "힘",
      힘: "힘",

      dex: "민첩",
      agility: "민첩",
      agi: "민첩",
      민첩: "민첩",

      int: "지능",
      intelligence: "지능",
      지능: "지능",

      will: "의지",
      의지: "의지",

      critRate: "치명타 확률",
      critDamage: "치명타 피해",
      ultimateEfficiency: "궁극기 충전 효율",
      healEfficiency: "치유 효율",
      healEfficiencyBonus: "치유 효율",
      originiumArts: "오리지늄 아츠 강도",
      skillDamage: "스킬 피해 보너스",
      allSkillDamage: "모든 스킬 피해 보너스",
      normalAttackDamage: "일반 공격 피해 보너스",
      battleSkillDamage: "배틀 스킬 피해 보너스",
      comboSkillDamage: "연계 스킬 피해 보너스",
      ultimateDamage: "궁극기 피해 보너스",
      physicalDamage: "물리 피해 보너스",
      artsDamage: "아츠 피해 보너스",
      cryoElectricDamage: "냉기와 전기 피해 보너스",
      heatNatureDamage: "열기와 자연 피해 보너스",
      cryoDamage: "냉기 피해 보너스",
      electricDamage: "전기 피해 보너스",
      heatDamage: "열기 피해 보너스",
      natureDamage: "자연 피해 보너스",
      unbalancedTargetDamage: "불균형 목표에 주는 피해 보너스",
      defense: "방어력",
      damageReduction: "모든 피해 감소",
      mainStat: "주요 능력치",
      subStat: "보조 능력치",
      mainFlat: "주요 능력치",
      subFlat: "보조 능력치",
    };

    for (const [key, value] of Object.entries(stats as Record<string, unknown>)) {
      if (value === null || value === undefined) continue;

      if (typeof value === "object") {
        applyFlatStatsFromObject(target, value, options);
        continue;
      }

      const valueText = String(value);
      const amount = parseNumber(valueText);

      if (!Number.isFinite(amount) || amount === 0) continue;

      const label = normalizedKeyMap[key] ?? key;

      applyStatByLabel(
        target,
        label,
        amount,
        valueText.includes("%"),
        options,
      );
    }

    applyBreakthroughTextStats(target, collectBonusText(stats), options);
  }
}

function cleanPotentialTextPart(part: string) {
  return String(part ?? "")
    .replace(/[，。]/g, ",")
    .replace(/^[+＋]?\d+\s*(?:단계|돌파|잠재능력|잠재)?\s*/g, "")
    .replace(/^잠재능력\s*보너스\s*/g, "")
    .replace(/^효과\s*[:：]?\s*/g, "")
    .replace(/^[-–—·•\s]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseStatTextPart(part: string) {
  const cleaned = cleanPotentialTextPart(part);
  if (!cleaned) return null;

  const patterns = [
    /(.*?)([+＋\-]?\d+(?:\.\d+)?)\s*(%)/,
    /(.*?)([+＋\-]?\d+(?:\.\d+)?)/,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (!match) continue;

    const label = String(match[1] ?? "")
      .replace(/[：:]/g, "")
      .replace(/[+＋]\s*$/g, "")
      .replace(/^[+＋]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const value = Number(String(match[2]).replace("＋", "+"));
    if (!label || !Number.isFinite(value)) continue;

    return {
      label,
      value,
      isPercent: Boolean(match[3]),
    };
  }

  return null;
}
function applyBreakthroughTextStats(
  target: ReturnType<typeof createBonusStats>,
  text: string,
  options: { allowDynamicStats?: boolean } = {},
) {
  if (!text) return;

  const normalized = text
    .replace(/[，。]/g, ",")
    .replace(/\r/g, ",")
    .replace(/\n/g, ",")
    .replace(/\//g, ",")
    .replace(/·/g, ",")
    .replace(/;/g, ",");

  const parts = normalized
    .split(",")
    .map((part) => cleanPotentialTextPart(part))
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes("전달자의 노래")) continue;

    const parsed = parseStatTextPart(part);
    if (!parsed) continue;

    applyStatByLabel(
      target,
      parsed.label,
      parsed.value,
      parsed.isPercent,
      options,
    );
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
    "치유 효율 보너스",
    "치유 효율",
    "오리지늄 아츠 강도",
    "물리 피해",
    "아츠 피해",
    "냉기와 전기 피해",
    "열기와 자연 피해",
    "냉기 피해",
    "전기 피해",
    "열기 피해",
    "자연 피해",
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

function getOperatorClassKey(operator?: SelectableItem) {
  const raw = operator?.raw ?? {};

  return String(
    raw.class ??
      raw.classKey ??
      raw.profession ??
      raw.job ??
      raw.role ??
      raw.position ??
      raw.type ??
      "",
  ).toLowerCase();
}

function getOperatorClassLabel(operator?: SelectableItem) {
  const raw = operator?.raw ?? {};

  return String(
    raw.className ?? raw.classLabel ?? raw.jobLabel ?? raw.professionLabel ?? "",
  );
}

function isSupporterOperator(operator?: SelectableItem) {
  const classKey = getOperatorClassKey(operator);
  const classLabel = getOperatorClassLabel(operator);

  return (
    classKey.includes("supporter") ||
    classKey.includes("support") ||
    classLabel.includes("서포터")
  );
}

function getStageNumber(item: any, fallbackIndex = 0) {
  const stage = Number(item?.stage ?? item?.rank ?? item?.level ?? item?.step ?? item?.phase);
  return Number.isFinite(stage) && stage > 0 ? stage : fallbackIndex + 1;
}

function getBreakthroughStatSource(stage: any) {
  return stage?.stats ?? stage?.bonus ?? stage?.attributes;
}

function applyBreakthroughStageStats(
  target: ReturnType<typeof createBonusStats>,
  stage: any,
  options: { allowDynamicStats?: boolean } = {},
) {
  const source = getBreakthroughStatSource(stage);

  applyFlatStatsFromObject(target, source, options);

  applyBreakthroughTextStats(
    target,
    collectBonusText([
      stage?.description,
      stage?.desc,
      stage?.summary,
      stage?.effect,
      stage?.name,
      stage?.label,
      stage?.title,
    ]),
    options,
  );
}

function isAdministratorOperator(operator?: SelectableItem) {
  const text = [
    operator?.slug,
    operator?.name,
    operator?.enName,
    operator?.raw?.slug,
    operator?.raw?.name,
    operator?.raw?.enName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    text.includes("administrator") ||
    text.includes("admin") ||
    text.includes("관리자")
  );
}

function isAntalOperator(operator?: SelectableItem) {
  const text = getDeepText([
    operator?.slug,
    operator?.name,
    operator?.enName,
    operator?.raw?.slug,
    operator?.raw?.name,
    operator?.raw?.enName,
  ]).toLowerCase();

  return text.includes("안탈") || text.includes("antal");
}

function isXaihiOperator(operator?: SelectableItem) {
  const text = getDeepText([
    operator?.slug,
    operator?.name,
    operator?.enName,
    operator?.raw?.slug,
    operator?.raw?.name,
    operator?.raw?.enName,
  ]).toLowerCase();

  return (
    text.includes("자이히") ||
    text.includes("xaihi") ||
    text.includes("zaihi") ||
    text.includes("xai he")
  );
}

function usesPhysicalDamagePotentialBonus(operator?: SelectableItem) {
  const text = getDeepText([
    operator?.slug,
    operator?.name,
    operator?.enName,
    operator?.raw?.slug,
    operator?.raw?.name,
    operator?.raw?.enName,
  ]).toLowerCase();

  return (
    text.includes("진천우") ||
    text.includes("chenqianyu") ||
    text.includes("chen qianyu") ||
    text.includes("dapan") ||
    text.includes("da pan")
  );
}

function applyManualSupporterBreakthroughStats(
  target: ReturnType<typeof createBonusStats>,
  operator: SelectableItem | undefined,
  activeRank: number,
) {
  if (!operator || activeRank < 4) return;

  if (isAntalOperator(operator)) {
    target.int += 10;
    target.hpPercent += 10;
    return;
  }

  if (isXaihiOperator(operator)) {
    target.int += 15;
    target.healEfficiency += 10;
  }
}

function getPotentialStatStage(operator?: SelectableItem): number | null {
  const text = getDeepText([
    operator?.slug,
    operator?.name,
    operator?.enName,
    operator?.raw?.slug,
    operator?.raw?.name,
    operator?.raw?.enName,
  ]).toLowerCase();

  // 펠리카 = 능력치 증가 잠재 없음
  if (
    text.includes("펠리카") ||
    text.includes("felica") ||
    text.includes("pelica")
  ) {
    return null;
  }

  // 아베웨나 / 판 = 3잠
  if (
    text.includes("아비웨나") ||
    text.includes("avywenna") ||
    text.includes("판") ||
    text.includes("pan")
  ) {
    return 3;
  }

  // 울프가드 = 1잠
  if (text.includes("울프가드") || text.includes("wolfguard")) {
    return 1;
  }

  // 스노우샤인 = 4잠
  if (text.includes("스노우샤인") || text.includes("snowshine")) {
    return 4;
  }

  // 플루라이트 = 1잠
  if (text.includes("플루라이트") || text.includes("fluorite")) {
    return 1;
  }

  // 에스텔라 = 4잠
  if (
    text.includes("에스텔라") ||
    text.includes("estella") ||
    text.includes("estelle")
  ) {
    return 4;
  }

  // 기본값 = 2잠
  return 2;
}

function getOperatorBreakthroughBonusStats(
  operator?: SelectableItem,
  rank = "0",
) {
  const target = createBonusStats();
  const activeRank = Math.max(0, Number(rank) || 0);

  if (!operator || activeRank <= 0) return target;
  if (isAdministratorOperator(operator)) return target;

  applyManualSupporterBreakthroughStats(target, operator, activeRank);

  if (isSupporterOperator(operator)) {
    return target;
  }

  const potentialStage = getPotentialStatStage(operator);

  if (potentialStage === null) {
    return target;
  }

  const items = getOperatorBreakthroughItems(operator);

  if (items.length <= 0 || activeRank < potentialStage) {
    return target;
  }

  const targetStage =
    items.find(
      (item, index) => getStageNumber(item, index) === potentialStage,
    ) ??
    items[potentialStage - 1] ??
    null;

  if (targetStage) {
    applyBreakthroughStageStats(target, targetStage, {
      allowDynamicStats: true,
    });

    if (usesPhysicalDamagePotentialBonus(operator)) {
      for (const [label, stat] of Object.entries(target.dynamicStats)) {
        if (!label.includes("주는 물리 피해")) continue;

        target.physicalDamage += stat.value;
        delete target.dynamicStats[label];
      }
    }
  }

  return target;
}

function getDeepText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(getDeepText).join(" ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(getDeepText).join(" ");
  }
  return "";
}

function isGilberta(operator?: SelectableItem) {
  const raw = operator?.raw ?? {};
  const text = getDeepText([
    operator?.name,
    operator?.enName,
    operator?.slug,
    raw.name,
    raw.enName,
    raw.slug,
    raw.talents,
    raw.talent,
    raw.traits,
  ]).toLowerCase();

  return (
    text.includes("질베르타") ||
    text.includes("gilberta") ||
    text.includes("gilbertha") ||
    text.includes("전달자의 노래")
  );
}

function isGilbertaSongTarget(operator?: SelectableItem) {
  if (!operator) return false;

  const raw = operator.raw ?? {};
  const classKey = getOperatorClassKey(operator);
  const classLabel = getOperatorClassLabel(operator);

  const classText = getDeepText([
    classKey,
    classLabel,
    raw.class,
    raw.classKey,
    raw.className,
    raw.classLabel,
    raw.profession,
    raw.professionKey,
    raw.professionName,
    raw.professionLabel,
    raw.job,
    raw.jobKey,
    raw.jobName,
    raw.jobLabel,
    raw.role,
    raw.roleKey,
    raw.roleName,
    raw.roleLabel,
    raw.position,
    raw.positionKey,
    raw.type,
    raw.typeKey,
    raw.tags,
  ]).toLowerCase();

  return (
    classText.includes("guard") ||
    classText.includes("caster") ||
    classText.includes("supporter") ||
    classText.includes("support") ||
    classText.includes("가드") ||
    classText.includes("캐스터") ||
    classText.includes("서포터")
  );
}

function getGilbertaSongBonus(rank = "0") {
  const activeRank = Number(rank) || 0;
  return activeRank >= 3 ? 12 : 7;
}

type PartyBuffSlot = {
  operator?: SelectableItem;
  form: FormState;
};

function getGilbertaSongBonusForTarget(
  targetOperator: SelectableItem | undefined,
  partySlots: PartyBuffSlot[],
) {
  if (!targetOperator) return 0;
  if (!isGilbertaSongTarget(targetOperator)) return 0;

  const gilbertaSlot = partySlots.find((slot) => isGilberta(slot.operator));
  if (!gilbertaSlot) return 0;

  return getGilbertaSongBonus(gilbertaSlot.form.operatorBreakthroughRank);
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
  target.originiumArts += stat.originiumArts;
  target.skillDamage += stat.skillDamage;
  target.allSkillDamage += stat.allSkillDamage;
  target.normalAttackDamage += stat.normalAttackDamage;
  target.battleSkillDamage += stat.battleSkillDamage;
  target.comboSkillDamage += stat.comboSkillDamage;
  target.ultimateDamage += stat.ultimateDamage;
  target.physicalDamage += stat.physicalDamage;
  target.artsDamage += stat.artsDamage;
  target.cryoDamage += stat.cryoDamage;
  target.electricDamage += stat.electricDamage;
  target.heatDamage += stat.heatDamage;
  target.natureDamage += stat.natureDamage;
  target.unbalancedTargetDamage += stat.unbalancedTargetDamage;
  target.defense += stat.defense;
  target.damageReduction += stat.damageReduction;

  for (const [label, data] of Object.entries(stat.dynamicStats)) {
    addDynamicStat(target, label, data.value, data.isPercent);
  }
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


function getWeaponSeriesFirstStatText(skill: any, rank: string) {
  const rankValue = getWeaponSkillRankValue(skill, rank);
  const firstStat = Array.isArray(rankValue?.stats) ? rankValue.stats[0] : null;

  if (!firstStat) return "";

  const label = String(firstStat?.label ?? "").trim();
  const value = String(firstStat?.value ?? "").trim();

  if (!label || !value) return "";

  return `${label} ${value}`.trim();
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
  partySlots?: PartyBuffSlot[];
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

  const gearDisplayStats = collectGearDisplayStats([
    { item: params.armor, levels: params.form.armorLevels },
    { item: params.gloves, levels: params.form.glovesLevels },
    { item: params.kit1, levels: params.form.kit1Levels },
    { item: params.kit2, levels: params.form.kit2Levels },
  ]);

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
    getWeaponSeriesFirstStatText(
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

  const gilbertaSongBonus = getGilbertaSongBonusForTarget(
    params.operator,
    params.partySlots ?? [{ operator: params.operator, form: params.form }],
  );

  bonus.ultimateEfficiency += gilbertaSongBonus;

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

  const totalBattleSkillDamage = bonus.battleSkillDamage + bonus.allSkillDamage;
  const totalComboSkillDamage = bonus.comboSkillDamage + bonus.allSkillDamage;
  const totalUltimateDamage = bonus.ultimateDamage + bonus.allSkillDamage;

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
    originiumArts: Math.floor(bonus.originiumArts),
    skillDamage: Math.floor(bonus.skillDamage * 10) / 10,
    allSkillDamage: Math.floor(bonus.allSkillDamage * 10) / 10,
    normalAttackDamage: Math.floor(bonus.normalAttackDamage * 10) / 10,
    battleSkillDamage: Math.floor(totalBattleSkillDamage * 10) / 10,
    comboSkillDamage: Math.floor(totalComboSkillDamage * 10) / 10,
    ultimateDamage: Math.floor(totalUltimateDamage * 10) / 10,
    physicalDamage: Math.floor(bonus.physicalDamage * 10) / 10,
    artsDamage: Math.floor(bonus.artsDamage * 10) / 10,
    cryoDamage: Math.floor(bonus.cryoDamage * 10) / 10,
    electricDamage: Math.floor(bonus.electricDamage * 10) / 10,
    heatDamage: Math.floor(bonus.heatDamage * 10) / 10,
    natureDamage: Math.floor(bonus.natureDamage * 10) / 10,
    unbalancedTargetDamage: Math.floor(bonus.unbalancedTargetDamage * 10) / 10,
    defense: Math.floor(bonus.defense),
    damageReduction: Math.floor(bonus.damageReduction * 10) / 10,
    gilbertaSongBonus: Math.floor(gilbertaSongBonus * 10) / 10,
    dynamicStats: Object.fromEntries(
      Object.entries(bonus.dynamicStats)
        .filter(([, data]) => Number(data.value) !== 0)
        .map(([label, data]) => [
          label,
          {
            ...data,
            value: Math.floor(data.value * 10) / 10,
          },
        ]),
    ),

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
      gearDisplayStats,
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

type SettingEditorProps = {
  partyForms?: FormState[];
};

export default function SettingsPage({ partyForms = [] }: SettingEditorProps) {
  const [form, setForm] = useState<FormState>(createDefaultForm);
  const [hydrated, setHydrated] = useState(false);
  const [editorData, setEditorData] = useState<EditorData | null>(null);
  const [selectPanel, setSelectPanel] = useState<
    | { kind: "operator"; title: string; selectedSlug: string }
    | { kind: "weapon"; title: string; selectedSlug: string }
    | { kind: "gear"; slot: CommonGearSlot; title: string; selectedSlug: string }
    | null
  >(null);

  useEffect(() => {
    setForm(loadSavedForm());
    setHydrated(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadEditorData() {
      try {
        const response = await fetch("/api/settings/editor-data", {
          cache: "force-cache",
        });
        const data = await response.json().catch(() => null);

        if (!mounted) return;

        if (!response.ok || !data?.ok) {
          setEditorData({ operators: [], weapons: [], gears: [] });
          return;
        }

        setEditorData({
          operators: Array.isArray(data.operators) ? data.operators : [],
          weapons: Array.isArray(data.weapons) ? data.weapons : [],
          gears: Array.isArray(data.gears) ? data.gears : [],
        });
      } catch {
        if (mounted) {
          setEditorData({ operators: [], weapons: [], gears: [] });
        }
      }
    }

    loadEditorData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveFormToStorage(form);
  }, [form, hydrated]);

  const operatorDetails = editorData?.operators ?? [];
  const weaponDetails = editorData?.weapons ?? [];
  const gearDetails = editorData?.gears ?? [];

  const operatorItems = useMemo(
    () => sortOperatorSelectList(operatorDetails).map(toOperatorItem),
    [operatorDetails],
  );
  const weaponItems = useMemo(
    () => sortWeaponSelectList(weaponDetails).map(toWeaponItem),
    [weaponDetails],
  );
  const gearItems = useMemo(
    () => sortGearSelectList(gearDetails).map(toGearItem),
    [gearDetails],
  );
  const armorItems = useMemo(
    () => gearItems.filter((item) => item.category === "armor"),
    [gearItems],
  );
  const glovesItems = useMemo(
    () => gearItems.filter((item) => item.category === "gloves"),
    [gearItems],
  );
  const kitItems = useMemo(
    () => gearItems.filter((item) => item.category === "kit"),
    [gearItems],
  );

  const selectedOperator = useMemo(
    () => operatorItems.find((item) => item.slug === form.operatorSlug),
    [form.operatorSlug, operatorItems],
  );
  const selectedWeapon = useMemo(
    () => weaponItems.find((item) => item.slug === form.weaponSlug),
    [form.weaponSlug, weaponItems],
  );
  const selectedArmor = useMemo(
    () => armorItems.find((item) => item.slug === form.armorSlug),
    [form.armorSlug, armorItems],
  );
  const selectedGloves = useMemo(
    () => glovesItems.find((item) => item.slug === form.glovesSlug),
    [form.glovesSlug, glovesItems],
  );
  const selectedKit1 = useMemo(
    () => kitItems.find((item) => item.slug === form.kit1Slug),
    [form.kit1Slug, kitItems],
  );
  const selectedKit2 = useMemo(
    () => kitItems.find((item) => item.slug === form.kit2Slug),
    [form.kit2Slug, kitItems],
  );

  const externalPartySlots = useMemo(() => {
    return partyForms
      .map((partyForm) => {
        const partyOperator = operatorItems.find(
          (item) => item.slug === partyForm.operatorSlug,
        );

        if (!partyOperator) return null;

        return {
          operator: partyOperator,
          form: partyForm,
        };
      })
      .filter(Boolean) as PartyBuffSlot[];
  }, [operatorItems, partyForms]);

  const partySlotsForStats = useMemo(() => {
    const currentSlot = selectedOperator
      ? [
          {
            operator: selectedOperator,
            form,
          },
        ]
      : [];

    const otherSlots = externalPartySlots.filter(
      (slot) => slot.operator?.slug !== selectedOperator?.slug,
    );

    return [...currentSlot, ...otherSlots];
  }, [selectedOperator, form, externalPartySlots]);

  const finalStats = useMemo(
    () =>
      calculateFinalStats({
        operator: selectedOperator,
        weapon: selectedWeapon,
        armor: selectedArmor,
        gloves: selectedGloves,
        kit1: selectedKit1,
        kit2: selectedKit2,
        form,
        partySlots: partySlotsForStats,
      }),
    [
      selectedOperator,
      selectedWeapon,
      selectedArmor,
      selectedGloves,
      selectedKit1,
      selectedKit2,
      form,
      partySlotsForStats,
    ],
  );

  const setEffect = useMemo(
    () =>
      getActiveSetEffect([
        selectedArmor,
        selectedGloves,
        selectedKit1,
        selectedKit2,
      ]),
    [selectedArmor, selectedGloves, selectedKit1, selectedKit2],
  );

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
    clearSavedForm();
    setForm(createDefaultForm());
  }

  if (!hydrated || !editorData) {
    return (
      <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
        <div className="mx-auto flex min-h-[60vh] max-w-[1800px] items-center justify-center">
          <p className="text-sm font-bold text-zinc-500">세팅 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1800px]">
        <nav className="sticky top-2 z-40 mb-3 rounded-[18px] border border-yellow-500/15 bg-black/90 p-2 backdrop-blur xl:hidden">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <a href="#operator-panel" className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200">
              오퍼레이터
            </a>
            <a href="#weapon-panel" className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200">
              무기
            </a>
            <a href="#gear-panel" className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200">
              장비
            </a>
            <a href="#final-stat-panel" className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200">
              최종 스탯
            </a>
          </div>
        </nav>

        <section className="grid items-start gap-3 lg:gap-4 xl:grid-cols-[0.95fr_0.85fr_1.55fr]">
          <div id="operator-panel" className="scroll-mt-24 self-start">
            <OperatorPanel
              operator={selectedOperator}
              form={form}
              finalStats={finalStats}
              onOpen={() =>
                setSelectPanel({
                  kind: "operator",
                  title: "오퍼레이터 선택",
                  selectedSlug: form.operatorSlug,
                })
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
          </div>

          <div id="weapon-panel" className="grid scroll-mt-24 gap-3 self-start lg:gap-4">
            <WeaponPanel
              weapon={selectedWeapon}
              form={form}
              finalStats={finalStats}
              onOpen={() => {
                if (!form.operatorSlug) {
                  alert("오퍼레이터를 먼저 선택해주세요.");
                  return;
                }

                setSelectPanel({
                  kind: "weapon",
                  title: "무기 선택",
                  selectedSlug: form.weaponSlug,
                });
              }}
              onLevelChange={(value) =>
                setForm((prev) => ({ ...prev, weaponLevel: value }))
              }
              onRankChange={(key, value) =>
                setForm((prev) => ({ ...prev, [key]: value }))
              }
            />

            <div id="final-stat-panel-desktop" className="hidden xl:block">
              <FinalStatPanel finalStats={finalStats} />
            </div>
          </div>

          <div id="gear-panel" className="grid scroll-mt-24 gap-3 self-start lg:gap-4">
            <GearPanel
              armor={selectedArmor}
              gloves={selectedGloves}
              kit1={selectedKit1}
              kit2={selectedKit2}
              form={form}
              finalStats={finalStats}
              onOpen={(picker) => {
                const selectedSlug =
                  picker.slot === "armor"
                    ? form.armorSlug
                    : picker.slot === "gloves"
                      ? form.glovesSlug
                      : picker.slot === "kit1"
                        ? form.kit1Slug
                        : form.kit2Slug;

                setSelectPanel({
                  kind: "gear",
                  slot: picker.slot,
                  title: picker.title,
                  selectedSlug,
                });
              }}
              onGearLevelChange={updateGearLevel}
            />

            <SetEffectPanel setEffect={setEffect} />
          </div>

          <div id="final-stat-panel" className="scroll-mt-24 self-start xl:hidden">
            <FinalStatPanel finalStats={finalStats} />
          </div>
        </section>
      </div>

      {selectPanel ? (
        <CommonSelectPanel
          kind={selectPanel.kind}
          gearSlot={selectPanel.kind === "gear" ? selectPanel.slot : undefined}
          title={selectPanel.title}
          selectedSlug={selectPanel.selectedSlug}
          operators={operatorDetails}
          weapons={weaponDetails}
          gears={gearDetails}
          onClose={() => setSelectPanel(null)}
          onSelectOperator={(slug: string) => {
            setForm((prev) => ({
              ...prev,
              operatorSlug: slug,
              weaponSlug: "",
              weaponLevel: 1,
              weaponAbilityRank: "1",
              weaponAttributeRank: "1",
              weaponSeriesRank: "1",
            }));
            setSelectPanel(null);
          }}
          onSelectWeapon={(slug: string) => {
            setForm((prev) => ({ ...prev, weaponSlug: slug }));
            setSelectPanel(null);
          }}
          onSelectGear={(slot: CommonGearSlot, slug: string) => {
            setForm((prev) => {
              if (slot === "armor") return { ...prev, armorSlug: slug };
              if (slot === "gloves") return { ...prev, glovesSlug: slug };
              if (slot === "kit1") return { ...prev, kit1Slug: slug };
              return { ...prev, kit2Slug: slug };
            });
            setSelectPanel(null);
          }}
        />
      ) : null}
    </main>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-yellow-500/15 bg-[#070a0f] p-3 shadow-[0_0_24px_rgba(250,204,21,0.025)] sm:rounded-[20px] sm:p-4">
      <h2 className="mb-3 text-base font-black text-[#ffdc70] sm:mb-4 sm:text-lg">{title}</h2>
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
      <div className="grid gap-3 md:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
        <button
          type="button"
          onClick={onOpen}
          className="relative h-[320px] overflow-hidden rounded-xl border border-white/10 bg-black sm:h-[380px] xl:h-[430px]"
        >
          {operator ? (
            <Image
              src={operator.image}
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
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              {operator?.name ?? "오퍼레이터 선택"}
            </h2>
            <p className="text-sm text-zinc-400">{operator?.enName}</p>
          </button>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
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

          <div className="mt-4 grid gap-2 sm:mt-5">
            <StatLine label="체력" value={operatorBaseStats.hp} />
            <StatLine label="공격력" value={operatorBaseStats.atk} />
            <StatLine label="힘" value={operatorBaseStats.str} />
            <StatLine label="민첩" value={operatorBaseStats.dex} />
            <StatLine label="지능" value={operatorBaseStats.int} />
            <StatLine label="의지" value={operatorBaseStats.will} />
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <h3 className="mb-2 text-base font-black text-[#ffdc70] sm:mb-3 sm:text-lg">
          전투 스킬 <span className="text-xs text-zinc-500">(레벨 선택)</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
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

      <div className="mt-4 rounded-xl border border-yellow-500/15 bg-black/35 p-3 sm:mt-5 sm:p-4">
        <h3 className="mb-2 text-base font-black text-[#ffdc70] sm:mb-3 sm:text-lg">잠재능력</h3>
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
      <div className="grid gap-3 md:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
        <button
          type="button"
          onClick={onOpen}
          className="relative h-32 overflow-hidden rounded-xl bg-black sm:h-40"
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
            <h2 className="text-xl font-black text-white sm:text-2xl">
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
          <p className="text-2xl font-black text-[#ffdc70] sm:text-3xl">
            {finalStats.weaponAttack}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:mt-5">
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
  onOpen: (picker: { slot: GearSlot; title: string }) => void;
  onGearLevelChange: (
    slot: GearSlot,
    key: keyof GearSlotLevels,
    value: GearLevelKey,
  ) => void;
}) {
  const gearTotalRows = collectGearDisplayStats([
    { item: armor, levels: form.armorLevels },
    { item: gloves, levels: form.glovesLevels },
    { item: kit1, levels: form.kit1Levels },
    { item: kit2, levels: form.kit2Levels },
  ]);

  return (
    <Panel title="장비">
      <div className="grid grid-cols-1 gap-2 sm:gap-3 min-[1500px]:grid-cols-2">
        <GearSlotCard
          title="방어구"
          item={armor}
          levels={form.armorLevels}
          onSelect={() =>
            onOpen({ slot: "armor", title: "방어구 선택" })
          }
          onLevelChange={(key, value) => onGearLevelChange("armor", key, value)}
        />

        <GearSlotCard
          title="보호 장갑"
          item={gloves}
          levels={form.glovesLevels}
          onSelect={() =>
            onOpen({ slot: "gloves", title: "보호 장갑 선택" })
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
            onOpen({ slot: "kit1", title: "부품 1 선택" })
          }
          onLevelChange={(key, value) => onGearLevelChange("kit1", key, value)}
        />

        <GearSlotCard
          title="부품 2"
          item={kit2}
          levels={form.kit2Levels}
          onSelect={() =>
            onOpen({ slot: "kit2", title: "부품 2 선택" })
          }
          onLevelChange={(key, value) => onGearLevelChange("kit2", key, value)}
        />
      </div>

      {gearTotalRows.length > 0 ? (
        <div className="mt-4 border-t border-white/10 pt-4">
          <h3 className="mb-3 text-sm font-black text-[#ffdc70]">
            장비 능력치 합산
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-4">
            {gearTotalRows.map((item) => (
              <StatLine
                key={item.label}
                label={item.label}
                value={formatSignedStatValue(Number(item.value), item.percent)}
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
  const statPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!openedStatKey) return;

      const target = event.target as Node | null;

      if (target && statPanelRef.current?.contains(target)) {
        return;
      }

      setOpenedStatKey(null);
    }

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [openedStatKey]);

  type NumericBonusStatKey = Exclude<
    keyof ReturnType<typeof createBonusStats>,
    "dynamicStats"
  >;

  function toggle(key: string) {
    setOpenedStatKey((prev) => (prev === key ? null : key));
  }

  function getGearDetailRowsForKey(key: string) {
    return finalStats.bonusBreakdown.gearDisplayStats
      .filter((item) => item.keys.includes(key))
      .map((item) => ({
        label: `장비 · ${item.label}`,
        value: formatSignedStatValue(item.value, item.percent),
      }));
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

    const trustValue = statKey === "atk" ? 0 : breakdown.trust[statKey];
    const breakthroughValue = statKey === "atk" ? 0 : breakdown.breakthrough[statKey];
    const weaponValue = statKey === "atk" ? 0 : breakdown.weapon[statKey];
    const setEffectValue = statKey === "atk" ? 0 : breakdown.setEffect[statKey];

    if (statKey !== "atk") rows.push(...getGearDetailRowsForKey(statKey));
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
    key: NumericBonusStatKey,
    baseValue = 0,
  ) {
    const breakdown = finalStats.bonusBreakdown;
    const rows: { label: string; value: string }[] = [];
    const sources = [
      { label: "신뢰도 보너스", stat: Number(breakdown.trust[key] ?? 0) },
      { label: "잠재능력", stat: Number(breakdown.breakthrough[key] ?? 0) },
      { label: "무기 옵션", stat: Number(breakdown.weapon[key] ?? 0) },
      { label: "세트 효과", stat: Number(breakdown.setEffect[key] ?? 0) },
    ];

    if (baseValue) rows.push({ label: "기본값", value: formatPercent(baseValue) });

    rows.push(...getGearDetailRowsForKey(key));

    for (const source of sources) {
      if (source.stat) {
        rows.push({ label: source.label, value: `+${formatPercent(source.stat)}` });
      }
    }

    return rows;
  }


  function getIntegerDetailRows(
    key: NumericBonusStatKey,
  ) {
    const breakdown = finalStats.bonusBreakdown;
    const rows: { label: string; value: string }[] = [];
    const sources = [
      { label: "신뢰도 보너스", stat: Number(breakdown.trust[key] ?? 0) },
      { label: "잠재능력", stat: Number(breakdown.breakthrough[key] ?? 0) },
      { label: "무기 옵션", stat: Number(breakdown.weapon[key] ?? 0) },
      { label: "세트 효과", stat: Number(breakdown.setEffect[key] ?? 0) },
    ];

    rows.push(...getGearDetailRowsForKey(key));

    for (const source of sources) {
      if (source.stat) {
        const value = Math.floor(source.stat);
        rows.push({
          label: source.label,
          value: `${value > 0 ? "+" : ""}${value.toLocaleString()}`,
        });
      }
    }

    return rows;
  }


  function getDynamicDetailRows(label: string) {
    const breakdown = finalStats.bonusBreakdown;
    const gearRows = getGearDetailRowsForKey(`dynamic:${label}`);
    const sources = [
      { label: "신뢰도 보너스", stat: breakdown.trust.dynamicStats[label] },
      { label: "잠재능력", stat: breakdown.breakthrough.dynamicStats[label] },
      { label: "무기 옵션", stat: breakdown.weapon.dynamicStats[label] },
      { label: "세트 효과", stat: breakdown.setEffect.dynamicStats[label] },
    ];

    return [
      ...gearRows,
      ...sources
        .filter((source) => source.stat && source.stat.value !== 0)
        .map((source) => ({
          label: source.label,
          value: `${source.stat!.value > 0 ? "+" : ""}${source.stat!.value}${source.stat!.isPercent ? "%" : ""}`,
        })),
    ];
  }

  function getCoreStatValue(key?: "str" | "dex" | "int" | "will") {
    if (!key) return 0;
    if (key === "str") return finalStats.str;
    if (key === "dex") return finalStats.dex;
    if (key === "int") return finalStats.int;
    return finalStats.will;
  }

  const extraPercentStatRows = [
    {
      key: "healEfficiency",
      statKey: "healEfficiency",
      label: "치유 효율 보너스",
      value: finalStats.healEfficiency,
    },
    {
      key: "skillDamage",
      statKey: "skillDamage",
      label: "스킬 피해 보너스",
      value: finalStats.skillDamage,
    },
    {
      key: "normalAttackDamage",
      statKey: "normalAttackDamage",
      label: "일반 공격 피해 보너스",
      value: finalStats.normalAttackDamage,
    },
    {
      key: "battleSkillDamage",
      statKey: "battleSkillDamage",
      label: "배틀 스킬 피해 보너스",
      value: finalStats.battleSkillDamage,
    },
    {
      key: "comboSkillDamage",
      statKey: "comboSkillDamage",
      label: "연계 스킬 피해 보너스",
      value: finalStats.comboSkillDamage,
    },
    {
      key: "ultimateDamage",
      statKey: "ultimateDamage",
      label: "궁극기 피해 보너스",
      value: finalStats.ultimateDamage,
    },
    {
      key: "physicalDamage",
      statKey: "physicalDamage",
      label: "물리 피해 보너스",
      value: finalStats.physicalDamage,
    },
    {
      key: "artsDamage",
      statKey: "artsDamage",
      label: "아츠 피해 보너스",
      value: finalStats.artsDamage,
    },
    {
      key: "cryoDamage",
      statKey: "cryoDamage",
      label: "냉기 피해 보너스",
      value: finalStats.cryoDamage,
    },
    {
      key: "electricDamage",
      statKey: "electricDamage",
      label: "전기 피해 보너스",
      value: finalStats.electricDamage,
    },
    {
      key: "heatDamage",
      statKey: "heatDamage",
      label: "열기 피해 보너스",
      value: finalStats.heatDamage,
    },
    {
      key: "natureDamage",
      statKey: "natureDamage",
      label: "자연 피해 보너스",
      value: finalStats.natureDamage,
    },
    {
      key: "unbalancedTargetDamage",
      statKey: "unbalancedTargetDamage",
      label: "불균형 목표에 주는 피해 보너스",
      value: finalStats.unbalancedTargetDamage,
    },
    {
      key: "damageReduction",
      statKey: "damageReduction",
      label: "모든 피해 감소",
      value: finalStats.damageReduction,
    },
  ].filter((item) => Number(item.value) !== 0) as {
    key: NumericBonusStatKey;
    statKey: string;
    label: string;
    value: number;
  }[];

  return (
    <Panel title="최종 스탯">
      <div ref={statPanelRef} className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-6">
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
          details={[
            ...getPercentDetailRows("ultimateEfficiency", 100),
            ...(finalStats.gilbertaSongBonus
              ? [
                  {
                    label: "전달자의 노래",
                    value: `+${formatPercent(finalStats.gilbertaSongBonus)}`,
                  },
                ]
              : []),
          ]}
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
            ...getGearDetailRowsForKey("defense"),
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
        {finalStats.originiumArts !== 0 ? (
          <StatLine
            label="오리지늄 아츠 강도"
            value={Math.floor(finalStats.originiumArts).toLocaleString()}
            details={getIntegerDetailRows("originiumArts")}
            opened={openedStatKey === "originiumArts"}
            onClick={() => toggle("originiumArts")}
          />
        ) : null}
        {extraPercentStatRows.map((item) => (
          <StatLine
            key={item.statKey}
            label={item.label}
            value={formatPercent(item.value)}
            details={getPercentDetailRows(item.key)}
            opened={openedStatKey === item.statKey}
            onClick={() => toggle(item.statKey)}
          />
        ))}
        {Object.entries(finalStats.dynamicStats).map(([label, stat]) => (
          <StatLine
            key={`dynamic-${label}`}
            label={label}
            value={`${stat.value > 0 ? "+" : ""}${stat.value}${stat.isPercent ? "%" : ""}`}
            details={getDynamicDetailRows(label)}
            opened={openedStatKey === `dynamic-${label}`}
            onClick={() => toggle(`dynamic-${label}`)}
          />
        ))}
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
    <div className="rounded-xl border border-white/10 bg-black/45 p-2.5 sm:p-3">
      <div className="relative h-16 rounded-lg bg-zinc-950 sm:h-20">
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

      <p className="mt-2 text-[11px] text-zinc-500 sm:text-xs">{skill?.typeLabel ?? "-"}</p>
      <p className="truncate text-xs font-black text-white sm:text-sm">
        {skill?.name ?? "-"}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SkillLevel)}
        className="mt-2 w-full rounded-md border border-white/10 bg-black px-2 py-1 text-xs font-bold outline-none sm:text-sm"
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
    <div className="rounded-xl border border-white/10 bg-black/45 p-2.5 sm:p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_150px] sm:items-center sm:gap-3">
        <div>
          <p className="text-sm font-black text-white">{title}</p>
          <p className="text-xs text-zinc-500">{skill?.name ?? "-"}</p>
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-white/10 bg-black px-3 py-2 text-xs font-bold outline-none sm:text-sm"
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
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/45 p-2.5 sm:p-3">
      <button
        type="button"
        onClick={onSelect}
        className="grid w-full grid-cols-[56px_minmax(0,1fr)] items-center gap-2 text-left sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-3"
      >
        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-950 sm:h-14 sm:w-14">
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

          <h3 className="truncate text-sm font-black text-white sm:text-base">
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
    <div className="grid min-w-0 grid-cols-1 gap-1 rounded-lg bg-white/[0.03] px-2.5 py-2 sm:grid-cols-[minmax(0,1fr)_96px] sm:items-center sm:gap-2">
      <p className="min-w-0 truncate text-xs font-bold text-zinc-300">
        {label}: <span className="text-yellow-300">{value}</span>
      </p>

      <select
        value={level}
        onChange={(e) => onChange(e.target.value as GearLevelKey)}
        className="w-full rounded-md border border-white/10 bg-black px-2 py-1 text-xs font-bold outline-none sm:w-[96px]"
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
      className={`relative rounded-md border ${roleClass} overflow-visible`}
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
        onClick={(event) => {
          event.stopPropagation();
          onClick?.();
        }}
        className="flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left transition enabled:hover:bg-white/[0.04] disabled:cursor-default sm:gap-3"
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
          <span className="truncate text-xs text-zinc-400 sm:text-sm">{label}</span>
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
          <span className="text-xs font-black text-[#ffdc70] sm:text-sm">{value}</span>
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

          <div
            className="fixed inset-x-3 bottom-3 z-[90] max-h-[55vh] overflow-y-auto rounded-xl border border-yellow-500/20 bg-[#05070b] px-3 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.55)] sm:absolute sm:bottom-auto sm:left-full sm:top-0 sm:ml-2 sm:w-[270px]"
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
        className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-xs font-black outline-none sm:text-sm"
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

      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onChange("0")}
          className={[
            "flex h-9 items-center justify-center rounded-lg border bg-black/70 text-xs font-black transition sm:h-10",
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
                "relative h-9 rounded-lg border bg-black/70 transition sm:h-10",
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
        className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-xs font-black outline-none sm:text-sm"
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

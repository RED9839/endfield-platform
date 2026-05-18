export type GearCategory = "armor" | "gloves" | "kit";

export type GearLevel = 70 | 50 | 36 | 28 | 20 | 10;

export type GearQuality = 1 | 2 | 3 | 4 | 5;

export type GearSetName =
  | "개척"
  | "응룡 50식"
  | "본 크러셔"
  | "조류의 물결"
  | "청파"
  | "M. I. 경찰용"
  | "식양의 흐름"
  | "열 작업용"
  | "생체 보조"
  | "검술사"
  | "경량 초자연"
  | "펄스식"
  | "식양의 숨결"
  | "순행 전달자"
  | "아부레이의 메아리"
  | "중장갑 전달자"
  | "재앙 방호"
  | "침식 방호"
  | "침식 차단"
  | "통합 중량형 모델"
  | "통합 경량형 모델"
  | "세트 없음";

export type GearAbilityKey =
  | "strength"
  | "agility"
  | "intelligence"
  | "will";

export type GearAttributeKey =
  | "attack"
  | "hp"
  | "critRate"
  | "originiumArts"
  | "healEfficiency"
  | "physicalDamage"
  | "ultimateEfficiency"
  | "normalAttack"
  | "skillDamage"
  | "comboSkillDamage"
  | "ultimateDamage"
  | "unbalancedTargetDamage"
  | "mainStat"
  | "artsDamage"
  | "cryoElectricDamage"
  | "damageReduction"
  | "subStat"
  | "allSkillDamage"
  | "heatNatureDamage";

export interface GearValueSet {
  base: string;
  level1?: string;
  level2?: string;
  level3?: string;
}

export interface GearStatLine {
  label: string;
  values: GearValueSet;
}

export interface GearBaseStat {
  label: string;
  value: string;
}

export interface GearSetEffect {
  pieces: number;
  description: string;
}

export interface GearDetail {
  slug: string;

  name: string;
  enName: string;

  category: GearCategory;
  level: GearLevel;
  quality: GearQuality;
  setName: GearSetName;

  image: string;

  summary: string;
  description: string;

  baseStat: GearBaseStat;

  ability1: GearStatLine;
  ability2?: GearStatLine;
  attribute: GearStatLine;

  abilityTypes: GearAbilityKey[];
  attributeTypes: GearAttributeKey[];

  setEffects: GearSetEffect[];
}
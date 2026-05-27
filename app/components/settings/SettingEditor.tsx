"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import { gearDetails } from "@/data/gear-detail-data";
import type { GearDetail } from "@/data/gear-types";
import { sortOperatorSelectList } from "@/data/operator-sort";
import { sortWeaponSelectList } from "@/data/weapons-sort";
import { gearSetOrder, sortGearSelectList } from "@/data/gear-sort";
import CommonSelectPanel, {
  type CommonGearSlot,
} from "@/app/components/select/CommonSelectPanel";


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
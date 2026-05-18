import type { GearDetail } from "../gear-types";

export const bonecrusherheavyarmort1: GearDetail = {
  slug: "bonecrusherheavyarmort1",

  name: "본 크러셔 중갑 방어구 I",
  enName: "Bonekrusha Heavy Armor T1",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "본 크러셔",

  image: "/gear/bonecrusherheavyarmort1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "본 크러셔 집단의 장비에서 디자인 영감을 받은 장비. 육중한 방어구는 방어력뿐만 아니라, 황무지를 떠도는 이들에게는 냉혹함과 잔인함의 상징이기도 합니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "연계 스킬 피해 보너스",
    values: {
      base: "+20.7%",
      level1: "+22.8%",
      level2: "+24.8%",
      level3: "+26.9%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["comboSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +15%. 장착자가 연계 스킬을 사용할 때, 본 크러셔의 압박 1스택 획득, 다음 배틀 스킬의 피해 +30%. 본 크러셔의 압박은 최대 2스택까지만 중첩됩니다.",
    },
  ],
};
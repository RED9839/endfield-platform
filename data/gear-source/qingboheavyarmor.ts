import type { GearDetail } from "../gear-types";

export const qingboheavyarmor: GearDetail = {
  slug: "qingboheavyarmor",

  name: "청파 중갑",
  enName: "Qingbo Heavy Armor",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "청파",

  image: "/gear/qingboheavyarmor.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "청파채의 고서에서 복원해 낸 가성비 높은 장비. 두꺼운 금속판과 특수 약물에 절인 대나무 조각을 엮어 만든 중갑입니다. 청파채 건립 당시에는 물자가 극도로 부족했기에, 사람들은 이런 식의 방어구를 고안해 냈습니다.",

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
    label: "궁극기 충전 효율",
    values: {
      base: "+12.3%",
      level1: "+13.6%",
      level2: "+14.8%",
      level3: "+16.0%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 연계 스킬을 사용할 때, 모든 스킬 피해 +20%, 15초 동안 지속. 해당 효과는 최대 2스택까지 중첩되며 중첩될 때마다 지속 시간은 따로 계산됩니다.",
    },
  ],
};
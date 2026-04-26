import type { GearDetail } from "../gear-types";

export const misecurityhandssppet1: GearDetail = {
  slug: "misecurityhandssppet1",

  name: "M. I. 경찰용 장갑(팔찌) I",
  enName: "MI Security Hands PPE T1",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "M. I. 경찰용",

  image: "/gear/misecurityhandssppet1.webp",

  summary:
    "이 장비는 미에슈코 공업에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "M. I. 경찰용 시리즈 장비. 팔찌에는 초소형 진압용 아츠 유닛이 내장되어 있으며, 전체적인 에너지 전도 성능이 매우 뛰어납니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "치명타 확률",
    values: {
      base: "+8.6%",
      level1: "+9.5%",
      level2: "+10.3%",
      level3: "+11.2%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["critRate"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치명타 확률 +5%. 장착자가 적에게 치명타를 준 후, 5초 동안 공격력 +5%, 최대 중첩 5스택. 최대 중첩 시, 치명타 확률 추가 +5%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
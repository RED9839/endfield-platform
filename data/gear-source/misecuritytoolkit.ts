import type { GearDetail } from "../gear-types";

export const misecuritytoolkit: GearDetail = {
  slug: "misecuritytoolkit",

  name: "M. I. 경찰용 다용도 공구",
  enName: "MI Security Toolkit",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "M. I. 경찰용",

  image: "/gear/misecuritytoolkit.webp",

  summary:
    "이 장비는 미에슈코 공업에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    'M. I. 경찰용 시리즈 장비. "감사합니다, 경찰관님! 열쇠를 집안에 두고 나와서 신고하는 건, 이번 달에 이번이 마지막이에요, 진짜로요!"',

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "치명타 확률",
    values: {
      base: "+10.3%",
      level1: "+11.4%",
      level2: "+12.4%",
      level3: "+13.5%",
    },
  },

  abilityTypes: ["intelligence", "agility"],
  attributeTypes: ["critRate"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치명타 확률 +5%. 장착자가 적에게 치명타를 준 후, 5초 동안 공격력 +5%, 최대 중첩 5스택. 최대 중첩 시, 치명타 확률 추가 +5%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
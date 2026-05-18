import type { GearDetail } from "../gear-types";

export const misecurityscope: GearDetail = {
  slug: "misecurityscope",

  name: "M. I. 경찰용 조준기",
  enName: "MI Security Scope",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "M. I. 경찰용",

  image: "/gear/misecurityscope.webp",

  summary:
    "이 장비는 미에슈코 공업에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "M. I. 경찰용 시리즈 장비. 미에슈코 공업의 일부 제품은 황무지로 밀거래되기도 합니다. 일부 랜드브레이커 암살자들에게 M. I. 경찰용 조준기는 최상품으로 통합니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+41.4%",
      level1: "+45.5%",
      level2: "+49.7%",
      level3: "+53.8%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치명타 확률 +5%. 장착자가 적에게 치명타를 준 후, 5초 동안 공격력 +5%, 최대 중첩 5스택. 최대 중첩 시, 치명타 확률 추가 +5%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
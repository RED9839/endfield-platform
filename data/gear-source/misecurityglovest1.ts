import type { GearDetail } from "../gear-types";

export const misecurityglovest1: GearDetail = {
  slug: "misecurityglovest1",

  name: "M. I. 경찰용 장갑 I",
  enName: "MI Security Gloves T1",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "M. I. 경찰용",

  image: "/gear/misecurityglovest1.webp",

  summary:
    "이 장비는 미에슈코 공업에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "M. I. 경찰용 시리즈 장비. 이 장갑은 방어력 외에도 동시에 공격 속성을 갖추고 있으며, 검수 과정 중에는 '아겔로스의 신체를 효과적으로 파괴할 수 있는지'를 평가하는 단계도 포함되어 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "궁극기 피해 보너스",
    values: {
      base: "+43.1%",
      level1: "+47.4%",
      level2: "+51.7%",
      level3: "+56.1%",
    },
  },

  abilityTypes: ["agility", "intelligence"],
  attributeTypes: ["ultimateDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치명타 확률 +5%. 장착자가 적에게 치명타를 준 후, 5초 동안 공격력 +5%, 최대 중첩 5스택. 최대 중첩 시, 치명타 확률 추가 +5%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
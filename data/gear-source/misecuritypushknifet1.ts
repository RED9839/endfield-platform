import type { GearDetail } from "../gear-types";

export const misecuritypushknifet1: GearDetail = {
  slug: "misecuritypushknifet1",

  name: "M. I. 경찰용 단검 I",
  enName: "MI Security Push Knife T1",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "M. I. 경찰용",

  image: "/gear/misecuritypushknifet1.webp",

  summary:
    "이 장비는 미에슈코 공업에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "M. I. 경찰용 시리즈 장비. 손잡이에 오리지늄 화약이 장전되어 있습니다. 목표물에 밀착시켜 방아쇠를 당기면, 단검이 케이크를 자르는 것처럼 손쉽고 부드럽게 적의 갑옷과 살을 찢습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "의지",
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
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+41.4%",
      level1: "+45.5%",
      level2: "+49.7%",
      level3: "+53.8%",
    },
  },

  abilityTypes: ["will", "agility"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치명타 확률 +5%. 장착자가 적에게 치명타를 준 후, 5초 동안 공격력 +5%, 최대 중첩 5스택. 최대 중첩 시, 치명타 확률 추가 +5%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
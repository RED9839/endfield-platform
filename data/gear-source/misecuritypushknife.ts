import type { GearDetail } from "../gear-types";

export const misecuritypushknife: GearDetail = {
  slug: "misecuritypushknife",

  name: "M. I. 경찰용 단검",
  enName: "MI Security Push Knife",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "M. I. 경찰용",

  image: "/gear/misecuritypushknife.webp",

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
    label: "지능",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "열기와 자연 피해 보너스",
    values: {
      base: "+23.0%",
      level1: "+25.3%",
      level2: "+27.6%",
      level3: "+29.9%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["heatNatureDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치명타 확률 +5%. 장착자가 적에게 치명타를 준 후, 5초 동안 공격력 +5%, 최대 중첩 5스택. 최대 중첩 시, 치명타 확률 추가 +5%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
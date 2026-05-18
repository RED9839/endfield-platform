import type { GearDetail } from "../gear-types";

export const lynxslab: GearDetail = {
  slug: "lynxslab",

  name: "생체 보조 보호판",
  enName: "LYNX Slab",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "생체 보조",

  image: "/gear/lynxslab.webp",

  summary:
    "이 장비는 로도스 아일랜드에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "의료진들이 애용하는 장비. 침식이 주는 피해는 때로 눈에 띄지 않기에, 장갑판에도 예민한 탐지 유닛을 장착할 필요가 있습니다.",

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
    label: "주요 능력치",
    values: {
      base: "+20.7%",
      level1: "+22.8%",
      level2: "+24.8%",
      level3: "+26.9%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["mainStat"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치유 효율 +20%. 장착자가 아군을 치유한 후, 목표가 10초 동안 받는 모든 유형 피해 -15%. 해당 목표가 받는 치유량이 최대치를 넘을 경우, 받는 모든 유형 피해 -30%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
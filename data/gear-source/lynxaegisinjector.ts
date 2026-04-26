import type { GearDetail } from "../gear-types";

export const lynxaegisinjector: GearDetail = {
  slug: "lynxaegisinjector",

  name: "생체 보조 보호 주사기",
  enName: "LYNX Aegis Injector  ",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "생체 보조",

  image: "/gear/lynxaegisinjector.webp",

  summary:
    "이 장비는 로도스 아일랜드에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "의료진들이 애용하는 장비. 생체 보조 보호 주사기는 원래 보호막의 금이 간 부분을 메우기 위한 것이지만, 긴급 상황에서는 상처를 봉합하는 용도로도 활용할 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
    },
  },

  attribute: {
    label: "치유 효율 보너스",
    values: {
      base: "+20.7%",
      level1: "+22.8%",
      level2: "+24.8%",
      level3: "+26.9%",
    },
  },

  abilityTypes: ["will"],
  attributeTypes: ["healEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치유 효율 +20%. 장착자가 아군을 치유한 후, 목표가 10초 동안 받는 모든 유형 피해 -15%. 해당 목표가 받는 치유량이 최대치를 넘을 경우, 받는 모든 유형 피해 -30%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
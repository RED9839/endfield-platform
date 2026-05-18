import type { GearDetail } from "../gear-types";

export const lynxgauntlets: GearDetail = {
  slug: "lynxgauntlets",

  name: "생체 보조 금속 장갑",
  enName: "LYNX Gauntlets",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "생체 보조",

  image: "/gear/lynxgauntlets.webp",

  summary:
    "이 장비는 로도스 아일랜드에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "의료진들이 애용하는 장비. 로도스 아일랜드는 여전히 장비에 광석병 모니터링 모듈을 설치하는 관례를 유지하고 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "치유 효율 보너스",
    values: {
      base: "+17.3%",
      level1: "+19.0%",
      level2: "+20.7%",
      level3: "+22.4%",
    },
  },

  abilityTypes: ["will", "strength"],
  attributeTypes: ["healEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치유 효율 +20%. 장착자가 아군을 치유한 후, 목표가 10초 동안 받는 모든 유형 피해 -15%. 해당 목표가 받는 치유량이 최대치를 넘을 경우, 받는 모든 유형 피해 -30%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
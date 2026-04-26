import type { GearDetail } from "../gear-types";

export const lynxconnector: GearDetail = {
  slug: "lynxconnector",

  name: "생체 보조 접속기",
  enName: "LYNX Connector",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "생체 보조",

  image: "/gear/lynxconnector.webp",

  summary:
    "이 장비는 로도스 아일랜드에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "의료진들이 애용하는 장비. 로도스 아일랜드에서 개발한 이 연결 유닛은 데이터 보정 기능을 갖추고 있어, 긴급 상황 시 다른 생명 유지 장치 시스템에도 접속하여 응급 구조 작업을 완료할 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "모든 피해 감소",
    values: {
      base: "17.1%",
      level1: "18.5%",
      level2: "19.9%",
      level3: "21.2%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["damageReduction"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치유 효율 +20%. 장착자가 아군을 치유한 후, 목표가 10초 동안 받는 모든 유형 피해 -15%. 해당 목표가 받는 치유량이 최대치를 넘을 경우, 받는 모든 유형 피해 -30%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const lynxheavyarmor: GearDetail = {
  slug: "lynxheavyarmor",

  name: "생체 보조 중갑",
  enName: "LYNX Heavy Armor",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "생체 보조",

  image: "/gear/lynxheavyarmor.webp",

  summary:
    "이 장비는 로도스 아일랜드에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "의료진들이 애용하는 장비의 중량 강화형 버전. 생체 보조 흉갑을 착용한 작전 요원들은 종종 '움직이는 약품 창고'라고 불리는데, 보통 방어구 곳곳에 응급 약품을 가득 채워 넣고 다니기 때문입니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "치유 효율 보너스",
    values: {
      base: "+10.3%",
      level1: "+11.4%",
      level2: "+12.4%",
      level3: "+13.5%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["healEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치유 효율 +20%. 장착자가 아군을 치유한 후, 목표가 10초 동안 받는 모든 유형 피해 -15%. 해당 목표가 받는 치유량이 최대치를 넘을 경우, 받는 모든 유형 피해 -30%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
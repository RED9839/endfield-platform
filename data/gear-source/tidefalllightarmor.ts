import type { GearDetail } from "../gear-types";

export const tidefalllightarmor: GearDetail = {
  slug: "tidefalllightarmor",

  name: "낙조 경갑",
  enName: "Tide Fall Light Armor",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "조류의 물결",

  image: "/gear/tidefalllightarmor.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국에서 침식 조류 작업을 위해 제작한 세트 장비. 이 장비는 '침식 조류'에 관한 하나의 기억을 담고 있습니다. 조류는 단 한 번도 생명을 허락한 적이 없었다는, 그 씁쓸한 기억을.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "궁극기 충전 효율",
    values: {
      base: "+12.3%",
      level1: "+13.6%",
      level2: "+14.8%",
      level3: "+16.0%",
    },
  },

  abilityTypes: ["intelligence", "strength"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +20%. 장착자가 적에게 2 스택 혹은 그 이상의 아츠 부착을 부여한 후, 주는 아츠 피해 +35%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
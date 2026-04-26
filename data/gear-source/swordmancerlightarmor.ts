import type { GearDetail } from "../gear-types";

export const swordmancerlightarmor: GearDetail = {
  slug: "swordmancerlightarmor",

  name: "검술사 경장갑",
  enName: "Swordmancer Light Armor",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancerlightarmor.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. 설계도 첫 페이지에는 '외로운 검술사'라고 적혀 있습니다.",

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
    label: "궁극기 충전 효율",
    values: {
      base: "+12.3%",
      level1: "+13.6%",
      level2: "+14.8%",
      level3: "+16.0%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10 포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};
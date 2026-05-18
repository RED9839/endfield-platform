import type { GearDetail } from "../gear-types";

export const swordmancerflint: GearDetail = {
  slug: "swordmancerflint",

  name: "검술사 부싯돌",
  enName: "Swordmancer Flint",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancerflint.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. 부싯돌은 오버클러킹 방식으로 검술사 방어구 시스템의 모든 에너지를 소모하며, 생명이 스러지기 직전에 이르러서야 비로소 그 빛을 발합니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "물리 피해 보너스",
    values: {
      base: "+23.0%",
      level1: "+25.3%",
      level2: "+27.6%",
      level3: "+29.9%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["physicalDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10 포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};
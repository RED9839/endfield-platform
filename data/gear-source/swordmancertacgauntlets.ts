import type { GearDetail } from "../gear-types";

export const swordmancertacgauntlets: GearDetail = {
  slug: "swordmancertacgauntlets",

  name: "검술사 전술 금속 장갑",
  enName: "Swordmancer TAC Gauntlets",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancertacgauntlets.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. 전술 금속 장갑의 품질 검수 절차 중에는 '금속 장갑을 착용한 채 화선지로 24겹의 종이꽃을 만들기'라는 항목도 포함되어 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "민첩",
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
    label: "궁극기 피해 보너스",
    values: {
      base: "+43.1%",
      level1: "+47.4%",
      level2: "+51.7%",
      level3: "+56.1%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["ultimateDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10 포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};
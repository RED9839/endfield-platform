import type { GearDetail } from "../gear-types";

export const swordmancertacgauntletst1: GearDetail = {
  slug: "swordmancertacgauntletst1",

  name: "검술사 전술 금속 장갑 · I",
  enName: "Swordmancer TAC Gauntlets T1",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancertacgauntletst1.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. 전술 건틀릿의 품질 검수 절차 중에는 '건틀릿을 착용한 채 화선지로 24겹의 종이꽃을 만들기'라는 항목도 포함되어 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+34",
      level1: "+37",
      level2: "+41",
      level3: "+44",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};
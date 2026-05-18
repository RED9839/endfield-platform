import type { GearDetail } from "../gear-types";

export const swordmancernavbeacon: GearDetail = {
  slug: "swordmancernavbeacon",

  name: "검술사 위치 신호기",
  enName: "Swordmancer NAV Beacon",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancernavbeacon.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. 대부분의 침식 환경은 극도로 위험합니다. 한 발자국만 잘못 디뎌도 영원히 길을 잃을 수 있습니다... 과거 무릉에서 벌어진 사고처럼.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
    },
  },

  abilityTypes: ["strength"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10 포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const swordmancerdagger: GearDetail = {
  slug: "swordmancerdagger",

  name: "검술사 단검",
  enName: "Swordmancer Dagger",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancerdagger.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. 매우 날카로운 전술 단검으로 선검국 장비 생산 공정의 초기 개량 모델 중 하나입니다. 의심할 여지 없이, 이는 훗날 응룡식 장비 개발의 훌륭한 토대가 되었습니다.",

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
    label: "궁극기 피해 보너스",
    values: {
      base: "+51.7%",
      level1: "+56.9%",
      level2: "+62.1%",
      level3: "+67.3%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["ultimateDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};
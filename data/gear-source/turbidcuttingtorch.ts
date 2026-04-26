import type { GearDetail } from "../gear-types";

export const turbidcuttingtorch: GearDetail = {
  slug: "turbidcuttingtorch",

  name: "탁류 화염 절단기",
  enName: "Turbid Cutting Torch",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "조류의 물결",

  image: "/gear/turbidcuttingtorch.webp",
  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국에서 침식 조류 작업을 위해 제작한 세트 장비. 이 장비는 '침식 조류'에 대한 한 줄기 공포를 노래합니다. 머리 위에 드리운 저 재앙은 과연 언제 우리의 눈앞에 떨어질 것인가?",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "지능",
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
    label: "일반 공격 피해 보너스",
    values: {
      base: "+27.6%",
      level1: "+30.4%",
      level2: "+33.1%",
      level3: "+35.9%",
    },
  },

  abilityTypes: ["intelligence", "strength"],
  attributeTypes: ["normalAttack"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +20%. 장착자가 적에게 2 스택 혹은 그 이상의 아츠 부착을 부여한 후, 주는 아츠 피해 +35%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const tidesurgegauntlets: GearDetail = {
  slug: "tidesurgegauntlets",

  name: "조류의 물결 금속 장갑",
  enName: "Tide Surge Gauntlets",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "조류의 물결",

  image: "/gear/tidesurgegauntlets.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국에서 침식 조류 작업을 위해 제작한 세트 장비. 이 장비는 '침식 조류'에 관한 한 줄기 의문을 품고 있습니다. 고대의 제방은 과연 내부로부터 무너진 것일까요?",

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
    label: "냉기와 전기 피해 보너스",
    values: {
      base: "+19.2%",
      level1: "+21.1%",
      level2: "+23.0%",
      level3: "+24.9%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["cryoElectricDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +20%. 장착자가 적에게 2스택 혹은 그 이상의 아츠 부착을 부여한 후, 주는 아츠 피해 +35%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
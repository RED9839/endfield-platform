import type { GearDetail } from "../gear-types";

export const hangingrivero2tube: GearDetail = {
  slug: "hangingrivero2tube",

  name: "현하 산소 공급 장치",
  enName: "Hanging River O2 Tube",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "조류의 물결",

  image: "/gear/hangingrivero2tube.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국에서 침식 조류 작업을 위해 제작한 세트 장비. 이 장비는 '침식 조류'에 관한 한 조각 절망을 보여줍니다. 정체 모를 탁류가 이미 온 대지를 휩쓸고 지나갔다는, 돌이킬 수 없는 절망을.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "냉기와 전기 피해 보너스",
    values: {
      base: "+23.0%",
      level1: "+25.3%",
      level2: "+27.6%",
      level3: "+29.9%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["cryoElectricDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +20%. 장착자가 적에게 2 스택 혹은 그 이상의 아츠 부착을 부여한 후, 주는 아츠 피해 +35%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
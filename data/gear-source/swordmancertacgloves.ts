import type { GearDetail } from "../gear-types";

export const swordmancertacgloves: GearDetail = {
  slug: "swordmancertacgloves",

  name: "검술사 전술 장갑",
  enName: "Swordmancer TAC Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancertacgloves.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. \"한 해의 끝자락에 검을 든 자, 남쪽으로 향하니, 산이 아홉 머리를 드러내고 그 노호 멎지 않거든, 길한 징조라 하였노라.\"", 

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
    label: "물리 피해 보너스",
    values: {
      base: "+19.2%",
      level1: "+21.1%",
      level2: "+23.0%",
      level3: "+24.9%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["physicalDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10 포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};
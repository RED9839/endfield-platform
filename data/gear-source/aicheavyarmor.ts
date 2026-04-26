import type { GearDetail } from "../gear-types";

export const aicheavyarmor: GearDetail = {
  slug: "aicheavyarmor",

  name: "통합형 중갑",
  enName: "AIC Heavy Armor",

  category: "armor",
  level: 28,
  quality: 2,
  setName: "통합 중량형 모델",

  image: "/gear/aicheavyarmor.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "단순한 구조의 모듈화한 중량형 방호 장비. 장착된 장갑판을 더 무겁고 두껍게 개량한 뒤에는, 대부분이 강력한 위력의 총기와 결합하기 위한 공정으로 보내집니다.",

  baseStat: {
    label: "방어력",
    value: "+22",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+30",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+30",
    },
  },

  attribute: {
    label: "모든 피해 감소",
    values: {
      base: "3.9%",
    },
  },

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["damageReduction"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +500. 장착자가 적을 처치한 후, 생명력 100 포인트 회복. 해당 효과는 5초마다 최대 1회만 발동합니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const basicppe: GearDetail = {
  slug: "basicppe",

  name: "간편 방호복",
  enName: "Basic PPE",

  category: "armor",
  level: 10,
  quality: 1,
  setName: "세트 없음",

  image: "/gear/basicppe.webp",

  summary:
    "엔드필드 공업의 품질 검증을 거치지 않은 임시 장비로, 방어 성능을 보장할 수 없습니다.",
  description:
    "단순한 구조의 초급 방어구. 실제 방어력보다는 장착자의 마음을 든든하게 해주는 효과가 더 큽니다.",

  baseStat: {
    label: "방어력",
    value: "+8",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+15",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+10",
    },
  },

  attribute: {
    label: "생명력",
    values: {
      base: "+46",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["hp"],

  setEffects: [],
};
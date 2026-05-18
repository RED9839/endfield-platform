import type { GearDetail } from "../gear-types";

export const prototypeheavyarmor: GearDetail = {
  slug: "prototypeheavyarmor",

  name: "시험형 중갑",
  enName: "Prototype Heavy Armor",

  category: "armor",
  level: 28,
  quality: 2,
  setName: "세트 없음",

  image: "/gear/prototypeheavyarmor.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "임시로 제작된 장비. 무게는 제법 나가지만, 방어 능력은 떨어집니다.",

  baseStat: {
    label: "방어력",
    value: "+22",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+37",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+25",
    },
  },

  attribute: {
    label: "공격력",
    values: {
      base: "+11",
    },
  },

  abilityTypes: ["strength", "intelligence"],
  attributeTypes: ["attack"],

  setEffects: [],
};
import type { GearDetail } from "../gear-types";

export const mordvoltinsulationvestt2: GearDetail = {
  slug: "mordvoltinsulationvestt2",

  name: "침식 차단 조끼 · II",
  enName: "Mordvolt Insulation Vest T2",

  category: "armor",
  level: 50,
  quality: 4,
  setName: "침식 차단",

  image: "/gear/mordvoltinsulationvestt2.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "특수 환경 작업 시 필요한 방호 장비. 심각한 침식 재해는 종종 말도 안 되는 회로 고장을 일으키기 때문에, 수리 시 각별한 주의가 요구됩니다.",

  baseStat: {
    label: "방어력",
    value: "+40",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+61",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+41",
    },
  },

  attribute: {
    label: "생명력",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["hp"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 지능 +50. 장착자의 생명력이 80%보다 높을 때, 주는 아츠 피해 +20%",
    },
  ],
};
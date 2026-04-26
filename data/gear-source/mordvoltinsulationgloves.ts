import type { GearDetail } from "../gear-types";

export const mordvoltinsulationgloves: GearDetail = {
  slug: "mordvoltinsulationgloves",

  name: "침식 차단 장갑",
  enName: "Mordvolt Insulation Gloves",

  category: "gloves",
  level: 36,
  quality: 3,
  setName: "침식 차단",

  image: "/gear/mordvoltinsulationgloves.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "특수 환경 작업 시 필요한 방호 장비. 비정상적으로 폭발하는 전류에 다치지 않기 위해, 침식 재해 현장에서 회로를 수리하는 공학자들은 반드시 특수 제작된 방호복을 착용해야 합니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+33",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+22",
    },
  },

  attribute: {
    label: "아츠 피해 보너스",
    values: {
      base: "+9.2%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["artsDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 지능 +50. 장착자의 생명력이 80%보다 높을 때, 주는 아츠 피해 +20%",
    },
  ],
};
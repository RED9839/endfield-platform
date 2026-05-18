import type { GearDetail } from "../gear-types";

export const mordvoltresistantgloves: GearDetail = {
  slug: "mordvoltresistantgloves",

  name: "침식 방호 장갑",
  enName: "Mordvolt Resistant Gloves",

  category: "gloves",
  level: 36,
  quality: 3,
  setName: "침식 방호",

  image: "/gear/mordvoltresistantgloves.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "특별히 튼튼한 장갑. 인류는 아직 침식 자체를 효과적으로 견뎌내는 방호복을 개발하지 못했습니다. 현재 사용하는 방호 장비의 대부분은 침식으로 인한 2차 재해에 대응하는 것이 고작입니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+33",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+22",
    },
  },

  attribute: {
    label: "치유 효율 보너스",
    values: {
      base: "+8.8%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["healEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 의지 +50. 장착자의 생명력이 50% 미만일 때, 주는 치유 효과 +30%",
    },
  ],
};
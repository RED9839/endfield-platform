import type { GearDetail } from "../gear-types";

export const mordvoltinsulationbattery: GearDetail = {
  slug: "mordvoltinsulationbattery",

  name: "침식 차단 배터리",
  enName: "Mordvolt Insulation Battery",

  category: "kit",
  level: 36,
  quality: 3,
  setName: "침식 차단",

  image: "/gear/mordvoltinsulationbattery.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "내구성이 매우 높은 배터리. 탈로스 II의 침식 환경에서 진행되는 긴급 수리 작업은 극도로 위험합니다. 그래서 '배터리를 어떻게 사용하는지'조차도 특별한 기준에 따라 엄격한 교육을 받아야 합니다.",

  baseStat: {
    label: "방어력",
    value: "+10",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+21",
    },
  },

  attribute: {
    label: "치명타 확률",
    values: {
      base: "+5.3%",
    },
  },

  abilityTypes: ["intelligence"],
  attributeTypes: ["critRate"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 지능 +50. 장착자의 생명력이 80%보다 높을 때, 주는 아츠 피해 +20%",
    },
  ],
};
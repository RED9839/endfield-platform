import type { GearDetail } from "../gear-types";

export const mordvoltresistantbattery: GearDetail = {
  slug: "mordvoltresistantbattery",

  name: "침식 방호 배터리",
  enName: "Mordvolt Resistant Battery",

  category: "kit",
  level: 36,
  quality: 3,
  setName: "침식 방호",

  image: "/gear/mordvoltresistantbattery.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "조금 무게감 있는 배터리. 경험이 풍부한 작업자는 이러한 오리지늄 배터리를 10분 이내에 유탄으로 개조할 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+10",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+21",
    },
  },

  attribute: {
    label: "치유 효율 보너스",
    values: {
      base: "+10.5%",
    },
  },

  abilityTypes: ["will"],
  attributeTypes: ["healEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 의지 +50. 장착자의 생명력이 50% 미만일 때, 주는 치유 효과 +30%",
    },
  ],
};
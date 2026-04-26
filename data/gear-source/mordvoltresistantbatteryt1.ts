import type { GearDetail } from "../gear-types";

export const mordvoltresistantbatteryt1: GearDetail = {
  slug: "mordvoltresistantbatteryt1",

  name: "침식 방호 배터리 · I",
  enName: "Mordvolt Resistant Battery T1",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "침식 방호",

  image: "/gear/mordvoltresistantbatteryt1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "조금 무게감 있는 배터리. 경험이 풍부한 작업자는 이러한 오리지늄 배터리를 10분 이내에 유탄으로 개조할 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+23",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "치유 효율 보너스",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["will", "agility"],
  attributeTypes: ["healEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 의지 +50. 장착자의 생명력이 50% 미만일 때, 주는 치유 효과 +30%",
    },
  ],
};
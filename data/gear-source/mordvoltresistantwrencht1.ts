import type { GearDetail } from "../gear-types";

export const mordvoltresistantwrencht1: GearDetail = {
  slug: "mordvoltresistantwrencht1",

  name: "침식 방호 스패너 · I",
  enName: "Mordvolt Resistant Wrench T1",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "침식 방호",

  image: "/gear/mordvoltresistantwrencht1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '유려한 라인의 스패너. "무기로 쓰니까 의외로 손에 착 감기더라고요!" - 익명을 요구한 작업자',

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
    label: "지능",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "공격력",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["attack"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 의지 +50. 장착자의 생명력이 50% 미만일 때, 주는 치유 효과 +30%",
    },
  ],
};
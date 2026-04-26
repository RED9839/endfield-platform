import type { GearDetail } from "../gear-types";

export const armoredmsgrflashlight: GearDetail = {
  slug: "armoredmsgrflashlight",

  name: "중장갑 전달자 손전등",
  enName: "Armored MSGR Flashlight",

  category: "kit",
  level: 36,
  quality: 3,
  setName: "중장갑 전달자",

  image: "/gear/armoredmsgrflashlight.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "튼튼한 손전등. 뒤쪽 뾰족한 부분은 주로 대화가 통하지 않는 이들과 '소통'하는 용도로 사용됩니다.",

  baseStat: {
    label: "방어력",
    value: "+10",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+21",
    },
  },

  attribute: {
    label: "생명력",
    values: {
      base: "+21.0%",
    },
  },

  abilityTypes: ["strength"],
  attributeTypes: ["hp"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 힘 +50. 장착자의 생명력이 50% 미만일 때, 받는 모든 유형 피해 -30%",
    },
  ],
};
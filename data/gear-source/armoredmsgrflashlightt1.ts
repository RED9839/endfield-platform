import type { GearDetail } from "../gear-types";

export const armoredmsgrflashlightt1: GearDetail = {
  slug: "armoredmsgrflashlightt1",

  name: "중장갑 전달자 손전등 · I",
  enName: "Armored MSGR Flashlight T1",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "중장갑 전달자",

  image: "/gear/armoredmsgrflashlightt1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "튼튼한 손전등. 뒤쪽 뾰족한 부분은 주로 대화가 통하지 않는 이들과 '소통'하는 용도로 사용됩니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "힘",
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
    label: "치명타 확률",
    values: {
      base: "+7.3%",
    },
  },

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["critRate"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 힘 +50. 장착자의 생명력이 50% 미만일 때, 받는 모든 유형 피해 -30%",
    },
  ],
};
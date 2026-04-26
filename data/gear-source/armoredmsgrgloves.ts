import type { GearDetail } from "../gear-types";

export const armoredmsgrgloves: GearDetail = {
  slug: "armoredmsgrgloves",

  name: "중장갑 전달자 장갑",
  enName: "Armored MSGR Gloves",

  category: "gloves",
  level: 36,
  quality: 3,
  setName: "중장갑 전달자",

  image: "/gear/armoredmsgrgloves.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "전달자들이 즐겨 쓰는 보호 장갑. 대부분의 전달자는 갑작스러운 침식 재해가 닥쳤을 때 목숨을 지킬 수 있도록, 자신의 교통수단에 긴급 탈출 장치를 추가로 장착합니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "힘",
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
    label: "모든 피해 감소",
    values: {
      base: "8.0%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["damageReduction"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 힘 +50. 장착자의 생명력이 50% 미만일 때, 받는 모든 유형 피해 -30%",
    },
  ],
};
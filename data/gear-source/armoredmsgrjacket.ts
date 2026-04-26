import type { GearDetail } from "../gear-types";

export const armoredmsgrjacket: GearDetail = {
  slug: "armoredmsgrjacket",

  name: "중장갑 전달자 재킷",
  enName: "Armored MSGR Jacket",

  category: "armor",
  level: 36,
  quality: 3,
  setName: "중장갑 전달자",

  image: "/gear/armoredmsgrjacket.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "전달자들이 즐겨 입는 재킷. 탈로스 II에서 오프로드 바이크는 가격 대비 성능이 뛰어난 교통수단입니다. 전달자들은 여기에 다양한 개조 모듈을 추가하곤 합니다.",

  baseStat: {
    label: "방어력",
    value: "+28",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+44",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+29",
    },
  },

  attribute: {
    label: "생명력",
    values: {
      base: "+10.5%",
    },
  },

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["hp"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 힘 +50. 장착자의 생명력이 50% 미만일 때, 받는 모든 유형 피해 -30%",
    },
  ],
};
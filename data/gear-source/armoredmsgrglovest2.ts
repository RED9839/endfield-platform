import type { GearDetail } from "../gear-types";

export const armoredmsgrglovest2: GearDetail = {
  slug: "armoredmsgrglovest2",

  name: "중장갑 전달자 장갑 · II",
  enName: "Armored MSGR Gloves T2",

  category: "gloves",
  level: 50,
  quality: 4,
  setName: "중장갑 전달자",

  image: "/gear/armoredmsgrglovest2.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "전달자들이 즐겨 쓰는 보호 장갑. 대부분의 전달자는 갑작스러운 침식 재해가 닥쳤을 때 목숨을 지킬 수 있도록, 자신의 교통수단에 긴급 탈출 장치를 추가로 장착합니다.",

  baseStat: {
    label: "방어력",
    value: "+30",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+46",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+30",
    },
  },

  attribute: {
    label: "연계 스킬 피해 보너스",
    values: {
      base: "+24.5%",
    },
  },

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["comboSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 힘 +50. 장착자의 생명력이 50% 미만일 때, 받는 모든 유형 피해 -30%",
    },
  ],
};
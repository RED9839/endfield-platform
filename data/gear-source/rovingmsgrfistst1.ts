import type { GearDetail } from "../gear-types";

export const rovingmsgrfistst1: GearDetail = {
  slug: "rovingmsgrfistst1",

  name: "순행 전달자 장갑 I",
  enName: "Roving MSGR Fists T1",

  category: "gloves",
  level: 50,
  quality: 4,
  setName: "순행 전달자",

  image: "/gear/rovingmsgrfistst1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "전달자들이 즐겨 쓰는 보호 장갑. 링 위에 올라가 실력을 겨루는 것도 전달자들의 취미 중 하나라고 합니다.",

  baseStat: {
    label: "방어력",
    value: "+30",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+46",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+30",
    },
  },

  attribute: {
    label: "공격력",
    values: {
      base: "+12.3%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["attack"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 민첩 +50. 장착자의 생명력이 80%보다 높을 때, 주는 물리 피해 +20%.",
    },
  ],
};
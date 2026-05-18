import type { GearDetail } from "../gear-types";

export const eternalxiraniteglovest1: GearDetail = {
  slug: "eternalxiraniteglovest1",

  name: "식양의 숨결 보호 장갑 I",
  enName: "Eternal Xiranite Gloves T1",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "식양의 숨결",

  image: "/gear/eternalxiraniteglovest1.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "어느 '광기에 찬' 천사가 남긴 유작. ...며칠 뒤, 그 광기에 찬 천사는 자신에게 '영감을 주지 못하는' 모든 음식을 거부하기 시작했고, 이어서 '삼킬 수 있는 식양'을 찾겠다며 뼈만 앙상하게 남은 채 황무지 속으로 사라졌습니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "궁극기 충전 효율",
    values: {
      base: "+20.5%",
      level1: "+22.6%",
      level2: "+24.6%",
      level3: "+26.7%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +1000. 장착자가 증폭, 비호, 취약, 허약을 부여한 후, 다른 팀원이 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const eternalxiranitepowercoret1: GearDetail = {
  slug: "eternalxiranitepowercoret1",

  name: "식양의 숨결 충전 코어 I",
  enName: "Eternal Xiranite Power Core T1",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "식양의 숨결",

  image: "/gear/eternalxiranitepowercoret1.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "어느 '광기에 찬' 천사가 남긴 유작. ...그 천사는 한때 '대나무 진액 두부찜'이 담긴 솥을 들고 거리를 활보하며, 새로운 식양 냉각 기술을 마침내 요리로 완성했다고 외쳤습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "치유 효율 보너스",
    values: {
      base: "+20.7%",
      level1: "+22.8%",
      level2: "+24.8%",
      level3: "+26.9%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["healEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +1000. 장착자가 증폭, 비호, 취약, 허약을 부여한 후, 다른 팀원이 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
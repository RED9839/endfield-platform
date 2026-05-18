import type { GearDetail } from "../gear-types";

export const eternalxiranitearmor: GearDetail = {
  slug: "eternalxiranitearmor",

  name: "식양의 숨결 경장갑",
  enName: "Eternal Xiranite Armor",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "식양의 숨결",

  image: "/gear/eternalxiranitearmor.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "어느 '광기에 찬' 천사가 남긴 유작. 보통 요리와 식양 에너지 공급을 연결 짓기 어렵지만, 무릉성에는 식당에서조차 디자인 영감을 얻는 사람이 있었습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+20",
      level1: "+22",
      level2: "+24",
      level3: "+26",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +1000. 장착자가 증폭, 비호, 취약, 허약을 부여한 후, 다른 팀원이 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
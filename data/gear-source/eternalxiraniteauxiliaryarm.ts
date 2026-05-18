import type { GearDetail } from "../gear-types";

export const eternalxiraniteauxiliaryarm: GearDetail = {
  slug: "eternalxiraniteauxiliaryarm",

  name: "식양의 숨결 보조 어깨",
  enName: "Eternal Xiranite Auxiliary Arm",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "식양의 숨결",

  image: "/gear/eternalxiraniteauxiliaryarm.webp",
  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "어느 '광기에 찬' 천사가 남긴 유작. ...그 광기에 찬 천사는 우르수스 요리사가 내온 훠궈 속에서 '끝없는 생명의 순환'을 보았다고 하며, 이를 통해 식양의 숨결 경장갑의 지속 시간을 두 배로 늘리는 데 성공했다고 합니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "궁극기 충전 효율",
    values: {
      base: "+24.6%",
      level1: "+27.1%",
      level2: "+29.6%",
      level3: "+32.0%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +1000. 장착자가 증폭, 비호, 취약, 허약을 부여한 후, 다른 팀원이 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
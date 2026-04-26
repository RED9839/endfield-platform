import type { GearDetail } from "../gear-types";

export const frontiersprotectionsuit: GearDetail = {
  slug: "frontiersprotectionsuit",

  name: "개척자 방호복",
  enName: "Frontiers Protection Suit",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontiersprotectionsuit.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "개척자 시리즈 방어구 지휘관 모델. 장갑 두께를 줄인 대신 추가로 원거리 무기 장치와 암호화 통신 장치를 장착하였습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "궁극기 충전 효율",
    values: {
      base: "+12.3%",
      level1: "+13.6%",
      level2: "+14.8%",
      level3: "+16.0%",
    },
  },

  abilityTypes: ["intelligence", "agility"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
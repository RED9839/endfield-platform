import type { GearDetail } from "../gear-types";

export const frontiersarmort3: GearDetail = {
  slug: "frontiersarmort3",

  name: "개척자 방어구 · III",
  enName: "Frontiers Armor T3",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontiersarmort3.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "개척자 시리즈 방어구 중량 프레임 모델. 어깨에 강한 화력 장치를 설치하기 위해 인공 척추 구조가 추가되었습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "민첩",
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
    label: "보조 능력치",
    values: {
      base: "+10.4%",
      level1: "+11.4%",
      level2: "+12.4%",
      level3: "+13.5%",
    },
  },

  abilityTypes: ["agility", "intelligence"],
  attributeTypes: ["subStat"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
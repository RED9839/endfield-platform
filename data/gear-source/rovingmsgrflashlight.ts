import type { GearDetail } from "../gear-types";

export const rovingmsgrflashlight: GearDetail = {
  slug: "rovingmsgrflashlight",

  name: "순행 전달자 손전등",
  enName: "Roving MSGR Flashlight",

  category: "kit",
  level: 36,
  quality: 3,
  setName: "순행 전달자",

  image: "/gear/rovingmsgrflashlight.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "튼튼한 손전등. 뒤쪽 뾰족한 부분은 가끔 오래된 고대 유물을 여는 데 사용되기도 합니다.",

  baseStat: {
    label: "방어력",
    value: "+10",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+21",
    },
  },

  attribute: {
    label: "연계 스킬 피해 보너스",
    values: {
      base: "+21.0%",
    },
  },

  abilityTypes: ["agility"],
  attributeTypes: ["comboSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 민첩 +50. 장착자의 생명력이 80%보다 높을 때, 주는 물리 피해 +20%.",
    },
  ],
};
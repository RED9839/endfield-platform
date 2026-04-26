import type { GearDetail } from "../gear-types";

export const aburreylightarmort1: GearDetail = {
  slug: "aburreylightarmort1",

  name: "아부레이 경갑 I",
  enName: "Aburrey Light Armor T1",

  category: "armor",
  level: 50,
  quality: 4,
  setName: "아부레이의 메아리",

  image: "/gear/aburreylightarmort1.webp",

  summary:
    "이 장비는 트리글라바 군수 공장에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "아부레이 채석장의 작업 환경에 맞춰 조정된 신형 방호 장갑. \"작업 중지! 작업 중지! 빨리 고요한 수도회에 연락해!\"",

  baseStat: {
    label: "방어력",
    value: "+40",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+61",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+41",
    },
  },

  attribute: {
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["will", "agility"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +24%. 장착자가 배틀 스킬, 연계 스킬, 궁극기를 사용할 때, 각각 공격력 +5%, 15초 동안 지속. 세 가지 버프는 독립적으로 존재하며 스택 수치는 중첩되지 않습니다.",
    },
  ],
};
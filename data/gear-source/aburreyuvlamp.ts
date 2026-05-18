import type { GearDetail } from "../gear-types";

export const aburreyuvlamp: GearDetail = {
  slug: "aburreyuvlamp",

  name: "아부레이 UV 램프",
  enName: "Aburrey UV Lamp",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "아부레이의 메아리",

  image: "/gear/aburreyuvlamp.webp",

  summary:
    "이 장비는 트리글라바 군수 공장에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "아부레이 채석장의 작업 환경에 맞춰 조정된 신형 방호 장갑. 갑작스러운 아부레이 채석장의 발굴 작업에 대응하기 위해, 공학자들이 밤새 이 방어구의 설계를 수정하여 시각 보호 및 청각 보호 모듈을 추가했습니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+23",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "모든 스킬 피해 보너스",
    values: {
      base: "+19.6%",
    },
  },

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["allSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +24%. 장착자가 배틀 스킬, 연계 스킬, 궁극기를 사용할 때, 각각 공격력 +5%, 15초 동안 지속. 세 가지 버프는 독립적으로 존재하며 스택 수치는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const aburreysensorchipt1: GearDetail = {
  slug: "aburreysensorchipt1",

  name: "아부레이 센서 칩 I",
  enName: "Aburrey Sensor Chip T1",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "아부레이의 메아리",

  image: "/gear/aburreysensorchipt1.webp",
  summary:
    "이 장비는 트리글라바 군수 공장에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "아부레이 채석장의 작업 환경에 맞춰 조정된 신형 방호 장갑. 공학자들의 설명에 따르면, 이 방호 장갑의 향후 개량 방향은 완전 자동화에 초점이 맞춰져 있습니다. 장착자가 의식을 잃어도 장비 스스로 안전하게 장착자를 데리고 현장에서 탈출할 수 있도록 말이죠.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+23",
    },
  },

  ability2: {
      label: "지능",
      values: {
        base: "+15",
      },
  },

  attribute: {
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+29.4%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +24%. 장착자가 배틀 스킬, 연계 스킬, 궁극기를 사용할 때, 각각 공격력 +5%, 15초 동안 지속. 세 가지 버프는 독립적으로 존재하며 스택 수치는 중첩되지 않습니다.",
    },
  ],
};
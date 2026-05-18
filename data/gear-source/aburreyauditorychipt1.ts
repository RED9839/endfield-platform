import type { GearDetail } from "../gear-types";

export const aburreyauditorychipt1: GearDetail = {
  slug: "aburreyauditorychipt1",

  name: "아부레이 도청 칩 I",
  enName: "Aburrey Auditory Chip T1",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "아부레이의 메아리",

  image: "/gear/aburreyauditorychipt1.webp",

  summary:
    "이 장비는 트리글라바 군수 공장에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "아부레이 채석장의 작업 환경에 맞춰 조정된 신형 방호 장갑. 미지의 환경을 탐색할 때는 강력한 차음 성능의 청각 방호 장비가 특히 중요합니다. 이 칩은 장착자가 스스로 환청 증상을 겪고 있는지 판단하는 데 효과적인 도움을 줍니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+23",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "연계 스킬 피해 보너스",
    values: {
      base: "+29.4%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["comboSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +24%. 장착자가 배틀 스킬, 연계 스킬, 궁극기를 사용할 때, 각각 공격력 +5%, 15초 동안 지속. 세 가지 버프는 독립적으로 존재하며 스택 수치는 중첩되지 않습니다.",
    },
  ],
};
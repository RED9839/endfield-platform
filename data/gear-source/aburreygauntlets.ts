import type { GearDetail } from "../gear-types";

export const aburreygauntlets: GearDetail = {
  slug: "aburreygauntlets",

  name: "아부레이 금속 장갑",
  enName: "Aburrey Gauntlets",

  category: "gloves",
  level: 50,
  quality: 4,
  setName: "아부레이의 메아리",

  image: "/gear/aburreygauntlets.webp",

  summary:
    "이 장비는 트리글라바 군수 공장에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "아부레이 채석장의 작업 환경에 맞춰 조정된 신형 방호 장갑. 일체형 방호 장갑 위에 장착된 손 보호구로, 손끝 부위에 여섯 종류, 총 백 개에 가까운 미세 센서가 내장되어 있어, 설령 시력을 잃는다 해도, 장착자는 이 센서를 통해 자신이 무엇에 닿았는지 정확히 알 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+30",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+46",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+30",
    },
  },

  attribute: {
    label: "불균형 목표에 주는 피해 보너스",
    values: {
      base: "+24.5%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["unbalancedTargetDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +24%. 장착자가 배틀 스킬, 연계 스킬, 궁극기를 사용할 때, 각각 공격력 +5%, 15초 동안 지속. 세 가지 버프는 독립적으로 존재하며 스택 수치는 중첩되지 않습니다.",
    },
  ],
};
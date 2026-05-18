import type { GearDetail } from "../gear-types";

export const aethertechanalysisband: GearDetail = {
  slug: "aethertechanalysisband",

  name: "경량 초자연 분석 반지",
  enName: "Æthertech Analysis Band",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "경량 초자연",

  image: "/gear/aethertechanalysisband.webp",

  summary:
    "이 장비는 경량 초자연 기술 실험실에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '경량 실험형 방호 장비. "우리 실험실은 침식 확산 흔적의 데이터화 분석 방법을 연구하고 있습니다. 제품 테스트에 참여할 지원자를 모집 중이니 많은 신청 바랍니다."',

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "물리 피해 보너스",
    values: {
      base: "+23.0%",
      level1: "+25.3%",
      level2: "+27.6%",
      level3: "+29.9%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["physicalDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +8%. 장착자가 적에게 방어 불능을 부여한 후, 물리 피해 +8%, 15초 동안 지속, 최대 중첩 4스택. 목표의 방어 불능 스택이 4스택에 도달할 경우, 추가 물리 피해 +16%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
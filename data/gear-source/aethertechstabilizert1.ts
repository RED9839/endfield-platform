import type { GearDetail } from "../gear-types";

export const aethertechstabilizert1: GearDetail = {
  slug: "aethertechstabilizert1",

  name: "경량 초자연 안정판 I",
  enName: "Æthertech Stabilizer T1",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "경량 초자연",

  image: "/gear/aethertechstabilizert1.webp",

  summary:
    "이 장비는 경량 초자연 기술 실험실에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '경량 실험형 방호 장비. "파라미터 오류로 인해 장착자가 풍선처럼 하늘로 떠오르는 현상을 방지하기 위해, 반드시 동봉된 안정판을 항상 휴대해 주시기 바랍니다. 감사합니다."',

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "힘",
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

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["physicalDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +8%. 장착자가 적에게 방어 불능을 부여한 후, 물리 피해 +8%, 15초 동안 지속, 최대 중첩 4스택. 목표의 방어 불능 스택이 4스택에 도달할 경우, 추가 물리 피해 +16%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
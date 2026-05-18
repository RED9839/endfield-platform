import type { GearDetail } from "../gear-types";

export const aethertechwatch: GearDetail = {
  slug: "aethertechwatch",

  name: "경량 초자연 손목시계",
  enName: "Æthertech Watch",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "경량 초자연",

  image: "/gear/aethertechwatch.webp",

  summary:
    "이 장비는 경량 초자연 기술 실험실에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '경량 실험형 방호 장비. "일부 소비자들이 본 연구소의 제품이 사용자의 혈액에 모종의 변이를 일으킨다고 의혹을 제기하고 있으나, 이는 전혀 근거 없는 허위 사실입니다."',

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
    label: "민첩",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+41.4%",
      level1: "+45.5%",
      level2: "+49.7%",
      level3: "+53.8%",
    },
  },

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +8%. 장착자가 적에게 방어 불능을 부여한 후, 물리 피해 +8%, 15초 동안 지속, 최대 중첩 4스택. 목표의 방어 불능 스택이 4스택에 도달할 경우, 추가 물리 피해 +16%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
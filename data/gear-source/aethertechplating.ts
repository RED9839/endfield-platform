import type { GearDetail } from "../gear-types";

export const aethertechplating: GearDetail = {
  slug: "aethertechplating",

  name: "경량 초자연 보호판",
  enName: "Æthertech Plating",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "경량 초자연",

  image: "/gear/aethertechplating.webp",

  summary:
    "이 장비는 경량 초자연 기술 실험실에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '경량 실험형 방호 장비. "홍산 사람들은 깃털에 빗대어 무게의 가벼움을 표현하곤 합니다. 우리 실험실의 반중력 시리즈 제품은 그 기준에 거의 근접했습니다."',

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "불균형 목표에 주는 피해 보너스",
    values: {
      base: "+20.7%",
      level1: "+22.8%",
      level2: "+24.8%",
      level3: "+26.9%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["unbalancedTargetDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +8%. 장착자가 적에게 방어 불능을 부여한 후, 물리 피해 +8%, 15초 동안 지속, 최대 중첩 4스택. 목표의 방어 불능 스택이 4스택에 도달할 경우, 추가 물리 피해 +16%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
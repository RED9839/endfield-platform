import type { GearDetail } from "../gear-types";

export const xiranflowbaton: GearDetail = {
  slug: "xiranflowbaton",

  name: "식양의 흐름 단봉",
  enName: "Xiranflow Baton",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "식양의 흐름",

  image: "/gear/xiranflowbaton.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "무릉성 순찰대원 무기로 도입 예정인 실험형 장비. 가벼운 단봉이지만 얕보지 마십시오. 필요하다면 야수의 뼈쯤은 손쉽게 부러뜨릴 수 있으니까요.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "지능",
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

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +10%. 장착자가 감전 혹은 부식을 소모할 때마다, 이상 레벨에 따른 같은 스택 수치의 강화 상태를 획득합니다. 스택이 중첩될 때마다 전기 피해 및 자연 피해 +15%, 25초 동안 지속. 강화 상태는 최대 3스택까지 중첩되며 중첩될 때마다 지속 시간은 따로 계산됩니다.",
    },
  ],
};
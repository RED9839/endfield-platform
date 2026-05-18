import type { GearDetail } from "../gear-types";

export const xiranflowlightarmor: GearDetail = {
  slug: "xiranflowlightarmor",

  name: "식양의 흐름 경갑",
  enName: "Xiranflow Light Armor",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "식양의 흐름",

  image: "/gear/xiranflowlightarmor.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "무릉성 순찰대원 방어구로 도입 예정인 실험형 장비. 식양 생산량이 안정권에 접어들자, 잠시 중단되었던 식양 장비 연구 개발이 재개되었습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "냉기와 전기 피해 보너스",
    values: {
      base: "+11.5%",
      level1: "+12.7%",
      level2: "+13.8%",
      level3: "+14.9%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["cryoElectricDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +10%. 장착자가 감전 혹은 부식을 소모할 때마다, 이상 레벨에 따른 같은 스택 수치의 강화 상태를 획득합니다. 스택이 중첩될 때마다 전기 피해 및 자연 피해 +15%, 25초 동안 지속. 강화 상태는 최대 3스택까지 중첩되며 중첩될 때마다 지속 시간은 따로 계산됩니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const xiranflowgloves: GearDetail = {
  slug: "xiranflowgloves",

  name: "식양의 흐름 보호 장갑",
  enName: "Xiranflow Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "식양의 흐름",

  image: "/gear/xiranflowgloves.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '"그러니까 네 말은, 앞으로 이런 장갑은... 어... 식양 설비라면 뭐든 갖다 대기만 해도 에너지가 충전된다는 거야? 진짜로...?"',

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "냉기와 전기 피해 보너스",
    values: {
      base: "+19.2%",
      level1: "+21.1%",
      level2: "+23.0%",
      level3: "+24.9%",
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
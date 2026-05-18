import type { GearDetail } from "../gear-types";

export const frontiersfibergloves: GearDetail = {
  slug: "frontiersfibergloves",

  name: "개척자 섬유 장갑",
  enName: "Frontiers Fiber Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontiersfibergloves.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "개척자 시리즈 방어구 수중 작전 모델. 특수 섬유 직조 기술을 적용해 장갑에도 산소 순환 기능이 탑재되어 있습니다.",

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
    label: "힘",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "모든 스킬 피해 보너스",
    values: {
      base: "+23.0%",
      level1: "+25.3%",
      level2: "+27.6%",
      level3: "+29.9%",
    },
  },

  abilityTypes: ["will", "strength"],
  attributeTypes: ["allSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
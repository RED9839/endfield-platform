import type { GearDetail } from "../gear-types";

export const frontierscommt1: GearDetail = {
  slug: "frontierscommt1",

  name: "개척자 통신기 · I",
  enName: "Frontiers Comm T1",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontierscommt1.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "묵직한 통신기. 복잡한 지하 유적 발굴 현장에서도 안정적인 통신을 보장하기 위해, 설계자는 개척자 통신기에 정보 전달 기능만을 남겨두었습니다.",

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
    label: "지능",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "냉기와 전기 피해 보너스",
    values: {
      base: "+23.0%",
      level1: "+25.3%",
      level2: "+27.6%",
      level3: "+29.9%",
    },
  },

  abilityTypes: ["strength", "intelligence"],
  attributeTypes: ["cryoElectricDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
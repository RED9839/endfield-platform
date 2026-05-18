import type { GearDetail } from "../gear-types";

export const frontierso2tube: GearDetail = {
  slug: "frontierso2tube",

  name: "개척자 산소 공급 장치",
  enName: "Frontiers O2 Tube",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontierso2tube.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "개척자 시리즈 장비의 순환 산소 공급 기술 덕분에, 산소 공급 장치를 착용한 사용자는 최소 4시간 동안 수중 고압 작업을 수행할 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
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

  abilityTypes: ["will"],
  attributeTypes: ["physicalDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
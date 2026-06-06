import type { GearDetail } from "../gear-types";

export const catastrophegauzecartridget1: GearDetail = {
  slug: "catastrophegauzecartridget1",

  name: "재앙 방호 정화 코어 · I",
  enName: "Catastrophe Gauze Cartridge T1",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "재앙 방호",

  image: "/gear/catastrophegauzecartridget1.webp",

  summary:
    "이 장비는 트리글라바 군수 공장에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "오리지늄 연구 구역의 재배 작업에 사용하는 외골격 장비. 탈로스 II에서는 광석병이 효과적으로 제어되고 있지만, 기본적인 호흡기 보호는 계속 철저히 해주시기 바랍니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+23",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "보조 능력치",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["subStat"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 궁극기 충전 효율 +20%. 전투 시작 시, 즉시 궁극기 게이지 50포인트를 회복합니다.",
    },
  ],
};

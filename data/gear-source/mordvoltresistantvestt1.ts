import type { GearDetail } from "../gear-types";

export const mordvoltresistantvestt1: GearDetail = {
  slug: "mordvoltresistantvestt1",

  name: "침식 방호 조끼 · I",
  enName: "Mordvolt Resistant Vest T1",

  category: "armor",
  level: 50,
  quality: 4,
  setName: "침식 방호",

  image: "/gear/mordvoltresistantvestt1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '튼튼한 방호 조끼. "긴급 수리 현장에선 반드시 방호 장비를 착용해야 해. 안 그러면 고장 난 설비가 살려달라고 비명 지르는 꼴을 보게 될지도 모르니까... 의사 선생님 귀찮게 하지 말자고, 알겠지?"',

  baseStat: {
    label: "방어력",
    value: "+40",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+61",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+41",
    },
  },

  attribute: {
    label: "생명력",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["hp"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 의지 +50. 장착자의 생명력이 50% 미만일 때, 주는 치유 효과 +30%",
    },
  ],
};
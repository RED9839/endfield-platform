import type { GearDetail } from "../gear-types";

export const mordvoltresistantvest: GearDetail = {
  slug: "mordvoltresistantvest",

  name: "침식 방호 조끼",
  enName: "Mordvolt Resistant Vest",

  category: "armor",
  level: 36,
  quality: 3,
  setName: "침식 방호",

  image: "/gear/mordvoltresistantvest.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '튼튼한 방호 조끼. "긴급 수리 현장에선 반드시 방호 장비를 착용해야 해. 안 그러면 고장 난 설비가 살려달라고 비명 지르는 꼴을 보게 될지도 모르니까... 의사 선생님 귀찮게 하지 말자고, 알겠지?"',

  baseStat: {
    label: "방어력",
    value: "+28",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+44",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+29",
    },
  },

  attribute: {
    label: "생명력",
    values: {
      base: "+10.5%",
    },
  },

  abilityTypes: ["will", "agility"],
  attributeTypes: ["hp"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 의지 +50. 장착자의 생명력이 50% 미만일 때, 주는 치유 효과 +30%",
    },
  ],
};
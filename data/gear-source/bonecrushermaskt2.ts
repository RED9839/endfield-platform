import type { GearDetail } from "../gear-types";

export const bonecrushermaskt2: GearDetail = {
  slug: "bonecrushermaskt2",

  name: "본 크러셔 마스크 II",
  enName: "Bonekrusha Mask T2",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "본 크러셔",

  image: "/gear/bonecrushermaskt2.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "본 크러셔 집단의 장비에서 디자인 영감을 받은 장비. 어떤 광적인 믿음을 상징하는 마스크입니다. 하지만 단순히 신념만으로는 침식 환경에서 오래 살아남을 수 없습니다. 허리에 차든 얼굴에 쓰든, 결국 나무 쪼가리에 불과하니까요.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "힘",
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

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +15%. 장착자가 연계 스킬을 사용할 때, 본 크러셔의 압박 1스택 획득, 다음 배틀 스킬의 피해 +30%. 본 크러셔의 압박은 최대 2스택까지만 중첩됩니다.",
    },
  ],
};
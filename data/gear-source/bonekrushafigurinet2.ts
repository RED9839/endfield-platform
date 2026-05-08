import type { GearDetail } from "../gear-types";

export const bonekrushafigurinet2: GearDetail = {
  slug: "bonekrushafigurinet2",

  name: "본 크러셔 조각상 · II",
  enName: "Bonekrusha Figurine T2",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "본 크러셔",

  image: "/gear/bonekrushafigurinet2.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "별다른 실용성은 없는 작은 공예품, 하지만 설계자는 이것이 사람의 흥분 상태를 효과적으로 끌어올릴 수 있다고 주장합니다.",

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
        "장착자의 공격력 +15%. 장착자가 연계 스킬을 사용할 때, 본 크러셔의 압박 1스택 획득, 다음 배틀 스킬의 피해 +30%. 본 크러셔의 압박은 최대 2스택까지만 중첩됩니다.",
    },
  ],
};
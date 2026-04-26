import type { GearDetail } from "../gear-types";

export const frontiersanalyzer: GearDetail = {
  slug: "frontiersanalyzer",

  name: "개척자 분석 장치",
  enName: "Frontiers Analyzer",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontiersanalyzer.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "개척자 시리즈 보조 장비 안전성 분석 장치. 이미지 인식 기술로 미확인 물체에 대한 기초 안전성 평가를 수행할 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
    },
  },

  attribute: {
    label: "궁극기 피해 보너스",
    values: {
      base: "+51.7%",
      level1: "+56.9%",
      level2: "+62.1%",
      level3: "+67.3%",
    },
  },

  abilityTypes: ["strength"],
  attributeTypes: ["ultimateDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
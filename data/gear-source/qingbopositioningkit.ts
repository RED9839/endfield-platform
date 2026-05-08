import type { GearDetail } from "../gear-types";

export const qingbopositioningkit: GearDetail = {
  slug: "qingbopositioningkit",

  name: "청파 위치 지정기",
  enName: "Qingbo Positioning Kit",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "청파",

  image: "/gear/qingbopositioningkit.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "청파채의 고서에서 복원해 낸 가성비 높은 장비. 수맥 탐지 기능과 나침반 기능을 결합한 간이 장치입니다. 문헌에 따르면, 청파채 건립 초기부터 혁혁한 공을 세웠다고 전해집니다.",

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
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 연계 스킬을 사용할 때, 모든 스킬 피해 +20%, 15초 동안 지속. 해당 효과는 최대 2스택까지 중첩되며 중첩될 때마다 지속 시간은 따로 계산됩니다.",
    },
  ],
};
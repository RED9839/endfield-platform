import type { GearDetail } from "../gear-types";

export const pulserlabscalibrator: GearDetail = {
  slug: "pulserlabscalibrator",

  name: "펄스식 교정기",
  enName: "Pulser Labs Calibrator",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "펄스식",

  image: "/gear/pulserlabscalibrator.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "혁신적으로 설계된 장비. 이 장비는 끝없는 데이터의 바다 속에서 교묘하게 숨어있는 몇 개의 '바늘'을 지워낼 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
    },
  },

  abilityTypes: ["intelligence"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 감전을 부여한 후, 전기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 동결을 부여한 후, 냉기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
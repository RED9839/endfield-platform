import type { GearDetail } from "../gear-types";

export const pulserlabsprobe: GearDetail = {
  slug: "pulserlabsprobe",

  name: "펄스식 시험침",
  enName: "Pulser Labs Probe",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "펄스식",

  image: "/gear/pulserlabsprobe.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "혁신적으로 설계된 장비. 칠흑 같은 얼음 안개 속에서도 사라진 흔적을 찾아낼 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
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

  abilityTypes: ["intelligence", "agility"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 감전을 부여한 후, 전기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 동결을 부여한 후, 냉기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const pulserlabsdisruptorsuit: GearDetail = {
  slug: "pulserlabsdisruptorsuit",

  name: "펄스식 교란 방어구",
  enName: "Pulser Labs Disruptor Suit",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "펄스식",

  image: "/gear/pulserlabsdisruptorsuit.webp",
  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "혁신적으로 설계된 장비. 엔드필드 공업이 왜 정보전에 특화된 이 방어 장비를 개발했는지 이해하는 사람은 거의 없습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+20",
      level1: "+22",
      level2: "+24",
      level3: "+26",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 감전을 부여한 후, 전기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 동결을 부여한 후, 냉기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const hotworkpowerbank: GearDetail = {
  slug: "hotworkpowerbank",

  name: "열 작업용 에너지 저장함",
  enName: "Hot Work Power Bank",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "열 작업용",

  image: "/gear/hotworkpowerbank.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "극도의 내열성을 자랑하는 장비. 열 작업용 에너지 저장함은 일종의 소형 발전소로도 볼 수 있습니다. 주변의 높은 온도를 효과적으로 활용하여 사용자에게 에너지를 공급합니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "힘",
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

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 연소를 부여한 후, 열기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 부식을 부여한 후, 자연 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
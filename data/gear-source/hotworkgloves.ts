import type { GearDetail } from "../gear-types";

export const hotworkgloves: GearDetail = {
  slug: "hotworkgloves",

  name: "열 작업용 장갑",
  enName: "Hot Work Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "열 작업용",

  image: "/gear/hotworkgloves.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "극도의 내열성을 자랑하는 장비. 연맹 공단과 엔드필드 공업이 고온 환경 심층 탐사를 위해 협력하여 개발한 열 작업용 시리즈 장비입니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+34",
      level1: "+37",
      level2: "+41",
      level3: "+44",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 연소를 부여한 후, 열기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 부식을 부여한 후, 자연 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const hotworkpyrometer: GearDetail = {
  slug: "hotworkpyrometer",

  name: "열 작업용 온도 측정기",
  enName: "Hot Work Pyrometer",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "열 작업용",

  image: "/gear/hotworkpyrometer.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "극도의 내열성을 자랑하는 장비. 극도의 고온 환경은 두려워할 필요가 없지만, 이유 없이 온도가 변하는 환경이라면 경계할 필요가 있습니다.",

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
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+41.4%",
      level1: "+45.5%",
      level2: "+49.7%",
      level3: "+53.8%",
    },
  },

  abilityTypes: ["intelligence"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 연소를 부여한 후, 열기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 부식을 부여한 후, 자연 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const hotworkgauntlets: GearDetail = {
  slug: "hotworkgauntlets",

  name: "열 작업용 금속 장갑",
  enName: "Hot Work Gauntlets",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "열 작업용",

  image: "/gear/hotworkgauntlets.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '극도의 내열성을 자랑하는 장비. "쉿, 조용히 해. \'그것\'을 깨우겠어."',

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "열기와 자연 피해 보너스",
    values: {
      base: "+19.2%",
      level1: "+21.1%",
      level2: "+23.0%",
      level3: "+24.9%",
    },
  },

  abilityTypes: ["intelligence", "strength"],
  attributeTypes: ["heatNatureDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 연소를 부여한 후, 열기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 부식을 부여한 후, 자연 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
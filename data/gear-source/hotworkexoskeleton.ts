import type { GearDetail } from "../gear-types";

export const hotworkexoskeleton: GearDetail = {
  slug: "hotworkexoskeleton",

  name: "열 작업용 강화 골격",
  enName: "Hot Work Exoskeleton",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "열 작업용",

  image: "/gear/hotworkexoskeleton.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '극도의 내열성을 자랑하는 장비. "인류는 탈로스 II의 모든 땅을 정복할 것입니다" 헌신자들은 그렇게 믿기에, 기꺼이 거친 바다의 격류를 막아서고, 불타는 대지의 화염에 맞섭니다.',

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "열기와 자연 피해 보너스",
    values: {
      base: "+11.5%",
      level1: "+12.7%",
      level2: "+13.8%",
      level3: "+14.9%",
    },
  },

  abilityTypes: ["strength", "agility"],
  attributeTypes: ["heatNatureDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 연소를 부여한 후, 열기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 부식을 부여한 후, 자연 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const pulserlabsinvasioncore: GearDetail = {
  slug: "pulserlabsinvasioncore",

  name: "펄스식 침입 코어",
  enName: "Pulser Labs Invasion Core",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "펄스식",

  image: "/gear/pulserlabsinvasioncore.webp",
  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "혁신적으로 설계된 장비. 고요한 수도회의 지원을 받은 펄스식 침입 코어는 거의 모든 단말기의 방화벽을 무력화시킬 수 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "의지",
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

  abilityTypes: ["will"],
  attributeTypes: ["ultimateDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 감전을 부여한 후, 전기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 동결을 부여한 후, 냉기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const catastropheheavyarmort1: GearDetail = {
  slug: "catastropheheavyarmort1",

  name: "재앙 방호 중갑 · I",
  enName: "Catastrophe Heavy Armor T1",

  category: "armor",
  level: 50,
  quality: 4,
  setName: "재앙 방호",

  image: "/gear/catastropheheavyarmort1.webp",

  summary:
    "이 장비는 재앙 대응을 위해 설계된 중장갑 장비입니다.",
  description:
    "강력한 오리지늄 오염 환경에서도 생존할 수 있도록 설계된 방호 장비입니다.",

  baseStat: {
    label: "방어력",
    value: "+40",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+61",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+41",
    },
  },

  attribute: {
    label: "궁극기 충전 효율",
    values: {
      base: "+18.0%",
    },
  },

  abilityTypes: ["strength", "will"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 궁극기 충전 효율 +20%. 전투 시작 시, 즉시 궁극기 게이지 50포인트를 회복합니다.",
    },
  ],
};

import type { GearDetail } from "../gear-types";

export const catastrophegauzecartridge: GearDetail = {
  slug: "catastrophegauzecartridge",

  name: "재앙 방호 정화 코어",
  enName: "Catastrophe Gauze Cartridge",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "재앙 방호",

  image: "/gear/catastrophegauzecartridge.webp",

  summary:
    "오염 제거용 핵심 장비입니다.",
  description:
    "오리지늄 오염을 정화하고 안정성을 유지하는 핵심 장치입니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "힘",
    values: {
      base: "+23",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "궁극기 피해 보너스",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["strength", "intelligence"],
  attributeTypes: ["ultimateDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 궁극기 피해 보너스 +20%. 궁극기 사용 시, 10초 동안 모든 피해 +15%",
    },
  ],
};
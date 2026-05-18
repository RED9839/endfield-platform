import type { GearDetail } from "../gear-types";

export const catastrophefilter: GearDetail = {
  slug: "catastrophefilter",

  name: "재앙 방호 필터",
  enName: "Catastrophe Filter",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "재앙 방호",

  image: "/gear/catastrophefilter.webp",

  summary:
    "오염 환경 대응을 위한 필터 장치입니다.",
  description:
    "오리지늄 입자를 제거하고 생존성을 높이는 장비입니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "의지",
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
    label: "오리지늄 아츠 강도",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["will", "intelligence"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 궁극기 피해 보너스 +20%. 궁극기 사용 시, 10초 동안 모든 피해 +15%",
    },
  ],
};
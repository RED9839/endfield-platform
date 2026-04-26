import type { GearDetail } from "../gear-types";

export const catastrophegloves: GearDetail = {
  slug: "catastrophegloves",

  name: "재앙 방호 장갑",
  enName: "Catastrophe Gloves",

  category: "gloves",
  level: 50,
  quality: 4,
  setName: "재앙 방호",

  image: "/gear/catastrophegloves.webp",
  summary:
    "재앙 환경 대응용으로 제작된 보호 장갑입니다.",
  description:
    "오염 물질과 극한 환경에서 작업을 수행하기 위한 장비입니다.",

  baseStat: {
    label: "방어력",
    value: "+30",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+46",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+30",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+24.5%",
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
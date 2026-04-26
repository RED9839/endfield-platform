import type { GearDetail } from "../gear-types";

export const mordvoltinsulationwrencht2: GearDetail = {
  slug: "mordvoltinsulationwrencht2",

  name: "침식 차단 스패너 · II",
  enName: "Mordvolt Insulation Wrench T2",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "침식 차단",

  image: "/gear/mordvoltinsulationwrencht2.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "특수 방호 코팅을 입힌 스패너. 비상시에는 무기로도 사용할 수 있으며, 일부 아겔로스의 팔다리 정도는 효과적으로 박살 낼 수도 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+23",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "공격력",
    values: {
      base: "+14.7%",
    },
  },

  abilityTypes: ["intelligence", "agility"],
  attributeTypes: ["attack"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 지능 +50. 장착자의 생명력이 80%보다 높을 때, 주는 아츠 피해 +20%",
    },
  ],
};
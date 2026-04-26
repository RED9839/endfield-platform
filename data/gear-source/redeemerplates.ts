import type { GearDetail } from "../gear-types";

export const redeemerplates: GearDetail = {
  slug: "redeemerplates",

  name: "위기 탈출 중장갑",
  enName: "Redeemer Plates",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "세트 없음",

  image: "/gear/redeemerplates.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '험난한 앞길을 상징하는 장비. "일은 아직 끝나지 않았고, 갈 길은 여전히 멉니다."',

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+115",
      level1: "+126",
      level2: "+138",
      level3: "+149",
    },
  },

  attribute: {
    label: "일반 공격 피해 보너스",
    values: {
      base: "+14.4%",
      level1: "+15.8%",
      level2: "+17.3%",
      level3: "+18.7%",
    },
  },

  abilityTypes: ["agility"],
  attributeTypes: ["normalAttack"],

  setEffects: [],
};
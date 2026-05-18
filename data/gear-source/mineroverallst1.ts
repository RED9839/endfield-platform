import type { GearDetail } from "../gear-types";

export const mineroverallst1: GearDetail = {
  slug: "mineroverallst1",

  name: "광산 방호복 · I",
  enName: "Miner Overalls T1",

  category: "armor",
  level: 50,
  quality: 4,
  setName: "세트 없음",

  image: "/gear/mineroverallst1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "주로 광산 작업에 사용하는 방호 장비. <4번 협곡 안전 방호 표준>에서는 노동 작업 방호 장비에 대해, 연성 보호층과 경성 보호층으로 구성된 최소 이중의 방호 구조를 갖출 것을 명시하고 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+40",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+65",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+43",
    },
  },

  attribute: {
    label: "공격력",
    values: {
      base: "+7.8%",
    },
  },

  abilityTypes: ["intelligence", "agility"],
  attributeTypes: ["attack"],

  setEffects: [],
};
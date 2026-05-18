import type { GearDetail } from "../gear-types";

export const aicceramicplate: GearDetail = {
  slug: "aicceramicplate",

  name: "통합형 세라믹판",
  enName: "AIC Ceramic Plate",

  category: "kit",
  level: 28,
  quality: 2,
  setName: "통합 경량형 모델",

  image: "/gear/aicceramicplate.webp",
  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "단순한 구조의 모듈화한 경량형 방호 장비. 다수의 타격을 분산시킬 수 있는 벌집형 세라믹 장갑판을 사용합니다.",

  baseStat: {
    label: "방어력",
    value: "+8",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+16",
    },
  },

  attribute: {
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+16.2%",
    },
  },

  abilityTypes: ["will"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +500. 장착자가 적을 처치한 후, 공격력 +20, 5초 동안 지속.",
    },
  ],
};
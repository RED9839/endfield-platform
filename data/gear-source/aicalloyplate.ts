import type { GearDetail } from "../gear-types";

export const aicalloyplate: GearDetail = {
  slug: "aicalloyplate",

  name: "통합형 합금판",
  enName: "AIC Alloy Plate",

  category: "kit",
  level: 28,
  quality: 2,
  setName: "통합 중량형 모델",

  image: "/gear/aicalloyplate.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "단순한 구조의 모듈화한 중량형 방호 장비. 비용은 매우 저렴하지만, 우수한 품질의 재료를 사용해 충분히 만족스러운 방어 성능을 보여줍니다.",

  baseStat: {
    label: "방어력",
    value: "+8",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+16",
    },
  },

  attribute: {
    label: "모든 피해 감소",
    values: {
      base: "7.5%",
    },
  },

  abilityTypes: ["agility"],
  attributeTypes: ["damageReduction"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +500. 장착자가 적을 처치한 후, 생명력 100 포인트 회복. 해당 효과는 5초마다 최대 1회만 발동합니다.",
    },
  ],
};
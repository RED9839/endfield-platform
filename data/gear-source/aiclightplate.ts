import type { GearDetail } from "../gear-types";

export const aiclightplate: GearDetail = {
  slug: "aiclightplate",

  name: "통합형 경갑판",
  enName: "AIC Light Plate",

  category: "kit",
  level: 28,
  quality: 2,
  setName: "통합 경량형 모델",

  image: "/gear/aiclightplate.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "단순한 구조의 모듈화한 경량형 방호 장비. 방어력은 다소 부족하지만, 뛰어난 통기성은 확실한 장점으로 평가받습니다.",

  baseStat: {
    label: "방어력",
    value: "+8",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+16",
    },
  },

  attribute: {
    label: "연계 스킬 피해 보너스",
    values: {
      base: "+16.2%",
    },
  },

  abilityTypes: ["intelligence"],
  attributeTypes: ["comboSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +500. 장착자가 적을 처치한 후, 공격력 +20, 5초 동안 지속.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const aiclightarmor: GearDetail = {
  slug: "aiclightarmor",

  name: "통합형 경갑",
  enName: "AIC Light Armor",

  category: "armor",
  level: 28,
  quality: 2,
  setName: "통합 경량형 모델",

  image: "/gear/aiclightarmor.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "단순한 구조의 모듈화한 경량형 방호 장비. 통합 공업 시스템 관련 설비의 시험 가동 과정에서, 몇몇 혼합 생산 라인을 시험하던 중 우연히 탄생했습니다.",

  baseStat: {
    label: "방어력",
    value: "+22",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+30",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+30",
    },
  },

  attribute: {
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+8.1%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +500. 장착자가 적을 처치한 후, 공격력 +20, 5초 동안 지속.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const aictacticalgloves: GearDetail = {
  slug: "aictacticalgloves",

  name: "통합형 전술 장갑",
  enName: "AIC Tactical Gloves",

  category: "gloves",
  level: 28,
  quality: 2,
  setName: "통합 경량형 모델",

  image: "/gear/aictacticalgloves.webp",

  summary:
    "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "단순한 구조의 모듈화한 경량형 방호 장비. 최상급의 방어력을 보여주지는 못하지만, 장착이 편리하다는 장점이 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+16",
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
      base: "+23",
    },
  },

  attribute: {
    label: "연계 스킬 피해 보너스",
    values: {
      base: "+13.5%",
    },
  },

  abilityTypes: ["intelligence", "agility"],
  attributeTypes: ["comboSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 생명력 +500. 장착자가 적을 처치한 후, 공격력 +20, 5초 동안 지속.",
    },
  ],
};
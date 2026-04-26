import type { GearDetail } from "../gear-types";

export const aethertechlightgloves: GearDetail = {
  slug: "aethertechlightgloves",

  name: "경량 초자연 경량 보호 장갑",
  enName: "Æthertech Light Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "경량 초자연",

  image: "/gear/aethertechlightgloves.webp",

  summary:
    "이 장비는 경량 초자연 기술 실험실에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '경량 실험형 방호 장비. "본 실험실의 제품을 사용하실 때는 추가로 안감을 덧대어 착용해 주시기 바랍니다. 만약 환청이나 환각 등의 증상이 나타날 경우, 즉시 제품을 벗고 음식을 섭취하시기 바랍니다."',

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "민첩",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "모든 스킬 피해 보너스",
    values: {
      base: "+23.0%",
      level1: "+25.3%",
      level2: "+27.6%",
      level3: "+29.9%",
    },
  },

  abilityTypes: ["will", "agility"],
  attributeTypes: ["allSkillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +8%. 장착자가 적에게 방어 불능을 부여한 후, 물리 피해 +8%, 15초 동안 지속, 최대 중첩 4스택. 목표의 방어 불능 스택이 4스택에 도달할 경우, 추가 물리 피해 +16%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
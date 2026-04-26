import type { GearDetail } from "../gear-types";

export const frontiersblightresgloves: GearDetail = {
  slug: "frontiersblightresgloves",

  name: "개척자 내부식성 장갑",
  enName: "Frontiers Blight RES Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontiersblightresgloves.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "개척자 시리즈 장비는 3~5명으로 구성된 소대가 소규모 아겔로스 무리를 정면에서 섬멸할 수 있는 작전 능력을 갖추도록 설계되었습니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "배틀 스킬 피해 보너스",
    values: {
      base: "+34.5%",
      level1: "+38.0%",
      level2: "+41.4%",
      level3: "+44.9%",
    },
  },

  abilityTypes: ["agility", "intelligence"],
  attributeTypes: ["skillDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
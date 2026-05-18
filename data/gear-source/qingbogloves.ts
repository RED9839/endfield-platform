import type { GearDetail } from "../gear-types";

export const qingbogloves: GearDetail = {
  slug: "qingbogloves",

  name: "청파 보호 장갑",
  enName: "Qingbo Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "청파",

  image: "/gear/qingbogloves.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "청파채의 고서에서 복원해 낸 가성비 높은 장비. 고서의 보호 장갑 설계도 한구석에는 '사흘이면 완성되나, 천고도 능히 상대하리라.'라는 주석이 달려 있습니다.",

  baseStat: {
    label: "방어력",
    value: "+42",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+65",
      level1: "+71",
      level2: "+78",
      level3: "+84",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "궁극기 충전 효율",
    values: {
      base: "+20.5%",
      level1: "+22.6%",
      level2: "+24.6%",
      level3: "+26.7%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 연계 스킬을 사용할 때, 모든 스킬 피해 +20%, 15초 동안 지속. 해당 효과는 최대 2스택까지 중첩되며 중첩될 때마다 지속 시간은 따로 계산됩니다.",
    },
  ],
};
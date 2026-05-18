import type { GearDetail } from "../gear-types";

export const qingbolightarmor: GearDetail = {
  slug: "qingbolightarmor",

  name: "청파 경갑",
  enName: "Qingbo Light Armor",

  category: "armor",
  level: 70,
 quality: 5,
  setName: "청파",

  image: "/gear/qingbolightarmor.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "청파채의 고서에서 복원해 낸 가성비 높은 장비. 특수 대나무 조각과 질긴 가죽을 꿰매 만든 경갑입니다. 짐승 무리의 위협이 끊이지 않았던 청파채 건립 초기, 짐승 가죽으로 만든 방어구는 흔한 물건이었습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+20",
      level1: "+22",
      level2: "+24",
      level3: "+26",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["originiumArts"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 연계 스킬을 사용할 때, 모든 스킬 피해 +20%, 15초 동안 지속. 해당 효과는 최대 2스택까지 중첩되며 중첩될 때마다 지속 시간은 따로 계산됩니다.",
    },
  ],
};
import type { GearDetail } from "../gear-types";

export const qingbocask: GearDetail = {
  slug: "qingbocask",

  name: "청파 물 항아리",
  enName: "Qingbo Cask",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "청파",

  image: "/gear/qingbocask.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "청파채의 고서에서 복원해 낸 가성비 높은 장비. 간이 정화 필터가 내장된 작은 물통입니다. 고서의 정수 장치 관련 기록이 어째서인지 찢겨 나간 탓에, 필터는 현대의 모조품으로 대체해야 했습니다.",

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "의지",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "오리지늄 아츠 강도",
    values: {
      base: "+41",
      level1: "+45",
      level2: "+49",
      level3: "+53",
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
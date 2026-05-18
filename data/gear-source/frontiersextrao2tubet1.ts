import type { GearDetail } from "../gear-types";

export const frontiersextrao2tubet1: GearDetail = {
  slug: "frontiersextrao2tubet1",

  name: "개척자 증량 산소 공급 장치 · I",
  enName: "Frontiers Extra O2 Tube T1",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "개척",

  image: "/gear/frontiersextrao2tubet1.webp",

  summary:
    "이 장비는 노스마치 중공업 지원소에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "개척자 시리즈 장비의 순환 산소 공급 기술 덕분에, 산소 공급 장치를 착용한 사용자는 최소 4시간 동안 수중 고압 작업을 수행할 수 있습니다. 업그레이드 후에는 작업 시간이 6시간으로 늘어납니다.",

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
    label: "민첩",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "보조 능력치",
    values: {
      base: "+20.7%",
      level1: "+22.8%",
      level2: "+24.8%",
      level3: "+26.9%",
    },
  },

  abilityTypes: ["intelligence", "agility"],
  attributeTypes: ["subStat"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 연계 스킬 쿨타임 감소 +15%. 장착자가 스킬을 사용하여 스킬 게이지를 회복한 후, 팀 전체가 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
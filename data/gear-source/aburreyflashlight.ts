import type { GearDetail } from "../gear-types";

export const aburreyflashlight: GearDetail = {
  slug: "aburreyflashlight",

  name: "아부레이 조명 장치",
  enName: "Aburrey Flashlight",

  category: "kit",
  level: 50,
  quality: 4,
  setName: "아부레이의 메아리",

  image: "/gear/aburreyflashlight.webp",

  summary:
    "이 장비는 트리글라바 군수 공장에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "아부레이 채석장의 작업 환경에 맞춰 조정된 신형 방호 장갑. \"그건 그냥 바위에 박혀 있었어요. 콘크리트에서 철근 하나가 삐져나온 것처럼... 그런데... 그게 저한테 말을 거는 것 같았어요...\"",

  baseStat: {
    label: "방어력",
    value: "+15",
  },

  ability1: {
    label: "지능",
    values: {
      base: "+23",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+15",
    },
  },

  attribute: {
    label: "궁극기 충전 효율",
    values: {
      base: "+17.5%",
    },
  },

  abilityTypes: ["intelligence", "strength"],
  attributeTypes: ["ultimateEfficiency"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 모든 스킬 피해 +24%. 장착자가 배틀 스킬, 연계 스킬, 궁극기를 사용할 때, 각각 공격력 +5%, 15초 동안 지속. 세 가지 버프는 독립적으로 존재하며 스택 수치는 중첩되지 않습니다.",
    },
  ],
};
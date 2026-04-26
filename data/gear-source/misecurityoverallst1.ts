import type { GearDetail } from "../gear-types";

export const misecurityoverallst1: GearDetail = {
  slug: "misecurityoverallst1",

  name: "M. I. 경찰용 망토 I",
  enName: "MI Security Overalls T1",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "M. I. 경찰용",

  image: "/gear/misecurityoverallst1.webp",

  summary:
    "이 장비는 미에슈코 공업에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "M. I. 경찰용 시리즈 장비. 전쟁이 끝난 후, 미에슈코 공업은 생산 라인을 전환, 뛰어난 경량화 기술력을 인정받아 도시 경찰 장비 납품업체로 선정되었습니다.",

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
    label: "치명타 확률",
    values: {
      base: "+5.2%",
      level1: "+5.7%",
      level2: "+6.2%",
      level3: "+6.7%",
    },
  },

  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["critRate"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 치명타 확률 +5%. 장착자가 적에게 치명타를 준 후, 5초 동안 공격력 +5%, 최대 중첩 5스택. 최대 중첩 시, 치명타 확률 추가 +5%, 해당 효과는 중첩되지 않습니다.",
    },
  ],
};
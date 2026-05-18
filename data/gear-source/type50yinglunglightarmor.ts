import type { GearDetail } from "../gear-types";
const yinglung50SetEffects = [
  {
    pieces: 3,
    description:
      "장착자의 공격력 +15%. 팀 내 임의의 오퍼레이터가 배틀 스킬을 사용할 때, 장착자가 응룡의 예리함 1스택 획득, 해당 오퍼레이터의 다음 연계 스킬 피해 +20%. 응룡의 예리함은 최대 3스택까지만 중첩됩니다.",
  },
];
export const type50yinglunglightarmor: GearDetail = {
  slug: "type50yinglunglightarmor",

  name: "응룡 50식 경갑",
  enName: "Type 50 Yinglung Light Armor",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "응룡 50식",

  image: "/gear/type50yinglunglightarmor.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "응룡 특수부대 전용 장비의 민간용 버전으로, 핵심 부분은 빠져 있지만 범용성을 갖추었습니다. 이 방어구의 설계자가 특수부대 최종 선발에서 간발의 차로 탈락한 예비 대원이었다는 사실은 잘 알려지지 않았습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "의지",
    values: {
      base: "+87",
      level1: "+95",
      level2: "+104",
      level3: "+113",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+58",
      level1: "+63",
      level2: "+69",
      level3: "+75",
    },
  },

  attribute: {
    label: "모든 스킬 피해 보너스",
    values: {
      base: "+13.8%",
      level1: "+15.2%",
      level2: "+16.6%",
      level3: "+17.9%",
    },
  },

  abilityTypes: ["will", "strength"],
  attributeTypes: ["allSkillDamage"],

  setEffects: yinglung50SetEffects,
};
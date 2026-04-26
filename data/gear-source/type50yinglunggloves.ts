import type { GearDetail } from "../gear-types";

const yinglung50SetEffects = [
  {
    pieces: 3,
    description:
      "장착자의 공격력 +15%. 팀 내 임의의 오퍼레이터가 배틀 스킬을 사용할 때, 장착자가 응룡의 예리함 1스택 획득, 해당 오퍼레이터의 다음 연계 스킬 피해 +20%. 응룡의 예리함은 최대 3스택까지만 중첩됩니다.",
  },
];

export const type50yinglunggloves: GearDetail = {
  slug: "type50yinglunggloves",

  name: "응룡 50식 보호 장갑",
  enName: "Type 50 Yinglung Gloves",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "응룡 50식",

  image: "/gear/type50yinglunggloves.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '응룡 특수부대 전용 장비의 민수용 버전으로, 핵심 부분은 빠져 있지만 범용성을 갖추었습니다. "나는 그들이 받은 특별한 힘을 부러워하지 않습니다. 그건 애초에 내 것이 아니니까요. 내가 해야 할 일은 그들을 뒤에서 받쳐주는 것입니다."',

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
    label: "연계 스킬 피해 보너스",
    values: {
      base: "+34.5%",
      level1: "+38.0%",
      level2: "+41.4%",
      level3: "+44.9%",
    },
  },

  abilityTypes: ["agility", "intelligence"],
  attributeTypes: ["comboSkillDamage"],

  setEffects: yinglung50SetEffects,
};
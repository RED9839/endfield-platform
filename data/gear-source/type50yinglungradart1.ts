import type { GearDetail } from "../gear-types";
const yinglung50SetEffects = [
  {
    pieces: 3,
    description:
      "장착자의 공격력 +15%. 팀 내 임의의 오퍼레이터가 배틀 스킬을 사용할 때, 장착자가 응룡의 예리함 1스택 획득, 해당 오퍼레이터의 다음 연계 스킬 피해 +20%. 응룡의 예리함은 최대 3스택까지만 중첩됩니다.",
  },
];
export const type50yinglungradart1: GearDetail = {
  slug: "type50yinglungradart1",

  name: "응룡 50식 탐지기 I",
  enName: "Type 50 Yinglung Radar T1",

  category: "kit",
  level: 70,
  quality: 5,
  setName: "응룡 50식",

  image: "/gear/type50yinglungradart1.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    '응룡 특수부대 전용 장비의 민수용 버전으로, 핵심 부분은 빠져 있지만 범용성을 갖추었습니다. 최적화 설계를 마친 날, 그는 펜을 들어 도면 한쪽에 이렇게 적어 두었습니다. "하늘이 갈라지고 땅이 무너져도, 나는 이겨내리라."',

  baseStat: {
    label: "방어력",
    value: "+21",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+32",
      level1: "+35",
      level2: "+38",
      level3: "+41",
    },
  },

  ability2: {
    label: "힘",
    values: {
      base: "+21",
      level1: "+23",
      level2: "+25",
      level3: "+27",
    },
  },

  attribute: {
    label: "궁극기 피해 보너스",
    values: {
      base: "+51.7%",
      level1: "+56.9%",
      level2: "+62.1%",
      level3: "+67.3%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["ultimateDamage"],

  setEffects: yinglung50SetEffects,
};
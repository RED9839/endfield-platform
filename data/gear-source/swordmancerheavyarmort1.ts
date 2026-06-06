import type { GearDetail } from "../gear-types";

export const swordmancerheavyarmort1: GearDetail = {
  slug: "swordmancerheavyarmort1",

  name: "검술사 중장갑 · I",
  enName: "Swordmancer Heavy Armor T1",

  category: "armor",
  level: 70,
  quality: 5,
  setName: "검술사",

  image: "/gear/swordmancerheavyarmort1.webp",

  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 초기에 시장에 출시한 제품 중 하나. 천사는 '겸허함과 포용력'을 설계 이념으로 삼아, 검술사 중장갑에서 '에너지 공격 무력화' 기능을 실제로 구현하였습니다.",

  baseStat: {
    label: "방어력",
    value: "+56",
  },

  ability1: {
    label: "민첩",
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
    label: "물리 피해 보너스",
    values: {
      base: "+11.5%",
      level1: "+12.7%",
      level2: "+13.8%",
      level3: "+14.9%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["physicalDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 불균형 효율 보너스 +20%. 장착자가 물리 이상 효과를 부여한 후, 공격력 250%만큼의 추가 물리 피해[10 포인트 불균형치]. 해당 효과는 15초마다 최대 1회만 발동합니다.",
    },
  ],
};

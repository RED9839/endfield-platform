import type { GearDetail } from "../gear-types";

export const bonecrusherwristbandt1: GearDetail = {
  slug: "bonecrusherwristbandt1",

  name: "본 크러셔 장갑(손목) I",
  enName: "Bonekrusha Wristband T1",

  category: "gloves",
  level: 70,
  quality: 5,
  setName: "본 크러셔",

  image: "/gear/bonecrusherwristbandt1.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "본 크러셔 집단의 장비에서 디자인 영감을 받은 장비. 황무지로 떠난 모든 이가 랜드브레이커가 되는 건 아니지만, 한번 황무지에 사로잡히면 다시는 돌아올 수 없습니다.",

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
    label: "힘",
    values: {
      base: "+43",
      level1: "+47",
      level2: "+51",
      level3: "+55",
    },
  },

  attribute: {
    label: "냉기와 전기 피해 보너스",
    values: {
      base: "+19.2%",
      level1: "+21.1%",
      level2: "+23.0%",
      level3: "+24.9%",
    },
  },

  abilityTypes: ["agility", "strength"],
  attributeTypes: ["cryoElectricDamage"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 공격력 +15%. 장착자가 연계 스킬을 사용할 때, 본 크러셔의 압박 1스택 획득, 다음 배틀 스킬의 피해 +30%. 본 크러셔의 압박은 최대 2스택까지만 중첩됩니다.",
    },
  ],
};
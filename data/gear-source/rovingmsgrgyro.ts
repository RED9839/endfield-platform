import type { GearDetail } from "../gear-types";

export const rovingmsgrgyro: GearDetail = {
  slug: "rovingmsgrgyro",

  name: "순행 전달자 팽이",
  enName: "Roving MSGR Gyro",

  category: "kit",
  level: 36,
  quality: 3,
  setName: "순행 전달자",

  image: "/gear/rovingmsgrgyro.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "자그마한 스트레스 해소용 장난감. 믿을 만한 통계에 따르면, 약 20%의 전달자가 이러한 스트레스 해소용 장난감을 위치 추적기로 개조하여 사용하고 있다고 합니다.",

  baseStat: {
    label: "방어력",
    value: "+10",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+21",
    },
  },

  attribute: {
    label: "공격력",
    values: {
      base: "+10.5%",
    },
  },

  abilityTypes: ["agility"],
  attributeTypes: ["attack"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 민첩 +50. 장착자의 생명력이 80%보다 높을 때, 주는 물리 피해 +20%.",
    },
  ],
};
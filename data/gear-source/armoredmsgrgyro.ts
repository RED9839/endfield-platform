import type { GearDetail } from "../gear-types";

export const armoredmsgrgyro: GearDetail = {
  slug: "armoredmsgrgyro",

  name: "중장갑 전달자 팽이",
  enName: "Armored MSGR Gyro",

  category: "kit",
  level: 36,
  quality: 3,
  setName: "중장갑 전달자",

  image: "/gear/armoredmsgrgyro.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "자그마한 스트레스 해소용 장난감. 믿을 만한 통계에 따르면, 약 80%의 전달자가 이러한 소형 장난감을 초소형 폭발 표창으로 개조하여 사용하고 있다고 합니다.",

  baseStat: {
    label: "방어력",
    value: "+10",
  },

  ability1: {
    label: "힘",
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

  abilityTypes: ["strength"],
  attributeTypes: ["attack"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 힘 +50. 장착자의 생명력이 50% 미만일 때, 받는 모든 유형 피해 -30%",
    },
  ],
};
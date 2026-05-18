import type { GearDetail } from "../gear-types";

export const rovingmsgrjacket: GearDetail = {
  slug: "rovingmsgrjacket",

  name: "순행 전달자 재킷",
  enName: "Roving MSGR Jacket",

  category: "armor",
  level: 36,
  quality: 3,
  setName: "순행 전달자",

  image: "/gear/rovingmsgrjacket.webp",

  summary:
    "이 장비는 엔드필드 공업에서 황무지 수공예품을 참고하여 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "전달자들이 즐겨 입는 재킷. 4번 협곡 주변의 전달자들은 자신들의 교통수단에 거대한 나뭇가지 무늬를 그려 넣습니다. 한때 이 땅을 지켰던 존재가, 지금도 여전히 사람들에게 힘을 준다고 믿기 때문입니다.",

  baseStat: {
    label: "방어력",
    value: "+28",
  },

  ability1: {
    label: "민첩",
    values: {
      base: "+44",
    },
  },

  ability2: {
    label: "지능",
    values: {
      base: "+29",
    },
  },

  attribute: {
    label: "공격력",
    values: {
      base: "+16",
    },
  },

  abilityTypes: ["agility", "intelligence"],
  attributeTypes: ["attack"],

  setEffects: [
    {
      pieces: 3,
      description:
        "장착자의 민첩 +50. 장착자의 생명력이 80%보다 높을 때, 주는 물리 피해 +20%.",
    },
  ],
};
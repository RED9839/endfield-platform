import type { GearDetail } from "../gear-types";

export const redeemertag: GearDetail = {
  slug: "redeemertag",
  name: "위기 탈출 식별 패널",
  enName: "Redeemer Tag",
  category: "kit",
  level: 70,
  quality: 5,
  setName: "세트 없음",
  image: "/gear/redeemertag.webp",
  summary: "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description: '험난한 앞길을 상징하는 장비. "일은 아직 끝나지 않았고, 갈 길은 여전히 멉니다."',
  baseStat: { label: "방어력", value: "+21" },
  ability1: {
    label: "힘",
    values: { base: "+43", level1: "+47", level2: "+51", level3: "+55" },
  },
  attribute: {
    label: "모든 피해 감소",
    values: { base: "17.8%", level1: "19.2%", level2: "20.6%", level3: "21.9%" },
  },
  abilityTypes: ["strength"],
  attributeTypes: ["damageReduction"],
  setEffects: [],
};
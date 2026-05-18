import type { GearDetail } from "../gear-types";

export const redeemerseal: GearDetail = {
  slug: "redeemerseal",
  name: "위기 탈출 도장",
  enName: "Redeemer Seal",
  category: "kit",
  level: 70,
  quality: 5,
  setName: "세트 없음",
  image: "/gear/redeemerseal.webp",
  summary: "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description: '험난한 앞길을 상징하는 장비. "일은 아직 끝나지 않았고, 갈 길은 여전히 멉니다."',
  baseStat: { label: "방어력", value: "+21" },
  ability1: {
    label: "지능",
    values: { base: "+43", level1: "+47", level2: "+51", level3: "+55" },
  },
  attribute: {
    label: "궁극기 충전 효율",
    values: { base: "+25.7%", level1: "+28.3%", level2: "+30.9%", level3: "+33.4%" },
  },
  abilityTypes: ["intelligence"],
  attributeTypes: ["ultimateEfficiency"],
  setEffects: [],
};
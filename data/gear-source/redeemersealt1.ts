import type { GearDetail } from "../gear-types";

export const redeemersealt1: GearDetail = {
  slug: "redeemersealt1",
  name: "위기 탈출 도장 · I",
  enName: "Redeemer Seal T1",
  category: "kit",
  level: 70,
  quality: 5,
  setName: "세트 없음",
  image: "/gear/redeemersealt1.webp",
  summary: "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description: '험난한 앞길을 상징하는 장비. "일은 아직 끝나지 않았고, 갈 길은 여전히 멉니다."',
  baseStat: { label: "방어력", value: "+21" },
  ability1: {
    label: "의지",
    values: { base: "+43", level1: "+47", level2: "+51", level3: "+55" },
  },
  attribute: {
    label: "치명타 확률",
    values: { base: "+10.8%", level1: "+11.9%", level2: "+13.0%", level3: "+14.0%" },
  },
  abilityTypes: ["will"],
  attributeTypes: ["critRate"],
  setEffects: [],
};
import type { GearDetail } from "../gear-types";

export const redeemerhands: GearDetail = {
  slug: "redeemerhands",
  name: "위기 탈출 장갑",
  enName: "Redeemer Hands",
  category: "gloves",
  level: 70,
  quality: 5,
  setName: "세트 없음",
  image: "/gear/redeemerhands.webp",
  summary: "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description: '험난한 앞길을 상징하는 장비. "일은 아직 끝나지 않았고, 갈 길은 여전히 멉니다."',
  baseStat: { label: "방어력", value: "+42" },
  ability1: {
    label: "힘",
    values: { base: "+86", level1: "+94", level2: "+103", level3: "+111" },
  },
  attribute: {
    label: "모든 스킬 피해 보너스",
    values: { base: "+24.0%", level1: "+26.4%", level2: "+28.8%", level3: "+31.2%" },
  },
  abilityTypes: ["strength"],
  attributeTypes: ["allSkillDamage"],
  setEffects: [],
};
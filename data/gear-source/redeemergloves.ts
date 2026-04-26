import type { GearDetail } from "../gear-types";

export const redeemergloves: GearDetail = {
  slug: "redeemergloves",
  name: "위기 탈출 보호 장갑",
  enName: "Redeemer Gloves",
  category: "gloves",
  level: 70,
  quality: 5,
  setName: "세트 없음",
  image: "/gear/redeemergloves.webp",
  summary: "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description: '험난한 앞길을 상징하는 장비. "일은 아직 끝나지 않았고, 갈 길은 여전히 멉니다."',
  baseStat: { label: "방어력", value: "+42" },
  ability1: {
    label: "민첩",
    values: { base: "+86", level1: "+94", level2: "+103", level3: "+111" },
  },
  attribute: {
    label: "궁극기 피해 보너스",
    values: { base: "+45.0%", level1: "+49.5%", level2: "+54.0%", level3: "+58.5%" },
  },
  abilityTypes: ["agility"],
  attributeTypes: ["ultimateDamage"],
  setEffects: [],
};
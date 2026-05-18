import type { GearDetail } from "../gear-types";

export const minercompressioncoret1: GearDetail = {
  slug: "minercompressioncoret1",
  name: "광산 압축 장치 · I",
  enName: "Miner Compression Core T1",
  category: "kit",
  level: 50,
  quality: 4,
  setName: "세트 없음",
  image: "/gear/minercompressioncoret1.webp",
  summary: "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description: "주로 광산 작업에 사용하는 방호 장비. <4번 협곡 안전 방호 표준>에서는 노동 작업 방호 장비에 대해, 연성 보호층과 경성 보호층으로 구성된 최소 이중의 방호 구조를 갖출 것을 명시하고 있습니다.",
  baseStat: { label: "방어력", value: "+15" },
  ability1: { label: "지능", values: { base: "+31" } },
  attribute: { label: "궁극기 충전 효율", values: { base: "+18.6%" } },
  abilityTypes: ["intelligence"],
  attributeTypes: ["ultimateEfficiency"],
  setEffects: [],
};
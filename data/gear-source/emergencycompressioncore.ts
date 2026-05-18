import type { GearDetail } from "../gear-types";

export const emergencycompressioncore: GearDetail = {
  slug: "emergencycompressioncore",
  name: "응급 압축 장치",
  enName: "Emergency Compression Core",
  category: "kit",
  level: 20,
  quality: 1,
  setName: "세트 없음",
  image: "/gear/emergencycompressioncore.webp",
  summary: "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description: "주로 광산 작업에 사용하는 방호 장비. <4번 협곡 안전 방호 표준>에서는 노동 작업 방호 장비에 대해, 연성 보호층과 경성 보호층으로 구성된 최소 이중의 방호 구조를 갖출 것을 명시하고 있습니다.",
  baseStat: { label: "방어력", value: "+6" },
  ability1: { label: "", values: { base: "" } },
  attribute: { label: "공격력", values: { base: "+13.2%" } },
  abilityTypes: [],
  attributeTypes: ["attack"],
  setEffects: [],
};
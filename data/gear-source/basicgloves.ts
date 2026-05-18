import type { GearDetail } from "../gear-types";

export const basicgloves: GearDetail = {
  slug: "basicgloves",
  name: "간편 보호 장갑",
  enName: "Basic Gloves",
  category: "gloves",
  level: 10,
  quality: 1,
  setName: "세트 없음",
  image: "/gear/basicgloves.webp",
  summary: "엔드필드 공업의 품질 검증을 거치지 않은 임시 장비로, 방어 성능을 보장할 수 없습니다.",
  description: "단순한 구조의 초급 방어구. 실제 방어력보다는 장착자의 마음을 든든하게 해주는 효과가 더 큽니다.",
  baseStat: { label: "방어력", value: "+6" },
  ability1: { label: "지능", values: { base: "+11" } },
  ability2: { label: "의지", values: { base: "+7" } },
  attribute: { label: "생명력", values: { base: "+77" } },
  abilityTypes: ["intelligence", "will"],
  attributeTypes: ["hp"],
  setEffects: [],
};
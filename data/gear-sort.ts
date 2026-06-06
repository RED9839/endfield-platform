import type { GearCategory, GearDetail, GearSetName } from "@/data/gear-types";

export const gearSetOrder: GearSetName[] = [
  "개척",
  "응룡 50식",
  "본 크러셔",
  "조류의 물결",
  "청파",
  "M. I. 경찰용",
  "식양의 흐름",
  "열 작업용",
  "생체 보조",
  "검술사",
  "경량 초자연",
  "펄스식",
  "식양의 숨결",
  "순행 전달자",
  "아부레이의 메아리",
  "중장갑 전달자",
  "고검의 잔향",
  "재앙 방호",
  "침식 방호",
  "침식 차단",
  "통합 중량형 모델",
  "통합 경량형 모델",
  "세트 없음",
];

const gearCategoryOrder: Record<GearCategory, number> = {
  armor: 0,
  gloves: 1,
  kit: 2,
};

export function sortGearSelectList<T extends GearDetail>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (b.quality !== a.quality) return b.quality - a.quality;

    const categoryCompare =
      gearCategoryOrder[a.category] - gearCategoryOrder[b.category];
    if (categoryCompare !== 0) return categoryCompare;

    const aSetOrder = gearSetOrder.indexOf(a.setName);
    const bSetOrder = gearSetOrder.indexOf(b.setName);

    if (aSetOrder !== bSetOrder) {
      if (aSetOrder === -1) return 1;
      if (bSetOrder === -1) return -1;
      return aSetOrder - bSetOrder;
    }

    if (b.level !== a.level) return b.level - a.level;

    return a.name.localeCompare(b.name, "ko");
  });
}

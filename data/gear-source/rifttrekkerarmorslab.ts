import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const rifttrekkerarmorslab: GearDetail = {
  "slug": "rifttrekkerarmorslab",
  "name": "절망 방탄 방어구",
  "enName": "Rift Trekker Armor Slab",
  "category": "kit",
  "level": 70,
  "quality": 5,
  "setName": "절망",
  "image": "/gear/rifttrekkerarmorslab.webp",
  "summary": "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "선검국이 위험 구역을 빈번히 오가야 하는 작전 인원을 위해 설계한 특수 장비 세트입니다.\n'나는 금석을 다듬어 묘비로 삼는다.'",
  "baseStat": {
    "label": "방어력",
    "value": "+21"
  },
  "ability1": {
    "label": "민첩",
    "values": {
      "base": "+43",
      "level1": "+47",
      "level2": "+51",
      "level3": "+55"
    }
  },
  "attribute": {
    "label": "보조 능력치",
    "values": {
      "base": "+21.6%",
      "level1": "+23.8%",
      "level2": "+25.9%",
      "level3": "+28.1%"
    }
  },
  "abilityTypes": [
    "agility"
  ],
  "attributeTypes": [
    "subStat"
  ],
  "setEffects": []
};

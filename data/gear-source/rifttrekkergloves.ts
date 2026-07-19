import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const rifttrekkergloves: GearDetail = {
  "slug": "rifttrekkergloves",
  "name": "절망 보호 장갑",
  "enName": "Rift Trekker Gloves",
  "category": "gloves",
  "level": 70,
  "quality": 5,
  "setName": "절망",
  "image": "/gear/rifttrekkergloves.webp",
  "summary": "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "선검국이 위험 구역을 빈번히 오가야 하는 작전 인원을 위해 설계한 특수 장비 세트입니다.\n'나는 우레를 울려 담력을 북돋운다.'",
  "baseStat": {
    "label": "방어력",
    "value": "+42"
  },
  "ability1": {
    "label": "지능",
    "values": {
      "base": "+86",
      "level1": "+94",
      "level2": "+103",
      "level3": "+111"
    }
  },
  "attribute": {
    "label": "궁극기 충전 효율",
    "values": {
      "base": "+21.4%",
      "level1": "+23.6%",
      "level2": "+25.7%",
      "level3": "+27.9%"
    }
  },
  "abilityTypes": [
    "intelligence"
  ],
  "attributeTypes": [
    "ultimateEfficiency"
  ],
  "setEffects": []
};

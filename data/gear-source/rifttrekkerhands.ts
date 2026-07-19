import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const rifttrekkerhands: GearDetail = {
  "slug": "rifttrekkerhands",
  "name": "절망 장갑",
  "enName": "Rift Trekker Hands",
  "category": "gloves",
  "level": 70,
  "quality": 5,
  "setName": "절망",
  "image": "/gear/rifttrekkerhands.webp",
  "summary": "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "선검국이 위험 구역을 빈번히 오가야 하는 작전 인원을 위해 설계한 특수 장비 세트입니다.\n'나는 깃발을 펼쳐, 시신을 감쌀 각오를 다진다.'",
  "baseStat": {
    "label": "방어력",
    "value": "+42"
  },
  "ability1": {
    "label": "의지",
    "values": {
      "base": "+86",
      "level1": "+94",
      "level2": "+103",
      "level3": "+111"
    }
  },
  "attribute": {
    "label": "배틀 스킬 피해 보너스",
    "values": {
      "base": "+36%",
      "level1": "+39.6%",
      "level2": "+43.2%",
      "level3": "+46.8%"
    }
  },
  "abilityTypes": [
    "will"
  ],
  "attributeTypes": [
    "skillDamage"
  ],
  "setEffects": []
};

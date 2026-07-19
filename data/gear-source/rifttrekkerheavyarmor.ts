import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const rifttrekkerheavyarmor: GearDetail = {
  "slug": "rifttrekkerheavyarmor",
  "name": "절망 중갑",
  "enName": "Rift Trekker Heavy Armor",
  "category": "armor",
  "level": 70,
  "quality": 5,
  "setName": "절망",
  "image": "/gear/rifttrekkerheavyarmor.webp",
  "summary": "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "선검국이 위험 구역을 빈번히 오가야 하는 작전 인원을 위해 설계한 특수 장비 세트입니다.\n'나는 옥양을 쥐고 깊은 심연을 건넌다.'",
  "baseStat": {
    "label": "방어력",
    "value": "+56"
  },
  "ability1": {
    "label": "힘",
    "values": {
      "base": "+115",
      "level1": "+126",
      "level2": "+138",
      "level3": "+149"
    }
  },
  "attribute": {
    "label": "오리지늄 아츠 강도",
    "values": {
      "base": "+22",
      "level1": "+24",
      "level2": "+26",
      "level3": "+28"
    }
  },
  "abilityTypes": [
    "strength"
  ],
  "attributeTypes": [
    "originiumArts"
  ],
  "setEffects": []
};

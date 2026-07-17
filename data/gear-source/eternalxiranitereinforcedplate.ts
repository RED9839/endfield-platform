import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const eternalxiranitereinforcedplate: GearDetail = {
  "slug": "eternalxiranitereinforcedplate",
  "name": "식양의 숨결 강화판",
  "enName": "Eternal Xiranite Reinforced Plate",
  "category": "kit",
  "level": 70,
  "quality": 5,
  "setName": "식양의 숨결",
  "image": "/gear/eternalxiranitereinforcedplate.webp",
  "summary": "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "어느 '광기에 찬' 천사가 남긴 유작.\n이 유작을 실전 장비 단계까지 끌어올린 천사들도 그것이 지나치게 투박하다는 사실을 분명히 깨달았던 듯합니다. 그래서 추가 장갑을 보강 설계했습니다.",
  "baseStat": {
    "label": "방어력",
    "value": "+21"
  },
  "ability1": {
    "label": "의지",
    "values": {
      "base": "+41",
      "level1": "+45",
      "level2": "+49",
      "level3": "+53"
    }
  },
  "attribute": {
    "label": "보조 능력치",
    "values": {
      "base": "+20.7%",
      "level1": "+22.8%",
      "level2": "+24.8%",
      "level3": "+26.9%"
    }
  },
  "abilityTypes": [
    "will"
  ],
  "attributeTypes": [
    "subStat"
  ],
  "setEffects": [
    {
      "pieces": 3,
      "description": "장착자의 생명력 +1000. 장착자가 증폭, 비호, 취약, 허약을 부여한 후, 다른 팀원이 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다."
    }
  ]
};

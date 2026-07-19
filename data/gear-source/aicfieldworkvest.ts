import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const aicfieldworkvest: GearDetail = {
  "slug": "aicfieldworkvest",
  "name": "통합 실전 훈련 흉갑",
  "enName": "AIC Fieldwork Vest",
  "category": "armor",
  "level": 60,
  "quality": 5,
  "setName": "통합 실전 훈련",
  "image": "/gear/aicfieldworkvest.webp",
  "summary": "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "엔드필드가 오퍼레이터 훈련을 위해 설계한 작전 장비 세트입니다. 품질에 비해 가격이 지나치게 저렴해 시장에서도 큰 인기를 얻고 있습니다.\n'몇 개만 더 팔아 주면 안 됩니까? 집 지을 때 쓰게요.'",
  "baseStat": {
    "label": "방어력",
    "value": "+48"
  },
  "ability1": {
    "label": "보조 능력치",
    "values": {
      "base": "+74",
      "level1": "+81",
      "level2": "+88",
      "level3": "+96"
    }
  },
  "ability2": {
    "label": "주요 능력치",
    "values": {
      "base": "+49",
      "level1": "+53",
      "level2": "+58",
      "level3": "+63"
    }
  },
  "attribute": {
    "label": "보조 능력치",
    "values": {
      "base": "+8.9%",
      "level1": "+9.7%",
      "level2": "+10.6%",
      "level3": "+11.5%"
    }
  },
  "abilityTypes": [],
  "attributeTypes": [
    "subStat",
    "subStat",
    "mainStat"
  ],
  "setEffects": [
    {
      "pieces": 3,
      "description": "3개 세트 효과: 장착자가 주는 모든 유형 피해 +20%, 받는 모든 유형 피해 -10%, 궁극기 충전 효율 +10%"
    }
  ]
};

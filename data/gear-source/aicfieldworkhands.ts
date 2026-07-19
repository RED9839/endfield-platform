import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const aicfieldworkhands: GearDetail = {
  "slug": "aicfieldworkhands",
  "name": "통합 실전 훈련 보호 장갑",
  "enName": "AIC Fieldwork Hands",
  "category": "gloves",
  "level": 60,
  "quality": 5,
  "setName": "통합 실전 훈련",
  "image": "/gear/aicfieldworkhands.webp",
  "summary": "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "엔드필드가 오퍼레이터 훈련을 위해 설계한 작전 장비 세트입니다. 품질에 비해 가격이 지나치게 저렴해 시장에서도 큰 인기를 얻고 있습니다.\n'완벽한 착용감입니다. 이 정도면 노동 용품 시장 점유율까지 노려 봐도 되겠군요.'",
  "baseStat": {
    "label": "방어력",
    "value": "+36"
  },
  "ability1": {
    "label": "주요 능력치",
    "values": {
      "base": "+55",
      "level1": "+60",
      "level2": "+66",
      "level3": "+71"
    }
  },
  "ability2": {
    "label": "보조 능력치",
    "values": {
      "base": "+37",
      "level1": "+40",
      "level2": "+44",
      "level3": "+48"
    }
  },
  "attribute": {
    "label": "궁극기 충전 효율",
    "values": {
      "base": "+17.6%",
      "level1": "+19.3%",
      "level2": "+21.1%",
      "level3": "+22.8%"
    }
  },
  "abilityTypes": [],
  "attributeTypes": [
    "ultimateEfficiency",
    "mainStat",
    "subStat"
  ],
  "setEffects": [
    {
      "pieces": 3,
      "description": "3개 세트 효과: 장착자가 주는 모든 유형 피해 +20%, 받는 모든 유형 피해 -10%, 궁극기 충전 효율 +10%"
    }
  ]
};

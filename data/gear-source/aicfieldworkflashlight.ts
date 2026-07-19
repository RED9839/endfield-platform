import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const aicfieldworkflashlight: GearDetail = {
  "slug": "aicfieldworkflashlight",
  "name": "통합 실전 훈련 조명 장치",
  "enName": "AIC Fieldwork Flashlight",
  "category": "kit",
  "level": 60,
  "quality": 5,
  "setName": "통합 실전 훈련",
  "image": "/gear/aicfieldworkflashlight.webp",
  "summary": "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "엔드필드가 오퍼레이터 훈련을 위해 설계한 작전 장비 세트입니다. 품질에 비해 가격이 지나치게 저렴해 시장에서도 큰 인기를 얻고 있습니다.\n'인류가 다음 날의 빛을 기다리듯, 나는 아직 받지 않은 모든 작전 임무를 기다릴 것입니다.'",
  "baseStat": {
    "label": "방어력",
    "value": "+18"
  },
  "ability1": {
    "label": "보조 능력치",
    "values": {
      "base": "+27",
      "level1": "+29",
      "level2": "+32",
      "level3": "+35"
    }
  },
  "ability2": {
    "label": "주요 능력치",
    "values": {
      "base": "+18",
      "level1": "+19",
      "level2": "+21",
      "level3": "+23"
    }
  },
  "attribute": {
    "label": "보조 능력치",
    "values": {
      "base": "+17.7%",
      "level1": "+19.5%",
      "level2": "+21.2%",
      "level3": "+23%"
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

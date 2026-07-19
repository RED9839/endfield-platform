import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const aicfieldworkgloves: GearDetail = {
  "slug": "aicfieldworkgloves",
  "name": "통합 실전 훈련 장갑",
  "enName": "AIC Fieldwork Gloves",
  "category": "gloves",
  "level": 60,
  "quality": 5,
  "setName": "통합 실전 훈련",
  "image": "/gear/aicfieldworkgloves.webp",
  "summary": "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "엔드필드가 오퍼레이터 훈련을 위해 설계한 작전 장비 세트입니다. 품질에 비해 가격이 지나치게 저렴해 시장에서도 큰 인기를 얻고 있습니다.\n어떤 덩굴식물의 섬유 구조를 참고하여, 가볍고 얇으면서도 뛰어난 통기성을 확보했습니다.",
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
    "label": "아츠 피해 보너스",
    "values": {
      "base": "+15.5%",
      "level1": "+17.1%",
      "level2": "+18.6%",
      "level3": "+20.2%"
    }
  },
  "abilityTypes": [],
  "attributeTypes": [
    "artsDamage",
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

import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const aicfieldworkarmor: GearDetail = {
  "slug": "aicfieldworkarmor",
  "name": "통합 실전 훈련 방어구",
  "enName": "AIC Fieldwork Armor",
  "category": "armor",
  "level": 60,
  "quality": 5,
  "setName": "통합 실전 훈련",
  "image": "/gear/aicfieldworkarmor.webp",
  "summary": "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "엔드필드가 오퍼레이터 훈련을 위해 설계한 작전 장비 세트입니다. 품질에 비해 가격이 지나치게 저렴해 시장에서도 큰 인기를 얻고 있습니다.\n'꼼꼼히 보지 않았더라면, 하마터면 총알 한 발 값인 줄 알 뻔했습니다. 이보다 가성비 좋은 장비는 없겠죠.'",
  "baseStat": {
    "label": "방어력",
    "value": "+48"
  },
  "ability1": {
    "label": "주요 능력치",
    "values": {
      "base": "+74",
      "level1": "+81",
      "level2": "+88",
      "level3": "+96"
    }
  },
  "ability2": {
    "label": "보조 능력치",
    "values": {
      "base": "+49",
      "level1": "+53",
      "level2": "+58",
      "level3": "+63"
    }
  },
  "attribute": {
    "label": "아츠 피해 보너스",
    "values": {
      "base": "+9.3%",
      "level1": "+10.2%",
      "level2": "+11.2%",
      "level3": "+12.1%"
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

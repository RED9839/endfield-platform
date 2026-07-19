import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const lynxgauntletst1: GearDetail = {
  "slug": "lynxgauntletst1",
  "name": "생체 보조 금속 장갑 · I",
  "enName": "LYNX Gauntlets T1",
  "category": "gloves",
  "level": 70,
  "quality": 5,
  "setName": "생체 보조",
  "image": "/gear/lynxgauntletst1.webp",
  "summary": "이 장비는 로도스 아일랜드에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "의료진들이 애용하는 장비.\n로도스 아일랜드는 여전히 장비에 광석병 모니터링 모듈을 설치하는 관례를 유지하고 있습니다.",
  "baseStat": {
    "label": "방어력",
    "value": "+42"
  },
  "ability1": {
    "label": "의지",
    "values": {
      "base": "+65",
      "level1": "+71",
      "level2": "+78",
      "level3": "+84"
    }
  },
  "ability2": {
    "label": "민첩",
    "values": {
      "base": "+43",
      "level1": "+47",
      "level2": "+51",
      "level3": "+55"
    }
  },
  "attribute": {
    "label": "궁극기 충전 효율",
    "values": {
      "base": "+20.5%",
      "level1": "+22.6%",
      "level2": "+24.6%",
      "level3": "+26.7%"
    }
  },
  "abilityTypes": [
    "will",
    "agility"
  ],
  "attributeTypes": [
    "ultimateEfficiency"
  ],
  "setEffects": [
    {
      "pieces": 3,
      "description": "3개 세트 효과: 장착자의 치유 효율 +20%\n장착자가 아군을 치유한 후, 목표가 {duration}초 동안 받는 모든 유형 피해 -15%. 해당 목표가 받는 치유량이 최대치를 넘을 경우, 받는 모든 유형 피해 -30%, 해당 효과는 중첩되지 않습니다."
    }
  ]
};

import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const eternalxiranitelightarmor: GearDetail = {
  "slug": "eternalxiranitelightarmor",
  "name": "식양의 숨결 경량 방어구",
  "enName": "Eternal Xiranite Light Armor",
  "category": "armor",
  "level": 70,
  "quality": 5,
  "setName": "식양의 숨결",
  "image": "/gear/eternalxiranitelightarmor.webp",
  "summary": "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "어느 '광기에 찬' 천사가 남긴 유작.\n\"내가 보기엔 너무 무거워. 봐, 길가에 굴러다니는 야수 뼈처럼 투박하잖아. 가벼운 건 더 가벼워야 해, 알겠어? 무게를 줄여!\"",
  "baseStat": {
    "label": "방어력",
    "value": "+56"
  },
  "ability1": {
    "label": "의지",
    "values": {
      "base": "+110",
      "level1": "+121",
      "level2": "+132",
      "level3": "+143"
    }
  },
  "attribute": {
    "label": "궁극기 충전 효율",
    "values": {
      "base": "+12.3%",
      "level1": "+13.6%",
      "level2": "+14.8%",
      "level3": "+16%"
    }
  },
  "abilityTypes": [
    "will"
  ],
  "attributeTypes": [
    "ultimateEfficiency"
  ],
  "setEffects": [
    {
      "pieces": 3,
      "description": "장착자의 생명력 +1000. 장착자가 증폭, 비호, 취약, 허약을 부여한 후, 다른 팀원이 주는 피해 +16%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다."
    }
  ]
};

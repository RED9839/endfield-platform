import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const eternalxiranitelightarmort1: GearDetail = {
  "slug": "eternalxiranitelightarmort1",
  "name": "식양의 숨결 경량 방어구 · I",
  "enName": "Eternal Xiranite Light Armor I",
  "category": "armor",
  "level": 70,
  "quality": 5,
  "setName": "식양의 숨결",
  "image": "/gear/eternalxiranitelightarmort1.webp",
  "summary": "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "어느 '광기에 찬' 천사가 남긴 유작.\n\"내가 보기엔 너무 무거워. 봐, 길가에 굴러다니는 야수 뼈처럼 투박하잖아. 가벼운 건 더 가벼워야 해, 알겠어? 무게를 줄여!\"",
  "baseStat": {
    "label": "방어력",
    "value": "+56"
  },
  "ability1": {
    "label": "지능",
    "values": {
      "base": "+87",
      "level1": "+95",
      "level2": "+104",
      "level3": "+113"
    }
  },
  "ability2": {
    "label": "의지",
    "values": {
      "base": "+58",
      "level1": "+63",
      "level2": "+69",
      "level3": "+75"
    }
  },
  "attribute": {
    "label": "보조 능력치",
    "values": {
      "base": "+10.4%",
      "level1": "+11.4%",
      "level2": "+12.4%",
      "level3": "+13.5%"
    }
  },
  "abilityTypes": [
    "intelligence",
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

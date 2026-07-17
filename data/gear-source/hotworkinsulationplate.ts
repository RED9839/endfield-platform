import type { GearDetail } from "../gear-types";

// 출처: warfarin.wiki(/kr/gear) 1.4 신규 옵션. 능력치/재료 = turbo-stream .data. setEffects = 세트 공통.
export const hotworkinsulationplate: GearDetail = {
  "slug": "hotworkinsulationplate",
  "name": "열 작업용 단열판",
  "enName": "Hot Work Insulation Plate",
  "category": "kit",
  "level": 70,
  "quality": 5,
  "setName": "열 작업용",
  "image": "/gear/hotworkinsulationplate.webp",
  "summary": "이 장비는 엔드필드 공업에서 자체 연구하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  "description": "극도의 내열성을 자랑하는 장비.\n\"용암도 이것을 뚫고 태우지는 못해, 친구. 내 뜨거운 사랑이 끝내 그녀의 마음을 태우지 못한 것처럼.\"",
  "baseStat": {
    "label": "방어력",
    "value": "+21"
  },
  "ability1": {
    "label": "지능",
    "values": {
      "base": "+32",
      "level1": "+35",
      "level2": "+38",
      "level3": "+41"
    }
  },
  "ability2": {
    "label": "의지",
    "values": {
      "base": "+21",
      "level1": "+23",
      "level2": "+25",
      "level3": "+27"
    }
  },
  "attribute": {
    "label": "모든 스킬 피해 보너스",
    "values": {
      "base": "+27.6%",
      "level1": "+30.4%",
      "level2": "+33.1%",
      "level3": "+35.9%"
    }
  },
  "abilityTypes": [
    "intelligence",
    "will"
  ],
  "attributeTypes": [
    "allSkillDamage"
  ],
  "setEffects": [
    {
      "pieces": 3,
      "description": "장착자의 오리지늄 아츠 강도 +30. 장착자가 적에게 연소를 부여한 후, 열기 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다. 장착자가 적에게 부식을 부여한 후, 자연 피해 +50%, 10초 동안 지속, 해당 효과는 중첩되지 않습니다."
    }
  ]
};

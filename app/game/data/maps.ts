import type { MapNode } from "../types/game";

// 자동 생성: test/gen-maps.mjs — 엔드필드 실제 적 세력 5개 × 20층 3계층. 적 티어 드랍 연동.
const allFactionNodes: MapNode[] = [
  {
    "id": "f0-1-0",
    "chapter": 0,
    "floor": 1,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "brutal-pincerbeast",
      "indigenous-pincerbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f0-2-0",
      "f0-2-2"
    ]
  },
  {
    "id": "f0-1-1",
    "chapter": 0,
    "floor": 1,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "indigenous-pincerbeast",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f0-2-1",
      "f0-2-2"
    ]
  },
  {
    "id": "f0-2-0",
    "chapter": 0,
    "floor": 2,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "rockhowler",
      "firemist-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f0-3-0"
    ]
  },
  {
    "id": "f0-2-1",
    "chapter": 0,
    "floor": 2,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "acid-originium-slug",
      "rockhowler"
    ],
    "rewardTier": "early",
    "next": [
      "f0-3-1",
      "f0-3-0"
    ]
  },
  {
    "id": "f0-2-2",
    "chapter": 0,
    "floor": 2,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f0-3-0"
    ]
  },
  {
    "id": "f0-3-0",
    "chapter": 0,
    "floor": 3,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "indigenous-pincerbeast",
      "blazemist-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f0-4-0"
    ]
  },
  {
    "id": "f0-3-1",
    "chapter": 0,
    "floor": 3,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f0-4-0"
    ]
  },
  {
    "id": "f0-4-0",
    "chapter": 0,
    "floor": 4,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f0-5-2",
      "f0-5-0",
      "f0-5-1"
    ]
  },
  {
    "id": "f0-5-0",
    "chapter": 0,
    "floor": 5,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "blazemist-originium-slug",
      "waterlamp"
    ],
    "rewardTier": "early",
    "next": [
      "f0-6-0"
    ]
  },
  {
    "id": "f0-5-1",
    "chapter": 0,
    "floor": 5,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "외곽",
    "enemyIds": [
      "hazefyre-axe-armorbeast",
      "firemist-originium-slug"
    ],
    "rewardTier": "mid",
    "next": [
      "f0-6-1",
      "f0-6-0"
    ]
  },
  {
    "id": "f0-5-2",
    "chapter": 0,
    "floor": 5,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "blazemist-originium-slug",
      "rockhowler"
    ],
    "rewardTier": "early",
    "next": [
      "f0-6-0",
      "f0-6-1"
    ]
  },
  {
    "id": "f0-6-0",
    "chapter": 0,
    "floor": 6,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "acid-originium-slug",
      "acid-originium-slug-alpha"
    ],
    "rewardTier": "early",
    "next": [
      "f0-7-0",
      "f0-7-2"
    ]
  },
  {
    "id": "f0-6-1",
    "chapter": 0,
    "floor": 6,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f0-7-1"
    ]
  },
  {
    "id": "f0-7-0",
    "chapter": 0,
    "floor": 7,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "blazemist-originium-slug",
      "brutal-pincerbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f0-8-0"
    ]
  },
  {
    "id": "f0-7-1",
    "chapter": 0,
    "floor": 7,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f0-8-0"
    ]
  },
  {
    "id": "f0-7-2",
    "chapter": 0,
    "floor": 7,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "acid-originium-slug",
      "acid-originium-slug-alpha"
    ],
    "rewardTier": "early",
    "next": [
      "f0-8-0"
    ]
  },
  {
    "id": "f0-8-0",
    "chapter": 0,
    "floor": 8,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f0-9-2",
      "f0-9-0",
      "f0-9-1"
    ]
  },
  {
    "id": "f0-9-0",
    "chapter": 0,
    "floor": 9,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "hazefyre-axe-armorbeast",
      "firemist-originium-slug"
    ],
    "rewardTier": "late",
    "next": [
      "f0-10-0"
    ]
  },
  {
    "id": "f0-9-1",
    "chapter": 0,
    "floor": 9,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "acid-originium-slug",
      "waterlamp",
      "firemist-originium-slug"
    ],
    "rewardTier": "mid",
    "next": [
      "f0-10-1",
      "f0-10-0"
    ]
  },
  {
    "id": "f0-9-2",
    "chapter": 0,
    "floor": 9,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f0-10-0"
    ]
  },
  {
    "id": "f0-10-0",
    "chapter": 0,
    "floor": 10,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "tunneling-nidwyrm",
      "glaring-rakerbeast",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f0-11-0"
    ]
  },
  {
    "id": "f0-10-1",
    "chapter": 0,
    "floor": 10,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f0-11-0"
    ]
  },
  {
    "id": "f0-11-0",
    "chapter": 0,
    "floor": 11,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f0-12-0",
      "f0-12-1"
    ]
  },
  {
    "id": "f0-12-0",
    "chapter": 0,
    "floor": 12,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "indigenous-pincerbeast",
      "spotted-rakerbeast",
      "firemist-originium-slug"
    ],
    "rewardTier": "mid",
    "next": [
      "f0-13-0"
    ]
  },
  {
    "id": "f0-12-1",
    "chapter": 0,
    "floor": 12,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "hazefyre-axe-armorbeast",
      "quillbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f0-13-1",
      "f0-13-2"
    ]
  },
  {
    "id": "f0-13-0",
    "chapter": 0,
    "floor": 13,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "waterlamp",
      "blazemist-originium-slug",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f0-14-0"
    ]
  },
  {
    "id": "f0-13-1",
    "chapter": 0,
    "floor": 13,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f0-14-1",
      "f0-14-0"
    ]
  },
  {
    "id": "f0-13-2",
    "chapter": 0,
    "floor": 13,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "blazemist-originium-slug",
      "acid-originium-slug",
      "rockhowler"
    ],
    "rewardTier": "mid",
    "next": [
      "f0-14-0"
    ]
  },
  {
    "id": "f0-14-0",
    "chapter": 0,
    "floor": 14,
    "column": 0,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f0-15-0"
    ]
  },
  {
    "id": "f0-14-1",
    "chapter": 0,
    "floor": 14,
    "column": 4,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f0-15-1",
      "f0-15-0"
    ]
  },
  {
    "id": "f0-15-0",
    "chapter": 0,
    "floor": 15,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "imbued-quillbeast",
      "spotted-rakerbeast",
      "glaring-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f0-16-0",
      "f0-16-1"
    ]
  },
  {
    "id": "f0-15-1",
    "chapter": 0,
    "floor": 15,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "hazefyre-axe-armorbeast",
      "spotted-rakerbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f0-16-1",
      "f0-16-0"
    ]
  },
  {
    "id": "f0-16-0",
    "chapter": 0,
    "floor": 16,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "imbued-quillbeast",
      "skydrummer",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f0-17-0"
    ]
  },
  {
    "id": "f0-16-1",
    "chapter": 0,
    "floor": 16,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f0-17-0"
    ]
  },
  {
    "id": "f0-17-0",
    "chapter": 0,
    "floor": 17,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f0-18-2",
      "f0-18-0",
      "f0-18-1"
    ]
  },
  {
    "id": "f0-18-0",
    "chapter": 0,
    "floor": 18,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "armored-manglerbeast",
      "imbued-quillbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f0-19-0"
    ]
  },
  {
    "id": "f0-18-1",
    "chapter": 0,
    "floor": 18,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "glaring-rakerbeast",
      "skydrummer",
      "tunneling-nidwyrm"
    ],
    "rewardTier": "late",
    "next": [
      "f0-19-0"
    ]
  },
  {
    "id": "f0-18-2",
    "chapter": 0,
    "floor": 18,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "quillbeast",
      "glaring-rakerbeast",
      "imbued-quillbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f0-19-0"
    ]
  },
  {
    "id": "f0-19-0",
    "chapter": 0,
    "floor": 19,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f0-20-0"
    ]
  },
  {
    "id": "f0-20-0",
    "chapter": 0,
    "floor": 20,
    "column": 2,
    "type": "boss",
    "title": "광석수 심층부 · 최종",
    "subtitle": "심층부",
    "enemyIds": [
      "craghowler",
      "skydrummer"
    ],
    "rewardTier": "boss",
    "next": []
  },
  {
    "id": "f1-1-0",
    "chapter": 1,
    "floor": 1,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "falsewings-alpha",
      "acid-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f1-2-0",
      "f1-2-2"
    ]
  },
  {
    "id": "f1-1-1",
    "chapter": 1,
    "floor": 1,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "falsewings",
      "firemist-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f1-2-1",
      "f1-2-2"
    ]
  },
  {
    "id": "f1-2-0",
    "chapter": 1,
    "floor": 2,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "ram",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f1-3-0",
      "f1-3-1"
    ]
  },
  {
    "id": "f1-2-1",
    "chapter": 1,
    "floor": 2,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "falsewings",
      "indigenous-pincerbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f1-3-1",
      "f1-3-0"
    ]
  },
  {
    "id": "f1-2-2",
    "chapter": 1,
    "floor": 2,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f1-3-0"
    ]
  },
  {
    "id": "f1-3-0",
    "chapter": 1,
    "floor": 3,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "falsewings",
      "quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f1-4-0"
    ]
  },
  {
    "id": "f1-3-1",
    "chapter": 1,
    "floor": 3,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f1-4-0"
    ]
  },
  {
    "id": "f1-4-0",
    "chapter": 1,
    "floor": 4,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f1-5-2",
      "f1-5-0",
      "f1-5-1"
    ]
  },
  {
    "id": "f1-5-0",
    "chapter": 1,
    "floor": 5,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "falsewings-alpha",
      "quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f1-6-0",
      "f1-6-1"
    ]
  },
  {
    "id": "f1-5-1",
    "chapter": 1,
    "floor": 5,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "외곽",
    "enemyIds": [
      "sentinel",
      "firemist-originium-slug"
    ],
    "rewardTier": "mid",
    "next": [
      "f1-6-1",
      "f1-6-0"
    ]
  },
  {
    "id": "f1-5-2",
    "chapter": 1,
    "floor": 5,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "sting-alpha",
      "imbued-quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f1-6-0"
    ]
  },
  {
    "id": "f1-6-0",
    "chapter": 1,
    "floor": 6,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "falsewings",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f1-7-0",
      "f1-7-2"
    ]
  },
  {
    "id": "f1-6-1",
    "chapter": 1,
    "floor": 6,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f1-7-1"
    ]
  },
  {
    "id": "f1-7-0",
    "chapter": 1,
    "floor": 7,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "ram-alpha",
      "imbued-quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f1-8-0"
    ]
  },
  {
    "id": "f1-7-1",
    "chapter": 1,
    "floor": 7,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f1-8-0"
    ]
  },
  {
    "id": "f1-7-2",
    "chapter": 1,
    "floor": 7,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "falsewings",
      "waterlamp"
    ],
    "rewardTier": "early",
    "next": [
      "f1-8-0"
    ]
  },
  {
    "id": "f1-8-0",
    "chapter": 1,
    "floor": 8,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f1-9-2",
      "f1-9-0",
      "f1-9-1"
    ]
  },
  {
    "id": "f1-9-0",
    "chapter": 1,
    "floor": 9,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "sentinel",
      "quillbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f1-10-0",
      "f1-10-1"
    ]
  },
  {
    "id": "f1-9-1",
    "chapter": 1,
    "floor": 9,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "heavy-sting-alpha",
      "heavy-sting",
      "tunneling-nidwyrm"
    ],
    "rewardTier": "mid",
    "next": [
      "f1-10-1"
    ]
  },
  {
    "id": "f1-9-2",
    "chapter": 1,
    "floor": 9,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f1-10-0",
      "f1-10-1"
    ]
  },
  {
    "id": "f1-10-0",
    "chapter": 1,
    "floor": 10,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "heavy-ram",
      "heavy-sting",
      "brutal-pincerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f1-11-0"
    ]
  },
  {
    "id": "f1-10-1",
    "chapter": 1,
    "floor": 10,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f1-11-0"
    ]
  },
  {
    "id": "f1-11-0",
    "chapter": 1,
    "floor": 11,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f1-12-0",
      "f1-12-1"
    ]
  },
  {
    "id": "f1-12-0",
    "chapter": 1,
    "floor": 12,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "effigy",
      "heavy-ram",
      "quillbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f1-13-0",
      "f1-13-2"
    ]
  },
  {
    "id": "f1-12-1",
    "chapter": 1,
    "floor": 12,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "sentinel",
      "armored-manglerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f1-13-1"
    ]
  },
  {
    "id": "f1-13-0",
    "chapter": 1,
    "floor": 13,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "heavy-sting-alpha",
      "heavy-ram-alpha",
      "tunneling-nidwyrm"
    ],
    "rewardTier": "mid",
    "next": [
      "f1-14-0",
      "f1-14-1"
    ]
  },
  {
    "id": "f1-13-1",
    "chapter": 1,
    "floor": 13,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f1-14-1",
      "f1-14-0"
    ]
  },
  {
    "id": "f1-13-2",
    "chapter": 1,
    "floor": 13,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "heavy-sting-alpha",
      "heavy-sting",
      "spotted-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f1-14-0"
    ]
  },
  {
    "id": "f1-14-0",
    "chapter": 1,
    "floor": 14,
    "column": 0,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f1-15-0",
      "f1-15-1"
    ]
  },
  {
    "id": "f1-14-1",
    "chapter": 1,
    "floor": 14,
    "column": 4,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f1-15-1",
      "f1-15-0"
    ]
  },
  {
    "id": "f1-15-0",
    "chapter": 1,
    "floor": 15,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "walking-chrysopolis",
      "effigy",
      "glaring-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f1-16-0",
      "f1-16-1"
    ]
  },
  {
    "id": "f1-15-1",
    "chapter": 1,
    "floor": 15,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "sentinel",
      "axe-armorbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f1-16-1"
    ]
  },
  {
    "id": "f1-16-0",
    "chapter": 1,
    "floor": 16,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "heavy-sting-alpha",
      "effigy",
      "skydrummer"
    ],
    "rewardTier": "late",
    "next": [
      "f1-17-0"
    ]
  },
  {
    "id": "f1-16-1",
    "chapter": 1,
    "floor": 16,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f1-17-0"
    ]
  },
  {
    "id": "f1-17-0",
    "chapter": 1,
    "floor": 17,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f1-18-2",
      "f1-18-0",
      "f1-18-1"
    ]
  },
  {
    "id": "f1-18-0",
    "chapter": 1,
    "floor": 18,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "sentinel",
      "skydrummer"
    ],
    "rewardTier": "elite",
    "next": [
      "f1-19-0"
    ]
  },
  {
    "id": "f1-18-1",
    "chapter": 1,
    "floor": 18,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "heavy-ram",
      "heavy-sting-alpha",
      "glaring-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f1-19-0"
    ]
  },
  {
    "id": "f1-18-2",
    "chapter": 1,
    "floor": 18,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "heavy-ram-alpha",
      "heavy-sting",
      "skydrummer"
    ],
    "rewardTier": "late",
    "next": [
      "f1-19-0"
    ]
  },
  {
    "id": "f1-19-0",
    "chapter": 1,
    "floor": 19,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f1-20-0"
    ]
  },
  {
    "id": "f1-20-0",
    "chapter": 1,
    "floor": 20,
    "column": 2,
    "type": "boss",
    "title": "아겔로이 심층부 · 최종",
    "subtitle": "심층부",
    "enemyIds": [
      "triaggelos",
      "heavy-ram"
    ],
    "rewardTier": "boss",
    "next": []
  },
  {
    "id": "f2-1-0",
    "chapter": 2,
    "floor": 1,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "mudflow-delta",
      "imbued-quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f2-2-0",
      "f2-2-2"
    ]
  },
  {
    "id": "f2-1-1",
    "chapter": 2,
    "floor": 1,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "prism",
      "waterlamp"
    ],
    "rewardTier": "early",
    "next": [
      "f2-2-1",
      "f2-2-2"
    ]
  },
  {
    "id": "f2-2-0",
    "chapter": 2,
    "floor": 2,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "mudflow-delta",
      "acid-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f2-3-0",
      "f2-3-1"
    ]
  },
  {
    "id": "f2-2-1",
    "chapter": 2,
    "floor": 2,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "mudflow",
      "tunneling-nidwyrm"
    ],
    "rewardTier": "early",
    "next": [
      "f2-3-1",
      "f2-3-0"
    ]
  },
  {
    "id": "f2-2-2",
    "chapter": 2,
    "floor": 2,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f2-3-0",
      "f2-3-1"
    ]
  },
  {
    "id": "f2-3-0",
    "chapter": 2,
    "floor": 3,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "mudflow",
      "imbued-quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f2-4-0"
    ]
  },
  {
    "id": "f2-3-1",
    "chapter": 2,
    "floor": 3,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f2-4-0"
    ]
  },
  {
    "id": "f2-4-0",
    "chapter": 2,
    "floor": 4,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f2-5-2",
      "f2-5-0",
      "f2-5-1"
    ]
  },
  {
    "id": "f2-5-0",
    "chapter": 2,
    "floor": 5,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "hedron",
      "brutal-pincerbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f2-6-0",
      "f2-6-1"
    ]
  },
  {
    "id": "f2-5-1",
    "chapter": 2,
    "floor": 5,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "외곽",
    "enemyIds": [
      "tidewalker",
      "indigenous-pincerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f2-6-1"
    ]
  },
  {
    "id": "f2-5-2",
    "chapter": 2,
    "floor": 5,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "hedron",
      "acid-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f2-6-0",
      "f2-6-1"
    ]
  },
  {
    "id": "f2-6-0",
    "chapter": 2,
    "floor": 6,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "hedron-delta",
      "tunneling-nidwyrm"
    ],
    "rewardTier": "early",
    "next": [
      "f2-7-0",
      "f2-7-2"
    ]
  },
  {
    "id": "f2-6-1",
    "chapter": 2,
    "floor": 6,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f2-7-1"
    ]
  },
  {
    "id": "f2-7-0",
    "chapter": 2,
    "floor": 7,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "hedron",
      "brutal-pincerbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f2-8-0"
    ]
  },
  {
    "id": "f2-7-1",
    "chapter": 2,
    "floor": 7,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f2-8-0"
    ]
  },
  {
    "id": "f2-7-2",
    "chapter": 2,
    "floor": 7,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "hedron",
      "quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f2-8-0"
    ]
  },
  {
    "id": "f2-8-0",
    "chapter": 2,
    "floor": 8,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f2-9-2",
      "f2-9-0",
      "f2-9-1"
    ]
  },
  {
    "id": "f2-9-0",
    "chapter": 2,
    "floor": 9,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "tidewalker",
      "glaring-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f2-10-0",
      "f2-10-1"
    ]
  },
  {
    "id": "f2-9-1",
    "chapter": 2,
    "floor": 9,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "tidewalker-delta",
      "brutal-pincerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f2-10-1"
    ]
  },
  {
    "id": "f2-9-2",
    "chapter": 2,
    "floor": 9,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f2-10-0",
      "f2-10-1"
    ]
  },
  {
    "id": "f2-10-0",
    "chapter": 2,
    "floor": 10,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "tidewalker-delta",
      "spotted-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f2-11-0"
    ]
  },
  {
    "id": "f2-10-1",
    "chapter": 2,
    "floor": 10,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f2-11-0"
    ]
  },
  {
    "id": "f2-11-0",
    "chapter": 2,
    "floor": 11,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f2-12-0",
      "f2-12-1"
    ]
  },
  {
    "id": "f2-12-0",
    "chapter": 2,
    "floor": 12,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "tidewalker-delta",
      "tunneling-nidwyrm"
    ],
    "rewardTier": "mid",
    "next": [
      "f2-13-0",
      "f2-13-2"
    ]
  },
  {
    "id": "f2-12-1",
    "chapter": 2,
    "floor": 12,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "tidewalker",
      "glaring-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f2-13-1",
      "f2-13-2"
    ]
  },
  {
    "id": "f2-13-0",
    "chapter": 2,
    "floor": 13,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "tidewalker-delta",
      "spotted-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f2-14-0"
    ]
  },
  {
    "id": "f2-13-1",
    "chapter": 2,
    "floor": 13,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f2-14-1"
    ]
  },
  {
    "id": "f2-13-2",
    "chapter": 2,
    "floor": 13,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "tidewalker-delta",
      "glaring-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f2-14-0",
      "f2-14-1"
    ]
  },
  {
    "id": "f2-14-0",
    "chapter": 2,
    "floor": 14,
    "column": 0,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f2-15-0",
      "f2-15-1"
    ]
  },
  {
    "id": "f2-14-1",
    "chapter": 2,
    "floor": 14,
    "column": 4,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f2-15-1",
      "f2-15-0"
    ]
  },
  {
    "id": "f2-15-0",
    "chapter": 2,
    "floor": 15,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "tidewalker-delta",
      "skydrummer"
    ],
    "rewardTier": "late",
    "next": [
      "f2-16-0",
      "f2-16-1"
    ]
  },
  {
    "id": "f2-15-1",
    "chapter": 2,
    "floor": 15,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "tidewalker",
      "glaring-rakerbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f2-16-1"
    ]
  },
  {
    "id": "f2-16-0",
    "chapter": 2,
    "floor": 16,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "tidewalker-delta",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f2-17-0"
    ]
  },
  {
    "id": "f2-16-1",
    "chapter": 2,
    "floor": 16,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f2-17-0"
    ]
  },
  {
    "id": "f2-17-0",
    "chapter": 2,
    "floor": 17,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f2-18-2",
      "f2-18-0",
      "f2-18-1"
    ]
  },
  {
    "id": "f2-18-0",
    "chapter": 2,
    "floor": 18,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "tidewalker",
      "hazefyre-axe-armorbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f2-19-0"
    ]
  },
  {
    "id": "f2-18-1",
    "chapter": 2,
    "floor": 18,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "tidewalker-delta",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f2-19-0"
    ]
  },
  {
    "id": "f2-18-2",
    "chapter": 2,
    "floor": 18,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "tidewalker-delta",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f2-19-0"
    ]
  },
  {
    "id": "f2-19-0",
    "chapter": 2,
    "floor": 19,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f2-20-0"
    ]
  },
  {
    "id": "f2-20-0",
    "chapter": 2,
    "floor": 20,
    "column": 2,
    "type": "boss",
    "title": "조석 심층부 · 최종",
    "subtitle": "심층부",
    "enemyIds": [
      "tidalklast",
      "tidewalker-delta"
    ],
    "rewardTier": "boss",
    "next": []
  },
  {
    "id": "f3-1-0",
    "chapter": 3,
    "floor": 1,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "bonekrusher-raider",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f3-2-0",
      "f3-2-2"
    ]
  },
  {
    "id": "f3-1-1",
    "chapter": 3,
    "floor": 1,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "hazefyre-claw",
      "rockhowler"
    ],
    "rewardTier": "early",
    "next": [
      "f3-2-1"
    ]
  },
  {
    "id": "f3-2-0",
    "chapter": 3,
    "floor": 2,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "bonekrusher-raider",
      "acid-originium-slug-alpha"
    ],
    "rewardTier": "early",
    "next": [
      "f3-3-0"
    ]
  },
  {
    "id": "f3-2-1",
    "chapter": 3,
    "floor": 2,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "elite-ripptusk",
      "indigenous-pincerbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f3-3-1"
    ]
  },
  {
    "id": "f3-2-2",
    "chapter": 3,
    "floor": 2,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f3-3-0"
    ]
  },
  {
    "id": "f3-3-0",
    "chapter": 3,
    "floor": 3,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "elite-ripptusk",
      "acid-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f3-4-0"
    ]
  },
  {
    "id": "f3-3-1",
    "chapter": 3,
    "floor": 3,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f3-4-0"
    ]
  },
  {
    "id": "f3-4-0",
    "chapter": 3,
    "floor": 4,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f3-5-2",
      "f3-5-0",
      "f3-5-1"
    ]
  },
  {
    "id": "f3-5-0",
    "chapter": 3,
    "floor": 5,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "elite-raider",
      "aethillu"
    ],
    "rewardTier": "early",
    "next": [
      "f3-6-0"
    ]
  },
  {
    "id": "f3-5-1",
    "chapter": 3,
    "floor": 5,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "외곽",
    "enemyIds": [
      "elite-executioner",
      "acid-originium-slug"
    ],
    "rewardTier": "mid",
    "next": [
      "f3-6-1"
    ]
  },
  {
    "id": "f3-5-2",
    "chapter": 3,
    "floor": 5,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "bonekrusher-infiltrator",
      "rockhowler"
    ],
    "rewardTier": "early",
    "next": [
      "f3-6-0",
      "f3-6-1"
    ]
  },
  {
    "id": "f3-6-0",
    "chapter": 3,
    "floor": 6,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "elite-ambusher",
      "quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f3-7-0",
      "f3-7-2"
    ]
  },
  {
    "id": "f3-6-1",
    "chapter": 3,
    "floor": 6,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f3-7-1"
    ]
  },
  {
    "id": "f3-7-0",
    "chapter": 3,
    "floor": 7,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "bonekrusher-infiltrator",
      "blazemist-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f3-8-0"
    ]
  },
  {
    "id": "f3-7-1",
    "chapter": 3,
    "floor": 7,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f3-8-0"
    ]
  },
  {
    "id": "f3-7-2",
    "chapter": 3,
    "floor": 7,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "bonekrusher-infiltrator",
      "brutal-pincerbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f3-8-0"
    ]
  },
  {
    "id": "f3-8-0",
    "chapter": 3,
    "floor": 8,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f3-9-2",
      "f3-9-0",
      "f3-9-1"
    ]
  },
  {
    "id": "f3-9-0",
    "chapter": 3,
    "floor": 9,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "elite-executioner",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f3-10-0"
    ]
  },
  {
    "id": "f3-9-1",
    "chapter": 3,
    "floor": 9,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "bonekrusher-vanguard",
      "elite-ripptusk",
      "quillbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f3-10-1"
    ]
  },
  {
    "id": "f3-9-2",
    "chapter": 3,
    "floor": 9,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f3-10-0",
      "f3-10-1"
    ]
  },
  {
    "id": "f3-10-0",
    "chapter": 3,
    "floor": 10,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "elite-ripptusk",
      "bonekrusher-raider",
      "glaring-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f3-11-0"
    ]
  },
  {
    "id": "f3-10-1",
    "chapter": 3,
    "floor": 10,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f3-11-0"
    ]
  },
  {
    "id": "f3-11-0",
    "chapter": 3,
    "floor": 11,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f3-12-0",
      "f3-12-1"
    ]
  },
  {
    "id": "f3-12-0",
    "chapter": 3,
    "floor": 12,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "elite-raider",
      "bonekrusher-pyromancer",
      "tunneling-nidwyrm"
    ],
    "rewardTier": "mid",
    "next": [
      "f3-13-0",
      "f3-13-2"
    ]
  },
  {
    "id": "f3-12-1",
    "chapter": 3,
    "floor": 12,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "elite-executioner",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f3-13-1"
    ]
  },
  {
    "id": "f3-13-0",
    "chapter": 3,
    "floor": 13,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "bonekrusher-pyromancer",
      "bonekrusher-raider",
      "spotted-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f3-14-0"
    ]
  },
  {
    "id": "f3-13-1",
    "chapter": 3,
    "floor": 13,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f3-14-1",
      "f3-14-0"
    ]
  },
  {
    "id": "f3-13-2",
    "chapter": 3,
    "floor": 13,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "elite-ambusher",
      "elite-raider",
      "spotted-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f3-14-0",
      "f3-14-1"
    ]
  },
  {
    "id": "f3-14-0",
    "chapter": 3,
    "floor": 14,
    "column": 0,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f3-15-0"
    ]
  },
  {
    "id": "f3-14-1",
    "chapter": 3,
    "floor": 14,
    "column": 4,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f3-15-1",
      "f3-15-0"
    ]
  },
  {
    "id": "f3-15-0",
    "chapter": 3,
    "floor": 15,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "bonekrusher-arsonist",
      "bonekrusher-pyromancer",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f3-16-0",
      "f3-16-1"
    ]
  },
  {
    "id": "f3-15-1",
    "chapter": 3,
    "floor": 15,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "elite-executioner",
      "skydrummer"
    ],
    "rewardTier": "elite",
    "next": [
      "f3-16-1",
      "f3-16-0"
    ]
  },
  {
    "id": "f3-16-0",
    "chapter": 3,
    "floor": 16,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "bonekrusher-executioner",
      "bonekrusher-arsonist",
      "glaring-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f3-17-0"
    ]
  },
  {
    "id": "f3-16-1",
    "chapter": 3,
    "floor": 16,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f3-17-0"
    ]
  },
  {
    "id": "f3-17-0",
    "chapter": 3,
    "floor": 17,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f3-18-2",
      "f3-18-0",
      "f3-18-1"
    ]
  },
  {
    "id": "f3-18-0",
    "chapter": 3,
    "floor": 18,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "elite-executioner",
      "glaring-rakerbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f3-19-0"
    ]
  },
  {
    "id": "f3-18-1",
    "chapter": 3,
    "floor": 18,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "bonekrusher-executioner",
      "bonekrusher-pyromancer",
      "skydrummer"
    ],
    "rewardTier": "late",
    "next": [
      "f3-19-0"
    ]
  },
  {
    "id": "f3-18-2",
    "chapter": 3,
    "floor": 18,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "bonekrusher-arsonist",
      "bonekrusher-pyromancer",
      "skydrummer"
    ],
    "rewardTier": "late",
    "next": [
      "f3-19-0"
    ]
  },
  {
    "id": "f3-19-0",
    "chapter": 3,
    "floor": 19,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f3-20-0"
    ]
  },
  {
    "id": "f3-20-0",
    "chapter": 3,
    "floor": 20,
    "column": 2,
    "type": "boss",
    "title": "본크러셔 심층부 · 최종",
    "subtitle": "심층부",
    "enemyIds": [
      "nefarith-conqueror",
      "bonekrusher-executioner"
    ],
    "rewardTier": "boss",
    "next": []
  },
  {
    "id": "f4-1-0",
    "chapter": 4,
    "floor": 1,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "grove-archer",
      "waterlamp"
    ],
    "rewardTier": "early",
    "next": [
      "f4-2-0",
      "f4-2-2"
    ]
  },
  {
    "id": "f4-1-1",
    "chapter": 4,
    "floor": 1,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "highway-reaver",
      "acid-originium-slug-alpha"
    ],
    "rewardTier": "early",
    "next": [
      "f4-2-1"
    ]
  },
  {
    "id": "f4-2-0",
    "chapter": 4,
    "floor": 2,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "grove-archer",
      "imbued-quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f4-3-0",
      "f4-3-1"
    ]
  },
  {
    "id": "f4-2-1",
    "chapter": 4,
    "floor": 2,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "highway-reaver",
      "waterlamp"
    ],
    "rewardTier": "early",
    "next": [
      "f4-3-1",
      "f4-3-0"
    ]
  },
  {
    "id": "f4-2-2",
    "chapter": 4,
    "floor": 2,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f4-3-0",
      "f4-3-1"
    ]
  },
  {
    "id": "f4-3-0",
    "chapter": 4,
    "floor": 3,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "sweeping-wind",
      "quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f4-4-0"
    ]
  },
  {
    "id": "f4-3-1",
    "chapter": 4,
    "floor": 3,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f4-4-0"
    ]
  },
  {
    "id": "f4-4-0",
    "chapter": 4,
    "floor": 4,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f4-5-2",
      "f4-5-0",
      "f4-5-1"
    ]
  },
  {
    "id": "f4-5-0",
    "chapter": 4,
    "floor": 5,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "sweeping-wind",
      "acid-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f4-6-0"
    ]
  },
  {
    "id": "f4-5-1",
    "chapter": 4,
    "floor": 5,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "외곽",
    "enemyIds": [
      "breaking-gust",
      "quillbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f4-6-1"
    ]
  },
  {
    "id": "f4-5-2",
    "chapter": 4,
    "floor": 5,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "sweeping-wind",
      "firemist-originium-slug"
    ],
    "rewardTier": "early",
    "next": [
      "f4-6-0"
    ]
  },
  {
    "id": "f4-6-0",
    "chapter": 4,
    "floor": 6,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "외곽",
    "enemyIds": [
      "road-plunderer",
      "imbued-quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f4-7-0",
      "f4-7-2"
    ]
  },
  {
    "id": "f4-6-1",
    "chapter": 4,
    "floor": 6,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f4-7-1",
      "f4-7-2"
    ]
  },
  {
    "id": "f4-7-0",
    "chapter": 4,
    "floor": 7,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "sweeping-wind",
      "quillbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f4-8-0"
    ]
  },
  {
    "id": "f4-7-1",
    "chapter": 4,
    "floor": 7,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "외곽",
    "rewardTier": "early",
    "next": [
      "f4-8-0"
    ]
  },
  {
    "id": "f4-7-2",
    "chapter": 4,
    "floor": 7,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "외곽",
    "enemyIds": [
      "sweeping-wind",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "early",
    "next": [
      "f4-8-0"
    ]
  },
  {
    "id": "f4-8-0",
    "chapter": 4,
    "floor": 8,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f4-9-2",
      "f4-9-0",
      "f4-9-1"
    ]
  },
  {
    "id": "f4-9-0",
    "chapter": 4,
    "floor": 9,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "breaking-gust",
      "armored-manglerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f4-10-0"
    ]
  },
  {
    "id": "f4-9-1",
    "chapter": 4,
    "floor": 9,
    "column": 4,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "cloud-stalker",
      "highway-reaver",
      "brutal-pincerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f4-10-1"
    ]
  },
  {
    "id": "f4-9-2",
    "chapter": 4,
    "floor": 9,
    "column": 2,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f4-10-0"
    ]
  },
  {
    "id": "f4-10-0",
    "chapter": 4,
    "floor": 10,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "cloud-stalker",
      "grove-archer",
      "glaring-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f4-11-0"
    ]
  },
  {
    "id": "f4-10-1",
    "chapter": 4,
    "floor": 10,
    "column": 4,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f4-11-0"
    ]
  },
  {
    "id": "f4-11-0",
    "chapter": 4,
    "floor": 11,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f4-12-0",
      "f4-12-1"
    ]
  },
  {
    "id": "f4-12-0",
    "chapter": 4,
    "floor": 12,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "nimbus-razor",
      "sweeping-wind",
      "glaring-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f4-13-0",
      "f4-13-2"
    ]
  },
  {
    "id": "f4-12-1",
    "chapter": 4,
    "floor": 12,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "중심부",
    "enemyIds": [
      "breaking-gust",
      "hazefyre-tuskbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f4-13-1"
    ]
  },
  {
    "id": "f4-13-0",
    "chapter": 4,
    "floor": 13,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "중심부",
    "enemyIds": [
      "cloud-stalker",
      "cloud-obliterator",
      "glaring-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f4-14-0"
    ]
  },
  {
    "id": "f4-13-1",
    "chapter": 4,
    "floor": 13,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f4-14-1",
      "f4-14-0"
    ]
  },
  {
    "id": "f4-13-2",
    "chapter": 4,
    "floor": 13,
    "column": 2,
    "type": "battle",
    "title": "교전",
    "subtitle": "중심부",
    "enemyIds": [
      "highway-reaver",
      "cloud-stalker",
      "glaring-rakerbeast"
    ],
    "rewardTier": "mid",
    "next": [
      "f4-14-0"
    ]
  },
  {
    "id": "f4-14-0",
    "chapter": 4,
    "floor": 14,
    "column": 0,
    "type": "treasure",
    "title": "보급 캐시",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f4-15-0"
    ]
  },
  {
    "id": "f4-14-1",
    "chapter": 4,
    "floor": 14,
    "column": 4,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "중심부",
    "rewardTier": "mid",
    "next": [
      "f4-15-1"
    ]
  },
  {
    "id": "f4-15-0",
    "chapter": 4,
    "floor": 15,
    "column": 0,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "cloud-obliterator",
      "nimbus-razor",
      "glaring-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f4-16-0",
      "f4-16-1"
    ]
  },
  {
    "id": "f4-15-1",
    "chapter": 4,
    "floor": 15,
    "column": 4,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "breaking-gust",
      "glaring-rakerbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f4-16-1"
    ]
  },
  {
    "id": "f4-16-0",
    "chapter": 4,
    "floor": 16,
    "column": 0,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "cloud-stalker",
      "hill-smasher",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f4-17-0"
    ]
  },
  {
    "id": "f4-16-1",
    "chapter": 4,
    "floor": 16,
    "column": 4,
    "type": "event",
    "title": "조우 신호",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f4-17-0"
    ]
  },
  {
    "id": "f4-17-0",
    "chapter": 4,
    "floor": 17,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f4-18-2",
      "f4-18-0",
      "f4-18-1"
    ]
  },
  {
    "id": "f4-18-0",
    "chapter": 4,
    "floor": 18,
    "column": 0,
    "type": "elite",
    "title": "정예 교전",
    "subtitle": "심층부",
    "enemyIds": [
      "breaking-gust",
      "spotted-rakerbeast"
    ],
    "rewardTier": "elite",
    "next": [
      "f4-19-0"
    ]
  },
  {
    "id": "f4-18-1",
    "chapter": 4,
    "floor": 18,
    "column": 4,
    "type": "battle",
    "title": "교전",
    "subtitle": "심층부",
    "enemyIds": [
      "hill-smasher",
      "cloud-obliterator",
      "skydrummer"
    ],
    "rewardTier": "late",
    "next": [
      "f4-19-0"
    ]
  },
  {
    "id": "f4-18-2",
    "chapter": 4,
    "floor": 18,
    "column": 2,
    "type": "unknown",
    "title": "미지 신호",
    "subtitle": "심층부",
    "enemyIds": [
      "cloud-obliterator",
      "nimbus-razor",
      "spotted-rakerbeast"
    ],
    "rewardTier": "late",
    "next": [
      "f4-19-0"
    ]
  },
  {
    "id": "f4-19-0",
    "chapter": 4,
    "floor": 19,
    "column": 2,
    "type": "shop",
    "title": "델랑 보급소",
    "subtitle": "심층부",
    "rewardTier": "late",
    "next": [
      "f4-20-0"
    ]
  },
  {
    "id": "f4-20-0",
    "chapter": 4,
    "floor": 20,
    "column": 2,
    "type": "boss",
    "title": "청파채 심층부 · 최종",
    "subtitle": "심층부",
    "enemyIds": [
      "ruan-yi",
      "cloud-obliterator"
    ],
    "rewardTier": "boss",
    "next": []
  }
];

export const mapNodes = allFactionNodes;
export type FactionMeta = { index: number; name: string; short: string; startNodeIds: string[]; bossNodeId: string };
export const factions: FactionMeta[] = [
  {
    "index": 0,
    "name": "탈로스 광석수 무리",
    "short": "광석수",
    "startNodeIds": [
      "f0-1-0",
      "f0-1-1"
    ],
    "bossNodeId": "f0-20-0"
  },
  {
    "index": 1,
    "name": "아겔로이 강습 군세",
    "short": "아겔로이",
    "startNodeIds": [
      "f1-1-0",
      "f1-1-1"
    ],
    "bossNodeId": "f1-20-0"
  },
  {
    "index": 2,
    "name": "무릉 조석 아겔로이",
    "short": "조석",
    "startNodeIds": [
      "f2-1-0",
      "f2-1-1"
    ],
    "bossNodeId": "f2-20-0"
  },
  {
    "index": 3,
    "name": "변경 무법 본크러셔",
    "short": "본크러셔",
    "startNodeIds": [
      "f3-1-0",
      "f3-1-1"
    ],
    "bossNodeId": "f3-20-0"
  },
  {
    "index": 4,
    "name": "청파채 무법단",
    "short": "청파채",
    "startNodeIds": [
      "f4-1-0",
      "f4-1-1"
    ],
    "bossNodeId": "f4-20-0"
  }
];
export const chapters = factions;
export const startingNodeIds = factions[0].startNodeIds;
export function getFactionStart(index: number) { return factions[index]?.startNodeIds ?? []; }
export function getMapNode(id: string) {
  const node = mapNodes.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown map node: ${id}`);
  return node;
}

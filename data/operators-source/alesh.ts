const slug = "alesh";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준:
// 앞 핵심 재료 = 정합용 유체
// 뒤 핵심 재료 = 3상 나노 플레이크 칩

const normalAndComboSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 6, icon: "/materials/정합용 유체.webp" },
      { name: "바위아겔로스 잎", count: 3, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 16, icon: "/materials/정합용 유체.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 36, icon: "/materials/정합용 유체.webp" },
      { name: "바위아겔로스 잎", count: 12, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const battleAndUltimateSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 6, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "바위아겔로스 잎", count: 3, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 16, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 36, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "바위아겔로스 잎", count: 12, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_LEVEL_UP_COSTS = [
  {
    to: 20,
    materials: [
      { name: "초급 작전 기록", count: 5, icon: "/materials/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 2, icon: "/materials/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 2, icon: "/materials/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 820, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 40,
    materials: [
      { name: "초급 작전 기록", count: 3, icon: "/materials/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 8, icon: "/materials/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 24, icon: "/materials/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 12540, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 60,
    materials: [
      { name: "초급 작전 기록", count: 4, icon: "/materials/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 5, icon: "/materials/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 47, icon: "/materials/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 23900, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 80,
    materials: [
      { name: "초급 인지 매개체", count: 6, icon: "/materials/초급 인지 매개체.webp" },
      { name: "고급 인지 매개체", count: 46, icon: "/materials/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 109180, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 90,
    materials: [
      { name: "고급 인지 매개체", count: 58, icon: "/materials/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 238980, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_TRUST_BONUS_COSTS = [
  {
    stage: 1,
    trust: 20,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 5, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 2,
    trust: 50,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 10, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1800, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 3,
    trust: 100,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 10, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 6000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 4,
    trust: 100,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 12000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_INFRASTRUCTURE_COSTS = [
  {
    slot: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1600, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 1,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 12, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 8000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 3000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 2,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 20000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const ALESH_TALENT_COSTS = [
  {
    talent: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 2400, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 1,
    stage: 2,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 40, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 8600, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 48, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 10000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 28, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const aleshOperatorDetailData = {
  slug,
  name: "알레쉬",
  enName: "Alesh",
  rarity: 5 as const,

  element: "cryo" as const,
  class: "vanguard" as const,
  weaponType: "한손검",

  mainStatLabel: "힘",
  subStatLabel: "지능",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [20, 49, 80, 111, 142, 158],
      dex: [9, 27, 47, 66, 86, 95],
      int: [13, 37, 62, 87, 113, 125],
      will: [10, 27, 45, 63, 81, 89],
      atk: [30, 90, 152, 215, 277, 309],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        20, 21, 23, 24, 26, 27, 29, 30, 32, 34,
        35, 37, 38, 40, 41, 43, 44, 46, 48, 49,
        51, 52, 54, 55, 57, 58, 60, 61, 63, 65,
        66, 68, 69, 71, 72, 74, 75, 77, 79, 80,
        82, 83, 85, 86, 88, 89, 91, 92, 94, 96,
        97, 99, 100, 102, 103, 105, 106, 108, 110, 111,
        113, 114, 116, 117, 119, 120, 122, 123, 125, 127,
        128, 130, 131, 133, 134, 136, 137, 139, 141, 142,
        144, 145, 147, 148, 150, 151, 153, 154, 156, 158,
      ],

      dex: [
        9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 25, 26, 27,
        28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        58, 59, 59, 60, 61, 62, 63, 64, 65, 66,
        67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
        77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
        87, 88, 89, 90, 91, 92, 93, 93, 94, 95,
      ],

      int: [
        13, 14, 16, 17, 18, 19, 21, 22, 23, 24,
        26, 27, 28, 29, 31, 32, 33, 35, 36, 37,
        38, 40, 41, 42, 43, 45, 46, 47, 48, 50,
        51, 52, 53, 55, 56, 57, 58, 60, 61, 62,
        64, 65, 66, 67, 69, 70, 71, 72, 74, 75,
        76, 77, 79, 80, 81, 82, 84, 85, 86, 87,
        89, 90, 91, 93, 94, 95, 96, 98, 99, 100,
        101, 103, 104, 105, 106, 108, 109, 110, 111, 113,
        114, 115, 116, 118, 119, 120, 122, 123, 124, 125,
      ],

      will: [
        10, 11, 12, 13, 14, 15, 16, 17, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 25, 26, 27,
        28, 29, 30, 31, 32, 33, 33, 34, 35, 36,
        37, 38, 39, 40, 41, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 49, 50, 51, 52, 53, 54,
        55, 56, 57, 57, 58, 59, 60, 61, 62, 63,
        64, 65, 65, 66, 67, 68, 69, 70, 71, 72,
        73, 73, 74, 75, 76, 77, 78, 79, 80, 81,
        81, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      ],

      atk: [
        30, 33, 36, 39, 43, 46, 49, 52, 55, 58,
        61, 64, 68, 71, 74, 77, 80, 83, 86, 90,
        93, 96, 99, 102, 105, 108, 111, 115, 118, 121,
        124, 127, 130, 133, 136, 140, 143, 146, 149, 152,
        155, 158, 162, 165, 168, 171, 174, 177, 180, 183,
        187, 190, 193, 196, 199, 202, 205, 209, 212, 215,
        218, 221, 224, 227, 230, 234, 237, 240, 243, 246,
        249, 252, 256, 259, 262, 265, 268, 271, 274, 277,
        281, 284, 287, 290, 293, 296, 299, 303, 306, 309,
      ],

      hp: [
        500, 556, 612, 668, 724, 781, 837, 893, 949, 1005,
        1061, 1117, 1173, 1230, 1286, 1342, 1398, 1454, 1510, 1566,
        1622, 1679, 1735, 1791, 1847, 1903, 1959, 2015, 2071, 2128,
        2184, 2240, 2296, 2352, 2408, 2464, 2520, 2577, 2633, 2689,
        2745, 2801, 2857, 2913, 2969, 3026, 3082, 3138, 3194, 3250,
        3306, 3362, 3418, 3474, 3531, 3587, 3643, 3699, 3755, 3811,
        3867, 3923, 3980, 4036, 4092, 4148, 4204, 4260, 4316, 4372,
        4429, 4485, 4541, 4597, 4653, 4709, 4765, 4821, 4878, 4934,
        4990, 5046, 5102, 5158, 5214, 5270, 5327, 5383, 5439, 5495,
      ],
    },
  },

  elite: [
    {
      phase: "정예화 I",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 40레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크", count: 8, icon: "/materials/프로토콜 디스크.webp" },
        { name: "연한 붉은 기둥 버섯", count: 3, icon: "/materials/연한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 1600, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 II",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 60레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크", count: 25, icon: "/materials/프로토콜 디스크.webp" },
        { name: "보통 붉은 기둥 버섯", count: 5, icon: "/materials/보통 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 6500, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 III",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 80레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 24, icon: "/materials/프로토콜 디스크 세트.webp" },
        { name: "진한 붉은 기둥 버섯", count: 5, icon: "/materials/진한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 18000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 IV",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 90레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 36, icon: "/materials/프로토콜 디스크 세트.webp" },
        { name: "초거리 빛 반사 파이프", count: 20, icon: "/materials/초거리 빛 반사 파이프.webp" },
        { name: "피버섯", count: 8, icon: "/materials/피버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
  ],

  talents: [
    {
      name: "급속 냉동 보존 기술",
      unlock: "정예화 단계 1 달성 시 해제 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "주변의 적에게 동결 혹은 오리지늄 결정을 부착한 후, 자신의 궁극기 에너지 획득 3포인트. 자기가 동결을 부여하여 해당 효과가 발동했을 경우, 궁극기 에너지 6포인트 추가 획득. 해당 효과는 3초마다 최대 1회만 발동합니다.",
    },
    {
      name: "급속 냉동 보존 기술",
      unlock: "정예화 단계 2 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "주변의 적에게 동결 혹은 오리지늄 결정을 부착한 후, 자신의 궁극기 에너지 획득 4포인트. 자기가 동결을 부여하여 해당 효과가 발동했을 경우, 궁극기 에너지 8포인트 추가 획득. 해당 효과는 3초마다 최대 1회만 발동합니다.",
    },
    {
      name: "낚시의 달인",
      unlock: "정예화 단계 2 달성 시 해제 가능",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "지능 10포인트마다, 연계 스킬 얼음 낚시 기술로 진귀한 린수를 낚아올릴 확률 +0.2%, 최대 +30%",
    },
    {
      name: "낚시의 달인",
      unlock: "정예화 단계 3 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "지능 10포인트마다, 연계 스킬 얼음 낚시 기술로 진귀한 린수를 낚아올릴 확률 +0.5%, 최대 +30%",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "린수의 반격",
      description:
        "배틀 스킬 비정규 루어가 스킬 게이지 회복 효과를 발동했을 때, 추가로 스킬 게이지 10포인트를 회복합니다.",
    },
    {
      title: "2",
      subtitle: "마음의 평온",
      description: "힘 +15, 지능 +15",
    },
    {
      title: "3",
      subtitle: "미끼 없는 낚시",
      description:
        "연계 스킬 얼음낚시 기술을 사용하여 진귀한 린수를 낚은 후, 팀 전체 공격력 +15%, 10초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      title: "4",
      subtitle: "광란의 낚시팀",
      description: "궁극기 월척이다!의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "초특급 입질",
      description:
        "궁극기 월척이다!가 생명력이 50% 미만인 목표에 명중했을 때, 피해 배율이 기존의 1.5배로 증가합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "캐스팅의 기본",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 17포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["18%", "19%", "21%", "23%", "25%", "26%", "28%", "30%", "32%", "34%", "36%", "39%"] },
        { label: "일반 공격 제2단계 배율", values: ["10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "21%", "23%"] },
        { label: "일반 공격 제3단계 배율", values: ["28%", "30%", "33%", "36%", "39%", "41%", "44%", "47%", "50%", "53%", "57%", "62%"] },
        { label: "일반 공격 제4단계 배율", values: ["28%", "30%", "33%", "36%", "39%", "41%", "44%", "47%", "50%", "53%", "57%", "62%"] },
        { label: "일반 공격 제5단계 배율", values: ["55%", "61%", "66%", "72%", "77%", "83%", "88%", "94%", "99%", "106%", "114%", "124%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "비정규 루어",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "얼음 조각을 낚아올려 전방의 목표를 향해 내리치며 물리 피해를 줍니다. 냉기 부착 상태의 목표를 명중하면, 목표의 냉기 부착을 전부 소모하고, 대상에게 강제로 동결 상태를 부여합니다. 소모한 스택 수치에 따라 스킬 게이지를 회복하며, 여러 목표를 명중했을 경우, 1회만 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["200%", "220%", "240%", "260%", "280%", "300%", "320%", "340%", "360%", "385%", "415%", "450%"] },
        { label: "부착 1스택 소모 시 회복하는 스킬 게이지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "15", "15", "15"] },
        { label: "부착 2스택 소모 시 회복하는 스킬 게이지", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "25", "25", "25"] },
        { label: "부착 3스택 소모 시 회복하는 스킬 게이지", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "35", "35", "35"] },
        { label: "부착 4스택 소모 시 회복하는 스킬 게이지", values: ["40", "40", "40", "40", "40", "40", "40", "40", "40", "45", "45", "45"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    comboSkill: {
      name: "얼음낚시 기술",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "근처 목표의 아츠 이상 효과 혹은 오리지늄 결정이 소모되었을 때 사용할 수 있습니다.",
        "적의 발밑에 구멍을 내 낚시를 시도하여, 물리 피해를 주고 일정 스킬 게이지를 회복합니다. 또한 일정 확률로 진귀한 린수를 낚을 수 있으며, 피해가 대폭 증가하고 스킬 게이지를 추가 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["9s", "9s", "9s", "9s", "9s", "9s", "9s", "9s", "9s", "9s", "9s", "8s"] },
        { label: "피해 배율", values: ["133%", "147%", "160%", "173%", "187%", "200%", "213%", "227%", "240%", "257%", "277%", "300%"] },
        { label: "진귀한 린수를 낚을 확률", values: ["10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%"] },
        { label: "강화 피해 배율", values: ["213%", "235%", "256%", "277%", "299%", "320%", "341%", "363%", "384%", "411%", "443%", "480%"] },
        { label: "스킬 게이지 회복", values: ["10", "10", "10", "10", "10", "12", "12", "12", "12", "13", "13", "15"] },
        { label: "추가로 회복하는 스킬 게이지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "월척이다!",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "20초" },
      ],
      description: [
        "상상을 초월하는 거대한 린수를 낚아 올린 다음, 전방 모든 적을 향해 내리칩니다. 넓은 범위의 냉기 피해를 주고 냉기 부착 상태를 부여하며 일정 스킬 게이지를 회복합니다. 목표를 처치할 때마다 일정량의 스킬 게이지가 추가로 회복됩니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "궁극기 피해 배율", values: ["436%", "479%", "523%", "566%", "610%", "653%", "697%", "741%", "784%", "839%", "904%", "980%"] },
        { label: "기초 상태에서 회복하는 스킬 게이지", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "25", "25", "25"] },
        { label: "목표 처치 시 추가로 회복하는 스킬 게이지", values: ["12", "12", "12", "12", "12", "12", "12", "12", "12", "15", "15", "15"] },
        { label: "스킬 게이지 회복 최대치", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
      ],
    },
  },

  infrastructureSkills: [
  {
    name: "실험적 아츠 유닛",
    icon: `/operators/${slug}/infrastructure/skill1.webp`,
    levels: [
      {
        tier: "α",
        unlockText: "정예화 단계 1 달성 시 해제 가능",
        description: "제조실에 배치 시, 아츠 유닛 생산 효율 +10%",
      },
      {
        tier: "β",
        unlockText: "정예화 단계 3 달성 시 활성화 가능",
        description: "제조실에 배치 시, 아츠 유닛 생산 효율 +14%",
      },
    ],
  },
  {
    name: "썰렁한 농담 배우기",
    icon: `/operators/${slug}/infrastructure/skill2.webp`,
    levels: [
      {
        tier: "α",
        unlockText: "정예화 단계 2 달성 시 해제 가능",
        description: "응접실에 배치 시, 컨디션 소모 속도 14% 감소",
      },
      {
        tier: "β",
        unlockText: "정예화 단계 4 달성 시 활성화 가능",
        description: "응접실에 배치 시, 컨디션 소모 속도 18% 감소",
      },
    ],
  },
],

  trustBonus: [
    { level: 1, label: "힘 +10" },
    { level: 2, label: "힘 +15" },
    { level: 3, label: "힘 +15" },
    { level: 4, label: "힘 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: COMMON_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: ALESH_TALENT_COSTS,
  },
} as const;
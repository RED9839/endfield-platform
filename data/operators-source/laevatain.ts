const slug = "laevatain";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준: 3상 나노 플레이크 칩, 초거리 빛 반사 파이프

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
      { name: "3상 나노 플레이크 칩", count: 6, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 16, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 36, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "침식된 옥 잎", count: 12, icon: "/materials/침식된 옥 잎.webp" },
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
      { name: "초거리 빛 반사 파이프", count: 6, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 16, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 36, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 12, icon: "/materials/침식된 옥 잎.webp" },
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

const LAEVATAIN_TRUST_BONUS_COSTS = [
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

const LAEVATAIN_TALENT_COSTS = [
  {
    talent: 1,
    stage: 1,
    elite: 0,
    materials: [],
  },
  {
    talent: 1,
    stage: 2,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 2400, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 1,
    stage: 3,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘", count: 18, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 16000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 48, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 10800, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 18, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 16000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const laevatainOperatorDetailData = {
  slug,
  name: "레바테인",
  enName: "Laevatain",
  rarity: 6 as const,

  element: "heat" as const,
  class: "striker" as const,
  weaponType: "한손검",

  mainStatLabel: "지능",
  subStatLabel: "힘",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [13, 36, 60, 85, 109, 121],
      dex: [9, 28, 49, 69, 89, 99],
      int: [22, 55, 90, 125, 160, 177],
      will: [9, 26, 44, 62, 80, 89],
      atk: [30, 91, 156, 221, 285, 318],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        13, 14, 16, 17, 18, 19, 20, 22, 23, 24,
        25, 26, 28, 29, 30, 31, 32, 34, 35, 36,
        37, 39, 40, 41, 42, 43, 45, 46, 47, 48,
        49, 51, 52, 53, 54, 55, 57, 58, 59, 60,
        62, 63, 64, 65, 66, 68, 69, 70, 71, 72,
        74, 75, 76, 77, 78, 80, 81, 82, 83, 85,
        86, 87, 88, 89, 91, 92, 93, 94, 95, 97,
        98, 99, 100, 102, 103, 104, 105, 106, 108, 109,
        110, 111, 112, 114, 115, 116, 117, 118, 120, 121,
      ],

      dex: [
        9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 32, 33, 34, 35, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
        60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
        70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
        90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
      ],

      int: [
        22, 24, 25, 27, 29, 31, 32, 34, 36, 38,
        39, 41, 43, 45, 46, 48, 50, 52, 53, 55,
        57, 59, 60, 62, 64, 66, 67, 69, 71, 73,
        74, 76, 78, 80, 81, 83, 85, 87, 88, 90,
        92, 94, 95, 97, 99, 101, 102, 104, 106, 108,
        109, 111, 113, 114, 116, 118, 120, 121, 123, 125,
        127, 128, 130, 132, 134, 135, 137, 139, 141, 142,
        144, 146, 148, 149, 151, 153, 155, 156, 158, 160,
        162, 163, 165, 167, 169, 170, 172, 174, 176, 177,
      ],

      will: [
        9, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 19, 20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 88, 89,
      ],

      atk: [
        30, 33, 36, 40, 43, 46, 49, 53, 56, 59,
        62, 66, 69, 72, 75, 78, 82, 85, 88, 91,
        95, 98, 101, 104, 108, 111, 114, 117, 120, 124,
        127, 130, 133, 137, 140, 143, 146, 150, 153, 156,
        159, 162, 166, 169, 172, 175, 179, 182, 185, 188,
        192, 195, 198, 201, 204, 208, 211, 214, 217, 221,
        224, 227, 230, 234, 237, 240, 243, 247, 250, 253,
        256, 259, 263, 266, 269, 272, 276, 279, 282, 285,
        289, 292, 295, 298, 301, 305, 308, 311, 314, 318,
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
        { name: "D96강 시제품 4번", count: 20, icon: "/materials/D96강 시제품 4번.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/materials/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
  ],

  skills: {
    normalAttack: {
      name: "재",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 열기 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 18포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 열기 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 열기 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["16%", "18%", "19%", "21%", "22%", "24%", "26%", "27%", "29%", "31%", "33%", "36%"] },
        { label: "일반 공격 제2단계 배율", values: ["24%", "26%", "29%", "31%", "34%", "36%", "38%", "41%", "43%", "46%", "50%", "54%"] },
        { label: "일반 공격 제3단계 배율", values: ["25%", "28%", "30%", "33%", "35%", "38%", "40%", "43%", "45%", "48%", "52%", "56%"] },
        { label: "일반 공격 제4단계 배율", values: ["39%", "43%", "47%", "51%", "55%", "59%", "62%", "66%", "70%", "75%", "81%", "88%"] },
        { label: "일반 공격 제5단계 배율", values: ["53%", "58%", "64%", "69%", "74%", "80%", "85%", "90%", "95%", "102%", "110%", "119%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "불타오르는 화염",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "몰튼 코어 조각을 소환해 지속적으로 전방의 적을 공격합니다. 열기 피해를 주며, 적을 명중하면 녹아내린 불꽃 1스택을 획득합니다.",
        "이미 녹아내린 불꽃 4스택이 쌓였을 경우, 마지막에 모든 스택 수치를 소모해 넓은 범위 내의 적에게 추가로 1회 공격하며, 열기 피해를 주고, 짧은 강제 연소 상태를 부여합니다.",
        "추가 공격이 적에게 명중했다면 추가로 궁극기 에너지를 획득합니다.",
        "궁극기 사용 중에는 배틀 스킬의 효과가 강화됩니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "초기 폭발 피해 배율", values: ["62%", "68%", "75%", "81%", "87%", "93%", "99%", "106%", "112%", "120%", "129%", "140%"] },
        { label: "초기 폭발 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "단계별 지속 피해 배율", values: ["6%", "7%", "8%", "8%", "9%", "9%", "10%", "11%", "11%", "12%", "13%", "14%"] },
        { label: "추가 피해 배율", values: ["342%", "376%", "410%", "445%", "479%", "513%", "547%", "581%", "616%", "658%", "710%", "770%"] },
        { label: "추가 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "연소 시간(초)", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "추가 공격으로 획득하는 궁극기 에너지", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "궁극기 사용 중 제1단계 배율", values: ["147%", "161%", "176%", "191%", "205%", "220%", "235%", "249%", "264%", "282%", "304%", "330%"] },
        { label: "궁극기 사용 중 제1단계 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "궁극기 사용 중 제2단계 배율", values: ["164%", "181%", "197%", "214%", "230%", "247%", "263%", "279%", "296%", "316%", "341%", "370%"] },
        { label: "궁극기 사용 중 제2단계 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "궁극기 사용 중 추가 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "궁극기 사용 중 추가 공격 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "궁극기 사용 중 연소 시간(초)", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
      ],
    },

    comboSkill: {
      name: "열화",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적이 연소 상태거나, 부식 상태일 때 사용할 수 있습니다.",
        "모든 연소 상태 혹은 부식 상태의 적의 발밑에서 불꽃이 솟아오르게 만들고, 대상에게 열기 피해를 줍니다.",
        "적을 명중하면 1스택의 녹아내린 불꽃을 획득합니다. 적을 명중할 때마다 추가로 궁극기 에너지를 획득합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "9s"] },
        { label: "피해 배율", values: ["240%", "264%", "288%", "312%", "336%", "360%", "384%", "408%", "432%", "462%", "498%", "540%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "1명의 적에게 명중할 때 획득하는 궁극기 에너지", values: ["25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25"] },
        { label: "2명의 적에게 명중할 때 획득하는 궁극기 에너지", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
        { label: "3명 이상의 적에게 명중할 때 획득하는 궁극기 에너지", values: ["35", "35", "35", "35", "35", "35", "35", "35", "35", "35", "35", "35"] },
      ],
    },

    ultimate: {
      name: "황혼",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "10s" },
      ],
      description: [
        "열화의 마검을 소환하고 메인 컨트롤 오퍼레이터로 전환합니다.",
        "일정 시간 동안, 일반 공격이 강화되며 열화의 마검이 레바테인과 함께 적을 공격합니다. 모든 공격이 열기 피해를 주며, 3단계 일반 공격은 열기 부착 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["300", "300", "300", "300", "300", "300", "300", "300", "300", "300", "300", "300"] },
        { label: "지속 시간(초)", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
        { label: "강화 일반 공격 제1단계 배율", values: ["65%", "71%", "78%", "84%", "91%", "97%", "104%", "110%", "117%", "125%", "134%", "146%"] },
        { label: "강화 일반 공격 제2단계 배율", values: ["81%", "89%", "97%", "105%", "113%", "122%", "130%", "138%", "146%", "156%", "168%", "182%"] },
        { label: "강화 일반 공격 제3단계 배율", values: ["115%", "127%", "139%", "150%", "162%", "173%", "185%", "196%", "208%", "222%", "240%", "260%"] },
        { label: "강화 일반 공격 제4단계 배율", values: ["203%", "223%", "243%", "263%", "284%", "304%", "324%", "344%", "365%", "390%", "420%", "456%"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "녹아내린 마음",
      description: "배틀 스킬 불타오르는 화염의 추가 공격 피해 배율이 기존의 1.2배로 증가하고, 명중한 후 스킬 게이지 20포인트를 반환합니다.",
    },
    {
      title: "2",
      subtitle: "기억을 찾는 여정",
      description: "지능 +20, 일반 공격 피해 +15%",
    },
    {
      title: "3",
      subtitle: "추억의 조각",
      description: "배틀 스킬 불타오르는 화염이 주는 연소의 지속 시간 +50%, 연소의 피해 증가가 기존의 1.5배로 증가",
    },
    {
      title: "4",
      subtitle: "아이스크림 용광로",
      description: "궁극기 황혼의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "존재의 증명",
      description: "궁극기 황혼의 일반 공격 강화 피해 배율이 기존의 1.2배로 증가하고, 궁극기가 지속되는 동안 레바테인이 적 한 명을 처치할 때마다 궁극기 지속 시간 +1초(최대 +7초)",
    },
  ],

  talents: [
    {
      name: "불꽃의 심장",
      unlock: "Unlocked by default",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "메인 컨트롤 오퍼레이터의 강력한 일격이나 처형이 명중한 후, 레바테인이 주변 적의 열기 부착을 흡수합니다.\n열기 부착을 1스택 흡수할 때마다 자신은 녹아내린 불꽃 1스택을 획득하며, 최대 4스택까지 중첩됩니다.\n4스택까지 중첩하면 레바테인이 주는 피해가 적의 열기 저항 10포인트를 무시하고 20초 동안 지속됩니다.\n주변의 적이 처치될 때, 열기 부착도 함께 흡수됩니다.",
    },
    {
      name: "불꽃의 심장",
      unlock: "Promote to E1 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "메인 컨트롤 오퍼레이터의 강력한 일격이나 처형이 명중한 후, 레바테인이 주변 적의 열기 부착을 흡수합니다.\n열기 부착을 1스택 흡수할 때마다 자신은 녹아내린 불꽃 1스택을 획득하며, 최대 4스택까지 중첩됩니다.\n4스택까지 중첩하면 레바테인이 주는 피해가 적의 열기 저항 15포인트를 무시하고 20초 동안 지속됩니다.\n주변의 적이 처치될 때, 열기 부착도 함께 흡수됩니다.",
    },
    {
      name: "불꽃의 심장",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "메인 컨트롤 오퍼레이터의 강력한 일격이나 처형이 명중한 후, 레바테인이 주변 적의 열기 부착을 흡수합니다.\n열기 부착을 1스택 흡수할 때마다 자신은 녹아내린 불꽃 1스택을 획득하며, 최대 4스택까지 중첩됩니다.\n4스택까지 중첩하면 레바테인이 주는 피해가 적의 열기 저항 20포인트를 무시하고 20초 동안 지속됩니다.\n주변의 적이 처치될 때, 열기 부착도 함께 흡수됩니다.",
    },
    {
      name: "부활의 불씨",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "생명력이 40% 미만일 때, 90%의 비호를 획득하고 매초마다 최대 생명력의 5%를 회복하며, 4초 동안 지속됩니다. 해당 효과는 120초마다 최대 1회 발동합니다.",
    },
    {
      name: "부활의 불씨",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "생명력이 40% 미만일 때, 90%의 비호를 획득하고 매초마다 최대 생명력의 5%를 회복하며, 8초 동안 지속됩니다. 해당 효과는 120초마다 최대 1회 발동합니다.",
    },
  ],

  infrastructureSkills: [
    {
      name: "기억의 용광로",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 30% 증가",
        },
      ],
    },
    {
      name: "꺼지지 않는 불꽃",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "제조실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "제조실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
        },
      ],
    },
  ],

  trustBonus: [
    { level: 1, label: "지능 +10" },
    { level: 2, label: "지능 +15" },
    { level: 3, label: "지능 +15" },
    { level: 4, label: "지능 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: LAEVATAIN_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: LAEVATAIN_TALENT_COSTS,
  },
} as const;
const slug = "camu";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준:
// 앞 핵심 재료 = 3상 나노 플레이크 칩
// 뒤 핵심 재료 = 초거리 빛 반사 파이프

const normalAndComboSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 6, icon: "/items/3상 나노 플레이크 칩.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 16, icon: "/items/3상 나노 플레이크 칩.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 36, icon: "/items/3상 나노 플레이크 칩.webp" },
      { name: "침식된 옥 잎", count: 12, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const battleAndUltimateSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 6, icon: "/items/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 16, icon: "/items/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 36, icon: "/items/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 12, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_LEVEL_UP_COSTS = [
  {
    to: 20,
    materials: [
      { name: "초급 작전 기록", count: 5, icon: "/items/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 2, icon: "/items/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 2, icon: "/items/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 820, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 40,
    materials: [
      { name: "초급 작전 기록", count: 3, icon: "/items/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 8, icon: "/items/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 24, icon: "/items/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 12540, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 60,
    materials: [
      { name: "초급 작전 기록", count: 4, icon: "/items/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 5, icon: "/items/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 47, icon: "/items/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 23900, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 80,
    materials: [
      { name: "초급 인지 매개체", count: 6, icon: "/items/초급 인지 매개체.webp" },
      { name: "고급 인지 매개체", count: 46, icon: "/items/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 109180, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 90,
    materials: [
      { name: "고급 인지 매개체", count: 58, icon: "/items/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 238980, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_TRUST_BONUS_COSTS = [
  {
    stage: 1,
    trust: 20,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 5, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 2,
    trust: 50,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 10, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1800, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 3,
    trust: 100,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 10, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 6000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 4,
    trust: 100,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 12000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_INFRASTRUCTURE_COSTS = [
  {
    slot: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1600, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 1,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 12, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 8000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 3000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 2,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 20000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const AKEKURI_TALENT_COSTS = [
  {
    talent: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 2400, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 1,
    stage: 2,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 48, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 10800, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 36, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 32000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const camuOperatorDetailData = {
  slug,
  name: "카뮤",
  enName: "Camille",
  rarity: 6 as const,

  element: "heat" as const,
  class: "vanguard" as const,
  weaponType: "장병기",

  mainStatLabel: "민첩",
  subStatLabel: "지능",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [13, 32, 52, 72, 92, 102],
      dex: [17, 48, 80, 112, 144, 160],
      int: [14, 38, 64, 90, 116, 129],
      will: [11, 28, 46, 64, 82, 92],
      atk: [30, 91, 155, 219, 283, 315],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
        33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
        43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
        53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
        73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
        83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
        93, 94, 95, 96, 97, 98, 99, 100, 101, 102,
      ],

      dex: [
        17, 19, 20, 22, 24, 25, 27, 29, 30, 32,
        33, 35, 37, 38, 40, 41, 43, 45, 46, 48,
        49, 51, 53, 54, 56, 57, 59, 61, 62, 64,
        66, 67, 69, 70, 72, 74, 75, 77, 78, 80,
        82, 83, 85, 86, 88, 90, 91, 93, 94, 96,
        98, 99, 101, 103, 104, 106, 107, 109, 111, 112,
        114, 115, 117, 119, 120, 122, 123, 125, 127, 128,
        130, 131, 133, 135, 136, 138, 139, 141, 143, 144,
        146, 148, 149, 151, 152, 154, 156, 157, 159, 160,
      ],

      int: [
        14, 15, 16, 18, 19, 20, 21, 23, 24, 25,
        27, 28, 29, 30, 32, 33, 34, 36, 37, 38,
        40, 41, 42, 43, 45, 46, 47, 49, 50, 51,
        52, 54, 55, 56, 58, 59, 60, 61, 63, 64,
        65, 67, 68, 69, 71, 72, 73, 74, 76, 77,
        78, 80, 81, 82, 83, 85, 86, 87, 89, 90,
        91, 93, 94, 95, 96, 98, 99, 100, 102, 103,
        104, 105, 107, 108, 109, 111, 112, 113, 114, 116,
        117, 118, 120, 121, 122, 124, 125, 126, 127, 129,
      ],

      will: [
        11, 12, 13, 14, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 24, 25, 26, 27, 28,
        29, 30, 31, 32, 33, 34, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 43, 44, 45, 46,
        47, 48, 49, 50, 51, 52, 53, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 63, 64,
        65, 66, 67, 68, 69, 70, 71, 72, 73, 73,
        74, 75, 76, 77, 78, 79, 80, 81, 82, 82,
        83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
      ],

      atk: [
        30, 33, 36, 40, 43, 46, 49, 52, 56, 59,
        62, 65, 68, 72, 75, 78, 81, 84, 88, 91,
        94, 97, 100, 104, 107, 110, 113, 116, 120, 123,
        126, 129, 132, 136, 139, 142, 145, 148, 152, 155,
        158, 161, 164, 168, 171, 174, 177, 180, 184, 187,
        190, 193, 196, 200, 203, 206, 209, 212, 216, 219,
        222, 225, 228, 231, 235, 238, 241, 244, 247, 251,
        254, 257, 260, 263, 267, 270, 273, 276, 279, 283,
        286, 289, 292, 295, 299, 302, 305, 308, 311, 315,
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
        { name: "프로토콜 디스크", count: 8, icon: "/items/프로토콜 디스크.webp" },
        { name: "연한 붉은 기둥 버섯", count: 3, icon: "/items/연한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 1600, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 II",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 60레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크", count: 25, icon: "/items/프로토콜 디스크.webp" },
        { name: "보통 붉은 기둥 버섯", count: 5, icon: "/items/보통 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 6500, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 III",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 80레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 24, icon: "/items/프로토콜 디스크 세트.webp" },
        { name: "진한 붉은 기둥 버섯", count: 5, icon: "/items/진한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 IV",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 90레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 36, icon: "/items/프로토콜 디스크 세트.webp" },
        { name: "D96강 시제품 4번", count: 20, icon: "/items/D96강 시제품 4번.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/items/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  talents: [
    {
      name: "죄를 쫓는 자",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "연계 스킬 영혼의 가시 효과 강화: 타오르는 핏빛 날개가 배회하는 상태의 적을 명중할 때, [30+지능×0.15] 포인트만큼의 생명력을 회복하고 연타를 획득합니다. 15초 동안 지속. 추적 사용 시에는 목표가 배회 효과를 받는 상태가 아닐 때도 위의 효과가 발동합니다.",
    },
    {
      name: "죄를 쫓는 자",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "연계 스킬 영혼의 가시 효과 강화: 타오르는 핏빛 날개가 배회하는 상태의 적을 명중할 때, [60+지능×0.3] 포인트만큼의 생명력을 회복하고 연타를 획득합니다. 15초 동안 지속. 추적 사용 시에는 목표가 배회 효과를 받는 상태가 아닐 때도 위의 효과가 발동합니다.",
    },
    {
      name: "혈류 소생",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "스킬을 사용해 자신의 생명력을 회복할 때마다 열기 피해 +2% (최대 5스택), 40초간 지속, 팀 내 다른 오퍼레이터는 해당 효과의 25%. 자신의 생명력이 가득 찬 상태라면, 발동할 때마다 2스택을 중첩할 수 있습니다.",
    },
    {
      name: "혈류 소생",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "스킬을 사용해 자신의 생명력을 회복할 때마다 열기 피해 +4% (최대 5스택), 40초간 지속, 팀 내 다른 오퍼레이터는 해당 효과의 25%. 자신의 생명력이 가득 찬 상태라면, 발동할 때마다 2스택을 중첩할 수 있습니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "겁화의 세례",
      description: "전투 스킬 사르는 불꽃이 부여하는 허약 효과 +5%, 열기 취약 효과 +5%, 타오르는 핏빛 날개의 배회 지속 시간 +15초",
    },
    {
      title: "2",
      subtitle: "주술 탐지",
      description: "민첩 +20, 지능 +20",
    },
    {
      title: "3",
      subtitle: "파쇄하는 가시",
      description: "연계 스킬 영혼의 가시의 쿨타임 -2초, 영혼의 가시와 추적 피해 배율이 기존의 1.3배로 증가하고, 스킬 게이지 회복량이 기존의 1.15배로 증가합니다.",
    },
    {
      title: "4",
      subtitle: "수호자의 증명",
      description: "궁극기 선혈의 비의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "피로 맺은 결속",
      description: "재능 혈류 소생 효과 강화: 1스택마다 열기 피해 증가 효과 +6%",
    },
  ],

  skills: {
    normalAttack: {
      name: "피의 속죄",
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
        { label: "일반 공격 제1단계 배율", values: ["25%", "28%", "30%", "33%", "35%", "38%", "40%", "43%", "45%", "48%", "52%", "56%"] },
        { label: "일반 공격 제2단계 배율", values: ["20%", "22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "39%", "42%", "45%"] },
        { label: "일반 공격 제3단계 배율", values: ["30%", "33%", "36%", "39%", "42%", "45%", "48%", "51%", "54%", "58%", "62%", "68%"] },
        { label: "일반 공격 제4단계 배율", values: ["34%", "37%", "41%", "44%", "48%", "51%", "54%", "58%", "61%", "66%", "71%", "77%"] },
        { label: "일반 공격 제5단계 배율", values: ["50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "96%", "104%", "113%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "사르는 불꽃",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "타오르는 핏빛 날개를 소환하여 적에게 보냅니다. 작은 범위 내의 적에게 열기 피해를 주고 열기 부착을 부여합니다.",
        "이후 타오르는 핏빛 날개는 목표의 주변에서 배회하며 목표에 허약과 열기 취약을 부여합니다.",
        "목표가 처치될 때, 타오르는 핏빛 날개는 주변의 다른 적에게 날아가 열기 피해를 주고, 열기 부착을 부여하며, 허약과 열기 취약을 부여합니다.",
        "타오르는 핏빛 날개가 배회 중인 적이 카뮤의 연계 스킬에 명중될 때, 짧은 지연 후 한 차례 폭발이 발생하며 추가로 열기 피해를 받습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["89%", "98%", "107%", "116%", "125%", "134%", "143%", "151%", "160%", "172%", "185%", "200%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "타오르는 핏빛 날개 지속 시간(초)", values: ["45", "45", "45", "45", "45", "45", "45", "45", "45", "45", "45", "45"] },
        { label: "허약 효과", values: ["5%", "5%", "5%", "5.5%", "5.5%", "5.5%", "6%", "6%", "6%", "6.5%", "6.5%", "7%"] },
        { label: "열기 취약 효과", values: ["5%", "5%", "5%", "5.5%", "5.5%", "5.5%", "6%", "6%", "6%", "6.5%", "6.5%", "7%"] },
        { label: "폭발 피해 배율", values: ["45%", "49%", "54%", "58%", "62%", "67%", "71%", "76%", "80%", "86%", "93%", "100%"] },
      ],
    },

    comboSkill: {
      name: "영혼의 가시",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적의 열기 부착이 소모되거나 흡수된 후 사용할 수 있습니다.",
        "해당 위치를 이리저리 가로지르며 열기 피해를 주고, 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "19s", "19s", "19s", "18s"] },
        { label: "피해 배율", values: ["133%", "147%", "160%", "173%", "186%", "200%", "213%", "226%", "240%", "256%", "276%", "300%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "스킬 게이지 회복", values: ["16", "16", "16", "16", "16", "16", "18", "18", "18", "20", "20", "20"] },
        { label: "추적 피해 배율", values: ["222%", "244%", "267%", "289%", "311%", "333%", "356%", "378%", "400%", "428%", "461%", "500%"] },
        { label: "추적 불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
        { label: "추적 스킬 게이지 회복", values: ["32", "32", "32", "32", "32", "32", "36", "36", "36", "40", "40", "40"] },
        { label: "획득하는 궁극기 에너지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "선혈의 비",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
      ],
      description: [
        "카뮤가 공중으로 날아올라 창의 비를 퍼붓고 가로 베기 공격을 시전하며, 명중한 목표에 열기 피해를 주고 열기 부착을 부여하며, 동시에 일정 스킬 게이지를 회복합니다.",
        "사용 후, 일정 시간 내에 다음 배틀 스킬이 추적으로 교체됩니다. 추적은 연계 스킬로 간주되며, 스킬 게이지를 소모하지 않습니다.",
        "추적: 해당 위치를 이리저리 가로지르며 열기 피해를 주고, 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["130", "130", "130", "130", "130", "130", "130", "130", "130", "130", "130", "130"] },
        { label: "피해 배율", values: ["267%", "293%", "320%", "347%", "373%", "400%", "427%", "453%", "480%", "513%", "553%", "600%"] },
        { label: "불균형치", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
        { label: "스킬 게이지 회복", values: ["32", "32", "32", "32", "32", "32", "32", "32", "36", "36", "36", "40"] },
        { label: "추적 상태 지속 시간(초)", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
      ],
    },
  },

 infrastructureSkills: [
  {
    name: "혈정 층 분석",
    icon: `/operators/${slug}/infrastructure/skill1.webp`,
    levels: [
      {
        tier: "β",
        unlockText: "정예화 단계 1 달성 시 해제 가능",
        description: "재배실에 배치 시, 결정화 식물 재료의 육성 속도 20% 증가",
      },
      {
        tier: "γ",
        unlockText: "정예화 단계 3 달성 시 활성화 가능",
        description: "재배실에 배치 시, 결정화 식물 재료의 육성 속도 30% 증가",
      },
    ],
  },
  {
    name: "수호자 매뉴얼",
    icon: `/operators/${slug}/infrastructure/skill2.webp`,
    levels: [
      {
        tier: "β",
        unlockText: "정예화 단계 2 달성 시 해제 가능",
        description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 20% 증가",
      },
      {
        tier: "γ",
        unlockText: "정예화 단계 4 달성 시 활성화 가능",
        description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 30% 증가",
      },
    ],
  },
],

  trustBonus: [
    { level: 1, label: "민첩 +10" },
    { level: 2, label: "민첩 +15" },
    { level: 3, label: "민첩 +15" },
    { level: 4, label: "민첩 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: COMMON_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: AKEKURI_TALENT_COSTS,
  },
} as const;
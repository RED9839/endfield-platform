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
      str: [13, 34, 54, 77, 99, 110],
      dex: [15, 42, 68, 98, 126, 140],
      int: [12, 32, 53, 75, 96, 106],
      will: [9, 30, 52, 74, 96, 108],
      atk: [30, 92, 157, 222, 287, 319],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        13, 14, 15, 16, 17, 18, 19, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 31, 33, 34,
        35, 36, 37, 38, 39, 40, 41, 42, 43, 45,
        46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        55, 57, 58, 59, 60, 61, 62, 63, 64, 65,
        66, 67, 69, 70, 71, 72, 73, 74, 75, 76,
        77, 77, 78, 79, 80, 82, 83, 84, 85, 86,
        87, 88, 89, 90, 91, 92, 94, 95, 96, 97,
        98, 99, 99, 100, 101, 102, 103, 104, 106, 107,
        108, 109, 110,
      ],

      dex: [
        15, 16, 17, 19, 20, 22, 23, 25, 26, 27,
        29, 30, 32, 33, 34, 36, 37, 39, 40, 42,
        43, 44, 46, 47, 49, 50, 51, 53, 54, 56,
        57, 58, 60, 61, 63, 64, 66, 67, 68, 70,
        70, 71, 73, 74, 75, 77, 78, 80, 81, 82,
        84, 85, 87, 88, 90, 91, 92, 94, 95, 97,
        98, 98, 99, 101, 102, 104, 105, 107, 108, 109,
        111, 112, 114, 115, 116, 118, 119, 121, 122, 123,
        125, 126, 126, 128, 129, 131, 132, 133, 135, 136,
        138, 139, 140,
      ],

      int: [
        12, 13, 14, 15, 16, 17, 18, 19, 20, 22,
        23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
        33, 34, 35, 36, 37, 38, 40, 41, 42, 43,
        44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
        53, 54, 55, 56, 58, 59, 60, 61, 62, 63,
        64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
        75, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 90, 91, 93, 94,
        95, 96, 96, 97, 98, 99, 100, 101, 102, 103,
        104, 105, 106,
      ],

      will: [
        9, 10, 11, 12, 13, 14, 15, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 37, 38, 39, 40, 41,
        42, 43, 44, 45, 47, 48, 49, 50, 51, 52,
        52, 53, 54, 55, 56, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 68, 69, 70, 71, 72, 73,
        74, 74, 75, 76, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 88, 89, 90, 91, 92, 93, 94,
        95, 96, 96, 98, 99, 100, 101, 102, 103, 104,
        105, 106, 108,
      ],

      atk: [
        30, 33, 36, 40, 43, 46, 49, 53, 56, 59,
        62, 66, 69, 72, 75, 79, 82, 85, 88, 92,
        95, 98, 101, 105, 108, 111, 114, 118, 121, 124,
        127, 131, 134, 137, 140, 144, 147, 150, 153, 157,
        157, 160, 163, 166, 170, 173, 176, 179, 183, 186,
        189, 192, 196, 199, 202, 205, 209, 212, 215, 218,
        222, 222, 225, 228, 231, 235, 238, 241, 244, 248,
        251, 254, 257, 261, 264, 267, 270, 274, 277, 280,
        283, 287, 287, 290, 293, 296, 300, 303, 306, 309,
        313, 316, 319,
      ],

      hp: [
        500, 556, 612, 668, 724, 781, 837, 893, 949, 1005,
        1061, 1117, 1173, 1230, 1286, 1342, 1398, 1454, 1510, 1566,
        1622, 1679, 1735, 1791, 1847, 1903, 1959, 2015, 2071, 2128,
        2184, 2240, 2296, 2352, 2408, 2464, 2520, 2577, 2633, 2689,
        2689, 2745, 2801, 2857, 2913, 2969, 3026, 3082, 3138, 3194,
        3250, 3306, 3362, 3418, 3474, 3531, 3587, 3643, 3699, 3755,
        3811, 3811, 3867, 3923, 3980, 4036, 4092, 4148, 4204, 4260,
        4316, 4372, 4429, 4485, 4541, 4597, 4653, 4709, 4765, 4821,
        4878, 4934, 4934, 4990, 5046, 5102, 5158, 5214, 5270, 5327,
        5383, 5439, 5495,
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
      name: "선혈의 낙인",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "지능 10포인트마다 연계 스킬 영혼의 가시으로 회복하는 스킬 게이지 +1.0%, 최대 회복 50%",
    },
    {
      name: "선혈의 낙인",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "지능 10포인트마다 연계 스킬 영혼의 가시으로 회복하는 스킬 게이지 +1.5%, 최대 회복 75%",
    },
    {
      name: "선혈의 갈증",
      unlock: "Promote to E3 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "궁극기 선혈의 비이 지속되는 동안 연타 상태를 획득합니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "긍정적 피드백",
      description: "스킬을 사용하여 스킬 게이지를 회복한 후, 공격력 +10%, 10초 동안 지속, 최대 중첩 5스택.",
    },
    {
      title: "2",
      subtitle: "이념의 불씨",
      description: "민첩 +10, 지능 +10",
    },
    {
      title: "3",
      subtitle: "혼신의 협력",
      description: "궁극기 선혈의 비이 지속되는 동안, 팀 전체 공격력 +10%",
    },
    {
      title: "4",
      subtitle: "완벽한 컨디션",
      description: "궁극기 선혈의 비의 사용에 필요한 궁극기 에너지 -10%",
    },
    {
      title: "5",
      subtitle: "검의 리듬",
      description: "재능 '선혈의 갈증' 효과 강화: 연타가 궁극기 선혈의 비이 끝난 뒤에도 5초 동안 지속됩니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "흡혈 연격",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 17포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["20%", "22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "39%", "42%", "45%"] },
        { label: "일반 공격 제2단계 배율", values: ["28%", "30%", "33%", "36%", "39%", "41%", "44%", "47%", "50%", "53%", "57%", "62%"] },
        { label: "일반 공격 제3단계 배율", values: ["33%", "36%", "39%", "42%", "46%", "49%", "52%", "55%", "59%", "63%", "67%", "73%"] },
        { label: "일반 공격 제4단계 배율", values: ["50%", "54%", "59%", "64%", "69%", "74%", "79%", "84%", "89%", "95%", "103%", "111%"] },
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
        "전방으로 검을 휘둘러 열기 피해를 주고 열기 부착 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["142%", "156%", "171%", "185%", "199%", "213%", "228%", "242%", "256%", "274%", "295%", "320%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    comboSkill: {
      name: "영혼의 가시",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "불균형 상태 혹은 불균형 지점에 도달한 적이 있을 때 사용할 수 있습니다.",
        "2번 연속 찌르기를 사용하여 각 공격마다 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "9s"] },
        { label: "단계별 피해 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
        { label: "단계별 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "단계별 스킬 게이지 회복", values: ["7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5"] },
      ],
    },

    ultimate: {
      name: "선혈의 비",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "20초" },
      ],
      description: [
        "지속 시전 상태에 들어가며, 집결 신호탄 3발을 발사합니다. 발사할 때마다 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["120", "120", "120", "120", "120", "120", "120", "120", "120", "120", "120", "120"] },
        { label: "스킬 게이지 회복", values: ["58", "60", "62", "64", "66", "68", "70", "72", "74", "76", "78", "80"] },
      ],
    },
  },

 infrastructureSkills: [
  {
    name: "커피 또는 차",
    icon: `/operators/${slug}/infrastructure/skill1.webp`,
    levels: [
      {
        tier: "α",
        unlockText: "정예화 단계 1 달성 시 해제 가능",
        description: "제조실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 10% 감소",
      },
      {
        tier: "β",
        unlockText: "정예화 단계 3 달성 시 활성화 가능",
        description: "제조실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
      },
    ],
  },
  {
    name: "아이스브레이킹",
    icon: `/operators/${slug}/infrastructure/skill2.webp`,
    levels: [
      {
        tier: "β",
        unlockText: "정예화 단계 2 달성 시 해제 가능",
        description: "응접실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
      },
      {
        tier: "γ",
        unlockText: "정예화 단계 4 달성 시 활성화 가능",
        description: "응접실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
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
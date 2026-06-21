const slug = "pogranichnik";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준: 정합용 유체, 3상 나노 플레이크 칩

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
      { name: "정합용 유체", count: 6, icon: "/items/정합용 유체.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 16, icon: "/items/정합용 유체.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 36, icon: "/items/정합용 유체.webp" },
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

const POGRANICHNIK_TRUST_BONUS_COSTS = [
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

const POGRANICHNIK_TALENT_COSTS = [
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
      { name: "프로토콜 프리즘", count: 40, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 8600, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 48, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 10000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 28, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const pogranichnikOperatorDetailData = {
  slug,
  name: "포그라니치니크",
  enName: "Pogranichnik",
  rarity: 6 as const,

  element: "physical" as const,
  class: "vanguard" as const,
  weaponType: "한손검",

  mainStatLabel: "의지",
  subStatLabel: "민첩",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [12, 31, 51, 71, 91, 101],
      dex: [13, 34, 55, 77, 99, 110],
      int: [10, 28, 48, 67, 87, 97],
      will: [20, 52, 87, 121, 156, 173],
      atk: [30, 92, 157, 223, 288, 321],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
        42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
        62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
        82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
        92, 93, 94, 95, 96, 97, 98, 99, 100, 101,
      ],

      dex: [
        13, 14, 15, 16, 17, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 32, 33, 34,
        35, 36, 37, 38, 39, 40, 41, 42, 44, 45,
        46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
        67, 68, 70, 71, 72, 73, 74, 75, 76, 77,
        78, 79, 80, 82, 83, 84, 85, 86, 87, 88,
        89, 90, 91, 92, 93, 95, 96, 97, 98, 99,
        100, 101, 102, 103, 104, 105, 106, 108, 109, 110,
      ],

      int: [
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
        59, 59, 60, 61, 62, 63, 64, 65, 66, 67,
        68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
        78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
        88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
      ],

      will: [
        20, 21, 23, 25, 26, 28, 30, 32, 33, 35,
        37, 39, 40, 42, 44, 45, 47, 49, 51, 52,
        54, 56, 57, 59, 61, 63, 64, 66, 68, 70,
        71, 73, 75, 76, 78, 80, 82, 83, 85, 87,
        88, 90, 92, 94, 95, 97, 99, 100, 102, 104,
        106, 107, 109, 111, 113, 114, 116, 118, 119, 121,
        123, 125, 126, 128, 130, 131, 133, 135, 137, 138,
        140, 142, 143, 145, 147, 149, 150, 152, 154, 156,
        157, 159, 161, 162, 164, 166, 168, 169, 171, 173,
      ],

      atk: [
        30, 33, 37, 40, 43, 46, 50, 53, 56, 59,
        63, 66, 69, 72, 76, 79, 82, 85, 89, 92,
        95, 99, 102, 105, 108, 112, 115, 118, 121, 125,
        128, 131, 134, 138, 141, 144, 148, 151, 154, 157,
        161, 164, 167, 170, 174, 177, 180, 183, 187, 190,
        193, 196, 200, 203, 206, 210, 213, 216, 219, 223,
        226, 229, 232, 236, 239, 242, 245, 249, 252, 255,
        259, 262, 265, 268, 272, 275, 278, 281, 285, 288,
        291, 294, 298, 301, 304, 307, 311, 314, 317, 321,
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
        { name: "초거리 빛 반사 파이프", count: 20, icon: "/items/초거리 빛 반사 파이프.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/items/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  skills: {
    normalAttack: {
      name: "전면 공세",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 18포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["23%", "25%", "28%", "30%", "32%", "35%", "37%", "39%", "41%", "44%", "48%", "52%"] },
        { label: "일반 공격 제2단계 배율", values: ["28%", "31%", "34%", "36%", "39%", "42%", "45%", "48%", "50%", "54%", "58%", "63%"] },
        { label: "일반 공격 제3단계 배율", values: ["33%", "36%", "40%", "43%", "46%", "50%", "53%", "56%", "59%", "64%", "68%", "74%"] },
        { label: "일반 공격 제4단계 배율", values: ["38%", "42%", "46%", "50%", "53%", "57%", "61%", "65%", "69%", "73%", "79%", "86%"] },
        { label: "일반 공격 제5단계 배율", values: ["43%", "47%", "52%", "56%", "60%", "65%", "69%", "73%", "77%", "83%", "89%", "97%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "전선 분쇄",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "전방 범위 내의 적에게 두 번의 베기 공격을 진행합니다. 물리 피해와 갑옷 파괴 피해를 주며, 소모한 방어 불능 스택 수치에 따라 스킬 게이지를 회복합니다. 여러 목표를 명중했을 경우, 1회만 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "제1단계 피해 배율", values: ["86%", "94%", "103%", "111%", "120%", "128%", "137%", "145%", "154%", "165%", "177%", "192%"] },
        { label: "제1단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "제2단계 피해 배율", values: ["106%", "116%", "127%", "137%", "148%", "158%", "169%", "180%", "190%", "203%", "219%", "238%"] },
        { label: "제2단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "방어 불능 1스택 소모 시 회복하는 스킬 게이지", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "방어 불능 2스택 소모 시 회복하는 스킬 게이지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "15", "15", "15"] },
        { label: "방어 불능 3스택 소모 시 회복하는 스킬 게이지", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "25", "25", "25"] },
        { label: "방어 불능 4스택 소모 시 회복하는 스킬 게이지", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "35", "35", "35"] },
      ],
    },

    comboSkill: {
      name: "보름달 참격",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적이 강타 혹은 갑옷 파괴 피해로 인해 방어 불능 스택 수치를 소모한 후 사용할 수 있습니다.",
        "소모한 최대 방어 불능 스택 수치에 따라, 적에게 동일 단계의 베기 공격(최대 3단계)을 하여 물리 피해를 주고, 일정량의 스킬 게이지를 회복하며 베기 공격마다 주는 피해와 스킬 게이지 회복 효과가 증가합니다.",
        "만약 방어 불능 4스택을 소모할 경우, 3단계 베기 공격이 강화됩니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "17s"] },
        { label: "제1단계 피해 배율", values: ["42%", "46%", "50%", "55%", "59%", "63%", "67%", "71%", "76%", "81%", "87%", "95%"] },
        { label: "제1단계 불균형치", values: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"] },
        { label: "제1단계 스킬 게이지 회복", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "제2단계 피해 배율", values: ["54%", "59%", "65%", "70%", "76%", "81%", "86%", "92%", "97%", "104%", "112%", "122%"] },
        { label: "제2단계 불균형치", values: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"] },
        { label: "제2단계 스킬 게이지 회복", values: ["7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "7"] },
        { label: "제3단계 피해 배율", values: ["66%", "73%", "79%", "86%", "92%", "99%", "106%", "112%", "119%", "127%", "137%", "149%"] },
        { label: "제3단계 불균형치", values: ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4"] },
        { label: "제3단계 스킬 게이지 회복", values: ["13", "13", "13", "13", "13", "13", "13", "13", "13", "13", "13", "13"] },
        { label: "제3단계 피해 배율 강화", values: ["132%", "145%", "158%", "172%", "185%", "198%", "211%", "224%", "238%", "254%", "274%", "297%"] },
        { label: "제3단계 불균형치 강화", values: ["9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9"] },
        { label: "제3단계 스킬 게이지 회복 강화", values: ["23", "23", "23", "23", "23", "23", "23", "23", "23", "23", "23", "23"] },
      ],
    },

    ultimate: {
      name: "방패병 부대, 전진",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "10s" },
      ],
      description: [
        "목표를 중심으로 방패병 네 명을 소환해 목표를 향해 진군시킵니다. 진군 경로의 적들을 목표 방향으로 밀쳐내며 물리 피해를 주고 철의 서약 5포인트를 생성합니다. 적이 물리 이상 효과를 받거나, 포그라니치니크의 연계 스킬이 주는 피해를 받은 후, 철의 서약 1포인트를 소모해 방패병 한 명을 추가 소환하여 대상을 교란하며 물리 피해를 주고, 일정량의 스킬 게이지를 회복합니다. 소모한 철의 서약이 마지막 1포인트일 때, 방패병 네 명이 최후의 승부를 사용하며, 대상에게 대량의 물리 피해를 주고 대량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90"] },
        { label: "철의 서약 지속 시간", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
        { label: "진군 피해 배율", values: ["133%", "147%", "160%", "173%", "186%", "200%", "213%", "226%", "240%", "256%", "276%", "300%"] },
        { label: "진군 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "교란 피해 배율", values: ["45%", "49%", "53%", "58%", "62%", "67%", "71%", "76%", "80%", "86%", "92%", "100%"] },
        { label: "교란 스킬 게이지 회복", values: ["7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "7.5", "10", "10", "10"] },
        { label: "최후의 승부 피해 배율", values: ["200%", "220%", "240%", "260%", "280%", "300%", "320%", "340%", "360%", "385%", "415%", "450%"] },
        { label: "최후의 승부 불균형치", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
        { label: "최후의 승부 스킬 게이지 회복", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "40", "40", "40"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "전선 소탕",
      description: "배틀 스킬 전선 분쇄가 두 명 이상의 적에게 명중했을 때, 반환하는 스킬 게이지 15포인트",
    },
    {
      title: "2",
      subtitle: "'행군'",
      description: "의지 +20, 주는 물리 피해 +10%",
    },
    {
      title: "3",
      subtitle: "휘날리는 전장의 깃발",
      description: "재능 '생존의 깃발' 효과 강화: 사기 격양의 획득에 필요한 스킬 게이지 회복량이 60포인트로 감소합니다. 자신의 사기 격양 최대 중첩 스택 수치 +2",
    },
    {
      title: "4",
      subtitle: "탈로스 II의 방패",
      description: "궁극기 방패병 부대, 전진의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "새로 단조한 검날",
      description: "연계 스킬 보름달 참격의 쿨타임이 -2초, 스킬 게이지 회복량이 기존의 1.2배로 변경됩니다.",
    },
  ],

  talents: [
    {
      name: "생존의 깃발",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "전투 중, 자신의 스킬로 스킬 게이지를 80포인트 회복할 때마다 20초 동안 사기 격양을 획득합니다. 사기 격양 효과: 공격력 +4%, 오리지늄 아츠 강도 +4\n해당 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 시간은 따로 계산됩니다.",
    },
    {
      name: "생존의 깃발",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "전투 중, 자신의 스킬로 스킬 게이지를 80포인트 회복할 때마다 20초 동안 사기 격양을 획득합니다. 사기 격양 효과: 공격력 +8%, 오리지늄 아츠 강도 +8\n해당 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 시간은 따로 계산됩니다.",
    },
    {
      name: "전술 지도",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "임의의 오퍼레이터가 궁극기 방패병 부대, 전진의 후속 효과를 발동하면, 5초 동안 지속되는 사기 격양 상태를 획득합니다.\n재능: '생존의 깃발'을 활성화 해야 합니다.",
    },
    {
      name: "전술 지도",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "임의의 오퍼레이터가 궁극기 방패병 부대, 전진의 후속 효과를 발동하면, 10초 동안 지속되는 사기 격양 상태를 획득합니다.\n재능: '생존의 깃발'을 활성화 해야 합니다.",
    },
  ],

  infrastructureSkills: [
    {
      name: "무기 정비",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "제조실에 배치 시, 무기 경험치 재료의 생산 효율 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "제조실에 배치 시, 무기 경험치 재료의 생산 효율 30% 증가",
        },
      ],
    },
    {
      name: "사기충천",
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
    { level: 1, label: "의지 +10" },
    { level: 2, label: "의지 +15" },
    { level: 3, label: "의지 +15" },
    { level: 4, label: "의지 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: POGRANICHNIK_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: POGRANICHNIK_TALENT_COSTS,
  },
} as const;
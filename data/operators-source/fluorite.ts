const slug = "fluorite";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준:
// 앞 핵심 재료 = 타키온 차폐 구조체
// 뒤 핵심 재료 = 정합용 유체

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
      { name: "타키온 차폐 구조체", count: 6, icon: "/items/타키온 차폐 구조체.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 16, icon: "/items/타키온 차폐 구조체.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/items/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 36, icon: "/items/타키온 차폐 구조체.webp" },
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

const FLUORITE_TALENT_COSTS = [
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

export const fluoriteOperatorDetailData = {
  slug,
  name: "플루라이트",
  enName: "Fluorite",
  rarity: 4 as const,

  element: "nature" as const,
  class: "caster" as const,
  weaponType: "권총",

  mainStatLabel: "민첩",
  subStatLabel: "지능",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [14, 30, 47, 64, 81, 90],
      dex: [14, 47, 81, 116, 150, 168],
      int: [12, 34, 57, 80, 103, 114],
      will: [10, 27, 45, 64, 82, 91],
      atk: [30, 88, 150, 211, 272, 303],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        14, 14, 15, 16, 17, 18, 19, 20, 20, 21,
        22, 23, 24, 25, 26, 26, 27, 28, 29, 30,
        31, 32, 32, 33, 34, 35, 36, 37, 38, 38,
        39, 40, 41, 42, 43, 44, 44, 45, 46, 47,
        48, 49, 50, 50, 51, 52, 53, 54, 55, 56,
        56, 57, 58, 59, 60, 61, 61, 62, 63, 64,
        65, 66, 67, 67, 68, 69, 70, 71, 72, 73,
        73, 74, 75, 76, 77, 78, 79, 79, 80, 81,
        81, 82, 83, 84, 85, 85, 86, 87, 88, 89, 90,
      ],

      dex: [
        14, 16, 18, 19, 21, 23, 25, 26, 28, 30,
        31, 33, 35, 37, 38, 40, 42, 44, 45, 47,
        49, 50, 52, 54, 56, 57, 59, 61, 62, 64,
        66, 68, 69, 71, 73, 75, 76, 78, 80, 81,
        83, 85, 87, 88, 90, 92, 94, 95, 97, 99,
        100, 102, 104, 106, 107, 109, 111, 112, 114, 116,
        118, 119, 121, 123, 125, 126, 128, 130, 131, 133,
        135, 137, 138, 140, 142, 144, 145, 147, 149, 150,
        152, 154, 156, 157, 159, 161, 163, 164, 166, 168,
      ],

      int: [
        12, 13, 14, 15, 17, 18, 19, 20, 21, 22,
        23, 25, 26, 27, 28, 29, 30, 31, 33, 34,
        35, 36, 37, 38, 40, 41, 42, 43, 44, 45,
        46, 48, 49, 50, 51, 52, 53, 54, 56, 57,
        58, 59, 60, 61, 62, 64, 65, 66, 67, 68,
        69, 70, 72, 73, 74, 75, 76, 77, 79, 80,
        81, 82, 83, 84, 85, 87, 88, 89, 90, 91,
        92, 93, 95, 96, 97, 98, 99, 100, 101, 103,
        104, 105, 106, 107, 108, 110, 111, 112, 113, 114,
      ],

      will: [
        10, 11, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 22, 23, 24, 25, 26, 27,
        28, 29, 30, 31, 32, 33, 34, 34, 35, 36,
        37, 38, 39, 40, 41, 42, 43, 44, 45, 45,
        46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 56, 57, 58, 59, 60, 61, 62, 63, 64,
        65, 66, 67, 68, 68, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 78, 79, 79, 80, 81, 82,
        82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
      ],

      atk: [
        30, 33, 36, 39, 42, 45, 48, 51, 55, 58,
        61, 64, 67, 70, 73, 76, 79, 82, 85, 88,
        91, 94, 97, 101, 104, 107, 110, 113, 116, 119,
        122, 125, 128, 131, 134, 137, 140, 143, 147, 150,
        153, 156, 159, 162, 165, 168, 171, 174, 177, 180,
        183, 186, 189, 193, 196, 199, 202, 205, 208, 211,
        214, 217, 220, 223, 226, 229, 232, 235, 238, 242,
        245, 248, 251, 254, 257, 260, 263, 266, 269, 272,
        275, 278, 281, 284, 288, 291, 294, 297, 300, 303,
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
        { name: "3상 나노 플레이크 칩", count: 20, icon: "/items/3상 나노 플레이크 칩.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/items/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  talents: [
    {
      name: "몰락의 조력자",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "플루라이트가 감속 상태의 목표에 주는 피해 +10%",
    },
    {
      name: "몰락의 조력자",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "플루라이트가 감속 상태의 목표에 주는 피해 +20%",
    },
    {
      name: "종잡을 수 없는 자",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "20%의 확률로 아츠 피해 면역, 이후 자기 공격력 +10%, 10초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "종잡을 수 없는 자",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "20%의 확률로 아츠 피해 면역, 이후 자기 공격력 +20%, 10초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "양손의 달인",
      description: "민첩 +10, 지능 +10",
    },
    {
      title: "2",
      subtitle: "독심술",
      description: "재능 '종잡을 수 없는 자' 효과 강화: 아츠 피해 면역 확률 +10%",
    },
    {
      title: "3",
      subtitle: "트리플 서프라이즈",
      description: "배틀 스킬 서프라이즈?로 인해 점착된 수제 폭탄이 폭발한 후, 감속 효과가 명중 당한 모든 적에게로 확산됩니다. 해당 효과는 6초 동안 지속됩니다.",
    },
    {
      title: "4",
      subtitle: "혼란 유발자",
      description: "궁극기 난장판으로 만들어주지의 사용에 필요한 궁극기 에너지 -10%",
    },
    {
      title: "5",
      subtitle: "혼돈의 쾌락",
      description: "적이 냉기 부착 혹은 자연 부착을 부여받을 때마다, 연계 스킬 특별 보너스의 쿨타임 -1초. 해당 효과는 1초마다 최대 1회만 발동합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "독자적인 사격술",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 자연 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 15포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 자연 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 자연 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["25%", "28%", "30%", "33%", "35%", "38%", "40%", "43%", "45%", "48%", "52%", "56%"] },
        { label: "일반 공격 제2단계 배율", values: ["33%", "36%", "39%", "42%", "46%", "49%", "52%", "55%", "59%", "63%", "67%", "73%"] },
        { label: "일반 공격 제3단계 배율", values: ["26%", "28%", "31%", "33%", "36%", "38%", "41%", "43%", "46%", "49%", "53%", "57%"] },
        { label: "일반 공격 제4단계 배율", values: ["60%", "66%", "72%", "78%", "84%", "90%", "96%", "102%", "108%", "116%", "125%", "135%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "서프라이즈?",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "수제 폭탄을 걷어차서 목표에 붙이고, 감속 상태를 부여합니다. 일정 시간 뒤 폭탄이 폭발하여 범위 내의 적에게 자연 피해를 주고, 자연 부착 상태를 부여합니다. 폭탄이 붙은 목표가 처치될 경우, 해당 수제 폭탄은 즉시 폭발합니다.",
        "전장에는 동시에 단 하나의 수제 폭탄만 존재할 수 있습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["187%", "206%", "224%", "243%", "262%", "280%", "299%", "318%", "336%", "360%", "388%", "420%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "감속 효과", values: ["30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%"] },
      ],
    },

    comboSkill: {
      name: "특별 보너스",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적에게 냉기 부착 혹은 자연 부착 2스택 또는 그 이상이 쌓였을 때 사용할 수 있습니다.",
        "목표한 적을 사격해 특수한 폭발을 일으키고, 자연 피해를 주며 아츠 부착 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["40s", "40s", "40s", "40s", "40s", "40s", "40s", "40s", "40s", "40s", "40s", "38s"] },
        { label: "피해 배율", values: ["169%", "186%", "203%", "220%", "237%", "254%", "270%", "287%", "304%", "325%", "351%", "380%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "난장판으로 만들어주지",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "10초" },
      ],
      description: [
        "플루라이트가 아치형 궤적을 따라 고속으로 이동하며, 궤적 내의 목표를 향해 빠르게 사격하여 4단 자연 피해를 줍니다. 명중당한 목표에 수제 폭탄이 붙어있을 경우, 즉시 폭발하며 폭발 피해와 범위가 증가합니다.",
        "마지막 공격이 2스택 혹은 그 이상의 냉기 부착 또는 자연 부착 상태인 적을 명중하면, 해당 아츠 부착을 다시 한번 더 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "제1단계 피해 배율", values: ["111%", "122%", "133%", "144%", "156%", "167%", "178%", "189%", "200%", "214%", "231%", "250%"] },
        { label: "제2단계 피해 배율", values: ["111%", "122%", "133%", "144%", "156%", "167%", "178%", "189%", "200%", "214%", "231%", "250%"] },
        { label: "제3단계 피해 배율", values: ["111%", "122%", "133%", "144%", "156%", "167%", "178%", "189%", "200%", "214%", "231%", "250%"] },
        { label: "제4단계 피해 배율", values: ["111%", "122%", "133%", "144%", "156%", "167%", "178%", "189%", "200%", "214%", "231%", "250%"] },
        { label: "배틀 스킬 범위 증가", values: ["30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%"] },
        { label: "배틀 스킬 피해 증가", values: ["30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%"] },
        { label: "불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
      ],
    },
  },

  infrastructureSkills: [
    {
      name: "황무지의 방랑자",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "재배실에 배치 시, 광물 재료의 육성 속도 10% 증가",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "재배실에 배치 시, 광물 재료의 육성 속도 20% 증가",
        },
      ],
    },
    {
      name: "통찰의 기술",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 12% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 16% 증가",
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
    talents: FLUORITE_TALENT_COSTS,
  },
} as const;
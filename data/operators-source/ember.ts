const slug = "ember";

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

const EMBER_TALENT_COSTS = [
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

export const emberOperatorDetailData = {
  slug,
  name: "엠버",
  enName: "Ember",
  rarity: 6 as const,

  element: "heat" as const,
  class: "defender" as const,
  weaponType: "양손검",

  mainStatLabel: "힘",
  subStatLabel: "의지",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [21, 54, 89, 124, 159, 176],
      dex: [9, 28, 47, 67, 87, 96],
      int: [8, 25, 42, 60, 77, 86],
      will: [13, 36, 60, 84, 108, 120],
      atk: [30, 93, 159, 225, 291, 323],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        21, 23, 25, 26, 28, 30, 32, 33, 35, 37,
        39, 40, 42, 44, 45, 47, 49, 51, 52, 54,
        56, 58, 59, 61, 63, 65, 66, 68, 70, 72,
        73, 75, 77, 79, 80, 82, 84, 85, 87, 89,
        91, 92, 94, 96, 98, 99, 101, 103, 105, 106,
        108, 110, 112, 113, 115, 117, 119, 120, 122, 124,
        125, 127, 129, 131, 132, 134, 136, 138, 139, 141,
        143, 145, 146, 148, 150, 152, 153, 155, 157, 159,
        160, 162, 164, 165, 167, 169, 171, 172, 174, 176,
      ],

      dex: [
        9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
        68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
        78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
        88, 89, 90, 91, 92, 93, 94, 95, 95, 96,
      ],

      int: [
        8, 9, 10, 11, 12, 13, 14, 14, 15, 16,
        17, 18, 19, 20, 21, 21, 22, 23, 24, 25,
        26, 27, 28, 28, 29, 30, 31, 32, 33, 34,
        35, 35, 36, 37, 38, 39, 40, 41, 42, 42,
        43, 44, 45, 46, 47, 48, 49, 49, 50, 51,
        52, 53, 54, 55, 56, 56, 57, 58, 59, 60,
        61, 62, 63, 63, 64, 65, 66, 67, 68, 69,
        70, 70, 71, 72, 73, 74, 75, 76, 77, 77,
        78, 79, 80, 81, 82, 83, 84, 85, 85, 86,
      ],

      will: [
        13, 14, 16, 17, 18, 19, 20, 21, 23, 24,
        25, 26, 27, 29, 30, 31, 32, 33, 35, 36,
        37, 38, 39, 41, 42, 43, 44, 45, 47, 48,
        49, 50, 51, 53, 54, 55, 56, 57, 59, 60,
        61, 62, 63, 65, 66, 67, 68, 69, 71, 72,
        73, 74, 75, 77, 78, 79, 80, 81, 83, 84,
        85, 86, 87, 89, 90, 91, 92, 93, 95, 96,
        97, 98, 99, 101, 102, 103, 104, 105, 107, 108,
        109, 110, 111, 113, 114, 115, 116, 117, 119, 120,
      ],

      atk: [
        30, 33, 37, 40, 43, 46, 50, 53, 56, 60,
        63, 66, 70, 73, 76, 79, 83, 86, 89, 93,
        96, 99, 103, 106, 109, 112, 116, 119, 122, 126,
        129, 132, 136, 139, 142, 145, 149, 152, 155, 159,
        162, 165, 168, 172, 175, 178, 182, 185, 188, 192,
        195, 198, 201, 205, 208, 211, 215, 218, 221, 225,
        228, 231, 234, 238, 241, 244, 248, 251, 254, 258,
        261, 264, 267, 271, 274, 277, 281, 284, 287, 291,
        294, 297, 300, 304, 307, 310, 314, 317, 320, 323,
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

  skills: {
    normalAttack: {
      name: "돌진 검술",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 25포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["38%", "42%", "46%", "50%", "54%", "57%", "61%", "65%", "69%", "74%", "79%", "86%"] },
        { label: "일반 공격 제2단계 배율", values: ["54%", "59%", "64%", "70%", "75%", "80%", "86%", "91%", "96%", "103%", "111%", "120%"] },
        { label: "일반 공격 제3단계 배율", values: ["66%", "73%", "80%", "86%", "93%", "99%", "106%", "113%", "119%", "128%", "138%", "149%"] },
        { label: "일반 공격 제4단계 배율", values: ["82%", "90%", "98%", "106%", "114%", "122%", "131%", "139%", "147%", "157%", "169%", "184%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "진군",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "전방으로 뛰어올라 힘차게 내리찍어 부채꼴 범위 내의 모든 적에게 열기 피해와 넘어뜨리기 피해를 줍니다.",
        "이 과정에서 적에게 공격받았을 경우, 명중했을 때 추가로 불균형치 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["173%", "191%", "208%", "225%", "243%", "260%", "277%", "295%", "312%", "334%", "360%", "390%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "공격받은 후 추가로 주는 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    comboSkill: {
      name: "전선에서의 지원",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "메인 컨트롤 오퍼레이터가 공격을 받았을 때 사용할 수 있습니다.",
        "목표한 적을 향해 뛰어올라 힘차게 내리찍습니다. 물리 피해를 주고 넘어뜨리기 피해를 주며, 메인 컨트롤 오퍼레이터를 치유합니다. 의지는 치유량을 추가로 증가시킵니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["19s", "19s", "19s", "19s", "19s", "19s", "19s", "19s", "19s", "19s", "19s", "18s"] },
        { label: "피해 배율", values: ["102%", "112%", "122%", "133%", "143%", "153%", "163%", "173%", "184%", "196%", "212%", "230%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "기초 치유 수치", values: ["300", "360", "420", "480", "510", "540", "570", "600", "630", "645", "660", "675"] },
        { label: "의지 1포인트마다 증가하는 치유 수치", values: ["0.7", "0.84", "0.98", "1.12", "1.19", "1.26", "1.33", "1.4", "1.47", "1.51", "1.54", "1.58"] },
      ],
    },

    ultimate: {
      name: "다시 불타오르는 맹세",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "20s" },
      ],
      description: [
        "지면을 강타하여 주변의 적에게 열기 피해를 주고, 동시에 팀 전체에게 엠버의 최대 생명력에 따른 보호를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "피해 배율", values: ["289%", "318%", "347%", "376%", "404%", "433%", "462%", "491%", "520%", "556%", "599%", "650%"] },
        { label: "불균형치", values: ["25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25"] },
        { label: "보호 전환 비율(생명력)", values: ["18%", "18%", "18%", "20%", "20%", "20%", "22%", "22%", "22%", "25%", "25%", "25%"] },
        { label: "보호 지속 시간(초)", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "이동 요새",
      description: "재능 '전진의 결의' 효과 강화: 비호 효과 +20%, 적을 명중할 때 추가 지속 시간 1.5초",
    },
    {
      title: "2",
      subtitle: "무쇠의 전사",
      description: "힘 +20, 의지 +20",
    },
    {
      title: "3",
      subtitle: "불굴의 전선",
      description: "연계 스킬 전선에서의 지원이 팀 내 생명력 백분율이 가장 낮은 오퍼레이터 1명을 추가로 치유합니다. 해당 효과는 기초 수치의 50%만큼만 제공됩니다.",
    },
    {
      title: "4",
      subtitle: "불멸의 불꽃",
      description: "궁극기 다시 불타오르는 맹세의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "철의 서약",
      description: "궁극기 다시 불타오르는 맹세가 부여하는 보호 효과가 1.2배로 변하고, 해당 보호가 유지되는 동안, 보호를 받은 대상의 공격력 +10%.",
    },
  ],

  trustBonus: [
    { level: 1, label: "힘 +10" },
    { level: 2, label: "힘 +15" },
    { level: 3, label: "힘 +15" },
    { level: 4, label: "힘 +20" },
  ],

  infrastructureSkills: [
    {
      name: "북쪽 지역에서의 특훈",
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
      name: "전우애",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 4 - 철의 서약군을 수집할 확률 약간 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 4 - 철의 서약군을 수집할 확률 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
      ],
    },
  ],

  talents: [
    {
      name: "전진의 결의",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 진군과 연계 스킬 전선에서의 지원을 발동하는 과정에서 30%비호를 획득하고 스킬이 쉽게 끊기지 않습니다.",
    },
    {
      name: "전진의 결의",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 진군과 연계 스킬 전선에서의 지원을 발동하는 과정에서 50%비호를 획득하고 스킬이 쉽게 끊기지 않습니다.",
    },
    {
      name: "강철에는 강철로",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "적의 피해를 받은 후, 공격력 +6%, 7초 동안 지속. 해당 효과는 최대 3스택까지 중첩됩니다.",
    },
    {
      name: "강철에는 강철로",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "적의 피해를 받은 후, 공격력 +9%, 7초 동안 지속. 해당 효과는 최대 3스택까지 중첩됩니다.",
    },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: COMMON_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: EMBER_TALENT_COSTS,
  },
} as const;
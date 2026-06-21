const slug = "mifu";

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

const MIFU_TRUST_BONUS_COSTS = [
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

const MIFU_TALENT_COSTS = [
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

export const mifuOperatorDetailData = {
  slug,
  name: "미브",
  enName: "Mifu",
  rarity: 6 as const,

  element: "physical" as const,
  class: "guard" as const,
  weaponType: "양손검",

  mainStatLabel: "힘",
  subStatLabel: "의지",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [22, 54, 88, 122, 156, 173],
      dex: [10, 27, 46, 65, 83, 92],
      int: [9, 27, 45, 63, 81, 90],
      will: [14, 37, 60, 84, 107, 119],
      atk: [30, 91, 155, 219, 283, 315],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        22, 24, 25, 27, 29, 31, 32, 34, 36, 37,
        39, 41, 42, 44, 46, 48, 49, 51, 53, 54,
        56, 58, 59, 61, 63, 64, 66, 68, 70, 71,
        73, 75, 76, 78, 80, 81, 83, 85, 87, 88,
        90, 92, 93, 95, 97, 98, 100, 102, 103, 105,
        107, 109, 110, 112, 114, 115, 117, 119, 120, 122,
        124, 125, 127, 129, 131, 132, 134, 136, 137, 139,
        141, 142, 144, 146, 148, 149, 151, 153, 154, 156,
        158, 159, 161, 163, 164, 166, 168, 170, 171, 173,
      ],

      dex: [
        10, 11, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 24, 25, 26, 27,
        28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 38, 39, 40, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 50, 51, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
        75, 76, 77, 78, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 90, 91, 92, 92,
      ],

      int: [
        9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
        28, 29, 29, 30, 31, 32, 33, 34, 35, 36,
        37, 38, 39, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 49, 50, 51, 52, 53, 54,
        55, 56, 57, 58, 59, 59, 60, 61, 62, 63,
        64, 65, 66, 67, 68, 69, 69, 70, 71, 72,
        73, 74, 75, 76, 77, 78, 79, 79, 80, 81,
        82, 83, 84, 85, 86, 87, 88, 89, 89, 90,
      ],

      will: [
        14, 15, 17, 18, 19, 20, 21, 22, 24, 25,
        26, 27, 28, 30, 31, 32, 33, 34, 35, 37,
        38, 39, 40, 41, 42, 44, 45, 46, 47, 48,
        49, 51, 52, 53, 54, 55, 57, 58, 59, 60,
        61, 62, 64, 65, 66, 67, 68, 69, 71, 72,
        73, 74, 75, 76, 78, 79, 80, 81, 82, 84,
        85, 86, 87, 88, 89, 91, 92, 93, 94, 95,
        96, 98, 99, 100, 101, 102, 103, 105, 106, 107,
        108, 109, 111, 112, 113, 114, 115, 116, 118, 119,
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
        { name: "피버섯", count: 8, icon: "/items/피버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  skills: {
    normalAttack: {
      name: "검권 합일",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      meta: [{ label: "스킬 게이지 회복", value: "처형 공격 시" }],
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 25포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["34%", "37%", "41%", "44%", "47%", "51%", "54%", "57%", "61%", "65%", "70%", "76%"] },
        { label: "일반 공격 제2단계 배율", values: ["38%", "42%", "46%", "50%", "54%", "57%", "61%", "65%", "69%", "74%", "79%", "86%"] },
        { label: "일반 공격 제3단계 배율", values: ["61%", "67%", "73%", "79%", "85%", "91%", "97%", "103%", "109%", "116%", "126%", "136%"] },
        { label: "일반 공격 제4단계 배율", values: ["77%", "84%", "92%", "99%", "107%", "115%", "122%", "130%", "138%", "147%", "159%", "172%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
      ],
    },

    battleSkill: {
      name: "청파 삼형",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [
        { label: "단운 스킬 게이지 소모", value: 100 },
        { label: "추형/개천 스킬 게이지 소모", value: 50 },
      ],
      description: [
        "연속으로 사용하면 최대 3가지의 서로 다른 형태의 초식을 사용할 수 있습니다. 가장 처음 사용할 수 있는 배틀 스킬은 단운입니다.",
        "단운: 100 스킬 게이지를 소모하고, 사용 후 50 스킬 게이지를 반환합니다. 권갑에서 포승줄을 발사하여 목표 및 그 주변의 다른 적에게 물리 피해를 주고, 자기 쪽으로 끌어오기를 시도합니다. 사용 후, 배틀 스킬은 일정 시간 내에 추형으로 교체됩니다.",
        "추형: 50 스킬 게이지를 소모합니다. 전방으로 주먹을 연속으로 휘둘러 물리 피해를 주며, 마지막 일격은 추가로 강타 피해를 줍니다. 만약 이번 강타로 소모한 최대 방어 불능 스택 수치가 3스택 이상일 경우, 배틀 스킬은 일정 시간 내에 개천으로 교체됩니다.",
        "개천: 50 스킬 게이지를 소모하여 전방 범위에 대량의 물리 피해를 줍니다. 이번 피해의 유형은 배틀 스킬 피해가 아니며 강타 피해로 간주됩니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "단운 피해 배율", values: ["67%", "73%", "80%", "87%", "93%", "100%", "107%", "113%", "120%", "128%", "138%", "150%"] },
        { label: "추형 피해 배율", values: ["89%", "98%", "107%", "116%", "125%", "134%", "143%", "151%", "160%", "172%", "185%", "200%"] },
        { label: "추형 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "개천 피해 배율", values: ["400%", "416%", "432%", "448%", "464%", "480%", "496%", "512%", "528%", "548%", "572%", "600%"] },
        { label: "개천 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    comboSkill: {
      name: "후회 없는 주먹",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [
        { label: "쿨타임", valueRowLabel: "쿨타임" },
        { label: "발동 조건", value: "방어 불능 3스택 이상" },
      ],
      description: [
        "적의 방어 불능 수치가 3스택 및 그 이상에 도달했을 때, 사용할 수 있습니다.",
        "올려치기로 전방의 적을 공격해 물리 피해를 주며, 동시에 일정 시간 동안 물리 취약을 부여합니다. 사용 후, 배틀 스킬은 일정 시간 내에 추형으로 교체됩니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "19s"] },
        { label: "피해 배율", values: ["111%", "122%", "133%", "144%", "155%", "167%", "178%", "189%", "200%", "214%", "230%", "250%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "물리 취약 효과", values: ["5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%"] },
        { label: "물리 취약 지속 시간(초)", values: ["16", "16", "16", "16", "16", "16", "16", "16", "16", "16", "16", "16"] },
        { label: "획득하는 궁극기 에너지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "절심",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [{ label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" }],
      description: [
        "잠시 차지한 뒤 전방으로 돌진해 전방의 목표에 강제로 띄우기 피해를 주고, 이어서 지면에 내리꽂아 강제로 넘어뜨리며, 동시에 물리 피해를 줍니다. 사용 후 일정 시간 동안 배틀 스킬이 추형으로 대체됩니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80"] },
        { label: "피해 배율", values: ["311%", "342%", "373%", "404%", "435%", "466%", "498%", "529%", "560%", "599%", "645%", "700%"] },
        { label: "불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "영원한 순례",
      description: "연계 스킬 후회 없는 주먹의 쿨타임 -2초, 부여하는 물리 취약 효과 추가로 +5%, 지속 시간 +4초.",
    },
    { title: "2", subtitle: "심신일체", description: "힘 +20, 오리지늄 아츠 강도 +16." },
    {
      title: "3",
      subtitle: "전투 태세",
      description:
        "재능 분노 효과 강화: 보호 지속 시간 +5초, 보호 발동 간격 -15초, 매번 발동할 때마다 추가로 공격력 +6%, 지속 시간 20초.",
    },
    { title: "4", subtitle: "삼절의 극의", description: "궁극기 절심의 사용에 필요한 궁극기 에너지 -15%." },
    {
      title: "5",
      subtitle: "숲을 가르는 주먹",
      description:
        "배틀 스킬 단운, 추형, 개천의 피해 배율이 모두 기존의 1.1배로 증가, 궁극기 절심이 주는 불균형치 +5포인트. 배틀 스킬 배율 증가 효과는 재능 냉정과 중첩됩니다.",
    },
  ],

  trustBonus: [
    { level: 1, label: "+10 힘" },
    { level: 2, label: "+15 힘" },
    { level: 3, label: "+15 힘" },
    { level: 4, label: "+20 힘" },
  ],

  infrastructureSkills: [
    {
      name: "은밀한 시선",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 3 - 홍산 과학원을 수집할 확률 약간 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 3 - 홍산 과학원을 수집할 확률 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
      ],
    },
    {
      name: "약초 요법",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "재배실에 배치 시, 버섯 재료의 육성 속도 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "재배실에 배치 시, 버섯 재료의 육성 속도 30% 증가",
        },
      ],
    },
  ],

  talents: [
    {
      name: "냉정",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "배틀 스킬 개천이 명중했을 때, 만약 목표가 물리 취약 또는 불균형 상태에 빠질 경우, 피해 배율이 기존의 1.1배로 증가합니다.",
    },
    {
      name: "냉정",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "배틀 스킬 개천이 명중했을 때, 만약 목표가 물리 취약 또는 불균형 상태에 빠질 경우, 피해 배율이 기존의 1.2배로 증가합니다.",
    },
    {
      name: "분노",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "연계 스킬 사용 후, 최대 생명력 15%만큼의 보호를 획득합니다. 해당 효과가 지속되는 동안 행동이 더 쉽게 끊이지 않으며, 10초 동안 지속됩니다.\n해당 효과는 60초마다 최대 1회 발동합니다.",
    },
    {
      name: "분노",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "연계 스킬 사용 후, 최대 생명력 30%만큼의 보호를 획득합니다. 해당 효과가 지속되는 동안 행동이 더 쉽게 끊이지 않으며, 10초 동안 지속됩니다.\n해당 효과는 60초마다 최대 1회 발동합니다.",
    },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: MIFU_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: MIFU_TALENT_COSTS,
  },
} as const;

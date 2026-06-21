const slug = "lifeng";

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

const LIFENG_TRUST_BONUS_COSTS = [
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

const LIFENG_TALENT_COSTS = [
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

export const lifengOperatorDetailData = {
  slug,
  name: "여풍",
  enName: "Lifeng",
  rarity: 6 as const,

  element: "physical" as const,
  class: "guard" as const,
  weaponType: "장병기",

  mainStatLabel: "민첩",
  subStatLabel: "힘",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [14, 38, 62, 86, 111, 123],
      dex: [20, 44, 69, 94, 119, 132],
      int: [13, 35, 58, 81, 104, 115],
      will: [12, 35, 58, 82, 105, 117],
      atk: [30, 90, 153, 217, 280, 312],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        14, 15, 17, 18, 19, 20, 22, 23, 24, 25,
        26, 28, 29, 30, 31, 33, 34, 35, 36, 38,
        39, 40, 41, 42, 44, 45, 46, 47, 49, 50,
        51, 52, 53, 55, 56, 57, 58, 60, 61, 62,
        63, 64, 66, 67, 68, 69, 71, 72, 73, 74,
        75, 77, 78, 79, 80, 82, 83, 84, 85, 86,
        88, 89, 90, 91, 93, 94, 95, 96, 97, 99,
        100, 101, 102, 104, 105, 106, 107, 109, 110, 111,
        112, 113, 115, 116, 117, 118, 120, 121, 122, 123,
      ],

      dex: [
        20, 21, 22, 23, 25, 26, 27, 28, 30, 31,
        32, 33, 35, 36, 37, 39, 40, 41, 42, 44,
        45, 46, 47, 49, 50, 51, 52, 54, 55, 56,
        57, 59, 60, 61, 62, 64, 65, 66, 68, 69,
        70, 71, 73, 74, 75, 76, 78, 79, 80, 81,
        83, 84, 85, 86, 88, 89, 90, 91, 93, 94,
        95, 96, 98, 99, 100, 102, 103, 104, 105, 107,
        108, 109, 110, 112, 113, 114, 115, 117, 118, 119,
        120, 122, 123, 124, 125, 127, 128, 129, 131, 132,
      ],

      int: [
        13, 14, 15, 16, 17, 19, 20, 21, 22, 23,
        24, 26, 27, 28, 29, 30, 31, 32, 34, 35,
        36, 37, 38, 39, 40, 42, 43, 44, 45, 46,
        47, 48, 50, 51, 52, 53, 54, 55, 56, 58,
        59, 60, 61, 62, 63, 65, 66, 67, 68, 69,
        70, 71, 73, 74, 75, 76, 77, 78, 79, 81,
        82, 83, 84, 85, 86, 87, 89, 90, 91, 92,
        93, 94, 95, 97, 98, 99, 100, 101, 102, 104,
        105, 106, 107, 108, 109, 110, 112, 113, 114, 115,
      ],

      will: [
        12, 14, 15, 16, 17, 18, 19, 21, 22, 23,
        24, 25, 26, 28, 29, 30, 31, 32, 34, 35,
        36, 37, 38, 39, 41, 42, 43, 44, 45, 46,
        48, 49, 50, 51, 52, 54, 55, 56, 57, 58,
        59, 61, 62, 63, 64, 65, 66, 68, 69, 70,
        71, 72, 73, 75, 76, 77, 78, 79, 81, 82,
        83, 84, 85, 86, 88, 89, 90, 91, 92, 93,
        95, 96, 97, 98, 99, 101, 102, 103, 104, 105,
        106, 108, 109, 110, 111, 112, 113, 115, 116, 117,
      ],

      atk: [
        30, 33, 36, 39, 43, 46, 49, 52, 55, 58,
        62, 65, 68, 71, 74, 77, 81, 84, 87, 90,
        93, 96, 100, 103, 106, 109, 112, 115, 119, 122,
        125, 128, 131, 134, 138, 141, 144, 147, 150, 153,
        157, 160, 163, 166, 169, 172, 176, 179, 182, 185,
        188, 191, 195, 198, 201, 204, 207, 210, 214, 217,
        220, 223, 226, 229, 233, 236, 239, 242, 245, 248,
        252, 255, 258, 261, 264, 267, 271, 274, 277, 280,
        283, 286, 290, 293, 296, 299, 302, 305, 309, 312,
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
        { name: "피버섯", count: 8, icon: "/items/피버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  skills: {
    normalAttack: {
      name: "업보 파괴",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 19포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["24%", "27%", "29%", "32%", "34%", "36%", "39%", "41%", "44%", "47%", "50%", "55%"] },
        { label: "일반 공격 제2단계 배율", values: ["29%", "32%", "35%", "38%", "41%", "44%", "47%", "49%", "52%", "56%", "60%", "65%"] },
        { label: "일반 공격 제3단계 배율", values: ["35%", "39%", "42%", "46%", "49%", "53%", "56%", "60%", "63%", "67%", "73%", "79%"] },
        { label: "일반 공격 제4단계 배율", values: ["68%", "74%", "81%", "88%", "95%", "101%", "108%", "115%", "122%", "130%", "140%", "152%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "신체 정화",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "전방으로 창을 여러 번 휘둘러 2회의 물리 피해를 줍니다. 이후 힘차게 지면을 내리쳐 전방 모든 적에게 다시 물리 피해와 넘어뜨리기 피해를 줍니다.",
        "마지막 공격에 명중한 적이 방어 불능 상태가 아닐 경우, 추가로 대상에게 물리 취약 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "제1단계 피해 배율", values: ["38%", "42%", "46%", "50%", "53%", "57%", "61%", "65%", "69%", "73%", "79%", "86%"] },
        { label: "제2단계 피해 배율", values: ["38%", "42%", "46%", "50%", "53%", "57%", "61%", "65%", "69%", "73%", "79%", "86%"] },
        { label: "제3단계 피해 배율", values: ["119%", "131%", "143%", "155%", "167%", "178%", "190%", "202%", "214%", "229%", "247%", "268%"] },
        { label: "제3단계 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "물리 취약 효과", values: ["5%", "5%", "5%", "5%", "5%", "7%", "7%", "7%", "9%", "10%", "10%", "12%"] },
        { label: "물리 취약 지속 시간(초)", values: ["12", "12", "12", "12", "12", "12", "12", "12", "12", "12", "12", "12"] },
      ],
    },

    comboSkill: {
      name: "분노의 형상",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "물리 취약 또는 갑옷 파괴 상태의 적이 메인 컨트롤 오퍼레이터의 강력한 일격을 받았을 때 사용할 수 있습니다.",
        "화신을 내세워 장창으로 찌르며, 물리 피해를 주고 연타를 획득합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["16s", "16s", "16s", "16s", "16s", "16s", "16s", "16s", "16s", "16s", "16s", "15s"] },
        { label: "제1단계 피해 배율", values: ["47%", "51%", "56%", "61%", "65%", "70%", "75%", "79%", "84%", "90%", "97%", "105%"] },
        { label: "제2단계 피해 배율", values: ["167%", "183%", "200%", "217%", "233%", "250%", "267%", "283%", "300%", "321%", "346%", "375%"] },
        { label: "제2단계 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "연타 지속 시간(초)", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
      ],
    },

    ultimate: {
      name: "움직이지 않는 마음",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "15s" },
      ],
      description: [
        "화신을 내세워 부동저로 지면을 힘껏 내리칩니다. 넓은 범위 내의 모든 적에게 물리 피해와 넘어뜨리기 피해를 주며, 모든 적을 중심으로 향해 끌어당깁니다. 일정 시간 후, 여전히 타격 범위 내에 남아 있는 모든 적에게는 다시 대량의 물리 피해와 넘어뜨리기 피해를 줍니다.",
        "해당 스킬이 연타를 소모했다면, 대량의 추가 물리 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90"] },
        { label: "제1단계 피해 배율", values: ["178%", "196%", "213%", "231%", "249%", "267%", "284%", "302%", "320%", "342%", "369%", "400%"] },
        { label: "제1단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "제2단계 피해 배율", values: ["178%", "196%", "213%", "231%", "249%", "267%", "284%", "302%", "320%", "342%", "369%", "400%"] },
        { label: "제2단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "추가 피해 배율", values: ["267%", "294%", "320%", "347%", "374%", "400%", "427%", "454%", "480%", "514%", "554%", "600%"] },
        { label: "추가 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "파집",
      description:
        "배틀 스킬 신체 정화가 부여하는 물리 취약 효과 +5%, 방어 불능 스택 수치가 2스택을 초과하지 않은 적에게도 이 추가 효과가 발동합니다.",
    },
    {
      title: "2",
      subtitle: "수신",
      description: "모든 능력치 +15",
    },
    {
      title: "3",
      subtitle: "양성",
      description: "재능 '돈오' 효과 강화: 지능 및 의지 1포인트당 추가 공격력 +0.05%",
    },
    {
      title: "4",
      subtitle: "찰나",
      description: "궁극기 움직이지 않는 마음의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "불해",
      description:
        "재능 '복마' 효과 강화: 15초마다, 다음 효과 발동 시 공격력 250%만큼 추가 물리 피해를 주고, 5포인트의 불균형 피해를 줍니다.",
    },
  ],

  trustBonus: [
    { level: 1, label: "민첩 +10" },
    { level: 2, label: "민첩 +15" },
    { level: 3, label: "민첩 +15" },
    { level: 4, label: "민첩 +20" },
  ],

  infrastructureSkills: [
    {
      name: "소년의 기개",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 12% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 16% 증가",
        },
      ],
    },
    {
      name: "조숙한 아이",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description:
            "응접실에 배치 시, 오퍼레이터가 단서 3 - 홍산 과학원을 수집할 확률 약간 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description:
            "응접실에 배치 시, 오퍼레이터가 단서 3 - 홍산 과학원을 수집할 확률 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
      ],
    },
  ],

  talents: [
    {
      name: "돈오",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "지능 및 의지 1포인트당 추가 공격력 +0.10%",
    },
    {
      name: "돈오",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "지능 및 의지 1포인트당 추가 공격력 +0.15%",
    },
    {
      name: "복마",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "적에게 넘어뜨리기 피해를 줄 때마다, 추가로 자신의 공격력 50%의 물리 피해를 줍니다.",
    },
    {
      name: "복마",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "적에게 넘어뜨리기 피해를 줄 때마다, 추가로 자신의 공격력 100%의 물리 피해를 줍니다.",
    },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: LIFENG_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: LIFENG_TALENT_COSTS,
  },
} as const;
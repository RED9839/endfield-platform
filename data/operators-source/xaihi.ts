const slug = "xaihi";

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

const XAIHI_TRUST_BONUS_COSTS = [
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

const XAIHI_TALENT_COSTS = [
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

export const xaihiOperatorDetailData = {
  slug,
  name: "자이히",
  enName: "Xaihi",
  rarity: 5 as const,

  element: "cryo" as const,
  class: "supporter" as const,
  weaponType: "아츠 유닛",

  mainStatLabel: "의지",
  subStatLabel: "지능",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [9, 26, 44, 62, 80, 89],
      dex: [9, 26, 45, 64, 82, 91],
      int: [15, 39, 64, 89, 114, 127],
      will: [15, 43, 74, 104, 134, 150],
      atk: [30, 86, 144, 203, 262, 291],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        9, 10, 11, 12, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 40, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 49, 50, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 59, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 69, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 88, 89,
      ],

      dex: [
        9, 10, 11, 12, 13, 14, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 26,
        27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
        37, 38, 39, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 50, 51, 52, 52, 53, 54,
        55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
        64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 77, 78, 79, 80, 81, 82,
        82, 83, 84, 85, 86, 87, 88, 89, 90, 90,
        91,
      ],

      int: [
        15, 17, 18, 19, 20, 22, 23, 24, 25, 27,
        28, 29, 30, 32, 33, 34, 35, 37, 38, 39,
        40, 42, 43, 44, 45, 47, 48, 49, 50, 52,
        53, 54, 55, 57, 58, 59, 60, 62, 63, 64,
        65, 67, 68, 69, 70, 72, 73, 74, 75, 77,
        78, 79, 80, 82, 83, 84, 85, 87, 88, 89,
        90, 92, 93, 94, 95, 97, 98, 99, 100, 102,
        103, 104, 105, 107, 108, 109, 110, 112, 113, 114,
        115, 117, 118, 119, 120, 122, 123, 124, 125, 127,
      ],

      will: [
        15, 16, 18, 19, 21, 22, 24, 25, 27, 28,
        30, 31, 33, 34, 36, 37, 39, 40, 42, 43,
        45, 46, 48, 50, 51, 53, 54, 56, 57, 59,
        60, 62, 63, 65, 66, 68, 69, 71, 72, 74,
        75, 77, 78, 80, 81, 83, 84, 86, 87, 89,
        90, 92, 93, 95, 96, 98, 100, 101, 103, 104,
        106, 107, 109, 110, 112, 113, 115, 116, 118, 119,
        121, 122, 124, 125, 127, 128, 130, 131, 133, 134,
        136, 137, 139, 140, 142, 143, 145, 147, 148, 150,
      ],

      atk: [
        30, 33, 36, 39, 42, 45, 48, 51, 53, 56,
        59, 62, 65, 68, 71, 74, 77, 80, 83, 86,
        89, 92, 95, 97, 100, 103, 106, 109, 112, 115,
        118, 121, 124, 127, 130, 133, 136, 139, 141, 144,
        147, 150, 153, 156, 159, 162, 165, 168, 171, 174,
        177, 180, 183, 185, 188, 191, 194, 197, 200, 203,
        206, 209, 212, 215, 218, 221, 224, 227, 230, 232,
        235, 238, 241, 244, 247, 250, 253, 256, 259, 262,
        265, 268, 271, 274, 276, 279, 282, 285, 288, 291,
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

  talents: [
    {
      name: "가동 프로세스",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "연계 스킬 스트레스 테스트가 적에게 명중했을 때, 목표가 냉기 부착 혹은 동결 상태일 경우, 받는 냉기 피해 +7%, 5초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "가동 프로세스",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "연계 스킬 스트레스 테스트가 적에게 명중했을 때, 목표가 냉기 부착 혹은 동결 상태일 경우, 받는 냉기 피해 +10%, 5초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "프리징 프로토콜",
      unlock: "Promote to E3 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "궁극기 스택 오버플로는 추가로 팀 전체의 냉기 부착과 동결 상태를 정화합니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "애자일 엑스큐션",
      description: "지원 결정체가 제공하는 아츠 증폭이 추가로 5% 증가합니다.",
    },
    {
      title: "2",
      subtitle: "링크 어그리게이션",
      description: "궁극기 스택 오버플로의 사용에 필요한 궁극기 에너지 -10%",
    },
    {
      title: "3",
      subtitle: "노드 매핑",
      description: "연계 스킬 스트레스 테스트가 목표에 명중했을 때, 주변의 다른 목표 하나에 1회 튕깁니다.",
    },
    {
      title: "4",
      subtitle: "그레이스케일 릴리스",
      description: "지능 +15, 치유 효율 +10%",
    },
    {
      title: "5",
      subtitle: "리커전 컨트롤",
      description: "궁극기 스택 오버플로가 제공하는 증폭 효과가 기존의 1.1배로 증가합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "쿨타임",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 냉기 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 15포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 냉기 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 냉기 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["15%", "17%", "18%", "20%", "21%", "23%", "24%", "26%", "27%", "29%", "31%", "34%"] },
        { label: "일반 공격 제2단계 배율", values: ["16%", "18%", "19%", "21%", "22%", "24%", "26%", "27%", "29%", "31%", "33%", "36%"] },
        { label: "일반 공격 제3단계 배율", values: ["21%", "23%", "25%", "27%", "29%", "32%", "34%", "36%", "38%", "40%", "44%", "47%"] },
        { label: "일반 공격 제4단계 배율", values: ["33%", "36%", "40%", "43%", "46%", "50%", "53%", "56%", "59%", "64%", "68%", "74%"] },
        { label: "일반 공격 제5단계 배율", values: ["55%", "61%", "66%", "72%", "77%", "83%", "88%", "94%", "99%", "106%", "114%", "124%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "디도스",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "지원 결정체를 소환하여 일정 시간 메인 컨트롤 오퍼레이터를 따라다닙니다.",
        "메인 컨트롤 오퍼레이터가 적에게 강력한 일격 피해를 준 후, 지원 결정체가 생명력을 회복시켜 줍니다. 해당 효과는 최대 2회 발동하며, 의지는 치유량을 추가로 증가시킵니다.",
        "만약 회복 효과가 발동했을 때, 메인 컨트롤 오퍼레이터의 생명력이 최대치에 도달한 상태라면, 일정 시간 대상에게 아츠 증폭을 부여합니다. 해당 효과는 중첩되지 않습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "기초 치유 수치", values: ["144", "173", "202", "230", "245", "259", "274", "288", "302", "310", "317", "324"] },
        { label: "의지 1포인트마다 증가하는 치유 수치", values: ["0.34", "0.4", "0.47", "0.54", "0.57", "0.6", "0.64", "0.67", "0.71", "0.72", "0.74", "0.76"] },
        { label: "지원 결정체 지속 시간(초)", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
        { label: "아츠 증폭 효과", values: ["9%", "9%", "9%", "9%", "9%", "11%", "11%", "11%", "13%", "13%", "13%", "15%"] },
        { label: "아츠 증폭 지속 시간(초)", values: ["25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25"] },
      ],
    },

    comboSkill: {
      name: "스트레스 테스트",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "지원 결정체의 생명력 회복 횟수를 모두 소모했을 때 사용할 수 있습니다.",
        "짧게 차지하여 지원 결정체를 적에게 투척해 냉기 피해를 주고 냉기 부착 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["8s", "8s", "8s", "8s", "8s", "8s", "8s", "8s", "8s", "8s", "8s", "7s"] },
        { label: "피해 배율", values: ["200%", "220%", "240%", "260%", "280%", "300%", "320%", "340%", "360%", "385%", "415%", "450%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "스택 오버플로",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "20초" },
      ],
      description: [
        "팀 전체에게 일정 시간 냉기 증폭과 자연 증폭 상태를 부여합니다. 지능은 해당 증폭 효과를 추가로 강화시킵니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80"] },
        { label: "기초 냉기 증폭 효과", values: ["11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "21%", "22%", "24%"] },
        { label: "기초 자연 증폭 효과", values: ["11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "21%", "22%", "24%"] },
        { label: "지능 1포인트마다 증가하는 증폭 효과", values: ["0.014%", "0.015%", "0.016%", "0.018%", "0.019%", "0.02%", "0.022%", "0.023%", "0.024%", "0.026%", "0.028%", "0.03%"] },
        { label: "지능 증가 증폭 최대치", values: ["30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "30%", "36%"] },
        { label: "지속 시간(초)", values: ["12", "12", "12", "12", "12", "12", "12", "12", "12", "12", "12", "12"] },
      ],
    },
  },

  infrastructureSkills: [
    {
      name: "표준화 컴파일",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 10% 증가",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 20% 증가",
        },
      ],
    },
    {
      name: "대화와 속삭임",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 5 - 고요한 수도회를 수집할 확률 약간 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 5 - 고요한 수도회를 수집할 확률 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
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
    trustBonus: XAIHI_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: XAIHI_TALENT_COSTS,
  },
} as const;
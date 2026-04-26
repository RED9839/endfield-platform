const slug = "tangtang";

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
      { name: "정합용 유체", count: 6, icon: "/materials/정합용 유체.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 16, icon: "/materials/정합용 유체.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 36, icon: "/materials/정합용 유체.webp" },
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

const TANGTANG_TRUST_BONUS_COSTS = [
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

const TANGTANG_TALENT_COSTS = [
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

export const tangtangOperatorDetailData = {
  slug,
  name: "탕탕",
  enName: "Tangtang",
  rarity: 6 as const,

  element: "cryo" as const,
  class: "caster" as const,
  weaponType: "권총",

  mainStatLabel: "민첩",
  subStatLabel: "힘",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [13, 37, 61, 86, 111, 123],
      dex: [23, 56, 91, 126, 162, 179],
      int: [8, 25, 42, 59, 77, 85],
      will: [10, 29, 50, 71, 91, 102],
      atk: [30, 92, 157, 223, 288, 321],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        13, 14, 16, 17, 18, 19, 21, 22, 23, 24,
        25, 27, 28, 29, 30, 32, 33, 34, 35, 37,
        38, 39, 40, 42, 43, 44, 45, 46, 48, 49,
        50, 51, 53, 54, 55, 56, 58, 59, 60, 61,
        63, 64, 65, 66, 67, 69, 70, 71, 72, 74,
        75, 76, 77, 79, 80, 81, 82, 84, 85, 86,
        87, 88, 90, 91, 92, 93, 95, 96, 97, 98,
        100, 101, 102, 103, 105, 106, 107, 108, 110, 111,
        112, 113, 114, 116, 117, 118, 119, 121, 122, 123,
      ],

      dex: [
        23, 25, 27, 28, 30, 32, 34, 35, 37, 39,
        41, 42, 44, 46, 48, 49, 51, 53, 55, 56,
        58, 60, 62, 63, 65, 67, 69, 70, 72, 74,
        76, 77, 79, 81, 83, 84, 86, 88, 90, 91,
        93, 95, 97, 98, 100, 102, 104, 105, 107, 109,
        111, 112, 114, 116, 118, 119, 121, 123, 125, 126,
        128, 130, 132, 134, 135, 137, 139, 141, 142, 144,
        146, 148, 149, 151, 153, 155, 156, 158, 160, 162,
        163, 165, 167, 169, 170, 172, 174, 176, 177, 179,
      ],

      int: [
        8, 9, 10, 11, 12, 13, 14, 14, 15, 16,
        17, 18, 19, 20, 20, 21, 22, 23, 24, 25,
        26, 27, 27, 28, 29, 30, 31, 32, 33, 33,
        34, 35, 36, 37, 38, 39, 39, 40, 41, 42,
        43, 44, 45, 46, 46, 47, 48, 49, 50, 51,
        52, 52, 53, 54, 55, 56, 57, 58, 58, 59,
        60, 61, 62, 63, 64, 65, 65, 66, 67, 68,
        69, 70, 71, 71, 72, 73, 74, 75, 76, 77,
        78, 79, 80, 81, 82, 83, 84, 84, 85, 85,
      ],

      will: [
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
        82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
        92, 93, 94, 95, 96, 97, 98, 100, 101, 102,
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

  skills: {
    normalAttack: {
      name: "정신 똑바로 차려!",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 냉기 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 18포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 냉기 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 냉기 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["23%", "25%", "27%", "29%", "32%", "34%", "36%", "39%", "41%", "44%", "47%", "51%"] },
        { label: "일반 공격 제2단계 배율", values: ["25%", "28%", "30%", "33%", "35%", "38%", "40%", "43%", "45%", "48%", "52%", "56%"] },
        { label: "일반 공격 제3단계 배율", values: ["35%", "39%", "42%", "46%", "49%", "53%", "56%", "60%", "63%", "67%", "73%", "79%"] },
        { label: "일반 공격 제4단계 배율", values: ["37%", "40%", "44%", "47%", "51%", "55%", "58%", "62%", "66%", "70%", "76%", "82%"] },
        { label: "일반 공격 제5단계 배율", values: ["50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "96%", "104%", "113%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "우당탕탕 파도!",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "물속에서 뛰어올라 적에게 근접하여 사격하며 냉기 피해를 주고, 용오름을 생성합니다.",
        "동시에 근처의 모든 와류를 소모하여 추가로 용오름을 생성하고, 생성된 개수에 따라 일정량의 스킬 게이지를 반환합니다.",
        "용오름: 범위 내의 적에게 냉기 부착 1스택을 부여하고, 지속적으로 냉기 피해를 줍니다. 만약 여러 개의 용오름이 생성됐다면 적에게 추가로 아츠 취약을 부여하지만, 냉기 부착이 중복으로 부여되진 않습니다.",
        "용오름이 주는 피해는 배틀 스킬의 피해로 간주됩니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "사격 피해 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
        { label: "사격 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "단일 용오름 피해 배율", values: ["133%", "147%", "160%", "174%", "187%", "200%", "214%", "227%", "240%", "257%", "277%", "300%"] },
        { label: "용오름 지속 시간(초)", values: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"] },
        { label: "와류마다 스킬 게이지 반환", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
        { label: "용오름 2개일 시 부여하는 아츠 취약", values: ["3%", "3%", "3%", "3.5%", "3.5%", "3.5%", "4%", "4%", "4%", "4.5%", "4.5%", "5%"] },
        { label: "용오름 3개일 시 부여하는 아츠 취약", values: ["6%", "6%", "6%", "7%", "7%", "7%", "8%", "8%", "8%", "9%", "9%", "10%"] },
        { label: "아츠 취약 지속 시간(초)", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
      ],
    },

    comboSkill: {
      name: "야, 강물! 도와줘!",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적이 냉기 부착을 부여받았거나 아츠 폭발 피해를 받았을 때 발동할 수 있습니다.",
        "강력한 물줄기를 방출해 전방의 적을 관통하며 냉기 피해를 주고, 와류 하나를 생성합니다.",
        "필드에는 최대 두 개의 와류만 존재할 수 있습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["14s", "14s", "14s", "14s", "14s", "14s", "14s", "14s", "13s", "13s", "13s", "12s"] },
        { label: "피해 배율", values: ["107%", "117%", "128%", "139%", "149%", "160%", "171%", "181%", "192%", "205%", "221%", "240%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "와류 지속 시간(초)", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
      ],
    },

    ultimate: {
      name: "대당가께서 지켜보고 계신다!",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "20s" },
      ],
      description: [
        "탕탕이 안대를 벗어 던지고 눈 속에 깃든 고대의 진을 발동합니다. 범위 내의 적은 일정 시간 동안 움직일 수 없으며, 지속적으로 냉기 피해를 받습니다.",
        "고대의 진은 나타난 직후부터 서서히 변화를 시작해 변화가 끝날 때 거대한 파도를 일으키고 범위 내의 적에게 대량의 냉기 피해를 줍니다.",
        "메인 컨트롤 오퍼레이터가 고대의 진 내에서 낙하 공격을 사용하면, 변화하던 고대의 진이 그 변화를 중단합니다. 이어서 거대한 파도를 일으키고, 이때 파도가 주는 냉기 피해가 증가합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90"] },
        { label: "지속 피해 총 배율", values: ["142%", "156%", "171%", "185%", "199%", "213%", "228%", "242%", "256%", "274%", "295%", "320%"] },
        { label: "고대의 진 지속 시간(초)", values: ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4"] },
        { label: "거대한 파도 피해 배율", values: ["178%", "196%", "213%", "231%", "249%", "267%", "284%", "302%", "320%", "342%", "369%", "400%"] },
        { label: "미리 소환된 거대한 파도 피해 배율", values: ["311%", "342%", "373%", "404%", "436%", "467%", "498%", "529%", "560%", "599%", "646%", "700%"] },
        { label: "거대한 파도의 불균형치", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
        { label: "미리 소환된 거대한 파도의 불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "무한한 재보",
      description:
        "연계 스킬 야, 강물! 도와줘!의 피해 배율이 기존의 1.2배로 증가하며, 쿨타임 -2초. 배틀 스킬 우당탕탕 파도!로 와류 한 곳을 소모하여 용오름이 생성될 때마다, 추가로 스킬 게이지 5포인트를 반환합니다.",
    },
    {
      title: "2",
      subtitle: "강에서 태어난 소녀",
      description: "민첩 +20, 냉기 피해 +10%.",
    },
    {
      title: "3",
      subtitle: "대당가의 기백",
      description:
        "배틀 스킬 우당탕탕 파도!의 피해 배율이 기존의 1.1배로 증가하며, 동시에 여러 개의 용오름이 생성될 때 부여하는 아츠 취약 효과가 추가로 +5%.",
    },
    {
      title: "4",
      subtitle: "청파 수련법",
      description: "궁극기 대당가께서 지켜보고 계신다!의 사용에 필요한 궁극기 에너지 -15%.",
    },
    {
      title: "5",
      subtitle: "마안의 권능",
      description:
        "궁극기 대당가께서 지켜보고 계신다!의 피해 배율이 기존의 1.15배로 증가합니다. 재능 풍랑의 주재자 효과 강화: 궁극기 대당가께서 지켜보고 계신다!로 생성된 용오름의 피해 증가 효과 추가로 +80%.",
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
      name: "대당가",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "재배실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "재배실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
        },
      ],
    },
    {
      name: "강에서 태어난 소녀",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "재배실에 배치 시, 결정화 식물 재료의 육성 속도 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "재배실에 배치 시, 결정화 식물 재료의 육성 속도 30% 증가",
        },
      ],
    },
  ],

  talents: [
    {
      name: "의기투합",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "와류 주변 5미터 범위 내, 아군 오퍼레이터는 10% 가속을 획득하고, 적은 20% 감속을 받습니다. 범위를 벗어난 뒤에도 해당 효과는 3초 동안 지속됩니다.",
    },
    {
      name: "의기투합",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "와류 주변 5미터 범위 내, 아군 오퍼레이터는 20% 가속을 획득하고, 적은 40% 감속을 받습니다. 범위를 벗어난 뒤에도 해당 효과는 3초 동안 지속됩니다.",
    },
    {
      name: "풍랑의 주재자",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "메인 컨트롤 오퍼레이터가 고대의 진 내에서 낙하 공격을 사용하면, 변화하던 고대의 진이 그 변화를 중단합니다. 이어서 용오름 1개를 생성하며, 주변에 와류가 존재할 경우 이를 소모하여 추가로 용오름을 생성합니다.\n\n이때 생성한 용오름은 배틀 스킬 우당탕탕 파도!와 동일한 효과를 가지고 있으며, 주는 피해 +40%.",
    },
    {
      name: "풍랑의 주재자",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "메인 컨트롤 오퍼레이터가 고대의 진 내에서 낙하 공격을 사용하면, 변화하던 고대의 진이 그 변화를 중단합니다. 이어서 용오름 1개를 생성하며, 주변에 와류가 존재할 경우 이를 소모하여 추가로 용오름을 생성합니다.\n\n이때 생성한 용오름은 배틀 스킬 우당탕탕 파도!와 동일한 효과를 가지고 있으며, 주는 피해 +60%.",
    },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: TANGTANG_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: TANGTANG_TALENT_COSTS,
  },
} as const;